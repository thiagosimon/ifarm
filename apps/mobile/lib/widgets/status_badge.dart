import 'package:flutter/material.dart';
import '../core/theme/app_typography.dart';
import '../core/theme/app_spacing.dart';
import '../core/constants/enums.dart';
import '../core/utils/extensions.dart';

class QuoteStatusBadge extends StatelessWidget {
  final QuoteStatus status;
  const QuoteStatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    return _Badge(label: status.label, color: status.color);
  }
}

class OrderStatusBadge extends StatelessWidget {
  final OrderStatus status;
  const OrderStatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    return _Badge(label: status.label, color: status.color, icon: status.icon);
  }
}

class KycStatusBadge extends StatelessWidget {
  final KycStatus status;
  const KycStatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    return _Badge(label: status.label, color: status.color);
  }
}

class _Badge extends StatelessWidget {
  final String label;
  final Color color;
  final IconData? icon;

  const _Badge({required this.label, required this.color, this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 12, color: color),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: AppTypography.labelSmall.copyWith(
              color: color,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
