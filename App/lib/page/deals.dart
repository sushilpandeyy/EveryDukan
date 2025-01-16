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
  // Constants
  static const int _itemsPerPage = 10;
  static const double _cardSpacing = 16.0;
  static const double _imageDimension = 200.0;
  
  // Analytics Event Constants
  static const String EVENT_DEAL_PAGE_VIEW = 'deal_page_view';
  static const String EVENT_DEAL_CLICK = 'deal_click';
  static const String EVENT_DEAL_SHARE = 'deal_share';
  static const String EVENT_SHOP_NOW = 'shop_now_click';
  static const String EVENT_PAGE_REFRESH = 'deals_page_refresh';
  static const String EVENT_ERROR_OCCURRED = 'deals_error';
  static const String EVENT_LOAD_MORE = 'load_more_deals';

  // State Variables
  int _currentIndex = 1;
  final List<DealCard> _deals = [];
  bool _isLoading = false;
  bool _hasNextPage = true;
  final ScrollController _scrollController = ScrollController();
  int _currentPage = 1;
  bool _isInitialLoading = true;
  late final FirebaseAnalytics analytics;

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

  // Analytics Methods
  Future<void> _initializeAnalytics() async {
    try {
      await Firebase.initializeApp();
      analytics = FirebaseAnalytics.instance;
      
      await Future.wait([
        analytics.logScreenView(
          screenName: 'DealsPage',
          screenClass: 'DealsPage',
        ),
        analytics.setUserProperty(
          name: 'last_viewed_screen',
          value: 'deals',
        ),
        analytics.logEvent(
          name: EVENT_DEAL_PAGE_VIEW,
          parameters: {
            'timestamp': DateTime.now().toIso8601String(),
            'is_first_load': true,
          },
        ),
      ]);
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

  // Scroll Handling
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

  // Data Loading Methods
  Future<void> _loadMoreDeals() async {
    if (_isLoading || !_hasNextPage) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final deals = await _fetchDeals();
      
      if (mounted) {
        setState(() {
          _deals.addAll(deals);
          _currentPage++;
          _isLoading = false;
          _isInitialLoading = false;
        });
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

  Future<List<DealCard>> _fetchDeals() async {
    // Try cache first
    final cachedData = await DealsCacheManager.getCachedDealsData(_currentPage);
    if (cachedData != null) {
      return _processDealData(cachedData, 'cache');
    }

    // Fetch from API if cache miss
    final response = await http.get(
      Uri.parse('https://19ax8udl06.execute-api.ap-south-1.amazonaws.com/deals?page=$_currentPage&limit=$_itemsPerPage'),
    );

    if (response.statusCode == 200) {
      await DealsCacheManager.cacheDealsData(_currentPage, response.body);
      final data = json.decode(response.body);
      return _processDealData(data, 'api');
    } else {
      throw Exception('Failed to load deals');
    }
  }

  Future<List<DealCard>> _processDealData(dynamic data, String source) async {
    final deals = data['Deal'] as List;
    final pagination = data['pagination'];
    
    _hasNextPage = pagination['hasNextPage'];

    final newDeals = deals.map((deal) => DealCard(
      imageUrl: deal['imageUrl'],
      title: deal['title'],
      subtitle: deal['subtitle'],
      originalPrice: deal['originalPrice'].toDouble(),
      discountedPrice: deal['discountedPrice'].toDouble(),
      shopUrl: deal['shopUrl'],
      saleEndDate: deal['endDate'] != null ? DateTime.parse(deal['endDate']) : null,
    )).toList();

    await _logAnalyticsEvent('deals_data_loaded', {
      'source': source,
      'page': _currentPage,
      'deal_count': newDeals.length,
      if (source == 'api') 'response_time': DateTime.now().millisecondsSinceEpoch,
    });

    return newDeals;
  }

  Future<void> refreshDeals() async {
    try {
      await _logAnalyticsEvent(EVENT_PAGE_REFRESH, {
        'previous_deal_count': _deals.length,
      });
      
      await DealsCacheManager.clearCache();
      setState(() {
        _currentPage = 1;
        _deals.clear();
        _hasNextPage = true;
      });
      await _loadMoreDeals();
    } catch (e) {
      debugPrint('Error refreshing deals: $e');
    }
  }

  // Action Handlers
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
    
    final shareText = _generateShareText(deal);
    await Share.share(shareText, subject: 'EveryDukan - Your Deal Discovery App');
  }

  String _generateShareText(DealCard deal) {
    return """🔥 Deal Alert via EveryDukan! 🔥

${deal.title}
${deal.subtitle}

🛒 Shop now: ${deal.shopUrl}

Brought to you by EveryDukan – India's ultimate deal discovery app! 🎉

[https://play.google.com/store/apps/details?id=com.everydukan]

#EveryDukan #DealSealed""";
  }

  Future<void> _launchURL(String url) async {
    try {
      String cleanUrl = url.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://$cleanUrl';
      }

      final uri = Uri.parse(cleanUrl);
      
      // Try to launch in external app first
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

      // Fallback to default browser
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

  // UI Building Methods
  Widget _buildDealCard(DealCard deal) {
    return Container(
      margin: const EdgeInsets.only(bottom: _cardSpacing),
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
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _handleShopNow(deal),
          borderRadius: BorderRadius.circular(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildImageSection(deal),
              _buildContentSection(deal),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildImageSection(DealCard deal) {
    return Stack(
      children: [
        Hero(
          tag: 'deal_image_${deal.shopUrl}',
          child: ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            child: Container(
              height: _imageDimension,
              width: double.infinity,
              color: Colors.grey[50],
              child: Image.network(
                deal.imageUrl,
                fit: BoxFit.contain,
                loadingBuilder: _imageLoadingBuilder,
                errorBuilder: _imageErrorBuilder,
              ),
            ),
          ),
        ),
        _buildDiscountBadge(deal),
        if (deal.saleEndDate != null)
          Positioned(
            bottom: 12,
            left: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.7),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.access_time_rounded,
                    size: 14,
                    color: Colors.amber[400],
                  ),
                  const SizedBox(width: 4),
                  Text(
                    _formatSaleEndDate(deal.saleEndDate!),
                    style: TextStyle(
                      color: Colors.amber[50],
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildDiscountBadge(DealCard deal) {
    final discount = _calculateDiscount(deal.originalPrice, deal.discountedPrice);
    return Positioned(
      top: 12,
      right: 12,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.red[600],
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              spreadRadius: 1,
              blurRadius: 2,
              offset: const Offset(0, 1),
            ),
          ],
        ),
        child: Text(
          '$discount% OFF',
          style: const TextStyle(
            color: Colors.white,
            fontSize: 12,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget _buildContentSection(DealCard deal) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            deal.title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 8),
          Text(
            deal.subtitle,
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
              height: 1.3,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 16),
          _buildPriceSection(deal),
          const SizedBox(height: 16),
          _buildActionButtons(deal),
        ],
      ),
    );
  }

  Widget _buildPriceSection(DealCard deal) {
    return Row(
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '₹${deal.discountedPrice.toStringAsFixed(0)}',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.green[700],
              ),
            ),
            const SizedBox(height: 4),
            Text(
              '₹${deal.originalPrice.toStringAsFixed(0)}',
              style: TextStyle(
                fontSize: 14,
                decoration: TextDecoration.lineThrough,
                color: Colors.grey[500],
              ),
            ),
          ],
        ),
        const Spacer(),
        IconButton(
          onPressed: () => _handleShare(deal),
          icon: const Icon(Icons.share_outlined),
          style: IconButton.styleFrom(
            backgroundColor: Colors.grey[100],
            padding: const EdgeInsets.all(12),
          ),
        ),
      ],
    );
  }

  Widget _buildActionButtons(DealCard deal) {
    return SizedBox(
      width: double.infinity,
      height: 48,
      child: ElevatedButton(
        onPressed: () => _handleShopNow(deal),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.amber[700],
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 0,
        ),
        child: const Text(
          'Shop Now',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget _imageLoadingBuilder(BuildContext context, Widget child, ImageChunkEvent? loadingProgress) {
    if (loadingProgress == null) return child;
    return Center(
      child: CircularProgressIndicator(
        value: loadingProgress.expectedTotalBytes != null
            ? loadingProgress.cumulativeBytesLoaded / loadingProgress.expectedTotalBytes!
            : null,
        strokeWidth: 2,
        color: Colors.amber[700],
      ),
    );
  }

  Widget _imageErrorBuilder(BuildContext context, Object error, StackTrace? stackTrace) {
    return Center(
      child: Icon(
        Icons.error_outline,
        size: 32,
        color: Colors.grey[400],
      ),
    );
  }

  Widget _buildSkeletonLoading() {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      itemCount: 3,
      itemBuilder: (context, index) => _DealCardSkeleton(),
    );
  }

  // Helper Methods
  String _formatSaleEndDate(DateTime endDate) {
    final now = DateTime.now();
    final difference = endDate.difference(now);
    
    if (difference.inDays > 0) {
      return '${difference.inDays}d left';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h left';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m left';
    } else {
      return 'Ending soon';
    }
  }

  int _calculateDiscount(double originalPrice, double discountedPrice) {
    return ((originalPrice - discountedPrice) / originalPrice * 100).round();
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
                    onRefresh: refreshDeals,
                    child: ListView.builder(
                      controller: _scrollController,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      itemCount: _deals.length + (_hasNextPage ? 1 : (!_hasNextPage && _deals.isNotEmpty ? 2 : 0)),
                      itemBuilder: (context, index) {
                        if (index == _deals.length) {
                          if (_isLoading) {
                            return const Center(
                              child: Padding(
                                padding: EdgeInsets.all(16.0),
                                child: CircularProgressIndicator(),
                              ),
                            );
                          }
                          
                          if (!_hasNextPage && _deals.isNotEmpty) {
                            return Padding(
                              padding: const EdgeInsets.symmetric(vertical: 16.0),
                              child: Center(
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                  decoration: BoxDecoration(
                                    color: Colors.grey[100],
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    'No more deals available',
                                    style: TextStyle(
                                      color: Colors.grey[600],
                                      fontSize: 14,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                              ),
                            );
                          }
                          return const SizedBox.shrink();
                        }

                        if (index >= _deals.length) {
                          return const SizedBox.shrink();
                        }

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
}

class _DealCardSkeleton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
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
              height: 200,
              width: double.infinity,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(
                  top: Radius.circular(16),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    height: 20,
                    width: double.infinity,
                    color: Colors.white,
                  ),
                  const SizedBox(height: 8),
                  Container(
                    height: 16,
                    width: double.infinity,
                    color: Colors.white,
                  ),
                  const SizedBox(height: 4),
                  Container(
                    height: 16,
                    width: 200,
                    color: Colors.white,
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            height: 24,
                            width: 80,
                            color: Colors.white,
                          ),
                          const SizedBox(height: 4),
                          Container(
                            height: 16,
                            width: 60,
                            color: Colors.white,
                          ),
                        ],
                      ),
                      const Spacer(),
                      Container(
                        height: 40,
                        width: 40,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Container(
                    height: 48,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ],
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
  final DateTime? saleEndDate;

  DealCard({
    required this.imageUrl,
    required this.title,
    required this.subtitle,
    required this.originalPrice,
    required this.discountedPrice,
    required this.shopUrl,
    this.saleEndDate,
  });
}