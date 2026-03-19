import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/models/transaction_model.dart';
import '../data/repositories/payment_repository.dart';

final paymentProvider = FutureProvider.family<TransactionModel, String>((ref, orderId) {
  return ref.read(paymentRepositoryProvider).getPayment(orderId);
});
