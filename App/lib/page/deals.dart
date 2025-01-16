import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../component/header.dart';
import '../component/sidebar.dart';
import 'package:shimmer/shimmer.dart';
import '../component/bottom.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_core/firebase_core.dart';
import '../services/cache.dart';

class DealsPage extends StatefulWidget {
  const DealsPage({super.key});

  @override
  State<DealsPage> createState() => _DealsPageState();
}

class _DealsPageState extends State<DealsPage> {
  int _currentIndex = 1;
  final List<DealCard> _deals = [];
  bool _isLoading = false;
  bool _hasNextPage = true;
  final ScrollController _scrollController = ScrollController();
  int _currentPage = 1;
  bool _isInitialLoading = true;
  late final FirebaseAnalytics analytics;
  
  static const String EVENT_DEAL_PAGE_VIEW = 'deal_page_view';
  static const String EVENT_DEAL_CLICK = 'deal_click';
  static const String EVENT_DEAL_SHARE = 'deal_share';
  static const String EVENT_SHOP_NOW = 'shop_now_click';
  static const String EVENT_PAGE_REFRESH = 'deals_page_refresh';
  static const String EVENT_ERROR_OCCURRED = 'deals_error';
  static const String EVENT_LOAD_MORE = 'load_more_deals';

  Future<void> _initializeAnalytics() async {
    try {
      await Firebase.initializeApp();
      analytics = FirebaseAnalytics.instance;
      
      await analytics.logScreenView(
        screenName: 'DealsPage',
        screenClass: 'DealsPage',
      );
      
      await analytics.setUserProperty(
        name: 'last_viewed_screen',
        value: 'deals',
      );
      
      await analytics.logEvent(
        name: EVENT_DEAL_PAGE_VIEW,
        parameters: {
          'timestamp': DateTime.now().toIso8601String(),
          'is_first_load': true,
        },
      );
    } catch (e) {
      debugPrint('Failed to initialize Firebase Analytics: $e');
    }
  }

  Future<void> _logAnalyticsEvent(String eventName, Map<String, dynamic> parameters) async {
    try {
      await analytics.logEvent(
        name: eventName,
        parameters: {
          'timestamp': DateTime.now().toIso8601String(),
          ...parameters,
        },
      );
    } catch (e) {
      debugPrint('Failed to log analytics event: $e');
    }
  }

  @override
  void initState() {
    super.initState();
    _initializeAnalytics();
    _loadMoreDeals();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      if (_hasNextPage && !_isLoading) {
        _logAnalyticsEvent(EVENT_LOAD_MORE, {
          'page_number': _currentPage,
          'current_deal_count': _deals.length,
        });
        _loadMoreDeals();
      }
    }
  }

  Future<void> _loadMoreDeals() async {
    if (_isLoading || !_hasNextPage) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final cachedData = await DealsCacheManager.getCachedDealsData(_currentPage);
      if (cachedData != null) {
        final deals = cachedData['Deal'] as List;
        final pagination = cachedData['pagination'];

        final newDeals = deals.map((deal) => DealCard(
          imageUrl: deal['imageUrl'],
          title: deal['title'],
          subtitle: deal['subtitle'],
          originalPrice: deal['originalPrice'].toDouble(),
          discountedPrice: deal['discountedPrice'].toDouble(),
          shopUrl: deal['shopUrl'],
        )).toList();

        await _logAnalyticsEvent('deals_data_loaded', {
          'source': 'cache',
          'page': _currentPage,
          'deal_count': newDeals.length,
        });

        if (mounted) {
          setState(() {
            _deals.addAll(newDeals);
            _currentPage++;
            _hasNextPage = pagination['hasNextPage'];
            _isLoading = false;
            _isInitialLoading = false;
          });
        }
        return;
      }

      final response = await http.get(
        Uri.parse('https://19ax8udl06.execute-api.ap-south-1.amazonaws.com/deals?page=$_currentPage&limit=10'),
      );

      if (response.statusCode == 200) {
        await DealsCacheManager.cacheDealsData(_currentPage, response.body);
        
        final data = json.decode(response.body);
        final deals = data['Deal'] as List;
        final pagination = data['pagination'];

        final newDeals = deals.map((deal) => DealCard(
          imageUrl: deal['imageUrl'],
          title: deal['title'],
          subtitle: deal['subtitle'],
          originalPrice: deal['originalPrice'].toDouble(),
          discountedPrice: deal['discountedPrice'].toDouble(),
          shopUrl: deal['shopUrl'],
        )).toList();

        await _logAnalyticsEvent('deals_data_loaded', {
          'source': 'api',
          'page': _currentPage,
          'deal_count': newDeals.length,
          'response_time': DateTime.now().millisecondsSinceEpoch,
        });

        if (mounted) {
          setState(() {
            _deals.addAll(newDeals);
            _currentPage++;
            _hasNextPage = pagination['hasNextPage'];
            _isLoading = false;
            _isInitialLoading = false;
          });
        }
      } else {
        throw Exception('Failed to load deals');
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _isInitialLoading = false;
        });
      }
      
      await _logAnalyticsEvent(EVENT_ERROR_OCCURRED, {
        'error_type': 'data_fetch_error',
        'error_message': e.toString(),
        'page': _currentPage,
      });
      
      debugPrint('Error fetching deals: $e');
    }
  }

  Future<void> refreshDeals() async {
    try {
      await _logAnalyticsEvent(EVENT_PAGE_REFRESH, {
        'previous_deal_count': _deals.length,
      });
      
      await DealsCacheManager.clearCache();
      _currentPage = 1;
      _deals.clear();
      _hasNextPage = true;
      await _loadMoreDeals();
    } catch (e) {
      debugPrint('Error refreshing deals: $e');
    }
  }

  void _onTabTapped(int index) {
    _logAnalyticsEvent('navigation_change', {
      'from_index': _currentIndex,
      'to_index': index,
    });
    setState(() {
      _currentIndex = index;
    });
  }

  Future<void> _handleShopNow(DealCard deal) async {
    await _logAnalyticsEvent(EVENT_SHOP_NOW, {
      'deal_title': deal.title,
      'deal_price': deal.discountedPrice,
      'original_price': deal.originalPrice,
      'discount_percentage': _calculateDiscount(deal.originalPrice, deal.discountedPrice),
      'shop_url': deal.shopUrl,
    });
    
    await _launchURL(deal.shopUrl);
  }

  Future<void> _handleShare(DealCard deal) async {
    await _logAnalyticsEvent(EVENT_DEAL_SHARE, {
      'deal_title': deal.title,
      'deal_price': deal.discountedPrice,
      'discount_percentage': _calculateDiscount(deal.originalPrice, deal.discountedPrice),
    });
    
    final shareText = '${deal.title}\n${deal.subtitle}\nShop now: ${deal.shopUrl}';
    await Share.share(shareText);
  }

  Future<void> _launchURL(String url) async {
    try {
      String cleanUrl = url.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://$cleanUrl';
      }

      final uri = Uri.parse(cleanUrl);
      
      try {
        final launched = await launchUrl(
          uri,
          mode: LaunchMode.externalNonBrowserApplication,
        );
        
        if (launched) {
          await _logAnalyticsEvent('url_launch_success', {
            'url': cleanUrl,
            'launch_type': 'chrome',
          });
          return;
        }
      } catch (e) {
        debugPrint('Chrome launch error: $e');
      }

      final universalLaunch = await launchUrl(
        uri,
        mode: LaunchMode.platformDefault,
      );
      
      if (universalLaunch) {
        await _logAnalyticsEvent('url_launch_success', {
          'url': cleanUrl,
          'launch_type': 'default_browser',
        });
      } else {
        throw 'Could not launch $cleanUrl';
      }
    } catch (e) {
      await _logAnalyticsEvent('url_launch_error', {
        'error_message': e.toString(),
        'url': url,
      });
      debugPrint('URL launch error: $e');
      rethrow;
    }
  }

  Widget _buildDealCard(DealCard deal) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.15),
            spreadRadius: 2,
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                child: Container(
                  height: 140,
                  width: double.infinity,
                  color: Colors.grey[100],
                  child: Image.network(
                    deal.imageUrl,
                    fit: BoxFit.contain,
                    loadingBuilder: (context, child, loadingProgress) {
                      if (loadingProgress == null) return child;
                      return Center(
                        child: CircularProgressIndicator(
                          value: loadingProgress.expectedTotalBytes != null
                              ? loadingProgress.cumulativeBytesLoaded /
                                  loadingProgress.expectedTotalBytes!
                              : null,
                          strokeWidth: 2,
                        ),
                      );
                    },
                    errorBuilder: (context, error, stackTrace) {
                      return const Center(
                        child: Icon(Icons.error_outline, 
                          size: 32,
                          color: Colors.grey,
                        ),
                      );
                    },
                  ),
                ),
              ),
              Positioned(
                top: 8,
                right: 8,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.red[600],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${_calculateDiscount(deal.originalPrice, deal.discountedPrice)}% OFF',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    deal.title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    deal.subtitle,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                      height: 1.2,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const Spacer(),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        '₹${deal.discountedPrice.toStringAsFixed(0)}',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.green[700],
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        '₹${deal.originalPrice.toStringAsFixed(0)}',
                        style: TextStyle(
                          fontSize: 12,
                          decoration: TextDecoration.lineThrough,
                          color: Colors.grey[500],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        flex: 4,
                        child: ElevatedButton(
                          onPressed: () => _handleShopNow(deal),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.amber[700],
                            foregroundColor: Colors.white,
                            elevation: 0,
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: const Text(
                            'Shop Now',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        flex: 1,
                        child: Container(
                          height: 35,
                          decoration: BoxDecoration(
                            color: Colors.grey[100],
                            borderRadius: BorderRadius.circular(8),
          ),
          child: IconButton(
            icon: const Icon(
              Icons.share_outlined,
              size: 18,
              color: Colors.black87,
            ),
            onPressed: () => _handleShare(deal),
            padding: EdgeInsets.zero,
          ),
        ),
      ),
    ],
  ),
],
)),
),
],
),
);
}

  Widget _buildSkeletonLoading() {
    return GridView.builder(
      padding: const EdgeInsets.all(12),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.65,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: 6,
      itemBuilder: (context, index) => _DealCardSkeleton(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Header(),
      drawer: const SidebarDrawer(),
      body: _isInitialLoading 
          ? _buildSkeletonLoading()
          : Column(
              children: [
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: () async {
                      await _logAnalyticsEvent(EVENT_PAGE_REFRESH, {
                        'current_page': _currentPage,
                        'deal_count': _deals.length,
                      });
                      await refreshDeals();
                    },
                    child: GridView.builder(
                      controller: _scrollController,
                      padding: const EdgeInsets.all(12),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.65,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                      ),
                      itemCount: _deals.length + (_hasNextPage ? 1 : 0),
                      itemBuilder: (context, index) {
                        if (index == _deals.length) {
                          return _isLoading
                              ? const Center(child: CircularProgressIndicator())
                              : const SizedBox.shrink();
                        }

                        // Log impression when deal card is built
                        _logAnalyticsEvent('deal_impression', {
                          'deal_title': _deals[index].title,
                          'deal_price': _deals[index].discountedPrice,
                          'position': index,
                          'page': _currentPage,
                        });

                        return _buildDealCard(_deals[index]);
                      },
                    ),
                  ),
                ),
                if (!_hasNextPage && _deals.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Text(
                      'No more deals available',
                      style: TextStyle(color: Colors.grey[600]),
                    ),
                  ),
              ],
            ),
      bottomNavigationBar: CustomBottomNavigation(
        currentIndex: _currentIndex,
        onTap: (index) {
          _logAnalyticsEvent('navigation_change', {
            'from_index': _currentIndex,
            'to_index': index,
            'screen': 'deals',
          });
          setState(() => _currentIndex = index);
        },
      ),
    );
  }

  int _calculateDiscount(double originalPrice, double discountedPrice) {
    return ((originalPrice - discountedPrice) / originalPrice * 100).round();
  }
}

class _DealCardSkeleton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.15),
              spreadRadius: 2,
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 140,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(
                  top: Radius.circular(16),
                ),
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      height: 16,
                      width: double.infinity,
                      color: Colors.white,
                    ),
                    const SizedBox(height: 8),
                    Container(
                      height: 12,
                      width: double.infinity,
                      color: Colors.white,
                    ),
                    const SizedBox(height: 4),
                    Container(
                      height: 12,
                      width: 150,
                      color: Colors.white,
                    ),
                    const Spacer(),
                    Row(
                      children: [
                        Container(
                          height: 18,
                          width: 60,
                          color: Colors.white,
                        ),
                        const SizedBox(width: 8),
                        Container(
                          height: 14,
                          width: 40,
                          color: Colors.white,
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          flex: 4,
                          child: Container(
                            height: 35,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          flex: 1,
                          child: Container(
                            height: 35,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class DealCard {
  final String imageUrl;
  final String title;
  final String subtitle;
  final double originalPrice;
  final double discountedPrice;
  final String shopUrl;

  DealCard({
    required this.imageUrl,
    required this.title,
    required this.subtitle,
    required this.originalPrice,
    required this.discountedPrice,
    required this.shopUrl,
  });
}