import 'package:flutter/material.dart';
import '../component/header.dart';
import '../component/bottom.dart';
import '../component/deallist.dart'; // Rename to couponlist.dart

class CouponScreen extends StatefulWidget {
  @override
  _CouponScreenState createState() => _CouponScreenState();
}

class _CouponScreenState extends State<CouponScreen> {
  final List<Coupon> coupons = [
    Coupon(
      title: "10% Off on Electronics",
      couponCode: "ELEC10",
      description: "Get 10% off on all electronics items.",
      expirationDate: "2025-01-31",
    ),
    Coupon(
      title: "Free Shipping on Orders Above \$50",
      couponCode: "FREESHIP50",
      description: "Enjoy free shipping on orders above \$50.",
      expirationDate: "2025-02-15",
    ),
    Coupon(
      title: "15% Off on Fashion Items",
      couponCode: "FASH15",
      description: "Save 15% on all fashion products.",
      expirationDate: "2025-03-01",
    ),
  ];

  int _currentIndex = 3;

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Header(),  // Use the Header component
      body: CouponList(coupons: coupons), // Use CouponList component
      bottomNavigationBar: CustomBottomNavigation(
        currentIndex: _currentIndex,
        onTap: _onTabTapped,
      ), // Use the BottomNavigation component
    );
  }
}

// Coupon List Component (Renamed from DealsList)

class CouponList extends StatelessWidget {
  final List<Coupon> coupons;

  const CouponList({Key? key, required this.coupons}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: coupons.length,
      itemBuilder: (context, index) {
        final coupon = coupons[index];
        return CouponCard(coupon: coupon); // Use CouponCard instead of DealCard
      },
    );
  }
}

// Coupon Card Component (Rename from DealCard)
class CouponCard extends StatelessWidget {
  final Coupon coupon;

  const CouponCard({Key? key, required this.coupon}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 5.0,
      margin: const EdgeInsets.only(bottom: 16.0),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12.0),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16.0),
        title: Text(
          coupon.title,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16.0,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Code: ${coupon.couponCode}", style: const TextStyle(fontSize: 14.0)),
            const SizedBox(height: 8.0),
            Text(coupon.description, style: const TextStyle(fontSize: 14.0)),
            const SizedBox(height: 8.0),
            Text("Expires: ${coupon.expirationDate}", style: const TextStyle(fontSize: 12.0)),
          ],
        ),
        trailing: IconButton(
          icon: const Icon(Icons.copy),
          onPressed: () {
            // Copy coupon code to clipboard functionality
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Coupon code copied to clipboard')),
            );
          },
        ),
      ),
    );
  }
}

// Coupon Model (Renamed from Deal)
class Coupon {
  final String title;
  final String couponCode;
  final String description;
  final String expirationDate;

  Coupon({
    required this.title,
    required this.couponCode,
    required this.description,
    required this.expirationDate,
  });
}
