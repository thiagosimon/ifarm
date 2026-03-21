import 'package:flutter_test/flutter_test.dart';

/// Pumps frames in small increments to allow async work (platform channels,
/// futures) to complete without blocking forever on repeating animations.
///
/// [totalSeconds] — how many seconds of clock time to advance.
/// [stepMs] — granularity of each pump call (default 100ms).
Future<void> pumpFor(
  WidgetTester tester, {
  int totalSeconds = 3,
  int stepMs = 100,
}) async {
  final steps = (totalSeconds * 1000) ~/ stepMs;
  for (var i = 0; i < steps; i++) {
    await tester.pump(Duration(milliseconds: stepMs));
  }
}

/// After pumping the splash screen delay, taps the geolocation skip button
/// ("Agora não") if the geolocation screen is visible, then pumps more frames.
/// This is needed because the simulator typically returns LocationPermission.denied
/// which causes the app to route to the geolocation screen after login/splash.
Future<void> skipGeolocationIfPresent(WidgetTester tester) async {
  final skipBtn = find.textContaining('Agora não');
  if (skipBtn.evaluate().isNotEmpty) {
    await tester.tap(skipBtn.first);
    await pumpFor(tester, totalSeconds: 2);
  }
  // Also try English fallback
  final notNowBtn = find.textContaining('Not now');
  if (notNowBtn.evaluate().isNotEmpty) {
    await tester.tap(notNowBtn.first);
    await pumpFor(tester, totalSeconds: 2);
  }
}

/// Pumps the app past the splash screen and geolocation screen into the main
/// home scaffold. Handles the repeating animation by using small pump steps.
Future<void> pumpToHome(WidgetTester tester) async {
  // Splash screen has a 2.8s delay before navigating
  await pumpFor(tester, totalSeconds: 4);
  await skipGeolocationIfPresent(tester);
}
