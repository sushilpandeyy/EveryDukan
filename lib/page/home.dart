import 'package:flutter/material.dart';
import '../component/bottom.dart';
import '../component/header.dart';
import '../component/slideshow.dart';

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

    return Scaffold(
      appBar: const Header(), // Call the custom Header component here
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(10.0),
          child: BannerSlideshow(imageUrls: imageUrls),
        ),
      ),
      bottomNavigationBar: CustomBottomNavigation(
        currentIndex: _currentIndex,
        onTap: _onTabTapped,
      ),
    );
  }
}
