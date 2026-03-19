class NotificationPrefsModel {
  final bool isPushEnabled;
  final bool isWhatsappEnabled;
  final bool isEmailEnabled;
  final QuietHours? quietHours;

  const NotificationPrefsModel({
    required this.isPushEnabled,
    required this.isWhatsappEnabled,
    required this.isEmailEnabled,
    this.quietHours,
  });

  factory NotificationPrefsModel.fromJson(Map<String, dynamic> json) {
    return NotificationPrefsModel(
      isPushEnabled: json['isPushEnabled'] as bool? ?? true,
      isWhatsappEnabled: json['isWhatsappEnabled'] as bool? ?? false,
      isEmailEnabled: json['isEmailEnabled'] as bool? ?? true,
      quietHours: json['quietHours'] != null
          ? QuietHours.fromJson(json['quietHours'] as Map<String, dynamic>)
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'isPushEnabled': isPushEnabled,
    'isWhatsappEnabled': isWhatsappEnabled,
    'isEmailEnabled': isEmailEnabled,
    if (quietHours != null) 'quietHours': quietHours!.toJson(),
  };

  NotificationPrefsModel copyWith({
    bool? isPushEnabled,
    bool? isWhatsappEnabled,
    bool? isEmailEnabled,
    QuietHours? quietHours,
  }) {
    return NotificationPrefsModel(
      isPushEnabled: isPushEnabled ?? this.isPushEnabled,
      isWhatsappEnabled: isWhatsappEnabled ?? this.isWhatsappEnabled,
      isEmailEnabled: isEmailEnabled ?? this.isEmailEnabled,
      quietHours: quietHours ?? this.quietHours,
    );
  }
}

class QuietHours {
  final String start;
  final String end;

  const QuietHours({required this.start, required this.end});

  factory QuietHours.fromJson(Map<String, dynamic> json) => QuietHours(
    start: json['start'] as String? ?? '22:00',
    end: json['end'] as String? ?? '08:00',
  );

  Map<String, dynamic> toJson() => {'start': start, 'end': end};
}

class AppNotificationModel {
  final String id;
  final String type;
  final String title;
  final String message;
  final bool isRead;
  final String? relatedId;
  final String? relatedType;
  final DateTime createdAt;

  const AppNotificationModel({
    required this.id,
    required this.type,
    required this.title,
    required this.message,
    required this.isRead,
    this.relatedId,
    this.relatedType,
    required this.createdAt,
  });

  factory AppNotificationModel.fromJson(Map<String, dynamic> json) {
    return AppNotificationModel(
      id: (json['_id'] ?? json['id'] ?? '') as String,
      type: json['type'] as String? ?? '',
      title: json['title'] as String? ?? '',
      message: json['message'] as String? ?? '',
      isRead: json['isRead'] as bool? ?? false,
      relatedId: json['relatedId'] as String?,
      relatedType: json['relatedType'] as String?,
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? '') ?? DateTime.now(),
    );
  }
}
