import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_typography.dart';
import '../core/theme/app_spacing.dart';

enum IFarmButtonVariant { primary, secondary, outline, ghost, danger }

class IFarmButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final IFarmButtonVariant variant;
  final bool isLoading;
  final bool fullWidth;
  final IconData? icon;
  final double? height;

  const IFarmButton({
    super.key,
    required this.label,
    this.onPressed,
    this.variant = IFarmButtonVariant.primary,
    this.isLoading = false,
    this.fullWidth = true,
    this.icon,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    final child = isLoading
        ? const SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
          )
        : Row(
            mainAxisSize: fullWidth ? MainAxisSize.max : MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (icon != null) ...[
                Icon(icon, size: 18),
                const SizedBox(width: AppSpacing.sm),
              ],
              Text(label),
            ],
          );

    final size = ButtonStyle(
      minimumSize: WidgetStateProperty.all(
        Size(fullWidth ? double.infinity : 0, height ?? 48),
      ),
    );

    switch (variant) {
      case IFarmButtonVariant.primary:
        // Gradient from primary → primaryContainer per "Glass & Gradient" rule
        return Container(
          width: fullWidth ? double.infinity : null,
          height: height ?? 52,
          decoration: BoxDecoration(
            gradient: onPressed == null || isLoading
                ? null
                : const LinearGradient(
                    colors: [AppColors.primary, AppColors.primaryContainer],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
            color: onPressed == null || isLoading ? AppColors.surfaceContainerHigh : null,
            borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
            boxShadow: onPressed != null && !isLoading
                ? const [BoxShadow(color: Color(0x1A005129), offset: Offset(0, 4), blurRadius: 12)]
                : null,
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: isLoading ? null : onPressed,
              borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
              child: Container(
                alignment: Alignment.center,
                child: isLoading
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : DefaultTextStyle(
                        style: AppTypography.labelLarge.copyWith(color: Colors.white),
                        child: IconTheme(
                          data: const IconThemeData(color: Colors.white, size: 18),
                          child: child,
                        ),
                      ),
              ),
            ),
          ),
        );
      case IFarmButtonVariant.secondary:
        return ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.secondary,
            foregroundColor: Colors.white,
          ).merge(size),
          onPressed: isLoading ? null : onPressed,
          child: child,
        );
      case IFarmButtonVariant.outline:
        return OutlinedButton(
          style: OutlinedButton.styleFrom(
            side: const BorderSide(color: AppColors.primary),
            foregroundColor: AppColors.primary,
          ).merge(size),
          onPressed: isLoading ? null : onPressed,
          child: child,
        );
      case IFarmButtonVariant.ghost:
        return TextButton(
          style: TextButton.styleFrom(foregroundColor: AppColors.primary).merge(size),
          onPressed: isLoading ? null : onPressed,
          child: child,
        );
      case IFarmButtonVariant.danger:
        return ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.error,
            foregroundColor: Colors.white,
          ).merge(size),
          onPressed: isLoading ? null : onPressed,
          child: child,
        );
    }
  }
}
