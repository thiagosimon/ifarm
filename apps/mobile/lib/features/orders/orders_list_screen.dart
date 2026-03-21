import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:ifarm_mobile/l10n/app_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/formatters.dart';
import '../../data/models/order_model.dart';
import '../../providers/order_provider.dart';
import '../../widgets/ifarm_empty_state.dart';
import '../../widgets/ifarm_error_state.dart';
import '../../widgets/ifarm_skeleton.dart';
import '../../providers/guest_provider.dart';
import '../../widgets/guest_feature_lock.dart';

class OrdersListScreen extends ConsumerStatefulWidget {
  const OrdersListScreen({super.key});

  @override
  ConsumerState<OrdersListScreen> createState() => _OrdersListScreenState();
}

class _OrdersListScreenState extends ConsumerState<OrdersListScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  static const _statuses = [
    'AWAITING_PAYMENT',
    'PAID',
    'DISPATCHED',
    'DELIVERED',
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _statuses.length, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (ref.watch(guestModeProvider)) {
      return const GuestFeatureLock(
        icon: Icons.shopping_bag_outlined,
        title: 'Acompanhe seus pedidos',
        description:
            'Rastreie cada etapa dos seus pedidos, desde a confirmação até a entrega na sua propriedade.',
      );
    }
    final l = AppLocalizations.of(context)!;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) => [
          SliverAppBar(
            pinned: true,
            floating: true,
            backgroundColor: AppColors.surface.withValues(alpha: 0.92),
            surfaceTintColor: Colors.transparent,
            elevation: 0,
            flexibleSpace: ClipRect(
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
                child: const SizedBox.expand(),
              ),
            ),
            title: Row(
              children: [
                Container(
                  width: 28,
                  height: 28,
                  decoration: const BoxDecoration(
                    color: AppColors.primary,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.agriculture,
                    color: Colors.white,
                    size: 16,
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                Text(
                  'iFarm',
                  style: AppTypography.titleLarge.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.5,
                  ),
                ),
              ],
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.search, color: AppColors.onSurface),
                onPressed: () {},
              ),
            ],
            bottom: PreferredSize(
              preferredSize: const Size.fromHeight(48),
              child: TabBar(
                controller: _tabController,
                isScrollable: true,
                tabAlignment: TabAlignment.start,
                labelStyle: AppTypography.labelLarge.copyWith(
                  fontWeight: FontWeight.w600,
                ),
                unselectedLabelStyle: AppTypography.labelLarge,
                indicatorColor: AppColors.primary,
                indicatorWeight: 2,
                labelColor: AppColors.primary,
                unselectedLabelColor: AppColors.textSecondary,
                dividerColor: AppColors.surfaceContainerHigh,
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm),
                tabs: [
                  Tab(text: l.ordersTabAwaitingPayment),
                  Tab(text: l.ordersTabInProgress),
                  Tab(text: l.ordersTabDelivered),
                  Tab(text: l.ordersTabCancelled),
                ],
              ),
            ),
          ),
        ],
        body: TabBarView(
          controller: _tabController,
          children: List.generate(
            _statuses.length,
            (i) => _OrderTab(status: _statuses[i]),
          ),
        ),
      ),
    );
  }
}

class _OrderTab extends ConsumerStatefulWidget {
  final String status;
  const _OrderTab({required this.status});

  @override
  ConsumerState<_OrderTab> createState() => _OrderTabState();
}

class _OrderTabState extends ConsumerState<_OrderTab> {
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(orderListProvider.notifier).load(status: widget.status);
    });
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
      ref.read(orderListProvider.notifier).loadMore(status: widget.status);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    final ordersAsync = ref.watch(orderListProvider);

    return RefreshIndicator(
      color: AppColors.primary,
      onRefresh: () async =>
          ref.read(orderListProvider.notifier).load(status: widget.status),
      child: ordersAsync.when(
        loading: () => const ListSkeleton(),
        error: (e, _) => IFarmErrorState(
          onRetry: () =>
              ref.read(orderListProvider.notifier).load(status: widget.status),
        ),
        data: (orders) {
          final filtered =
              orders.where((o) => o.status.value == widget.status).toList();

          if (filtered.isEmpty) {
            return ListView(
              controller: _scrollController,
              physics: const AlwaysScrollableScrollPhysics(),
              children: [
                SizedBox(
                  height: MediaQuery.of(context).size.height * 0.6,
                  child: IFarmEmptyState(
                    icon: Icons.shopping_bag_outlined,
                    title: l.ordersEmpty,
                    subtitle: l.ordersEmpty,
                  ),
                ),
              ],
            );
          }

          return ListView.separated(
            controller: _scrollController,
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.lg,
              vertical: AppSpacing.lg,
            ),
            itemCount: filtered.length,
            separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
            itemBuilder: (_, i) => _OrderCard(order: filtered[i]),
          );
        },
      ),
    );
  }
}

class _OrderCard extends StatelessWidget {
  final OrderModel order;
  const _OrderCard({required this.order});

  String get _statusValue => order.status.value;

  Widget _buildActionButton(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    switch (_statusValue) {
      case 'AWAITING_PAYMENT':
        return Container(
          width: double.infinity,
          height: 40,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [AppColors.primary, AppColors.primaryContainer],
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
            ),
            borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
              onTap: () => context.push('/payment/${order.id}'),
              child: const Center(
                child: Text(
                  'Pagar Agora',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
          ),
        );
      case 'PAID':
        return OutlinedButton(
          style: OutlinedButton.styleFrom(
            minimumSize: const Size(double.infinity, 40),
            side: const BorderSide(color: AppColors.primary),
            foregroundColor: AppColors.primary,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
            ),
          ),
          onPressed: () => context.push('/order/${order.id}'),
          child: Text(l.ordersViewDetails),
        );
      case 'DISPATCHED':
        return OutlinedButton(
          style: OutlinedButton.styleFrom(
            minimumSize: const Size(double.infinity, 40),
            side: const BorderSide(color: AppColors.primary),
            foregroundColor: AppColors.primary,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
            ),
          ),
          onPressed: () => context.push('/order/${order.id}'),
          child: const Text('Rastrear'),
        );
      case 'DELIVERED':
        return TextButton(
          style: TextButton.styleFrom(
            minimumSize: const Size(double.infinity, 40),
            foregroundColor: AppColors.textSecondary,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
              side: BorderSide(
                color: AppColors.outlineVariant.withValues(alpha: 0.38),
              ),
            ),
          ),
          onPressed: () => context.push('/order/${order.id}'),
          child: const Text('Confirmar Recebimento'),
        );
      default:
        return const SizedBox.shrink();
    }
  }

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    final retailerName =
        order.retailer?.displayName ?? 'Varejista desconhecido';
    final thumbnailUrl = order.items.isNotEmpty
        ? (order.items.first as dynamic).thumbnailUrl as String?
        : null;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        border: Border.all(
          color: AppColors.outlineVariant.withValues(alpha: 0.15),
        ),
        boxShadow: const [
          BoxShadow(
            color: AppColors.ambientShadow,
            blurRadius: 24,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        onTap: () => context.push('/order/${order.id}'),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header row: thumbnail + order info
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Product thumbnail 48x48
                  ClipRRect(
                    borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                    child: thumbnailUrl != null
                        ? Image.network(
                            thumbnailUrl,
                            width: 48,
                            height: 48,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) =>
                                _ThumbnailPlaceholder(),
                          )
                        : _ThumbnailPlaceholder(),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Order number — secondary color, 10px, w700, uppercase
                        Text(
                          '#${order.orderNumber}'.toUpperCase(),
                          style: TextStyle(
                            color: AppColors.secondary,
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.8,
                          ),
                        ),
                        const SizedBox(height: 2),
                        // Retailer name
                        Text(
                          retailerName,
                          style: AppTypography.titleSmall,
                          overflow: TextOverflow.ellipsis,
                          maxLines: 1,
                        ),
                        const SizedBox(height: 2),
                        // Items count + date
                        Text(
                          '${l.ordersItemCount(order.items.length)} • ${AppFormatters.date(order.createdAt)}',
                          style: AppTypography.bodySmall.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: AppSpacing.md),

              // Total row
              Row(
                children: [
                  Text(
                    'Total',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const Spacer(),
                  Text(
                    AppFormatters.currency(order.totalAmount),
                    style: AppTypography.titleMedium.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: AppSpacing.md),

              // Per-card action button
              _buildActionButton(context),
            ],
          ),
        ),
      ),
    );
  }
}

class _ThumbnailPlaceholder extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 48,
      height: 48,
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerHigh,
        borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
      ),
      child: const Icon(
        Icons.eco_outlined,
        size: 22,
        color: AppColors.textTertiary,
      ),
    );
  }
}
