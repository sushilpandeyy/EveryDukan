import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'dart:io' show Platform;
import 'firebase_options.dart';
import 'package:flutter/material.dart';
import './page/home.dart';
import './page/shops.dart';
import 'page/coupon.dart';
import 'page/deals.dart';

// Class to handle FCM token and clusters
class FCMManager {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  String? _token;

  // Initialize FCM and get token
  Future<void> initialize() async {
    _token = await _messaging.getToken();
    if (_token != null) {
      await saveToken();
    }

    // Listen for token refresh
    _messaging.onTokenRefresh.listen((newToken) {
      _token = newToken;
      saveToken();
    });
  }

  // Save token with clusters
  Future<void> saveToken() async {
    if (_token == null) return;

    try {
      String deviceId = await _getDeviceIdentifier();
      
      await _firestore.collection('fcmtokens').doc(deviceId).set({
        'token': _token,
        'createdAt': FieldValue.serverTimestamp(),
        'platform': Platform.isIOS ? 'ios' : 'android',
        'clusters': [], // Initialize empty clusters array
        'lastUpdated': FieldValue.serverTimestamp(),
      }, SetOptions(merge: true));
      
      print('FCM Token saved to Firestore');
    } catch (e) {
      print('Error saving FCM token: $e');
    }
  }

  // Add device to clusters
  Future<void> addToClusters(List<String> clusters) async {
    if (_token == null) return;

    try {
      String deviceId = await _getDeviceIdentifier();
      
      await _firestore.collection('fcmtokens').doc(deviceId).update({
        'clusters': FieldValue.arrayUnion(clusters),
        'lastUpdated': FieldValue.serverTimestamp(),
      });

      print('Added to clusters: $clusters');
    } catch (e) {
      print('Error adding to clusters: $e');
    }
  }

  // Remove device from clusters
  Future<void> removeFromClusters(List<String> clusters) async {
    if (_token == null) return;

    try {
      String deviceId = await _getDeviceIdentifier();
      
      await _firestore.collection('fcmtokens').doc(deviceId).update({
        'clusters': FieldValue.arrayRemove(clusters),
        'lastUpdated': FieldValue.serverTimestamp(),
      });

      print('Removed from clusters: $clusters');
    } catch (e) {
      print('Error removing from clusters: $e');
    }
  }

  // Get device unique identifier
  Future<String> _getDeviceIdentifier() async {
    // Use instance ID or a unique device identifier
    // For this example, we'll use the FCM token itself
    return _token ?? '';
  }

  // Get current clusters for device
  Future<List<String>> getCurrentClusters() async {
    try {
      String deviceId = await _getDeviceIdentifier();
      
      DocumentSnapshot doc = await _firestore
          .collection('fcmtokens')
          .doc(deviceId)
          .get();

      if (doc.exists) {
        Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
        return List<String>.from(data['clusters'] ?? []);
      }
      
      return [];
    } catch (e) {
      print('Error getting clusters: $e');
      return [];
    }
  }
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  FirebaseAnalytics analytics = FirebaseAnalytics.instance;

  // Initialize FCM manager
  final fcmManager = FCMManager();
  await fcmManager.initialize();

  // Request notification permissions
  final notificationSettings = await FirebaseMessaging.instance.requestPermission(
    alert: true,
    badge: true,
    sound: true,
    provisional: true,
  );

  // Example of adding device to clusters based on conditions
  // You can modify these conditions based on your needs
  if (Platform.isIOS) {
    await fcmManager.addToClusters(['ios_users']);
  } else {
    await fcmManager.addToClusters(['android_users']);
  }

  // Example: Add to location-based cluster
  await fcmManager.addToClusters(['location_nyc']);

  // Example: Add to user preference clusters
  await fcmManager.addToClusters(['electronics_interested', 'fashion_interested']);

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Shopping App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => HomePage(),
        '/shops': (context) => ShopScreen(),
        '/coupon': (context) => CouponScreen(),
        '/deals': (context) => DealsPage(),
      },
    );
  }
}