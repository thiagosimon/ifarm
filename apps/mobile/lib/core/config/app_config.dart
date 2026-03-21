import 'dart:io';

enum AppEnvironment { dev, staging, prod }

class AppConfig {
  AppConfig._();

  static const String _envKey = 'APP_ENV';
  static const String _apiUrlKey = 'API_URL';

  /// Resolved from --dart-define=APP_ENV=dev|staging|prod
  static AppEnvironment get environment {
    const envStr = String.fromEnvironment(_envKey, defaultValue: 'dev');
    switch (envStr) {
      case 'prod':
        return AppEnvironment.prod;
      case 'staging':
        return AppEnvironment.staging;
      default:
        return AppEnvironment.dev;
    }
  }

  /// Resolved from --dart-define=API_URL=... or falls back to env defaults
  static String get apiUrl {
    const overrideUrl = String.fromEnvironment(_apiUrlKey);
    if (overrideUrl.isNotEmpty) return overrideUrl;
    switch (environment) {
      case AppEnvironment.prod:
        return 'https://api.ifarm.agr.br';
      case AppEnvironment.staging:
        return 'https://api-staging.ifarm.agr.br';
      case AppEnvironment.dev:
        return Platform.isAndroid
            ? 'http://10.0.2.2:3000'
            : 'http://localhost:3000';
    }
  }

  static bool get isDev => environment == AppEnvironment.dev;
  static bool get isStaging => environment == AppEnvironment.staging;
  static bool get isProd => environment == AppEnvironment.prod;
}
