import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/api_client.dart';
import '../../core/network/api_endpoints.dart';
import '../models/product_model.dart';
import '../models/category_model.dart';
import '../models/paginated_response.dart';

final catalogRepositoryProvider = Provider<CatalogRepository>(
  (ref) => CatalogRepository(ref.read(apiClientProvider)),
);

class CatalogRepository {
  final ApiClient _client;
  CatalogRepository(this._client);

  Future<PaginatedResponse<ProductModel>> getProducts({
    String? query,
    String? category,
    String? stateProvince,
    bool? isRuralCreditEligible,
    int page = 1,
    int limit = 20,
  }) async {
    final response = await _client.get(
      ApiEndpoints.products,
      queryParams: {
        if (query != null && query.isNotEmpty) 'q': query,
        if (category != null) 'category': category,
        if (stateProvince != null) 'stateProvince': stateProvince,
        if (isRuralCreditEligible != null) 'isRuralCreditEligible': isRuralCreditEligible,
        'page': page,
        'limit': limit,
      },
    );
    return PaginatedResponse.fromJson(
      response.data as Map<String, dynamic>,
      ProductModel.fromJson,
    );
  }

  Future<ProductModel> getProductById(String id) async {
    final response = await _client.get(ApiEndpoints.productById(id));
    return ProductModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<List<CategoryModel>> getCategories() async {
    final response = await _client.get(ApiEndpoints.categories);
    return (response.data as List<dynamic>)
        .map((e) => CategoryModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<CategoryModel>> getCategoryTree() async {
    final response = await _client.get(ApiEndpoints.categoriesTree);
    return (response.data as List<dynamic>)
        .map((e) => CategoryModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}
