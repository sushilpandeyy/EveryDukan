import 'package:flutter/material.dart';
import './page/home.dart';
import './page/shops.dart'; // Import the ShopScreen file

void main() {
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
      },
    );
  }
}
