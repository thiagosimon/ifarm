import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/models/quote_model.dart';
import '../data/models/proposal_model.dart';
import '../data/models/recurring_config_model.dart';
import '../data/repositories/quotation_repository.dart';
// Cart for building a quote
class QuoteCartItem {
  final String productId;
  final String productName;
  final String tariffCode;
  final String category;
  final String measurementUnit;
  double quantity;

  QuoteCartItem({
    required this.productId,
    required this.productName,
    required this.tariffCode,
    required this.category,
    required this.measurementUnit,
    this.quantity = 1,
  });
}

class QuoteCartNotifier extends StateNotifier<List<QuoteCartItem>> {
  QuoteCartNotifier() : super([]);

  void addItem(QuoteCartItem item) {
    final existing = state.indexWhere((e) => e.productId == item.productId);
    if (existing >= 0) {
      final updated = [...state];
      updated[existing].quantity += item.quantity;
      state = updated;
    } else {
      state = [...state, item];
    }
  }

  void updateQuantity(String productId, double quantity) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    state = state.map((e) {
      if (e.productId == productId) e.quantity = quantity;
      return e;
    }).toList();
  }

  void removeItem(String productId) {
    state = state.where((e) => e.productId != productId).toList();
  }

  void clear() => state = [];
}

final quoteCartProvider =
    StateNotifierProvider<QuoteCartNotifier, List<QuoteCartItem>>(
  (ref) => QuoteCartNotifier(),
);

// Quote list
class QuoteListNotifier extends StateNotifier<AsyncValue<List<QuoteModel>>> {
  final QuotationRepository _repository;
  final String farmerId;
  int _page = 1;
  bool _hasMore = true;

  QuoteListNotifier(this._repository, this.farmerId)
      : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load({String? status}) async {
    _page = 1;
    state = const AsyncValue.loading();
    try {
      final result = await _repository.getQuotes(
        farmerId: farmerId,
        status: status,
        page: 1,
      );
      _hasMore = result.meta.hasNextPage;
      state = AsyncValue.data(result.data);
    } catch (e, s) {
      state = AsyncValue.error(e, s);
    }
  }

  Future<void> loadMore({String? status}) async {
    if (!_hasMore) return;
    try {
      final current = state.value ?? [];
      final result = await _repository.getQuotes(
        farmerId: farmerId,
        status: status,
        page: ++_page,
      );
      _hasMore = result.meta.hasNextPage;
      state = AsyncValue.data([...current, ...result.data]);
    } catch (_) {}
  }
}

final quoteListProvider = StateNotifierProvider.family<QuoteListNotifier,
    AsyncValue<List<QuoteModel>>, String>(
  (ref, farmerId) => QuoteListNotifier(ref.read(quotationRepositoryProvider), farmerId),
);

final quoteDetailProvider =
    FutureProvider.family<QuoteWithProposals, String>((ref, id) {
  return ref.read(quotationRepositoryProvider).getQuoteById(id);
});

final proposalComparisonProvider =
    FutureProvider.family<List<ProposalModel>, String>((ref, quoteId) {
  return ref.read(quotationRepositoryProvider).compareQuote(quoteId);
});

// Recurring
final recurringListProvider = StateNotifierProvider.family<RecurringListNotifier,
    AsyncValue<List<RecurringConfigModel>>, String>(
  (ref, farmerId) =>
      RecurringListNotifier(ref.read(quotationRepositoryProvider), farmerId),
);

class RecurringListNotifier
    extends StateNotifier<AsyncValue<List<RecurringConfigModel>>> {
  final QuotationRepository _repository;
  final String farmerId;

  RecurringListNotifier(this._repository, this.farmerId)
      : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final result = await _repository.getRecurring(farmerId: farmerId);
      state = AsyncValue.data(result.data);
    } catch (e, s) {
      state = AsyncValue.error(e, s);
    }
  }
}
