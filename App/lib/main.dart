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
import 'package:onesignal_flutter/onesignal_flutter.dart'; 
import './page/onboard.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  FirebaseAnalytics analytics = FirebaseAnalytics.instance;

  // Initialize notification services  

  // Get APNS token for iOS
  if (Platform.isIOS) {
    final apnsToken = await FirebaseMessaging.instance.getAPNSToken();
    if (apnsToken != null) {
      print('Got APNS token: $apnsToken');
    } else {
      print('APNS token not available yet');
    }
  }
  OneSignal.Debug.setLogLevel(OSLogLevel.verbose);
  OneSignal.initialize("a9a9e59d-c91d-487a-8121-0b231203406b");
OneSignal.Notifications.requestPermission(true);
OneSignal.User.addTags({"fashionPrefsM": true});
  OneSignal.User.getTags().then((tags) {
    print('OneSignal tags: $tags');
  });

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
        '/onboard': (context) => OnboardingScreen(),
      },
    );
  }
}