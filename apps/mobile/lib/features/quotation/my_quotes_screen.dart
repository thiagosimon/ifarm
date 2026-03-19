import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/router/app_router.dart';
import '../../core/storage/secure_storage.dart';
import '../../core/utils/formatters.dart';
import '../../providers/quotation_provider.dart';
import '../../widgets/ifarm_empty_state.dart';
import '../../widgets/ifarm_error_state.dart';
import '../../widgets/ifarm_skeleton.dart';
import '../../widgets/status_badge.dart';

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

class MyQuotesScreen extends ConsumerStatefulWidget {
  const MyQuotesScreen({super.key});

  @override
  ConsumerState<MyQuotesScreen> createState() => _MyQuotesScreenState();
}

class _MyQuotesScreenState extends ConsumerState<MyQuotesScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String? _farmerId;

  final _tabs = const ['Ativas', 'Com Propostas', 'Aceitas', 'Expiradas'];
  final _statuses = ['OPEN', 'IN_PROPOSALS', 'ACCEPTED', 'EXPIRED'];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
    SecureStorage.getFarmerId().then((id) {
      if (mounted) setState(() => _farmerId = id);
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _surface,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(104),
        child: _GlassmorphicAppBar(
          tabController: _tabController,
          tabs: _tabs,
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push(Routes.quoteBuilder),
        backgroundColor: _primary,
        foregroundColor: Colors.white,
        elevation: 4,
        child: const Icon(Icons.add),
      ),
      body: _farmerId == null
          ? const Center(child: CircularProgressIndicator(color: _primary))
          : TabBarView(
              controller: _tabController,
              children: List.generate(
                _tabs.length,
                (i) => _QuoteTab(
                  farmerId: _farmerId!,
                  status: _statuses[i],
                ),
              ),
            ),
    );
  }
}

class _GlassmorphicAppBar extends StatelessWidget {
  final TabController tabController;
  final List<String> tabs;
  const _GlassmorphicAppBar({
    required this.tabController,
    required this.tabs,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
        child: Container(
          decoration: BoxDecoration(
            color: _surfaceContainerLowest.withValues(alpha: 0.92),
            border: const Border(
              bottom: BorderSide(color: _ghostBorder, width: 1),
            ),
            boxShadow: const [
              BoxShadow(
                color: _ambientShadow,
                blurRadius: 12,
                offset: Offset(0, 2),
              ),
            ],
          ),
          child: SafeArea(
            bottom: false,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  child: Row(
                    children: [
                      Container(
                        width: 34,
                        height: 34,
                        decoration: const BoxDecoration(
                          color: _primaryFixed,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.agriculture,
                          color: _primary,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 10),
                      const Text(
                        'iFarm',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                          color: _primary,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const Spacer(),
                      IconButton(
                        icon: const Icon(Icons.search, color: _onSurface, size: 24),
                        onPressed: () => context.push(Routes.search),
                        tooltip: 'Buscar',
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(minWidth: 40, minHeight: 40),
                      ),
                      IconButton(
                        icon: const Icon(Icons.repeat, color: _onSurface, size: 24),
                        onPressed: () => context.push(Routes.recurringQuotes),
                        tooltip: 'Recorrentes',
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(minWidth: 40, minHeight: 40),
                      ),
                    ],
                  ),
                ),
                TabBar(
                  controller: tabController,
                  isScrollable: true,
                  tabAlignment: TabAlignment.start,
                  indicatorColor: _primary,
                  indicatorWeight: 2,
                  labelColor: _primary,
                  unselectedLabelColor: _outline,
                  labelStyle: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.1,
                  ),
                  unselectedLabelStyle: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w400,
                  ),
                  dividerColor: Colors.transparent,
                  tabs: tabs.map((t) => Tab(text: t)).toList(),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _QuoteTab extends ConsumerWidget {
  final String farmerId;
  final String? status;
  const _QuoteTab({required this.farmerId, this.status});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final quotesAsync = ref.watch(quoteListProvider(farmerId));
    return RefreshIndicator(
      color: _primary,
      onRefresh: () async =>
          ref.read(quoteListProvider(farmerId).notifier).load(status: status),
      child: quotesAsync.when(
        loading: () => const ListSkeleton(),
        error: (e, _) => IFarmErrorState(
          onRetry: () =>
              ref.read(quoteListProvider(farmerId).notifier).load(status: status),
        ),
        data: (quotes) {
          final filtered = status == null
              ? quotes
              : quotes.where((q) => q.status.value == status).toList();
          if (filtered.isEmpty) {
            return IFarmEmptyState(
              title: 'Nenhuma cotação',
              subtitle: 'Suas cotações aparecerão aqui',
              icon: Icons.description_outlined,
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
            itemCount: filtered.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (_, i) {
              final q = filtered[i];
              final firstItemName = q.items.isNotEmpty
                  ? q.items.first.productSnapshot.name
                  : q.quoteNumber;
              return _QuoteCard(quote: q, firstItemName: firstItemName);
            },
          );
        },
      ),
    );
  }
}

class _QuoteCard extends StatelessWidget {
  final dynamic quote;
  final String firstItemName;
  const _QuoteCard({required this.quote, required this.firstItemName});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/quote/${quote.id}'),
      child: Container(
        decoration: BoxDecoration(
          color: _surfaceContainerLowest,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: _ghostBorder, width: 1),
          boxShadow: const [
            BoxShadow(
              color: _ambientShadow,
              blurRadius: 8,
              offset: Offset(0, 2),
            ),
          ],
        ),
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Product name as prominent title
                  Text(
                    firstItemName,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: _onSurface,
                      height: 1.3,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 3),
                  // Quote number as small label — 10px, outline color, w600, widest tracking
                  Text(
                    quote.quoteNumber,
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: _outline,
                      letterSpacing: 1.2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.inventory_2_outlined,
                          size: 13, color: _onSurfaceVariant),
                      const SizedBox(width: 4),
                      Text(
                        '${quote.items.length} item(s)',
                        style: const TextStyle(
                            fontSize: 12, color: _onSurfaceVariant),
                      ),
                      const SizedBox(width: 12),
                      const Icon(Icons.calendar_today_outlined,
                          size: 13, color: _onSurfaceVariant),
                      const SizedBox(width: 4),
                      Text(
                        AppFormatters.dateFromString(
                            quote.createdAt?.toIso8601String() ?? ''),
                        style: const TextStyle(
                            fontSize: 12, color: _onSurfaceVariant),
                      ),
                    ],
                  ),
                  if (quote.bestProposal != null) ...[
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Text(
                          'Melhor oferta: ',
                          style: TextStyle(
                              fontSize: 12, color: _onSurfaceVariant),
                        ),
                        Text(
                          AppFormatters.currency(
                              quote.bestProposal!.totalWithTaxAndDelivery),
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: _primary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                QuoteStatusBadge(status: quote.status),
                const SizedBox(height: 16),
                const Icon(Icons.chevron_right, color: _outline, size: 24),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
