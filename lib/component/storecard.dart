import 'package:flutter/material.dart';

class StoreCard extends StatelessWidget {
  final String logoPath;
  final Color cardColor;

  const StoreCard({
    Key? key,
    required this.logoPath,
    required this.cardColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      color: cardColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12.0),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Image.asset(
            logoPath,
            height: 80.0,
            fit: BoxFit.contain,
          ),
          const SizedBox(height: 10.0),
        ],
      ),
    );
  }
}
