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
import '../component/skelton.dart';  
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_core/firebase_core.dart';
import '../services/cache.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _currentIndex = 0;
  List<dynamic> _components = [];
  bool _isLoading = true;
  bool _isError = false;
  late final FirebaseAnalytics analytics;
  
  // Analytics Event Names
  static const String EVENT_HOME_PAGE_VIEW = 'home_page_view';
  static const String EVENT_BANNER_CLICK = 'banner_click';
  static const String EVENT_BRAND_CLICK = 'brand_click';
  static const String EVENT_VIEW_ALL_CLICK = 'view_all_click';
  static const String EVENT_REFRESH_HOME = 'refresh_home';
  static const String EVENT_ERROR_OCCURRED = 'error_occurred';
  static const String EVENT_NAVIGATION_CLICK = 'navigation_click';

  @override
  void initState() {
    super.initState();
    _initializeAnalytics();
    fetchHomeData();
  }

  Future<void> _initializeAnalytics() async {
    try {
      await Firebase.initializeApp();
      analytics = FirebaseAnalytics.instance;
      
      // Log initial page view with screen name
      await analytics.logScreenView(
        screenName: 'HomePage',
        screenClass: 'HomePage',
      );
      
      // Set user properties if available
      await analytics.setUserProperty(
        name: 'user_type',
        value: 'free_user', // Or determine based on your user status
      );
      
      // Log session start
      await analytics.logEvent(
        name: EVENT_HOME_PAGE_VIEW,
        parameters: {
          'timestamp': DateTime.now().toIso8601String(),
          'is_first_session': true, // You might want to track this separately
        },
      );
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

  Future<void> fetchHomeData() async {
    try {
      // First try to get cached data
      final cachedData = await CacheManager.getCachedHomeData();
      if (cachedData != null) {
        if (mounted) {
          setState(() {
            _components = cachedData['components'];
            _isLoading = false;
            _isError = false;
          });
          
          // Log cache hit event
          await _logAnalyticsEvent('home_data_cache_hit', {
            'component_count': _components.length,
            'data_source': 'cache',
          });
        }
        return;
      }

      // If no valid cache, fetch from API
      final response = await http.get(
        Uri.parse('https://19ax8udl06.execute-api.ap-south-1.amazonaws.com/home'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (mounted) {
          setState(() {
            _components = data['components'];
            _isLoading = false;
            _isError = false;
          });
          
          // Log successful API fetch
          await _logAnalyticsEvent('home_data_fetched', {
            'component_count': _components.length,
            'data_source': 'api',
            'response_time': DateTime.now().millisecondsSinceEpoch,
          });
          
          // Cache the new data
          await CacheManager.cacheHomeData(response.body);
        }
      } else {
        throw Exception('Failed to load home data');
      }
    } catch (e) {
      debugPrint('Error fetching home data: $e');
      if (mounted) {
        setState(() {
          _isLoading = false;
          _isError = true;
        });
        
        // Log error event
        await _logAnalyticsEvent(EVENT_ERROR_OCCURRED, {
          'error_type': 'data_fetch_error',
          'error_message': e.toString(),
        });
      }
    }
  }

  Widget _buildComponent(Map<String, dynamic> component) {
    switch (component['type']) {
      case 'ReusableBanner':
        return ReusableBannerComponent(
          title: component['title'],
          onViewAll: () {
            _logAnalyticsEvent(EVENT_VIEW_ALL_CLICK, {
              'component_type': 'ReusableBanner',
              'title': component['title'],
            });
            debugPrint('View All clicked');
          },
          banners: (component['banners'] as List).map((banner) => 
            BannerCardModel(
              imageUrl: banner['imageUrl'],
              buttonText: 'Grab',
              onButtonPressed: () {
                _logAnalyticsEvent(EVENT_BANNER_CLICK, {
                  'banner_url': banner['clickUrl'],
                  'banner_type': 'ReusableBanner',
                  'banner_position': component['banners'].indexOf(banner),
                });
                openUrl(banner['clickUrl']);
              },
            )
          ).toList(),
        );

      case 'BannerCard':
        return ReusableBanner(
          imageUrl: component['imageUrl'],
          onImageTapped: () {
            _logAnalyticsEvent(EVENT_BANNER_CLICK, {
              'banner_url': component['clickUrl'],
              'banner_type': 'SingleBanner',
              'banner_position': _components.indexOf(component),
            });
            openUrl(component['clickUrl']);
          },
        );

      case 'BrandCard':
        return FamousBrandsComponent(
          getTitle: () => component['title'],
          brandCards: (component['brands'] as List).map((brand) =>
            BrandCardModel(
              logoUrl: brand['logoUrl'],
              tag: brand['tag'],
              buttonText: brand['buttonText'],
              onCardTap: () {
                _logAnalyticsEvent(EVENT_BRAND_CLICK, {
                  'brand_url': brand['clickUrl'],
                  'brand_tag': brand['tag'],
                  'interaction_type': 'card_tap',
                });
                openUrl(brand['clickUrl']);
              },
              onButtonPressed: () {
                _logAnalyticsEvent(EVENT_BRAND_CLICK, {
                  'brand_url': brand['clickUrl'],
                  'brand_tag': brand['tag'],
                  'interaction_type': 'button_press',
                });
                openUrl(brand['clickUrl']);
              },
            )
          ).toList(),
        );

      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildErrorWidget() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            'An error occurred while fetching data.',
            style: TextStyle(fontSize: 18, color: Colors.red),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _isLoading = true;
                _isError = false;
              });
              fetchHomeData();
            },
            child: const Text('Retry'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Header(),
      drawer: const SidebarDrawer(),
      body: RefreshIndicator(
        onRefresh: () async {
          await _logAnalyticsEvent(EVENT_REFRESH_HOME, {
            'previous_error_state': _isError,
          });
          await fetchHomeData();
        },
        child: _isLoading
            ? const HomeSkeletonLoading()
            : _isError
                ? _buildErrorWidget()
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
      ),
      bottomNavigationBar: CustomBottomNavigation(
        currentIndex: _currentIndex,
        onTap: (index) {
          _logAnalyticsEvent(EVENT_NAVIGATION_CLICK, {
            'from_index': _currentIndex,
            'to_index': index,
          });
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}