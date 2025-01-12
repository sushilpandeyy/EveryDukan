import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import './page/home.dart';
import './page/shops.dart'; 
import 'page/coupon.dart';
import 'page/deals.dart';


void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
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
      initialRoute: '/', // Define the initial route
      routes: {
        '/': (context) => HomePage(),
        '/shops': (context) => ShopScreen(), // Define the ShopScreen route
        '/coupon': (context) => CouponScreen(),
        '/deals': (context) => DealsPage(), // Define the DealsPage route
      },
    );
  }
}
