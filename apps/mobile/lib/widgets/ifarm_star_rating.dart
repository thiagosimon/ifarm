import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';

class IFarmStarRating extends StatelessWidget {
  final double rating;
  final int maxStars;
  final double size;
  final bool interactive;
  final void Function(int)? onRating;

  const IFarmStarRating({
    super.key,
    required this.rating,
    this.maxStars = 5,
    this.size = 16,
    this.interactive = false,
    this.onRating,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(maxStars, (i) {
        final filled = i < rating.floor();
        final half = !filled && i < rating;
        return GestureDetector(
          onTap: interactive ? () => onRating?.call(i + 1) : null,
          child: Icon(
            filled ? Icons.star : half ? Icons.star_half : Icons.star_border,
            size: size,
            color: AppColors.secondary,
          ),
        );
      }),
    );
  }
}

class InteractiveStarRating extends StatefulWidget {
  final int initialRating;
  final void Function(int) onRating;
  final double size;

  const InteractiveStarRating({
    super.key,
    this.initialRating = 0,
    required this.onRating,
    this.size = 36,
  });

  @override
  State<InteractiveStarRating> createState() => _InteractiveStarRatingState();
}

class _InteractiveStarRatingState extends State<InteractiveStarRating> {
  late int _current;

  @override
  void initState() {
    super.initState();
    _current = widget.initialRating;
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(5, (i) {
        return GestureDetector(
          onTap: () {
            setState(() => _current = i + 1);
            widget.onRating(i + 1);
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: Icon(
              i < _current ? Icons.star : Icons.star_border,
              size: widget.size,
              color: AppColors.secondary,
            ),
          ),
        );
      }),
    );
  }
}
