import 'package:flutter/material.dart';
import '../core/theme/app_typography.dart';
import '../core/utils/formatters.dart';

class CurrencyText extends StatelessWidget {
  final double value;
  final TextStyle? style;
  final bool hero;
  final bool large;

  const CurrencyText({
    super.key,
    required this.value,
    this.style,
    this.hero = false,
    this.large = false,
  });

  @override
  Widget build(BuildContext context) {
    final defaultStyle = hero
        ? AppTypography.priceHero
        : large
            ? AppTypography.priceLarge
            : AppTypography.priceMedium;
    return Text(
      AppFormatters.currency(value),
      style: style ?? defaultStyle,
    );
  }
}
