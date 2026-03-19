import 'dart:ui';

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
const _secondary = Color(0xFF795900);
const _surface = Color(0xFFF7F9FB);
const _surfaceLowest = Color(0xFFFFFFFF);
const _surfaceLow = Color(0xFFF2F4F6);
const _surfaceHigh = Color(0xFFE6E8EA);
const _onSurface = Color(0xFF191C1E);
const _onSurfaceVariant = Color(0xFF404940);
const _outline = Color(0xFF707A70);
const _outlineVariant = Color(0xFFBFC9BE);
const _ambientShadow = Color(0x14005129);
const _ghostBorder = Color(0x26BFC9BE);

// ── Categories ────────────────────────────────────────────────────────────────
const _categories = [
  'Tudo',
  'Defensivos',
  'Sementes',
  'Nutrição',
  'Máquinas',
  'Irrigação',
  'Fertilizantes',
];

class ProductSearchScreen extends ConsumerStatefulWidget {
  const ProductSearchScreen({super.key});

  @override
  ConsumerState<ProductSearchScreen> createState() =>
      _ProductSearchScreenState();
}

class _ProductSearchScreenState extends ConsumerState<ProductSearchScreen> {
  final _searchCtrl = TextEditingController();
  int _selectedCategoryIndex = 0;
  bool? _ruralCreditFilter;
  ProductSearchParams _params = const ProductSearchParams();

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  void _applySearch() {
    final cat = _categories[_selectedCategoryIndex];
    setState(() {
      _params = ProductSearchParams(
        query: _searchCtrl.text.trim().isEmpty ? null : _searchCtrl.text.trim(),
        category: cat == 'Tudo' ? null : cat,
        isRuralCreditEligible: _ruralCreditFilter,
      );
    });
  }

  void _showFilters() {
    final l = AppLocalizations.of(context)!;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: _surfaceLowest,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) => StatefulBuilder(
        builder: (ctx, setLocal) => Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.viewInsetsOf(ctx).bottom,
            left: 24,
            right: 24,
            top: 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: _outlineVariant,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                l.productSearchFilters,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: _onSurface,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 20),
              Text(
                l.productSearchRuralCreditLabel,
                style: const TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  color: _outline,
                  letterSpacing: 1.2,
                ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  _FilterChip(
                    label: l.productSearchEligible,
                    selected: _ruralCreditFilter == true,
                    onSelected: (v) =>
                        setLocal(() => _ruralCreditFilter = v ? true : null),
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: l.productSearchAll,
                    selected: _ruralCreditFilter == null,
                    onSelected: (_) =>
                        setLocal(() => _ruralCreditFilter = null),
                  ),
                ],
              ),
              const SizedBox(height: 28),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [_primary, _primaryContainer],
                    ),
                    borderRadius: BorderRadius.circular(14),
                    boxShadow: const [
                      BoxShadow(
                        color: _ambientShadow,
                        offset: Offset(0, 8),
                        blurRadius: 24,
                      ),
                    ],
                  ),
                  child: TextButton(
                    onPressed: () {
                      _applySearch();
                      Navigator.pop(ctx);
                    },
                    style: TextButton.styleFrom(
                      foregroundColor: _surfaceLowest,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    child: Text(
                      l.productSearchApplyFilters,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: _surfaceLowest,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final productsAsync = ref.watch(productListProvider(_params));
    final l = AppLocalizations.of(context)!;
    final topPadding = MediaQuery.of(context).padding.top;
    // Header visual height: topPadding + 8 (paddingTop offset) + content + 12 (paddingBottom) + 1 (separator)
    final headerHeight = topPadding + 8 + 44 + 12 + 1;

    return Scaffold(
      backgroundColor: _surface,
      body: Stack(
        children: [
          // ── Scrollable content ───────────────────────────────────────────
          CustomScrollView(
            slivers: [
              // Reserve space for the fixed header
              SliverToBoxAdapter(child: SizedBox(height: headerHeight + 8)),

              // Hero title section
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
                sliver: SliverToBoxAdapter(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        l.productSearchHeroTitle,
                        style: const TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.w800,
                          color: _onSurface,
                          letterSpacing: -1,
                          height: 1.15,
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Search row
                      Row(
                        children: [
                          Expanded(
                            child: Container(
                              height: 56,
                              decoration: BoxDecoration(
                                color: _surfaceHigh,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: TextField(
                                controller: _searchCtrl,
                                onSubmitted: (_) => _applySearch(),
                                textInputAction: TextInputAction.search,
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: _onSurface,
                                ),
                                decoration: InputDecoration(
                                  hintText: l.productSearchPlaceholder,
                                  hintStyle: TextStyle(
                                    fontSize: 14,
                                    color: _outline,
                                  ),
                                  prefixIcon: Icon(
                                    Icons.search,
                                    color: _outline,
                                    size: 22,
                                  ),
                                  border: InputBorder.none,
                                  contentPadding: EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 16,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          GestureDetector(
                            onTap: _showFilters,
                            child: Container(
                              width: 56,
                              height: 56,
                              decoration: BoxDecoration(
                                color: _primary,
                                borderRadius: BorderRadius.circular(12),
                                boxShadow: const [
                                  BoxShadow(
                                    color: _ambientShadow,
                                    offset: Offset(0, 8),
                                    blurRadius: 24,
                                  ),
                                ],
                              ),
                              child: const Icon(
                                Icons.tune,
                                color: Colors.white,
                                size: 22,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Category chips
                      SizedBox(
                        height: 44,
                        child: ScrollConfiguration(
                          behavior: _HideScrollbarBehavior(),
                          child: ListView.separated(
                            scrollDirection: Axis.horizontal,
                            itemCount: _categories.length,
                            separatorBuilder: (_, __) =>
                                const SizedBox(width: 8),
                            itemBuilder: (_, i) {
                              final isActive = i == _selectedCategoryIndex;
                              return GestureDetector(
                                onTap: () {
                                  setState(() => _selectedCategoryIndex = i);
                                  _applySearch();
                                },
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 20,
                                    vertical: 10,
                                  ),
                                  decoration: BoxDecoration(
                                    color: isActive ? _primary : _surfaceLow,
                                    borderRadius: BorderRadius.circular(100),
                                  ),
                                  child: Text(
                                    _categories[i],
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600,
                                      color: isActive
                                          ? Colors.white
                                          : _onSurfaceVariant,
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Section label
                      Text(
                        l.productSearchAvailableProducts,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: _onSurfaceVariant,
                          letterSpacing: 1.2,
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],
                  ),
                ),
              ),

              // Product list
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                sliver: productsAsync.when(
                  loading: () => const SliverToBoxAdapter(
                    child: Center(
                      child: Padding(
                        padding: EdgeInsets.only(top: 48),
                        child: CircularProgressIndicator(color: _primary),
                      ),
                    ),
                  ),
                  error: (e, _) => SliverToBoxAdapter(
                    child: Center(
                      child: Padding(
                        padding: const EdgeInsets.all(32),
                        child: Column(
                          children: [
                            const Icon(Icons.error_outline,
                                size: 48, color: _outline),
                            const SizedBox(height: 12),
                            Text(
                              l.productSearchLoadError,
                              style: const TextStyle(color: _onSurfaceVariant),
                            ),
                            const SizedBox(height: 16),
                            TextButton(
                              onPressed: () => ref
                                  .read(productListProvider(_params).notifier)
                                  .load(),
                              child: Text(
                                l.productSearchRetry,
                                style: const TextStyle(color: _primary),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  data: (products) {
                    if (products.isEmpty) {
                      return SliverToBoxAdapter(
                        child: Center(
                          child: Padding(
                            padding: const EdgeInsets.all(48),
                            child: Column(
                              children: [
                                const Icon(Icons.search_off,
                                    size: 56, color: _outlineVariant),
                                const SizedBox(height: 16),
                                Text(
                                  l.productSearchEmpty,
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w700,
                                    color: _onSurface,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  l.productSearchEmptyHint,
                                  style: const TextStyle(
                                      fontSize: 13, color: _onSurfaceVariant),
                                  textAlign: TextAlign.center,
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    }
                    return SliverList(
                      delegate: SliverChildBuilderDelegate(
                        (_, i) => Padding(
                          padding: const EdgeInsets.only(bottom: 20),
                          child: _ProductCard(
                            product: products[i],
                            onTap: () =>
                                context.push('/product/${products[i].id}'),
                            onAddToCart: () {
                              ref.read(quoteCartProvider.notifier).addItem(
                                    QuoteCartItem(
                                      productId: products[i].id,
                                      productName: products[i].name,
                                      tariffCode: products[i].tariffCode,
                                      category: products[i].category.value,
                                      measurementUnit:
                                          products[i].measurementUnit,
                                    ),
                                  );
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(l.productSearchAddedToQuote),
                                  backgroundColor: _primaryContainer,
                                  behavior: SnackBarBehavior.floating,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                        childCount: products.length,
                      ),
                    );
                  },
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: 120)),
            ],
          ),

          // ── Glassmorphism header (fixed, not AppBar) ──────────────────────
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ClipRect(
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
                    child: Container(
                      color: const Color(0xFFFFFFFF).withValues(alpha: 0.85),
                      padding: EdgeInsets.only(
                        top: topPadding + 8,
                        bottom: 12,
                        left: 24,
                        right: 24,
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.agriculture,
                              color: _primary, size: 24),
                          const SizedBox(width: 8),
                          const Text(
                            'iFarm',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w900,
                              color: _primary,
                              letterSpacing: -1.5,
                            ),
                          ),
                          const Spacer(),
                          IconButton(
                            icon: const Icon(Icons.search_outlined,
                                color: _onSurface, size: 24),
                            onPressed: () {},
                            padding: EdgeInsets.zero,
                            constraints: const BoxConstraints(
                                minWidth: 40, minHeight: 40),
                          ),
                          // Notification button with orange dot badge
                          Stack(
                            clipBehavior: Clip.none,
                            children: [
                              IconButton(
                                icon: const Icon(Icons.notifications_outlined,
                                    color: _onSurface, size: 24),
                                onPressed: () => context.push('/notifications'),
                                padding: EdgeInsets.zero,
                                constraints: const BoxConstraints(
                                    minWidth: 40, minHeight: 40),
                              ),
                              Positioned(
                                top: 6,
                                right: 6,
                                child: Container(
                                  width: 8,
                                  height: 8,
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFFFC641),
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                        color: _surfaceLowest, width: 1.5),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                // Ghost separator line
                Container(height: 1, color: _ghostBorder),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Product Card ──────────────────────────────────────────────────────────────

class _ProductCard extends StatelessWidget {
  final dynamic product;
  final VoidCallback onTap;
  final VoidCallback onAddToCart;

  const _ProductCard({
    required this.product,
    required this.onTap,
    required this.onAddToCart,
  });

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    final imageUrl = product.primaryImageUrl as String?;
    final brand = product.brand as String;
    final categoryLabel = product.category.localizedLabel(context) as String;
    final name = product.name as String;
    final unit =
        product.measurementUnit as String? ?? l.productSearchDefaultUnit;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: _surfaceLowest,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: _ghostBorder, width: 1),
          boxShadow: const [
            BoxShadow(
              color: _ambientShadow,
              offset: Offset(0, 8),
              blurRadius: 24,
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Image + badge stack ──────────────────────────────────────
            Stack(
              clipBehavior: Clip.hardEdge,
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(16),
                  ),
                  child: imageUrl != null && imageUrl.isNotEmpty
                      ? Image.network(
                          imageUrl,
                          height: 224,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) =>
                              const _ImagePlaceholder(height: 224),
                        )
                      : const _ImagePlaceholder(height: 224),
                ),
                // PREMIUM badge
                Positioned(
                  top: 16,
                  left: 16,
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _secondary,
                      borderRadius: BorderRadius.circular(100),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.workspace_premium,
                          color: Colors.white,
                          size: 14,
                        ),
                        SizedBox(width: 4),
                        Text(
                          'PREMIUM',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                            letterSpacing: 1.2,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            // ── Card body ────────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Brand • Category
                  Text(
                    '${brand.isNotEmpty ? brand : "iFarm"} • $categoryLabel'
                        .toUpperCase(),
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      color: _primary,
                      letterSpacing: 1.4,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),

                  // Product name
                  Text(
                    name,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: _onSurface,
                      height: 1.2,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),

                  // Unit
                  Text(
                    unit,
                    style: const TextStyle(
                      fontSize: 13,
                      color: _outline,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Price row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'R\$',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: _primary,
                            ),
                          ),
                          Text(
                            l.productSearchPriceOnRequest,
                            style: const TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w800,
                              color: _primary,
                              letterSpacing: -0.5,
                            ),
                          ),
                        ],
                      ),
                      GestureDetector(
                        onTap: onAddToCart,
                        child: Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: _primary,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(
                            Icons.add_shopping_cart,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

class _ImagePlaceholder extends StatelessWidget {
  final double height;
  const _ImagePlaceholder({required this.height});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      width: double.infinity,
      color: _surfaceHigh,
      child: const Icon(Icons.inventory_2_outlined,
          size: 48, color: _outlineVariant),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool selected;
  final ValueChanged<bool> onSelected;

  const _FilterChip({
    required this.label,
    required this.selected,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => onSelected(!selected),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
        decoration: BoxDecoration(
          color: selected ? _primary : _surfaceLow,
          borderRadius: BorderRadius.circular(100),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: selected ? Colors.white : _onSurfaceVariant,
          ),
        ),
      ),
    );
  }
}

class _HideScrollbarBehavior extends ScrollBehavior {
  @override
  Widget buildScrollbar(
    BuildContext context,
    Widget child,
    ScrollableDetails details,
  ) =>
      child;
}
