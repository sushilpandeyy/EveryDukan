import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'dart:io' show Platform;
import 'firebase_options.dart';
import 'package:flutter/material.dart';
 import './page/home.dart';
import './page/shops.dart';
import 'page/coupon.dart';
import 'page/deals.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
FirebaseAnalytics analytics = FirebaseAnalytics.instance;

  // Request notification permissions
  final notificationSettings = await FirebaseMessaging.instance.requestPermission(
    alert: true,
    badge: true,
    sound: true,
    provisional: true,
  );

  // Get FCM token for this device
  final fcmToken = await FirebaseMessaging.instance.getToken();
  print('FCM Token: $fcmToken');

  // Only try to get APNS token on iOS
  if (Platform.isIOS) {
    final apnsToken = await FirebaseMessaging.instance.getAPNSToken();
    if (apnsToken != null) {
      print('Got APNS token: $apnsToken');
    } else {
      print('APNS token not available yet');
    }
  }

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