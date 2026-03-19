import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../constants/enums.dart';

extension StringExtensions on String {
  String get capitalize => isEmpty ? this : '${this[0].toUpperCase()}${substring(1).toLowerCase()}';

  String get titleCase => split(' ').map((w) => w.capitalize).join(' ');

  String get onlyDigits => replaceAll(RegExp(r'\D'), '');

  bool get isValidEmail => RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$').hasMatch(this);
}

extension DateTimeExtensions on DateTime {
  bool get isToday {
    final now = DateTime.now();
    return year == now.year && month == now.month && day == now.day;
  }

  bool get isYesterday {
    final yesterday = DateTime.now().subtract(const Duration(days: 1));
    return year == yesterday.year && month == yesterday.month && day == yesterday.day;
  }

  bool get isPast => isBefore(DateTime.now());
  bool get isFuture => isAfter(DateTime.now());

  int get daysSinceNow => DateTime.now().difference(this).inDays;
}

extension OrderStatusExtensions on OrderStatus {
  Color get color {
    switch (this) {
      case OrderStatus.awaitingPayment: return AppColors.statusProposals;
      case OrderStatus.paid: return AppColors.statusPaid;
      case OrderStatus.preparing: return AppColors.info;
      case OrderStatus.dispatched: return AppColors.statusDispatched;
      case OrderStatus.delivered: return AppColors.statusDelivered;
      case OrderStatus.disputed: return AppColors.statusDisputed;
      case OrderStatus.cancelled: return AppColors.statusCancelled;
      case OrderStatus.refunded: return AppColors.textSecondary;
    }
  }

  IconData get icon {
    switch (this) {
      case OrderStatus.awaitingPayment: return Icons.schedule;
      case OrderStatus.paid: return Icons.check_circle;
      case OrderStatus.preparing: return Icons.inventory;
      case OrderStatus.dispatched: return Icons.local_shipping;
      case OrderStatus.delivered: return Icons.done_all;
      case OrderStatus.disputed: return Icons.warning;
      case OrderStatus.cancelled: return Icons.cancel;
      case OrderStatus.refunded: return Icons.replay;
    }
  }
}

extension QuoteStatusExtensions on QuoteStatus {
  Color get color {
    switch (this) {
      case QuoteStatus.open: return AppColors.statusOpen;
      case QuoteStatus.inProposals: return AppColors.statusProposals;
      case QuoteStatus.accepted: return AppColors.statusAccepted;
      case QuoteStatus.expired: return AppColors.statusExpired;
      case QuoteStatus.cancelled: return AppColors.statusCancelled;
    }
  }
}

extension KycStatusExtensions on KycStatus {
  Color get color {
    switch (this) {
      case KycStatus.notStarted: return AppColors.textTertiary;
      case KycStatus.documentsSubmitted: return AppColors.info;
      case KycStatus.underReview: return AppColors.warning;
      case KycStatus.approved: return AppColors.success;
      case KycStatus.rejected: return AppColors.error;
      case KycStatus.resubmissionRequired: return AppColors.error;
    }
  }
}

extension ContextExtensions on BuildContext {
  ThemeData get theme => Theme.of(this);
  TextTheme get textTheme => Theme.of(this).textTheme;
  ColorScheme get colorScheme => Theme.of(this).colorScheme;
  MediaQueryData get mediaQuery => MediaQuery.of(this);
  double get screenWidth => MediaQuery.of(this).size.width;
  double get screenHeight => MediaQuery.of(this).size.height;
  bool get isDark => Theme.of(this).brightness == Brightness.dark;

  void showSnackBar(String message, {bool isError = false}) {
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? AppColors.error : null,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
