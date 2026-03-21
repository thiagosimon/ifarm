/// 09 — Production API Connectivity Integration Test
///
/// Validates that the production API at https://api.ifarm.agr.br
/// is reachable and responding correctly from the Flutter app.
///
/// Run:
///   flutter test integration_test/09_production_api_test.dart
///   flutter test integration_test/09_production_api_test.dart --dart-define=APP_ENV=prod
library production_api_test;

import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

const String prodApiUrl = 'https://api.ifarm.agr.br';

/// Simple HTTP client for production API calls (no auth)
Future<Map<String, dynamic>> apiGet(String path) async {
  final client = HttpClient()
    ..connectionTimeout = const Duration(seconds: 10);
  try {
    final request = await client.getUrl(Uri.parse('$prodApiUrl$path'));
    request.headers.set('Content-Type', 'application/json');
    final response = await request.close();
    final body = await response.transform(utf8.decoder).join();
    return {
      'status': response.statusCode,
      'data': body.isNotEmpty ? jsonDecode(body) : null,
    };
  } catch (e) {
    return {'error': e.toString()};
  } finally {
    client.close();
  }
}

Future<Map<String, dynamic>> apiPost(String path, Map<String, dynamic> body) async {
  final client = HttpClient()
    ..connectionTimeout = const Duration(seconds: 10);
  try {
    final request = await client.postUrl(Uri.parse('$prodApiUrl$path'));
    request.headers.set('Content-Type', 'application/json');
    request.write(jsonEncode(body));
    final response = await request.close();
    final responseBody = await response.transform(utf8.decoder).join();
    return {
      'status': response.statusCode,
      'data': responseBody.isNotEmpty ? jsonDecode(responseBody) : null,
    };
  } catch (e) {
    return {'error': e.toString()};
  } finally {
    client.close();
  }
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  // ─── Health & Connectivity ──────────────────────────────────────────────

  group('Production API — Health & Connectivity', () {
    testWidgets('GET /health returns 200 with status ok', (_) async {
      final result = await apiGet('/health');
      expect(result.containsKey('error'), isFalse,
          reason: 'API should be reachable: ${result['error'] ?? ''}');
      expect(result['status'], equals(200));
      final data = result['data'] as Map<String, dynamic>;
      expect(data['status'], equals('ok'));
    });

    testWidgets('health response includes uptime and version', (_) async {
      final result = await apiGet('/health');
      expect(result['status'], equals(200));
      final data = result['data'] as Map<String, dynamic>;
      expect(data['uptime'], isA<num>());
      expect((data['uptime'] as num).toInt(), greaterThan(0));
      expect(data['version'], isNotNull);
      expect(data['version'], isNotEmpty);
    });

    testWidgets('health response includes valid ISO 8601 timestamp', (_) async {
      final result = await apiGet('/health');
      expect(result['status'], equals(200));
      final data = result['data'] as Map<String, dynamic>;
      final ts = DateTime.tryParse(data['timestamp'] as String);
      expect(ts, isNotNull, reason: 'timestamp should be valid ISO 8601');
    });
  });

  // ─── API Gateway Routing ────────────────────────────────────────────────

  group('Production API — Gateway Routing', () {
    testWidgets('unknown route returns 404 (not 5xx)', (_) async {
      final result = await apiGet('/api/v1/nonexistent-route');
      expect(result.containsKey('error'), isFalse);
      final status = result['status'] as int;
      expect(status, lessThan(500));
    });
  });

  // ─── Auth Service ──────────────────────────────────────────────────────

  group('Production API — Auth Service', () {
    testWidgets('POST /api/v1/auth/login with invalid credentials returns 401',
        (_) async {
      final result = await apiPost('/api/v1/auth/login', {
        'email': 'nonexistent-flutter-e2e@ifarm.com.br',
        'password': 'invalid-password-e2e',
      });
      expect(result.containsKey('error'), isFalse,
          reason: 'Auth service should be reachable');
      expect(result['status'], equals(401));
    });

    testWidgets('POST /api/v1/auth/login with empty body returns 400 or 401',
        (_) async {
      final result = await apiPost('/api/v1/auth/login', {});
      expect(result.containsKey('error'), isFalse);
      expect([400, 401, 422], contains(result['status']));
    });
  });

  // ─── TLS & Security ───────────────────────────────────────────────────

  group('Production API — TLS & Security', () {
    testWidgets('HTTPS connection succeeds (TLS valid)', (_) async {
      final result = await apiGet('/health');
      expect(result.containsKey('error'), isFalse,
          reason: 'TLS connection should succeed');
      expect(result['status'], equals(200));
    });
  });
}
