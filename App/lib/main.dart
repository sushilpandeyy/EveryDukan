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

// Single source of truth for preference keys
class PreferenceKeys {
  static const String hasCompletedOnboarding = 'has_completed_onboarding';
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeApp();
  runApp(const MyApp());
}

Future<void> initializeApp() async {
  try {
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
  FirebaseAnalytics.instance; // Initialize analytics
}

Future<void> _initializeOneSignal() async { 
  OneSignal.Debug.setLogLevel(OSLogLevel.verbose);
  OneSignal.initialize("a9a9e59d-c91d-487a-8121-0b231203406b"); 
  await OneSignal.Notifications.requestPermission(true);  
}

Future<void> _initializeNotifications() async {
  if (Platform.isIOS) {
    final apnsToken = await FirebaseMessaging.instance.getAPNSToken();
    debugPrint(apnsToken != null ? 'Got APNS token: $apnsToken' : 'APNS token not available yet');
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
        primarySwatch: Colors.amber,
        useMaterial3: true,
      ),
      home: const AppEntryPoint(),
      routes: {
        '/home': (context) => const HomePage(),
        '/shops': (context) => ShopScreen(),
        '/coupon': (context) => CouponScreen(),
        '/deals': (context) => const DealsPage(),
        // Remove onboarding from routes to prevent direct navigation
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
  bool _needsOnboarding = true;

  @override
  void initState() {
    super.initState();
    _checkOnboardingStatus();
  }

  Future<void> _checkOnboardingStatus() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final hasCompletedOnboarding = prefs.getBool(PreferenceKeys.hasCompletedOnboarding) ?? false;
      
      if (mounted) {
        setState(() {
          _needsOnboarding = !hasCompletedOnboarding;
          _isLoading = false;
        });
      }
    } catch (e) {
      debugPrint('Error checking onboarding status: $e');
      if (mounted) {
        setState(() {
          _isLoading = false;
          _needsOnboarding = true; // Default to showing onboarding if there's an error
        });
      }
    }
  }

  Future<void> _completeOnboarding() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(PreferenceKeys.hasCompletedOnboarding, true);
      
      if (mounted) {
        setState(() {
          _needsOnboarding = false;
        });
      }
    } catch (e) {
      debugPrint('Error saving onboarding status: $e');
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

    if (_needsOnboarding) {
      return OnboardingScreen(
        onComplete: () {
          _completeOnboarding();
        },
      );
    }

    return const HomePage();
  }
}