import 'package:flutter/material.dart';

/// iFarm Design System — "The Agrarian Editorial"
/// Creative North Star: "The Digital Estate" — Organic Precision
/// Colors sourced directly from Stitch project (projects/16113075432093075811)
class AppColors {
  AppColors._();

  // ─── Material Color Scheme (Stitch exact tokens) ──────────────────────────

  /// "Fertile Earth" — Primary brand, high-importance CTAs
  static const Color primary = Color(0xFF005129);
  static const Color onPrimary = Color(0xFFFFFFFF);
  static const Color primaryContainer = Color(0xFF1A6B3C);
  static const Color onPrimaryContainer = Color(0xFF9AE9AE);

  static const Color primaryFixed = Color(0xFFA5F4B8);
  static const Color primaryFixedDim = Color(0xFF89D89E);
  static const Color onPrimaryFixed = Color(0xFF00210D);
  static const Color onPrimaryFixedVariant = Color(0xFF005229);

  /// "Golden Harvest" — Used sparingly for highlights & premium features
  static const Color secondary = Color(0xFF795900);
  static const Color onSecondary = Color(0xFFFFFFFF);
  static const Color secondaryContainer = Color(0xFFFFC641);
  static const Color onSecondaryContainer = Color(0xFF715300);

  static const Color secondaryFixed = Color(0xFFFFDFA0);
  static const Color secondaryFixedDim = Color(0xFFF6BE39);
  static const Color onSecondaryFixed = Color(0xFF261A00);
  static const Color onSecondaryFixedVariant = Color(0xFF5C4300);

  static const Color tertiary = Color(0xFF782C38);
  static const Color onTertiary = Color(0xFFFFFFFF);
  static const Color tertiaryContainer = Color(0xFF96434F);
  static const Color onTertiaryContainer = Color(0xFFFFCACE);

  static const Color tertiaryFixed = Color(0xFFFFD9DC);
  static const Color tertiaryFixedDim = Color(0xFFFFB2B9);
  static const Color onTertiaryFixed = Color(0xFF3F0110);
  static const Color onTertiaryFixedVariant = Color(0xFF792D39);

  // ─── Surface Hierarchy (Tonal Layering — no border lines) ─────────────────
  /// Base background — cool airy neutral
  static const Color surface = Color(0xFFF7F9FB);
  static const Color surfaceBright = Color(0xFFF7F9FB);
  static const Color surfaceDim = Color(0xFFD8DADC);
  static const Color onSurface = Color(0xFF191C1E); // Never pure black
  static const Color onSurfaceVariant = Color(0xFF404940);

  /// Use background shifts instead of dividers
  static const Color surfaceContainerLowest = Color(0xFFFFFFFF); // Interactive cards
  static const Color surfaceContainerLow = Color(0xFFF2F4F6);    // Section backgrounds
  static const Color surfaceContainer = Color(0xFFECEEF0);       // General containers
  static const Color surfaceContainerHigh = Color(0xFFE6E8EA);   // Input fields
  static const Color surfaceContainerHighest = Color(0xFFE0E3E5); // Growth meter track

  static const Color background = Color(0xFFF7F9FB);
  static const Color surfaceVariant = Color(0xFFE0E3E5);
  static const Color surfaceTint = Color(0xFF1B6C3D);

  // ─── Outline (Ghost borders — use at 15% opacity max) ─────────────────────
  static const Color outline = Color(0xFF707A70);
  static const Color outlineVariant = Color(0xFFBFC9BE);

  // ─── Error ────────────────────────────────────────────────────────────────
  /// Reserve for critical failures only — NOT for warnings (use secondary/gold)
  static const Color error = Color(0xFFBA1A1A);
  static const Color onError = Color(0xFFFFFFFF);
  static const Color errorContainer = Color(0xFFFFDAD6);
  static const Color onErrorContainer = Color(0xFF93000A);

  // ─── Inverse ──────────────────────────────────────────────────────────────
  static const Color inverseSurface = Color(0xFF2D3133);
  static const Color inverseOnSurface = Color(0xFFEFF1F3);
  static const Color inversePrimary = Color(0xFF89D89E);

  // ─── Ambient Shadow (green-tinted canopy light) ───────────────────────────
  /// Use: y:8, blur:24 — rgba(0, 81, 41, 0.08)
  static const Color ambientShadow = Color(0x14005129);    // 8% opacity
  static const Color ambientShadowStrong = Color(0x26005129); // 15% opacity

  // ─── Semantic Status Colors ───────────────────────────────────────────────
  // Quote statuses
  static const Color statusOpen = Color(0xFF3B82F6);
  static const Color statusProposals = Color(0xFF795900);   // secondary/gold
  static const Color statusAccepted = Color(0xFF005129);    // primary green
  static const Color statusExpired = Color(0xFF707A70);     // outline
  static const Color statusCancelled = Color(0xFFBA1A1A);  // error

  // Order statuses
  static const Color statusAwaitingPayment = Color(0xFF795900);
  static const Color statusPaid = Color(0xFF005129);
  static const Color statusDispatched = Color(0xFF782C38);  // tertiary
  static const Color statusDelivered = Color(0xFF005129);
  static const Color statusDisputed = Color(0xFFBA1A1A);

  // KYC statuses
  static const Color kycPending = Color(0xFF795900);
  static const Color kycApproved = Color(0xFF005129);
  static const Color kycRejected = Color(0xFFBA1A1A);

  // Notification type icons
  static const Color notificationProposal = Color(0xFF795900);  // gold
  static const Color notificationPayment = Color(0xFF005129);   // primary
  static const Color notificationDelivery = Color(0xFF1A6B3C);  // primary-container
  static const Color notificationKyc = Color(0xFF3B82F6);       // info blue

  // ─── Convenience aliases for legacy code ──────────────────────────────────
  static const Color textPrimary = onSurface;
  static const Color textSecondary = onSurfaceVariant;
  static const Color textTertiary = outline;
  static const Color textInverted = onPrimary;
  static const Color border = outlineVariant;
  static const Color divider = surfaceContainerLow;
  static const Color shadow = ambientShadow;
  static const Color shadowMedium = ambientShadowStrong;

  // Keep for backward compat
  static const Color success = primary;
  static const Color successLight = primaryFixed;
  static const Color warning = secondary;
  static const Color warningLight = secondaryFixed;
  static const Color info = Color(0xFF3B82F6);
  static const Color infoLight = Color(0xFFDEEBFF);

  // Legacy aliases used by older screens
  static const Color primaryLight = primaryFixed;        // #A5F4B8
  static const Color primaryDark = Color(0xFF003D1E);   // deeper green
  static const Color secondaryDark = Color(0xFF5C4300); // onSecondaryFixedVariant
  static const Color errorLight = errorContainer;        // #FFDAD6
}
