import 'package:ifarm_mobile/l10n/app_localizations.dart';

class AppValidators {
  AppValidators._();

  static String? required(AppLocalizations l, String? value,
      [String? fieldName]) {
    if (value == null || value.trim().isEmpty) {
      return l.validatorRequired(fieldName ?? l.validatorFieldDefault);
    }
    return null;
  }

  static String? email(AppLocalizations l, String? value) {
    if (value == null || value.trim().isEmpty) return l.validatorEmailRequired;
    final regex = RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    if (!regex.hasMatch(value.trim())) return l.validatorEmailInvalid;
    return null;
  }

  static String? password(AppLocalizations l, String? value) {
    if (value == null || value.isEmpty) return l.validatorPasswordRequired;
    if (value.length < 8) return l.validatorPasswordMinLength;
    return null;
  }

  static String? cpf(AppLocalizations l, String? value) {
    if (value == null || value.trim().isEmpty) return l.validatorCpfRequired;
    final digits = value.replaceAll(RegExp(r'\D'), '');
    if (digits.length != 11) return l.validatorCpfInvalid;
    if (!_isValidCpf(digits)) return l.validatorCpfInvalid;
    return null;
  }

  static String? cnpj(AppLocalizations l, String? value) {
    if (value == null || value.trim().isEmpty) return l.validatorCnpjRequired;
    final digits = value.replaceAll(RegExp(r'\D'), '');
    if (digits.length != 14) return l.validatorCnpjInvalid;
    if (!_isValidCnpj(digits)) return l.validatorCnpjInvalid;
    return null;
  }

  static String? federalTaxId(AppLocalizations l, String? value) {
    if (value == null || value.trim().isEmpty)
      return l.validatorFederalTaxIdRequired;
    final digits = value.replaceAll(RegExp(r'\D'), '');
    if (digits.length == 11) return cpf(l, value);
    if (digits.length == 14) return cnpj(l, value);
    return l.validatorFederalTaxIdInvalid;
  }

  static String? phone(AppLocalizations l, String? value) {
    if (value == null || value.trim().isEmpty) return l.validatorPhoneRequired;
    final digits = value.replaceAll(RegExp(r'\D'), '');
    if (digits.length < 10 || digits.length > 11)
      return l.validatorPhoneInvalid;
    return null;
  }

  static String? ncm(AppLocalizations l, String? value) {
    if (value == null || value.trim().isEmpty) return l.validatorNcmRequired;
    final digits = value.replaceAll(RegExp(r'\D'), '');
    if (digits.length != 8) return l.validatorNcmInvalid;
    return null;
  }

  static String? minLength(AppLocalizations l, String? value, int min,
      [String? fieldName]) {
    if (value == null || value.trim().length < min) {
      return l.validatorMinLength(fieldName ?? l.validatorFieldDefault, min);
    }
    return null;
  }

  static String? maxLength(AppLocalizations l, String? value, int max,
      [String? fieldName]) {
    if (value != null && value.length > max) {
      return l.validatorMaxLength(fieldName ?? l.validatorFieldDefault, max);
    }
    return null;
  }

  static String? disputeReason(AppLocalizations l, String? value) {
    if (value == null || value.trim().isEmpty)
      return l.validatorDisputeReasonRequired;
    if (value.trim().length < 20) return l.validatorDisputeReasonMinLength;
    return null;
  }

  // CPF verification — Brazilian algorithm
  static bool _isValidCpf(String digits) {
    if (RegExp(r'^(\d)\1{10}$').hasMatch(digits)) return false;

    int sum = 0;
    for (int i = 0; i < 9; i++) {
      sum += int.parse(digits[i]) * (10 - i);
    }
    int remainder = (sum * 10) % 11;
    if (remainder == 10 || remainder == 11) remainder = 0;
    if (remainder != int.parse(digits[9])) return false;

    sum = 0;
    for (int i = 0; i < 10; i++) {
      sum += int.parse(digits[i]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder == 10 || remainder == 11) remainder = 0;
    return remainder == int.parse(digits[10]);
  }

  // CNPJ verification — Brazilian algorithm
  static bool _isValidCnpj(String digits) {
    if (RegExp(r'^(\d)\1{13}$').hasMatch(digits)) return false;

    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    int sum = 0;
    for (int i = 0; i < 12; i++) {
      sum += int.parse(digits[i]) * weights1[i];
    }
    int remainder = sum % 11;
    int digit1 = remainder < 2 ? 0 : 11 - remainder;
    if (digit1 != int.parse(digits[12])) return false;

    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    sum = 0;
    for (int i = 0; i < 13; i++) {
      sum += int.parse(digits[i]) * weights2[i];
    }
    remainder = sum % 11;
    int digit2 = remainder < 2 ? 0 : 11 - remainder;
    return digit2 == int.parse(digits[13]);
  }
}
