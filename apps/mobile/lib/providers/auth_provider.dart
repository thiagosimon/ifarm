import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/storage/secure_storage.dart';
import '../data/models/user_model.dart';
import '../data/repositories/auth_repository.dart';

enum AuthState { unknown, authenticated, unauthenticated }

class AuthNotifier extends StateNotifier<AsyncValue<UserModel?>> {
  final AuthRepository _repository;
  AuthNotifier(this._repository) : super(const AsyncValue.loading()) {
    _init();
  }

  Future<void> _init() async {
    final isAuth = await SecureStorage.isAuthenticated();
    if (isAuth) {
      try {
        final user = await _repository.getMe();
        state = AsyncValue.data(user);
      } catch (_) {
        await SecureStorage.clearAll();
        state = const AsyncValue.data(null);
      }
    } else {
      state = const AsyncValue.data(null);
    }
  }

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final result = await _repository.login(email: email, password: password);
      await SecureStorage.saveTokens(
        accessToken: result['access_token'] as String,
        refreshToken: result['refresh_token'] as String,
      );
      final user = await _repository.getMe();
      await SecureStorage.saveUserName(user.name);
      await SecureStorage.saveUserEmail(user.email);
      state = AsyncValue.data(user);
    } catch (e, s) {
      state = AsyncValue.error(e, s);
    }
  }

  Future<void> logout() async {
    await _repository.logout();
    state = const AsyncValue.data(null);
  }

  bool get isAuthenticated => state.value != null;
}

final authNotifierProvider =
    StateNotifierProvider<AuthNotifier, AsyncValue<UserModel?>>(
  (ref) => AuthNotifier(ref.read(authRepositoryProvider)),
);

final currentUserProvider = Provider<UserModel?>((ref) {
  return ref.watch(authNotifierProvider).value;
});
