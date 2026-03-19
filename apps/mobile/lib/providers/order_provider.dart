import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/models/order_model.dart';
import '../data/repositories/order_repository.dart';

class OrderListNotifier extends StateNotifier<AsyncValue<List<OrderModel>>> {
  final OrderRepository _repository;
  int _page = 1;
  bool _hasMore = true;

  OrderListNotifier(this._repository) : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load({String? status}) async {
    _page = 1;
    state = const AsyncValue.loading();
    try {
      final result = await _repository.getOrders(status: status, page: 1);
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
      final result = await _repository.getOrders(status: status, page: ++_page);
      _hasMore = result.meta.hasNextPage;
      state = AsyncValue.data([...current, ...result.data]);
    } catch (_) {}
  }
}

final orderListProvider =
    StateNotifierProvider<OrderListNotifier, AsyncValue<List<OrderModel>>>(
  (ref) => OrderListNotifier(ref.read(orderRepositoryProvider)),
);

final orderDetailProvider = FutureProvider.family<OrderModel, String>((ref, id) {
  return ref.read(orderRepositoryProvider).getOrderById(id);
});
