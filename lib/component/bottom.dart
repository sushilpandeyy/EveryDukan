import 'package:flutter/material.dart';

class CustomBottomNavigation extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const CustomBottomNavigation({
    Key? key,
    required this.currentIndex,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.2),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: BottomNavigationBar(
        currentIndex: currentIndex,
        onTap: (index) {
          if (index == 2) {
            // Route to /shops when the "Shops" tab is clicked
            Navigator.pushNamed(context, '/shops');
          } else if(index == 0){
            Navigator.pushNamed(context, '/');
          } 
          else if(index == 3){
            Navigator.pushNamed(context, '/coupon');
          } 
          else {
            // Call the provided onTap function for other tabs
            onTap(index);
          }
        },
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        selectedItemColor: Colors.blue,
        unselectedItemColor: Colors.grey,
        selectedLabelStyle: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
        unselectedLabelStyle: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.local_fire_department),  // Changed to fire icon
            activeIcon: Icon(Icons.local_fire_department),  // Active state of fire icon
            label: 'Deals',  // Keep the label 'Deals'
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.store_outlined),
            activeIcon: Icon(Icons.store),
            label: 'Shops',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.card_giftcard_outlined),  // Coupon icon
            activeIcon: Icon(Icons.card_giftcard),  // Active state of coupon icon
            label: 'Coupon',  // Changed the label to 'Coupon'
          ),
        ],
      ),
    );
  }
}
