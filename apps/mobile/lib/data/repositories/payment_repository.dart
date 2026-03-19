import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/api_client.dart';
import '../../core/network/api_endpoints.dart';
import '../models/transaction_model.dart';

final paymentRepositoryProvider = Provider<PaymentRepository>(
  (ref) => PaymentRepository(ref.read(apiClientProvider)),
);

class PaymentRepository {
  final ApiClient _client;
  PaymentRepository(this._client);

  Future<TransactionModel> getPayment(String orderId) async {
    final response = await _client.get(ApiEndpoints.paymentByOrderId(orderId));
    return TransactionModel.fromJson(response.data as Map<String, dynamic>);
  }
}
