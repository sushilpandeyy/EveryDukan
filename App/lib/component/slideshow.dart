import 'package:flutter/material.dart';
import 'dart:async';
import 'package:url_launcher/url_launcher.dart';

class Slideshow extends StatefulWidget {
  const Slideshow({super.key});

  @override
  State<Slideshow> createState() => _SlideshowState();
}

class _SlideshowState extends State<Slideshow> {
  static const _autoPlayDuration = Duration(seconds: 3);
  static const _transitionDuration = Duration(milliseconds: 350);
  
  final List<_BannerItem> _bannerItems = [
    _BannerItem(
      imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/mCaffeine-Desktop%204-1735796309.png',
      link: 'https://www.mcaffeine.com',
    ),
    _BannerItem(
      imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Store-Desktop-Ajio-1735796225.png',
      link: 'https://www.ajio.com',
    ),
    _BannerItem(
      imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Store-Desktop-Myntra-min-1735884857.png',
      link: 'https://www.myntra.com',
    ),
    _BannerItem(
      imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Background-min-1728982477.png',
      link: 'https://www.example.com',
    ),
  ];

  late final PageController _pageController;
  late Timer _timer;
  
  var _currentPage = 0;
  var _isAutoPlaying = true;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _startAutoPlay();
  }

  @override
  void dispose() {
    _pageController.dispose();
    _timer.cancel();
    super.dispose();
  }

  void _startAutoPlay() {
    _timer = Timer.periodic(_autoPlayDuration, (_) {
      if (!_isAutoPlaying || !mounted) return;
      
      final nextPage = _currentPage < _bannerItems.length - 1 ? _currentPage + 1 : 0;
      _pageController.animateToPage(
        nextPage,
        duration: _transitionDuration,
        curve: Curves.easeInOut,
      );
    });
  }

  Future<void> _launchURL(String url) async {
    try {
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      debugPrint('Error launching URL: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 16 / 9,
      child: Stack(
        children: [
          // Slideshow Content
          PageView.builder(
            controller: _pageController,
            itemCount: _bannerItems.length,
            itemBuilder: (context, index) {
              final item = _bannerItems[index];
              return GestureDetector(
                onTap: () => _launchURL(item.link),
                child: Image.network(
                  item.imageUrl,
                  fit: BoxFit.cover,
                ),
              );
            },
            onPageChanged: (index) {
              setState(() {
                _currentPage = index;
              });
            },
          ),
          // Page Indicators
          Positioned(
            bottom: 16,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                _bannerItems.length,
                (index) => Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: _currentPage == index
                        ? Colors.white
                        : Colors.white.withOpacity(0.5),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _BannerItem {
  final String imageUrl;
  final String link;

  _BannerItem({
    required this.imageUrl,
    required this.link,
  });
}