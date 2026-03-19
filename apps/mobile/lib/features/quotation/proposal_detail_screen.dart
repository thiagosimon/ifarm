import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/router/app_router.dart';
import '../../providers/quotation_provider.dart';
import '../../data/repositories/quotation_repository.dart';
import '../../widgets/ifarm_error_state.dart';
import '../../widgets/ifarm_star_rating.dart';
import 'package:ifarm_mobile/l10n/app_localizations.dart';
import '../../widgets/currency_text.dart';

// Stitch design tokens
const _primary = Color(0xFF005129);
const _surface = Color(0xFFF7F9FB);
const _surfaceContainerLowest = Color(0xFFFFFFFF);
const _onSurface = Color(0xFF191C1E);
const _onSurfaceVariant = Color(0xFF404940);
const _outline = Color(0xFF707A70);
const _error = Color(0xFFBA1A1A);
const _ambientShadow = Color(0x14005129);
const _ghostBorder = Color(0x26BFC9BE);

class ProposalDetailScreen extends ConsumerWidget {
  final String quoteId;
  final String proposalId;
  const ProposalDetailScreen({
    super.key,
    required this.quoteId,
    required this.proposalId,
  });

  Future<void> _accept(BuildContext context, WidgetRef ref) async {
    final l = AppLocalizations.of(context)!;
    final confirmed = await showModalBottomSheet<bool>(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => _AcceptBottomSheet(),
    );
    if (confirmed != true) return;
    try {
      await ref
          .read(quotationRepositoryProvider)
          .acceptProposal(quoteId: quoteId, proposalId: proposalId);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(l.proposalDetailAcceptSuccess)),
        );
        context.go(Routes.orders);
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: _error),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l = AppLocalizations.of(context)!;
    final detailAsync = ref.watch(quoteDetailProvider(quoteId));

    return Scaffold(
      backgroundColor: _surface,
      appBar: AppBar(
        backgroundColor: _surfaceContainerLowest,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: _onSurface),
          onPressed: () => context.pop(),
        ),
        title: Text(
          l.proposalDetailTitle,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: _onSurface,
          ),
        ),
      ),
      body: detailAsync.when(
        loading: () =>
            const Center(child: CircularProgressIndicator(color: _primary)),
        error: (e, _) => IFarmErrorState(
          onRetry: () => ref.invalidate(quoteDetailProvider(quoteId)),
        ),
        data: (data) {
          final proposal = data.proposals.firstWhere(
            (p) => p.id == proposalId,
            orElse: () => data.proposals.first,
          );
          final retailer = proposal.retailerSnapshot;
          final initials = retailer.displayName.isNotEmpty
              ? retailer.displayName
                  .trim()
                  .split(' ')
                  .take(2)
                  .map((w) => w[0].toUpperCase())
                  .join()
              : '?';

          final freightLabel =
              proposal.deliveryFee == 0 ? 'FRETE CIF' : 'FRETE FOB';

          return ListView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
            children: [
              // ── Retailer card ────────────────────────────────────────
              _StitchCard(
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 28,
                      backgroundColor: const Color(0xFFE6E8EA),
                      child: Text(
                        initials,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: _primary,
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            retailer.displayName,
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: _onSurface,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Row(
                            children: [
                              const Icon(Icons.location_on_outlined,
                                  size: 14, color: _onSurfaceVariant),
                              const SizedBox(width: 3),
                              Text(
                                retailer.stateProvince,
                                style: const TextStyle(
                                    fontSize: 12, color: _onSurfaceVariant),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          IFarmStarRating(
                            rating: retailer.avgRating,
                            size: 14,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // ── Items section ────────────────────────────────────────
              _SectionTitle(text: l.proposalDetailItems),
              const SizedBox(height: 10),
              ...data.quote.items.asMap().entries.map((entry) {
                final quoteItem = entry.value;
                final proposalItem = proposal.items.elementAtOrNull(entry.key);
                return _ItemRow(
                  name: quoteItem.productSnapshot.name,
                  quantity: quoteItem.quantity,
                  unit: quoteItem.measurementUnit,
                  unitPrice: proposalItem?.unitPrice,
                  totalPrice: proposalItem?.totalPrice,
                );
              }),

              const SizedBox(height: 16),

              // ── Financial summary ───────────────────────────────────
              _StitchCard(
                child: Column(
                  children: [
                    _FinancialRow(
                      label: l.proposalDetailSubtotal,
                      value:
                          'R\$ ${proposal.subtotalAmount.toStringAsFixed(2)}',
                    ),
                    const SizedBox(height: 8),

                    // Tax lines — always visible inline (no ExpansionTile)
                    if (proposal.taxInfo != null) ...[
                      _FinancialRow(
                        label:
                            'ICMS (${(proposal.taxInfo!.stateSalesTaxRate * 100).toStringAsFixed(1)}%)',
                        value:
                            'R\$ ${proposal.taxInfo!.stateSalesTaxAmount.toStringAsFixed(2)}',
                      ),
                      const SizedBox(height: 8),
                      _FinancialRow(
                        label: 'DIFAL',
                        value:
                            'R\$ ${proposal.taxInfo!.interstateVatDifferential.toStringAsFixed(2)}',
                      ),
                      const SizedBox(height: 8),
                      _FinancialRow(
                        label: 'ST',
                        value:
                            'R\$ ${proposal.taxInfo!.taxSubstitutionAmount.toStringAsFixed(2)}',
                      ),
                      const SizedBox(height: 8),
                    ],

                    _FinancialRow(
                      label: freightLabel,
                      value: proposal.deliveryFee == 0
                          ? l.proposalDetailFreeShipping
                          : 'R\$ ${proposal.deliveryFee.toStringAsFixed(2)}',
                      subLabel:
                          l.proposalDetailBusinessDays(proposal.deliveryDays),
                    ),

                    const SizedBox(height: 12),
                    const Divider(color: _ghostBorder, height: 1),
                    const SizedBox(height: 12),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          l.proposalDetailTotal,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: _onSurface,
                          ),
                        ),
                        CurrencyText(
                          value: proposal.totalWithTaxAndDelivery,
                          hero: true,
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              if (proposal.observations.isNotEmpty) ...[
                const SizedBox(height: 16),
                _SectionTitle(text: l.proposalDetailObservations),
                const SizedBox(height: 8),
                Text(
                  proposal.observations,
                  style: const TextStyle(
                    fontSize: 13,
                    color: _onSurfaceVariant,
                    height: 1.5,
                  ),
                ),
              ],

              const SizedBox(height: 32),

              // ── Accept button ────────────────────────────────────────
              SizedBox(
                width: double.infinity,
                height: 50,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [_primary, Color(0xFF1A6B3C)],
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
                    onPressed: () => _accept(context, ref),
                    icon:
                        const Icon(Icons.check, color: Colors.white, size: 18),
                    label: Text(
                      l.proposalDetailAccept,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 12),

              // ── Voltar e Revisar outlined button ─────────────────────
              SizedBox(
                width: double.infinity,
                height: 50,
                child: OutlinedButton(
                  onPressed: () => context.pop(),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: _primary,
                    side: const BorderSide(color: _primary, width: 1.5),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
                    l.proposalDetailCancel,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 16),
            ],
          );
        },
      ),
    );
  }
}

// ── Accept bottom sheet ────────────────────────────────────────────────────────

class _AcceptBottomSheet extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    return Container(
      decoration: const BoxDecoration(
        color: _surfaceContainerLowest,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: const EdgeInsets.fromLTRB(24, 24, 24, 32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: const Color(0xFFE0E3E5),
              borderRadius: BorderRadius.circular(99),
            ),
          ),
          const SizedBox(height: 24),
          const Icon(Icons.check_circle_outline, size: 52, color: _primary),
          const SizedBox(height: 16),
          Text(
            l.proposalDetailConfirm,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: _onSurface,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            l.proposalDetailConfirmAccept,
            style: const TextStyle(
              fontSize: 13,
              color: _onSurfaceVariant,
              height: 1.5,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 28),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [_primary, Color(0xFF1A6B3C)],
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: TextButton(
                onPressed: () => Navigator.pop(context, true),
                child: Text(
                  l.proposalDetailConfirm,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: OutlinedButton(
              onPressed: () => Navigator.pop(context, false),
              style: OutlinedButton.styleFrom(
                foregroundColor: _outline,
                side: const BorderSide(color: _ghostBorder, width: 1.5),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Text(
                l.proposalDetailCancel,
                style:
                    const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Reusable widgets ──────────────────────────────────────────────────────────

class _StitchCard extends StatelessWidget {
  final Widget child;
  const _StitchCard({required this.child});

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
      padding: const EdgeInsets.all(16),
      child: child,
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String text;
  const _SectionTitle({required this.text});

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.w700,
        color: _onSurface,
      ),
    );
  }
}

class _ItemRow extends StatelessWidget {
  final String name;
  final double quantity;
  final String unit;
  final double? unitPrice;
  final double? totalPrice;
  const _ItemRow({
    required this.name,
    required this.quantity,
    required this.unit,
    this.unitPrice,
    this.totalPrice,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: _surfaceContainerLowest,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _ghostBorder, width: 1),
        boxShadow: const [
          BoxShadow(color: _ambientShadow, blurRadius: 6, offset: Offset(0, 1)),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: _onSurface,
                  ),
                ),
                if (unitPrice != null) ...[
                  const SizedBox(height: 2),
                  Text(
                    'R\$ ${unitPrice!.toStringAsFixed(2)} / $unit',
                    style:
                        const TextStyle(fontSize: 11, color: _onSurfaceVariant),
                  ),
                ],
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '$quantity $unit',
                style: const TextStyle(
                  fontSize: 12,
                  color: _onSurfaceVariant,
                ),
              ),
              if (totalPrice != null)
                Text(
                  'R\$ ${totalPrice!.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: _onSurface,
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}

class _FinancialRow extends StatelessWidget {
  final String label;
  final String value;
  final String? subLabel;
  const _FinancialRow(
      {required this.label, required this.value, this.subLabel});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: const TextStyle(fontSize: 13, color: _onSurfaceVariant),
            ),
            if (subLabel != null)
              Text(
                subLabel!,
                style: const TextStyle(fontSize: 11, color: _outline),
              ),
          ],
        ),
        Text(
          value,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: _onSurface,
          ),
        ),
      ],
    );
  }
}
