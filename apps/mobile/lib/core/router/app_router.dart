import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../features/splash/splash_screen.dart';
import '../../features/onboarding/welcome_screen.dart';
import '../../features/onboarding/login_screen.dart';
import '../../features/onboarding/registration_screen.dart';
import '../../features/kyc/kyc_hub_screen.dart';
import '../../features/home/home_screen.dart';
import '../../features/catalog/product_search_screen.dart';
import '../../features/catalog/product_detail_screen.dart';
import '../../features/quotation/quote_builder_screen.dart';
import '../../features/quotation/my_quotes_screen.dart';
import '../../features/quotation/quote_detail_screen.dart';
import '../../features/quotation/proposal_comparison_screen.dart';
import '../../features/quotation/proposal_detail_screen.dart';
import '../../features/quotation/recurring_quotes_screen.dart';
import '../../features/orders/orders_list_screen.dart';
import '../../features/orders/order_detail_screen.dart';
import '../../features/orders/payment_screen.dart';
import '../../features/notifications/notification_center_screen.dart';
import '../../features/profile/profile_screen.dart';
import '../../features/profile/edit_profile_screen.dart';
import '../../features/profile/settings_screen.dart';
import '../../features/profile/privacy_lgpd_screen.dart';
import '../../widgets/ifarm_bottom_nav.dart';

// Route names
class Routes {
  static const splash = '/';
  static const welcome = '/welcome';
  static const login = '/login';
  static const register = '/register';
  static const kyc = '/kyc';
  static const home = '/home';
  static const search = '/search';
  static const productDetail = '/product/:id';
  static const quoteBuilder = '/quote/builder';
  static const myQuotes = '/quotes';
  static const quoteDetail = '/quote/:id';
  static const proposalComparison = '/quote/:id/compare';
  static const proposalDetail = '/quote/:quoteId/proposal/:proposalId';
  static const recurringQuotes = '/quotes/recurring';
  static const orders = '/orders';
  static const orderDetail = '/order/:id';
  static const payment = '/payment/:orderId';
  static const notifications = '/notifications';
  static const profile = '/profile';
  static const editProfile = '/profile/edit';
  static const settings = '/settings';
  static const privacyLgpd = '/privacy';
}

final appRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authNotifierProvider);

  return GoRouter(
    initialLocation: Routes.splash,
    debugLogDiagnostics: true,
    redirect: (context, state) {
      final isLoading = authState.isLoading;
      if (isLoading) return null;

      final isAuth = authState.value != null;
      final isSplash = state.matchedLocation == Routes.splash;
      final isAuthRoute = [Routes.welcome, Routes.login, Routes.register]
          .contains(state.matchedLocation);

      if (isSplash) return null;
      if (!isAuth && !isAuthRoute) return Routes.welcome;
      if (isAuth && isAuthRoute) return Routes.home;
      return null;
    },
    routes: [
      GoRoute(path: Routes.splash, builder: (_, __) => const SplashScreen()),
      GoRoute(path: Routes.welcome, builder: (_, __) => const WelcomeScreen()),
      GoRoute(path: Routes.login, builder: (_, __) => const LoginScreen()),
      GoRoute(path: Routes.register, builder: (_, __) => const RegistrationScreen()),
      GoRoute(path: Routes.kyc, builder: (_, __) => const KycHubScreen()),

      // Shell route for bottom nav
      ShellRoute(
        builder: (context, state, child) => ScaffoldWithBottomNav(child: child),
        routes: [
          GoRoute(path: Routes.home, builder: (_, __) => const HomeScreen()),
          GoRoute(path: Routes.notifications, builder: (_, __) => const NotificationCenterScreen()),
          GoRoute(path: Routes.orders, builder: (_, __) => const OrdersListScreen()),
          GoRoute(path: Routes.myQuotes, builder: (_, __) => const MyQuotesScreen()),
          GoRoute(path: Routes.profile, builder: (_, __) => const ProfileScreen()),
        ],
      ),

      // Non-shell routes
      GoRoute(path: Routes.search, builder: (_, __) => const ProductSearchScreen()),
      GoRoute(
        path: Routes.productDetail,
        builder: (_, state) => ProductDetailScreen(productId: state.pathParameters['id']!),
      ),
      GoRoute(path: Routes.quoteBuilder, builder: (_, __) => const QuoteBuilderScreen()),
      GoRoute(
        path: Routes.quoteDetail,
        builder: (_, state) => QuoteDetailScreen(quoteId: state.pathParameters['id']!),
      ),
      GoRoute(
        path: Routes.proposalComparison,
        builder: (_, state) => ProposalComparisonScreen(quoteId: state.pathParameters['id']!),
      ),
      GoRoute(
        path: Routes.proposalDetail,
        builder: (_, state) => ProposalDetailScreen(
          quoteId: state.pathParameters['quoteId']!,
          proposalId: state.pathParameters['proposalId']!,
        ),
      ),
      GoRoute(path: Routes.recurringQuotes, builder: (_, __) => const RecurringQuotesScreen()),
      GoRoute(
        path: Routes.orderDetail,
        builder: (_, state) => OrderDetailScreen(orderId: state.pathParameters['id']!),
      ),
      GoRoute(
        path: Routes.payment,
        builder: (_, state) => PaymentScreen(orderId: state.pathParameters['orderId']!),
      ),
      GoRoute(path: Routes.editProfile, builder: (_, __) => const EditProfileScreen()),
      GoRoute(path: Routes.settings, builder: (_, __) => const SettingsScreen()),
      GoRoute(path: Routes.privacyLgpd, builder: (_, __) => const PrivacyLgpdScreen()),
    ],
  );
});
