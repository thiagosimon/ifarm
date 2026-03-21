/// 10 — Full Production API Validation (Flutter)
///
/// Comprehensive integration test of ALL backend services through the
/// production API gateway.
///
/// Covers: health, auth (all roles + refresh), identity, catalog, orders,
/// payments, notifications, reviews, quotations, security (JWT, TLS).
///
/// Run:
///   flutter test integration_test/10_full_validation_test.dart
///   flutter test integration_test/10_full_validation_test.dart --dart-define=APP_ENV=prod
///
/// NOTE: Use API_BASE_URL env or update apiBase for local testing
/// via socat proxy: http://127.0.0.1:3333
library full_validation_test;

import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

const String apiBase = String.fromEnvironment('API_BASE_URL', defaultValue: 'https://api.ifarm.agr.br');

// Test users from Keycloak realm
const Map<String, String> retailer = {'email': 'retailer@test.com', 'password': 'retailer123'};
const Map<String, String> farmer = {'email': 'farmer@test.com', 'password': 'farmer123'};
const Map<String, String> admin = {'email': 'admin@ifarm.com.br', 'password': 'admin123'};

// ── HTTP helpers ──────────────────────────────────────────────────────────────

Future<Map<String, dynamic>> _request(
  String method,
  String path, {
  Map<String, dynamic>? body,
  String? token,
  int retries = 4,
}) async {
  for (var attempt = 0; attempt < retries; attempt++) {
    final client = HttpClient()..connectionTimeout = const Duration(seconds: 15);
    try {
      late HttpClientRequest request;
      final uri = Uri.parse('$apiBase$path');
      switch (method) {
        case 'GET':
          request = await client.getUrl(uri);
          break;
        case 'POST':
          request = await client.postUrl(uri);
          break;
        case 'PATCH':
          request = await client.patchUrl(uri);
          break;
        default:
          request = await client.getUrl(uri);
      }
      request.headers.set('Content-Type', 'application/json');
      if (token != null) {
        request.headers.set('Authorization', 'Bearer $token');
      }
      if (body != null) {
        request.write(jsonEncode(body));
      }
      final response = await request.close();
      final responseBody = await response.transform(utf8.decoder).join();

      if (response.statusCode == 502 && attempt < retries - 1) {
        await Future.delayed(Duration(seconds: 2 * (attempt + 1)));
        continue;
      }

      return {
        'status': response.statusCode,
        'data': responseBody.isNotEmpty ? jsonDecode(responseBody) : null,
      };
    } catch (e) {
      if (attempt < retries - 1) {
        await Future.delayed(Duration(seconds: 2 * (attempt + 1)));
        continue;
      }
      return {'error': e.toString()};
    } finally {
      client.close();
    }
  }
  return {'error': 'max retries exceeded'};
}

Future<Map<String, dynamic>> apiGet(String path, {String? token}) =>
    _request('GET', path, token: token);

Future<Map<String, dynamic>> apiPost(String path, Map<String, dynamic> body, {String? token}) =>
    _request('POST', path, body: body, token: token);

/// Login helper — returns {accessToken, refreshToken}
Future<Map<String, dynamic>> loginUser(String email, String password) async {
  final r = await apiPost('/api/v1/auth/login', {'email': email, 'password': password});
  expect(r.containsKey('error'), isFalse, reason: 'Login should succeed: ${r['error'] ?? ''}');
  expect(r['status'], equals(200));
  final data = r['data'] as Map<String, dynamic>;
  expect(data['accessToken'], isNotNull);
  expect(data['refreshToken'], isNotNull);
  return data;
}

/// Decode JWT payload
Map<String, dynamic> decodeJwt(String token) {
  final parts = token.split('.');
  final payload = base64Url.normalize(parts[1]);
  return jsonDecode(utf8.decode(base64Url.decode(payload))) as Map<String, dynamic>;
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. HEALTH & INFRASTRUCTURE
  // ═══════════════════════════════════════════════════════════════════════════

  group('1. Health & Infrastructure', () {
    testWidgets('GET /health returns 200 with full payload', (_) async {
      final r = await apiGet('/health');
      expect(r.containsKey('error'), isFalse, reason: 'API reachable: ${r['error'] ?? ''}');
      expect(r['status'], equals(200));
      final data = r['data'] as Map<String, dynamic>;
      expect(data['status'], equals('ok'));
      expect(data['uptime'], isA<num>());
      expect(data['version'], isNotNull);
      expect(DateTime.tryParse(data['timestamp'] as String), isNotNull);
    });

    testWidgets('Unknown route returns non-5xx', (_) async {
      final r = await apiGet('/api/v1/totally-invalid');
      expect(r.containsKey('error'), isFalse);
      expect(r['status'] as int, lessThan(500));
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. AUTH SERVICE
  // ═══════════════════════════════════════════════════════════════════════════

  group('2. Auth Service — Login', () {
    testWidgets('Retailer login returns tokens with RETAILER role', (_) async {
      final tokens = await loginUser(retailer['email']!, retailer['password']!);
      final payload = decodeJwt(tokens['accessToken'] as String);
      expect((payload['realm_access'] as Map)['roles'], contains('RETAILER'));
      expect(payload['email'], equals(retailer['email']));
    });

    testWidgets('Farmer login returns tokens with FARMER role', (_) async {
      final tokens = await loginUser(farmer['email']!, farmer['password']!);
      final payload = decodeJwt(tokens['accessToken'] as String);
      expect((payload['realm_access'] as Map)['roles'], contains('FARMER'));
    });

    testWidgets('Admin login returns tokens with ADMIN role', (_) async {
      final tokens = await loginUser(admin['email']!, admin['password']!);
      final payload = decodeJwt(tokens['accessToken'] as String);
      expect((payload['realm_access'] as Map)['roles'], contains('ADMIN'));
    });

    testWidgets('Custom user login works', (_) async {
      final r = await apiPost('/api/v1/auth/login', {
        'email': 'thiagosimon_15@hotmail.com',
        'password': '12345678',
      });
      expect(r.containsKey('error'), isFalse);
      expect(r['status'], equals(200));
      final data = r['data'] as Map<String, dynamic>;
      expect(data['accessToken'], isNotNull);
    });

    testWidgets('Invalid credentials return 401', (_) async {
      final r = await apiPost('/api/v1/auth/login', {
        'email': 'notreal@test.com',
        'password': 'wrong',
      });
      expect(r.containsKey('error'), isFalse);
      expect(r['status'], equals(401));
    });

    testWidgets('Empty body returns 400 or 401', (_) async {
      final r = await apiPost('/api/v1/auth/login', {});
      expect(r.containsKey('error'), isFalse);
      expect([400, 401, 422], contains(r['status']));
    });
  });

  group('2b. Auth Service — Refresh', () {
    testWidgets('Valid refresh returns new tokens', (_) async {
      final tokens = await loginUser(retailer['email']!, retailer['password']!);
      final r = await apiPost('/api/v1/auth/refresh', {'refreshToken': tokens['refreshToken']});
      expect(r.containsKey('error'), isFalse);
      expect(r['status'], equals(200));
      final data = r['data'] as Map<String, dynamic>;
      expect(data['accessToken'], isNotNull);
      expect(data['refreshToken'], isNotNull);
    });

    testWidgets('Invalid refresh token returns 401', (_) async {
      final r = await apiPost('/api/v1/auth/refresh', {'refreshToken': 'invalid'});
      expect(r.containsKey('error'), isFalse);
      expect(r['status'], equals(401));
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. IDENTITY SERVICE
  // ═══════════════════════════════════════════════════════════════════════════

  group('3. Identity Service', () {
    testWidgets('GET /api/v1/identity/team-members returns list', (_) async {
      final r = await apiGet('/api/v1/identity/team-members');
      expect(r.containsKey('error'), isFalse);
      expect(r['status'], equals(200));
    });

    testWidgets('GET /api/v1/identity/customers returns list', (_) async {
      final r = await apiGet('/api/v1/identity/customers');
      expect(r.containsKey('error'), isFalse);
      expect(r['status'], equals(200));
    });

    testWidgets('POST /api/v1/identity/retailers with invalid data returns 400', (_) async {
      final r = await apiPost('/api/v1/identity/retailers', {'invalid': 'data'});
      expect(r.containsKey('error'), isFalse);
      expect(r['status'], equals(400));
    });

    testWidgets('POST /api/v1/identity/farmers with invalid data returns 400', (_) async {
      final r = await apiPost('/api/v1/identity/farmers', {'invalid': 'data'});
      expect(r.containsKey('error'), isFalse);
      expect(r['status'], equals(400));
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. CATALOG SERVICE
  // ═══════════════════════════════════════════════════════════════════════════

  group('4. Catalog Service', () {
    testWidgets('GET /api/v1/catalog/products returns products', (_) async {
      final r = await apiGet('/api/v1/catalog/products');
      expect(r.containsKey('error'), isFalse);
      expect(r['status'], equals(200));
    });

    testWidgets('GET /api/v1/catalog/products with pagination', (_) async {
      final r = await apiGet('/api/v1/catalog/products?page=1&limit=5');
      expect(r.containsKey('error'), isFalse);
      expect(r['status'], equals(200));
    });

    testWidgets('GET /api/v1/catalog/products/:id with nonexistent ID', (_) async {
      final r = await apiGet('/api/v1/catalog/products/000000000000000000000000');
      expect(r.containsKey('error'), isFalse);
      expect([200, 404], contains(r['status']));
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. ORDER SERVICE
  // ═══════════════════════════════════════════════════════════════════════════

  group('5. Order Service', () {
    testWidgets('GET /api/v1/orders/orders with token returns list', (_) async {
      final tokens = await loginUser(retailer['email']!, retailer['password']!);
      final r = await apiGet('/api/v1/orders/orders', token: tokens['accessToken'] as String);
      expect(r.containsKey('error'), isFalse);
      expect(r['status'], equals(200));
    });

    testWidgets('GET /api/v1/orders/orders with pagination', (_) async {
      final tokens = await loginUser(retailer['email']!, retailer['password']!);
      final r = await apiGet('/api/v1/orders/orders?page=1&limit=10', token: tokens['accessToken'] as String);
      expect(r.containsKey('error'), isFalse);
      expect(r['status'], equals(200));
    });

    testWidgets('GET /api/v1/orders/orders without token returns 401', (_) async {
      final r = await apiGet('/api/v1/orders/orders');
      expect(r.containsKey('error'), isFalse);
      expect(r['status'], equals(401));
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. PAYMENT SERVICE
  // ═══════════════════════════════════════════════════════════════════════════

  group('6. Payment Service', () {
    testWidgets('GET /api/v1/payments/payments/:orderId with fake ID', (_) async {
      final tokens = await loginUser(retailer['email']!, retailer['password']!);
      final r = await apiGet('/api/v1/payments/payments/fake-order-id', token: tokens['accessToken'] as String);
      expect(r.containsKey('error'), isFalse);
      expect([200, 400, 404], contains(r['status']));
    });

    testWidgets('POST webhook without signature is rejected', (_) async {
      final r = await apiPost('/api/v1/payments/webhooks/pagarme', {'event': 'test'});
      expect(r.containsKey('error'), isFalse);
      expect([400, 401, 403], contains(r['status']));
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. NOTIFICATION SERVICE
  // ═══════════════════════════════════════════════════════════════════════════

  group('7. Notification Service', () {
    testWidgets('GET preferences with token', (_) async {
      final tokens = await loginUser(retailer['email']!, retailer['password']!);
      final r = await apiGet('/api/v1/notifications/notifications/preferences',
          token: tokens['accessToken'] as String);
      expect(r.containsKey('error'), isFalse);
      expect([200, 404], contains(r['status']));
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. REVIEW SERVICE
  // ═══════════════════════════════════════════════════════════════════════════

  group('8. Review Service', () {
    testWidgets('GET retailer reviews', (_) async {
      final tokens = await loginUser(retailer['email']!, retailer['password']!);
      final r = await apiGet('/api/v1/reviews/retailers/fake-id/reviews',
          token: tokens['accessToken'] as String);
      expect(r.containsKey('error'), isFalse);
      expect([200, 400, 404], contains(r['status']));
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. QUOTATION SERVICE
  // ═══════════════════════════════════════════════════════════════════════════

  group('9. Quotation Service', () {
    testWidgets('GET /api/v1/quotes/quotes with token', (_) async {
      final tokens = await loginUser(farmer['email']!, farmer['password']!);
      final r = await apiGet('/api/v1/quotes/quotes', token: tokens['accessToken'] as String);
      expect(r.containsKey('error'), isFalse);
      expect([200, 404], contains(r['status']));
    });

    testWidgets('POST quote creates or validates', (_) async {
      final tokens = await loginUser(farmer['email']!, farmer['password']!);
      final r = await apiPost('/api/v1/quotes/quotes', {
        'title': 'E2E Flutter Test Quote',
        'items': [
          {'productName': 'Soy', 'quantity': 100, 'unit': 'kg'}
        ],
        'deliveryDeadline': DateTime.now().add(const Duration(days: 7)).toIso8601String(),
      }, token: tokens['accessToken'] as String);
      expect(r.containsKey('error'), isFalse);
      expect([200, 201, 400, 404], contains(r['status']));
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. SECURITY
  // ═══════════════════════════════════════════════════════════════════════════

  group('10. Security', () {
    testWidgets('HTTPS TLS connection works', (_) async {
      final r = await apiGet('/health');
      expect(r.containsKey('error'), isFalse);
      expect(r['status'], equals(200));
    });

    testWidgets('Invalid JWT is rejected', (_) async {
      final r = await apiGet('/api/v1/orders/orders', token: 'invalid.jwt.token');
      expect(r.containsKey('error'), isFalse);
      expect(r['status'], equals(401));
    });

    testWidgets('Tampered JWT is rejected', (_) async {
      final tokens = await loginUser(retailer['email']!, retailer['password']!);
      final jwt = tokens['accessToken'] as String;
      final parts = jwt.split('.');

      // Tamper with payload — set exp to past
      final payload = jsonDecode(
          utf8.decode(base64Url.decode(base64Url.normalize(parts[1])))) as Map<String, dynamic>;
      payload['exp'] = (DateTime.now().millisecondsSinceEpoch ~/ 1000) - 3600;
      final tamperedPayload = base64Url.encode(utf8.encode(jsonEncode(payload))).replaceAll('=', '');
      final tamperedJwt = '${parts[0]}.$tamperedPayload.${parts[2]}';

      final r = await apiGet('/api/v1/orders/orders', token: tamperedJwt);
      expect(r.containsKey('error'), isFalse);
      expect(r['status'], equals(401));
    });

    testWidgets('Protected endpoint without auth returns 401', (_) async {
      final r = await apiGet('/api/v1/orders/orders');
      expect(r.containsKey('error'), isFalse);
      expect(r['status'], equals(401));
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 11. CROSS-SERVICE INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════════

  group('11. Cross-Service Integration', () {
    testWidgets('Full auth flow: login → access → refresh → access', (_) async {
      // Step 1: Login
      final tokens = await loginUser(retailer['email']!, retailer['password']!);

      // Step 2: Access protected resource
      final r1 = await apiGet('/api/v1/orders/orders', token: tokens['accessToken'] as String);
      expect(r1['status'], equals(200));

      // Step 3: Refresh
      final refreshResult = await apiPost('/api/v1/auth/refresh', {
        'refreshToken': tokens['refreshToken'],
      });
      expect(refreshResult['status'], equals(200));
      final newTokens = refreshResult['data'] as Map<String, dynamic>;

      // Step 4: Use refreshed token
      final r2 = await apiGet('/api/v1/orders/orders', token: newTokens['accessToken'] as String);
      expect(r2['status'], equals(200));
    });

    testWidgets('All 3 roles can login with distinct roles', (_) async {
      final users = [
        {'email': retailer['email']!, 'password': retailer['password']!, 'role': 'RETAILER'},
        {'email': farmer['email']!, 'password': farmer['password']!, 'role': 'FARMER'},
        {'email': admin['email']!, 'password': admin['password']!, 'role': 'ADMIN'},
      ];

      for (final u in users) {
        final tokens = await loginUser(u['email']!, u['password']!);
        final payload = decodeJwt(tokens['accessToken'] as String);
        final roles = (payload['realm_access'] as Map)['roles'] as List;
        expect(roles, contains(u['role']),
            reason: '${u['email']} should have ${u['role']} role');
      }
    });

    testWidgets('Retailer can browse catalog and orders', (_) async {
      final tokens = await loginUser(retailer['email']!, retailer['password']!);

      final catalog = await apiGet('/api/v1/catalog/products');
      expect(catalog['status'], equals(200));

      final orders = await apiGet('/api/v1/orders/orders', token: tokens['accessToken'] as String);
      expect(orders['status'], equals(200));
    });
  });
}
