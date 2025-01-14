import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../component/storecard.dart';
import '../component/categoryfilter.dart';
import '../component/FamousBrands.dart';
import '../component/header.dart';
import '../component/bottom.dart';
import '../component/sidebar.dart'; 
import 'package:url_launcher/url_launcher.dart';

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
  @override
  _ShopScreenState createState() => _ShopScreenState();
}

class _ShopScreenState extends State<ShopScreen> {
  final List<Shop> _shops = [];
  final List<Category> _categories = [];
  bool _isLoading = false;
  bool _hasNextPage = true;
  final ScrollController _scrollController = ScrollController();
  int _currentPage = 1;
  int _currentIndex = 2;
  String _selectedCategory = 'All';

  @override
  void initState() {
    super.initState();
    _fetchCategories();
    _loadMoreShops();
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
        _loadMoreShops();
      }
    }
  }

  Future<void> _fetchCategories() async {
    try {
      final response = await http.get(
        Uri.parse('https://19ax8udl06.execute-api.ap-south-1.amazonaws.com/category'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final categories = data['Category'] as List;

        setState(() {
          _categories.add(Category(id: 'all', title: 'All')); // Add "All" category
          _categories.addAll(
            categories.map((cat) => Category.fromJson(cat)).toList(),
          );
        });
      }
    } catch (e) {
      debugPrint('Error fetching categories: $e');
    }
  }

  Future<void> _loadMoreShops() async {
    if (_isLoading || !_hasNextPage) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final response = await http.get(
        Uri.parse('https://19ax8udl06.execute-api.ap-south-1.amazonaws.com/getshop?page=$_currentPage'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final shops = data['Shop'] as List;
        final pagination = data['pagination'];

        final newShops = shops.map((shop) => Shop.fromJson(shop)).toList();

        setState(() {
          _shops.addAll(newShops);
          _currentPage++;
          _hasNextPage = pagination['hasNextPage'] ?? false;
          _isLoading = false;
        });
      } else {
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      debugPrint('Error fetching shops: $e');
    }
  }

  List<Shop> _getFilteredShops() {
    if (_selectedCategory == 'All') {
      return _shops;
    }
    return _shops.where((shop) => 
      shop.category.contains(_selectedCategory)
    ).toList();
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
          Container(
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
                      setState(() {
                        _selectedCategory = category.title;
                      });
                    },
                    selectedColor: Colors.blue[100],
                    checkmarkColor: Colors.blue,
                    backgroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                      side: BorderSide(
                        color: isSelected ? Colors.blue : Colors.grey[300]!,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          // Shops Grid
          Expanded(
            child: _shops.isEmpty && _isLoading
                ? const Center(child: CircularProgressIndicator())
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
                        return _isLoading
                            ? const Center(child: CircularProgressIndicator())
                            : const SizedBox.shrink();
                      }

                      final shop = _getFilteredShops()[index];
                      return _buildShopCard(shop);
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
            // Logo
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
                errorBuilder: (context, error, stackTrace) =>
                    Icon(Icons.store, size: 40, color: Colors.grey[400]),
              ),
            ),
            // Title
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
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      debugPrint('Error launching URL: $e');
    }
  }
}

// Update the CategoryFilter widget to handle the new data structure
class CategoryFilter extends StatelessWidget {
  final List<String> categories;
  final String selectedCategory;
  final Function(String) onCategorySelected;

  const CategoryFilter({
    Key? key,
    required this.categories,
    required this.selectedCategory,
    required this.onCategorySelected,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 50,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        itemCount: categories.length,
        itemBuilder: (context, index) {
          final category = categories[index];
          final isSelected = category == selectedCategory;
          
          return Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: FilterChip(
              label: Text(category),
              selected: isSelected,
              onSelected: (_) => onCategorySelected(category),
              backgroundColor: Colors.grey[200],
              selectedColor: Colors.blue.withOpacity(0.2),
              labelStyle: TextStyle(
                color: isSelected ? Colors.blue : Colors.black87,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
              checkmarkColor: Colors.blue,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: BorderSide(
                  color: isSelected ? Colors.blue : Colors.transparent,
                  width: 1,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}