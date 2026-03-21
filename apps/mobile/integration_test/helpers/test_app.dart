// Test app that wires up the full IFarmApp with mocked Riverpod providers.
library test_app;

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ifarm_mobile/app.dart';
import 'package:ifarm_mobile/core/storage/secure_storage.dart';
import 'package:ifarm_mobile/data/repositories/auth_repository.dart';
import 'package:ifarm_mobile/data/repositories/quotation_repository.dart';
import 'package:ifarm_mobile/data/repositories/order_repository.dart';
import 'package:ifarm_mobile/data/repositories/farmer_repository.dart';
import 'package:ifarm_mobile/data/repositories/catalog_repository.dart';
import 'package:ifarm_mobile/data/repositories/notification_repository.dart';
import 'package:ifarm_mobile/data/repositories/payment_repository.dart';
import 'mock_repositories.dart';

/// Seeds SecureStorage with a fake access token so that AuthNotifier._init()
/// finds an existing session and calls getMe() (which we stub to return kMockUser).
/// Must be called before [buildTestApp] when [authenticated] is true.
Future<void> seedAuthState() async {
  await SecureStorage.saveTokens(
    accessToken: 'mock-access-token-for-tests',
    refreshToken: 'mock-refresh-token-for-tests',
  );
}

/// Clears SecureStorage so the app starts unauthenticated.
Future<void> clearAuthState() async {
  await SecureStorage.clearAll();
}

/// Launches the app with all repositories mocked.
/// [authenticated] — if true, pre-seeds secure storage so _init() succeeds.
Widget buildTestApp({
  bool authenticated = true,
  MockAuthRepository? authRepo,
  MockQuotationRepository? quotationRepo,
  MockOrderRepository? orderRepo,
  MockFarmerRepository? farmerRepo,
  MockCatalogRepository? catalogRepo,
  MockNotificationRepository? notificationRepo,
  MockPaymentRepository? paymentRepo,
}) {
  // AuthRepo must be pre-configured to stub getMe() -> kMockUser
  final auth = authRepo ?? makeAuthRepo(authenticated: authenticated);
  final quotation = quotationRepo ?? makeQuotationRepo();
  final order = orderRepo ?? makeOrderRepo();
  final farmer = farmerRepo ?? makeFarmerRepo();
  final catalog = catalogRepo ?? makeCatalogRepo();
  final notification = notificationRepo ?? makeNotificationRepo();
  final payment = paymentRepo ?? makePaymentRepo();

  return ProviderScope(
    overrides: [
      authRepositoryProvider.overrideWithValue(auth),
      quotationRepositoryProvider.overrideWithValue(quotation),
      orderRepositoryProvider.overrideWithValue(order),
      farmerRepositoryProvider.overrideWithValue(farmer),
      catalogRepositoryProvider.overrideWithValue(catalog),
      notificationRepositoryProvider.overrideWithValue(notification),
      paymentRepositoryProvider.overrideWithValue(payment),
    ],
    child: const IFarmApp(),
  );
}
