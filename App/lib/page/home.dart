import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../component/bottom.dart';
import '../component/header.dart';
import '../component/slideshow.dart';
import '../component/topcategories.dart';
import '../component/reusablecard1.dart';
import '../util/linkopener.dart';
import '../component/FamousBrands.dart';
import '../component/ReusableBanner.dart';
import '../component/sidebar.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _currentIndex = 0;
  List<dynamic> _components = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchHomeData();
  }

  Future<void> fetchHomeData() async {
    try {
      final response = await http.get(
        Uri.parse('https://19ax8udl06.execute-api.ap-south-1.amazonaws.com/home'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          _components = data['components'];
          _isLoading = false;
        });
      } else {
        throw Exception('Failed to load home data');
      }
    } catch (e) {
      print('Error fetching home data: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  Widget _buildComponent(Map<String, dynamic> component) {
    switch (component['type']) {
      case 'ReusableBanner':
        return ReusableBannerComponent(
          title: component['title'],
          onViewAll: () {
            print('View All clicked');
          },
          banners: (component['banners'] as List).map((banner) => 
            BannerCardModel(
              imageUrl: banner['imageUrl'],
              buttonText: 'Grab',
              onButtonPressed: () => openUrl(banner['clickUrl']),
            )
          ).toList(),
        );

      case 'BannerCard':
        return ReusableBanner(
          imageUrl: component['imageUrl'],
          onImageTapped: () => openUrl(component['clickUrl']),
        );

      case 'BrandCard':
        return FamousBrandsComponent(
          getTitle: () => component['title'],
          brandCards: (component['brands'] as List).map((brand) =>
            BrandCardModel(
              logoUrl: brand['logoUrl'],
              tag: brand['tag'],
              buttonText: brand['buttonText'],
              onCardTap: () => openUrl(brand['clickUrl']),
              onButtonPressed: () => openUrl(brand['clickUrl']),
            )
          ).toList(),
        );

      default:
        return const SizedBox.shrink();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Header(),
      drawer: const SidebarDrawer(),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(10.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Slideshow(),
                      const SizedBox(height: 20),
                      ..._components.map((component) => Column(
                        children: [
                          _buildComponent(component),
                          const SizedBox(height: 20),
                        ],
                      )).toList(),
                    ],
                  ),
                ),
              ),
            ),
      bottomNavigationBar: CustomBottomNavigation(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}