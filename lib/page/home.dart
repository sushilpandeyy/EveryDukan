import 'package:flutter/material.dart';
import '../component/bottom.dart';
import '../component/header.dart';
import '../component/slideshow.dart';
import '../component/topcategories.dart';
import '../component/reusablecard1.dart';
import '../util/linkopener.dart';


class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    const Center(child: Text('Home Content')),
    const Center(child: Text('Deals Content')),
    const Center(child: Text('Shops Content')),
    const Center(child: Text('Refer Content')),
  ];

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
     final List<String> imageUrls = [
      'https://asset22.ckassets.com/resources/image/staticpage_images/mCaffeine-Desktop%204-1735796309.png',
      'https://asset22.ckassets.com/resources/image/staticpage_images/Store-Desktop-Ajio-1735796225.png',
      'https://asset22.ckassets.com/resources/image/staticpage_images/Store-Desktop-Myntra-min-1735884857.png',
      'https://asset22.ckassets.com/resources/image/staticpage_images/Background-min-1728982477.png',
    ];

    final List<Category> categories = [
      const Category(imageUrl: 'https://cdn-icons-png.flaticon.com/512/59/59844.png', title: 'Clothing'),
      const Category(imageUrl: 'https://cdn-icons-png.flaticon.com/512/59/59844.png', title: 'Electronics'),
      const Category(imageUrl: 'https://cdn-icons-png.flaticon.com/512/59/59844.png', title: 'Home & Kitchen'),
      const Category(imageUrl: 'https://cdn-icons-png.flaticon.com/512/59/59844.png', title: 'Sports'),
      const Category(imageUrl: 'https://cdn-icons-png.flaticon.com/512/59/59844.png', title: 'Books'),
      const Category(imageUrl: 'https://cdn-icons-png.flaticon.com/512/59/59844.png', title: 'Health'),
    ];

    return Scaffold(
  appBar: const Header(), 
  body: Center(
    child: Padding(
      padding: const EdgeInsets.all(10.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          BannerSlideshow(imageUrls: imageUrls),  
          const SizedBox(height: 20), 
          TopCategories(categories: categories), 
           ReusableBannerComponent(
                title: 'Trending Offers',
                onViewAll: () {
                  print('View All clicked');
                },
                banners: [
                  BannerCardModel(
                    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/mCaffeine-Desktop%204-1735796309.png',
                    buttonText: 'Grab',
                   onButtonPressed: () { openUrl('https://flutter.dev');},
                  ),
                  BannerCardModel(
                    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/mCaffeine-Desktop%204-1735796309.png',
                    buttonText: 'Grab',
                    onButtonPressed: () {
                      print('Grabbed Item 2');
                    },
                  ),
                  BannerCardModel(
                    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/mCaffeine-Desktop%204-1735796309.png',
                    buttonText: 'Grab',
                    onButtonPressed: () {
                      print('Grabbed Item 3');
                    },
                  ),
                ],),
        ],
      ),
    ),
  ),
  bottomNavigationBar: CustomBottomNavigation(
    currentIndex: _currentIndex,
    onTap: _onTabTapped,
  ),
);
  }
}
