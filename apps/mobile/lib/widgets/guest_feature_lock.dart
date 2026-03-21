import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../core/router/app_router.dart';
import '../providers/guest_provider.dart';

/// Full-screen paywall shown to guest users when they try to access a
/// feature that requires an account. Renders a branded hero + CTA card.
class GuestFeatureLock extends ConsumerWidget {
  final IconData icon;
  final String title;
  final String description;

  const GuestFeatureLock({
    super.key,
    required this.icon,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final screenH = MediaQuery.of(context).size.height;

    return Scaffold(
      backgroundColor: const Color(0xFFF7F9FB),
      body: Column(
        children: [
          // ── Branded hero ─────────────────────────────────────────────────
          SizedBox(
            height: screenH * 0.38,
            width: double.infinity,
            child: Stack(
              fit: StackFit.expand,
              children: [
                // Gradient background
                Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [Color(0xFF003D1E), Color(0xFF1A6B3C)],
                    ),
                  ),
                ),
                // Decorative circles
                Positioned(
                  top: -40,
                  right: -40,
                  child: Container(
                    width: 180,
                    height: 180,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white.withValues(alpha: 0.05),
                    ),
                  ),
                ),
                Positioned(
                  bottom: -20,
                  left: -20,
                  child: Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white.withValues(alpha: 0.05),
                    ),
                  ),
                ),
                // Icon centred
                Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 88,
                        height: 88,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white.withValues(alpha: 0.15),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.25),
                            width: 1.5,
                          ),
                        ),
                        child: Icon(icon, color: Colors.white, size: 44),
                      ),
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 5,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(99),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.30),
                          ),
                        ),
                        child: const Text(
                          'RECURSO EXCLUSIVO',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                            letterSpacing: 1.5,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // ── Content card ─────────────────────────────────────────────────
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(24, 32, 24, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    title,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF191C1E),
                      height: 1.2,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    description,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 15,
                      color: Color(0xFF404940),
                      height: 1.6,
                    ),
                  ),
                  const SizedBox(height: 32),

                  // ── Benefit chips ─────────────────────────────────────────
                  const Row(
                    children: [
                      _BenefitChip(
                          icon: Icons.bolt_outlined, label: 'Gratuito'),
                      SizedBox(width: 8),
                      _BenefitChip(
                          icon: Icons.timer_outlined, label: '2 min'),
                      SizedBox(width: 8),
                      _BenefitChip(
                          icon: Icons.lock_open_outlined, label: 'Acesso total'),
                    ],
                  ),
                  const SizedBox(height: 28),

                  // ── Primary CTA ───────────────────────────────────────────
                  Container(
                    height: 54,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF005129), Color(0xFF1A6B3C)],
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                      ),
                      borderRadius: BorderRadius.circular(14),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF005129).withValues(alpha: 0.30),
                          blurRadius: 16,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: () => context.push(Routes.register),
                        borderRadius: BorderRadius.circular(14),
                        child: const Center(
                          child: Text(
                            'Criar conta grátis',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                              letterSpacing: 0.2,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),

                  // ── Secondary CTA ─────────────────────────────────────────
                  SizedBox(
                    height: 48,
                    child: OutlinedButton(
                      onPressed: () => context.push(Routes.login),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFF005129),
                        side: const BorderSide(
                            color: Color(0xFF005129), width: 1.5),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: const Text(
                        'Já tenho conta',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // ── Skip back to browsing ─────────────────────────────────
                  Center(
                    child: TextButton(
                      onPressed: () {
                        ref.read(guestModeProvider.notifier).state = true;
                        context.go(Routes.home);
                      },
                      style: TextButton.styleFrom(
                        foregroundColor: const Color(0xFF707A70),
                      ),
                      child: const Text(
                        'Continuar explorando',
                        style: TextStyle(fontSize: 13),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _BenefitChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _BenefitChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: const Color(0xFFE8F5EE),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Column(
          children: [
            Icon(icon, size: 18, color: const Color(0xFF005129)),
            const SizedBox(height: 4),
            Text(
              label,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: Color(0xFF005129),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
