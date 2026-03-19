import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/models/notification_prefs_model.dart';
import '../data/models/app_notification_model.dart';
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

class NotificationListNotifier
    extends StateNotifier<AsyncValue<List<AppNotificationModel>>> {
  final NotificationRepository _repository;
  int _page = 1;
  bool _hasMore = true;

  NotificationListNotifier(this._repository)
      : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    _page = 1;
    _hasMore = true;
    state = const AsyncValue.loading();
    try {
      final list = await _repository.getNotifications(page: 1);
      _hasMore = list.length >= 30;
      state = AsyncValue.data(list);
    } catch (e, s) {
      state = AsyncValue.error(e, s);
    }
  }

  Future<void> loadMore() async {
    if (!_hasMore) return;
    try {
      final current = state.value ?? [];
      final list = await _repository.getNotifications(page: ++_page);
      _hasMore = list.length >= 30;
      state = AsyncValue.data([...current, ...list]);
    } catch (_) {}
  }

  Future<void> refresh() => load();

  Future<void> markAsRead(String id) async {
    try {
      await _repository.markAsRead(id);
      final current = state.value;
      if (current == null) return;
      state = AsyncValue.data(
        current.map((n) => n.id == id ? n.copyWith(isRead: true) : n).toList(),
      );
    } catch (_) {}
  }

  Future<void> markAllAsRead() async {
    try {
      await _repository.markAllAsRead();
      final current = state.value;
      if (current == null) return;
      state = AsyncValue.data(
        current.map((n) => n.copyWith(isRead: true)).toList(),
      );
    } catch (_) {}
  }
}

final notificationListProvider = StateNotifierProvider<NotificationListNotifier,
    AsyncValue<List<AppNotificationModel>>>(
  (ref) => NotificationListNotifier(ref.read(notificationRepositoryProvider)),
);
