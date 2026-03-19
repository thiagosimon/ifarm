import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ifarm_mobile/l10n/app_localizations.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/router/app_router.dart';
import '../../core/utils/extensions.dart';
import '../../providers/notification_provider.dart';
import '../../widgets/ifarm_button.dart';

// ---------------------------------------------------------------------------
// Local prefs state — granular switches not covered by NotificationPrefsModel
// ---------------------------------------------------------------------------

class _NotifPrefs {
  final bool newQuotes;
  final bool proposalsReceived;
  final bool orderUpdates;
  final bool paymentConfirmations;

  const _NotifPrefs({
    this.newQuotes = true,
    this.proposalsReceived = true,
    this.orderUpdates = true,
    this.paymentConfirmations = true,
  });

  _NotifPrefs copyWith({
    bool? newQuotes,
    bool? proposalsReceived,
    bool? orderUpdates,
    bool? paymentConfirmations,
  }) {
    return _NotifPrefs(
      newQuotes: newQuotes ?? this.newQuotes,
      proposalsReceived: proposalsReceived ?? this.proposalsReceived,
      orderUpdates: orderUpdates ?? this.orderUpdates,
      paymentConfirmations: paymentConfirmations ?? this.paymentConfirmations,
    );
  }
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  _NotifPrefs _prefs = const _NotifPrefs();
  bool _isSaving = false;

  Future<void> _savePrefs() async {
    setState(() => _isSaving = true);
    try {
      await ref.read(notificationPrefsProvider.notifier).update({
        'isPushEnabled': _prefs.newQuotes ||
            _prefs.proposalsReceived ||
            _prefs.orderUpdates ||
            _prefs.paymentConfirmations,
        'isEmailEnabled': true,
      });
      if (mounted) context.showSnackBar('Preferências salvas!');
    } catch (_) {
      if (mounted) {
        context.showSnackBar('Erro ao salvar preferências.', isError: true);
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  Future<void> _showDeleteAccountSheet() async {
    await showModalBottomSheet<void>(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius:
            BorderRadius.vertical(top: Radius.circular(AppSpacing.radiusLg)),
      ),
      builder: (_) => _DeleteAccountPromptSheet(
        onContinue: () {
          Navigator.of(context).pop();
          context.push(Routes.privacyLgpd);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        centerTitle: false,
        title: Text(l.settingsTitle, style: AppTypography.headlineSmall),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          // ----------------------------------------------------------------
          // Notification Preferences
          // ----------------------------------------------------------------
          _SectionHeader(label: l.settingsNotifications),
          const SizedBox(height: AppSpacing.sm),
          _Card(
            children: [
              _SwitchTile(
                icon: Icons.request_quote_outlined,
                label: l.settingsQuoteAlerts,
                value: _prefs.newQuotes,
                onChanged: (v) =>
                    setState(() => _prefs = _prefs.copyWith(newQuotes: v)),
              ),
              _Divider(),
              _SwitchTile(
                icon: Icons.mark_email_read_outlined,
                label: 'Propostas recebidas',
                value: _prefs.proposalsReceived,
                onChanged: (v) => setState(
                    () => _prefs = _prefs.copyWith(proposalsReceived: v)),
              ),
              _Divider(),
              _SwitchTile(
                icon: Icons.local_shipping_outlined,
                label: l.settingsOrderAlerts,
                value: _prefs.orderUpdates,
                onChanged: (v) =>
                    setState(() => _prefs = _prefs.copyWith(orderUpdates: v)),
              ),
              _Divider(),
              _SwitchTile(
                icon: Icons.payments_outlined,
                label: 'Confirmações de pagamento',
                value: _prefs.paymentConfirmations,
                onChanged: (v) => setState(
                    () => _prefs = _prefs.copyWith(paymentConfirmations: v)),
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.xl),

          // ----------------------------------------------------------------
          // App
          // ----------------------------------------------------------------
          _SectionHeader(label: 'Aplicativo'),
          const SizedBox(height: AppSpacing.sm),
          _Card(
            children: [
              ListTile(
                leading: const Icon(Icons.info_outline,
                    color: AppColors.textSecondary, size: AppSpacing.iconLg),
                title: const Text('Versão do aplicativo',
                    style: AppTypography.bodyMedium),
                trailing: Text('1.0.0',
                    style: AppTypography.bodySmall
                        .copyWith(color: AppColors.textTertiary)),
              ),
              _Divider(),
              ListTile(
                leading: const Icon(Icons.privacy_tip_outlined,
                    color: AppColors.textSecondary, size: AppSpacing.iconLg),
                title: const Text('Política de Privacidade',
                    style: AppTypography.bodyMedium),
                trailing: const Icon(Icons.chevron_right,
                    color: AppColors.textTertiary),
                onTap: () => context.push(Routes.privacyLgpd),
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.xl),

          // ----------------------------------------------------------------
          // Account
          // ----------------------------------------------------------------
          _SectionHeader(label: 'Conta'),
          const SizedBox(height: AppSpacing.sm),
          _Card(
            children: [
              ListTile(
                leading: const Icon(Icons.download_outlined,
                    color: AppColors.textSecondary, size: AppSpacing.iconLg),
                title: const Text('Exportar meus dados',
                    style: AppTypography.bodyMedium),
                trailing: const Icon(Icons.chevron_right,
                    color: AppColors.textTertiary),
                onTap: () => context.push(Routes.privacyLgpd),
              ),
              _Divider(),
              ListTile(
                leading: const Icon(Icons.delete_outline,
                    color: AppColors.error, size: AppSpacing.iconLg),
                title: Text('Excluir conta',
                    style: AppTypography.bodyMedium
                        .copyWith(color: AppColors.error)),
                trailing: const Icon(Icons.chevron_right,
                    color: AppColors.textTertiary),
                onTap: _showDeleteAccountSheet,
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.xxl),

          IFarmButton(
            label: 'Salvar Preferências',
            isLoading: _isSaving,
            onPressed: _savePrefs,
          ),

          const SizedBox(height: 40),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Subwidgets
// ---------------------------------------------------------------------------

class _SectionHeader extends StatelessWidget {
  final String label;
  const _SectionHeader({required this.label});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.xs),
      child: Text(
        label,
        style: AppTypography.titleSmall
            .copyWith(color: AppColors.textSecondary, letterSpacing: 0.8),
      ),
    );
  }
}

class _Card extends StatelessWidget {
  final List<Widget> children;
  const _Card({required this.children});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        boxShadow: const [
          BoxShadow(
              color: AppColors.shadow, blurRadius: 8, offset: Offset(0, 2)),
        ],
      ),
      child: Column(children: children),
    );
  }
}

class _Divider extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const Divider(
        height: 1, indent: AppSpacing.lg + AppSpacing.iconLg + AppSpacing.md);
  }
}

class _SwitchTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool value;
  final ValueChanged<bool> onChanged;

  const _SwitchTile({
    required this.icon,
    required this.label,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return SwitchListTile(
      secondary:
          Icon(icon, color: AppColors.textSecondary, size: AppSpacing.iconLg),
      title: Text(label, style: AppTypography.bodyMedium),
      value: value,
      activeThumbColor: AppColors.primary,
      onChanged: onChanged,
    );
  }
}

// ---------------------------------------------------------------------------
// Delete account prompt sheet
// ---------------------------------------------------------------------------

class _DeleteAccountPromptSheet extends StatelessWidget {
  final VoidCallback onContinue;
  const _DeleteAccountPromptSheet({required this.onContinue});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xxl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(bottom: AppSpacing.xl),
              decoration: BoxDecoration(
                color: AppColors.border,
                borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
              ),
            ),
            Container(
              width: 64,
              height: 64,
              decoration: const BoxDecoration(
                color: AppColors.errorLight,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.warning_amber_rounded,
                  color: AppColors.error, size: 36),
            ),
            const SizedBox(height: AppSpacing.lg),
            const Text('Excluir conta',
                style: AppTypography.headlineSmall,
                textAlign: TextAlign.center),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'Para excluir sua conta acesse a seção Privacidade e LGPD. '
              'O processo é irreversível.',
              style: AppTypography.bodyMedium
                  .copyWith(color: AppColors.textSecondary),
              textAlign: TextAlign.center,
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
                    label: 'Continuar',
                    variant: IFarmButtonVariant.danger,
                    onPressed: onContinue,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
