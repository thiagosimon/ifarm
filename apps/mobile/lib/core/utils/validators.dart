class AppValidators {
  AppValidators._();

  static String? required(String? value, [String? fieldName]) {
    if (value == null || value.trim().isEmpty) {
      return '${fieldName ?? 'Campo'} é obrigatório';
    }
    return null;
  }

  static String? email(String? value) {
    if (value == null || value.trim().isEmpty) return 'Email é obrigatório';
    final regex = RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    if (!regex.hasMatch(value.trim())) return 'Email inválido';
    return null;
  }

  static String? password(String? value) {
    if (value == null || value.isEmpty) return 'Senha é obrigatória';
    if (value.length < 8) return 'Senha deve ter ao menos 8 caracteres';
    return null;
  }

  static String? cpf(String? value) {
    if (value == null || value.trim().isEmpty) return 'CPF é obrigatório';
    final digits = value.replaceAll(RegExp(r'\D'), '');
    if (digits.length != 11) return 'CPF inválido';
    if (!_isValidCpf(digits)) return 'CPF inválido';
    return null;
  }

  static String? cnpj(String? value) {
    if (value == null || value.trim().isEmpty) return 'CNPJ é obrigatório';
    final digits = value.replaceAll(RegExp(r'\D'), '');
    if (digits.length != 14) return 'CNPJ inválido';
    if (!_isValidCnpj(digits)) return 'CNPJ inválido';
    return null;
  }

  static String? federalTaxId(String? value) {
    if (value == null || value.trim().isEmpty) return 'CPF/CNPJ é obrigatório';
    final digits = value.replaceAll(RegExp(r'\D'), '');
    if (digits.length == 11) return cpf(value);
    if (digits.length == 14) return cnpj(value);
    return 'CPF/CNPJ inválido';
  }

  static String? phone(String? value) {
    if (value == null || value.trim().isEmpty) return 'Telefone é obrigatório';
    final digits = value.replaceAll(RegExp(r'\D'), '');
    if (digits.length < 10 || digits.length > 11) return 'Telefone inválido';
    return null;
  }

  static String? ncm(String? value) {
    if (value == null || value.trim().isEmpty) return 'NCM é obrigatório';
    final digits = value.replaceAll(RegExp(r'\D'), '');
    if (digits.length != 8) return 'NCM deve ter 8 dígitos';
    return null;
  }

  static String? minLength(String? value, int min, [String? fieldName]) {
    if (value == null || value.trim().length < min) {
      return '${fieldName ?? 'Campo'} deve ter ao menos $min caracteres';
    }
    return null;
  }

  static String? maxLength(String? value, int max, [String? fieldName]) {
    if (value != null && value.length > max) {
      return '${fieldName ?? 'Campo'} deve ter no máximo $max caracteres';
    }
    return null;
  }

  static String? disputeReason(String? value) {
    if (value == null || value.trim().isEmpty) return 'Motivo é obrigatório';
    if (value.trim().length < 20) return 'Descreva o problema com ao menos 20 caracteres';
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
