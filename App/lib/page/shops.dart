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

// Models
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
   FirebaseAnalytics? analytics = FirebaseAnalytics.instance;

Future<void> initializeFirebase() async {
    try {
      await Firebase.initializeApp();
      // analytics is already initialized as FirebaseAnalytics.instance
      // Log home page open event
      await analytics?.logEvent(
        name: 'Shops_page_open',
        parameters: {
          'timestamp': DateTime.now().toIso8601String(),
        },
      );
    } catch (e) {
      debugPrint('Failed to initialize Firebase Analytics: $e');
    }
  } 

  @override
  void initState() {
    super.initState();
    _initialize();
    initializeFirebase();
    _scrollController.addListener(_onScroll);
  }

  Future<void> _initialize() async {
    await Future.wait([
      _fetchCategories(),
      _loadMoreShops(),
    ]);
    setState(() => _isLoading = false);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      if (_hasNextPage && !_isLoadingMore) {
        _loadMoreShops();
      }
    }
  }

Future<void> _fetchCategories() async {
  try {
    // Check cache first
    final cachedData = await CategoryCacheManager.getCachedCategories();
    if (cachedData != null) {
      final categories = cachedData['Category'] as List;
      
      if (mounted) {
        setState(() {
          _categories.clear(); // Clear existing categories
          _categories.add(Category(id: 'all', title: 'All'));
          _categories.addAll(
            categories.map((cat) => Category.fromJson(cat)).toList(),
          );
        });
      }
      return;
    }

    // If no valid cache, fetch from API
    final response = await http.get(
      Uri.parse('https://19ax8udl06.execute-api.ap-south-1.amazonaws.com/category'),
    );

    if (response.statusCode == 200) {
      // Cache the new data
      await CategoryCacheManager.cacheCategories(response.body);
      
      final data = json.decode(response.body);
      final categories = data['Category'] as List;

      if (mounted) {
        setState(() {
          _categories.clear(); // Clear existing categories
          _categories.add(Category(id: 'all', title: 'All'));
          _categories.addAll(
            categories.map((cat) => Category.fromJson(cat)).toList(),
          );
        });
      }
    } else {
      throw Exception('Failed to load categories');
    }
  } catch (e) {
    debugPrint('Error fetching categories: $e');
  }
}

// Optional: Method to force refresh categories
Future<void> refreshCategories() async {
  try {
    await CategoryCacheManager.clearCache();
    await _fetchCategories();
  } catch (e) {
    debugPrint('Error refreshing categories: $e');
  }
}

  Future<void> _loadMoreShops() async {
  if (_isLoadingMore || !_hasNextPage) return;

  setState(() => _isLoadingMore = true);

  try {
    // Check cache first
    final cachedData = await ShopCacheManager.getCachedShopData(_currentPage);
    if (cachedData != null) {
      final shops = cachedData['Shop'] as List;
      final pagination = cachedData['pagination'];

      if (mounted) {
        setState(() {
          _shops.addAll(shops.map((shop) => Shop.fromJson(shop)));
          _currentPage++;
          _hasNextPage = pagination['hasNextPage'] ?? false;
          _isLoadingMore = false;
        });
      }
      return;
    }

    // If no valid cache, fetch from API
    final response = await http.get(
      Uri.parse('https://19ax8udl06.execute-api.ap-south-1.amazonaws.com/getshop?page=$_currentPage'),
    );

    if (response.statusCode == 200) {
      // Cache the new data
      await ShopCacheManager.cacheShopData(_currentPage, response.body);
      
      final data = json.decode(response.body);
      final shops = data['Shop'] as List;
      final pagination = data['pagination'];

      if (mounted) {
        setState(() {
          _shops.addAll(shops.map((shop) => Shop.fromJson(shop)));
          _currentPage++;
          _hasNextPage = pagination['hasNextPage'] ?? false;
          _isLoadingMore = false;
        });
      }
    } else {
      if (mounted) {
        setState(() => _isLoadingMore = false);
      }
      throw Exception('Failed to load shops');
    }
  } catch (e) {
    if (mounted) {
      setState(() => _isLoadingMore = false);
    }
    debugPrint('Error fetching shops: $e');
  }
}

// Optional: Method to force refresh shops
Future<void> refreshShops() async {
  try {
    await ShopCacheManager.clearCache();
    _currentPage = 1;
    _shops.clear();
    _hasNextPage = true;
    await _loadMoreShops();
  } catch (e) {
    debugPrint('Error refreshing shops: $e');
  }
}

  List<Shop> _getFilteredShops() {
    if (_selectedCategory == 'All') return _shops;
    return _shops.where((shop) => 
      shop.category.contains(_selectedCategory)
    ).toList();
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
        itemCount: 6, // Show 6 shimmer items
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
              onSelected: (selected) {
                setState(() => _selectedCategory = category.title);
              },
              selectedColor: Colors.amber,
              checkmarkColor: Colors.amber,
              backgroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: BorderSide(
                  color: isSelected ? Colors.amber : Colors.grey[300]!,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildShopCard(Shop shop) {
    return InkWell(
      onTap: () => _launchUrl(shop.url),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.1),
              spreadRadius: 1,
              blurRadius: 5,
              offset: const Offset(0, 2),
            ),
          ],
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
                errorBuilder: (_, __, ___) =>
                    Icon(Icons.store, size: 40, color: Colors.grey[400]),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Text(
                shop.title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
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

  Future<void> _launchUrl(String url) async {
  try {
    // Ensure URL has a protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://$url';
    }

    final uri = Uri.parse(url);
    await launchUrl(
      uri,
      mode: LaunchMode.externalNonBrowserApplication,
      webViewConfiguration: const WebViewConfiguration(
        enableJavaScript: true,
        enableDomStorage: true,
      ),
    );
  } catch (e) {
    debugPrint('Error launching URL: $e');
    // Try fallback to default browser if Chrome fails
    try {
      final uri = Uri.parse(url);
      await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );
    } catch (e) {
      debugPrint('Error launching URL in default browser: $e');
    }
  }
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: const Header(),
      drawer: const SidebarDrawer(),
      body: Column(
        children: [
          // Categories
          _isLoading ? _buildCategoryShimmer() : _buildCategories(),
          // Shops Grid
          Expanded(
            child: _isLoading
                ? _buildShimmerLoading()
                : GridView.builder(
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
                      return _buildShopCard(_getFilteredShops()[index]);
                    },
                  ),
          ),
        ],
      ),
      bottomNavigationBar: CustomBottomNavigation(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
      ),
    );
  }
}