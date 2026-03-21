import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ifarm_mobile/l10n/app_localizations.dart';
import '../../core/theme/app_colors.dart';
import '../../core/router/app_router.dart';
import '../../providers/guest_provider.dart';

class _SlideData {
  final String imageUrl;
  final String headline;
  final String subtitle;
  const _SlideData({
    required this.imageUrl,
    required this.headline,
    required this.subtitle,
  });
}

const _slides = [
  _SlideData(
    imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD6IUSruWOLsVX65COISvy4nGzU4Vp5TXTRIsc6sbre_Dghf7rB1h4cmyI_MVizzE8SojBEz_Nrm0FC7OgcqElp5IcPA1XXq2-fJauP1qq3z7gTt_yAaDary3pJeWKhPkdpTo6BisWPlEUxMLz4Yofld3Bu1r46UZ6HkMupx1vGn_iomoLG5xciRYhaRwLdymm2CR8vSk3iIEn_UM7SONQsxP96OVA3wV85gTOxGkbuy43kLxhKAesCFzC7NumaIVuFFKBL5xM4xI6k',
    headline: '',
    subtitle: '',
  ),
  _SlideData(
    imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ_yzrM14GeS6x3eUS0TlAuALQpeGjRvs3NDtTNdiAgRT0fzPGzNEpFDrhezJCFxowRv_WnQQrvh4ZUivBFV42xPlKwjlqXwHu43BLQPGJL1HFJEr7tZ2Hv5XtbnlvcGaxnyvGeA4_0L7Bc0PxOrYpLOwTUXKp-pf8VXzxl3EG-CqSzltoH7C5RczsY3RwAqF9DQIPskL_IlzawJCbA7UeuUw8psTUA2tKmH-3oesyeD53Wa2gpXrSwVNUHcS4sYbKZhkSOhjLSm2o',
    headline: '',
    subtitle: '',
  ),
  _SlideData(
    imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDFPI01OtP7ibugBydiTz9ge4nLpM9JOo677gu1hTa7updaXZIom1Cs9LyKEM6UzK82dcaI_ZmOGkC2Z43qsgvxQAtGGssfmKuO-H-6xduaQQ_ddl1gVCSWT6uHJzv97-GAPAEz0zxIbok4J4wFZhyle9DBo74c_82cl5vtbKmnNOg9OjFHlg-8PY6bJg8w-8JLKV2GTKPKcW51yLIGai0EfvxesjnX37PciXwGEV_13pdo4idF5QhopRBGAddIi5zFBevhwGWgSJ4j',
    headline: '',
    subtitle: '',
  ),
];

class WelcomeScreen extends ConsumerStatefulWidget {
  const WelcomeScreen({super.key});

  @override
  ConsumerState<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends ConsumerState<WelcomeScreen> {
  final _pageController = PageController();
  int _currentPage = 0;

  void _enterGuestMode() {
    ref.read(guestModeProvider.notifier).state = true;
    context.go(Routes.home);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      child: Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // ── Carousel ────────────────────────────────────────────────────
          PageView.builder(
            controller: _pageController,
            onPageChanged: (i) => setState(() => _currentPage = i),
            itemCount: _slides.length,
            itemBuilder: (context, i) {
              final l = AppLocalizations.of(context)!;
              final titles = [
                l.welcomeSlideTitle1,
                l.welcomeSlideTitle2,
                l.welcomeSlideTitle3,
              ];
              final descs = [
                l.welcomeSlideDesc1,
                l.welcomeSlideDesc2,
                l.welcomeSlideDesc3,
              ];
              return _SlideView(
                slide: _slides[i],
                headline: titles[i],
                subtitle: descs[i],
              );
            },
          ),

          // ── Top brand bar ────────────────────────────────────────────────
          const Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: SafeArea(
              child: Padding(
                padding:
                    EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                child: Row(
                  children: [
                    Icon(Icons.agriculture,
                        color: Colors.white, size: 28),
                    SizedBox(width: 8),
                    Text(
                      'iFarm',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 22,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        letterSpacing: -2,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // ── Bottom controls ──────────────────────────────────────────────
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: _BottomControls(
              currentPage: _currentPage,
              totalPages: _slides.length,
              onCreateAccount: () => context.go(Routes.register),
              onLogin: () => context.go(Routes.login),
              onExplore: _enterGuestMode,
            ),
          ),
        ],
      ),
    ),
    );
  }
}

class _SlideView extends StatelessWidget {
  final _SlideData slide;
  final String headline;
  final String subtitle;
  const _SlideView(
      {required this.slide, required this.headline, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        Image.network(
          slide.imageUrl,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) =>
              Container(color: AppColors.primaryContainer),
        ),
        const DecoratedBox(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color(0x99000000),
                Color(0x80000000),
                Color(0xDD000000),
              ],
              stops: [0.0, 0.45, 1.0],
            ),
          ),
        ),
        Positioned(
          left: 24,
          right: 24,
          bottom: 300,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                headline,
                style: const TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 36,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                  letterSpacing: -1,
                  height: 1.15,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                subtitle,
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 18,
                  fontWeight: FontWeight.w400,
                  color: Colors.white.withValues(alpha: 0.80),
                  height: 1.5,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _BottomControls extends StatelessWidget {
  final int currentPage;
  final int totalPages;
  final VoidCallback onCreateAccount;
  final VoidCallback onLogin;
  final VoidCallback onExplore;

  const _BottomControls({
    required this.currentPage,
    required this.totalPages,
    required this.onCreateAccount,
    required this.onLogin,
    required this.onExplore,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.bottomCenter,
          end: Alignment.topCenter,
          colors: [Color(0xF0000000), Colors.transparent],
          stops: [0.0, 1.0],
        ),
      ),
      padding: const EdgeInsets.fromLTRB(24, 32, 24, 0),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // ── Dot indicators ───────────────────────────────────────────
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(totalPages, (i) {
                final isActive = i == currentPage;
                return AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  curve: Curves.easeInOut,
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: isActive ? 32 : 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: isActive
                        ? AppColors.secondary
                        : Colors.white.withValues(alpha: 0.40),
                    borderRadius: BorderRadius.circular(999),
                  ),
                );
              }),
            ),
            const SizedBox(height: 24),

            // ── Criar conta (primary) ─────────────────────────────────────
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: onCreateAccount,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Criar conta grátis',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 10),

            // ── Entrar (secondary) ────────────────────────────────────────
            SizedBox(
              width: double.infinity,
              height: 48,
              child: OutlinedButton(
                onPressed: onLogin,
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.white,
                  side: BorderSide(
                    color: Colors.white.withValues(alpha: 0.35),
                    width: 1,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Entrar',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // ── Explorar sem cadastro (ghost link) ────────────────────────
            GestureDetector(
              onTap: onExplore,
              behavior: HitTestBehavior.opaque,
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 6),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Explorar sem cadastro',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: Colors.white.withValues(alpha: 0.55),
                      ),
                    ),
                    const SizedBox(width: 4),
                    Icon(
                      Icons.arrow_forward,
                      size: 13,
                      color: Colors.white.withValues(alpha: 0.55),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }
}
