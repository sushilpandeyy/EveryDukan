import 'package:flutter/material.dart';

class Header extends StatelessWidget implements PreferredSizeWidget {
  const Header({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.transparent, // Transparent background
      elevation: 0, // No shadow or elevation
      title: Center(
        child: Image.asset(
          'assets/logo.png', // Replace with your logo asset
          height: 40, // Adjust size as needed
        ),
      ),
      leading: IconButton(
        icon: const Icon(Icons.menu, color: Colors.black), // Minimalist sidebar icon
        onPressed: () {
          Scaffold.of(context).openDrawer();
        },
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.search, color: Colors.black), // Search icon
          onPressed: () {
            // Add your search functionality here
          },
        ),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
