import 'package:flutter/material.dart';


class DealsList extends StatelessWidget {
  final List<Deal> deals;

  const DealsList({Key? key, required this.deals}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: deals.length,
      itemBuilder: (context, index) {
        final deal = deals[index];
        return DealCard(deal: deal);
      },
    );
  }
}

// Deal Model
class Deal {
  final String title;
  final String couponCode;
  final String description;
  final String expirationDate;

  Deal({
    required this.title,
    required this.couponCode,
    required this.description,
    required this.expirationDate,
  });
}

// Deal Card Component
class DealCard extends StatelessWidget {
  final Deal deal;

  const DealCard({
    Key? key,
    required this.deal,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16.0),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12.0),
      ),
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              deal.title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              deal.description,
              style: const TextStyle(fontSize: 14, color: Colors.grey),
            ),
            const SizedBox(height: 8),
            Text(
              "Expires: ${deal.expirationDate}",
              style: const TextStyle(fontSize: 12, color: Colors.red),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Coupon Code: ${deal.couponCode}",
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.copy),
                  onPressed: () {
                    // Logic to copy coupon code to clipboard
                    final snackBar = SnackBar(
                      content: Text("Coupon code copied: ${deal.couponCode}"),
                    );
                    ScaffoldMessenger.of(context).showSnackBar(snackBar);
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
