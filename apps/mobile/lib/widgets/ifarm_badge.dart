import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_typography.dart';
import '../core/theme/app_spacing.dart';
import 'package:ifarm_mobile/l10n/app_localizations.dart';

class IFarmBadge extends StatelessWidget {
  final String label;
  final Color backgroundColor;
  final Color textColor;
  final double? fontSize;

  const IFarmBadge({
    super.key,
    required this.label,
    required this.backgroundColor,
    this.textColor = Colors.white,
    this.fontSize,
  });

  factory IFarmBadge.ncm(String code) => IFarmBadge(
        label: 'NCM $code',
        backgroundColor: AppColors.surfaceVariant,
        textColor: AppColors.textSecondary,
      );

  factory IFarmBadge.ruralCredit(BuildContext context) => IFarmBadge(
        label: AppLocalizations.of(context)!.badgeRuralCredit,
        backgroundColor: AppColors.secondaryContainer,
        textColor: AppColors.secondaryDark,
      );

  factory IFarmBadge.category(String label) => IFarmBadge(
        label: label,
        backgroundColor: AppColors.primaryContainer,
        textColor: AppColors.primaryDark,
      );

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
      ),
      child: Text(
        label,
        style: AppTypography.labelSmall.copyWith(
          color: textColor,
          fontSize: fontSize ?? 10,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
