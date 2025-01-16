import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shimmer/shimmer.dart';
import '../component/header.dart';
import '../component/bottom.dart';
import '../component/sidebar.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_core/firebase_core.dart';
import '../services/cache.dart';

class Shop {
  final String id;
  final String title;
  final String logo;
  final String url;
  final List<String> category;

  Shop({
    required this.id,
    required this.title,
    required this.logo,
    required this.url,
    required this.category,
  });

  factory Shop.fromJson(Map<String, dynamic> json) {
    return Shop(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      logo: json['logo'] ?? '',
      url: json['url'] ?? '',
      category: List<String>.from(json['category'] ?? []),
    );
  }
}

class Category {
  final String id;
  final String title;

  Category({required this.id, required this.title});

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
    );
  }
}

class ShopScreen extends StatefulWidget {
  const ShopScreen({Key? key}) : super(key: key);

  @override
  _ShopScreenState createState() => _ShopScreenState();
}

class _ShopScreenState extends State<ShopScreen> {
  final List<Shop> _shops = [];
  final List<Category> _categories = [];
  bool _isLoading = true;
  bool _isLoadingMore = false;
  bool _hasNextPage = true;
  final ScrollController _scrollController = ScrollController();
  int _currentPage = 1;
  int _currentIndex = 2;
  String _selectedCategory = 'All';
  late final FirebaseAnalytics analytics;
  
  static const String EVENT_SHOP_PAGE_VIEW = 'shop_page_view';
  static const String EVENT_SHOP_CLICK = 'shop_click';
  static const String EVENT_CATEGORY_SELECT = 'category_select';
  static const String EVENT_ERROR = 'shop_error';
  static const String EVENT_LOAD_MORE = 'load_more_shops';
  static const String EVENT_REFRESH = 'shop_page_refresh';
  static const String EVENT_URL_LAUNCH = 'shop_url_launch';
  static const String EVENT_NAVIGATION = 'shop_navigation';

  @override
  void initState() {
    super.initState();
    _initializeAnalytics();
    _initialize();
    _scrollController.addListener(_onScroll);
  }

  Future<void> _initializeAnalytics() async {
    try {
      await Firebase.initializeApp();
      analytics = FirebaseAnalytics.instance;
      await analytics.logScreenView(screenName: 'ShopScreen');
      await _logEvent(EVENT_SHOP_PAGE_VIEW, {'initial_load': true});
    } catch (e) {
      debugPrint('Analytics error: $e');
    }
  }

  Future<void> _logEvent(String name, Map<String, dynamic> params) async {
    try {
      await analytics.logEvent(
        name: name,
        parameters: {
          'timestamp': DateTime.now().toIso8601String(),
          ...params,
        },
      );
    } catch (e) {
      debugPrint('Log event error: $e');
    }
  }

  Future<void> _initialize() async {
    await Future.wait([_fetchCategories(), _loadMoreShops()]);
    setState(() => _isLoading = false);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      if (_hasNextPage && !_isLoadingMore) {
        _logEvent(EVENT_LOAD_MORE, {'page': _currentPage});
        _loadMoreShops();
      }
    }
  }

  Future<void> _fetchCategories() async {
    try {
      final cachedData = await CategoryCacheManager.getCachedCategories();
      if (cachedData != null) {
        final categories = cachedData['Category'] as List;
        setState(() {
          _categories.clear();
          _categories.add(Category(id: 'all', title: 'All'));
          _categories.addAll(categories.map((cat) => Category.fromJson(cat)));
        });
        await _logEvent('categories_loaded', {'source': 'cache'});
        return;
      }

      final response = await http.get(
        Uri.parse('https://19ax8udl06.execute-api.ap-south-1.amazonaws.com/category'),
      );

      if (response.statusCode == 200) {
        await CategoryCacheManager.cacheCategories(response.body);
        final data = json.decode(response.body);
        final categories = data['Category'] as List;
        setState(() {
          _categories.clear();
          _categories.add(Category(id: 'all', title: 'All'));
          _categories.addAll(categories.map((cat) => Category.fromJson(cat)));
        });
        await _logEvent('categories_loaded', {'source': 'api'});
      }
    } catch (e) {
      await _logEvent(EVENT_ERROR, {'type': 'category_fetch', 'error': e.toString()});
    }
  }

  Future<void> _loadMoreShops() async {
    if (_isLoadingMore || !_hasNextPage) return;
    setState(() => _isLoadingMore = true);

    try {
      final cachedData = await ShopCacheManager.getCachedShopData(_currentPage);
      if (cachedData != null) {
        final shops = cachedData['Shop'] as List;
        final pagination = cachedData['pagination'];
        setState(() {
          _shops.addAll(shops.map((shop) => Shop.fromJson(shop)));
          _currentPage++;
          _hasNextPage = pagination['hasNextPage'] ?? false;
          _isLoadingMore = false;
        });
        await _logEvent('shops_loaded', {'source': 'cache', 'page': _currentPage});
        return;
      }

      final response = await http.get(
        Uri.parse('https://19ax8udl06.execute-api.ap-south-1.amazonaws.com/getshop?page=$_currentPage'),
      );

      if (response.statusCode == 200) {
        await ShopCacheManager.cacheShopData(_currentPage, response.body);
        final data = json.decode(response.body);
        final shops = data['Shop'] as List;
        final pagination = data['pagination'];
        setState(() {
          _shops.addAll(shops.map((shop) => Shop.fromJson(shop)));
          _currentPage++;
          _hasNextPage = pagination['hasNextPage'] ?? false;
          _isLoadingMore = false;
        });
        await _logEvent('shops_loaded', {'source': 'api', 'page': _currentPage});
      }
    } catch (e) {
      setState(() => _isLoadingMore = false);
      await _logEvent(EVENT_ERROR, {'type': 'shops_fetch', 'error': e.toString()});
    }
  }

  Future<void> _refreshShops() async {
    await _logEvent(EVENT_REFRESH, {'previous_count': _shops.length});
    await ShopCacheManager.clearCache();
    _currentPage = 1;
    _shops.clear();
    _hasNextPage = true;
    await _loadMoreShops();
  }

  Future<void> _handleCategorySelect(Category category) async {
    await _logEvent(EVENT_CATEGORY_SELECT, {
      'category_id': category.id,
      'category_name': category.title
    });
    setState(() => _selectedCategory = category.title);
  }

  Future<void> _handleShopClick(Shop shop) async {
    await _logEvent(EVENT_SHOP_CLICK, {
      'shop_id': shop.id,
      'shop_name': shop.title,
      'categories': shop.category.join(',')
    });
    await _launchUrl(shop.url);
  }

  List<Shop> _getFilteredShops() {
    if (_selectedCategory == 'All') return _shops;
    return _shops.where((shop) => shop.category.contains(_selectedCategory)).toList();
  }

  Future<void> _launchUrl(String url) async {
    try {
      String cleanUrl = url.trim();
      if (!cleanUrl.startsWith('http')) cleanUrl = 'https://$cleanUrl';
      final uri = Uri.parse(cleanUrl);
      
      try {
        final launched = await launchUrl(
          uri,
          mode: LaunchMode.externalNonBrowserApplication,
          webViewConfiguration: const WebViewConfiguration(enableJavaScript: true, enableDomStorage: true),
        );
        if (launched) {
          await _logEvent(EVENT_URL_LAUNCH, {'url': cleanUrl, 'type': 'chrome'});
          return;
        }
      } catch (e) {
        debugPrint('Chrome launch failed: $e');
      }

      final fallbackLaunched = await launchUrl(uri, mode: LaunchMode.externalApplication);
      if (fallbackLaunched) {
        await _logEvent(EVENT_URL_LAUNCH, {'url': cleanUrl, 'type': 'browser'});
      }
    } catch (e) {
      await _logEvent(EVENT_ERROR, {'type': 'url_launch', 'error': e.toString()});
    }
  }

  Widget _buildShopCard(Shop shop) {
    return InkWell(
      onTap: () => _handleShopClick(shop),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 5,
            offset: const Offset(0, 2),
          )],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              height: 80,
              width: 80,
              padding: const EdgeInsets.all(12),
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Image.network(
                shop.logo,
                fit: BoxFit.contain,
                errorBuilder: (_, __, ___) => Icon(Icons.store, size: 40, color: Colors.grey[400]),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Text(
                shop.title,
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategories() {
    return Container(
      height: 60,
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: _categories.length,
        itemBuilder: (context, index) {
          final category = _categories[index];
          final isSelected = category.title == _selectedCategory;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: FilterChip(
              selected: isSelected,
              label: Text(category.title),
              onSelected: (_) => _handleCategorySelect(category),
              selectedColor: Colors.amber,
              checkmarkColor: Colors.amber,
              backgroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: BorderSide(color: isSelected ? Colors.amber : Colors.grey[300]!),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildShimmerLoading() {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      child: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 1,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        itemCount: 6,
        itemBuilder: (_, __) => Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                height: 80,
                width: 80,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              const SizedBox(height: 12),
              Container(
                height: 16,
                width: 100,
                color: Colors.white,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryShimmer() {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      child: Container(
        height: 60,
        margin: const EdgeInsets.symmetric(vertical: 8),
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          itemCount: 5,
          itemBuilder: (_, __) => Padding(
            padding: const EdgeInsets.only(right: 8),
            child: Container(
              width: 80,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: const Header(),
      drawer: const SidebarDrawer(),
      body: Column(
        children: [
          _isLoading ? _buildCategoryShimmer() : _buildCategories(),
          Expanded(
            child: _isLoading
                ? _buildShimmerLoading()
                : RefreshIndicator(
                    onRefresh: _refreshShops,
                    child: GridView.builder(
                      controller: _scrollController,
                      padding: const EdgeInsets.all(16),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 1,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                      ),
                      itemCount: _getFilteredShops().length + (_hasNextPage ? 1 : 0),
                      itemBuilder: (context, index) {
                        if (index == _getFilteredShops().length) {
                          return _isLoadingMore
                              ? const Center(child: CircularProgressIndicator())
                              : const SizedBox.shrink();
                        }
                        
                        _logEvent('shop_impression', {
                          'shop_id': _getFilteredShops()[index].id,
                          'shop_title': _getFilteredShops()[index].title,
                          'position': index,
                        });
                        
                        return _buildShopCard(_getFilteredShops()[index]);
                      },
                    ),
                  ),
          ),
        ],
      ),
      bottomNavigationBar: CustomBottomNavigation(
        currentIndex: _currentIndex,
        onTap: (index) {
          _logEvent(EVENT_NAVIGATION, {
            'from_index': _currentIndex,
            'to_index': index,
          });
          setState(() => _currentIndex = index);
        },
      ),
    );
  }
}
