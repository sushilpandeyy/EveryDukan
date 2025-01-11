import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import '../component/header.dart';
import '../component/sidebar.dart';
import '../component/bottom.dart';

class DealsPage extends StatefulWidget {
  const DealsPage({super.key});

  @override
  State<DealsPage> createState() => _DealsPageState();
}

class _DealsPageState extends State<DealsPage> {
  int _currentIndex = 1;
  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }
  final List<DealCard> _deals = [];
  bool _isLoading = false;
  final ScrollController _scrollController = ScrollController();
  int _currentPage = 1;

  @override
  void initState() {
    super.initState();
    _loadMoreDeals();
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
      _loadMoreDeals();
    }
  }

  Future<void> _loadMoreDeals() async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
    });

    await Future.delayed(const Duration(seconds: 1));
    
    final newDeals = List.generate(
      10,
      (index) => DealCard(
        imageUrl: 'https://picsum.photos/500/300?random=${_deals.length + index}',
        title: 'Special Offer ${_deals.length + index + 1}',
        subtitle: 'Up to ${(index + 1) * 10}% off on selected items',
        originalPrice: 99.99 + index,
        discountedPrice: (99.99 + index) * 0.7,
        shopUrl: 'https://example.com/deal/${_deals.length + index}',
      ),
    );

    setState(() {
      _deals.addAll(newDeals);
      _currentPage++;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Header(),
      drawer: const SidebarDrawer(),
      body: GridView.builder(
        controller: _scrollController,
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.68, // Adjusted for better fit
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        itemCount: _deals.length + 1,
        itemBuilder: (context, index) {
          if (index == _deals.length) {
            return _isLoading
                ? const Center(child: CircularProgressIndicator())
                : const SizedBox.shrink();
          }
          return _buildDealCard(_deals[index]);
        },
      ),
      bottomNavigationBar: CustomBottomNavigation(
        currentIndex: _currentIndex,
        onTap: _onTabTapped,
      ),
    );
  }

  Widget _buildDealCard(DealCard deal) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min, // Added to prevent expansion
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Deal Image
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
            child: AspectRatio(
              aspectRatio: 1.5,
              child: Image.network(
                deal.imageUrl,
                fit: BoxFit.cover,
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child;
                  return const Center(child: CircularProgressIndicator());
                },
              ),
            ),
          ),
          // Deal Content
          Expanded( // Wrap content in Expanded
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                mainAxisSize: MainAxisSize.min, // Prevent expansion
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    deal.title,
                    style: const TextStyle(
                      fontSize: 14, // Reduced font size
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2), // Reduced spacing
                  Text(
                    deal.subtitle,
                    style: TextStyle(
                      fontSize: 11, // Reduced font size
                      color: Colors.grey[600],
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const Spacer(), // Push price and buttons to bottom
                  Row(
                    children: [
                      Text(
                        '₹${deal.discountedPrice.toStringAsFixed(2)}',
                        style: const TextStyle(
                          fontSize: 14, // Reduced font size
                          fontWeight: FontWeight.bold,
                          color: Colors.green,
                        ),
                      ),
                      const SizedBox(width: 4), // Reduced spacing
                      Text(
                        '₹${deal.originalPrice.toStringAsFixed(2)}',
                        style: const TextStyle(
                          fontSize: 12, // Reduced font size
                          decoration: TextDecoration.lineThrough,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4), // Reduced spacing
                  // Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: SizedBox(
                          height: 32, // Fixed height for button
                          child: ElevatedButton(
                            onPressed: () => _launchURL(deal.shopUrl),
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(horizontal: 8),
                            ),
                            child: const Text(
                              'Shop',
                              style: TextStyle(fontSize: 12), // Reduced font size
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 4), // Reduced spacing
                      SizedBox(
                        height: 32, // Fixed height for consistency
                        child: IconButton(
                          icon: const Icon(Icons.share, size: 18), // Reduced icon size
                          onPressed: () => _shareDeal(deal),
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _launchURL(String url) async {
    try {
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      debugPrint('Error launching URL: $e');
    }
  }

  Future<void> _shareDeal(DealCard deal) async {
    final shareText = '${deal.title}\n${deal.subtitle}\nShop now: ${deal.shopUrl}';
    await Share.share(shareText);
  }
}

class DealCard {
  final String imageUrl;
  final String title;
  final String subtitle;
  final double originalPrice;
  final double discountedPrice;
  final String shopUrl;

  DealCard({
    required this.imageUrl,
    required this.title,
    required this.subtitle,
    required this.originalPrice,
    required this.discountedPrice,
    required this.shopUrl,
  });
}