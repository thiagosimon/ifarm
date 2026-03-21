import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';
import 'app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Friendly error widget in release mode
  if (kReleaseMode) {
    ErrorWidget.builder = (details) => Material(
          color: Colors.white,
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Text(
                'Ocorreu um erro inesperado.\nTente reiniciar o aplicativo.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey[700],
                ),
              ),
            ),
          ),
        );
  }

  // Lock to portrait
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Status bar style
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.dark,
  ));

  // OneSignal init
  OneSignal.Debug.setLogLevel(OSLogLevel.verbose);
  OneSignal.initialize('YOUR_ONESIGNAL_APP_ID');
  OneSignal.Notifications.requestPermission(true);

  runApp(
    const ProviderScope(
      child: IFarmApp(),
    ),
  );
}
