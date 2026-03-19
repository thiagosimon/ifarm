import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/utils/formatters.dart';
import '../../providers/quotation_provider.dart';
import '../../widgets/ifarm_error_state.dart';
import '../../widgets/ifarm_star_rating.dart';
import '../../widgets/status_badge.dart';
import '../../widgets/currency_text.dart';

// Stitch design tokens
const _primary = Color(0xFF005129);
const _primaryFixed = Color(0xFFA5F4B8);
const _surface = Color(0xFFF7F9FB);
const _surfaceContainerLowest = Color(0xFFFFFFFF);
const _onSurface = Color(0xFF191C1E);
const _onSurfaceVariant = Color(0xFF404940);
const _outline = Color(0xFF707A70);
const _ambientShadow = Color(0x14005129);
const _ghostBorder = Color(0x26BFC9BE);

class QuoteDetailScreen extends ConsumerWidget {
  final String quoteId;
  const QuoteDetailScreen({super.key, required this.quoteId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final detailAsync = ref.watch(quoteDetailProvider(quoteId));

    return Scaffold(
      backgroundColor: _surface,
      appBar: AppBar(
        backgroundColor: _surfaceContainerLowest,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: _onSurface),
          onPressed: () => Navigator.of(context).maybePop(),
        ),
        title: const Text(
          'Detalhe da Cotação',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: _onSurface,
          ),
        ),
      ),
      body: detailAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: _primary),
        ),
        error: (e, _) => IFarmErrorState(
          onRetry: () => ref.invalidate(quoteDetailProvider(quoteId)),
        ),
        data: (data) {
          final quote = data.quote;
          final proposals = data.proposals;

          // Determine cheapest proposal for RECOMENDADO badge
          double? minTotal;
          if (proposals.isNotEmpty) {
            minTotal = proposals
                .map((p) => p.totalWithTaxAndDelivery)
                .reduce((a, b) => a < b ? a : b);
          }

          final firstItemName = quote.items.isNotEmpty
              ? quote.items.first.productSnapshot.name
              : quote.quoteNumber;

          return RefreshIndicator(
            color: _primary,
            onRefresh: () async => ref.invalidate(quoteDetailProvider(quoteId)),
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
              children: [
                // ── Quote summary card ─────────────────────────────────
                _StitchCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  firstItemName,
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w700,
                                    color: _onSurface,
                                  ),
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  quote.quoteNumber,
                                  style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                    color: _outline,
                                    letterSpacing: 1.0,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 12),
                          QuoteStatusBadge(status: quote.status),
                        ],
                      ),
                      const SizedBox(height: 12),
                      const Divider(color: _ghostBorder, height: 1),
                      const SizedBox(height: 12),
                      _InfoRow(
                        icon: Icons.calendar_today_outlined,
                        label: 'Expira em',
                        value: AppFormatters.dateFromString(
                            quote.expiresAt.toIso8601String()),
                      ),
                      const SizedBox(height: 6),
                      _InfoRow(
                        icon: Icons.payments_outlined,
                        label: 'Pagamento',
                        value: quote.preferredPaymentMethod.label,
                      ),
                      const SizedBox(height: 6),
                      _InfoRow(
                        icon: Icons.local_shipping_outlined,
                        label: 'Entrega',
                        value: quote.deliveryMode.label,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // ── Items section ──────────────────────────────────────
                const _SectionTitle(text: 'Itens solicitados'),
                const SizedBox(height: 10),
                ...quote.items.map((item) => _ItemCard(item: item)),

                // ── Proposals section ─────────────────────────────────
                if (proposals.isNotEmpty) ...[
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _SectionTitle(
                          text: 'Propostas (${proposals.length})'),
                      TextButton(
                        onPressed: () =>
                            context.push('/quote/$quoteId/compare'),
                        style: TextButton.styleFrom(
                          foregroundColor: _primary,
                          textStyle: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        child: const Text('Comparar'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  ...proposals.map((p) {
                    final isBest = minTotal != null &&
                        p.totalWithTaxAndDelivery == minTotal;
                    return _ProposalCard(
                      proposal: p,
                      isBest: isBest,
                      onTap: () => context
                          .push('/quote/$quoteId/proposal/${p.id}'),
                    );
                  }),
                ],
              ],
            ),
          );
        },
      ),
    );
  }
}

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
          BoxShadow(
              color: _ambientShadow, blurRadius: 8, offset: Offset(0, 2)),
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

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  const _InfoRow(
      {required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 15, color: _onSurfaceVariant),
        const SizedBox(width: 6),
        Text(
          '$label: ',
          style: const TextStyle(fontSize: 12, color: _onSurfaceVariant),
        ),
        Text(
          value,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: _onSurface,
          ),
        ),
      ],
    );
  }
}

class _ItemCard extends StatelessWidget {
  final dynamic item;
  const _ItemCard({required this.item});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: _surfaceContainerLowest,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _ghostBorder, width: 1),
        boxShadow: const [
          BoxShadow(
              color: _ambientShadow, blurRadius: 8, offset: Offset(0, 2)),
        ],
      ),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.productSnapshot.name,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: _onSurface,
                  ),
                ),
                // NCM intentionally omitted per design spec
              ],
            ),
          ),
          Text(
            '${item.quantity} ${item.measurementUnit}',
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: _onSurface,
            ),
          ),
        ],
      ),
    );
  }
}

class _ProposalCard extends StatelessWidget {
  final dynamic proposal;
  final bool isBest;
  final VoidCallback onTap;
  const _ProposalCard({
    required this.proposal,
    required this.isBest,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        decoration: BoxDecoration(
          color: _surfaceContainerLowest,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isBest ? _primary : _ghostBorder,
            width: isBest ? 1.5 : 1,
          ),
          boxShadow: const [
            BoxShadow(
                color: _ambientShadow, blurRadius: 8, offset: Offset(0, 2)),
          ],
        ),
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          proposal.retailerSnapshot.displayName,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: _onSurface,
                          ),
                        ),
                      ),
                      if (isBest)
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: _primaryFixed,
                            borderRadius: BorderRadius.circular(99),
                          ),
                          child: const Text(
                            'RECOMENDADO',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: _primary,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  IFarmStarRating(
                    rating: proposal.retailerSnapshot.avgRating,
                    size: 14,
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.local_shipping_outlined,
                          size: 13, color: _onSurfaceVariant),
                      const SizedBox(width: 4),
                      Text(
                        '${proposal.deliveryDays} dias úteis',
                        style: const TextStyle(
                            fontSize: 12, color: _onSurfaceVariant),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                CurrencyText(value: proposal.totalWithTaxAndDelivery, large: true),
                const SizedBox(height: 4),
                const Icon(Icons.chevron_right, color: _outline, size: 24),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
