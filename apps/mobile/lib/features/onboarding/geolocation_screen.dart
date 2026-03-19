import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';
import 'package:ifarm_mobile/l10n/app_localizations.dart';
import '../../core/router/app_router.dart';

/// Geolocation permission rationale screen.
/// Required by Google Play & App Store for apps that use location services.
/// Shown after login or registration, before navigating to Home,
/// only when location permission has NOT yet been granted.
class GeolocationScreen extends ConsumerStatefulWidget {
  const GeolocationScreen({super.key});

  @override
  ConsumerState<GeolocationScreen> createState() => _GeolocationScreenState();
}

class _GeolocationScreenState extends ConsumerState<GeolocationScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;
  bool _isRequesting = false;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  Future<void> _requestPermission() async {
    if (_isRequesting) return;
    setState(() => _isRequesting = true);

    try {
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        // Location services disabled — still navigate to Home
        if (mounted) context.go(Routes.home);
        return;
      }

      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }

      // Regardless of result (granted, denied, deniedForever), go Home
      if (mounted) context.go(Routes.home);
    } catch (_) {
      if (mounted) context.go(Routes.home);
    }
  }

  void _skipPermission() {
    context.go(Routes.home);
  }

  // ─── Dark theme colors (from Stitch design token map) ───────────────────
  static const _surface = Color(0xFF101415);
  static const _onSurface = Color(0xFFE0E3E5);
  static const _onSurfaceVariant = Color(0xFFBFC9BE);
  static const _secondary = Color(0xFFF6BE39);
  static const _primaryContainer = Color(0xFF1A6B3C);
  static const _onPrimaryContainer = Color(0xFF9AE9AE);
  static const _primaryFixed = Color(0xFFA5F4B8);
  static const _surfaceContainerHigh = Color(0xFF272A2C);

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context)!;

    return Scaffold(
      backgroundColor: _surface,
      body: Stack(
        children: [
          // ─── Background gradient (mimics image overlay from design) ──────
          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    const Color(0xFF1A2E1A).withValues(alpha: 0.6),
                    _surface.withValues(alpha: 0.8),
                    _surface,
                  ],
                  stops: const [0.0, 0.35, 0.55],
                ),
              ),
            ),
          ),

          // ─── Content ────────────────────────────────────────────────────
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Column(
                children: [
                  const Spacer(flex: 3),

                  // ─── Icon cluster with pulse ─────────────────────────────
                  _buildIconCluster(),

                  const SizedBox(height: 40),

                  // ─── Title ───────────────────────────────────────────────
                  Text(
                    l.geoTitle,
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                      letterSpacing: -0.5,
                      height: 1.2,
                    ),
                    textAlign: TextAlign.center,
                  ),

                  const SizedBox(height: 16),

                  // ─── Description with highlighted text ───────────────────
                  _buildDescription(l),

                  const Spacer(flex: 2),

                  // ─── Primary CTA (Permitir Localização) ──────────────────
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: _isRequesting ? null : _requestPermission,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _primaryContainer,
                        foregroundColor: _onPrimaryContainer,
                        disabledBackgroundColor:
                            _primaryContainer.withValues(alpha: 0.5),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        elevation: 8,
                        shadowColor:
                            _primaryContainer.withValues(alpha: 0.3),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          if (_isRequesting)
                            const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: _onPrimaryContainer,
                              ),
                            )
                          else ...[
                            const Icon(Icons.near_me, size: 20),
                            const SizedBox(width: 12),
                            Text(
                              l.geoAllow,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // ─── Secondary CTA (Agora não) ──────────────────────────
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: TextButton(
                      onPressed: _isRequesting ? null : _skipPermission,
                      style: TextButton.styleFrom(
                        foregroundColor: _onSurfaceVariant,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        l.geoSkip,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 32),

                  // ─── Trust indicator ─────────────────────────────────────
                  Opacity(
                    opacity: 0.6,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.lock, size: 12, color: _onSurface),
                        const SizedBox(width: 8),
                        Text(
                          l.geoPrivacy,
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 2.0,
                            color: _onSurface,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 48),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIconCluster() {
    return SizedBox(
      width: 112,
      height: 112,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Glow background
          Container(
            width: 112,
            height: 112,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: _secondary.withValues(alpha: 0.2),
                  blurRadius: 48,
                  spreadRadius: 16,
                ),
              ],
            ),
          ),
          // Pulse ring
          AnimatedBuilder(
            animation: _pulseController,
            builder: (context, child) {
              return Container(
                width: 108 + (_pulseController.value * 8),
                height: 108 + (_pulseController.value * 8),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: _secondary.withValues(
                        alpha: 0.3 * (1 - _pulseController.value)),
                    width: 1,
                  ),
                ),
              );
            },
          ),
          // Main icon circle
          Container(
            width: 96,
            height: 96,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: _surfaceContainerHigh.withValues(alpha: 0.6),
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.1),
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.3),
                  blurRadius: 24,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: const Icon(
              Icons.location_on,
              size: 48,
              color: _secondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDescription(AppLocalizations l) {
    return Text.rich(
      TextSpan(
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: _onSurfaceVariant,
          height: 1.5,
        ),
        children: [
          TextSpan(text: l.geoDescPart1),
          TextSpan(
            text: l.geoDescHighlight1,
            style: const TextStyle(color: _primaryFixed),
          ),
          TextSpan(text: l.geoDescPart2),
          TextSpan(
            text: l.geoDescHighlight2,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w600,
            ),
          ),
          TextSpan(text: l.geoDescPart3),
        ],
      ),
      textAlign: TextAlign.center,
    );
  }
}

/// Checks if the app should show the geolocation permission screen.
/// Returns true if location permission is NOT yet granted.
Future<bool> shouldShowGeolocationScreen() async {
  try {
    final permission = await Geolocator.checkPermission();
    return permission == LocationPermission.denied ||
        permission == LocationPermission.deniedForever;
  } catch (_) {
    return false;
  }
}
