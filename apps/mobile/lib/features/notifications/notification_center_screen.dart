import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/formatters.dart';
import '../../core/router/app_router.dart';

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

class NotificationModel {
  final String id;
  final String type;
  final String title;
  final String body;
  final bool isRead;
  final DateTime createdAt;
  final Map<String, dynamic>? data;

  const NotificationModel({
    required this.id,
    required this.type,
    required this.title,
    required this.body,
    required this.isRead,
    required this.createdAt,
    this.data,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: (json['_id'] ?? json['id'] ?? '') as String,
      type: json['type'] as String? ?? '',
      title: json['title'] as String? ?? '',
      body: json['body'] as String? ?? json['message'] as String? ?? '',
      isRead: json['isRead'] as bool? ?? false,
      createdAt:
          DateTime.tryParse(json['createdAt'] as String? ?? '') ?? DateTime.now(),
      data: json['data'] as Map<String, dynamic>?,
    );
  }

  NotificationModel copyWith({bool? isRead}) {
    return NotificationModel(
      id: id,
      type: type,
      title: title,
      body: body,
      isRead: isRead ?? this.isRead,
      createdAt: createdAt,
      data: data,
    );
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

class NotificationListNotifier
    extends StateNotifier<AsyncValue<List<NotificationModel>>> {
  NotificationListNotifier() : super(const AsyncValue.loading()) {
    _load();
  }

  Future<void> _load() async {
    state = const AsyncValue.loading();
    try {
      await Future<void>.delayed(const Duration(milliseconds: 300));
      state = const AsyncValue.data([]);
    } catch (e, s) {
      state = AsyncValue.error(e, s);
    }
  }

  Future<void> refresh() => _load();

  void markAllAsRead() {
    final current = state.value;
    if (current == null) return;
    state =
        AsyncValue.data(current.map((n) => n.copyWith(isRead: true)).toList());
  }

  void markAsRead(String id) {
    final current = state.value;
    if (current == null) return;
    state = AsyncValue.data(
      current.map((n) => n.id == id ? n.copyWith(isRead: true) : n).toList(),
    );
  }
}

final notificationListProvider = StateNotifierProvider<NotificationListNotifier,
    AsyncValue<List<NotificationModel>>>(
  (ref) => NotificationListNotifier(),
);

// ---------------------------------------------------------------------------
// Type helpers
// ---------------------------------------------------------------------------

class _NotificationTypeConfig {
  final IconData icon;
  final Color color;
  final String chipLabel;
  const _NotificationTypeConfig(this.icon, this.color, this.chipLabel);
}

_NotificationTypeConfig _configForType(String type) {
  if (type.contains('quote')) {
    return _NotificationTypeConfig(
        Icons.request_quote_outlined, AppColors.statusOpen, 'Cotação');
  }
  if (type.contains('order')) {
    return _NotificationTypeConfig(
        Icons.shopping_bag_outlined, AppColors.primary, 'Pedido');
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
        Icons.person_outlined, AppColors.textSecondary, 'Sistema');
  }
  return _NotificationTypeConfig(
      Icons.notifications_outlined, AppColors.textTertiary, 'Sistema');
}

String _groupLabel(DateTime date) {
  final now = DateTime.now();
  final today = DateTime(now.year, now.month, now.day);
  final yesterday = today.subtract(const Duration(days: 1));
  final weekAgo = today.subtract(const Duration(days: 7));
  final d = DateTime(date.year, date.month, date.day);
  if (d == today) return 'Hoje';
  if (d == yesterday) return 'Ontem';
  if (d.isAfter(weekAgo)) return 'Esta semana';
  return 'Mais antigas';
}

Map<String, List<NotificationModel>> _groupByDate(
    List<NotificationModel> items) {
  final grouped = <String, List<NotificationModel>>{};
  const order = ['Hoje', 'Ontem', 'Esta semana', 'Mais antigas'];
  for (final label in order) {
    grouped[label] = [];
  }
  for (final item in items) {
    final label = _groupLabel(item.createdAt);
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

  void _onTap(BuildContext context, WidgetRef ref, NotificationModel n) {
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
    final notificationsAsync = ref.watch(notificationListProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        centerTitle: false,
        title: const Text('Notificações', style: AppTypography.headlineSmall),
        actions: [
          TextButton(
            onPressed: () =>
                ref.read(notificationListProvider.notifier).markAllAsRead(),
            child: Text(
              'Marcar todas como lidas',
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

          final grouped = _groupByDate(notifications);

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
            // "Tudo limpo por aqui" — NOT "Nenhuma notificação"
            const Text('Tudo limpo por aqui',
                style: AppTypography.headlineSmall),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'Você será notificado sobre cotações,\npedidos e pagamentos aqui.',
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
  final NotificationModel notification;
  final VoidCallback onTap;

  const _NotificationTile({required this.notification, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final config = _configForType(notification.type);

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
                    AppFormatters.timeAgo(notification.createdAt),
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
