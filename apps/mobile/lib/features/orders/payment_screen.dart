import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/formatters.dart';
import '../../data/models/transaction_model.dart';
import '../../providers/payment_provider.dart';
import '../../widgets/ifarm_button.dart';

class PaymentScreen extends ConsumerStatefulWidget {
  final String orderId;

  const PaymentScreen({super.key, required this.orderId});

  @override
  ConsumerState<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends ConsumerState<PaymentScreen> {
  Timer? _countdownTimer;
  Duration _remaining = Duration.zero;
  // ignore: unused_field — kept for future "Já paguei" refresh flow
  bool _refreshing = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initCountdown();
    });
  }

  void _initCountdown() {
    final payment = ref.read(paymentProvider(widget.orderId)).valueOrNull;
    if (payment != null && payment.isPix && payment.expiresAt != null) {
      _startCountdown(payment.expiresAt!);
    }
  }

  void _startCountdown(DateTime expiresAt) {
    _countdownTimer?.cancel();
    _updateRemaining(expiresAt);
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) _updateRemaining(expiresAt);
    });
  }

  void _updateRemaining(DateTime expiresAt) {
    final diff = expiresAt.difference(DateTime.now());
    setState(() {
      _remaining = diff.isNegative ? Duration.zero : diff;
    });
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    super.dispose();
  }

  String _formatCountdown(Duration d) {
    final h = d.inHours.toString().padLeft(2, '0');
    final m = (d.inMinutes % 60).toString().padLeft(2, '0');
    final s = (d.inSeconds % 60).toString().padLeft(2, '0');
    if (d.inHours > 0) return '$h:$m:$s';
    return '$m:$s';
  }

  Future<void> _copyToClipboard(String text, String label) async {
    await Clipboard.setData(ClipboardData(text: text));
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('$label copiado!'),
          backgroundColor: AppColors.success,
          duration: const Duration(seconds: 2),
        ),
      );
    }
  }

  Future<void> _openUrl(String url) async {
    final uri = Uri.tryParse(url);
    if (uri == null) return;
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final paymentAsync = ref.watch(paymentProvider(widget.orderId));

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        centerTitle: false,
        title: const Text('Pagamento via PIX',
            style: AppTypography.headlineSmall),
        leading: IconButton(
          icon: const Icon(Icons.close, color: AppColors.onSurface),
          onPressed: () => context.pop(),
        ),
      ),
      body: paymentAsync.when(
        loading: () => const Center(
            child: CircularProgressIndicator(color: AppColors.primary)),
        error: (e, _) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48, color: AppColors.error),
              const SizedBox(height: AppSpacing.md),
              Text('Erro ao carregar pagamento',
                  style: AppTypography.titleMedium),
              const SizedBox(height: AppSpacing.sm),
              IFarmButton(
                label: 'Tentar novamente',
                onPressed: () => ref.invalidate(paymentProvider(widget.orderId)),
                variant: IFarmButtonVariant.outline,
              ),
            ],
          ),
        ),
        data: (tx) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (tx.isPix && tx.expiresAt != null && _countdownTimer == null) {
              _startCountdown(tx.expiresAt!);
            }
          });
          return tx.isPix ? _buildPixView(tx) : _buildBoletoView(tx);
        },
      ),
    );
  }

  Widget _buildPixView(TransactionModel tx) {
    final isPaid = tx.isPaid;
    final isExpired =
        tx.expiresAt != null && _remaining == Duration.zero && !isPaid;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.xxl),
      child: Column(
        children: [
          // ── PIX Header card: gradient, order id, title, amount, countdown ──
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppSpacing.xxl),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF005129), Color(0xFF1A6B3C)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Order ID — 12px white 70%
                Text(
                  '#${tx.orderId}',
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: AppSpacing.xs),
                // "Pagamento PIX" — 20px w700 white
                const Text(
                  'Pagamento PIX',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                // Amount — 32px w900 white
                Text(
                  AppFormatters.currency(tx.amount),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 32,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -1,
                  ),
                ),
                if (tx.expiresAt != null && !isPaid) ...[
                  const SizedBox(height: AppSpacing.md),
                  // Countdown INSIDE card
                  Row(
                    children: [
                      const Icon(Icons.timer_outlined,
                          color: Colors.white, size: 20),
                      const SizedBox(width: AppSpacing.sm),
                      Text(
                        _formatCountdown(_remaining),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.w700,
                          fontFeatures: [FontFeature.tabularFigures()],
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xxl),

          if (isPaid) ...[
            _buildPaidBadge(),
          ] else if (isExpired) ...[
            _buildExpiredBanner(),
          ] else ...[
            // ── QR Code section (white card) ──
            if (tx.pixQrCode != null) ...[
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppSpacing.xl),
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
                child: Column(
                  children: [
                    QrImageView(
                      data: tx.pixQrCode!,
                      version: QrVersions.auto,
                      size: 220,
                      backgroundColor: Colors.white,
                    ),
                    const SizedBox(height: AppSpacing.md),
                    Text(
                      'Abra o app do seu banco e escolha a opção Pagar com QR Code',
                      textAlign: TextAlign.center,
                      style: AppTypography.bodySmall
                          .copyWith(color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.xl),
            ],

            // ── Status timeline (3 steps vertical) ──
            _buildStatusTimeline(),

            const SizedBox(height: AppSpacing.xl),

            // ── "Copiar código PIX" full-width outlined button ──
            if (tx.pixQrCode != null)
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 48),
                  side: const BorderSide(color: AppColors.primary),
                  foregroundColor: AppColors.primary,
                  shape: RoundedRectangleBorder(
                    borderRadius:
                        BorderRadius.circular(AppSpacing.radiusSm),
                  ),
                ),
                icon: const Icon(Icons.copy, size: 18),
                label: const Text('Copiar código PIX'),
                onPressed: () =>
                    _copyToClipboard(tx.pixQrCode!, 'Código PIX'),
              ),
          ],

          const SizedBox(height: AppSpacing.xl),

          // ── "Preciso de ajuda com o PIX" ──
          TextButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.help_outline,
                size: 18, color: AppColors.textSecondary),
            label: Text(
              'Preciso de ajuda com o PIX',
              style: AppTypography.bodyMedium
                  .copyWith(color: AppColors.textSecondary),
            ),
          ),

          const SizedBox(height: AppSpacing.lg),

          // ── Security footer ──
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.lock_outline,
                  size: 14, color: AppColors.textTertiary),
              const SizedBox(width: AppSpacing.xs),
              Text(
                'Pagamento processado com segurança',
                style: AppTypography.labelSmall
                    .copyWith(color: AppColors.textTertiary),
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.xxl),
        ],
      ),
    );
  }

  Widget _buildStatusTimeline() {
    final steps = [
      _StatusStep(
        icon: Icons.check_circle,
        label: 'Pedido Gerado',
        sublabel: 'Hoje, ${TimeOfDay.now().format(context)}',
        state: _StepState.done,
      ),
      _StatusStep(
        icon: Icons.hourglass_top_outlined,
        label: 'Aguardando Pagamento',
        sublabel: 'O código expira em 2 horas',
        state: _StepState.pending,
      ),
      _StatusStep(
        icon: Icons.inventory_2_outlined,
        label: 'Preparação para Envio',
        sublabel: 'Pendente',
        state: _StepState.future,
      ),
    ];

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        border: Border.all(
          color: AppColors.outlineVariant.withValues(alpha: 0.15),
        ),
      ),
      child: Column(
        children: steps.asMap().entries.map((entry) {
          final isLast = entry.key == steps.length - 1;
          return _StatusStepRow(step: entry.value, isLast: isLast);
        }).toList(),
      ),
    );
  }

  Widget _buildBoletoView(TransactionModel tx) {
    final isPaid = tx.isPaid;
    final isExpired = tx.expiresAt != null &&
        tx.expiresAt!.isBefore(DateTime.now()) &&
        !isPaid;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.xxl),
      child: Column(
        children: [
          // Header
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppSpacing.xl),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF475569), Color(0xFF64748B)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
            ),
            child: Column(
              children: [
                const Icon(Icons.receipt_long, color: Colors.white, size: 40),
                const SizedBox(height: AppSpacing.sm),
                const Text(
                  'Boleto Bancário',
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  AppFormatters.currency(tx.amount),
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 28,
                      fontWeight: FontWeight.w700),
                ),
                if (tx.expiresAt != null) ...[
                  const SizedBox(height: 6),
                  Text(
                    'Vencimento: ${AppFormatters.date(tx.expiresAt!)}',
                    style:
                        const TextStyle(color: Colors.white70, fontSize: 13),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xxl),

          if (isPaid) ...[
            _buildPaidBadge(),
          ] else if (isExpired) ...[
            _buildExpiredBanner(),
          ] else ...[
            if (tx.boletoBarcode != null) ...[
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppSpacing.lg),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerLowest,
                  borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                  border: Border.all(
                    color: AppColors.outlineVariant.withValues(alpha: 0.15),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Linha digitável',
                        style: AppTypography.labelMedium
                            .copyWith(color: AppColors.textSecondary)),
                    const SizedBox(height: AppSpacing.sm),
                    Text(
                      tx.boletoBarcode!,
                      style: const TextStyle(
                          fontFamily: 'monospace',
                          fontSize: 13,
                          letterSpacing: 0.5),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.md),
              IFarmButton(
                label: 'Copiar linha digitável',
                icon: Icons.copy,
                onPressed: () =>
                    _copyToClipboard(tx.boletoBarcode!, 'Linha digitável'),
                variant: IFarmButtonVariant.outline,
                fullWidth: true,
              ),
              const SizedBox(height: AppSpacing.md),
            ],
            if (tx.boletoUrl != null)
              IFarmButton(
                label: 'Abrir boleto no navegador',
                icon: Icons.open_in_new,
                onPressed: () => _openUrl(tx.boletoUrl!),
                fullWidth: true,
              ),
            const SizedBox(height: AppSpacing.md),
          ],

          const SizedBox(height: AppSpacing.xxl),
          _buildBoletoInstructions(),
        ],
      ),
    );
  }

  Widget _buildPaidBadge() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.xl),
      decoration: BoxDecoration(
        color: AppColors.primaryFixed.withValues(alpha: 0.3),
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.4)),
      ),
      child: Column(
        children: [
          const Icon(Icons.check_circle, color: AppColors.success, size: 48),
          const SizedBox(height: AppSpacing.sm),
          const Text(
            'Pagamento confirmado!',
            style: TextStyle(
                color: AppColors.success,
                fontSize: 18,
                fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            'Seu pedido está sendo processado.',
            style: AppTypography.bodySmall
                .copyWith(color: AppColors.textSecondary),
          ),
          const SizedBox(height: AppSpacing.lg),
          IFarmButton(
            label: 'Voltar ao pedido',
            onPressed: () => context.pop(),
            variant: IFarmButtonVariant.outline,
          ),
        ],
      ),
    );
  }

  Widget _buildExpiredBanner() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: AppColors.errorContainer,
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        border: Border.all(color: AppColors.error.withValues(alpha: 0.4)),
      ),
      child: Row(
        children: [
          const Icon(Icons.warning_amber_rounded, color: AppColors.error),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Text(
              'Este pagamento expirou. Entre em contato com o suporte.',
              style: AppTypography.bodyMedium
                  .copyWith(color: AppColors.onErrorContainer),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBoletoInstructions() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Sobre o boleto:',
              style: AppTypography.titleSmall
                  .copyWith(color: AppColors.textSecondary)),
          const SizedBox(height: AppSpacing.sm),
          for (final info in [
            'Prazo de compensação: até 3 dias úteis',
            'Pague em qualquer banco, lotérica ou pelo internet banking',
            'Após o vencimento, o boleto não poderá ser pago',
          ])
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 2),
              child: Text(
                '• $info',
                style: AppTypography.bodySmall
                    .copyWith(color: AppColors.textSecondary),
              ),
            ),
        ],
      ),
    );
  }
}

// ─── Status timeline step ─────────────────────────────────────────────────────

enum _StepState { done, pending, future }

class _StatusStep {
  final IconData icon;
  final String label;
  final String sublabel;
  final _StepState state;
  const _StatusStep({
    required this.icon,
    required this.label,
    required this.sublabel,
    required this.state,
  });
}

class _StatusStepRow extends StatefulWidget {
  final _StatusStep step;
  final bool isLast;
  const _StatusStepRow({required this.step, required this.isLast});

  @override
  State<_StatusStepRow> createState() => _StatusStepRowState();
}

class _StatusStepRowState extends State<_StatusStepRow>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseCtrl;
  late Animation<double> _pulseAnim;

  @override
  void initState() {
    super.initState();
    _pulseCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );
    _pulseAnim = Tween<double>(begin: 0.6, end: 1.0).animate(
      CurvedAnimation(parent: _pulseCtrl, curve: Curves.easeInOut),
    );
    if (widget.step.state == _StepState.pending) {
      _pulseCtrl.repeat(reverse: true);
    }
  }

  @override
  void dispose() {
    _pulseCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final step = widget.step;
    final Color iconBg;
    final Color iconFg;
    final IconData iconData;

    switch (step.state) {
      case _StepState.done:
        iconBg = AppColors.primary;
        iconFg = Colors.white;
        iconData = Icons.check_circle;
        break;
      case _StepState.pending:
        iconBg = AppColors.secondary;
        iconFg = Colors.white;
        iconData = Icons.hourglass_top_outlined;
        break;
      case _StepState.future:
        iconBg = AppColors.surfaceContainerHighest;
        iconFg = AppColors.textTertiary;
        iconData = step.icon;
        break;
    }

    Widget iconWidget = Container(
      width: 24,
      height: 24,
      decoration: BoxDecoration(color: iconBg, shape: BoxShape.circle),
      child: Icon(iconData, size: 13, color: iconFg),
    );

    if (step.state == _StepState.pending) {
      iconWidget = FadeTransition(opacity: _pulseAnim, child: iconWidget);
    }

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 28,
            child: Column(
              children: [
                iconWidget,
                if (!widget.isLast)
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
              padding:
                  EdgeInsets.only(bottom: widget.isLast ? 0 : AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    step.label,
                    style: AppTypography.titleSmall.copyWith(
                      color: step.state == _StepState.future
                          ? AppColors.textTertiary
                          : AppColors.onSurface,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    step.sublabel,
                    style: AppTypography.labelSmall
                        .copyWith(color: AppColors.textTertiary),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
