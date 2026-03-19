import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/constants/brazilian_states.dart';
import '../../core/storage/secure_storage.dart';
import '../../core/utils/extensions.dart';
import '../../data/models/farmer_model.dart';
import '../../data/repositories/farmer_repository.dart';
import '../../providers/farmer_provider.dart';
import '../../widgets/ifarm_button.dart';
import '../../widgets/ifarm_text_field.dart';

class EditProfileScreen extends ConsumerStatefulWidget {
  const EditProfileScreen({super.key});

  @override
  ConsumerState<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends ConsumerState<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();

  final _nameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _cpfCtrl = TextEditingController();
  final _farmNameCtrl = TextEditingController();
  final _addressCtrl = TextEditingController();
  final _areaCtrl = TextEditingController();
  final _cropsCtrl = TextEditingController();

  final _phoneMask = MaskTextInputFormatter(
    mask: '(##) #####-####',
    filter: {'#': RegExp(r'[0-9]')},
  );

  String? _selectedState;
  bool _isSaving = false;
  FarmerModel? _farmer;

  @override
  void initState() {
    super.initState();
    _loadFarmer();
  }

  Future<void> _loadFarmer() async {
    final farmerId = await SecureStorage.getFarmerId();
    if (farmerId == null) return;
    final farmer =
        await ref.read(farmerRepositoryProvider).getFarmerById(farmerId);
    if (!mounted) return;
    setState(() {
      _farmer = farmer;
      _nameCtrl.text = farmer.fullName;
      _phoneCtrl.text = farmer.phoneNumber;
      _cpfCtrl.text = farmer.federalTaxId ?? '';
      _farmNameCtrl.text = farmer.farmName ?? '';
      _selectedState = farmer.farmAddress?.stateProvince;
      _addressCtrl.text = farmer.farmAddress?.street ?? '';
    });
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _cpfCtrl.dispose();
    _farmNameCtrl.dispose();
    _addressCtrl.dispose();
    _areaCtrl.dispose();
    _cropsCtrl.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    if (_farmer == null) return;
    setState(() => _isSaving = true);
    try {
      final data = <String, dynamic>{
        'fullName': _nameCtrl.text.trim(),
        'phoneNumber': _phoneCtrl.text.replaceAll(RegExp(r'\D'), ''),
        if (_farmNameCtrl.text.trim().isNotEmpty)
          'farmName': _farmNameCtrl.text.trim(),
        if (_selectedState != null || _addressCtrl.text.isNotEmpty)
          'farmAddress': {
            if (_addressCtrl.text.trim().isNotEmpty)
              'street': _addressCtrl.text.trim(),
            if (_farmer!.farmAddress?.city != null)
              'city': _farmer!.farmAddress!.city,
            if (_selectedState != null) 'stateProvince': _selectedState,
          },
      };
      await ref.read(farmerRepositoryProvider).updateFarmer(_farmer!.id, data);
      ref.invalidate(currentFarmerProvider);
      if (mounted) context.showSnackBar('Perfil atualizado com sucesso!');
    } catch (e) {
      if (mounted) {
        context.showSnackBar('Erro ao salvar perfil. Tente novamente.',
            isError: true);
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  String _initials(String name) {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
    }
    return name.isNotEmpty ? name[0].toUpperCase() : '?';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        centerTitle: false,
        title: const Text('Editar Perfil', style: AppTypography.headlineSmall),
        // No AppBar save action — only bottom button
      ),
      body: _farmer == null
          ? const Center(
              child: CircularProgressIndicator(color: AppColors.primary))
          : Form(
              key: _formKey,
              child: ListView(
                padding: EdgeInsets.zero,
                children: [
                  // ── Avatar section ──────────────────────────────────────
                  _buildAvatarSection(),

                  // ── Personal data band ──────────────────────────────────
                  _SectionBand(label: 'Dados Pessoais'),

                  Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.lg, vertical: AppSpacing.md),
                    child: Column(
                      children: [
                        // Full name
                        IFarmTextField(
                          controller: _nameCtrl,
                          label: 'Nome completo',
                          hint: 'Seu nome completo',
                          prefixIcon: Icons.person_outline,
                          textCapitalization: TextCapitalization.words,
                          validator: (v) => (v == null || v.trim().isEmpty)
                              ? 'Nome é obrigatório'
                              : null,
                        ),
                        const SizedBox(height: AppSpacing.md),

                        // Phone
                        IFarmTextField(
                          controller: _phoneCtrl,
                          label: 'Telefone / WhatsApp',
                          hint: '(00) 00000-0000',
                          prefixIcon: Icons.call_outlined,
                          keyboardType: TextInputType.phone,
                          inputFormatters: [_phoneMask],
                          validator: (v) {
                            if (v == null || v.isEmpty) {
                              return 'Telefone é obrigatório';
                            }
                            final digits = v.replaceAll(RegExp(r'\D'), '');
                            if (digits.length < 10) return 'Telefone inválido';
                            return null;
                          },
                        ),
                        const SizedBox(height: AppSpacing.md),

                        // CPF — read-only, fingerprint icon, lock suffix
                        _ReadOnlyField(
                          controller: _cpfCtrl,
                          label: 'CPF',
                          hint: '000.000.000-00',
                          prefixIcon: Icons.fingerprint,
                        ),
                      ],
                    ),
                  ),

                  // ── Farm band ───────────────────────────────────────────
                  _SectionBand(label: 'Fazenda'),

                  Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.lg, vertical: AppSpacing.md),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Farm name
                        IFarmTextField(
                          controller: _farmNameCtrl,
                          label: 'Nome da fazenda',
                          hint: 'Ex: Fazenda Santa Fé',
                          prefixIcon: Icons.agriculture_outlined,
                          textCapitalization: TextCapitalization.words,
                        ),
                        const SizedBox(height: AppSpacing.md),

                        // State dropdown
                        _StateDropdown(
                          value: _selectedState,
                          onChanged: (v) =>
                              setState(() => _selectedState = v),
                        ),
                        const SizedBox(height: AppSpacing.md),

                        // Property address
                        IFarmTextField(
                          controller: _addressCtrl,
                          label: 'Endereço da Propriedade',
                          hint: 'Ex: Rodovia BR-163, km 45',
                          prefixIcon: Icons.location_on_outlined,
                          textCapitalization: TextCapitalization.sentences,
                        ),
                        // "Ajustar no Mapa" TextButton below address field
                        Align(
                          alignment: Alignment.centerLeft,
                          child: TextButton.icon(
                            onPressed: () {},
                            icon: const Icon(Icons.map_outlined, size: 16),
                            label: const Text('Ajustar no Mapa'),
                            style: TextButton.styleFrom(
                              foregroundColor: AppColors.primary,
                              padding: EdgeInsets.zero,
                              visualDensity: VisualDensity.compact,
                            ),
                          ),
                        ),
                        const SizedBox(height: AppSpacing.md),

                        // Total area
                        IFarmTextField(
                          controller: _areaCtrl,
                          label: 'Área total (ha)',
                          hint: 'Ex: 500',
                          prefixIcon: Icons.straighten_outlined,
                          keyboardType: const TextInputType.numberWithOptions(
                              decimal: true),
                          inputFormatters: [
                            FilteringTextInputFormatter.allow(
                                RegExp(r'[0-9.,]')),
                          ],
                        ),
                        const SizedBox(height: AppSpacing.md),

                        // Crops
                        IFarmTextField(
                          controller: _cropsCtrl,
                          label: 'Culturas (separadas por vírgula)',
                          hint: 'Ex: Soja, Milho, Trigo',
                          prefixIcon: Icons.grass_outlined,
                          textCapitalization: TextCapitalization.sentences,
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: AppSpacing.xl),

                  // ── Only bottom save button (NO AppBar action) ──────────
                  Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.lg),
                    child: IFarmButton(
                      label: 'Salvar Alterações',
                      isLoading: _isSaving,
                      onPressed: _save,
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
    );
  }

  Widget _buildAvatarSection() {
    // FarmerModel does not yet expose a photoUrl field; always show initials
    const String? photoUrl = null;
    final name = _farmer?.fullName ?? '';

    return Container(
      color: AppColors.surfaceContainerLowest,
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.xxl),
      child: Column(
        children: [
          Stack(
            children: [
              // CircleAvatar 96px
              CircleAvatar(
                radius: 48,
                backgroundColor: AppColors.primaryContainer,
                backgroundImage:
                    photoUrl != null ? NetworkImage(photoUrl) : null,
                child: photoUrl == null
                    ? Text(
                        name.isNotEmpty ? _initials(name) : '?',
                        style: AppTypography.headlineLarge.copyWith(
                            color: Colors.white, fontWeight: FontWeight.w700),
                      )
                    : null,
              ),
              // Camera overlay button — bottom-right
              Positioned(
                bottom: 0,
                right: 0,
                child: GestureDetector(
                  onTap: () {},
                  child: Container(
                    width: 28,
                    height: 28,
                    decoration: const BoxDecoration(
                      color: AppColors.primary,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.camera_alt_outlined,
                      size: 14,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          // "ALTERAR FOTO" TextButton below avatar
          TextButton(
            onPressed: () {},
            style: TextButton.styleFrom(
              foregroundColor: AppColors.primary,
              padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.md, vertical: AppSpacing.xs),
            ),
            child: Text(
              'ALTERAR FOTO',
              style: AppTypography.labelMedium.copyWith(
                color: AppColors.primary,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.8,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Section band — subtle surfaceContainerHigh background (NOT bold headers)
// ---------------------------------------------------------------------------

class _SectionBand extends StatelessWidget {
  final String label;
  const _SectionBand({required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: AppColors.surfaceContainerHigh,
      padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.lg, vertical: AppSpacing.sm),
      child: Text(
        label.toUpperCase(),
        style: TextStyle(
          color: AppColors.outline,
          fontSize: 11,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.2,
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Read-only CPF field — fingerprint prefix, lock suffix
// ---------------------------------------------------------------------------

class _ReadOnlyField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final String hint;
  final IconData prefixIcon;

  const _ReadOnlyField({
    required this.controller,
    required this.label,
    required this.hint,
    required this.prefixIcon,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: AppTypography.labelMedium
                .copyWith(color: AppColors.textSecondary)),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.md, vertical: AppSpacing.md),
          decoration: BoxDecoration(
            color: AppColors.surfaceContainerHigh,
            borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
            border: Border.all(
                color: AppColors.outlineVariant.withValues(alpha: 0.5)),
          ),
          child: Row(
            children: [
              // fingerprint icon (NOT badge_outlined)
              Icon(prefixIcon,
                  size: AppSpacing.iconMd, color: AppColors.textSecondary),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: Text(
                  controller.text.isNotEmpty ? controller.text : hint,
                  style: AppTypography.bodyMedium.copyWith(
                    color: controller.text.isNotEmpty
                        ? AppColors.textSecondary
                        : AppColors.textTertiary,
                  ),
                ),
              ),
              const Icon(Icons.lock_outline,
                  size: AppSpacing.iconSm, color: AppColors.textTertiary),
            ],
          ),
        ),
      ],
    );
  }
}

// ---------------------------------------------------------------------------
// State dropdown
// ---------------------------------------------------------------------------

class _StateDropdown extends StatelessWidget {
  final String? value;
  final ValueChanged<String?> onChanged;

  const _StateDropdown({required this.value, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Estado',
            style: AppTypography.labelMedium
                .copyWith(color: AppColors.textSecondary)),
        const SizedBox(height: 6),
        DropdownButtonFormField<String>(
          initialValue: value,
          decoration: InputDecoration(
            prefixIcon: const Icon(Icons.map_outlined,
                size: AppSpacing.iconMd, color: AppColors.textTertiary),
            hintText: 'Selecione o estado',
            hintStyle:
                AppTypography.bodyMedium.copyWith(color: AppColors.textTertiary),
            filled: true,
            fillColor: AppColors.surfaceContainerLowest,
            contentPadding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.md, vertical: AppSpacing.md),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
              borderSide: BorderSide(
                  color: AppColors.outlineVariant.withValues(alpha: 0.5)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
              borderSide: BorderSide(
                  color: AppColors.outlineVariant.withValues(alpha: 0.5)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
              borderSide:
                  const BorderSide(color: AppColors.primary, width: 1.5),
            ),
          ),
          items: BrazilianStates.all
              .map((s) => DropdownMenuItem(
                    value: s.code,
                    child: Text('${s.code} — ${s.name}',
                        style: AppTypography.bodyMedium),
                  ))
              .toList(),
          onChanged: onChanged,
          isExpanded: true,
        ),
      ],
    );
  }
}
