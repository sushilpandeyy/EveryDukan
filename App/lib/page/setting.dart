import 'package:flutter/material.dart';

class SettingsScreen extends StatefulWidget {
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Notification Preferences',
            style: TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
      ),
      body: Container(
        color: Theme.of(context).colorScheme.background,
        child: ListView(
          children: [
            _buildHeaderCard(),
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
              'Electronics and Accessories',
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
            SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildHeaderCard() {
    return Card(
      margin: EdgeInsets.all(16),
      elevation: 0,
      color: Theme.of(context).colorScheme.primaryContainer,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Customize Your Notifications',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            SizedBox(height: 8),
            Text(
              'Select the categories you want to receive notifications for.',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryCard(
    String title,
    IconData icon,
    Map<String, bool> preferences,
    Color color,
  ) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: Theme.of(context).colorScheme.outline.withOpacity(0.2),
        ),
      ),
      child: ExpansionTile(
        leading: Icon(icon, color: color),
        title: Text(
          title,
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
        children: [
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Column(
              children: [
                _buildPreferenceSwitch('Male', preferences, 'male'),
                Divider(),
                _buildPreferenceSwitch('Female', preferences, 'female'),
              ],
            ),
          ),
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

  void _updateNotificationPreferences(
    Map<String, bool> preferences,
    String key,
    bool value,
  ) {
    // Here you would implement the logic to update notification preferences
    // For example, using OneSignal tags or your backend API
    print('Updated $key to $value');
  }
}