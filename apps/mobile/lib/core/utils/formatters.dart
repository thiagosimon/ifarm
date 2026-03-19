import 'package:intl/intl.dart';
import 'package:ifarm_mobile/l10n/app_localizations.dart';

class AppFormatters {
  AppFormatters._();

  // Currency — R$ 1.234,56
  static final _currencyFormatter = NumberFormat.currency(
    locale: 'pt_BR',
    symbol: 'R\$',
    decimalDigits: 2,
  );

  static String currency(double value) => _currencyFormatter.format(value);

  static String currencyFromCents(int cents) =>
      _currencyFormatter.format(cents / 100);

  // Date — DD/MM/AAAA
  static final _dateFormatter = DateFormat('dd/MM/yyyy', 'pt_BR');
  static final _dateTimeFormatter = DateFormat('dd/MM/yyyy HH:mm', 'pt_BR');
  static final _timeFormatter = DateFormat('HH:mm', 'pt_BR');

  static String date(DateTime d) => _dateFormatter.format(d);
  static String dateTime(DateTime d) => _dateTimeFormatter.format(d);
  static String time(DateTime d) => _timeFormatter.format(d);

  static String dateFromString(String iso) {
    try {
      return date(DateTime.parse(iso).toLocal());
    } catch (_) {
      return iso;
    }
  }

  // Time ago
  static String timeAgo(DateTime dateTime, AppLocalizations l) {
    final now = DateTime.now();
    final diff = now.difference(dateTime);
    if (diff.inSeconds < 60) return l.timeAgoNow;
    if (diff.inMinutes < 60) return l.timeAgoMinutes(diff.inMinutes);
    if (diff.inHours < 24) return l.timeAgoHours(diff.inHours);
    if (diff.inDays < 7) return l.timeAgoDays(diff.inDays);
    return date(dateTime);
  }

  // CPF: 000.000.000-00
  static String cpf(String raw) {
    final digits = raw.replaceAll(RegExp(r'\D'), '');
    if (digits.length != 11) return raw;
    return '${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6, 9)}-${digits.substring(9)}';
  }

  // CPF censored: ***.***.***-XX
  static String cpfCensored(String raw) {
    final digits = raw.replaceAll(RegExp(r'\D'), '');
    if (digits.length != 11) return '***.***.***-**';
    return '***.***.**${digits.substring(8, 9)}-${digits.substring(9)}';
  }

  // CNPJ: 00.000.000/0000-00
  static String cnpj(String raw) {
    final digits = raw.replaceAll(RegExp(r'\D'), '');
    if (digits.length != 14) return raw;
    return '${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5, 8)}/${digits.substring(8, 12)}-${digits.substring(12)}';
  }

  // CNPJ censored
  static String cnpjCensored(String raw) {
    final digits = raw.replaceAll(RegExp(r'\D'), '');
    if (digits.length != 14) return '**.***.***/****-**';
    return '**.***.***/****-${digits.substring(12)}';
  }

  // Phone: (00) 00000-0000
  static String phone(String raw) {
    final digits = raw.replaceAll(RegExp(r'\D'), '');
    if (digits.length == 11) {
      return '(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}';
    }
    if (digits.length == 10) {
      return '(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}';
    }
    return raw;
  }

  // NCM: 0000.00.00
  static String ncm(String raw) {
    final digits = raw.replaceAll(RegExp(r'\D'), '');
    if (digits.length != 8) return raw;
    return '${digits.substring(0, 4)}.${digits.substring(4, 6)}.${digits.substring(6)}';
  }

  // Federal Tax ID (auto-detect CPF or CNPJ)
  static String federalTaxId(String raw) {
    final digits = raw.replaceAll(RegExp(r'\D'), '');
    if (digits.length == 11) return cpf(digits);
    if (digits.length == 14) return cnpj(digits);
    return raw;
  }

  static String federalTaxIdCensored(String raw) {
    final digits = raw.replaceAll(RegExp(r'\D'), '');
    if (digits.length == 11) return cpfCensored(digits);
    if (digits.length == 14) return cnpjCensored(digits);
    return raw;
  }

  // Countdown from seconds
  static String countdown(int totalSeconds) {
    final hours = totalSeconds ~/ 3600;
    final minutes = (totalSeconds % 3600) ~/ 60;
    final seconds = totalSeconds % 60;
    if (hours > 0) {
      return '${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
    }
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }
}
