import 'package:flutter/material.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class OnboardingScreen extends StatefulWidget {
  final VoidCallback? onComplete;

  const OnboardingScreen({
    super.key,
    this.onComplete,
  });

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}


class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  final TextEditingController _nameController = TextEditingController();
  bool _isLastPage = false;
  int _currentPage = 0;
  String _selectedGender = '';
  
  final Set<String> _selectedCategories = {
    'Fashion', 'Beauty', 'Food', 'Electronics', 'Health', 'Home', 'Baby Care'
  };
  
  final List<CategoryData> _categories = [
    CategoryData('Fashion', Icons.shopping_bag_outlined),
    CategoryData('Beauty', Icons.face_outlined),
    CategoryData('Food', Icons.restaurant_outlined),
    CategoryData('Electronics', Icons.devices_outlined),
    CategoryData('Health', Icons.favorite_outline),
    CategoryData('Home', Icons.home_outlined),
    CategoryData('Baby Care', Icons.child_care_outlined),
  ];

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        // Allow back navigation but don't force onboarding completion
        if (_currentPage > 0) {
          _pageController.previousPage(
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeInOut,
          );
          return false;
        }
        return true;
      },
      child: Scaffold(
        backgroundColor: Colors.white,
        body: SafeArea(
          child: Container(
            padding: const EdgeInsets.only(bottom: 80),
            child: PageView(
              controller: _pageController,
              physics: const NeverScrollableScrollPhysics(),
              onPageChanged: (index) {
                setState(() {
                  _currentPage = index;
                  _isLastPage = index == 3;
                });
              },
              children: [
                _buildWelcomePage(),
                _buildNameInputPage(),
                _buildGenderSelectionPage(),
                _buildCategorySelectionPage(),
              ],
            ),
          ),
        ),
        bottomSheet: _isLastPage
            ? _buildGetStartedButton()
            : _buildNavigationBar(),
      ),
    );
  }

 Widget _buildNameInputPage() {
  return Padding(
    padding: const EdgeInsets.all(20),
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          'What\'s your name?',
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Let us personalize your experience',
          style: TextStyle(
            color: Colors.grey.shade600,
            fontSize: 16,
          ),
        ),
        const SizedBox(height: 30),
        TextFormField(
          controller: _nameController,
          textCapitalization: TextCapitalization.words,
          autovalidateMode: AutovalidateMode.onUserInteraction,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter your name';
            }
            if (value.trim().length < 2) {
              return 'Name must be at least 2 characters';
            }
            if (value.trim().length > 50) {
              return 'Name must be less than 50 characters';
            }
            if (!RegExp(r'^[a-zA-Z\s]+$').hasMatch(value)) {
              return 'Please use only letters and spaces';
            }
            return null;
          },
          onChanged: (value) {
            setState(() {
              // Trigger rebuild for the navigation bar
            });
          },
          decoration: InputDecoration(
            labelText: 'Enter your name',
            hintText: 'e.g. John Smith',
            prefixIcon: const Icon(Icons.person_outline),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey.shade300),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey.shade300),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Theme.of(context).primaryColor, width: 2),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.red.shade300),
            ),
            filled: true,
            fillColor: Colors.grey.shade50,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          ),
        ),
      ],
    ),
  );
}

// Also update the navigation validation logic
bool _isNameValid() {
  final name = _nameController.text.trim();
  return name.isNotEmpty && 
         name.length >= 2 && 
         name.length <= 50 && 
         RegExp(r'^[a-zA-Z\s]+$').hasMatch(name);
}

// Update the navigation bar's next button logic
 Widget _buildNavigationBar() {
    final bool canProceed = _currentPage != 1 || _isNameValid();
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      height: 80,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          TextButton(
            onPressed: () {
              // Skip onboarding and go to home
              _handleSkipOnboarding();
            },
            child: Text(
              'SKIP',
              style: TextStyle(
                color: Colors.grey.shade600,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          SmoothPageIndicator(
            controller: _pageController,
            count: 4,
            effect: ExpandingDotsEffect(
              dotColor: Colors.grey.shade300,
              activeDotColor: Theme.of(context).primaryColor,
            ),
          ),
          TextButton(
            onPressed: canProceed ? () => _handleNext() : null,
            style: TextButton.styleFrom(
              backgroundColor: canProceed 
                ? Theme.of(context).primaryColor 
                : Colors.grey.shade300,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: Text(
              'NEXT',
              style: TextStyle(
                color: canProceed ? Colors.white : Colors.grey.shade600,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

void _handleNext() {
    if (_currentPage == 1 && !_isNameValid()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid name')),
      );
      return;
    }

    _pageController.nextPage(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

Future<void> _handleSkipOnboarding() async {
    try {
      // Get device token
      final deviceState = await OneSignal.User.pushSubscription;
      final fcmToken = deviceState.token ?? '';

      // Prepare data with default values
      final name = _nameController.text.trim().isEmpty ? "Skip" : _nameController.text.trim();
      final gender = _selectedGender.isEmpty ? "skip" : _selectedGender.toLowerCase();
      final preferences = _selectedCategories.isEmpty ? 
          {'Fashion', 'Beauty', 'Food', 'Electronics', 'Health', 'Home', 'Baby Care'} : 
          _selectedCategories;

      // Update OneSignal tags
      await OneSignal.User.addTags({
        'name': name,
        'gender': gender,
        'preferences': CategoryCode.generateCode(preferences)
      });

      // Make API call with default values
      await http.post(
        Uri.parse('${ApiService.baseUrl}/user/add'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'name': name,
          'preferences': preferences.toList(),
          'gender': gender,
          'fcmToken': fcmToken,
        }),
      );

      // Mark onboarding as completed
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('has_completed_onboarding', true);
      
      // Trigger completion callback if provided
      if (widget.onComplete != null) {
        widget.onComplete!();
      }
      
      if (mounted) {
        Navigator.of(context).pushReplacementNamed('/home');
      }
    } catch (e) {
      debugPrint('Error during skip onboarding: $e');
      // Still proceed to home screen even if API/preferences fails
      if (mounted) {
        Navigator.of(context).pushReplacementNamed('/home');
      }
    }
  }


  Widget _buildWelcomePageWithLottie() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Image.asset(
            'assets/logo.png',
            height: 120,
            width: 120,
          ),
          const SizedBox(height: 60),
          Text(
            'Welcome to EveryDukan!',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 20),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              children: [
                Text(
                  'Your Ultimate Destination for',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    color: Colors.black54,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Indian D2C Brands & Marketplace Deals',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).primaryColor,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Discover exclusive discounts, latest deals, and amazing coupons from your favorite brands.',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Colors.black54,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildWelcomePage() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Image.asset(
            'assets/logo.png',
            height: 120,
            width: 120,
          ),
          const SizedBox(height: 60),
          Text(
            'Welcome to EveryDukan!',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 20),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              children: [
                Text(
                  'Your Ultimate Destination for',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    color: Colors.black54,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Indian D2C Brands & Marketplace Deals',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).primaryColor,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Discover exclusive discounts, latest deals, and amazing coupons from your favorite brands.',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Colors.black54,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGenderSelectionPage() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            'Tell us about yourself',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Help us personalize your deal recommendations',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Colors.grey.shade600,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 40),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildGenderCard('Male', Icons.male),
              _buildGenderCard('Female', Icons.female),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildGenderCard(String gender, IconData icon) {
    final isSelected = _selectedGender == gender;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedGender = gender;
          _updateOneSignalTags();
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isSelected ? Theme.of(context).primaryColor : Colors.white,
          borderRadius: BorderRadius.circular(15),
          boxShadow: [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 10,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 50,
              color: isSelected ? Colors.white : Colors.black,
            ),
            const SizedBox(height: 10),
            Text(
              gender,
              style: TextStyle(
                color: isSelected ? Colors.white : Colors.black,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategorySelectionPage() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Text(
            'Choose Your Interests',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Get personalized notifications for deals and offers\nin categories that matter to you',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Colors.grey.shade600,
              height: 1.5,
            ),
          ),
          Container(
            margin: const EdgeInsets.symmetric(vertical: 8),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.green.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              'Currently all categories are selected',
              style: TextStyle(
                color: Colors.green.shade700,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          const SizedBox(height: 12),
          Expanded(
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 1.5,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
              ),
              itemCount: _categories.length,
              itemBuilder: (context, index) {
                final category = _categories[index];
                final isSelected = _selectedCategories.contains(category.name);
                return _buildCategoryCard(category, isSelected);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryCard(CategoryData category, bool isSelected) {
    return GestureDetector(
      onTap: () {
        setState(() {
          if (isSelected) {
            _selectedCategories.remove(category.name);
          } else {
            _selectedCategories.add(category.name);
          }
          _updateOneSignalTags();
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        decoration: BoxDecoration(
          color: isSelected ? Theme.of(context).primaryColor : Colors.white,
          borderRadius: BorderRadius.circular(15),
          boxShadow: [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 10,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              category.icon,
              size: 30,
              color: isSelected ? Colors.white : Colors.black,
            ),
            const SizedBox(height: 10),
            Text(
              category.name,
              style: TextStyle(
                color: isSelected ? Colors.white : Colors.black,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGetStartedButton() {
    return Container(
      padding: const EdgeInsets.all(20),
      width: double.infinity,
      child: Row(
        children: [
          TextButton(
            onPressed: _handleSkipOnboarding,
            child: Text(
              'SKIP',
              style: TextStyle(
                color: Colors.grey.shade600,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Expanded(
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 15),
                backgroundColor: Theme.of(context).primaryColor,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: () => _completeOnboarding(),
              child: const Text(
                'Get Started',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

Future<void> _completeOnboarding() async {
    try {
      await _savePreferences();
      
      if (widget.onComplete != null) {
        widget.onComplete!();
      }

      if (mounted) {
        Navigator.of(context).pushReplacementNamed('/home');
      }
    } catch (e) {
      debugPrint('Error completing onboarding: $e');
      // Still proceed to home screen even if saving preferences fails
      if (mounted) {
        Navigator.of(context).pushReplacementNamed('/home');
      }
    }
  }

  void _updateOneSignalTags() {
    if (_selectedGender.isNotEmpty) {
      OneSignal.User.addTags({
        'gender': _selectedGender.toLowerCase(),
        'preferences': CategoryCode.generateCode(_selectedCategories)
      });
    }
  }

Future<void> _savePreferences() async {
    try {
      final deviceState = await OneSignal.User.pushSubscription;
      final fcmToken = deviceState.token ?? '';

      // Update OneSignal tags
      await OneSignal.User.addTags({
        'name': _nameController.text.trim(),
        'gender': _selectedGender.toLowerCase(),
        'preferences': CategoryCode.generateCode(_selectedCategories)
      });

      // Save to API
      await http.post(
        Uri.parse('${ApiService.baseUrl}/user/add'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'name': _nameController.text.trim(),
          'preferences': _selectedCategories.toList(),
          'gender': _selectedGender.toLowerCase(),
          'fcmToken': fcmToken,
        }),
      );

      // Mark onboarding as completed
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('has_completed_onboarding', true);
    } catch (e) {
      debugPrint('Error saving preferences: $e');
      // Let the error propagate to be handled by the caller
      throw e;
    }
  }



  @override
  void dispose() {
    _pageController.dispose();
    _nameController.dispose();
    super.dispose();
  }
}

class ApiResponse {
  final int statusCode;
  final UserResponseData body;

  ApiResponse({required this.statusCode, required this.body});

  factory ApiResponse.fromJson(Map<String, dynamic> json) {
    return ApiResponse(
      statusCode: json['statusCode'],
      body: UserResponseData.fromJson(jsonDecode(json['body'])),
    );
  }
}

class UserResponseData {
  final String message;
  final UserData user;

  UserResponseData({required this.message, required this.user});

  factory UserResponseData.fromJson(Map<String, dynamic> json) {
    return UserResponseData(
      message: json['message'],
      user: UserData.fromJson(json['user']),
    );
  }
}

class UserData {
  final String name;
  final List<String> preferences;
  final String gender;
  final String fcmToken;
  final String createdAt;
  final String lastVisitedAt;
  final String id;

  UserData({
    required this.name,
    required this.preferences,
    required this.gender,
    required this.fcmToken,
    required this.createdAt,
    required this.lastVisitedAt,
    required this.id,
  });

  factory UserData.fromJson(Map<String, dynamic> json) {
    return UserData(
      name: json['name'],
      preferences: List<String>.from(json['preferences']),
      gender: json['gender'],
      fcmToken: json['fcmToken'],
      createdAt: json['createdAt'],
      lastVisitedAt: json['lastVisitedAt'],
      id: json['_id'],
    );
  }
}


class ApiService {
  static const String baseUrl = 'https://19ax8udl06.execute-api.ap-south-1.amazonaws.com';

  static Future<String?> addUser({
    required String name,
    required List<String> preferences,
    required String gender,
    required String fcmToken,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/user/add'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'name': name,
          'preferences': preferences,
          'gender': gender,
          'fcmToken': fcmToken,
        }),
      );

      if (response.statusCode == 201) {
        final apiResponse = ApiResponse.fromJson(json.decode(response.body));
        return apiResponse.body.user.id;
      }
      return null;
    } catch (e) {
      print('Error adding user: $e');
      return null;
    }
  }
}

class CategoryData {
  final String name;
  final IconData icon;

  const CategoryData(this.name, this.icon);
}

class CategoryCode {
  static const Map<String, String> categoryToCode = {
    'Fashion': 'F',
    'Beauty': 'B',
    'Food': 'D',
    'Electronics': 'E',
    'Health': 'H',
    'Home': 'L',
    'Baby Care': 'C',
  };

  static String generateCode(Set<String> selectedCategories) {
    final List<String> sortedCategories = selectedCategories.toList()..sort();
    final StringBuffer code = StringBuffer();
    
    for (final String category in sortedCategories) {
      final String? categoryCode = categoryToCode[category];
      if (categoryCode != null) {
        code.write(categoryCode);
      }
    }
    
    return code.toString();
  }
}