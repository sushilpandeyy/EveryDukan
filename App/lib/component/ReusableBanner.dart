import 'package:flutter/material.dart';

class ReusableBanner extends StatelessWidget {
  final String imageUrl;
  final VoidCallback onImageTapped;

  const ReusableBanner({
    Key? key,
    required this.imageUrl,
    required this.onImageTapped,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onImageTapped, // Handle tap event on the image
      child: Container(
        width: double.infinity, // Make the banner full width
        height: 200.0, // Adjust height as needed
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16.0), // Rounded edges
          image: DecorationImage(
            image: NetworkImage(imageUrl), // Image from URL
            fit: BoxFit.cover, // Ensures the image covers the whole container
          ),
        ),
      ),
    );
  }
}
