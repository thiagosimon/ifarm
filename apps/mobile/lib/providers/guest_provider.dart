import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Controls whether the current session is in guest (unauthenticated browse) mode.
/// Resets to false on every cold start — guests are asked to register again on next open.
final guestModeProvider = StateProvider<bool>((ref) => false);
