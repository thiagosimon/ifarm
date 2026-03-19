import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/catalog_provider.dart';
import '../../providers/quotation_provider.dart';
import 'package:ifarm_mobile/l10n/app_localizations.dart';
import 'package:ifarm_mobile/core/constants/enum_extensions.dart';

// ── Design tokens ─────────────────────────────────────────────────────────────
const _primary = Color(0xFF005129);
const _primaryContainer = Color(0xFF1A6B3C);
const _primaryFixed = Color(0xFFA5F4B8);
const _secondary = Color(0xFF795900);
const _surface = Color(0xFFF7F9FB);
const _surfaceLowest = Color(0xFFFFFFFF);
const _surfaceLow = Color(0xFFF2F4F6);
const _surfaceContainerHighest = Color(0xFFE0E3E5);
const _onSurface = Color(0xFF191C1E);
const _onSurfaceVariant = Color(0xFF404940);
const _outline = Color(0xFF707A70);
const _ambientShadow = Color(0x14005129);
const _ghostBorder = Color(0x26BFC9BE);

class ProductDetailScreen extends ConsumerWidget {
  final String productId;
  const ProductDetailScreen({super.key, required this.productId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l = AppLocalizations.of(context)!;
    final productAsync = ref.watch(productDetailProvider(productId));
    final bottomPadding = MediaQuery.of(context).padding.bottom;

    return Scaffold(
      backgroundColor: _surface,
      body: productAsync.when(
        loading: () => const Scaffold(
          body: Center(child: CircularProgressIndicator(color: _primary)),
        ),
        error: (e, _) => Scaffold(
          appBar: AppBar(
            backgroundColor: _surfaceLowest,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new, color: _onSurface),
              onPressed: () => context.pop(),
            ),
          ),
          body: Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.error_outline, size: 48, color: _outline),
                const SizedBox(height: 12),
                Text(
                  l.productDetailError,
                  style: const TextStyle(color: _onSurfaceVariant),
                ),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () =>
                      ref.invalidate(productDetailProvider(productId)),
                  child: Text(l.productDetailRetry,
                      style: const TextStyle(color: _primary)),
                ),
              ],
            ),
          ),
        ),
        data: (product) {
          final imageUrl = product.primaryImageUrl;
          final brand = product.brand;
          final name = product.name;
          final category = product.category.localizedLabel(context);
          final isRuralCredit = product.isRuralCreditEligible;
          final description = product.description;
          final attributes = product.attributes;

          return CustomScrollView(
            slivers: [
              // ── Hero image app bar ─────────────────────────────────────
              SliverAppBar(
                expandedHeight: 280,
                pinned: true,
                backgroundColor: _surfaceLowest,
                leading: IconButton(
                  icon: const Icon(Icons.arrow_back_ios_new, color: _onSurface),
                  onPressed: () => context.pop(),
                ),
                title: const Text(
                  'iFarm',
                  style: TextStyle(
                    fontWeight: FontWeight.w900,
                    color: _primary,
                    letterSpacing: -1.0,
                  ),
                ),
                actions: [
                  IconButton(
                    icon: const Icon(Icons.share_outlined, color: _onSurface),
                    onPressed: () {},
                  ),
                  IconButton(
                    icon: const Icon(Icons.favorite_border, color: _onSurface),
                    onPressed: () {},
                  ),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  background: imageUrl != null && imageUrl.isNotEmpty
                      ? Image.network(
                          imageUrl,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) =>
                              const _ImagePlaceholder(),
                        )
                      : const _ImagePlaceholder(),
                ),
              ),

              // ── Detail content ─────────────────────────────────────────
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Badges row
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          // Category chip
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: _surfaceLow,
                              borderRadius: BorderRadius.circular(100),
                            ),
                            child: Text(
                              category,
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: _primary,
                              ),
                            ),
                          ),
                          // Rural credit badge
                          if (isRuralCredit)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: _secondary,
                                borderRadius: BorderRadius.circular(100),
                              ),
                              child: Text(
                                l.productDetailRuralCredit,
                                style: const TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // Brand
                      if (brand.isNotEmpty)
                        Text(
                          brand.toUpperCase(),
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: _outline,
                            letterSpacing: 1.2,
                          ),
                        ),
                      const SizedBox(height: 4),

                      // Product name
                      Text(
                        name,
                        style: const TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w800,
                          color: _onSurface,
                          letterSpacing: -1,
                          height: 1.15,
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Price / availability row
                      Row(
                        children: [
                          Text(
                            l.productDetailPriceOnRequest,
                            style: const TextStyle(
                              fontSize: 14,
                              color: _onSurfaceVariant,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 6, vertical: 3),
                            decoration: BoxDecoration(
                              color: _primaryFixed,
                              borderRadius: BorderRadius.circular(100),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(
                                  Icons.circle,
                                  color: _primary,
                                  size: 8,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  l.productDetailAvailable,
                                  style: const TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w700,
                                    color: _primary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Regional demand index
                      Text(
                        l.productDetailRegionalDemandIndex,
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: _outline,
                          letterSpacing: 1.2,
                        ),
                      ),
                      const SizedBox(height: 8),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: const LinearProgressIndicator(
                          value: 0.72,
                          color: _primary,
                          backgroundColor: _surfaceContainerHighest,
                          minHeight: 8,
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Description section
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: _surfaceLow,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              l.productDetailDescription,
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: _onSurface,
                                letterSpacing: 1.2,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              description.isNotEmpty
                                  ? description
                                  : l.productDetailDefaultDescription,
                              style: const TextStyle(
                                fontSize: 14,
                                color: _onSurfaceVariant,
                                height: 1.6,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Specifications section
                      if (attributes.isNotEmpty)
                        Container(
                          decoration: BoxDecoration(
                            color: _surfaceLowest,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: _ghostBorder, width: 1),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Padding(
                                padding:
                                    const EdgeInsets.fromLTRB(20, 20, 20, 12),
                                child: Text(
                                  l.productDetailTechnicalInfo,
                                  style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: _onSurface,
                                    letterSpacing: 1.2,
                                  ),
                                ),
                              ),
                              ...attributes.asMap().entries.map((entry) {
                                final i = entry.key;
                                final attr = entry.value;
                                return Container(
                                  color:
                                      i.isEven ? _surfaceLow : _surfaceLowest,
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 12),
                                  child: Row(
                                    children: [
                                      Text(
                                        attr.key,
                                        style: const TextStyle(
                                          fontSize: 13,
                                          color: _outline,
                                        ),
                                      ),
                                      const Spacer(),
                                      Text(
                                        '${attr.value}${attr.unit != null ? ' ${attr.unit}' : ''}',
                                        style: const TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w600,
                                          color: _onSurface,
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              }),
                            ],
                          ),
                        ),
                      const SizedBox(height: 16),

                      // Warranty badge
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: const Color(0xFFECEEF0),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.verified_user,
                                color: _primary, size: 32),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    l.productDetailWarrantyTitle,
                                    style: const TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w700,
                                      color: _onSurface,
                                    ),
                                  ),
                                  Text(
                                    l.productDetailWarrantyDescription,
                                    style: const TextStyle(
                                      fontSize: 13,
                                      color: _outline,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Space for bottom bar
                      const SizedBox(height: 100),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
      bottomNavigationBar: productAsync.value != null
          ? Container(
              color: _surfaceLowest,
              padding: EdgeInsets.only(
                bottom: bottomPadding + 16,
                top: 16,
                left: 24,
                right: 24,
              ),
              decoration: const BoxDecoration(
                color: _surfaceLowest,
                boxShadow: [
                  BoxShadow(
                    color: _ambientShadow,
                    offset: Offset(0, 8),
                    blurRadius: 24,
                  ),
                ],
              ),
              child: Container(
                height: 52,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [_primary, _primaryContainer],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: () {
                      final product = productAsync.value!;
                      ref.read(quoteCartProvider.notifier).addItem(
                            QuoteCartItem(
                              productId: product.id,
                              productName: product.name,
                              tariffCode: product.tariffCode,
                              category: product.category.value,
                              measurementUnit: product.measurementUnit,
                            ),
                          );
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(l.productDetailAddedToQuote),
                          backgroundColor: _primaryContainer,
                          behavior: SnackBarBehavior.floating,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      );
                    },
                    borderRadius: BorderRadius.circular(12),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.add_shopping_cart,
                            color: Colors.white, size: 20),
                        const SizedBox(width: 12),
                        Text(
                          l.productDetailAddToQuote,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            )
          : null,
    );
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

class _ImagePlaceholder extends StatelessWidget {
  const _ImagePlaceholder();

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFE6E8EA),
      child: const Center(
        child: Icon(
          Icons.inventory_2_outlined,
          size: 64,
          color: Color(0xFFBFC9BE),
        ),
      ),
    );
  }
}
