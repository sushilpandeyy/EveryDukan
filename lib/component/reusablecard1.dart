import 'package:flutter/material.dart';

class ReusableBannerComponent extends StatelessWidget {
  final String title;
  final VoidCallback onViewAll;
  final List<BannerCardModel> banners;

  const ReusableBannerComponent({
    Key? key,
    required this.title,
    required this.onViewAll,
    required this.banners,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 16.0), // Top and bottom margin
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title and "View All"
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                GestureDetector(
                  onTap: onViewAll,
                  child: const Text(
                    'View All',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.blue,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Horizontal Scrollable Banner Cards
          SizedBox(
            height: 220,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: banners.length,
              itemBuilder: (context, index) {
                final banner = banners[index];
                return Padding(
                  padding: const EdgeInsets.only(left: 16.0, right: 8.0),
                  child: GestureDetector(
                    onTap: banner.onButtonPressed, // Trigger the onButtonPressed on card tap
                    child: BannerCard(
                      imageUrl: banner.imageUrl,
                      buttonText: banner.buttonText,
                      onButtonPressed: banner.onButtonPressed,
                    ),
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

class BannerCard extends StatelessWidget {
  final String imageUrl;
  final String buttonText;
  final VoidCallback onButtonPressed;

  const BannerCard({
    Key? key,
    required this.imageUrl,
    required this.buttonText,
    required this.onButtonPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 260, // Wider width for the banner card
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
          // Image Banner
          ClipRRect(
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(12.0),
              topRight: Radius.circular(12.0),
            ),
            child: Image.network(
              imageUrl,
              height: 140,
              fit: BoxFit.cover,
            ),
          ),

          // Button Area
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

class BannerCardModel {
  final String imageUrl;
  final String buttonText;
  final VoidCallback onButtonPressed;

  BannerCardModel({
    required this.imageUrl,
    required this.buttonText,
    required this.onButtonPressed,
  });
}
