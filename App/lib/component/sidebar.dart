import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import '../page/setting.dart';

class SidebarDrawer extends StatelessWidget {
  const SidebarDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: Colors.white,
      child: Column(  // Removed SafeArea
        children: [
          // Status bar height padding
          Container(
            height: MediaQuery.of(context).padding.top,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  const Color(0xFFf7cd72),
                  const Color(0xFFf7cd72).withOpacity(0.8),
                ],
              ),
            ),
          ),
          // Header Section with Gradient Background
          Container(
            width: double.infinity,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  const Color(0xFFf7cd72),
                  const Color(0xFFf7cd72).withOpacity(0.8),
                ],
              ),
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(24),
                bottomRight: Radius.circular(24),
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const SizedBox(height: 32),
                Container(
                  height: 88,
                  width: 88,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.9),
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Center(
                    child: ClipOval(
                      child: SizedBox(
                        height: 64,
                        width: 64,
                        child: Image.asset(
                          'assets/logo.png',
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                // Rest of the header content remains the same
                const Text(
                  'EveryDukan',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Text(
                    'Discover Amazing Deals',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.black87,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
            
            const SizedBox(height: 16),
            
            // Menu Items
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                children: [
                  _buildSection(
                    title: 'MAIN MENU',
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
                        onTap: () => Navigator.pushReplacementNamed(context, '/coupon'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  _buildSection(
                    title: 'OTHER',
                    children: [
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
                ],
              ),
            ),
            
            // Footer
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(24),
                  topRight: Radius.circular(24),
                ),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Text(
                        'Made with ',
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey,
                          letterSpacing: 0.3,
                        ),
                      ),
                      Icon(
                        Icons.favorite,
                        color: Colors.red,
                        size: 14,
                      ),
                      Text(
                        ' by EveryDukan',
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey,
                          letterSpacing: 0.3,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
    );
  }

  Widget _buildSection({
    required String title,
    required List<Widget> children,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Text(
            title,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: Colors.grey[600],
              letterSpacing: 1.2,
            ),
          ),
        ),
        ...children,
      ],
    );
  }

  Widget _buildMenuItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    final bool isCurrentRoute = ModalRoute.of(context)?.settings.name == '/$title'.toLowerCase();
    final Color activeColor = const Color(0xFFf7cd72);
    
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 4),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: isCurrentRoute ? activeColor.withOpacity(0.15) : Colors.transparent,
      ),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: isCurrentRoute ? activeColor.withOpacity(0.2) : Colors.grey[100],
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(
            icon,
            color: isCurrentRoute ? activeColor : Colors.grey[700]!,
            size: 22,
          ),
        ),
        title: Text(
          title,
          style: TextStyle(
            fontSize: 15,
            fontWeight: isCurrentRoute ? FontWeight.w600 : FontWeight.w500,
            color: isCurrentRoute ? Colors.black87 : Colors.grey[800],
            letterSpacing: 0.3,
          ),
        ),
        onTap: onTap,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
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