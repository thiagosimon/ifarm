import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/quotation_provider.dart';
import '../../widgets/ifarm_error_state.dart';
import 'package:ifarm_mobile/l10n/app_localizations.dart';
import '../../widgets/ifarm_star_rating.dart';

// Stitch design tokens
const _primary = Color(0xFF005129);
const _primaryFixed = Color(0xFFA5F4B8);
const _secondary = Color(0xFF795900);
const _secondaryContainer = Color(0xFFFFC641);
const _surface = Color(0xFFF7F9FB);
const _surfaceContainerLowest = Color(0xFFFFFFFF);
const _onSurface = Color(0xFF191C1E);
const _onSurfaceVariant = Color(0xFF404940);
const _outline = Color(0xFF707A70);
const _ambientShadow = Color(0x14005129);
const _ghostBorder = Color(0x26BFC9BE);

class ProposalComparisonScreen extends ConsumerWidget {
  final String quoteId;
  const ProposalComparisonScreen({super.key, required this.quoteId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l = AppLocalizations.of(context)!;
    final proposalsAsync = ref.watch(proposalComparisonProvider(quoteId));

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
          l.proposalComparisonTitle,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: _onSurface,
          ),
        ),
      ),
      body: proposalsAsync.when(
        loading: () =>
            const Center(child: CircularProgressIndicator(color: _primary)),
        error: (e, _) => IFarmErrorState(
          onRetry: () => ref.invalidate(proposalComparisonProvider(quoteId)),
        ),
        data: (proposals) {
          if (proposals.isEmpty) {
            return Center(
              child: Text(
                l.proposalComparisonEmpty,
                style: const TextStyle(color: _outline),
              ),
            );
          }

          // Sort cheapest first
          final sorted = [...proposals]..sort((a, b) =>
              a.totalWithTaxAndDelivery.compareTo(b.totalWithTaxAndDelivery));

          final bestPrice = sorted.first.totalWithTaxAndDelivery;
          final fastestDays =
              sorted.map((p) => p.deliveryDays).reduce((a, b) => a < b ? a : b);

          // Compute average for savings bar
          final avg =
              sorted.fold<double>(0, (s, p) => s + p.totalWithTaxAndDelivery) /
                  sorted.length;
          final savings = avg - bestPrice;

          return Column(
            children: [
              // Horizontally scrolling proposal cards
              Expanded(
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.fromLTRB(16, 20, 16, 20),
                  itemCount: sorted.length,
                  itemBuilder: (_, i) {
                    final p = sorted[i];
                    final isBest = p.totalWithTaxAndDelivery == bestPrice;
                    final isFastest = p.deliveryDays == fastestDays && !isBest;
                    // Card width: screen width - 64 so next card peeks
                    final cardWidth = MediaQuery.of(context).size.width - 64;

                    return SizedBox(
                      width: cardWidth,
                      child: Container(
                        margin: const EdgeInsets.only(right: 12),
                        decoration: BoxDecoration(
                          color: _surfaceContainerLowest,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isBest ? _primary : _ghostBorder,
                            width: isBest ? 2 : 1,
                          ),
                          boxShadow: const [
                            BoxShadow(
                              color: _ambientShadow,
                              blurRadius: 10,
                              offset: Offset(0, 3),
                            ),
                          ],
                        ),
                        padding: const EdgeInsets.all(18),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Badges row
                            if (isBest || isFastest)
                              Padding(
                                padding: const EdgeInsets.only(bottom: 10),
                                child: Row(
                                  children: [
                                    if (isBest)
                                      _Badge(
                                        label: l.proposalComparisonBestPrice,
                                        bgColor: _primaryFixed,
                                        textColor: _primary,
                                      ),
                                    if (isFastest) ...[
                                      if (isBest) const SizedBox(width: 6),
                                      _Badge(
                                        label: l.proposalComparisonFastDelivery,
                                        bgColor: _secondaryContainer,
                                        textColor: _secondary,
                                      ),
                                    ],
                                  ],
                                ),
                              ),

                            // Retailer name
                            Text(
                              p.retailerSnapshot.displayName,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: _onSurface,
                              ),
                            ),
                            const SizedBox(height: 4),
                            IFarmStarRating(
                              rating: p.retailerSnapshot.avgRating,
                              size: 14,
                            ),

                            const SizedBox(height: 14),
                            const Divider(color: _ghostBorder, height: 1),
                            const SizedBox(height: 14),

                            // Per-item pricing (productId only — name/qty not in ProposalItem)
                            ...p.items.map((item) => Padding(
                                  padding: const EdgeInsets.only(bottom: 6),
                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        'R\$ ${item.unitPrice.toStringAsFixed(2)} / un.',
                                        style: const TextStyle(
                                          fontSize: 11,
                                          color: _onSurfaceVariant,
                                        ),
                                      ),
                                      Text(
                                        'R\$ ${item.totalPrice.toStringAsFixed(2)}',
                                        style: const TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w600,
                                          color: _onSurface,
                                        ),
                                      ),
                                    ],
                                  ),
                                )),

                            const Divider(color: _ghostBorder, height: 16),

                            // Summary rows
                            _SummaryRow(
                              label: l.proposalDetailSubtotal,
                              value:
                                  'R\$ ${p.subtotalAmount.toStringAsFixed(2)}',
                            ),
                            _SummaryRow(
                              label: l.proposalComparisonFreight,
                              value: p.deliveryFee == 0
                                  ? l.proposalDetailFreeShipping
                                  : 'R\$ ${p.deliveryFee.toStringAsFixed(2)}',
                            ),
                            if (p.taxInfo != null)
                              _SummaryRow(
                                label: l.proposalDetailTaxes,
                                value:
                                    'R\$ ${(p.taxInfo!.stateSalesTaxAmount + p.taxInfo!.taxSubstitutionAmount + p.taxInfo!.interstateVatDifferential).toStringAsFixed(2)}',
                              ),
                            _SummaryRow(
                              label: l.proposalComparisonDeliveryTime,
                              value: l.proposalComparisonDays(p.deliveryDays),
                            ),

                            const Divider(color: _ghostBorder, height: 16),

                            // Total
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  l.proposalComparisonTotalPrice,
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w700,
                                    color: _onSurface,
                                  ),
                                ),
                                Text(
                                  'R\$ ${p.totalWithTaxAndDelivery.toStringAsFixed(2)}',
                                  style: const TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.w800,
                                    color: _primary,
                                  ),
                                ),
                              ],
                            ),

                            const Spacer(),
                            const SizedBox(height: 16),

                            // Accept button
                            SizedBox(
                              width: double.infinity,
                              height: 46,
                              child: DecoratedBox(
                                decoration: BoxDecoration(
                                  gradient: isBest
                                      ? const LinearGradient(
                                          colors: [_primary, Color(0xFF1A6B3C)],
                                          begin: Alignment.centerLeft,
                                          end: Alignment.centerRight,
                                        )
                                      : null,
                                  color:
                                      isBest ? null : _surfaceContainerLowest,
                                  borderRadius: BorderRadius.circular(12),
                                  border: isBest
                                      ? null
                                      : Border.all(color: _primary, width: 1.5),
                                  boxShadow: isBest
                                      ? const [
                                          BoxShadow(
                                            color: _ambientShadow,
                                            blurRadius: 8,
                                            offset: Offset(0, 3),
                                          )
                                        ]
                                      : null,
                                ),
                                child: TextButton(
                                  onPressed: () => context
                                      .push('/quote/$quoteId/proposal/${p.id}'),
                                  child: Text(
                                    l.proposalComparisonSelect,
                                    style: TextStyle(
                                      color: isBest ? Colors.white : _primary,
                                      fontSize: 14,
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
                  },
                ),
              ),

              // ── Savings bar ─────────────────────────────────────────
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [_primary, _secondary],
                      begin: Alignment.centerLeft,
                      end: Alignment.centerRight,
                    ),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.savings_outlined,
                          color: Colors.white, size: 18),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          savings > 0
                              ? l.proposalComparisonEstimatedSavings(
                                  savings.toStringAsFixed(2))
                              : l.proposalComparisonEstimatedSavingsGeneric,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  final String label;
  final Color bgColor;
  final Color textColor;
  const _Badge(
      {required this.label, required this.bgColor, required this.textColor});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(99),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w700,
          color: textColor,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}

class _SummaryRow extends StatelessWidget {
  final String label;
  final String value;
  const _SummaryRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: const TextStyle(fontSize: 12, color: _onSurfaceVariant)),
          Text(value,
              style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: _onSurface)),
        ],
      ),
    );
  }
}
