import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter/material.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';
import 'dart:io' show Platform;
import 'firebase_options.dart';
import './page/home.dart';
import './page/shops.dart';
import './page/coupon.dart';
import './page/deals.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import './page/no.dart';

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
  FirebaseAnalytics.instance;
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
      },
    );
  }
}

class AppEntryPoint extends StatefulWidget {
  const AppEntryPoint({super.key});

  @override
  State<AppEntryPoint> createState() => _AppEntryPointState();
}

class _AppEntryPointState extends State<AppEntryPoint> with WidgetsBindingObserver {
  bool _isLoading = true;
  bool _hasInternet = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _checkInitialConnectivity();
    _setupConnectivityListener();
    _initializeApp();
  }

  void _initializeApp() {
    setState(() {
      _isLoading = false;
    });
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _checkInitialConnectivity();
    }
  }

  Future<void> _checkInitialConnectivity() async {
    try {
      final result = await Connectivity().checkConnectivity();
      if (mounted) {
        setState(() {
          _hasInternet = result != ConnectivityResult.none;
        });
      }
    } catch (e) {
      debugPrint('Initial connectivity check failed: $e');
    }
  }

  void _setupConnectivityListener() {
    Connectivity().onConnectivityChanged.listen((List<ConnectivityResult> results) {
      if (mounted) {
        setState(() {
          _hasInternet = results.any((result) => 
            result == ConnectivityResult.wifi || 
            result == ConnectivityResult.mobile || 
            result == ConnectivityResult.ethernet
          );
        });
      }
    });
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!_hasInternet) {
      return NoInternetScreen(
        onRetry: _checkInitialConnectivity,
      );
    }

    if (_isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    return const HomePage();
  }
}