import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/api_client.dart';
import '../../core/network/api_endpoints.dart';
import '../models/order_model.dart';
import '../models/paginated_response.dart';

final orderRepositoryProvider = Provider<OrderRepository>(
  (ref) => OrderRepository(ref.read(apiClientProvider)),
);

class OrderRepository {
  final ApiClient _client;
  OrderRepository(this._client);

  Future<PaginatedResponse<OrderModel>> getOrders({
    String? status,
    int page = 1,
    int limit = 20,
  }) async {
    final response = await _client.get(
      ApiEndpoints.orders,
      queryParams: {
        if (status != null) 'status': status,
        'page': page,
        'limit': limit,
      },
    );
    return PaginatedResponse.fromJson(
      response.data as Map<String, dynamic>,
      OrderModel.fromJson,
    );
  }

  Future<OrderModel> getOrderById(String id) async {
    final response = await _client.get(ApiEndpoints.orderById(id));
    return OrderModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<List<StatusHistoryEntry>> getOrderTimeline(String id) async {
    final response = await _client.get(ApiEndpoints.orderTimeline(id));
    return (response.data as List<dynamic>)
        .map((e) => StatusHistoryEntry.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<OrderModel> confirmDelivery(String id) async {
    final response = await _client.post(ApiEndpoints.confirmDelivery(id));
    return OrderModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<OrderModel> disputeOrder(String id, String reason) async {
    final response = await _client.post(
      ApiEndpoints.disputeOrder(id),
      data: {'reason': reason},
    );
    return OrderModel.fromJson(response.data as Map<String, dynamic>);
  }
}
