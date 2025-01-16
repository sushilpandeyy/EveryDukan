import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';
import '../util/linkopener.dart';
import '../services/cache.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Slideshow extends StatefulWidget {
  const Slideshow({super.key});

  @override
  State<Slideshow> createState() => _SlideshowState();
}

class _SlideshowState extends State<Slideshow> {
  static const _autoPlayDuration = Duration(seconds: 3);
  static const _transitionDuration = Duration(milliseconds: 350);
  
  List<_BannerItem> _bannerItems = [];
  bool _isLoading = true;

  late final PageController _pageController;
  late Timer _timer;
  
  var _currentPage = 0;
  var _isAutoPlaying = true;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _fetchBanners();
  }

  @override
  void dispose() {
    _pageController.dispose();
    _timer.cancel();
    super.dispose();
  }

Future<void> _fetchBanners() async {
  try {
    // First check cache
    final cachedData = await BannerCacheManager.getCachedBannerData();
    if (cachedData != null) {
      final banners = cachedData['Bannerss'] as List;
      
      if (mounted) {
        setState(() {
          _bannerItems = banners.map((banner) => _BannerItem(
            imageUrl: banner['bannerImage'],
            link: banner['linkForClick'],
          )).toList();
          _isLoading = false;
        });
        _startAutoPlay();
      }
      return;
    }

    // If no valid cache, fetch from API
    final response = await http.get(
      Uri.parse('https://19ax8udl06.execute-api.ap-south-1.amazonaws.com/homebanner'),
    );

    if (response.statusCode == 200) {
      // Cache the new data
      await BannerCacheManager.cacheBannerData(response.body);
      
      final data = json.decode(response.body);
      final banners = data['Bannerss'] as List;
      
      if (mounted) {
        setState(() {
          _bannerItems = banners.map((banner) => _BannerItem(
            imageUrl: banner['bannerImage'],
            link: banner['linkForClick'],
          )).toList();
          _isLoading = false;
        });
        _startAutoPlay();
      }
    } else {
      throw Exception('Failed to load banners');
    }
  } catch (e) {
    debugPrint('Error fetching banners: $e');
    if (mounted) {
      setState(() {
        _isLoading = false;
      });
    }
  }
}

// Method to force refresh banners
Future<void> refreshBanners() async {
  try {
    await BannerCacheManager.clearCache(); // Using the new clearCache method
    await _fetchBanners();
  } catch (e) {
    debugPrint('Error refreshing banners: $e');
  }
}

  void _startAutoPlay() {
    _timer = Timer.periodic(_autoPlayDuration, (_) {
      if (!_isAutoPlaying || !mounted || _bannerItems.isEmpty) return;
      
      final nextPage = _currentPage < _bannerItems.length - 1 ? _currentPage + 1 : 0;
      _pageController.animateToPage(
        nextPage,
        duration: _transitionDuration,
        curve: Curves.easeInOut,
      );
    });
  }
  

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Container(
        height: MediaQuery.of(context).size.width * 0.4, // Reduced height ratio
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    if (_bannerItems.isEmpty) {
      return Container(
        height: MediaQuery.of(context).size.width * 0.4,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Center(
          child: Text('No banners available'),
        ),
      );
    }

    return Container(
      height: MediaQuery.of(context).size.width * 0.4, // Reduced height ratio
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Stack(
          children: [
            // Slideshow Content
            PageView.builder(
              controller: _pageController,
              itemCount: _bannerItems.length,
              itemBuilder: (context, index) {
                final item = _bannerItems[index];
                return GestureDetector(
                  onTap: () => openUrl(item.link),
                  child: Container(
                    width: MediaQuery.of(context).size.width,
                    color: Colors.white, // Background color
                    child: Image.network(
                      item.imageUrl,
                      fit: BoxFit.cover, // Changed back to cover
                      loadingBuilder: (context, child, loadingProgress) {
                        if (loadingProgress == null) return child;
                        return Center(
                          child: CircularProgressIndicator(
                            value: loadingProgress.expectedTotalBytes != null
                                ? loadingProgress.cumulativeBytesLoaded / 
                                  loadingProgress.expectedTotalBytes!
                                : null,
                          ),
                        );
                      },
                      errorBuilder: (context, error, stackTrace) {
                        return const Center(
                          child: Icon(Icons.error_outline, size: 40),
                        );
                      },
                    ),
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
              bottom: 12,
              left: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(
                    _bannerItems.length,
                    (index) => Container(
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      width: 6, // Slightly smaller indicators
                      height: 6,
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
            ),
          ],
        ),
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