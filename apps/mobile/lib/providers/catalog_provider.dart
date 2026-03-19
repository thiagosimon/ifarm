import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/models/product_model.dart';
import '../data/models/category_model.dart';
import '../data/repositories/catalog_repository.dart';

// Search params
class ProductSearchParams {
  final String? query;
  final String? category;
  final String? stateProvince;
  final bool? isRuralCreditEligible;

  const ProductSearchParams({
    this.query,
    this.category,
    this.stateProvince,
    this.isRuralCreditEligible,
  });

  @override
  bool operator ==(Object other) =>
      other is ProductSearchParams &&
      other.query == query &&
      other.category == category &&
      other.stateProvince == stateProvince &&
      other.isRuralCreditEligible == isRuralCreditEligible;

  @override
  int get hashCode => Object.hash(query, category, stateProvince, isRuralCreditEligible);
}

final productSearchParamsProvider =
    StateProvider<ProductSearchParams>((ref) => const ProductSearchParams());

class ProductListNotifier extends StateNotifier<AsyncValue<List<ProductModel>>> {
  final CatalogRepository _repository;
  final ProductSearchParams params;
  int _page = 1;
  bool _hasMore = true;
  bool _isLoadingMore = false;

  ProductListNotifier(this._repository, this.params)
      : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    _page = 1;
    _hasMore = true;
    state = const AsyncValue.loading();
    try {
      final result = await _repository.getProducts(
        query: params.query,
        category: params.category,
        stateProvince: params.stateProvince,
        isRuralCreditEligible: params.isRuralCreditEligible,
        page: 1,
      );
      _hasMore = result.meta.hasNextPage;
      state = AsyncValue.data(result.data);
    } catch (e, s) {
      state = AsyncValue.error(e, s);
    }
  }

  Future<void> loadMore() async {
    if (!_hasMore || _isLoadingMore) return;
    _isLoadingMore = true;
    try {
      final current = state.value ?? [];
      final result = await _repository.getProducts(
        query: params.query,
        category: params.category,
        stateProvince: params.stateProvince,
        isRuralCreditEligible: params.isRuralCreditEligible,
        page: ++_page,
      );
      _hasMore = result.meta.hasNextPage;
      state = AsyncValue.data([...current, ...result.data]);
    } catch (_) {}
    _isLoadingMore = false;
  }

  bool get hasMore => _hasMore;
}

final productListProvider = StateNotifierProvider.family<ProductListNotifier,
    AsyncValue<List<ProductModel>>, ProductSearchParams>(
  (ref, params) => ProductListNotifier(ref.read(catalogRepositoryProvider), params),
);

final productDetailProvider = FutureProvider.family<ProductModel, String>((ref, id) {
  return ref.read(catalogRepositoryProvider).getProductById(id);
});

final categoriesProvider = FutureProvider<List<CategoryModel>>((ref) {
  return ref.read(catalogRepositoryProvider).getCategories();
});
