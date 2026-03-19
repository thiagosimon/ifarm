import 'package:flutter/material.dart';
import 'package:ifarm_mobile/l10n/app_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/enums.dart';
import '../../core/constants/enum_extensions.dart';
import '../../core/router/app_router.dart';
import '../../core/storage/secure_storage.dart';
import '../../providers/auth_provider.dart';
import '../../providers/quotation_provider.dart';
import '../../data/repositories/quotation_repository.dart';
import '../../widgets/ifarm_empty_state.dart';

// Stitch design tokens
const _primary = Color(0xFF005129);
const _primaryContainer = Color(0xFF1A6B3C);
const _surface = Color(0xFFF7F9FB);
const _surfaceContainerLowest = Color(0xFFFFFFFF);
const _surfaceContainerHigh = Color(0xFFE6E8EA);
const _onSurface = Color(0xFF191C1E);
const _onSurfaceVariant = Color(0xFF404940);
const _outline = Color(0xFF707A70);
const _error = Color(0xFFBA1A1A);
const _ambientShadow = Color(0x14005129);
const _ghostBorder = Color(0x26BFC9BE);

class QuoteBuilderScreen extends ConsumerStatefulWidget {
  const QuoteBuilderScreen({super.key});

  @override
  ConsumerState<QuoteBuilderScreen> createState() => _QuoteBuilderScreenState();
}

class _QuoteBuilderScreenState extends ConsumerState<QuoteBuilderScreen> {
  DeliveryMode _deliveryMode = DeliveryMode.deliveryAddress;
  PaymentMethod _paymentMethod = PaymentMethod.pix;
  int _expirationHours = 48;
  bool _isSubmitting = false;

  String _paymentDescription(PaymentMethod m) {
    switch (m) {
      case PaymentMethod.pix:
        return 'PIX · imediato';
      case PaymentMethod.ruralCredit:
        return 'Crédito Rural · aprovação 48h';
      case PaymentMethod.boleto:
        return 'Boleto · 30/60 dias';
      case PaymentMethod.creditCard:
        return 'Cartão de Crédito';
    }
  }

  Future<void> _submit() async {
    final l = AppLocalizations.of(context)!;
    final cart = ref.read(quoteCartProvider);
    if (cart.isEmpty) return;

    final farmerId = await SecureStorage.getFarmerId();
    final user = ref.read(currentUserProvider);
    if (farmerId == null) return;

    setState(() => _isSubmitting = true);
    try {
      final repo = ref.read(quotationRepositoryProvider);
      await repo.createQuote({
        'farmerId': farmerId,
        'farmerSnapshot': {
          'fullName': user?.name ?? '',
          'stateProvince': 'SP',
          'city': '',
        },
        'items': cart
            .map((item) => ({
                  'productId': item.productId,
                  'productSnapshot': {
                    'name': item.productName,
                    'category': item.category,
                    'tariffCode': item.tariffCode,
                    'measurementUnit': item.measurementUnit,
                  },
                  'quantity': item.quantity,
                  'measurementUnit': item.measurementUnit,
                }))
            .toList(),
        'deliveryMode': _deliveryMode.value,
        'preferredPaymentMethod': _paymentMethod.value,
        'expirationHours': _expirationHours,
      });

      ref.read(quoteCartProvider.notifier).clear();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(l.quoteBuilderSuccess)),
        );
        context.go(Routes.myQuotes);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: _error),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final cart = ref.watch(quoteCartProvider);
    final l = AppLocalizations.of(context)!;

    if (cart.isEmpty) {
      return Scaffold(
        backgroundColor: _surface,
        appBar: _buildAppBar(),
        body: IFarmEmptyState(
          title: 'Carrinho vazio',
          subtitle: 'Adicione produtos para criar um orçamento',
          icon: Icons.shopping_cart_outlined,
          actionLabel: 'Buscar Produtos',
          onAction: () => context.push(Routes.search),
        ),
      );
    }

    return Scaffold(
      backgroundColor: _surface,
      appBar: _buildAppBar(),
      body: Column(
        children: [
          // Scrollable content
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
              children: [
                // ── Items section ─────────────────────────────────────────
                _SectionLabel(label: l.quoteBuilderItemCount(cart.length)),
                const SizedBox(height: 12),
                ...cart.map((item) => _CartItemCard(
                      item: item,
                      onDecrement: () => ref
                          .read(quoteCartProvider.notifier)
                          .updateQuantity(item.productId, item.quantity - 1),
                      onIncrement: () => ref
                          .read(quoteCartProvider.notifier)
                          .updateQuantity(item.productId, item.quantity + 1),
                      onRemove: () => ref
                          .read(quoteCartProvider.notifier)
                          .removeItem(item.productId),
                    )),

                const SizedBox(height: 24),

                // ── Delivery section ──────────────────────────────────────
                _SectionLabel(label: l.quoteBuilderDeliveryAddress),
                const SizedBox(height: 12),
                _DeliveryCard(
                  value: _deliveryMode,
                  onChanged: (v) => setState(() => _deliveryMode = v),
                ),

                const SizedBox(height: 24),

                // ── Payment section ───────────────────────────────────────
                _SectionLabel(label: l.quoteBuilderPaymentCondition),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    PaymentMethod.pix,
                    PaymentMethod.ruralCredit,
                    PaymentMethod.boleto,
                  ].map((m) {
                    final selected = _paymentMethod == m;
                    return GestureDetector(
                      onTap: () => setState(() => _paymentMethod = m),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 150),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 10),
                        decoration: BoxDecoration(
                          color: selected
                              ? const Color(0xFFA5F4B8)
                              : _surfaceContainerHigh,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: selected ? _primary : Colors.transparent,
                            width: 1.5,
                          ),
                        ),
                        child: Text(
                          _paymentDescription(m),
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight:
                                selected ? FontWeight.w600 : FontWeight.w400,
                            color: selected ? _primary : _onSurfaceVariant,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),

                const SizedBox(height: 24),

                // ── Expiration section ────────────────────────────────────
                _SectionLabel(label: 'Prazo de Validade'),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  children: [24, 48, 72].map((h) {
                    final selected = _expirationHours == h;
                    return GestureDetector(
                      onTap: () => setState(() => _expirationHours = h),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 150),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 18, vertical: 10),
                        decoration: BoxDecoration(
                          color: selected
                              ? const Color(0xFFA5F4B8)
                              : _surfaceContainerHigh,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: selected ? _primary : Colors.transparent,
                            width: 1.5,
                          ),
                        ),
                        child: Text(
                          '${h}h',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight:
                                selected ? FontWeight.w600 : FontWeight.w400,
                            color: selected ? _primary : _onSurfaceVariant,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),

                const SizedBox(height: 16),
              ],
            ),
          ),

          // ── Sticky bottom summary bar ─────────────────────────────────
          _SummaryBar(
            cart: cart,
            isSubmitting: _isSubmitting,
            onSubmit: _submit,
          ),
        ],
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    final l = AppLocalizations.of(context)!;
    return AppBar(
      backgroundColor: _surfaceContainerLowest,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      shadowColor: _ambientShadow,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back, color: _onSurface),
        onPressed: () => context.pop(),
      ),
      title: Text(
        l.quoteBuilderTitle,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w700,
          color: _onSurface,
        ),
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  final String label;
  const _SectionLabel({required this.label});

  @override
  Widget build(BuildContext context) {
    return Text(
      label,
      style: const TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.w700,
        color: _onSurface,
        letterSpacing: 0.2,
      ),
    );
  }
}

class _CartItemCard extends StatelessWidget {
  final QuoteCartItem item;
  final VoidCallback onDecrement;
  final VoidCallback onIncrement;
  final VoidCallback onRemove;
  const _CartItemCard({
    required this.item,
    required this.onDecrement,
    required this.onIncrement,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: _surfaceContainerLowest,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _ghostBorder, width: 1),
        boxShadow: const [
          BoxShadow(color: _ambientShadow, blurRadius: 8, offset: Offset(0, 2)),
        ],
      ),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      child: Row(
        children: [
          // Product info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.productName,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: _onSurface,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  item.measurementUnit,
                  style: const TextStyle(
                    fontSize: 12,
                    color: _onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          // Quantity controls
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _QtyButton(
                icon: Icons.remove,
                onTap: onDecrement,
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: Text(
                  item.quantity == item.quantity.truncateToDouble()
                      ? item.quantity.toInt().toString()
                      : item.quantity.toStringAsFixed(1),
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: _onSurface,
                  ),
                ),
              ),
              _QtyButton(
                icon: Icons.add,
                onTap: onIncrement,
              ),
              const SizedBox(width: 4),
              GestureDetector(
                onTap: onRemove,
                child: const Padding(
                  padding: EdgeInsets.all(6),
                  child: Icon(Icons.delete_outline, color: _error, size: 20),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _QtyButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  const _QtyButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 30,
        height: 30,
        decoration: BoxDecoration(
          color: _surfaceContainerHigh,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, size: 16, color: _primary),
      ),
    );
  }
}

class _DeliveryCard extends StatelessWidget {
  final DeliveryMode value;
  final ValueChanged<DeliveryMode> onChanged;
  const _DeliveryCard({required this.value, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: _surfaceContainerLowest,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _ghostBorder, width: 1),
        boxShadow: const [
          BoxShadow(color: _ambientShadow, blurRadius: 8, offset: Offset(0, 2)),
        ],
      ),
      child: Column(
        children: DeliveryMode.values.map((mode) {
          final selected = value == mode;
          return InkWell(
            onTap: () => onChanged(mode),
            borderRadius: BorderRadius.circular(12),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              child: Row(
                children: [
                  Icon(
                    selected
                        ? Icons.radio_button_checked
                        : Icons.radio_button_off,
                    color: selected ? _primary : _outline,
                    size: 20,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    mode.localizedLabel(context),
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                      color: selected ? _onSurface : _onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _SummaryBar extends StatelessWidget {
  final List<QuoteCartItem> cart;
  final bool isSubmitting;
  final VoidCallback onSubmit;
  const _SummaryBar({
    required this.cart,
    required this.isSubmitting,
    required this.onSubmit,
  });

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    // We don't have real unit prices in the cart model; show item count as proxy.
    // When prices are available they'd be summed here.
    final itemCount = cart.fold<double>(0, (s, i) => s + i.quantity);

    return Container(
      decoration: const BoxDecoration(
        color: _surfaceContainerLowest,
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
        boxShadow: [
          BoxShadow(
              color: _ambientShadow, blurRadius: 16, offset: Offset(0, -4)),
        ],
      ),
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Frete',
                  style: TextStyle(fontSize: 13, color: _onSurfaceVariant),
                ),
                const Text(
                  'A combinar',
                  style: TextStyle(
                    fontSize: 13,
                    color: _outline,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Subtotal',
                  style: TextStyle(fontSize: 13, color: _onSurfaceVariant),
                ),
                Text(
                  '${cart.length} produto(s) · ${itemCount.toStringAsFixed(0)} un.',
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: _onSurface,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            const Divider(color: _ghostBorder, height: 1),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'TOTAL',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: _onSurface,
                  ),
                ),
                Text(
                  l.quoteBuilderItemCount(cart.length),
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: _primary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            // Gradient submit button
            SizedBox(
              width: double.infinity,
              height: 50,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [_primary, _primaryContainer],
                    begin: Alignment.centerLeft,
                    end: Alignment.centerRight,
                  ),
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: const [
                    BoxShadow(
                        color: _ambientShadow,
                        blurRadius: 8,
                        offset: Offset(0, 3)),
                  ],
                ),
                child: TextButton.icon(
                  onPressed: isSubmitting ? null : onSubmit,
                  icon: isSubmitting
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(
                              color: Colors.white, strokeWidth: 2),
                        )
                      : const Icon(Icons.send, color: Colors.white, size: 18),
                  label: Text(
                    isSubmitting ? 'Enviando...' : l.quoteBuilderSubmit,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
