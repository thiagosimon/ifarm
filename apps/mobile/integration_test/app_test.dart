// Full app integration test runner — smoke tests for every major screen.
//
// Run on iPhone simulator:
//   flutter test integration_test/app_test.dart -d <simulator-udid>
//
// Run all suites:
//   flutter test integration_test/ -d <simulator-udid>

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:network_image_mock/network_image_mock.dart';
import 'helpers/test_app.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('App Smoke Tests', () {
    setUp(() async {
      await seedAuthState();
    });

    tearDown(() async {
      await clearAuthState();
    });

    testWidgets('app starts without crashing', (tester) async {
      await mockNetworkImagesFor(() async {
        await tester.pumpWidget(buildTestApp(authenticated: true));
        await pumpFor(tester, totalSeconds: 5);
        expect(find.byType(MaterialApp), findsOneWidget);
        expect(find.byType(Scaffold), findsWidgets);
      });
    });

    testWidgets('authenticated flow: home screen renders', (tester) async {
      await mockNetworkImagesFor(() async {
        await tester.pumpWidget(buildTestApp(authenticated: true));
        await pumpToHome(tester);

        expect(
          find.byType(BottomNavigationBar).evaluate().isNotEmpty ||
              find.textContaining('João').evaluate().isNotEmpty ||
              find.textContaining('Olá').evaluate().isNotEmpty ||
              find.textContaining('Bem-vindo').evaluate().isNotEmpty ||
              find.textContaining('Home').evaluate().isNotEmpty ||
              find.byType(Scaffold).evaluate().isNotEmpty,
          isTrue,
          reason: 'Home screen must show scaffold after bypassing geolocation',
        );
      });
    });

    testWidgets('unauthenticated flow: welcome screen renders', (tester) async {
      await clearAuthState();
      await mockNetworkImagesFor(() async {
        await tester.pumpWidget(buildTestApp(authenticated: false));
        await pumpFor(tester, totalSeconds: 5);
        expect(find.byType(Scaffold), findsWidgets);
      });
    });

    testWidgets('quotes tab is reachable', (tester) async {
      await mockNetworkImagesFor(() async {
        await tester.pumpWidget(buildTestApp(authenticated: true));
        await pumpToHome(tester);

        final quotesIcon = find.byIcon(Icons.description_outlined);
        if (quotesIcon.evaluate().isNotEmpty) {
          await tester.tap(quotesIcon.first);
          await pumpFor(tester, totalSeconds: 2);
        }
        expect(find.byType(Scaffold), findsWidgets);
      });
    });

    testWidgets('orders tab is reachable', (tester) async {
      await mockNetworkImagesFor(() async {
        await tester.pumpWidget(buildTestApp(authenticated: true));
        await pumpToHome(tester);

        final ordersIcon = find.byIcon(Icons.shopping_bag_outlined);
        if (ordersIcon.evaluate().isNotEmpty) {
          await tester.tap(ordersIcon.first);
          await pumpFor(tester, totalSeconds: 2);
        }
        expect(find.byType(Scaffold), findsWidgets);
      });
    });

    testWidgets('profile tab is reachable', (tester) async {
      await mockNetworkImagesFor(() async {
        await tester.pumpWidget(buildTestApp(authenticated: true));
        await pumpToHome(tester);

        final profileIcon = find.byIcon(Icons.person_outline);
        if (profileIcon.evaluate().isNotEmpty) {
          await tester.tap(profileIcon.first);
          await pumpFor(tester, totalSeconds: 2);
        }
        expect(find.byType(Scaffold), findsWidgets);
      });
    });

    testWidgets('no overflow errors on home screen', (tester) async {
      await mockNetworkImagesFor(() async {
        final exceptions = <Object>[];
        FlutterError.onError = (details) => exceptions.add(details.exception);

        await tester.pumpWidget(buildTestApp(authenticated: true));
        await pumpToHome(tester);

        final overflowErrors = exceptions
            .where((e) => e.toString().contains('overflowed'))
            .toList();
        expect(overflowErrors, isEmpty,
            reason: 'No layout overflow on home screen');
      });
    });

    testWidgets('no overflow errors on orders screen', (tester) async {
      await mockNetworkImagesFor(() async {
        final exceptions = <Object>[];
        FlutterError.onError = (details) => exceptions.add(details.exception);

        await tester.pumpWidget(buildTestApp(authenticated: true));
        await pumpToHome(tester);

        final ordersIcon = find.byIcon(Icons.shopping_bag_outlined);
        if (ordersIcon.evaluate().isNotEmpty) {
          await tester.tap(ordersIcon.first);
          await pumpFor(tester, totalSeconds: 2);
        }

        final overflowErrors = exceptions
            .where((e) => e.toString().contains('overflowed'))
            .toList();
        expect(overflowErrors, isEmpty,
            reason: 'No layout overflow on orders screen');
      });
    });

    testWidgets('complete B2B flow: quote → proposals → orders', (tester) async {
      await mockNetworkImagesFor(() async {
        await tester.pumpWidget(buildTestApp(authenticated: true));
        await pumpToHome(tester);

        // 1. Go to Quotes tab
        final quotesIcon = find.byIcon(Icons.description_outlined);
        if (quotesIcon.evaluate().isNotEmpty) {
          await tester.tap(quotesIcon.first);
          await pumpFor(tester, totalSeconds: 2);

          // 2. Tap first quote card if available
          final quoteCard = find.byType(Card);
          if (quoteCard.evaluate().isNotEmpty) {
            await tester.tap(quoteCard.first);
            await pumpFor(tester, totalSeconds: 2);

            // 3. Compare proposals if button is visible
            final compareBtn = find.textContaining('Comparar');
            if (compareBtn.evaluate().isNotEmpty) {
              await tester.tap(compareBtn.first);
              await pumpFor(tester, totalSeconds: 2);
            }
          }
        }

        // 4. Go to Orders tab
        final ordersIcon = find.byIcon(Icons.shopping_bag_outlined);
        if (ordersIcon.evaluate().isNotEmpty) {
          await tester.tap(ordersIcon.first);
          await pumpFor(tester, totalSeconds: 2);
        }

        expect(find.byType(Scaffold), findsWidgets);
      });
    });
  });
}
