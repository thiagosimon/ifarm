import 'package:flutter/material.dart';
import 'package:ifarm_mobile/l10n/app_localizations.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_typography.dart';
import '../core/theme/app_spacing.dart';
import 'ifarm_button.dart';

class IFarmErrorState extends StatelessWidget {
  final String? message;
  final VoidCallback? onRetry;

  const IFarmErrorState({super.key, this.message, this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xxxl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: const BoxDecoration(
                  color: AppColors.errorLight, shape: BoxShape.circle),
              child: const Icon(Icons.error_outline,
                  size: 40, color: AppColors.error),
            ),
            const SizedBox(height: AppSpacing.xl),
            Text(AppLocalizations.of(context)!.errorSomethingWrong,
                style: AppTypography.headlineSmall),
            const SizedBox(height: AppSpacing.sm),
            Text(
              message ?? AppLocalizations.of(context)!.errorCheckConnection,
              style: AppTypography.bodyMedium
                  .copyWith(color: AppColors.textSecondary),
              textAlign: TextAlign.center,
            ),
            if (onRetry != null) ...[
              const SizedBox(height: AppSpacing.xl),
              IFarmButton(
                  label: AppLocalizations.of(context)!.tryAgain,
                  onPressed: onRetry,
                  fullWidth: false),
            ],
          ],
        ),
      ),
    );
  }
}
