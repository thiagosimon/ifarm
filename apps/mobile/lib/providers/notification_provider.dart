import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/models/notification_prefs_model.dart';
import '../data/repositories/notification_repository.dart';

class NotificationPrefsNotifier
    extends StateNotifier<AsyncValue<NotificationPrefsModel?>> {
  final NotificationRepository _repository;

  NotificationPrefsNotifier(this._repository) : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final prefs = await _repository.getPreferences();
      state = AsyncValue.data(prefs);
    } catch (e, s) {
      state = AsyncValue.error(e, s);
    }
  }

  Future<void> update(Map<String, dynamic> data) async {
    try {
      final updated = await _repository.updatePreferences(data);
      state = AsyncValue.data(updated);
    } catch (e, s) {
      state = AsyncValue.error(e, s);
    }
  }
}

final notificationPrefsProvider = StateNotifierProvider<NotificationPrefsNotifier,
    AsyncValue<NotificationPrefsModel?>>(
  (ref) => NotificationPrefsNotifier(ref.read(notificationRepositoryProvider)),
);

final notificationsListProvider =
    FutureProvider<List<AppNotificationModel>>((ref) async {
  return ref.read(notificationRepositoryProvider).getNotifications();
});
