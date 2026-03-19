import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/formatters.dart';
import '../../core/constants/enums.dart';
import '../../core/utils/extensions.dart';
import '../../data/models/order_model.dart';
import '../../providers/order_provider.dart';
import '../../data/repositories/order_repository.dart';
import '../../widgets/ifarm_app_bar.dart';
import '../../widgets/ifarm_button.dart';
import '../../widgets/ifarm_card.dart';
import '../../widgets/ifarm_bottom_sheet.dart';
import '../../widgets/ifarm_error_state.dart';
import '../../widgets/ifarm_skeleton.dart';
import '../../widgets/ifarm_text_field.dart';

class OrderDetailScreen extends ConsumerWidget {
  final String orderId;
  const OrderDetailScreen({super.key, required this.orderId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final orderAsync = ref.watch(orderDetailProvider(orderId));

    return orderAsync.when(
      loading: () => Scaffold(
        appBar: const IFarmAppBar(title: 'Pedido'),
        backgroundColor: AppColors.background,
        body: const ListSkeleton(),
      ),
      error: (e, _) => Scaffold(
        appBar: const IFarmAppBar(title: 'Pedido'),
        backgroundColor: AppColors.background,
        body: IFarmErrorState(
          onRetry: () => ref.invalidate(orderDetailProvider(orderId)),
        ),
      ),
      data: (order) => _OrderDetailBody(order: order, orderId: orderId),
    );
  }
}

class _OrderDetailBody extends ConsumerStatefulWidget {
  final OrderModel order;
  final String orderId;
  const _OrderDetailBody({required this.order, required this.orderId});

  @override
  ConsumerState<_OrderDetailBody> createState() => _OrderDetailBodyState();
}

class _OrderDetailBodyState extends ConsumerState<_OrderDetailBody> {
  bool _isConfirming = false;
  bool _isDisputing = false;
  final _disputeController = TextEditingController();

  @override
  void dispose() {
    _disputeController.dispose();
    super.dispose();
  }

  Future<void> _confirmDelivery() async {
    setState(() => _isConfirming = true);
    try {
      await ref.read(orderRepositoryProvider).confirmDelivery(widget.order.id);
      if (mounted) {
        ref.invalidate(orderDetailProvider(widget.orderId));
        context.showSnackBar('Recebimento confirmado com sucesso!');
      }
    } catch (e) {
      if (mounted) {
        context.showSnackBar('Erro ao confirmar recebimento.', isError: true);
      }
    } finally {
      if (mounted) setState(() => _isConfirming = false);
    }
  }

  Future<void> _submitDispute(String reason) async {
    if (reason.trim().isEmpty) return;
    setState(() => _isDisputing = true);
    try {
      await ref
          .read(orderRepositoryProvider)
          .disputeOrder(widget.order.id, reason.trim());
      if (mounted) {
        Navigator.of(context).pop();
        ref.invalidate(orderDetailProvider(widget.orderId));
        context.showSnackBar('Disputa aberta com sucesso.');
      }
    } catch (e) {
      if (mounted) {
        context.showSnackBar('Erro ao abrir disputa.', isError: true);
      }
    } finally {
      if (mounted) setState(() => _isDisputing = false);
    }
  }

  void _showConfirmDeliverySheet() {
    showIFarmBottomSheet(
      context: context,
      title: 'Confirmar Recebimento',
      content: Padding(
        padding: const EdgeInsets.fromLTRB(
            AppSpacing.lg, 0, AppSpacing.lg, AppSpacing.xxl),
        child: Column(
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: const BoxDecoration(
                color: AppColors.warningLight,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.warning_amber_rounded,
                  size: 32, color: AppColors.warning),
            ),
            const SizedBox(height: AppSpacing.lg),
            Text('Confirmar que recebeu o pedido?',
                style: AppTypography.titleLarge, textAlign: TextAlign.center),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'Ao confirmar, o pagamento será liberado ao fornecedor. Esta ação não pode ser desfeita.',
              style: AppTypography.bodyMedium
                  .copyWith(color: AppColors.textSecondary),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.xxl),
            Row(
              children: [
                Expanded(
                  child: IFarmButton(
                    label: 'Cancelar',
                    variant: IFarmButtonVariant.outline,
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: IFarmButton(
                    label: 'Confirmar',
                    isLoading: _isConfirming,
                    onPressed: () {
                      Navigator.of(context).pop();
                      _confirmDelivery();
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showDisputeSheet() {
    showIFarmBottomSheet(
      context: context,
      title: 'Abrir Disputa',
      content: Padding(
        padding: const EdgeInsets.fromLTRB(
            AppSpacing.lg, 0, AppSpacing.lg, AppSpacing.xxl),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Descreva o motivo da disputa:',
                style: AppTypography.bodyMedium
                    .copyWith(color: AppColors.textSecondary)),
            const SizedBox(height: AppSpacing.md),
            IFarmTextField(
              controller: _disputeController,
              label: 'Motivo',
              hint: 'Ex: Produto não chegou, produto avariado...',
              maxLines: 4,
            ),
            const SizedBox(height: AppSpacing.xl),
            IFarmButton(
              label: 'Enviar Disputa',
              variant: IFarmButtonVariant.danger,
              isLoading: _isDisputing,
              onPressed: () => _submitDispute(_disputeController.text),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final order = widget.order;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: IFarmAppBar(
        titleWidget: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('#${order.orderNumber}', style: AppTypography.headlineSmall),
          ],
        ),
      ),
      body: CustomScrollView(
        slivers: [
          SliverPadding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // 4-step lifecycle stepper
                _OrderStepper(order: order),
                const SizedBox(height: AppSpacing.lg),

                // Retailer card with location + rating
                if (order.retailer != null) ...[
                  _RetailerCard(retailer: order.retailer!),
                  const SizedBox(height: AppSpacing.lg),
                ],

                // Items list
                _ItemsSection(items: order.items),
                const SizedBox(height: AppSpacing.lg),

                // Payment section (with freight line)
                _PaymentSection(order: order),
                const SizedBox(height: AppSpacing.lg),

                // Tracking timeline
                if (order.trackingCode != null) ...[
                  _TrackingSection(order: order),
                  const SizedBox(height: AppSpacing.lg),
                ],

                // Tax summary
                _TaxSummarySection(order: order),
                const SizedBox(height: AppSpacing.xxxl),
              ]),
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomActions(order),
    );
  }

  Widget? _buildBottomActions(OrderModel order) {
    final showConfirm = order.canConfirmDelivery;
    final showDispute = order.canDispute;
    final showReview = order.canReview;

    if (!showConfirm && !showDispute && !showReview) return null;

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(
            AppSpacing.lg, AppSpacing.md, AppSpacing.lg, AppSpacing.md),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (showConfirm)
              IFarmButton(
                label: 'Confirmar Recebimento',
                icon: Icons.check_circle_outline,
                isLoading: _isConfirming,
                onPressed: _showConfirmDeliverySheet,
              ),
            if (showConfirm && (showDispute || showReview))
              const SizedBox(height: AppSpacing.sm),
            if (showDispute)
              IFarmButton(
                label: 'Abrir Disputa',
                variant: IFarmButtonVariant.danger,
                icon: Icons.flag_outlined,
                onPressed: _showDisputeSheet,
              ),
            if (showDispute && showReview)
              const SizedBox(height: AppSpacing.sm),
            if (showReview)
              IFarmButton(
                label: 'Avaliar Fornecedor',
                variant: IFarmButtonVariant.outline,
                icon: Icons.star_outline,
                onPressed: () {
                  context.showSnackBar('Funcionalidade de avaliação em breve.');
                },
              ),
          ],
        ),
      ),
    );
  }
}

// ─── 4-Step Stepper ──────────────────────────────────────────────────────────

class _OrderStepper extends StatelessWidget {
  final OrderModel order;
  const _OrderStepper({required this.order});

  // 4 steps only: Criado → Pago → Em Trânsito → Entregue
  static const _steps = [
    (status: OrderStatus.awaitingPayment, label: 'Criado', icon: Icons.receipt_outlined),
    (status: OrderStatus.paid, label: 'Pago', icon: Icons.payments_outlined),
    (status: OrderStatus.dispatched, label: 'Em Trânsito', icon: Icons.local_shipping_outlined),
    (status: OrderStatus.delivered, label: 'Entregue', icon: Icons.inventory_2_outlined),
  ];

  int get _currentIndex {
    switch (order.status) {
      case OrderStatus.awaitingPayment:
      case OrderStatus.preparing:
        return 0;
      case OrderStatus.paid:
        return 1;
      case OrderStatus.dispatched:
        return 2;
      case OrderStatus.delivered:
        return 3;
      default:
        return 0;
    }
  }

  bool _isCompleted(int i) => i < _currentIndex;
  bool _isCurrent(int i) => i == _currentIndex;

  @override
  Widget build(BuildContext context) {
    if (order.status == OrderStatus.cancelled ||
        order.status == OrderStatus.refunded ||
        order.status == OrderStatus.disputed) {
      return IFarmCard(
        child: Row(
          children: [
            Icon(order.status.icon, color: order.status.color, size: 28),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Status do Pedido', style: AppTypography.labelMedium),
                  const SizedBox(height: AppSpacing.xs),
                  Text(order.status.label,
                      style: AppTypography.titleMedium
                          .copyWith(color: order.status.color)),
                  if (order.disputeReason != null) ...[
                    const SizedBox(height: AppSpacing.xs),
                    Text('Motivo: ${order.disputeReason}',
                        style: AppTypography.bodySmall),
                  ],
                ],
              ),
            ),
          ],
        ),
      );
    }

    return IFarmCard(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Acompanhamento', style: AppTypography.titleMedium),
          const SizedBox(height: AppSpacing.lg),
          Row(
            children: List.generate(_steps.length * 2 - 1, (i) {
              if (i.isOdd) {
                final stepIdx = i ~/ 2;
                final filled =
                    _isCompleted(stepIdx + 1) || _isCurrent(stepIdx + 1);
                return Expanded(
                  child: Container(
                    height: 2,
                    color: filled ? AppColors.primary : AppColors.surfaceContainerHighest,
                  ),
                );
              }
              final stepIdx = i ~/ 2;
              final completed = _isCompleted(stepIdx);
              final current = _isCurrent(stepIdx);
              return Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    width: current ? 32 : 24,
                    height: current ? 32 : 24,
                    decoration: BoxDecoration(
                      color: completed || current
                          ? AppColors.primary
                          : AppColors.surfaceContainerHighest,
                      shape: BoxShape.circle,
                      border: current
                          ? Border.all(
                              color: AppColors.primaryContainer, width: 3)
                          : null,
                      boxShadow: current
                          ? [
                              BoxShadow(
                                color: AppColors.primary.withValues(alpha: 0.3),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              )
                            ]
                          : null,
                    ),
                    child: Icon(
                      completed ? Icons.check : _steps[stepIdx].icon,
                      size: current ? 16 : 12,
                      color: completed || current
                          ? Colors.white
                          : AppColors.textTertiary,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  SizedBox(
                    width: 60,
                    child: Text(
                      _steps[stepIdx].label,
                      style: AppTypography.labelSmall.copyWith(
                        color: completed || current
                            ? AppColors.primary
                            : AppColors.textTertiary,
                        fontWeight:
                            current ? FontWeight.w700 : FontWeight.w500,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ],
              );
            }),
          ),
          if (order.trackingCode != null) ...[
            const SizedBox(height: AppSpacing.lg),
            Divider(height: 1, color: AppColors.surfaceContainerLow),
            const SizedBox(height: AppSpacing.md),
            Row(
              children: [
                const Icon(Icons.local_shipping_outlined,
                    size: AppSpacing.iconSm, color: AppColors.textSecondary),
                const SizedBox(width: AppSpacing.xs),
                Text('Rastreio: ', style: AppTypography.bodySmall),
                Text(order.trackingCode!,
                    style: AppTypography.bodySmall
                        .copyWith(fontWeight: FontWeight.w600)),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

// ─── Retailer Card ────────────────────────────────────────────────────────────

class _RetailerCard extends StatelessWidget {
  final OrderRetailerInfo retailer;
  const _RetailerCard({required this.retailer});

  @override
  Widget build(BuildContext context) {
    return IFarmCard(
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerLow,
              borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
            ),
            child: const Icon(Icons.store_outlined,
                color: AppColors.primary, size: 22),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(retailer.displayName, style: AppTypography.titleMedium),
                const SizedBox(height: 2),
                // City, UF placeholder
                Text(
                  'Cidade, UF',
                  style: AppTypography.bodySmall
                      .copyWith(color: AppColors.textSecondary),
                ),
                if (retailer.avgRating > 0) ...[
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      const Icon(Icons.star_rounded,
                          size: 14, color: AppColors.secondary),
                      const SizedBox(width: 2),
                      Text(retailer.avgRating.toStringAsFixed(1),
                          style: AppTypography.bodySmall),
                    ],
                  ),
                ],
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.chat_bubble_outline,
                color: AppColors.textSecondary, size: 20),
            onPressed: () {},
          ),
        ],
      ),
    );
  }
}

// ─── Items Section ────────────────────────────────────────────────────────────

class _ItemsSection extends StatelessWidget {
  final List<OrderItem> items;
  const _ItemsSection({required this.items});

  @override
  Widget build(BuildContext context) {
    return IFarmCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.inventory_2_outlined,
                  size: AppSpacing.iconSm, color: AppColors.textSecondary),
              const SizedBox(width: AppSpacing.xs),
              Text('Itens do Pedido', style: AppTypography.titleMedium),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          ...items.map((item) => Padding(
                padding: const EdgeInsets.only(bottom: AppSpacing.md),
                child: _ItemRow(item: item),
              )),
          Divider(height: 1, color: AppColors.surfaceContainerLow),
          const SizedBox(height: AppSpacing.md),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Subtotal',
                  style: AppTypography.bodyMedium
                      .copyWith(fontWeight: FontWeight.w600)),
              Text(
                AppFormatters.currency(
                    items.fold(0.0, (sum, i) => sum + i.totalPrice)),
                style:
                    AppTypography.titleMedium.copyWith(color: AppColors.primary),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ItemRow extends StatelessWidget {
  final OrderItem item;
  const _ItemRow({required this.item});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: AppColors.surfaceContainerHigh,
            borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
          ),
          child: const Icon(Icons.grass_outlined,
              size: 18, color: AppColors.textSecondary),
        ),
        const SizedBox(width: AppSpacing.md),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(item.name, style: AppTypography.titleSmall),
              Text(
                '${item.quantity.toStringAsFixed(item.quantity.truncateToDouble() == item.quantity ? 0 : 2)} un × ${AppFormatters.currency(item.unitPrice)}',
                style: AppTypography.bodySmall,
              ),
            ],
          ),
        ),
        Text(
          AppFormatters.currency(item.totalPrice),
          style:
              AppTypography.titleSmall.copyWith(color: AppColors.textPrimary),
        ),
      ],
    );
  }
}

// ─── Payment Section (with freight line) ─────────────────────────────────────

class _PaymentSection extends StatelessWidget {
  final OrderModel order;
  const _PaymentSection({required this.order});

  // Estimate freight as a flat placeholder; real value comes from order model
  double get _freight => 150.0;

  @override
  Widget build(BuildContext context) {
    return IFarmCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.payment_outlined,
                  size: AppSpacing.iconSm, color: AppColors.textSecondary),
              const SizedBox(width: AppSpacing.xs),
              Text('Pagamento', style: AppTypography.titleMedium),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          _InfoRow(label: 'Método', value: order.paymentMethod.label),
          const SizedBox(height: AppSpacing.sm),
          _InfoRow(
            label: 'Subtotal',
            value: AppFormatters.currency(
                order.items.fold(0.0, (s, i) => s + i.totalPrice)),
          ),
          const SizedBox(height: AppSpacing.sm),
          // Freight as separate line
          _InfoRow(
            label: 'Frete',
            value: AppFormatters.currency(_freight),
          ),
          const SizedBox(height: AppSpacing.md),
          Divider(height: 1, color: AppColors.surfaceContainerLow),
          const SizedBox(height: AppSpacing.md),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Total',
                  style: AppTypography.titleMedium
                      .copyWith(fontWeight: FontWeight.w700)),
              Text(
                AppFormatters.currency(order.totalAmount),
                style: AppTypography.titleLarge
                    .copyWith(color: AppColors.primary, fontWeight: FontWeight.w800),
              ),
            ],
          ),
          if (order.status == OrderStatus.awaitingPayment) ...[
            const SizedBox(height: AppSpacing.md),
            IFarmButton(
              label: order.paymentMethod == PaymentMethod.pix
                  ? 'Ver QR Code PIX'
                  : 'Ver Boleto',
              icon: order.paymentMethod == PaymentMethod.pix
                  ? Icons.qr_code
                  : Icons.receipt_long_outlined,
              variant: IFarmButtonVariant.outline,
              fullWidth: true,
              onPressed: () => context.push('/payment/${order.id}'),
            ),
          ],
        ],
      ),
    );
  }
}

// ─── Tracking Timeline ────────────────────────────────────────────────────────

class _TrackingSection extends StatelessWidget {
  final OrderModel order;
  const _TrackingSection({required this.order});

  static const _events = [
    _TrackingEvent(
      icon: Icons.check_circle_outline,
      label: 'Saiu para entrega',
      description: 'Transportadora iFarm Logistics',
      time: '08:45 — Hoje',
      done: true,
    ),
    _TrackingEvent(
      icon: Icons.local_shipping_outlined,
      label: 'Em trânsito',
      description: 'Centro de Distribuição — Fazenda Rio Grande, PR',
      time: '14:20 — Ontem',
      done: true,
    ),
    _TrackingEvent(
      icon: Icons.inventory_2_outlined,
      label: 'Pedido despachado',
      description: 'Pedido coletado pelo transportador',
      time: '09:00 — 2 dias atrás',
      done: false,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return IFarmCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.timeline_outlined,
                  size: AppSpacing.iconSm, color: AppColors.textSecondary),
              const SizedBox(width: AppSpacing.xs),
              Text('Rastreamento', style: AppTypography.titleMedium),
              const Spacer(),
              if (order.trackingCode != null)
                TextButton.icon(
                  onPressed: () async {
                    final uri = Uri.tryParse(
                        'https://maps.google.com/?q=${order.trackingCode}');
                    if (uri != null && await canLaunchUrl(uri)) {
                      await launchUrl(uri,
                          mode: LaunchMode.externalApplication);
                    }
                  },
                  icon: const Icon(Icons.map_outlined, size: 16),
                  label: const Text('Ver Mapa'),
                  style: TextButton.styleFrom(
                    foregroundColor: AppColors.primary,
                    padding: EdgeInsets.zero,
                    visualDensity: VisualDensity.compact,
                  ),
                ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          ..._events.asMap().entries.map((entry) {
            final isLast = entry.key == _events.length - 1;
            final event = entry.value;
            return _TimelineRow(event: event, isLast: isLast);
          }),
        ],
      ),
    );
  }
}

class _TrackingEvent {
  final IconData icon;
  final String label;
  final String description;
  final String time;
  final bool done;
  const _TrackingEvent({
    required this.icon,
    required this.label,
    required this.description,
    required this.time,
    required this.done,
  });
}

class _TimelineRow extends StatelessWidget {
  final _TrackingEvent event;
  final bool isLast;
  const _TimelineRow({required this.event, required this.isLast});

  @override
  Widget build(BuildContext context) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 32,
            child: Column(
              children: [
                Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: event.done
                        ? AppColors.primary
                        : AppColors.surfaceContainerHighest,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    event.icon,
                    size: 12,
                    color: event.done ? Colors.white : AppColors.textTertiary,
                  ),
                ),
                if (!isLast)
                  Expanded(
                    child: Container(
                      width: 2,
                      color: AppColors.surfaceContainerHighest,
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(bottom: isLast ? 0 : AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(event.label,
                      style: AppTypography.titleSmall.copyWith(
                        color: event.done
                            ? AppColors.onSurface
                            : AppColors.textTertiary,
                      )),
                  const SizedBox(height: 2),
                  Text(event.description,
                      style: AppTypography.bodySmall
                          .copyWith(color: AppColors.textSecondary)),
                  const SizedBox(height: 2),
                  Text(event.time,
                      style: AppTypography.labelSmall
                          .copyWith(color: AppColors.textTertiary)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Tax Summary ──────────────────────────────────────────────────────────────

class _TaxSummarySection extends StatelessWidget {
  final OrderModel order;
  const _TaxSummarySection({required this.order});

  double get _estimatedIcms => order.totalAmount * 0.12;

  @override
  Widget build(BuildContext context) {
    return IFarmCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.receipt_outlined,
                  size: AppSpacing.iconSm, color: AppColors.textSecondary),
              const SizedBox(width: AppSpacing.xs),
              Text('Resumo Fiscal', style: AppTypography.titleMedium),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          _InfoRow(
            label: 'Subtotal (produtos)',
            value: AppFormatters.currency(
                order.items.fold(0.0, (s, i) => s + i.totalPrice)),
          ),
          const SizedBox(height: AppSpacing.sm),
          _InfoRow(
            label: 'ICMS estimado (12%)',
            value: AppFormatters.currency(_estimatedIcms),
          ),
          const SizedBox(height: AppSpacing.md),
          Divider(height: 1, color: AppColors.surfaceContainerLow),
          const SizedBox(height: AppSpacing.md),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Total com impostos', style: AppTypography.titleMedium),
              Text(
                AppFormatters.currency(order.totalAmount),
                style: AppTypography.titleLarge
                    .copyWith(color: AppColors.primary),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            'Valores de ICMS calculados com base na alíquota estadual aplicável (RCQ-001).',
            style: AppTypography.bodySmall
                .copyWith(color: AppColors.textTertiary),
          ),
        ],
      ),
    );
  }
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;
  const _InfoRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 130,
          child: Text(label,
              style: AppTypography.bodySmall
                  .copyWith(color: AppColors.textSecondary)),
        ),
        Expanded(
          child: Text(value,
              style: AppTypography.bodyMedium
                  .copyWith(fontWeight: FontWeight.w500)),
        ),
      ],
    );
  }
}
