import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';

class Header extends StatelessWidget implements PreferredSizeWidget {
  const Header({super.key});


void _shareApp() {
    Share.share(
      'Check out EveryDukan for amazing deals and offers!\nhttps://play.google.com/store/apps/details?id=com.everydukan',
      subject: 'EveryDukan - Your Deal Discovery App',
    );
  }
  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.transparent, // Transparent background
      elevation: 0, // No shadow or elevation
      title: Row(
        mainAxisAlignment: MainAxisAlignment.center, // Center the logo
        children: [
          Image.asset(
            'assets/logo.png', // Replace with your logo asset
            height: 40, // Adjust size as needed
          ),
        ],
      ),
      leading: IconButton(
        icon: const Icon(Icons.menu, color: Colors.black), // Minimalist sidebar icon
        onPressed: () {
          Scaffold.of(context).openDrawer();
        },
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.share_rounded, color: Colors.black),
          onPressed: _shareApp,
          tooltip: 'Share App',
        )
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
