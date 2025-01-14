import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../component/header.dart';
import '../component/bottom.dart';
import '../component/sidebar.dart';

class CouponScreen extends StatefulWidget {
  @override
  _CouponScreenState createState() => _CouponScreenState();
}

class _CouponScreenState extends State<CouponScreen> {
  final List<Coupon> _coupons = [];
  bool _isLoading = false;
  bool _hasNextPage = true;
  final ScrollController _scrollController = ScrollController();
  int _currentPage = 1;
  int _currentIndex = 3;

  @override
  void initState() {
    super.initState();
    _loadMoreCoupons();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      if (_hasNextPage && !_isLoading) {
        _loadMoreCoupons();
      }
    }
  }

  Color _parseColor(String colorString) {
    if (colorString.startsWith('#')) {
      return Color(int.parse('0xFF${colorString.substring(1)}'));
    } else if (colorString.startsWith('0x')) {
      return Color(int.parse(colorString));
    }
    return Colors.amber; // Default color
  }

  Future<void> _loadMoreCoupons() async {
    if (_isLoading || !_hasNextPage) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final response = await http.get(
        Uri.parse('https://19ax8udl06.execute-api.ap-south-1.amazonaws.com/coupon?page=$_currentPage&limit=10'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final coupons = data['Coupon'] as List;
        final pagination = data['pagination'];

        final newCoupons = coupons.map((coupon) => Coupon(
          title: coupon['title'],
          merchantName: coupon['merchantName'],
          merchantLogo: coupon['merchantLogo'],
          couponCode: coupon['couponCode'],
          description: coupon['description'],
          expirationDate: coupon['expirationDate'],
          discount: coupon['discount'],
          category: coupon['category'],
          backgroundColor: _parseColor(coupon['backgroundColor']),
          accentColor: _parseColor(coupon['accentColor']),
          terms: List<String>.from(coupon['terms']),
        )).toList();

        setState(() {
          _coupons.addAll(newCoupons);
          _currentPage++;
          _hasNextPage = pagination['hasNextPage'];
          _isLoading = false;
        });
      } else {
        setState(() {
          _isLoading = false;
        });
        throw Exception('Failed to load coupons');
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      debugPrint('Error fetching coupons: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Header(),
      drawer: const SidebarDrawer(),
      body: SafeArea(
        child: _coupons.isEmpty && _isLoading
            ? const Center(child: CircularProgressIndicator())
            : CustomScrollView(
                controller: _scrollController,
                slivers: [
                  SliverPadding(
                    padding: EdgeInsets.all(16),
                    sliver: SliverList(
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          if (index == _coupons.length) {
                            return _hasNextPage
                                ? const Padding(
                                    padding: EdgeInsets.all(16.0),
                                    child: Center(child: CircularProgressIndicator()),
                                  )
                                : _coupons.isNotEmpty
                                    ? Padding(
                                        padding: const EdgeInsets.all(16.0),
                                        child: Text(
                                          'No more coupons available',
                                          textAlign: TextAlign.center,
                                          style: TextStyle(color: Colors.grey[600]),
                                        ),
                                      )
                                    : const SizedBox.shrink();
                          }
                          return Padding(
                            padding: EdgeInsets.only(bottom: 16),
                            child: TicketCouponCard(coupon: _coupons[index]),
                          );
                        },
                        childCount: _coupons.length + 1,
                      ),
                    ),
                  ),
                ],
              ),
      ),
      bottomNavigationBar: CustomBottomNavigation(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
      ),
    );
  }
}

class TicketCouponCard extends StatelessWidget {
  final Coupon coupon;

  const TicketCouponCard({Key? key, required this.coupon}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Material(
      color: coupon.backgroundColor,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        onTap: () => _showCouponDetails(context),
        borderRadius: BorderRadius.circular(16),
        child: Column(
          children: [
            _buildUpperSection(context),
            _buildDashedDivider(),
            _buildLowerSection(context),
          ],
        ),
      ),
    );
  }

  Widget _buildUpperSection(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 20,
                backgroundColor: Colors.white,
                child: ClipOval(
                 child: ClipOval(
  child: Image.network(
    coupon.merchantLogo, // External image URL
    width: 32,
    height: 32,
    fit: BoxFit.cover,
    errorBuilder: (context, error, stackTrace) => Icon(
      Icons.store,
      color: coupon.accentColor,
      size: 32,
    ),
    loadingBuilder: (context, child, loadingProgress) {
      if (loadingProgress == null) {
        return child;
      }
      return Center(
        child: CircularProgressIndicator(
          value: loadingProgress.expectedTotalBytes != null
              ? loadingProgress.cumulativeBytesLoaded /
                  loadingProgress.expectedTotalBytes!
              : null,
          color: coupon.accentColor,
        ),
      );
    },
  ),
),
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      coupon.merchantName,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      coupon.category,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.black54,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              _buildDiscountBadge(),
            ],
          ),
          SizedBox(height: 16),
          Text(
            coupon.title,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
            overflow: TextOverflow.ellipsis,
            maxLines: 2,
          ),
          SizedBox(height: 8),
          Text(
            coupon.description,
            style: TextStyle(
              fontSize: 14,
              color: Colors.black54,
            ),
            overflow: TextOverflow.ellipsis,
            maxLines: 2,
          ),
        ],
      ),
    );
  }

  Widget _buildDiscountBadge() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: coupon.accentColor,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        coupon.discount,
        style: TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
          fontSize: 14,
        ),
      ),
    );
  }

  Widget _buildDashedDivider() {
    return Container(
      height: 1,
      child: LayoutBuilder(
        builder: (context, constraints) {
          return Flex(
            direction: Axis.horizontal,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(
              (constraints.constrainWidth() / 10).floor(),
              (index) => Container(
                width: 5,
                color: Colors.grey.withOpacity(0.3),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildLowerSection(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16),
      child: Row(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'EXPIRES',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.black54,
                  letterSpacing: 1,
                ),
              ),
              Text(
                coupon.expirationDate,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
            ],
          ),
          Spacer(),
          _buildCopyButton(context),
        ],
      ),
    );
  }

  Widget _buildCopyButton(BuildContext context) {
    return ElevatedButton.icon(
      onPressed: () => _copyCouponCode(context),
      icon: Icon(Icons.copy_rounded, size: 18),
      label: Text(
        coupon.couponCode,
        style: TextStyle(fontWeight: FontWeight.bold),
      ),
      style: ElevatedButton.styleFrom(
        backgroundColor: coupon.accentColor,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
    );
  }

  void _copyCouponCode(BuildContext context) {
    Clipboard.setData(ClipboardData(text: coupon.couponCode));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(Icons.check_circle, color: Colors.white),
            SizedBox(width: 8),
            Text('Coupon code copied to clipboard!'),
          ],
        ),
        behavior: SnackBarBehavior.floating,
        backgroundColor: Colors.green,
        duration: Duration(seconds: 2),
      ),
    );
  }

  void _showCouponDetails(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => CouponDetailsSheet(coupon: coupon),
    );
  }
}

class CouponDetailsSheet extends StatelessWidget {
  final Coupon coupon;

  const CouponDetailsSheet({Key? key, required this.coupon}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.85,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      builder: (context, scrollController) {
        return Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            children: [
              _buildSheetHeader(),
              Expanded(
                child: SingleChildScrollView(
                  controller: scrollController,
                  child: Column(
                    children: [
                      _buildMerchantInfo(),
                      _buildDashedDivider(),
                      _buildCouponDetails(context),
                      _buildDashedDivider(),
                      _buildTermsAndConditions(),
                      _buildHowToUse(),
                      SizedBox(height: 100), // Bottom padding for CTA button
                    ],
                  ),
                ),
              ),
              _buildBottomCTA(context),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSheetHeader() {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: coupon.backgroundColor,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        children: [
          Container(
            width: 40,
            height: 4,
            margin: EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Row(
            children: [
              Container(
                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: coupon.accentColor,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  coupon.discount,
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: Text(
                  coupon.title,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMerchantInfo() {
    return Padding(
      padding: EdgeInsets.all(16),
      child: Row(
        children: [
          CircleAvatar(
            radius: 24,
            backgroundColor: Colors.white,
            child: ClipOval(
  child: Image.network(
    coupon.merchantLogo, // External image URL
    width: 32,
    height: 32,
    fit: BoxFit.cover,
    errorBuilder: (context, error, stackTrace) => Icon(
      Icons.store,
      color: coupon.accentColor,
      size: 32,
    ),
    loadingBuilder: (context, child, loadingProgress) {
      if (loadingProgress == null) {
        return child;
      }
      return Center(
        child: CircularProgressIndicator(
          value: loadingProgress.expectedTotalBytes != null
              ? loadingProgress.cumulativeBytesLoaded /
                  loadingProgress.expectedTotalBytes!
              : null,
          color: coupon.accentColor,
        ),
      );
    },
  ),
),
          ),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  coupon.merchantName,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  coupon.category,
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: coupon.backgroundColor,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              children: [
                Text(
                  'EXPIRES IN',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey[600],
                  ),
                ),
                SizedBox(height: 4),
                _buildExpirationCountdown(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildExpirationCountdown() {
    final expDate = DateTime.parse(coupon.expirationDate);
    final daysLeft = expDate.difference(DateTime.now()).inDays;
    
    return Text(
      '$daysLeft days',
      style: TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.bold,
        color: daysLeft <= 7 ? Colors.red : Colors.green,
      ),
    );
  }

  Widget _buildCouponDetails(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionTitle('Offer Details'),
          SizedBox(height: 12),
          _buildDetailRow(Icons.local_offer, coupon.description),
          SizedBox(height: 16),
          _buildDetailRow(
            Icons.confirmation_number,
            'Coupon Code: ${coupon.couponCode}',
            showCopy: true,
            onCopyTap: () => _copyCouponCode(context),
          ),
          SizedBox(height: 16),
          _buildDetailRow(
            Icons.calendar_today,
            'Valid until ${_formatDate(coupon.expirationDate)}',
          ),
          if (coupon.minimumPurchase != null) ...[
            SizedBox(height: 16),
            _buildDetailRow(
              Icons.shopping_cart,
              'Minimum purchase: \$${coupon.minimumPurchase}',
            ),
          ],
          if (coupon.maxDiscount != null) ...[
            SizedBox(height: 16),
            _buildDetailRow(
              Icons.money_off,
              'Maximum discount: \$${coupon.maxDiscount}',
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildTermsAndConditions() {
    return Padding(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionTitle('Terms & Conditions'),
          SizedBox(height: 12),
          ...coupon.terms.map((term) => _buildTermItem(term)),
        ],
      ),
    );
  }

  Widget _buildHowToUse() {
    return Padding(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionTitle('How to Use'),
          SizedBox(height: 12),
          _buildStepList(),
        ],
      ),
    );
  }

  Widget _buildStepList() {
    final steps = [
      'Copy the coupon code',
      'Visit ${coupon.merchantName}',
      'Add items to your cart',
      'Paste the code at checkout',
      'Enjoy your savings!',
    ];

    return Column(
      children: steps.asMap().entries.map((entry) {
        return Padding(
          padding: EdgeInsets.only(bottom: 12),
          child: Row(
            children: [
              Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: coupon.accentColor,
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    '${entry.key + 1}',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: Text(
                  entry.value,
                  style: TextStyle(fontSize: 14),
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildBottomCTA(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: ElevatedButton(
          onPressed: () => _copyCouponCode(context),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.copy),
              SizedBox(width: 8),
              Text(
                'Copy Code & Shop Now',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          style: ElevatedButton.styleFrom(
            backgroundColor: coupon.accentColor,
            padding: EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
      ),
    );
  }

  // Helper Widgets
  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.bold,
        color: Colors.black87,
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String text, {bool showCopy = false, VoidCallback? onCopyTap}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 20, color: Colors.grey[600]),
        SizedBox(width: 12),
        Expanded(
          child: Text(
            text,
            style: TextStyle(
              fontSize: 14,
              color: Colors.black87,
            ),
          ),
        ),
        if (showCopy)
          GestureDetector(
            onTap: onCopyTap,
            child: Icon(Icons.copy, size: 20, color: coupon.accentColor),
          ),
      ],
    );
  }

  Widget _buildTermItem(String term) {
    return Padding(
      padding: EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: EdgeInsets.only(top: 6),
            child: Container(
              width: 6,
              height: 6,
              decoration: BoxDecoration(
                color: Colors.grey[600],
                shape: BoxShape.circle,
              ),
            ),
          ),
          SizedBox(width: 12),
          Expanded(
            child: Text(
              term,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[700],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDashedDivider() {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8),
      child: LayoutBuilder(
        builder: (context, constraints) {
          return Flex(
            direction: Axis.horizontal,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(
              (constraints.constrainWidth() / 10).floor(),
              (index) => Container(
                width: 5,
                height: 1,
                color: Colors.grey.withOpacity(0.3),
              ),
            ),
          );
        },
      ),
    );
  }

  String _formatDate(String date) {
    final DateTime dateTime = DateTime.parse(date);
    return '${dateTime.day}/${dateTime.month}/${dateTime.year}';
  }

  void _copyCouponCode(BuildContext context) {
    Clipboard.setData(ClipboardData(text: coupon.couponCode));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(Icons.check_circle, color: Colors.white),
            SizedBox(width: 8),
            Text('Code copied! Ready to use at checkout.'),
          ],
        ),
        behavior: SnackBarBehavior.floating,
        backgroundColor: Colors.green,
        duration: Duration(seconds: 2),
      ),
    );
  }
}

// Update the Coupon class with new fields
class Coupon {
  final String title;
  final String merchantName;
  final String merchantLogo;
  final String couponCode;
  final String description;
  final String expirationDate;
  final String discount;
  final String category;
  final Color backgroundColor;
  final Color accentColor;
  final double? minimumPurchase;
  final double? maxDiscount;
  final List<String> terms;
  final String? validityPeriod;

  Coupon({
    required this.title,
    required this.merchantName,
    required this.merchantLogo,
    required this.couponCode,
    required this.description,
    required this.expirationDate,
    required this.discount,
    required this.category,
    this.backgroundColor = const Color(0xFFF5F5F5),
    this.accentColor = const Color(0xFF2196F3),
    this.minimumPurchase,
    this.maxDiscount,
    this.terms = const [],
    this.validityPeriod,
  });
}