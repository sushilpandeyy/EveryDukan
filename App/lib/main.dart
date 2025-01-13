import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter/material.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:io' show Platform;

import 'firebase_options.dart';
import './page/home.dart';
import './page/shops.dart';
import './page/coupon.dart';
import './page/deals.dart';
import './page/onboard.dart';

void main() async {
  await initializeApp();
  runApp(const MyApp());
}

Future<void> initializeApp() async {
  try {
    WidgetsFlutterBinding.ensureInitialized();
    
    await _initializeFirebase();
    await _initializeOneSignal();
    await _initializeNotifications();
    
  } catch (e) {
    debugPrint('Error initializing app: $e');
  }
}

Future<void> _initializeFirebase() async {
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  
  // Initialize Firebase Analytics
  final FirebaseAnalytics analytics = FirebaseAnalytics.instance;
  // You can add custom analytics initialization here if needed
}

Future<void> _initializeOneSignal() async {
  // Initialize OneSignal
  OneSignal.Debug.setLogLevel(OSLogLevel.verbose);
  OneSignal.initialize("a9a9e59d-c91d-487a-8121-0b231203406b");
  
  // Request notification permissions
  await OneSignal.Notifications.requestPermission(true);
  
  // Set initial tags
  await OneSignal.User.addTags({"fashionPrefsM": true});
  
  // Debug: print current tags
  final tags = await OneSignal.User.getTags();
  debugPrint('OneSignal tags: $tags');
}

Future<void> _initializeNotifications() async {
  if (Platform.isIOS) {
    final apnsToken = await FirebaseMessaging.instance.getAPNSToken();
    if (apnsToken != null) {
      debugPrint('Got APNS token: $apnsToken');
    } else {
      debugPrint('APNS token not available yet');
    }
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Shopping App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const AppEntryPoint(),
      routes: {
        '/home': (context) => const HomePage(),
        '/shops': (context) =>  ShopScreen(),
        '/coupon': (context) => CouponScreen(),
        '/deals': (context) => const DealsPage(),
        '/onboard': (context) => const OnboardingScreen(),
      },
    );
  }
}

class AppEntryPoint extends StatefulWidget {
  const AppEntryPoint({super.key});

  @override
  State<AppEntryPoint> createState() => _AppEntryPointState();
}

class _AppEntryPointState extends State<AppEntryPoint> {
  bool _isLoading = true;
  bool _isFirstTime = true;

  @override
  void initState() {
    super.initState();
    _checkFirstTime();
  }

  Future<void> _checkFirstTime() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final isFirstTime = prefs.getBool('is_first_time') ?? true;
      
      if (mounted) {
        setState(() {
          _isFirstTime = isFirstTime;
          _isLoading = false;
        });
      }

      if (isFirstTime) {
        await prefs.setBool('is_first_time', false);
      }
    } catch (e) {
      debugPrint('Error checking first time status: $e');
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    return _isFirstTime ? const OnboardingScreen() : const HomePage();
  }
}