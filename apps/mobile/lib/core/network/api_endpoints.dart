import 'dart:io';

class ApiEndpoints {
  ApiEndpoints._();

  // Base URL — Android emulator: 10.0.2.2, iOS simulator: localhost
  // Production: https://api.ifarm.com.br
  static final String baseUrl = Platform.isAndroid
      ? 'http://10.0.2.2:3000'
      : 'http://localhost:3000';

  // AUTH
  static const String login = '/api/v1/auth/login';
  static const String refresh = '/api/v1/auth/refresh';
  static const String logout = '/api/v1/auth/logout';
  static const String authMe = '/api/v1/auth/me';

  // IDENTITY — Farmers
  static const String farmers = '/api/v1/identity/v1/farmers';
  static String farmerById(String id) => '/api/v1/identity/v1/farmers/$id';
  static String farmerDocuments(String id) => '/api/v1/identity/v1/farmers/$id/documents';
  static String farmerDocumentById(String id, int idx) =>
      '/api/v1/identity/v1/farmers/$id/documents/$idx';
  static const String farmerExport = '/api/v1/identity/v1/farmers/me/export';
  static const String farmerDelete = '/api/v1/identity/v1/farmers/me';

  // CATALOG
  static const String products = '/api/v1/catalog/v1/products';
  static String productById(String id) => '/api/v1/catalog/v1/products/$id';
  static const String categories = '/api/v1/catalog/v1/categories';
  static const String categoriesTree = '/api/v1/catalog/v1/categories/tree';
  static String retailerCatalog(String retailerId) =>
      '/api/v1/catalog/v1/retailers/$retailerId/catalog';

  // QUOTATION
  static const String quotes = '/api/v1/quotes/quotes';
  static String quoteById(String id) => '/api/v1/quotes/quotes/$id';
  static String quoteCompare(String id) => '/api/v1/quotes/quotes/$id/compare';
  static String acceptProposal(String quoteId, String proposalId) =>
      '/api/v1/quotes/quotes/$quoteId/proposals/$proposalId/accept';
  static const String recurringQuotes = '/api/v1/quotes/quotes/recurring';
  static String recurringById(String id) => '/api/v1/quotes/quotes/recurring/$id';

  // ORDERS
  static const String orders = '/api/v1/orders/orders';
  static String orderById(String id) => '/api/v1/orders/orders/$id';
  static String orderTimeline(String id) => '/api/v1/orders/orders/$id/timeline';
  static String confirmDelivery(String id) => '/api/v1/orders/orders/$id/confirm-delivery';
  static String disputeOrder(String id) => '/api/v1/orders/orders/$id/dispute';

  // PAYMENTS
  static String paymentByOrderId(String orderId) => '/api/v1/payments/payments/$orderId';

  // NOTIFICATIONS
  static const String notificationPrefs =
      '/api/v1/notifications/v1/notifications/preferences';

  // REVIEWS
  static const String reviews = '/api/v1/reviews/v1/reviews';
  static String retailerReviews(String retailerId) =>
      '/api/v1/reviews/v1/retailers/$retailerId/reviews';
}
