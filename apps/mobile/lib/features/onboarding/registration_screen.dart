import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/router/app_router.dart';
import '../../core/utils/validators.dart';
import '../../data/repositories/farmer_repository.dart';
import '../../providers/auth_provider.dart';
import 'package:ifarm_mobile/l10n/app_localizations.dart';

// ─── 27 Brazilian states ──────────────────────────────────────────────────────
const _kBrazilianStates = [
  ('AC', 'Acre'),
  ('AL', 'Alagoas'),
  ('AP', 'Amapá'),
  ('AM', 'Amazonas'),
  ('BA', 'Bahia'),
  ('CE', 'Ceará'),
  ('DF', 'Distrito Federal'),
  ('ES', 'Espírito Santo'),
  ('GO', 'Goiás'),
  ('MA', 'Maranhão'),
  ('MT', 'Mato Grosso'),
  ('MS', 'Mato Grosso do Sul'),
  ('MG', 'Minas Gerais'),
  ('PA', 'Pará'),
  ('PB', 'Paraíba'),
  ('PR', 'Paraná'),
  ('PE', 'Pernambuco'),
  ('PI', 'Piauí'),
  ('RJ', 'Rio de Janeiro'),
  ('RN', 'Rio Grande do Norte'),
  ('RS', 'Rio Grande do Sul'),
  ('RO', 'Rondônia'),
  ('RR', 'Roraima'),
  ('SC', 'Santa Catarina'),
  ('SP', 'São Paulo'),
  ('SE', 'Sergipe'),
  ('TO', 'Tocantins'),
];

class RegistrationScreen extends ConsumerStatefulWidget {
  const RegistrationScreen({super.key});

  @override
  ConsumerState<RegistrationScreen> createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends ConsumerState<RegistrationScreen> {
  final _formKey = GlobalKey<FormState>();

  // Controllers
  final _nameCtrl = TextEditingController();
  final _cpfCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _senhaCtrl = TextEditingController();
  final _farmNameCtrl = TextEditingController();
  final _areaCtrl = TextEditingController();
  final _cepCtrl = TextEditingController();

  // State
  String? _selectedState;
  bool _termsAccepted = false;
  bool _marketingAccepted = false;
  bool _isLoading = false;
  bool _obscurePass = true;
  double? _lat;
  double? _lng;

  // Masks
  final _cpfMask = MaskTextInputFormatter(
    mask: '###.###.###-##',
    filter: {'#': RegExp(r'[0-9]')},
  );
  final _phoneMask = MaskTextInputFormatter(
    mask: '(##) #####-####',
    filter: {'#': RegExp(r'[0-9]')},
  );
  final _cepMask = MaskTextInputFormatter(
    mask: '#####-###',
    filter: {'#': RegExp(r'[0-9]')},
  );

  @override
  void dispose() {
    _nameCtrl.dispose();
    _cpfCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _senhaCtrl.dispose();
    _farmNameCtrl.dispose();
    _areaCtrl.dispose();
    _cepCtrl.dispose();
    super.dispose();
  }

  void _captureGPS() {
    setState(() {
      _lat = -15.0;
      _lng = -47.0;
    });
  }

  Future<void> _submit() async {
    final l = AppLocalizations.of(context)!;
    if (!(_formKey.currentState?.validate() ?? false)) return;
    if (!_termsAccepted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(l.registrationAcceptTermsError),
          backgroundColor: const Color(0xFFBA1A1A),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      );
      return;
    }
    setState(() => _isLoading = true);
    try {
      final repo = ref.read(farmerRepositoryProvider);
      await repo.createFarmer({
        'fullName': _nameCtrl.text.trim(),
        'federalTaxId': _cpfCtrl.text.replaceAll(RegExp(r'\D'), ''),
        'email': _emailCtrl.text.trim(),
        'phoneNumber': _phoneCtrl.text.replaceAll(RegExp(r'\D'), ''),
        'password': _senhaCtrl.text,
        'farmName': _farmNameCtrl.text.trim(),
        'farmAddress': {
          'stateProvince': _selectedState,
          'postalCode': _cepCtrl.text.replaceAll(RegExp(r'\D'), ''),
          'countryCode': 'BR',
          if (_lat != null && _lng != null) ...{
            'latitude': _lat,
            'longitude': _lng,
          },
        },
        'consentHistory': [
          {
            'acceptedAt': DateTime.now().toIso8601String(),
            'termsVersion': '1.0.0',
            'ipAddress': '0.0.0.0',
            'marketingConsent': _marketingAccepted,
          }
        ],
      });

      await ref.read(authNotifierProvider.notifier).login(
            _emailCtrl.text.trim(),
            _senhaCtrl.text,
          );

      if (mounted) context.go(Routes.kyc);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(e.toString()),
            backgroundColor: const Color(0xFFBA1A1A),
            behavior: SnackBarBehavior.floating,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  // ─── Input decoration factory ─────────────────────────────────────────────
  InputDecoration _inputDeco(String label) => InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(fontSize: 14, color: Color(0xFF404940)),
        filled: true,
        fillColor: const Color(0xFFE6E8EA),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Color(0xFF005129), width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Color(0xFFBA1A1A), width: 1),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Color(0xFFBA1A1A), width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.lg,
          vertical: AppSpacing.md,
        ),
      );

  // ─── Section header ───────────────────────────────────────────────────────
  Widget _sectionHeader(IconData icon, String title) => Padding(
        padding: const EdgeInsets.only(top: 28, bottom: 16),
        child: Row(
          children: [
            Icon(icon, size: 22, color: const Color(0xFF005129)),
            const SizedBox(width: 8),
            Text(
              title,
              style: AppTypography.titleLarge.copyWith(
                color: const Color(0xFF191C1E),
              ),
            ),
          ],
        ),
      );

  // ─── Gradient button ──────────────────────────────────────────────────────
  Widget _gradientButton({
    required String label,
    required VoidCallback? onPressed,
    bool isLoading = false,
  }) =>
      Container(
        height: 52,
        decoration: BoxDecoration(
          gradient: isLoading
              ? null
              : const LinearGradient(
                  colors: [Color(0xFF005129), Color(0xFF1A6B3C)],
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                ),
          color: isLoading ? const Color(0xFFBFC9BE) : null,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onPressed,
            borderRadius: BorderRadius.circular(12),
            child: Center(
              child: isLoading
                  ? const SizedBox(
                      width: 22,
                      height: 22,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.5,
                        color: Colors.white,
                      ),
                    )
                  : Text(
                      label,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
            ),
          ),
        ),
      );

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    return Scaffold(
      backgroundColor: const Color(0xFFF7F9FB),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF191C1E)),
          onPressed: () => context.pop(),
        ),
        title: Text(
          l.registrationTitle,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: Color(0xFF191C1E),
          ),
        ),
        centerTitle: false,
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // ═══════════════════════════════════════════════════════════════
              // SECTION 1 — Dados Pessoais
              // ═══════════════════════════════════════════════════════════════
              _sectionHeader(Icons.person_outline, l.registrationPersonalData),

              // Nome completo
              TextFormField(
                controller: _nameCtrl,
                textCapitalization: TextCapitalization.words,
                textInputAction: TextInputAction.next,
                validator: (v) =>
                    AppValidators.required(l, v, l.registrationFullName),
                style: const TextStyle(fontSize: 16, color: Color(0xFF191C1E)),
                decoration: _inputDeco(l.registrationFullName),
              ),
              const SizedBox(height: 12),

              // CPF
              TextFormField(
                controller: _cpfCtrl,
                keyboardType: TextInputType.number,
                textInputAction: TextInputAction.next,
                inputFormatters: [_cpfMask],
                validator: (v) => AppValidators.federalTaxId(l, v),
                style: const TextStyle(fontSize: 16, color: Color(0xFF191C1E)),
                decoration: _inputDeco(l.registrationCpf),
              ),
              const SizedBox(height: 12),

              // E-mail
              TextFormField(
                controller: _emailCtrl,
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                validator: (v) => AppValidators.email(l, v),
                style: const TextStyle(fontSize: 16, color: Color(0xFF191C1E)),
                decoration: _inputDeco(l.registrationEmail),
              ),
              const SizedBox(height: 12),

              // Telefone
              TextFormField(
                controller: _phoneCtrl,
                keyboardType: TextInputType.phone,
                textInputAction: TextInputAction.next,
                inputFormatters: [_phoneMask],
                validator: (v) => AppValidators.phone(l, v),
                style: const TextStyle(fontSize: 16, color: Color(0xFF191C1E)),
                decoration: _inputDeco(l.registrationPhone),
              ),
              const SizedBox(height: 12),

              // Senha
              TextFormField(
                controller: _senhaCtrl,
                obscureText: _obscurePass,
                textInputAction: TextInputAction.next,
                validator: (v) => AppValidators.password(l, v),
                style: const TextStyle(fontSize: 16, color: Color(0xFF191C1E)),
                decoration: _inputDeco(l.registrationPassword).copyWith(
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePass
                          ? Icons.visibility_off_outlined
                          : Icons.visibility_outlined,
                      color: const Color(0xFF707A70),
                      size: 20,
                    ),
                    onPressed: () =>
                        setState(() => _obscurePass = !_obscurePass),
                  ),
                ),
              ),

              // ═══════════════════════════════════════════════════════════════
              // SECTION 2 — Detalhes da Propriedade
              // ═══════════════════════════════════════════════════════════════
              _sectionHeader(Icons.eco_outlined, l.registrationPropertyDetails),

              // Nome da propriedade
              TextFormField(
                controller: _farmNameCtrl,
                textCapitalization: TextCapitalization.words,
                textInputAction: TextInputAction.next,
                validator: (v) =>
                    AppValidators.required(l, v, l.registrationPropertyName),
                style: const TextStyle(fontSize: 16, color: Color(0xFF191C1E)),
                decoration: _inputDeco(l.registrationPropertyName),
              ),
              const SizedBox(height: 12),

              // Área total (ha)
              TextFormField(
                controller: _areaCtrl,
                keyboardType:
                    const TextInputType.numberWithOptions(decimal: true),
                textInputAction: TextInputAction.next,
                style: const TextStyle(fontSize: 16, color: Color(0xFF191C1E)),
                decoration: _inputDeco(l.registrationTotalArea),
              ),
              const SizedBox(height: 12),

              // CEP
              TextFormField(
                controller: _cepCtrl,
                keyboardType: TextInputType.number,
                textInputAction: TextInputAction.next,
                inputFormatters: [_cepMask],
                style: const TextStyle(fontSize: 16, color: Color(0xFF191C1E)),
                decoration: _inputDeco(l.registrationZipCode),
              ),
              const SizedBox(height: 12),

              // Estado dropdown
              DropdownButtonFormField<String>(
                value: _selectedState,
                validator: (v) => v == null ? l.registrationSelectState : null,
                onChanged: (v) => setState(() => _selectedState = v),
                style: const TextStyle(
                  fontSize: 16,
                  color: Color(0xFF191C1E),
                ),
                decoration: _inputDeco(l.registrationState),
                dropdownColor: const Color(0xFFFFFFFF),
                items: _kBrazilianStates
                    .map((s) => DropdownMenuItem(
                          value: s.$1,
                          child: Text('${s.$1} — ${s.$2}'),
                        ))
                    .toList(),
              ),
              const SizedBox(height: 12),

              // GPS section
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFF2F4F6),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      l.registrationGpsCoordinates,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF191C1E),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      _lat != null && _lng != null
                          ? '${_lat!.toStringAsFixed(4)}, ${_lng!.toStringAsFixed(4)}'
                          : l.registrationTapToCapture,
                      style: const TextStyle(
                        fontSize: 12,
                        color: Color(0xFF707A70),
                      ),
                    ),
                    const SizedBox(height: 8),
                    OutlinedButton.icon(
                      onPressed: _captureGPS,
                      icon: const Icon(Icons.my_location, size: 16),
                      label: Text(l.registrationCapture),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFF005129),
                        side: const BorderSide(color: Color(0xFF005129)),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        textStyle: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.8,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // ═══════════════════════════════════════════════════════════════
              // SECTION 3 — Termos e Privacidade
              // ═══════════════════════════════════════════════════════════════
              _sectionHeader(Icons.gavel_outlined, l.registrationTermsTitle),

              // Terms checkbox
              CheckboxListTile(
                value: _termsAccepted,
                onChanged: (v) => setState(() => _termsAccepted = v ?? false),
                controlAffinity: ListTileControlAffinity.leading,
                contentPadding: EdgeInsets.zero,
                activeColor: const Color(0xFF005129),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(4),
                ),
                title: Text(
                  l.registrationAcceptTerms,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Color(0xFF404940),
                    height: 1.5,
                  ),
                ),
                subtitle: TextButton(
                  onPressed: () {},
                  style: TextButton.styleFrom(
                    foregroundColor: const Color(0xFF005129),
                    padding: EdgeInsets.zero,
                    alignment: Alignment.centerLeft,
                    minimumSize: Size.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                  child: Text(
                    l.registrationReadTerms,
                    style: const TextStyle(fontSize: 13),
                  ),
                ),
              ),

              // Marketing checkbox
              CheckboxListTile(
                value: _marketingAccepted,
                onChanged: (v) =>
                    setState(() => _marketingAccepted = v ?? false),
                controlAffinity: ListTileControlAffinity.leading,
                contentPadding: EdgeInsets.zero,
                activeColor: const Color(0xFF005129),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(4),
                ),
                title: Text(
                  l.registrationMarketingConsent,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Color(0xFF404940),
                    height: 1.5,
                  ),
                ),
              ),

              const SizedBox(height: 32),

              // ─── Criar Conta button ───────────────────────────────────────
              _gradientButton(
                label: l.registrationCreateAccountButton,
                onPressed: _isLoading ? null : _submit,
                isLoading: _isLoading,
              ),

              const SizedBox(height: 12),

              // ─── Fazer Login link ─────────────────────────────────────────
              Center(
                child: TextButton(
                  onPressed: () => context.go(Routes.login),
                  style: TextButton.styleFrom(
                    foregroundColor: const Color(0xFF005129),
                  ),
                  child: Text(
                    l.registrationLoginButton,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF005129),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}
