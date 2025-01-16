import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:flutter/foundation.dart';


class CacheManager {
  static const String _homeDataKey = 'home_data';
  static const String _homeDataTimestampKey = 'home_data_timestamp';
  static const Duration _cacheDuration = Duration(hours: 2);

  static Future<void> cacheHomeData(String data) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_homeDataKey, data);
    await prefs.setInt(_homeDataTimestampKey, DateTime.now().millisecondsSinceEpoch);
  }

  static Future<Map<String, dynamic>?> getCachedHomeData() async {
    final prefs = await SharedPreferences.getInstance();
    final timestamp = prefs.getInt(_homeDataTimestampKey);
    final data = prefs.getString(_homeDataKey);

    if (timestamp == null || data == null) return null;

    final cachedTime = DateTime.fromMillisecondsSinceEpoch(timestamp);
    final now = DateTime.now();

    if (now.difference(cachedTime) > _cacheDuration) {
      // Cache expired, clear it
      await prefs.remove(_homeDataKey);
      await prefs.remove(_homeDataTimestampKey);
      return null;
    }

    try {
      return json.decode(data);
    } catch (e) {
      return null;
    }
  }
}

class BannerCacheManager {
  // Make keys public static constants
  static const String BANNER_DATA_KEY = 'banner_data';
  static const String BANNER_TIMESTAMP_KEY = 'banner_timestamp';
  static const Duration CACHE_DURATION = Duration(minutes: 20);

  static Future<void> cacheBannerData(String data) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(BANNER_DATA_KEY, data);
      await prefs.setInt(BANNER_TIMESTAMP_KEY, DateTime.now().millisecondsSinceEpoch);
    } catch (e) {
      debugPrint('Error caching banner data: $e');
    }
  }

  static Future<Map<String, dynamic>?> getCachedBannerData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final timestamp = prefs.getInt(BANNER_TIMESTAMP_KEY);
      final data = prefs.getString(BANNER_DATA_KEY);

      if (timestamp == null || data == null) return null;

      final cachedTime = DateTime.fromMillisecondsSinceEpoch(timestamp);
      final now = DateTime.now();

      if (now.difference(cachedTime) > CACHE_DURATION) {
        // Cache expired, clear it
        await prefs.remove(BANNER_DATA_KEY);
        await prefs.remove(BANNER_TIMESTAMP_KEY);
        return null;
      }

      return json.decode(data);
    } catch (e) {
      debugPrint('Error getting cached banner data: $e');
      return null;
    }
  }

  static Future<void> clearCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(BANNER_DATA_KEY);
      await prefs.remove(BANNER_TIMESTAMP_KEY);
    } catch (e) {
      debugPrint('Error clearing banner cache: $e');
    }
  }
}


class CategoryCacheManager {
  static const String CATEGORY_DATA_KEY = 'category_data';
  static const String CATEGORY_TIMESTAMP_KEY = 'category_timestamp';
  static const Duration CACHE_DURATION = Duration(days: 15);

  static Future<void> cacheCategories(String data) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(CATEGORY_DATA_KEY, data);
      await prefs.setInt(CATEGORY_TIMESTAMP_KEY, DateTime.now().millisecondsSinceEpoch);
    } catch (e) {
      debugPrint('Error caching categories: $e');
    }
  }

  static Future<Map<String, dynamic>?> getCachedCategories() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final timestamp = prefs.getInt(CATEGORY_TIMESTAMP_KEY);
      final data = prefs.getString(CATEGORY_DATA_KEY);

      if (timestamp == null || data == null) return null;

      final cachedTime = DateTime.fromMillisecondsSinceEpoch(timestamp);
      final now = DateTime.now();

      if (now.difference(cachedTime) > CACHE_DURATION) {
        // Cache expired, clear it
        await prefs.remove(CATEGORY_DATA_KEY);
        await prefs.remove(CATEGORY_TIMESTAMP_KEY);
        return null;
      }

      return json.decode(data);
    } catch (e) {
      debugPrint('Error getting cached categories: $e');
      return null;
    }
  }

  static Future<void> clearCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(CATEGORY_DATA_KEY);
      await prefs.remove(CATEGORY_TIMESTAMP_KEY);
    } catch (e) {
      debugPrint('Error clearing category cache: $e');
    }
  }
}

class ShopCacheManager {
  static const String SHOP_DATA_KEY = 'shop_data';
  static const String SHOP_TIMESTAMP_KEY = 'shop_timestamp';
  static const Duration CACHE_DURATION = Duration(hours: 5);

  static Future<void> cacheShopData(int page, String data) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('${SHOP_DATA_KEY}_$page', data);
      await prefs.setInt('${SHOP_TIMESTAMP_KEY}_$page', DateTime.now().millisecondsSinceEpoch);
    } catch (e) {
      debugPrint('Error caching shop data: $e');
    }
  }

  static Future<Map<String, dynamic>?> getCachedShopData(int page) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final timestamp = prefs.getInt('${SHOP_TIMESTAMP_KEY}_$page');
      final data = prefs.getString('${SHOP_DATA_KEY}_$page');

      if (timestamp == null || data == null) return null;

      final cachedTime = DateTime.fromMillisecondsSinceEpoch(timestamp);
      final now = DateTime.now();

      if (now.difference(cachedTime) > CACHE_DURATION) {
        // Cache expired, clear it
        await prefs.remove('${SHOP_DATA_KEY}_$page');
        await prefs.remove('${SHOP_TIMESTAMP_KEY}_$page');
        return null;
      }

      return json.decode(data);
    } catch (e) {
      debugPrint('Error getting cached shop data: $e');
      return null;
    }
  }

  static Future<void> clearCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final keys = prefs.getKeys();
      for (String key in keys) {
        if (key.startsWith(SHOP_DATA_KEY) || key.startsWith(SHOP_TIMESTAMP_KEY)) {
          await prefs.remove(key);
        }
      }
    } catch (e) {
      debugPrint('Error clearing shop cache: $e');
    }
  }
}

class DealsCacheManager {
  static const String DEALS_DATA_KEY = 'deals_data';
  static const String DEALS_TIMESTAMP_KEY = 'deals_timestamp';
  static const Duration CACHE_DURATION = Duration(minutes: 30);

  static Future<void> cacheDealsData(int page, String data) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('${DEALS_DATA_KEY}_$page', data);
      await prefs.setInt('${DEALS_TIMESTAMP_KEY}_$page', DateTime.now().millisecondsSinceEpoch);
    } catch (e) {
      debugPrint('Error caching deals data: $e');
    }
  }

  static Future<Map<String, dynamic>?> getCachedDealsData(int page) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final timestamp = prefs.getInt('${DEALS_TIMESTAMP_KEY}_$page');
      final data = prefs.getString('${DEALS_DATA_KEY}_$page');

      if (timestamp == null || data == null) return null;

      final cachedTime = DateTime.fromMillisecondsSinceEpoch(timestamp);
      final now = DateTime.now();

      if (now.difference(cachedTime) > CACHE_DURATION) {
        // Cache expired, clear it
        await prefs.remove('${DEALS_DATA_KEY}_$page');
        await prefs.remove('${DEALS_TIMESTAMP_KEY}_$page');
        return null;
      }

      return json.decode(data);
    } catch (e) {
      debugPrint('Error getting cached deals data: $e');
      return null;
    }
  }

  static Future<void> clearCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final keys = prefs.getKeys();
      for (String key in keys) {
        if (key.startsWith(DEALS_DATA_KEY) || key.startsWith(DEALS_TIMESTAMP_KEY)) {
          await prefs.remove(key);
        }
      }
    } catch (e) {
      debugPrint('Error clearing deals cache: $e');
    }
  }
}

class CouponCacheManager {
  static const String COUPON_DATA_KEY = 'coupon_data';
  static const String COUPON_TIMESTAMP_KEY = 'coupon_timestamp';
  static const Duration CACHE_DURATION = Duration(minutes: 20);

  static Future<void> cacheCouponData(int page, String data) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('${COUPON_DATA_KEY}_$page', data);
      await prefs.setInt('${COUPON_TIMESTAMP_KEY}_$page', DateTime.now().millisecondsSinceEpoch);
    } catch (e) {
      debugPrint('Error caching coupon data: $e');
    }
  }

  static Future<Map<String, dynamic>?> getCachedCouponData(int page) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final timestamp = prefs.getInt('${COUPON_TIMESTAMP_KEY}_$page');
      final data = prefs.getString('${COUPON_DATA_KEY}_$page');

      if (timestamp == null || data == null) return null;

      final cachedTime = DateTime.fromMillisecondsSinceEpoch(timestamp);
      final now = DateTime.now();

      if (now.difference(cachedTime) > CACHE_DURATION) {
        // Cache expired, clear it
        await prefs.remove('${COUPON_DATA_KEY}_$page');
        await prefs.remove('${COUPON_TIMESTAMP_KEY}_$page');
        return null;
      }

      return json.decode(data);
    } catch (e) {
      debugPrint('Error getting cached coupon data: $e');
      return null;
    }
  }

  static Future<void> clearCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final keys = prefs.getKeys();
      for (String key in keys) {
        if (key.startsWith(COUPON_DATA_KEY) || key.startsWith(COUPON_TIMESTAMP_KEY)) {
          await prefs.remove(key);
        }
      }
    } catch (e) {
      debugPrint('Error clearing coupon cache: $e');
    }
  }
}

