import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_core/firebase_core.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  _SettingsScreenState createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  
  // Initialize preference maps for each category
  Map<String, bool> fashionPrefs = {
    'male': false,
    'female': false,
  };
  Map<String, bool> beautyPrefs = {
    'male': false,
    'female': false,
  };
  Map<String, bool> foodPrefs = {
    'male': false,
    'female': false,
  };
  Map<String, bool> electronicsPrefs = {
    'male': false,
    'female': false,
  };
  Map<String, bool> healthPrefs = {
    'male': false,
    'female': false,
  };
  Map<String, bool> homePrefs = {
    'male': false,
    'female': false,
  };
  Map<String, bool> babyPrefs = {
    'male': false,
    'female': false,
  };
 FirebaseAnalytics? analytics = FirebaseAnalytics.instance;

 Future<void> initializeFirebase() async {
    try {
      await Firebase.initializeApp();
      // analytics is already initialized as FirebaseAnalytics.instance
      // Log home page open event
      await analytics?.logEvent(
        name: 'Setting_page_open',
        parameters: {
          'timestamp': DateTime.now().toIso8601String(),
        },
      );
    } catch (e) {
      debugPrint('Failed to initialize Firebase Analytics: $e');
    }
  } 

  @override
  void initState() {
    super.initState();
    initializeFirebase();
    _fetchUserPreferences();
  }

  Future<void> _fetchUserPreferences() async {
    try {
      // Get OneSignal tags
      final tags = await OneSignal.User.getTags();
      
      if (tags.isEmpty) {
        print('No tags found');
        return;
      }

      // Parse the preferences code from tags
      final String? preferencesCode = tags['preferences'] as String?;
      final String? gender = tags['gender'] as String?;

      if (preferencesCode != null) {
        setState(() {
          // Update all preferences based on category codes
          _updatePreferencesFromCode(preferencesCode, gender ?? 'male');
        });
      }
    } catch (e) {
      print('Error fetching preferences: $e');
    }
  }

  void _updatePreferencesFromCode(String preferencesCode, String gender) {
    // Reset all preferences
    void resetPrefs(Map<String, bool> prefs) {
      prefs['male'] = false;
      prefs['female'] = false;
    }

    // Reset all category preferences
    resetPrefs(fashionPrefs);
    resetPrefs(beautyPrefs);
    resetPrefs(foodPrefs);
    resetPrefs(electronicsPrefs);
    resetPrefs(healthPrefs);
    resetPrefs(homePrefs);
    resetPrefs(babyPrefs);

    // Update preferences based on code
    for (var char in preferencesCode.split('')) {
      switch (char) {
        case 'F':
          fashionPrefs[gender] = true;
          break;
        case 'B':
          beautyPrefs[gender] = true;
          break;
        case 'D':
          foodPrefs[gender] = true;
          break;
        case 'E':
          electronicsPrefs[gender] = true;
          break;
        case 'H':
          healthPrefs[gender] = true;
          break;
        case 'L':
          homePrefs[gender] = true;
          break;
        case 'C':
          babyPrefs[gender] = true;
          break;
      }
    }
  }

  String _generatePreferencesCode() {
    final Set<String> selectedCategories = {};
    
    // Check each preference map and add corresponding category if enabled
    void checkPrefs(Map<String, bool> prefs, String category) {
      if (prefs['male'] == true || prefs['female'] == true) {
        selectedCategories.add(category);
      }
    }

    checkPrefs(fashionPrefs, 'Fashion');
    checkPrefs(beautyPrefs, 'Beauty');
    checkPrefs(foodPrefs, 'Food');
    checkPrefs(electronicsPrefs, 'Electronics');
    checkPrefs(healthPrefs, 'Health');
    checkPrefs(homePrefs, 'Home');
    checkPrefs(babyPrefs, 'Baby Care');

    // Sort categories and generate code
    final List<String> sortedCategories = selectedCategories.toList()..sort();
    final StringBuffer code = StringBuffer();
    
    final Map<String, String> categoryToCode = {
      'Fashion': 'F',
      'Beauty': 'B',
      'Food': 'D',
      'Electronics': 'E',
      'Health': 'H',
      'Home': 'L',
      'Baby Care': 'C',
    };

    for (final String category in sortedCategories) {
      final String? categoryCode = categoryToCode[category];
      if (categoryCode != null) {
        code.write(categoryCode);
      }
    }
    
    return code.toString();
  }

  // Update the existing _updateNotificationPreferences method
  void _updateNotificationPreferences(
    Map<String, bool> preferences,
    String key,
    bool value,
  ) async {
    try {
      // Generate the new preferences code
      final String preferencesCode = _generatePreferencesCode();
      
      // Update OneSignal tags
      await OneSignal.User.addTags({
        'gender': key,
        'preferences': preferencesCode,
      });

      print('Updated OneSignal tags - Gender: $key, Preferences: $preferencesCode');
    } catch (e) {
      print('Error updating preferences: $e');
      // Optionally show an error message to the user
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to update preferences. Please try again.'),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Settings',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        elevation: 0,
      ),
      body: Container(
        color: Theme.of(context).colorScheme.background,
        child: ListView(
          children: [
            _buildHeaderCard(),
            _buildNotificationSection(),
            _buildSupportSection(),
            _buildLegalSection(),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildHeaderCard() {
    return Card(
      margin: const EdgeInsets.all(16),
      elevation: 0,
      color: Theme.of(context).colorScheme.primaryContainer,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Customize Your Experience',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 8),
            Text(
              'Manage your preferences and app settings',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNotificationSection() {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: Theme.of(context).colorScheme.outline.withOpacity(0.2),
        ),
      ),
      child: ExpansionTile(
        leading: const Icon(Icons.notifications_outlined),
        title: const Text(
          'Notification Preferences',
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
        children: [
          _buildCategoryCard(
            'Fashion and Apparel',
            Icons.shopping_bag_outlined,
            fashionPrefs,
            Colors.amber,
          ),
          _buildCategoryCard(
            'Beauty and Personal Care',
            Icons.face_outlined,
            beautyPrefs,
            Colors.pink,
          ),
          _buildCategoryCard(
            'Food and Beverages',
            Icons.restaurant_outlined,
            foodPrefs,
            Colors.orange,
          ),
          _buildCategoryCard(
            'Electronics',
            Icons.devices_outlined,
            electronicsPrefs,
            Colors.purple,
          ),
          _buildCategoryCard(
            'Health and Wellness',
            Icons.favorite_outline,
            healthPrefs,
            Colors.green,
          ),
          _buildCategoryCard(
            'Home and Living',
            Icons.home_outlined,
            homePrefs,
            Colors.brown,
          ),
          _buildCategoryCard(
            'Baby and Mother Care',
            Icons.child_care_outlined,
            babyPrefs,
            Colors.red,
          ),
        ],
      ),
    );
  }

  Widget _buildSupportSection() {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: Theme.of(context).colorScheme.outline.withOpacity(0.2),
        ),
      ),
      child: Column(
        children: [
          ListTile(
            leading: const Icon(Icons.contact_support_outlined),
            title: const Text('Contact Us'),
            onTap: () => _launchEmail('contact.sushilpandey@gmail.com'),
          ),
          const Divider(height: 1),
          ListTile(
            leading: const Icon(Icons.star_outline),
            title: const Text('Rate Us'),
            onTap: () => _launchPlayStore(),
          ),
          const Divider(height: 1),
          ListTile(
            leading: const Icon(Icons.share_outlined),
            title: const Text('Share App'),
            onTap: () => _shareApp(),
          ),
        ],
      ),
    );
  }

  Widget _buildLegalSection() {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: Theme.of(context).colorScheme.outline.withOpacity(0.2),
        ),
      ),
      child: Column(
        children: [
          ListTile(
            leading: const Icon(Icons.privacy_tip_outlined),
            title: const Text('Privacy Policy'),
            onTap: () => _launchURL('https://dealspotter.com/privacy'),
          ),
          const Divider(height: 1),
          ListTile(
            leading: const Icon(Icons.description_outlined),
            title: const Text('Terms of Service'),
            onTap: () => _launchURL('https://dealspotter.com/terms'),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryCard(
    String title,
    IconData icon,
    Map<String, bool> preferences,
    Color color,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        children: [
          Row(
            children: [
              Icon(icon, color: color),
              const SizedBox(width: 16),
              Text(
                title,
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
            ],
          ),
          const SizedBox(height: 8),
          _buildPreferenceSwitch('Male', preferences, 'male'),
          const Divider(),
          _buildPreferenceSwitch('Female', preferences, 'female'),
        ],
      ),
    );
  }

  Widget _buildPreferenceSwitch(
    String title,
    Map<String, bool> preferences,
    String key,
  ) {
    return SwitchListTile(
      title: Text(title),
      value: preferences[key] ?? false,
      onChanged: (bool value) {
        setState(() {
          preferences[key] = value;
          _updateNotificationPreferences(preferences, key, value);
        });
      },
      activeColor: Theme.of(context).colorScheme.primary,
    );
  }
 

  Future<void> _launchEmail(String email) async {
    final Uri emailUri = Uri(
      scheme: 'mailto',
      path: email,
      query: 'subject=Support Request&body=Hello, I need assistance with...',
    );
    if (await canLaunchUrl(emailUri)) {
      await launchUrl(emailUri);
    } else {
      // Handle error
      print('Could not launch email');
    }
  }

  Future<void> _launchPlayStore() async {
    final Uri playStoreUri = Uri.parse(
      'market://details?id=com.dealspotter.app',
    );
    if (await canLaunchUrl(playStoreUri)) {
      await launchUrl(playStoreUri);
    } else {
      // Fallback to website
      await _launchURL(
        'https://play.google.com/store/apps/details?id=com.dealspotter.app',
      );
    }
  }

  Future<void> _launchURL(String urlString) async {
    final Uri url = Uri.parse(urlString);
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    } else {
      // Handle error
      print('Could not launch $urlString');
    }
  }

  void _shareApp() {
    // Implement share functionality
    // You can use the share_plus package
    print('Sharing app...');
  }
}