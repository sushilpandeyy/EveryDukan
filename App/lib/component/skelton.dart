import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class SkeletonWidget extends StatelessWidget {
  final double width;
  final double height;
  final double borderRadius;

  const SkeletonWidget({
    super.key,
    required this.width,
    required this.height,
    this.borderRadius = 8,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(borderRadius),
      ),
    );
  }
}

class HomeSkeletonLoading extends StatelessWidget {
  const HomeSkeletonLoading({super.key});

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      child: SingleChildScrollView(
        physics: const NeverScrollableScrollPhysics(),
        child: Padding(
          padding: const EdgeInsets.all(10.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Slideshow skeleton
              const SkeletonWidget(
                width: double.infinity,
                height: 200,
                borderRadius: 12,
              ),
              const SizedBox(height: 20),

              // ReusableBanner section skeleton
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title skeleton
                  const SkeletonWidget(
                    width: 150,
                    height: 24,
                  ),
                  const SizedBox(height: 16),
                  // Banner cards skeleton
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    physics: const NeverScrollableScrollPhysics(),
                    child: Row(
                      children: List.generate(
                        3,
                        (index) => Padding(
                          padding: const EdgeInsets.only(right: 12),
                          child: SkeletonWidget(
                            width: MediaQuery.of(context).size.width * 0.8,
                            height: 160,
                            borderRadius: 12,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // BrandCard section skeleton
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SkeletonWidget(
                    width: 180,
                    height: 24,
                  ),
                  const SizedBox(height: 16),
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 1.5,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                    ),
                    itemCount: 4,
                    itemBuilder: (context, index) => const SkeletonWidget(
                      width: double.infinity,
                      height: double.infinity,
                      borderRadius: 12,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Additional ReusableBanner skeleton
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SkeletonWidget(
                    width: 160,
                    height: 24,
                  ),
                  const SizedBox(height: 16),
                  SkeletonWidget(
                    width: MediaQuery.of(context).size.width,
                    height: 180,
                    borderRadius: 12,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}