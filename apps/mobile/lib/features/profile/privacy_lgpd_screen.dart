import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/extensions.dart';
import '../../core/router/app_router.dart';
import '../../core/storage/secure_storage.dart';
import '../../data/repositories/farmer_repository.dart';
import '../../providers/auth_provider.dart';
import '../../providers/farmer_provider.dart';
import '../../widgets/ifarm_button.dart';

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

class PrivacyLgpdScreen extends ConsumerStatefulWidget {
  const PrivacyLgpdScreen({super.key});

  @override
  ConsumerState<PrivacyLgpdScreen> createState() => _PrivacyLgpdScreenState();
}

class _PrivacyLgpdScreenState extends ConsumerState<PrivacyLgpdScreen> {
  bool _isExporting = false;
  bool _marketingEnabled = false;

  Future<void> _exportData() async {
    final farmerId = await SecureStorage.getFarmerId();
    if (farmerId == null) return;

    setState(() => _isExporting = true);
    try {
      final data =
          await ref.read(farmerRepositoryProvider).exportData(farmerId);

      if (!mounted) return;

      await showDialog<void>(
        context: context,
        builder: (_) => _ExportConfirmDialog(data: data),
      );
    } catch (_) {
      if (mounted) {
        context.showSnackBar('Erro ao exportar dados. Tente novamente.',
            isError: true);
      }
    } finally {
      if (mounted) setState(() => _isExporting = false);
    }
  }

  Future<void> _showDeleteSheet() async {
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius:
            BorderRadius.vertical(top: Radius.circular(AppSpacing.radiusLg)),
      ),
      builder: (_) => _DeleteAccountBottomSheet(
        onDeleted: () async {
          await ref.read(authNotifierProvider.notifier).logout();
          if (mounted) context.go(Routes.welcome);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final farmerAsync = ref.watch(currentFarmerProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        centerTitle: false,
        // AppBar title: "Privacidade" (NOT "Privacidade e LGPD")
        title: const Text('Privacidade', style: AppTypography.headlineSmall),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          // ── LGPD Rights ──────────────────────────────────────────────────
          _SectionLabel(label: 'Seus Direitos LGPD'),
          const SizedBox(height: AppSpacing.sm),
          ..._lgpdRights.map((r) => _ExpandableRight(right: r)),
          const SizedBox(height: AppSpacing.xl),

          // ── Consent cards (3 SwitchListTile cards) ───────────────────────
          _SectionLabel(label: 'Consentimentos'),
          const SizedBox(height: AppSpacing.sm),

          // 1. Termos de Uso — switch disabled (always on)
          farmerAsync.when(
            loading: () => const SizedBox.shrink(),
            error: (_, __) => const SizedBox.shrink(),
            data: (farmer) => Column(
              children: [
                _ConsentCard(
                  title: 'Termos de Uso',
                  subtitle: farmer != null
                      ? 'Aceito em ${_formatDate(farmer.createdAt ?? DateTime.now())}'
                      : 'Aceito em —',
                  value: true,
                  disabled: true,
                  onChanged: null,
                ),
                const SizedBox(height: AppSpacing.sm),
                // 2. Política de Privacidade — switch disabled
                _ConsentCard(
                  title: 'Política de Privacidade',
                  subtitle: farmer != null
                      ? 'Aceito em ${_formatDate(farmer.createdAt ?? DateTime.now())}'
                      : 'Aceito em —',
                  value: true,
                  disabled: true,
                  onChanged: null,
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          // 3. Comunicações de Marketing — toggleable
          _ConsentCard(
            title: 'Comunicações de Marketing',
            subtitle: 'Receba promoções e novidades do iFarm',
            value: _marketingEnabled,
            disabled: false,
            onChanged: (v) => setState(() => _marketingEnabled = v),
          ),

          const SizedBox(height: AppSpacing.xl),

          // ── Storage usage card ───────────────────────────────────────────
          _SectionLabel(label: 'Uso do Armazenamento'),
          const SizedBox(height: AppSpacing.sm),
          _StorageCard(),

          const SizedBox(height: AppSpacing.xl),

          // ── Data portability ─────────────────────────────────────────────
          _SectionLabel(label: 'Seus Dados'),
          const SizedBox(height: AppSpacing.sm),

          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Exportar meus dados', style: AppTypography.titleMedium),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  'Receba um arquivo JSON e CSV com todos os seus dados pessoais '
                  'armazenados na plataforma iFarm.',
                  style: AppTypography.bodySmall,
                ),
                const SizedBox(height: AppSpacing.lg),
                IFarmButton(
                  label: 'Exportar meus dados',
                  variant: IFarmButtonVariant.outline,
                  isLoading: _isExporting,
                  icon: Icons.download_outlined,
                  onPressed: _exportData,
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.md),

          // ── "Zona de Risco" header in error color ────────────────────────
          Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.sm),
            child: Text(
              'Zona de Risco',
              style: AppTypography.titleSmall.copyWith(
                color: AppColors.error,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.8,
              ),
            ),
          ),

          _InfoCard(
            borderColor: AppColors.error.withValues(alpha: 0.3),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Excluir minha conta',
                    style: AppTypography.titleMedium
                        .copyWith(color: AppColors.error)),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  'Solicite a exclusão permanente de todos os seus dados. '
                  'Esta ação é irreversível e implica encerramento de contratos ativos.',
                  style: AppTypography.bodySmall,
                ),
                const SizedBox(height: AppSpacing.lg),
                IFarmButton(
                  label: 'Excluir minha conta',
                  variant: IFarmButtonVariant.danger,
                  icon: Icons.delete_forever_outlined,
                  onPressed: _showDeleteSheet,
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xxl),

          // ── Legal footer ─────────────────────────────────────────────────
          Text(
            'iFarm Tecnologia Ltda. • CNPJ 00.000.000/0001-00 • v1.0.0',
            style: TextStyle(
              color: AppColors.outline,
              fontSize: 10,
              fontWeight: FontWeight.w400,
            ),
            textAlign: TextAlign.center,
          ),

          const SizedBox(height: 60),
        ],
      ),
    );
  }

  String _formatDate(DateTime dt) {
    return '${dt.day.toString().padLeft(2, '0')}/'
        '${dt.month.toString().padLeft(2, '0')}/'
        '${dt.year} às '
        '${dt.hour.toString().padLeft(2, '0')}:'
        '${dt.minute.toString().padLeft(2, '0')}';
  }
}

// ---------------------------------------------------------------------------
// LGPD right data
// ---------------------------------------------------------------------------

class _LgpdRight {
  final IconData icon;
  final String title;
  final String description;
  const _LgpdRight(
      {required this.icon, required this.title, required this.description});
}

const _lgpdRights = [
  _LgpdRight(
    icon: Icons.visibility_outlined,
    title: 'Acesso',
    description:
        'Você tem o direito de acessar os dados pessoais que tratamos sobre você '
        'a qualquer momento, de forma gratuita.',
  ),
  _LgpdRight(
    icon: Icons.edit_outlined,
    title: 'Correção',
    description:
        'Caso seus dados estejam desatualizados, incompletos ou incorretos, '
        'você pode solicitar a correção a qualquer momento.',
  ),
  _LgpdRight(
    icon: Icons.delete_outline,
    title: 'Exclusão',
    description:
        'Você pode solicitar a exclusão de seus dados pessoais que foram '
        'tratados com base em seu consentimento.',
  ),
  _LgpdRight(
    icon: Icons.swap_horiz_outlined,
    title: 'Portabilidade',
    description:
        'Você tem direito a receber seus dados em formato estruturado '
        'e legível por máquina para transferência a outro fornecedor.',
  ),
  _LgpdRight(
    icon: Icons.block_outlined,
    title: 'Revogação de Consentimento',
    description:
        'Você pode revogar o consentimento dado para o tratamento de seus dados '
        'pessoais a qualquer momento, sem prejuízo à legalidade do tratamento anterior.',
  ),
];

// ---------------------------------------------------------------------------
// Consent card with SwitchListTile
// ---------------------------------------------------------------------------

class _ConsentCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool value;
  final bool disabled;
  final ValueChanged<bool>? onChanged;

  const _ConsentCard({
    required this.title,
    required this.subtitle,
    required this.value,
    required this.disabled,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        border: Border.all(
          color: AppColors.outlineVariant.withValues(alpha: 0.15),
        ),
        boxShadow: const [
          BoxShadow(
              color: AppColors.ambientShadow,
              blurRadius: 24,
              offset: Offset(0, 8)),
        ],
      ),
      child: SwitchListTile(
        title: Text(title, style: AppTypography.titleSmall),
        subtitle: Text(subtitle,
            style: AppTypography.bodySmall
                .copyWith(color: AppColors.textSecondary)),
        value: value,
        onChanged: disabled ? null : onChanged,
        activeThumbColor: AppColors.primary,
        activeTrackColor: AppColors.primaryFixed,
        contentPadding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.lg, vertical: AppSpacing.xs),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Storage usage card
// ---------------------------------------------------------------------------

class _StorageCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return _InfoCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'USO DO ARMAZENAMENTO',
            style: TextStyle(
              color: AppColors.outline,
              fontSize: 10,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          ClipRRect(
            borderRadius: BorderRadius.circular(AppSpacing.radiusXs),
            child: LinearProgressIndicator(
              value: 0.74,
              backgroundColor: AppColors.surfaceContainerHighest,
              valueColor:
                  const AlwaysStoppedAnimation<Color>(AppColors.primary),
              minHeight: 8,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            '3.7 GB de 5.0 GB utilizados',
            style: AppTypography.bodySmall
                .copyWith(color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Sub-widgets
// ---------------------------------------------------------------------------

class _SectionLabel extends StatelessWidget {
  final String label;
  const _SectionLabel({required this.label});

  @override
  Widget build(BuildContext context) {
    return Text(
      label,
      style: AppTypography.titleSmall
          .copyWith(color: AppColors.textSecondary, letterSpacing: 0.8),
    );
  }
}

class _InfoCard extends StatelessWidget {
  final Widget child;
  final Color? borderColor;
  const _InfoCard({required this.child, this.borderColor});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.lg),
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        border: borderColor != null
            ? Border.all(color: borderColor!)
            : Border.all(
                color: AppColors.outlineVariant.withValues(alpha: 0.15)),
        boxShadow: const [
          BoxShadow(
              color: AppColors.ambientShadow,
              blurRadius: 24,
              offset: Offset(0, 8)),
        ],
      ),
      child: child,
    );
  }
}

class _ExpandableRight extends StatefulWidget {
  final _LgpdRight right;
  const _ExpandableRight({required this.right});

  @override
  State<_ExpandableRight> createState() => _ExpandableRightState();
}

class _ExpandableRightState extends State<_ExpandableRight> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        border: Border.all(
          color: AppColors.outlineVariant.withValues(alpha: 0.15),
        ),
        boxShadow: const [
          BoxShadow(
              color: AppColors.ambientShadow,
              blurRadius: 24,
              offset: Offset(0, 8)),
        ],
      ),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          leading: Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AppColors.primaryFixed.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
            ),
            child: Icon(widget.right.icon,
                color: AppColors.primary, size: AppSpacing.iconMd),
          ),
          title: Text(widget.right.title, style: AppTypography.titleSmall),
          trailing: Icon(
            _expanded ? Icons.expand_less : Icons.expand_more,
            color: AppColors.textTertiary,
          ),
          onExpansionChanged: (v) => setState(() => _expanded = v),
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(
                  AppSpacing.lg, 0, AppSpacing.lg, AppSpacing.lg),
              child: Text(
                widget.right.description,
                style: AppTypography.bodySmall
                    .copyWith(color: AppColors.textSecondary, height: 1.6),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Export confirm dialog
// ---------------------------------------------------------------------------

class _ExportConfirmDialog extends StatelessWidget {
  final Map<String, dynamic> data;
  const _ExportConfirmDialog({required this.data});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: AppColors.surface,
      shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMd)),
      title: const Row(
        children: [
          Icon(Icons.check_circle_outline, color: AppColors.success),
          SizedBox(width: AppSpacing.sm),
          Text('Dados exportados', style: AppTypography.titleLarge),
        ],
      ),
      content: Text(
        'Seus dados foram preparados com sucesso.\n\n'
        'Em produção, os arquivos JSON e CSV seriam baixados '
        'ou enviados ao seu e-mail cadastrado.',
        style: AppTypography.bodyMedium
            .copyWith(color: AppColors.textSecondary),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('OK'),
        ),
      ],
    );
  }
}

// ---------------------------------------------------------------------------
// Delete account multi-step bottom sheet
// ---------------------------------------------------------------------------

class _DeleteAccountBottomSheet extends ConsumerStatefulWidget {
  final VoidCallback onDeleted;
  const _DeleteAccountBottomSheet({required this.onDeleted});

  @override
  ConsumerState<_DeleteAccountBottomSheet> createState() =>
      _DeleteAccountBottomSheetState();
}

class _DeleteAccountBottomSheetState
    extends ConsumerState<_DeleteAccountBottomSheet> {
  int _step = 1;
  final _reasonCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();
  bool _isDeleting = false;
  bool _confirmValid = false;

  static const _confirmWord = 'EXCLUIR';

  @override
  void initState() {
    super.initState();
    _confirmCtrl.addListener(() {
      final valid = _confirmCtrl.text.trim() == _confirmWord;
      if (valid != _confirmValid) setState(() => _confirmValid = valid);
    });
  }

  @override
  void dispose() {
    _reasonCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  Future<void> _deleteAccount() async {
    final farmerId = await SecureStorage.getFarmerId();
    if (farmerId == null) return;
    setState(() => _isDeleting = true);
    try {
      await ref.read(farmerRepositoryProvider).deleteAccount(farmerId);
      await SecureStorage.clearAll();
      if (mounted) {
        Navigator.of(context).pop();
        widget.onDeleted();
      }
    } catch (_) {
      if (mounted) {
        context.showSnackBar('Erro ao excluir conta. Tente novamente.',
            isError: true);
        setState(() => _isDeleting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final bottom = MediaQuery.of(context).viewInsets.bottom;

    return Padding(
      padding: EdgeInsets.only(bottom: bottom),
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.xxl),
          child: _step == 1 ? _buildStep1() : _buildStep2(),
        ),
      ),
    );
  }

  Widget _buildStep1() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _Handle(),
        const SizedBox(height: AppSpacing.md),
        Center(
          child: Container(
            width: 64,
            height: 64,
            decoration: const BoxDecoration(
              color: AppColors.errorContainer,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.warning_amber_rounded,
                color: AppColors.error, size: 36),
          ),
        ),
        const SizedBox(height: AppSpacing.lg),
        const Center(
          child: Text('Esta ação é IRREVERSÍVEL',
              style: AppTypography.headlineSmall, textAlign: TextAlign.center),
        ),
        const SizedBox(height: AppSpacing.sm),
        Text(
          'Ao excluir sua conta todos os seus dados, pedidos, cotações e '
          'histórico serão permanentemente removidos da plataforma iFarm.',
          style: AppTypography.bodyMedium
              .copyWith(color: AppColors.textSecondary),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: AppSpacing.xl),
        Text('Motivo (opcional)', style: AppTypography.titleSmall),
        const SizedBox(height: AppSpacing.sm),
        TextField(
          controller: _reasonCtrl,
          maxLines: 3,
          style: AppTypography.bodyMedium,
          decoration: InputDecoration(
            hintText: 'Conte-nos o motivo da exclusão…',
            hintStyle: AppTypography.bodyMedium
                .copyWith(color: AppColors.textTertiary),
            filled: true,
            fillColor: AppColors.surfaceContainerHigh,
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
          ),
        ),
        const SizedBox(height: AppSpacing.xxl),
        Row(
          children: [
            Expanded(
              child: IFarmButton(
                label: 'Cancelar',
                variant: IFarmButtonVariant.outline,
                onPressed: () => Navigator.of(context).pop(),
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: IFarmButton(
                label: 'Próximo',
                variant: IFarmButtonVariant.danger,
                onPressed: () => setState(() => _step = 2),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStep2() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _Handle(),
        const SizedBox(height: AppSpacing.md),
        Text('Confirme a exclusão', style: AppTypography.headlineSmall),
        const SizedBox(height: AppSpacing.sm),
        RichText(
          text: TextSpan(
            style: AppTypography.bodyMedium
                .copyWith(color: AppColors.textSecondary),
            children: const [
              TextSpan(text: 'Para confirmar, digite '),
              TextSpan(
                text: _confirmWord,
                style: TextStyle(
                    fontWeight: FontWeight.w700, color: AppColors.error),
              ),
              TextSpan(text: ' no campo abaixo:'),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.lg),
        TextField(
          controller: _confirmCtrl,
          style: AppTypography.bodyMedium,
          textCapitalization: TextCapitalization.characters,
          decoration: InputDecoration(
            hintText: _confirmWord,
            hintStyle: AppTypography.bodyMedium
                .copyWith(color: AppColors.textTertiary),
            filled: true,
            fillColor: AppColors.surfaceContainerHigh,
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
              borderSide: BorderSide(
                color: _confirmValid ? AppColors.error : AppColors.primary,
                width: 1.5,
              ),
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.xxl),
        Row(
          children: [
            Expanded(
              child: IFarmButton(
                label: 'Voltar',
                variant: IFarmButtonVariant.outline,
                onPressed: () => setState(() => _step = 1),
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: IFarmButton(
                label: 'Excluir conta',
                variant: IFarmButtonVariant.danger,
                isLoading: _isDeleting,
                onPressed: _confirmValid ? _deleteAccount : null,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _Handle extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        width: 40,
        height: 4,
        margin: const EdgeInsets.only(bottom: AppSpacing.lg),
        decoration: BoxDecoration(
          color: AppColors.outlineVariant,
          borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
        ),
      ),
    );
  }
}
