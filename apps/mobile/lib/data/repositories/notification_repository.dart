import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/api_client.dart';
import '../../core/network/api_endpoints.dart';
import '../models/notification_prefs_model.dart';
import '../models/app_notification_model.dart';

final notificationRepositoryProvider = Provider<NotificationRepository>(
  (ref) => NotificationRepository(ref.read(apiClientProvider)),
);

class NotificationRepository {
  final ApiClient _client;
  NotificationRepository(this._client);

  Future<NotificationPrefsModel> getPreferences() async {
    final response = await _client.get(ApiEndpoints.notificationPrefs);
    return NotificationPrefsModel.fromJson(
        response.data as Map<String, dynamic>);
  }

  Future<NotificationPrefsModel> updatePreferences(
      Map<String, dynamic> data) async {
    final response =
        await _client.patch(ApiEndpoints.notificationPrefs, data: data);
    return NotificationPrefsModel.fromJson(
        response.data as Map<String, dynamic>);
  }

  Future<List<AppNotificationModel>> getNotifications(
      {int page = 1, int limit = 30}) async {
    final response = await _client.get(
      ApiEndpoints.notifications,
      queryParams: {'page': page, 'limit': limit},
    );
    final list = response.data as List<dynamic>? ?? [];
    return list
        .map((e) => AppNotificationModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<void> markAsRead(String notificationId) async {
    await _client.patch('${ApiEndpoints.notifications}/$notificationId/read');
  }

  Future<void> markAllAsRead() async {
    await _client.patch('${ApiEndpoints.notifications}/read-all');
  }
}
