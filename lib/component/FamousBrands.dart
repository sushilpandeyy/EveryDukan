import 'package:flutter/material.dart';

class FamousBrandsComponent extends StatelessWidget {
  final String title;
  final List<BrandCardModel> brandCards;

  const FamousBrandsComponent({
    Key? key,
    required this.title,
    required this.brandCards,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 16.0), // Top and bottom margin
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Horizontal Scrollable Brand Cards
          SizedBox(
            height: 180, // Adjust the height of the cards
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: brandCards.length,
              itemBuilder: (context, index) {
                final brand = brandCards[index];
                return Padding(
                  padding: const EdgeInsets.only(left: 16.0, right: 8.0),
                  child: BrandCard(
                    logoUrl: brand.logoUrl,
                    tag: brand.tag,
                    buttonText: brand.buttonText,
                    onButtonPressed: brand.onButtonPressed,
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class BrandCard extends StatelessWidget {
  final String logoUrl;
  final String? tag; // Tag can be null
  final String buttonText;
  final VoidCallback onButtonPressed;

  const BrandCard({
    Key? key,
    required this.logoUrl,
    this.tag,
    required this.buttonText,
    required this.onButtonPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 160, // Adjust width of each card
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12.0),
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.3),
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // If there's a tag, display it
          if (tag != null)
            Container(
              decoration: BoxDecoration(
                color: Colors.red,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(12.0),
                  topRight: Radius.circular(12.0),
                ),
              ),
              padding: const EdgeInsets.symmetric(vertical: 4.0, horizontal: 8.0),
              child: Text(
                tag!,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
          // Logo
          Expanded(
            child: Center(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8.0),
                child: Image.network(
                  logoUrl,
                  width: double.infinity,
                  height: double.infinity,
                  fit: BoxFit.contain, // Ensures the image fits without getting cut
                ),
              ),
            ),
          ),
          // Button
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: ElevatedButton(
              onPressed: onButtonPressed,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8.0),
                ),
              ),
              child: Text(buttonText),
            ),
          ),
        ],
      ),
    );
  }
}

class BrandCardModel {
  final String logoUrl;
  final String? tag; // Tag is optional
  final String buttonText;
  final VoidCallback onButtonPressed;

  BrandCardModel({
    required this.logoUrl,
    this.tag,
    required this.buttonText,
    required this.onButtonPressed,
  });
}
