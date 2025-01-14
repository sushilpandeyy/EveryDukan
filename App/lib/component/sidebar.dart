import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import '../page/setting.dart';

class SidebarDrawer extends StatelessWidget {
  const SidebarDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: SafeArea(
        child: Column(
          children: [
            // Header Section
            Container(
              width: double.infinity,
              color: const Color(0xFFf7cd72),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(height: 30),
                  Container(
                    height: 80,
                    width: 80,
                    padding: const EdgeInsets.all(8),
                    child: Image.asset(
                      'assets/logo.png',
                      fit: BoxFit.contain,
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'EveryDukan',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Discover Amazing Deals',
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.black54,
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
            // Menu Items
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(vertical: 8),
                children: [
                  _buildMenuItem(
                    context,
                    icon: Icons.home_rounded,
                    title: 'Home',
                    onTap: () => Navigator.pushReplacementNamed(context, '/home'),
                  ),
                  _buildMenuItem(
                    context,
                    icon: Icons.local_fire_department,
                    title: 'Deals',
                    onTap: () => Navigator.pushReplacementNamed(context, '/deals'),
                  ),
                  _buildMenuItem(
                    context,
                    icon: Icons.store_rounded,
                    title: 'Shops',
                    onTap: () => Navigator.pushReplacementNamed(context, '/shops'),
                  ),
                  _buildMenuItem(
                    context,
                    icon: Icons.local_offer_rounded,
                    title: 'Coupons',
                    onTap: () => Navigator.pushReplacementNamed(context, '/coupons'),
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Divider(height: 1),
                  ),
                  _buildMenuItem(
                    context,
                    icon: Icons.share_rounded,
                    title: 'Share App',
                    onTap: _shareApp,
                  ),
                  _buildMenuItem(
                    context,
                    icon: Icons.settings_rounded,
                    title: 'Settings',
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => SettingsScreen()),
                    ),
                  ),
                  _buildMenuItem(
                    context,
                    icon: Icons.help_outline_rounded,
                    title: 'Help & Support',
                    onTap: () => Navigator.pushNamed(context, '/support'),
                  ),
                ],
              ),
            ),
            // Footer
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Divider(height: 1),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Text(
                        'Made with ',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                      Icon(
                        Icons.favorite,
                        color: Colors.red,
                        size: 12,
                      ),
                      Text(
                        ' by EveryDukan',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    bool isSelected = false,
  }) {
    final bool isCurrentRoute = ModalRoute.of(context)?.settings.name == '/$title'.toLowerCase();
    
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        color: isCurrentRoute ? Colors.amber.withOpacity(0.1) : Colors.transparent,
      ),
      child: ListTile(
        leading: Icon(
          icon,
          color: isCurrentRoute ? Colors.amber : Colors.grey[700]!,
          size: 24,
        ),
        title: Text(
          title,
          style: TextStyle(
            fontSize: 15,
            fontWeight: isCurrentRoute ? FontWeight.w600 : FontWeight.normal,
            color: isCurrentRoute ? Colors.amber : Colors.grey[800] as Color,
          ),
        ),
        onTap: onTap,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 20),
        horizontalTitleGap: 12,
      ),
    );
  }

  void _shareApp() {
    Share.share(
      'Check out EveryDukan for amazing deals and offers!\nhttps://play.google.com/store/apps/details?id=com.everydukan',
      subject: 'EveryDukan - Your Deal Discovery App',
    );
  }
}