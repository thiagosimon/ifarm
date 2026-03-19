import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/api_client.dart';
import '../../core/network/api_endpoints.dart';
import '../models/review_model.dart';
import '../models/paginated_response.dart';

final reviewRepositoryProvider = Provider<ReviewRepository>(
  (ref) => ReviewRepository(ref.read(apiClientProvider)),
);

class ReviewRepository {
  final ApiClient _client;
  ReviewRepository(this._client);

  Future<ReviewModel> createReview(Map<String, dynamic> data) async {
    final response = await _client.post(ApiEndpoints.reviews, data: data);
    return ReviewModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<PaginatedResponse<ReviewModel>> getRetailerReviews(
    String retailerId, {
    int page = 1,
    int limit = 20,
  }) async {
    final response = await _client.get(
      ApiEndpoints.retailerReviews(retailerId),
      queryParams: {'page': page, 'limit': limit},
    );
    return PaginatedResponse.fromJson(
      response.data as Map<String, dynamic>,
      ReviewModel.fromJson,
    );
  }
}
