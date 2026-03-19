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
