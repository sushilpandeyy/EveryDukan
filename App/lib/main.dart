import 'package:firebase_core/firebase_core.dart';
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