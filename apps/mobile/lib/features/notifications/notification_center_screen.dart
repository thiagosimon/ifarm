import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/formatters.dart';
import '../../core/router/app_router.dart';
import '../../data/models/app_notification_model.dart';
import '../../providers/notification_provider.dart';
import 'package:ifarm_mobile/l10n/app_localizations.dart';

// ---------------------------------------------------------------------------
// Type helpers
// ---------------------------------------------------------------------------

class _NotificationTypeConfig {
  final IconData icon;
  final Color color;
  final String chipLabel;
  const _NotificationTypeConfig(this.icon, this.color, this.chipLabel);
}

_NotificationTypeConfig _configForType(String type, AppLocalizations l) {
  if (type.contains('quote')) {
    return _NotificationTypeConfig(Icons.request_quote_outlined,
        AppColors.statusOpen, l.notificationsQuotes);
  }
  if (type.contains('order')) {
    return _NotificationTypeConfig(
        Icons.shopping_bag_outlined, AppColors.primary, l.notificationsOrders);
  }
  if (type.contains('payment')) {
    return _NotificationTypeConfig(
        Icons.payments_outlined, AppColors.success, 'Pagamento');
  }
  if (type.contains('deliver') || type.contains('shipping')) {
    return _NotificationTypeConfig(
        Icons.local_shipping_outlined, AppColors.primaryContainer, 'Entrega');
  }
  if (type.contains('kyc')) {
    return _NotificationTypeConfig(
        Icons.verified_user_outlined, AppColors.notificationKyc, 'KYC');
  }
  if (type.contains('profile')) {
    return _NotificationTypeConfig(
        Icons.person_outlined, AppColors.textSecondary, l.notificationsSystem);
  }
  return _NotificationTypeConfig(Icons.notifications_outlined,
      AppColors.textTertiary, l.notificationsSystem);
}

String _groupLabel(DateTime date, AppLocalizations l) {
  final now = DateTime.now();
  final today = DateTime(now.year, now.month, now.day);
  final weekAgo = today.subtract(const Duration(days: 7));
  final d = DateTime(date.year, date.month, date.day);
  if (d == today) return l.notificationsToday;
  if (d.isAfter(weekAgo)) return l.notificationsThisWeek;
  return l.notificationsOlder;
}

Map<String, List<AppNotificationModel>> _groupByDate(
    List<AppNotificationModel> items, AppLocalizations l) {
  final grouped = <String, List<AppNotificationModel>>{};
  final order = [
    l.notificationsToday,
    l.notificationsThisWeek,
    l.notificationsOlder
  ];
  for (final label in order) {
    grouped[label] = [];
  }
  for (final item in items) {
    final label = _groupLabel(item.createdAt, l);
    grouped[label]!.add(item);
  }
  grouped.removeWhere((_, v) => v.isEmpty);
  return grouped;
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

class NotificationCenterScreen extends ConsumerWidget {
  const NotificationCenterScreen({super.key});

  void _onTap(BuildContext context, WidgetRef ref, AppNotificationModel n) {
    ref.read(notificationListProvider.notifier).markAsRead(n.id);
    final relatedId = n.data?['relatedId'] as String?;
    final type = n.type;
    if (type.contains('quote')) {
      if (relatedId != null) context.push('/quote/$relatedId');
    } else if (type.contains('order')) {
      if (relatedId != null) context.push('/order/$relatedId');
    } else if (type.contains('payment')) {
      context.push(Routes.orders);
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l = AppLocalizations.of(context)!;
    final notificationsAsync = ref.watch(notificationListProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        centerTitle: false,
        title: Text(l.notificationsTitle, style: AppTypography.headlineSmall),
        actions: [
          TextButton(
            onPressed: () =>
                ref.read(notificationListProvider.notifier).markAllAsRead(),
            child: Text(
              l.notificationsMarkAllRead,
              style: AppTypography.labelMedium
                  .copyWith(color: AppColors.primary, fontSize: 13),
            ),
          ),
        ],
      ),
      body: notificationsAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
        error: (e, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.xxl),
            child: Text(
              'Erro ao carregar notificações.\n${e.toString()}',
              textAlign: TextAlign.center,
              style: AppTypography.bodyMedium
                  .copyWith(color: AppColors.textSecondary),
            ),
          ),
        ),
        data: (notifications) {
          if (notifications.isEmpty) {
            return const _EmptyState();
          }

          final grouped = _groupByDate(notifications, l);

          return RefreshIndicator(
            color: AppColors.primary,
            onRefresh: () =>
                ref.read(notificationListProvider.notifier).refresh(),
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: AppSpacing.lg),
              children: [
                for (final entry in grouped.entries) ...[
                  _GroupHeader(label: entry.key),
                  ...entry.value.map(
                    (n) => _NotificationTile(
                      notification: n,
                      onTap: () => _onTap(context, ref, n),
                    ),
                  ),
                ],
              ],
            ),
          );
        },
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Sub-widgets
// ---------------------------------------------------------------------------

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xxl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: const BoxDecoration(
                color: AppColors.surfaceContainerHighest,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.notifications_off_outlined,
                  size: 40, color: AppColors.textTertiary),
            ),
            const SizedBox(height: AppSpacing.lg),
            Text(l.notificationsEmpty, style: AppTypography.headlineSmall),
            const SizedBox(height: AppSpacing.sm),
            Text(
              l.notificationsEmptyHint,
              textAlign: TextAlign.center,
              style: AppTypography.bodyMedium
                  .copyWith(color: AppColors.textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}

class _GroupHeader extends StatelessWidget {
  final String label;
  const _GroupHeader({required this.label});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(
          AppSpacing.lg, AppSpacing.md, AppSpacing.lg, AppSpacing.sm),
      child: Text(
        label,
        style: AppTypography.titleSmall
            .copyWith(color: AppColors.textSecondary, letterSpacing: 0.8),
      ),
    );
  }
}

class _NotificationTile extends StatelessWidget {
  final AppNotificationModel notification;
  final VoidCallback onTap;

  const _NotificationTile({required this.notification, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    final config = _configForType(notification.type, l);

    return InkWell(
      onTap: onTap,
      child: Container(
        color: notification.isRead
            ? Colors.transparent
            : AppColors.primary.withValues(alpha: 0.04),
        padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.lg, vertical: AppSpacing.md),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Icon container
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: config.color.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
              ),
              child: Icon(config.icon, color: config.color, size: 22),
            ),
            const SizedBox(width: AppSpacing.md),

            // Content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title + category chip in a row
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Expanded(
                        child: Text(
                          notification.title,
                          style: AppTypography.titleSmall.copyWith(
                            fontWeight: notification.isRead
                                ? FontWeight.w500
                                : FontWeight.w700,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: AppSpacing.xs),
                      // Category chip INSIDE tile
                      _CategoryChip(label: config.chipLabel),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    notification.body,
                    style: AppTypography.bodySmall,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    AppFormatters.timeAgo(notification.createdAt, l),
                    style: AppTypography.labelSmall
                        .copyWith(color: AppColors.textTertiary),
                  ),
                ],
              ),
            ),

            const SizedBox(width: AppSpacing.sm),

            // Unread dot
            if (!notification.isRead)
              Container(
                width: 8,
                height: 8,
                margin: const EdgeInsets.only(top: 6),
                decoration: const BoxDecoration(
                  color: AppColors.primary,
                  shape: BoxShape.circle,
                ),
              )
            else
              const SizedBox(width: 8),
          ],
        ),
      ),
    );
  }
}

/// Small pill chip inside notification tile.
/// surfaceContainerHigh bg, outline text 10px, 4x8 padding, 100 radius.
class _CategoryChip extends StatelessWidget {
  final String label;
  const _CategoryChip({required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerHigh,
        borderRadius: BorderRadius.circular(100),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: AppColors.outline,
          fontSize: 10,
          fontWeight: FontWeight.w500,
          height: 1.2,
        ),
      ),
    );
  }
}
