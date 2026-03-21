/// Mock implementations of all repositories for integration testing.
library mock_repositories;

import 'package:mocktail/mocktail.dart';
import 'package:ifarm_mobile/data/repositories/auth_repository.dart';
import 'package:ifarm_mobile/data/repositories/quotation_repository.dart';
import 'package:ifarm_mobile/data/repositories/order_repository.dart';
import 'package:ifarm_mobile/data/repositories/farmer_repository.dart';
import 'package:ifarm_mobile/data/repositories/catalog_repository.dart';
import 'package:ifarm_mobile/data/repositories/notification_repository.dart';
import 'package:ifarm_mobile/data/repositories/review_repository.dart';
import 'package:ifarm_mobile/data/repositories/payment_repository.dart';
import 'package:ifarm_mobile/data/models/paginated_response.dart';
import 'package:ifarm_mobile/data/models/recurring_config_model.dart';
import 'package:ifarm_mobile/data/models/category_model.dart';
import 'package:ifarm_mobile/data/models/notification_prefs_model.dart';
import 'package:ifarm_mobile/data/models/transaction_model.dart';
import 'package:ifarm_mobile/core/constants/enums.dart';
import 'mock_data.dart';

// ─── Mock classes ─────────────────────────────────────────────────────────────

class MockAuthRepository extends Mock implements AuthRepository {}

class MockQuotationRepository extends Mock implements QuotationRepository {}

class MockOrderRepository extends Mock implements OrderRepository {}

class MockFarmerRepository extends Mock implements FarmerRepository {}

class MockCatalogRepository extends Mock implements CatalogRepository {}

class MockNotificationRepository extends Mock implements NotificationRepository {}

class MockReviewRepository extends Mock implements ReviewRepository {}

class MockPaymentRepository extends Mock implements PaymentRepository {}

// ─── Pre-configured stubs ─────────────────────────────────────────────────────

MockAuthRepository makeAuthRepo({bool authenticated = true}) {
  final mock = MockAuthRepository();
  if (authenticated) {
    when(() => mock.getMe()).thenAnswer((_) async => kMockUser);
  } else {
    when(() => mock.getMe()).thenThrow(Exception('Unauthorized'));
  }
  when(() => mock.login(
        email: any(named: 'email'),
        password: any(named: 'password'),
      )).thenAnswer((_) async => {
        'access_token': 'mock-access-token',
        'refresh_token': 'mock-refresh-token',
      });
  when(() => mock.logout()).thenAnswer((_) async {});
  return mock;
}

MockAuthRepository makeAuthRepoFailLogin() {
  final mock = MockAuthRepository();
  when(() => mock.login(
        email: any(named: 'email'),
        password: any(named: 'password'),
      )).thenThrow(Exception('Credenciais inválidas'));
  when(() => mock.getMe()).thenThrow(Exception('Unauthorized'));
  when(() => mock.logout()).thenAnswer((_) async {});
  return mock;
}

MockQuotationRepository makeQuotationRepo() {
  final mock = MockQuotationRepository();
  when(() => mock.getQuotes(
        farmerId: any(named: 'farmerId'),
        status: any(named: 'status'),
        page: any(named: 'page'),
        limit: any(named: 'limit'),
      )).thenAnswer((_) async => kMockQuotesPaginated);
  when(() => mock.getQuoteById(any()))
      .thenAnswer((_) async => kMockQuoteWithProposals);
  when(() => mock.compareQuote(any()))
      .thenAnswer((_) async => kMockQuoteWithProposals.proposals);
  when(() => mock.createQuote(any())).thenAnswer((_) async => kMockQuote);
  when(() => mock.acceptProposal(
        quoteId: any(named: 'quoteId'),
        proposalId: any(named: 'proposalId'),
      )).thenAnswer((_) async {});
  when(() => mock.getRecurring(
        farmerId: any(named: 'farmerId'),
        page: any(named: 'page'),
        limit: any(named: 'limit'),
      )).thenAnswer((_) async => PaginatedResponse<RecurringConfigModel>(
        data: [],
        meta: const PaginationMeta(page: 1, limit: 20, total: 0, totalPages: 0),
      ));
  when(() => mock.createRecurring(any()))
      .thenAnswer((_) async => const RecurringConfigModel(
            id: 'recurring-001',
            farmerId: 'farmer-123',
            productId: 'prod-001',
            quantity: 100,
            measurementUnit: 'kg',
            frequency: RecurringFrequency.monthly,
            status: RecurringStatus.active,
            autoAccept: false,
            deliveryMode: DeliveryMode.deliveryAddress,
            preferredPaymentMethod: PaymentMethod.pix,
          ));
  when(() => mock.updateRecurring(any(), any(), any()))
      .thenAnswer((_) async => const RecurringConfigModel(
            id: 'recurring-001',
            farmerId: 'farmer-123',
            productId: 'prod-001',
            quantity: 100,
            measurementUnit: 'kg',
            frequency: RecurringFrequency.monthly,
            status: RecurringStatus.paused,
            autoAccept: false,
            deliveryMode: DeliveryMode.deliveryAddress,
            preferredPaymentMethod: PaymentMethod.pix,
          ));
  return mock;
}

MockOrderRepository makeOrderRepo() {
  final mock = MockOrderRepository();
  when(() => mock.getOrders(
        status: any(named: 'status'),
        page: any(named: 'page'),
        limit: any(named: 'limit'),
      )).thenAnswer((_) async => kMockOrdersPaginated);
  when(() => mock.getOrderById(any())).thenAnswer((_) async => kMockOrder);
  when(() => mock.getOrderTimeline(any()))
      .thenAnswer((_) async => kMockOrder.statusHistory);
  when(() => mock.confirmDelivery(any())).thenAnswer((_) async => kMockOrder);
  when(() => mock.disputeOrder(any(), any()))
      .thenAnswer((_) async => kMockOrder);
  return mock;
}

MockFarmerRepository makeFarmerRepo() {
  final mock = MockFarmerRepository();
  when(() => mock.getFarmerById(any())).thenAnswer((_) async => kMockFarmer);
  when(() => mock.updateFarmer(any(), any()))
      .thenAnswer((_) async => kMockFarmer);
  when(() => mock.createFarmer(any())).thenAnswer((_) async => kMockFarmer);
  when(() => mock.exportData(any()))
      .thenAnswer((_) async => {'message': 'Email enviado com sucesso'});
  when(() => mock.deleteAccount(any())).thenAnswer((_) async {});
  return mock;
}

MockCatalogRepository makeCatalogRepo() {
  final mock = MockCatalogRepository();
  when(() => mock.getProducts(
        query: any(named: 'query'),
        category: any(named: 'category'),
        stateProvince: any(named: 'stateProvince'),
        isRuralCreditEligible: any(named: 'isRuralCreditEligible'),
        page: any(named: 'page'),
        limit: any(named: 'limit'),
      )).thenAnswer((_) async => kMockProductsPaginated);
  when(() => mock.getProductById(any()))
      .thenAnswer((_) async => kMockProduct);
  when(() => mock.getCategories()).thenAnswer((_) async => [
        const CategoryModel(
          id: 'cat-001',
          name: 'Sementes',
          slug: 'seeds',
          level: 0,
          isActive: true,
          children: [],
        ),
      ]);
  when(() => mock.getCategoryTree()).thenAnswer((_) async => []);
  return mock;
}

MockNotificationRepository makeNotificationRepo() {
  final mock = MockNotificationRepository();
  when(() => mock.getNotifications(
        page: any(named: 'page'),
        limit: any(named: 'limit'),
      )).thenAnswer((_) async => kMockNotifications);
  when(() => mock.markAsRead(any())).thenAnswer((_) async {});
  when(() => mock.markAllAsRead()).thenAnswer((_) async {});
  when(() => mock.getPreferences())
      .thenAnswer((_) async => const NotificationPrefsModel(
            isPushEnabled: true,
            isWhatsappEnabled: false,
            isEmailEnabled: true,
          ));
  when(() => mock.updatePreferences(any()))
      .thenAnswer((_) async => const NotificationPrefsModel(
            isPushEnabled: true,
            isWhatsappEnabled: false,
            isEmailEnabled: true,
          ));
  return mock;
}

MockPaymentRepository makePaymentRepo() {
  final mock = MockPaymentRepository();
  when(() => mock.getPayment(any())).thenAnswer((_) async => const TransactionModel(
        orderId: 'order-001',
        amount: 12250.0,
        method: PaymentMethod.pix,
        status: TransactionStatus.paid,
        pixQrCode: 'mock-pix-qrcode-data',
      ));
  return mock;
}
