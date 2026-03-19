import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ifarm_mobile/l10n/app_localizations.dart';
import '../../core/constants/enums.dart';
import '../../core/constants/enum_extensions.dart';
import '../../core/storage/secure_storage.dart';
import '../../providers/quotation_provider.dart';
import '../../data/repositories/quotation_repository.dart';
import '../../widgets/ifarm_empty_state.dart';
import '../../widgets/ifarm_error_state.dart';
import '../../widgets/ifarm_skeleton.dart';

// Stitch design tokens
const _primary = Color(0xFF005129);
const _surface = Color(0xFFF7F9FB);
const _surfaceContainerLowest = Color(0xFFFFFFFF);
const _surfaceContainerHigh = Color(0xFFE6E8EA);
const _onSurface = Color(0xFF191C1E);
const _onSurfaceVariant = Color(0xFF404940);
const _outline = Color(0xFF707A70);
const _error = Color(0xFFBA1A1A);
const _ambientShadow = Color(0x14005129);
const _ghostBorder = Color(0x26BFC9BE);

class RecurringQuotesScreen extends ConsumerStatefulWidget {
  const RecurringQuotesScreen({super.key});

  @override
  ConsumerState<RecurringQuotesScreen> createState() =>
      _RecurringQuotesScreenState();
}

class _RecurringQuotesScreenState extends ConsumerState<RecurringQuotesScreen> {
  String? _farmerId;

  @override
  void initState() {
    super.initState();
    SecureStorage.getFarmerId().then((id) {
      if (mounted) setState(() => _farmerId = id);
    });
  }

  void _showCreate() {
    final l = AppLocalizations.of(context)!;
    final productCtrl = TextEditingController();
    final qtyCtrl = TextEditingController(text: '1');
    RecurringFrequency freq = RecurringFrequency.monthly;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setLocal) => Container(
          decoration: const BoxDecoration(
            color: _surfaceContainerLowest,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          padding: EdgeInsets.only(
            bottom: MediaQuery.viewInsetsOf(ctx).bottom,
            left: 20,
            right: 20,
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
                    color: const Color(0xFFE0E3E5),
                    borderRadius: BorderRadius.circular(99),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                l.recurringQuotesNew,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: _onSurface,
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: productCtrl,
                decoration: InputDecoration(
                  labelText: l.recurringQuotesProductLabel,
                  filled: true,
                  fillColor: _surfaceContainerHigh,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: qtyCtrl,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: l.recurringQuotesQuantityLabel,
                  filled: true,
                  fillColor: _surfaceContainerHigh,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<RecurringFrequency>(
                initialValue: freq,
                decoration: InputDecoration(
                  labelText: l.recurringQuotesFrequency,
                  filled: true,
                  fillColor: _surfaceContainerHigh,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide.none,
                  ),
                ),
                items: RecurringFrequency.values
                    .map((f) => DropdownMenuItem(
                          value: f,
                          child: Text(f.localizedLabel(ctx)),
                        ))
                    .toList(),
                onChanged: (v) => setLocal(() => freq = v!),
              ),
              const SizedBox(height: 20),
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
                  child: TextButton(
                    onPressed: () async {
                      if (_farmerId == null) return;
                      try {
                        await ref
                            .read(quotationRepositoryProvider)
                            .createRecurring({
                          'farmerId': _farmerId,
                          'productId': productCtrl.text.trim(),
                          'quantity': double.tryParse(qtyCtrl.text) ?? 1,
                          'frequency': freq.value,
                          'autoAccept': false,
                          'deliveryMode': DeliveryMode.deliveryAddress.value,
                          'preferredPaymentMethod': PaymentMethod.pix.value,
                        });
                        ref.invalidate(recurringListProvider(_farmerId!));
                        if (ctx.mounted) Navigator.pop(ctx);
                      } catch (e) {
                        if (ctx.mounted) {
                          ScaffoldMessenger.of(ctx).showSnackBar(
                            SnackBar(
                              content: Text(e.toString()),
                              backgroundColor: _error,
                            ),
                          );
                        }
                      }
                    },
                    child: Text(
                      l.recurringQuotesNew,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context)!;
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
          l.recurringQuotesTitle,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: _onSurface,
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showCreate,
        backgroundColor: _primary,
        foregroundColor: Colors.white,
        elevation: 4,
        child: const Icon(Icons.add),
      ),
      body: _farmerId == null
          ? const Center(child: CircularProgressIndicator(color: _primary))
          : Consumer(
              builder: (ctx, ref, _) {
                final listAsync = ref.watch(recurringListProvider(_farmerId!));
                return RefreshIndicator(
                  color: _primary,
                  onRefresh: () async =>
                      ref.invalidate(recurringListProvider(_farmerId!)),
                  child: listAsync.when(
                    loading: () => const ListSkeleton(),
                    error: (e, _) => IFarmErrorState(
                      onRetry: () =>
                          ref.invalidate(recurringListProvider(_farmerId!)),
                    ),
                    data: (list) {
                      if (list.isEmpty) {
                        return IFarmEmptyState(
                          title: l.recurringQuotesEmpty,
                          subtitle: l.recurringQuotesEmptyHint,
                          icon: Icons.repeat,
                        );
                      }
                      return ListView.separated(
                        padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
                        itemCount: list.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (_, i) {
                          final r = list[i];
                          return _RecurringCard(
                            recurring: r,
                            onToggle: (active) async {
                              // Toggle active/paused status via API
                            },
                          );
                        },
                      );
                    },
                  ),
                );
              },
            ),
    );
  }
}

class _RecurringCard extends StatelessWidget {
  final dynamic recurring;
  final ValueChanged<bool> onToggle;
  const _RecurringCard({required this.recurring, required this.onToggle});

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    final r = recurring;
    final isActive = r.status == RecurringStatus.active;

    // Format next execution date as "Próxima Data: DD/MM"
    String nextDateLabel = '';
    if (r.nextExecutionAt != null) {
      final d = r.nextExecutionAt as DateTime;
      nextDateLabel = l.recurringQuotesNextDate(
          '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}');
    }

    return Container(
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
          // 56×56 product image or placeholder
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: _surfaceContainerHigh,
              borderRadius: BorderRadius.circular(10),
            ),
            clipBehavior: Clip.antiAlias,
            child: const Icon(
              Icons.inventory_2_outlined,
              color: _outline,
              size: 28,
            ),
          ),

          const SizedBox(width: 12),

          // Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  (r.productName as String?) ?? (r.productId as String),
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: _onSurface,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 3),
                Text(
                  '${(r.quantity as double).toStringAsFixed((r.quantity as double) == (r.quantity as double).truncateToDouble() ? 0 : 1)} ${r.measurementUnit as String} · ${(r.frequency as RecurringFrequency).localizedLabel(context)}',
                  style: const TextStyle(
                    fontSize: 12,
                    color: _onSurfaceVariant,
                  ),
                ),
                if (nextDateLabel.isNotEmpty) ...[
                  const SizedBox(height: 3),
                  Text(
                    nextDateLabel,
                    style: const TextStyle(
                      fontSize: 12,
                      color: _outline,
                    ),
                  ),
                ],
              ],
            ),
          ),

          const SizedBox(width: 10),

          // Status icon + switch
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                isActive ? Icons.check_circle : Icons.cancel,
                color: isActive ? _primary : _error,
                size: 20,
              ),
              const SizedBox(height: 6),
              Switch(
                value: isActive,
                onChanged: onToggle,
                activeThumbColor: _primary,
                materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
