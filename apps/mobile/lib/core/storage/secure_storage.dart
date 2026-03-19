import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorage {
  SecureStorage._();

  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(
      accessibility: KeychainAccessibility.first_unlock,
      synchronizable: false,
    ),
  );

  static const _keyAccessToken = 'access_token';
  static const _keyRefreshToken = 'refresh_token';
  static const _keyFarmerId = 'farmer_id';
  static const _keyUserEmail = 'user_email';
  static const _keyUserName = 'user_name';

  // Access Token
  static Future<void> saveAccessToken(String token) =>
      _storage.write(key: _keyAccessToken, value: token);

  static Future<String?> getAccessToken() =>
      _storage.read(key: _keyAccessToken);

  // Refresh Token
  static Future<void> saveRefreshToken(String token) =>
      _storage.write(key: _keyRefreshToken, value: token);

  static Future<String?> getRefreshToken() =>
      _storage.read(key: _keyRefreshToken);

  // Farmer ID
  static Future<void> saveFarmerId(String id) =>
      _storage.write(key: _keyFarmerId, value: id);

  static Future<String?> getFarmerId() => _storage.read(key: _keyFarmerId);

  // User info
  static Future<void> saveUserEmail(String email) =>
      _storage.write(key: _keyUserEmail, value: email);

  static Future<String?> getUserEmail() => _storage.read(key: _keyUserEmail);

  static Future<void> saveUserName(String name) =>
      _storage.write(key: _keyUserName, value: name);

  static Future<String?> getUserName() => _storage.read(key: _keyUserName);

  // Save all tokens at once
  static Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await Future.wait([
      saveAccessToken(accessToken),
      saveRefreshToken(refreshToken),
    ]);
  }

  // Clear all (logout)
  static Future<void> clearAll() => _storage.deleteAll();

  // Check if authenticated
  static Future<bool> isAuthenticated() async {
    final token = await getAccessToken();
    return token != null && token.isNotEmpty;
  }
}
