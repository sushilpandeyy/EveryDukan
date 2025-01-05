import 'package:flutter/material.dart';
import '../component/storecard.dart';
import '../component/categoryfilter.dart';
import '../component/FamousBrands.dart';
import '../component/header.dart';
import '../component/bottom.dart';

class ShopScreen extends StatefulWidget {
  @override
  _ShopScreenState createState() => _ShopScreenState();
}

class _ShopScreenState extends State<ShopScreen> {
  final List<Map<String, String>> stores = [
    {'name': 'ElectroWorld', 'logo': 'assets/electro.png', 'category': 'Electronics'},
    {'name': 'FashionHub', 'logo': 'assets/fashion.png', 'category': 'Fashion'},
    {'name': 'BookNest', 'logo': 'assets/books.png', 'category': 'Books'},
    {'name': 'GadgetGalaxy', 'logo': 'assets/gadgets.png', 'category': 'Electronics'},
    {'name': 'StyleCorner', 'logo': 'assets/style.png', 'category': 'Fashion'},
    // Add more stores as needed
  ];
  
  int _currentIndex = 2;

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  final List<String> categories = ['All', 'Electronics', 'Fashion', 'Books'];

  String selectedCategory = 'All';

  @override
  Widget build(BuildContext context) {
    final filteredStores = selectedCategory == 'All'
        ? stores
        : stores.where((store) => store['category'] == selectedCategory).toList();

    return Scaffold(
      backgroundColor: Colors.white, // Scaffold background color
      appBar: const Header(),
      body: Column(
        children: [
          // Category Filter Component
          CategoryFilter(
            categories: categories,
            selectedCategory: selectedCategory,
            onCategorySelected: (category) {
              setState(() {
                selectedCategory = category;
              });
            },
          ),
          // Store List
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(16.0),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 16.0,
                mainAxisSpacing: 16.0,
              ),
              itemCount: filteredStores.length,
              itemBuilder: (context, index) {
                return StoreCard(
                  logoPath: filteredStores[index]['logo']!,
                  cardColor: Colors.blue, // Card primary color
                );
              },
            ),
          )
        ],
      ),
      bottomNavigationBar: CustomBottomNavigation(
        currentIndex: _currentIndex,
        onTap: _onTabTapped,
      ),
    );
  }
}
