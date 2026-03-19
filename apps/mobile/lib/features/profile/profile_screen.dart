import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/router/app_router.dart';
import '../../data/models/farmer_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/farmer_provider.dart';
import '../../widgets/status_badge.dart';
import '../../widgets/ifarm_button.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  Future<void> _showLogoutSheet(BuildContext context, WidgetRef ref) async {
    await showModalBottomSheet<void>(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
            top: Radius.circular(AppSpacing.radiusLg)),
      ),
      builder: (ctx) => _LogoutBottomSheet(
        onConfirm: () async {
          Navigator.of(ctx).pop();
          await ref.read(authNotifierProvider.notifier).logout();
          if (context.mounted) context.go(Routes.welcome);
        },
        onCancel: () => Navigator.of(ctx).pop(),
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final farmerAsync = ref.watch(currentFarmerProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: farmerAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
        error: (e, _) => Center(
          child: Text(
            'Erro ao carregar perfil.',
            style: AppTypography.bodyMedium
                .copyWith(color: AppColors.textSecondary),
          ),
        ),
        data: (farmer) => RefreshIndicator(
          color: AppColors.primary,
          onRefresh: () async => ref.invalidate(currentFarmerProvider),
          child: CustomScrollView(
            slivers: [
              // ── Profile header ──────────────────────────────────────────
              SliverToBoxAdapter(child: _ProfileHeader(farmer: farmer)),

              if (farmer != null) ...[
                // ── Stats row ─────────────────────────────────────────────
                SliverToBoxAdapter(child: _StatsRow(farmer: farmer)),
                const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.lg)),

                // ── Harvest goal card ─────────────────────────────────────
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.lg),
                    child: _HarvestGoalCard(),
                  ),
                ),
                const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.lg)),
              ],

              // ── "Minha Conta" section ────────────────────────────────────
              SliverToBoxAdapter(
                child: _SectionTitle(label: 'Minha Conta'),
              ),
              SliverToBoxAdapter(
                child: _MenuCard(
                  items: [
                    _MenuItem(
                      icon: Icons.edit_outlined,
                      label: 'Editar Perfil',
                      onTap: () => context.push(Routes.editProfile),
                    ),
                    _MenuItem(
                      icon: Icons.payments_outlined,
                      label: 'Pagamento',
                      onTap: () {},
                    ),
                    _MenuItem(
                      icon: Icons.notifications_outlined,
                      label: 'Notificações',
                      onTap: () => context.push(Routes.notifications),
                    ),
                    _MenuItem(
                      icon: Icons.settings_outlined,
                      label: 'Configurações',
                      onTap: () => context.push(Routes.settings),
                    ),
                    _MenuItem(
                      icon: Icons.privacy_tip_outlined,
                      label: 'Privacidade e LGPD',
                      onTap: () => context.push(Routes.privacyLgpd),
                    ),
                    _MenuItem(
                      icon: Icons.help_outline,
                      label: 'Ajuda',
                      onTap: () {},
                    ),
                  ],
                ),
              ),

              // ── "Segurança" section ──────────────────────────────────────
              SliverToBoxAdapter(
                child: _SectionTitle(label: 'Segurança'),
              ),
              SliverToBoxAdapter(
                child: _MenuCard(
                  items: [
                    _MenuItem(
                      icon: Icons.logout,
                      label: 'Sair',
                      iconColor: AppColors.error,
                      labelColor: AppColors.error,
                      onTap: () => _showLogoutSheet(context, ref),
                    ),
                  ],
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: 100)),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Profile Header ───────────────────────────────────────────────────────────

class _ProfileHeader extends StatelessWidget {
  final FarmerModel? farmer;
  const _ProfileHeader({required this.farmer});

  String _initials(String name) {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
    }
    return name.isNotEmpty ? name[0].toUpperCase() : '?';
  }

  @override
  Widget build(BuildContext context) {
    // FarmerModel does not expose photoUrl; always use gradient + initials
    const String? photoUrl = null;
    final name = farmer?.fullName ?? 'Agricultor';

    return Container(
      padding: const EdgeInsets.fromLTRB(
          AppSpacing.lg, 56, AppSpacing.lg, AppSpacing.xl),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppColors.primaryDark, AppColors.primary, AppColors.primaryContainer],
        ),
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(28)),
      ),
      child: Column(
        children: [
          // CircleAvatar 112px
          CircleAvatar(
            radius: 56,
            backgroundColor: Colors.white.withValues(alpha: 0.2),
            backgroundImage: photoUrl != null ? NetworkImage(photoUrl) : null,
            child: photoUrl == null
                ? Text(
                    _initials(name),
                    style: AppTypography.headlineLarge.copyWith(
                        color: Colors.white, fontWeight: FontWeight.w700),
                  )
                : null,
          ),
          const SizedBox(height: AppSpacing.md),
          Text(
            name,
            style: AppTypography.headlineMedium.copyWith(color: Colors.white),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            farmer?.email ?? '',
            style: AppTypography.bodySmall.copyWith(color: Colors.white70),
          ),
          if (farmer != null) ...[
            const SizedBox(height: AppSpacing.md),
            KycStatusBadge(status: farmer!.kycStatus),
          ],
        ],
      ),
    );
  }
}

// ─── Stats Row: Patrimônio + Cotações N + Pedidos N ──────────────────────────

class _StatsRow extends StatelessWidget {
  final FarmerModel farmer;
  const _StatsRow({required this.farmer});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(
          AppSpacing.lg, AppSpacing.xl, AppSpacing.lg, 0),
      padding: const EdgeInsets.symmetric(
          vertical: AppSpacing.lg, horizontal: AppSpacing.md),
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
      child: Row(
        children: [
          _StatItem(value: 'R\$ 1,2M', label: 'Patrimônio'),
          _VerticalDivider(),
          _StatItem(value: '42', label: 'Cotações'),
          _VerticalDivider(),
          _StatItem(value: '8', label: 'Pedidos'),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String value;
  final String label;
  const _StatItem({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        children: [
          Text(
            value,
            style: AppTypography.headlineSmall.copyWith(color: AppColors.primary),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 2),
          Text(label,
              style: AppTypography.bodySmall, textAlign: TextAlign.center),
        ],
      ),
    );
  }
}

class _VerticalDivider extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(width: 1, height: 36, color: AppColors.outlineVariant);
  }
}

// ─── Harvest Goal Card ────────────────────────────────────────────────────────

class _HarvestGoalCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.xl),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        border: Border.all(
          // ghost border at 15% opacity
          color: AppColors.outlineVariant.withValues(alpha: 0.15),
        ),
        boxShadow: const [
          BoxShadow(
              color: AppColors.ambientShadow,
              blurRadius: 24,
              offset: Offset(0, 8)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // "META DA SAFRA" 10px uppercase w700 outline
          Text(
            'META DA SAFRA',
            style: TextStyle(
              color: AppColors.outline,
              fontSize: 10,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          // "2.400 Sacas" 24px w700 onSurface
          Text(
            '2.400 Sacas',
            style: AppTypography.headlineSmall.copyWith(
              fontSize: 24,
              fontWeight: FontWeight.w700,
              color: AppColors.onSurface,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          // Progress bar 8px height, 8px radius clip
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: 0.85,
              backgroundColor: AppColors.surfaceContainerHighest,
              valueColor:
                  const AlwaysStoppedAnimation<Color>(AppColors.primary),
              minHeight: 8,
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          // "85% atingido" right-aligned 12px outline
          Align(
            alignment: Alignment.centerRight,
            child: Text(
              '85% atingido',
              style: TextStyle(
                color: AppColors.outline,
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Menu helpers ─────────────────────────────────────────────────────────────

class _SectionTitle extends StatelessWidget {
  final String label;
  const _SectionTitle({required this.label});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(
          AppSpacing.lg, AppSpacing.xl, AppSpacing.lg, AppSpacing.sm),
      child: Text(
        label,
        style: AppTypography.titleSmall
            .copyWith(color: AppColors.textSecondary, letterSpacing: 0.8),
      ),
    );
  }
}

class _MenuItem {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Color? iconColor;
  final Color? labelColor;
  const _MenuItem({
    required this.icon,
    required this.label,
    required this.onTap,
    this.iconColor,
    this.labelColor,
  });
}

class _MenuCard extends StatelessWidget {
  final List<_MenuItem> items;
  const _MenuCard({required this.items});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
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
      child: Column(
        children: List.generate(items.length, (i) {
          final item = items[i];
          return Column(
            children: [
              ListTile(
                leading: Icon(item.icon,
                    color: item.iconColor ?? AppColors.textSecondary,
                    size: AppSpacing.iconLg),
                title: Text(
                  item.label,
                  style: AppTypography.bodyMedium.copyWith(
                    color: item.labelColor ?? AppColors.textPrimary,
                  ),
                ),
                trailing: const Icon(Icons.chevron_right,
                    color: AppColors.textTertiary),
                onTap: item.onTap,
              ),
              if (i < items.length - 1)
                Divider(
                  height: 1,
                  indent: AppSpacing.lg + AppSpacing.iconLg + AppSpacing.md,
                  color: AppColors.surfaceContainerLow,
                ),
            ],
          );
        }),
      ),
    );
  }
}

// ─── Logout Bottom Sheet ──────────────────────────────────────────────────────

class _LogoutBottomSheet extends StatelessWidget {
  final VoidCallback onConfirm;
  final VoidCallback onCancel;

  const _LogoutBottomSheet({required this.onConfirm, required this.onCancel});

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
                color: AppColors.outlineVariant,
                borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
              ),
            ),
            Container(
              width: 64,
              height: 64,
              decoration: const BoxDecoration(
                color: AppColors.errorContainer,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.logout, color: AppColors.error, size: 32),
            ),
            const SizedBox(height: AppSpacing.lg),
            const Text('Deseja sair da conta?',
                style: AppTypography.headlineSmall,
                textAlign: TextAlign.center),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'Você precisará fazer login novamente para acessar o iFarm.',
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
                    onPressed: onCancel,
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: IFarmButton(
                    label: 'Sair',
                    variant: IFarmButtonVariant.danger,
                    onPressed: onConfirm,
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
