import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';
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
  // ── Step tracking ────────────────────────────────────────────────────────
  int _step = 1; // 1 or 2

  // ── Form keys (one per step) ─────────────────────────────────────────────
  final _step1Key = GlobalKey<FormState>();
  final _step2Key = GlobalKey<FormState>();

  // ── Controllers ─────────────────────────────────────────────────────────
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _senhaCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _cpfCtrl = TextEditingController();
  final _farmNameCtrl = TextEditingController();

  // ── State ────────────────────────────────────────────────────────────────
  String? _selectedState;
  bool _termsAccepted = false;
  bool _marketingAccepted = false;
  bool _isLoading = false;
  bool _obscurePass = true;

  // ── Masks ────────────────────────────────────────────────────────────────
  final _phoneMask = MaskTextInputFormatter(
    mask: '(##) #####-####',
    filter: {'#': RegExp(r'[0-9]')},
  );
  final _cpfMask = MaskTextInputFormatter(
    mask: '###.###.###-##',
    filter: {'#': RegExp(r'[0-9]')},
  );

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _senhaCtrl.dispose();
    _phoneCtrl.dispose();
    _cpfCtrl.dispose();
    _farmNameCtrl.dispose();
    super.dispose();
  }

  // ── Navigation ───────────────────────────────────────────────────────────
  void _nextStep() {
    if (!(_step1Key.currentState?.validate() ?? false)) return;
    setState(() => _step = 2);
  }

  void _prevStep() {
    setState(() => _step = 1);
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  Future<void> _submit() async {
    final l = AppLocalizations.of(context)!;
    if (!(_step2Key.currentState?.validate() ?? false)) return;
    if (!_termsAccepted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(l.registrationAcceptTermsError),
          backgroundColor: const Color(0xFFBA1A1A),
          behavior: SnackBarBehavior.floating,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
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
          'postalCode': '',
          'countryCode': 'BR',
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

  // ── Input decoration ─────────────────────────────────────────────────────
  InputDecoration _inputDeco(String label, {Widget? suffix}) => InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(fontSize: 14, color: Color(0xFF404940)),
        suffixIcon: suffix,
        filled: true,
        fillColor: const Color(0xFFEFF1F3),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF005129), width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFBA1A1A), width: 1),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFBA1A1A), width: 1.5),
        ),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      );

  // ── Gradient button ───────────────────────────────────────────────────────
  Widget _gradientButton({
    required String label,
    required VoidCallback? onPressed,
    bool isLoading = false,
  }) =>
      Container(
        height: 54,
        decoration: BoxDecoration(
          gradient: isLoading || onPressed == null
              ? null
              : const LinearGradient(
                  colors: [Color(0xFF005129), Color(0xFF1A6B3C)],
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                ),
          color: isLoading || onPressed == null
              ? const Color(0xFFBFC9BE)
              : null,
          borderRadius: BorderRadius.circular(14),
          boxShadow: isLoading || onPressed == null
              ? null
              : [
                  BoxShadow(
                    color: const Color(0xFF005129).withValues(alpha: 0.25),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  )
                ],
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onPressed,
            borderRadius: BorderRadius.circular(14),
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
                        letterSpacing: 0.2,
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
      body: SafeArea(
        child: Column(
          children: [
            // ── Header with back + step indicator ───────────────────────
            _StepHeader(
              step: _step,
              totalSteps: 2,
              onBack: _step == 1 ? () => context.pop() : _prevStep,
            ),

            // ── Scrollable body (animated page swap) ─────────────────────
            Expanded(
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                transitionBuilder: (child, anim) => SlideTransition(
                  position: Tween<Offset>(
                    begin: const Offset(0.08, 0),
                    end: Offset.zero,
                  ).animate(
                    CurvedAnimation(parent: anim, curve: Curves.easeOutCubic),
                  ),
                  child: FadeTransition(opacity: anim, child: child),
                ),
                child: _step == 1
                    ? _Step1Body(
                        key: const ValueKey(1),
                        nameCtrl: _nameCtrl,
                        emailCtrl: _emailCtrl,
                        senhaCtrl: _senhaCtrl,
                        obscurePass: _obscurePass,
                        onTogglePass: () =>
                            setState(() => _obscurePass = !_obscurePass),
                        formKey: _step1Key,
                        inputDeco: _inputDeco,
                        gradientButton: _gradientButton,
                        onNext: _nextStep,
                        onLogin: () => context.go(Routes.login),
                        l: l,
                      )
                    : _Step2Body(
                        key: const ValueKey(2),
                        phoneCtrl: _phoneCtrl,
                        cpfCtrl: _cpfCtrl,
                        farmNameCtrl: _farmNameCtrl,
                        phoneMask: _phoneMask,
                        cpfMask: _cpfMask,
                        selectedState: _selectedState,
                        onStateChanged: (v) =>
                            setState(() => _selectedState = v),
                        termsAccepted: _termsAccepted,
                        onTermsChanged: (v) =>
                            setState(() => _termsAccepted = v ?? false),
                        marketingAccepted: _marketingAccepted,
                        onMarketingChanged: (v) =>
                            setState(() => _marketingAccepted = v ?? false),
                        formKey: _step2Key,
                        inputDeco: _inputDeco,
                        gradientButton: _gradientButton,
                        isLoading: _isLoading,
                        onSubmit: _submit,
                        l: l,
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Step Header ──────────────────────────────────────────────────────────────
class _StepHeader extends StatelessWidget {
  final int step;
  final int totalSteps;
  final VoidCallback onBack;

  const _StepHeader({
    required this.step,
    required this.totalSteps,
    required this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(8, 8, 24, 0),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back_ios_new, size: 20,
                color: Color(0xFF191C1E)),
            onPressed: onBack,
          ),
          const Spacer(),
          // Step bubbles
          Row(
            children: List.generate(totalSteps, (i) {
              final active = i < step;
              final current = i == step - 1;
              return AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                margin: const EdgeInsets.symmetric(horizontal: 3),
                width: current ? 28 : 8,
                height: 8,
                decoration: BoxDecoration(
                  color: active
                      ? const Color(0xFF005129)
                      : const Color(0xFFCDD5CD),
                  borderRadius: BorderRadius.circular(99),
                ),
              );
            }),
          ),
          const Spacer(),
          // Balance spacer so bubbles are centred
          const SizedBox(width: 48),
        ],
      ),
    );
  }
}

// ─── Step 1 — Dados de acesso ─────────────────────────────────────────────────
class _Step1Body extends StatelessWidget {
  final TextEditingController nameCtrl;
  final TextEditingController emailCtrl;
  final TextEditingController senhaCtrl;
  final bool obscurePass;
  final VoidCallback onTogglePass;
  final GlobalKey<FormState> formKey;
  final InputDecoration Function(String, {Widget? suffix}) inputDeco;
  final Widget Function({
    required String label,
    required VoidCallback? onPressed,
    bool isLoading,
  }) gradientButton;
  final VoidCallback onNext;
  final VoidCallback onLogin;
  final AppLocalizations l;

  const _Step1Body({
    super.key,
    required this.nameCtrl,
    required this.emailCtrl,
    required this.senhaCtrl,
    required this.obscurePass,
    required this.onTogglePass,
    required this.formKey,
    required this.inputDeco,
    required this.gradientButton,
    required this.onNext,
    required this.onLogin,
    required this.l,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(24, 24, 24, 32),
      child: Form(
        key: formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // ── Hero text ────────────────────────────────────────────────
            const Text(
              'Criar conta',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w800,
                color: Color(0xFF191C1E),
                letterSpacing: -0.5,
                height: 1.2,
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              'Junte-se ao mercado digital do agronegócio',
              style: TextStyle(
                fontSize: 15,
                color: Color(0xFF404940),
                height: 1.5,
              ),
            ),
            const SizedBox(height: 32),

            // ── Nome ─────────────────────────────────────────────────────
            TextFormField(
              controller: nameCtrl,
              textCapitalization: TextCapitalization.words,
              textInputAction: TextInputAction.next,
              validator: (v) => AppValidators.required(l, v, l.registrationFullName),
              style: const TextStyle(fontSize: 16, color: Color(0xFF191C1E)),
              decoration: inputDeco(l.registrationFullName),
            ),
            const SizedBox(height: 14),

            // ── E-mail ───────────────────────────────────────────────────
            TextFormField(
              controller: emailCtrl,
              keyboardType: TextInputType.emailAddress,
              textInputAction: TextInputAction.next,
              validator: (v) => AppValidators.email(l, v),
              style: const TextStyle(fontSize: 16, color: Color(0xFF191C1E)),
              decoration: inputDeco(l.registrationEmail),
            ),
            const SizedBox(height: 14),

            // ── Senha ────────────────────────────────────────────────────
            TextFormField(
              controller: senhaCtrl,
              obscureText: obscurePass,
              textInputAction: TextInputAction.done,
              validator: (v) => AppValidators.password(l, v),
              onFieldSubmitted: (_) => onNext(),
              style: const TextStyle(fontSize: 16, color: Color(0xFF191C1E)),
              decoration: inputDeco(
                l.registrationPassword,
                suffix: IconButton(
                  icon: Icon(
                    obscurePass
                        ? Icons.visibility_off_outlined
                        : Icons.visibility_outlined,
                    color: const Color(0xFF707A70),
                    size: 20,
                  ),
                  onPressed: onTogglePass,
                ),
              ),
            ),
            const SizedBox(height: 28),

            // ── Continue ─────────────────────────────────────────────────
            gradientButton(label: 'Continuar', onPressed: onNext),
            const SizedBox(height: 20),

            // ── Login link ───────────────────────────────────────────────
            Center(
              child: TextButton(
                onPressed: onLogin,
                style: TextButton.styleFrom(
                  foregroundColor: const Color(0xFF005129),
                ),
                child: RichText(
                  text: const TextSpan(
                    style: TextStyle(
                        fontSize: 14, color: Color(0xFF404940)),
                    children: [
                      TextSpan(text: 'Já tem conta? '),
                      TextSpan(
                        text: 'Entrar',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF005129),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Step 2 — Sua fazenda ─────────────────────────────────────────────────────
class _Step2Body extends StatelessWidget {
  final TextEditingController phoneCtrl;
  final TextEditingController cpfCtrl;
  final TextEditingController farmNameCtrl;
  final MaskTextInputFormatter phoneMask;
  final MaskTextInputFormatter cpfMask;
  final String? selectedState;
  final ValueChanged<String?> onStateChanged;
  final bool termsAccepted;
  final ValueChanged<bool?> onTermsChanged;
  final bool marketingAccepted;
  final ValueChanged<bool?> onMarketingChanged;
  final GlobalKey<FormState> formKey;
  final InputDecoration Function(String, {Widget? suffix}) inputDeco;
  final Widget Function({
    required String label,
    required VoidCallback? onPressed,
    bool isLoading,
  }) gradientButton;
  final bool isLoading;
  final VoidCallback onSubmit;
  final AppLocalizations l;

  const _Step2Body({
    super.key,
    required this.phoneCtrl,
    required this.cpfCtrl,
    required this.farmNameCtrl,
    required this.phoneMask,
    required this.cpfMask,
    required this.selectedState,
    required this.onStateChanged,
    required this.termsAccepted,
    required this.onTermsChanged,
    required this.marketingAccepted,
    required this.onMarketingChanged,
    required this.formKey,
    required this.inputDeco,
    required this.gradientButton,
    required this.isLoading,
    required this.onSubmit,
    required this.l,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(24, 24, 24, 32),
      child: Form(
        key: formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // ── Hero text ────────────────────────────────────────────────
            const Text(
              'Sua fazenda',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w800,
                color: Color(0xFF191C1E),
                letterSpacing: -0.5,
                height: 1.2,
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              'Quase lá! Informe os dados da sua propriedade',
              style: TextStyle(
                fontSize: 15,
                color: Color(0xFF404940),
                height: 1.5,
              ),
            ),
            const SizedBox(height: 32),

            // ── Telefone ─────────────────────────────────────────────────
            TextFormField(
              controller: phoneCtrl,
              keyboardType: TextInputType.phone,
              textInputAction: TextInputAction.next,
              inputFormatters: [phoneMask],
              validator: (v) => AppValidators.phone(l, v),
              style: const TextStyle(fontSize: 16, color: Color(0xFF191C1E)),
              decoration: inputDeco(l.registrationPhone),
            ),
            const SizedBox(height: 14),

            // ── CPF ──────────────────────────────────────────────────────
            TextFormField(
              controller: cpfCtrl,
              keyboardType: TextInputType.number,
              textInputAction: TextInputAction.next,
              inputFormatters: [cpfMask],
              validator: (v) => AppValidators.federalTaxId(l, v),
              style: const TextStyle(fontSize: 16, color: Color(0xFF191C1E)),
              decoration: inputDeco(l.registrationCpf),
            ),
            const SizedBox(height: 14),

            // ── Nome da fazenda ───────────────────────────────────────────
            TextFormField(
              controller: farmNameCtrl,
              textCapitalization: TextCapitalization.words,
              textInputAction: TextInputAction.next,
              validator: (v) =>
                  AppValidators.required(l, v, l.registrationPropertyName),
              style: const TextStyle(fontSize: 16, color: Color(0xFF191C1E)),
              decoration: inputDeco(l.registrationPropertyName),
            ),
            const SizedBox(height: 14),

            // ── Estado ────────────────────────────────────────────────────
            DropdownButtonFormField<String>(
              initialValue: selectedState,
              validator: (v) => v == null ? l.registrationSelectState : null,
              onChanged: onStateChanged,
              style: const TextStyle(fontSize: 16, color: Color(0xFF191C1E)),
              decoration: inputDeco(l.registrationState),
              dropdownColor: Colors.white,
              borderRadius: BorderRadius.circular(12),
              items: _kBrazilianStates
                  .map((s) => DropdownMenuItem(
                        value: s.$1,
                        child: Text('${s.$1} — ${s.$2}'),
                      ))
                  .toList(),
            ),
            const SizedBox(height: 24),

            // ── Terms ─────────────────────────────────────────────────────
            _TermsRow(
              accepted: termsAccepted,
              onChanged: onTermsChanged,
              l: l,
            ),
            const SizedBox(height: 8),
            CheckboxListTile(
              value: marketingAccepted,
              onChanged: onMarketingChanged,
              controlAffinity: ListTileControlAffinity.leading,
              contentPadding: EdgeInsets.zero,
              activeColor: const Color(0xFF005129),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(4)),
              title: Text(
                l.registrationMarketingConsent,
                style: const TextStyle(
                    fontSize: 13, color: Color(0xFF404940), height: 1.4),
              ),
            ),
            const SizedBox(height: 24),

            // ── Criar conta ───────────────────────────────────────────────
            gradientButton(
              label: l.registrationCreateAccountButton,
              onPressed: isLoading ? null : onSubmit,
              isLoading: isLoading,
            ),
          ],
        ),
      ),
    );
  }
}

class _TermsRow extends StatelessWidget {
  final bool accepted;
  final ValueChanged<bool?> onChanged;
  final AppLocalizations l;

  const _TermsRow({
    required this.accepted,
    required this.onChanged,
    required this.l,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Checkbox(
          value: accepted,
          onChanged: onChanged,
          activeColor: const Color(0xFF005129),
          materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
          visualDensity: VisualDensity.compact,
        ),
        const SizedBox(width: 4),
        Expanded(
          child: GestureDetector(
            onTap: () => onChanged(!accepted),
            child: Padding(
              padding: const EdgeInsets.only(top: 11),
              child: RichText(
                text: TextSpan(
                  style: const TextStyle(
                      fontSize: 13, color: Color(0xFF404940), height: 1.5),
                  children: [
                    TextSpan(text: '${l.registrationAcceptTerms} '),
                    const TextSpan(
                      text: 'Termos de Uso e Privacidade',
                      style: TextStyle(
                        color: Color(0xFF005129),
                        fontWeight: FontWeight.w600,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
