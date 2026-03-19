import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_pt.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
      : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('pt')
  ];

  /// No description provided for @appName.
  ///
  /// In en, this message translates to:
  /// **'iFarm'**
  String get appName;

  /// No description provided for @tryAgain.
  ///
  /// In en, this message translates to:
  /// **'Try Again'**
  String get tryAgain;

  /// No description provided for @cancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get cancel;

  /// No description provided for @confirm.
  ///
  /// In en, this message translates to:
  /// **'Confirm'**
  String get confirm;

  /// No description provided for @save.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get save;

  /// No description provided for @send.
  ///
  /// In en, this message translates to:
  /// **'Send'**
  String get send;

  /// No description provided for @errorGeneric.
  ///
  /// In en, this message translates to:
  /// **'Something went wrong'**
  String get errorGeneric;

  /// No description provided for @errorGenericMessage.
  ///
  /// In en, this message translates to:
  /// **'Check your connection and try again.'**
  String get errorGenericMessage;

  /// No description provided for @errorUnknown.
  ///
  /// In en, this message translates to:
  /// **'Unknown error'**
  String get errorUnknown;

  /// No description provided for @errorTimeout.
  ///
  /// In en, this message translates to:
  /// **'Connection timed out. Check your internet.'**
  String get errorTimeout;

  /// No description provided for @errorNoConnection.
  ///
  /// In en, this message translates to:
  /// **'No internet connection.'**
  String get errorNoConnection;

  /// No description provided for @errorSomethingWrong.
  ///
  /// In en, this message translates to:
  /// **'Something went wrong. Try again.'**
  String get errorSomethingWrong;

  /// No description provided for @subtotal.
  ///
  /// In en, this message translates to:
  /// **'Subtotal'**
  String get subtotal;

  /// No description provided for @total.
  ///
  /// In en, this message translates to:
  /// **'TOTAL'**
  String get total;

  /// No description provided for @freight.
  ///
  /// In en, this message translates to:
  /// **'Freight'**
  String get freight;

  /// No description provided for @free.
  ///
  /// In en, this message translates to:
  /// **'Free'**
  String get free;

  /// No description provided for @businessDays.
  ///
  /// In en, this message translates to:
  /// **'business days'**
  String get businessDays;

  /// No description provided for @toNegotiate.
  ///
  /// In en, this message translates to:
  /// **'To be arranged'**
  String get toNegotiate;

  /// No description provided for @navHome.
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get navHome;

  /// No description provided for @navQuotes.
  ///
  /// In en, this message translates to:
  /// **'Quotes'**
  String get navQuotes;

  /// No description provided for @navOrders.
  ///
  /// In en, this message translates to:
  /// **'Orders'**
  String get navOrders;

  /// No description provided for @navAlerts.
  ///
  /// In en, this message translates to:
  /// **'Alerts'**
  String get navAlerts;

  /// No description provided for @navProfile.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get navProfile;

  /// No description provided for @welcomeSlideTitle1.
  ///
  /// In en, this message translates to:
  /// **'Buy at the\nbest price'**
  String get welcomeSlideTitle1;

  /// No description provided for @welcomeSlideDesc1.
  ///
  /// In en, this message translates to:
  /// **'Access a global network of agricultural suppliers straight from your phone.'**
  String get welcomeSlideDesc1;

  /// No description provided for @welcomeSlideTitle2.
  ///
  /// In en, this message translates to:
  /// **'Receive multiple\nquotations'**
  String get welcomeSlideTitle2;

  /// No description provided for @welcomeSlideDesc2.
  ///
  /// In en, this message translates to:
  /// **'Compare offers in real time and ensure the best profitability for your harvest.'**
  String get welcomeSlideDesc2;

  /// No description provided for @welcomeSlideTitle3.
  ///
  /// In en, this message translates to:
  /// **'Manage\nfrom the field'**
  String get welcomeSlideTitle3;

  /// No description provided for @welcomeSlideDesc3.
  ///
  /// In en, this message translates to:
  /// **'All input and logistics management in the palm of your hand, wherever you are.'**
  String get welcomeSlideDesc3;

  /// No description provided for @welcomeCreateAccount.
  ///
  /// In en, this message translates to:
  /// **'Create Account'**
  String get welcomeCreateAccount;

  /// No description provided for @welcomeLogin.
  ///
  /// In en, this message translates to:
  /// **'Log In'**
  String get welcomeLogin;

  /// No description provided for @welcomeTagline.
  ///
  /// In en, this message translates to:
  /// **'THE DIGITAL MARKETPLACE OF AGRIBUSINESS'**
  String get welcomeTagline;

  /// No description provided for @loginSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Manage your assets with digital precision.'**
  String get loginSubtitle;

  /// No description provided for @loginEmail.
  ///
  /// In en, this message translates to:
  /// **'E-mail'**
  String get loginEmail;

  /// No description provided for @loginPassword.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get loginPassword;

  /// No description provided for @loginForgotPassword.
  ///
  /// In en, this message translates to:
  /// **'Forgot password?'**
  String get loginForgotPassword;

  /// No description provided for @loginButton.
  ///
  /// In en, this message translates to:
  /// **'Log In'**
  String get loginButton;

  /// No description provided for @loginOrAccessWith.
  ///
  /// In en, this message translates to:
  /// **'Or access with'**
  String get loginOrAccessWith;

  /// No description provided for @loginGoogle.
  ///
  /// In en, this message translates to:
  /// **'Google'**
  String get loginGoogle;

  /// No description provided for @loginBiometrics.
  ///
  /// In en, this message translates to:
  /// **'Biometrics'**
  String get loginBiometrics;

  /// No description provided for @loginNoAccount.
  ///
  /// In en, this message translates to:
  /// **'Don\'t have an account yet? '**
  String get loginNoAccount;

  /// No description provided for @loginCreateAccount.
  ///
  /// In en, this message translates to:
  /// **'Create account'**
  String get loginCreateAccount;

  /// No description provided for @registrationTitle.
  ///
  /// In en, this message translates to:
  /// **'Create Account'**
  String get registrationTitle;

  /// No description provided for @registrationPersonalData.
  ///
  /// In en, this message translates to:
  /// **'Personal Data'**
  String get registrationPersonalData;

  /// No description provided for @registrationFullName.
  ///
  /// In en, this message translates to:
  /// **'Full name'**
  String get registrationFullName;

  /// No description provided for @registrationCpf.
  ///
  /// In en, this message translates to:
  /// **'CPF'**
  String get registrationCpf;

  /// No description provided for @registrationEmail.
  ///
  /// In en, this message translates to:
  /// **'E-mail'**
  String get registrationEmail;

  /// No description provided for @registrationPhone.
  ///
  /// In en, this message translates to:
  /// **'Phone'**
  String get registrationPhone;

  /// No description provided for @registrationPassword.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get registrationPassword;

  /// No description provided for @registrationPropertyDetails.
  ///
  /// In en, this message translates to:
  /// **'Property Details'**
  String get registrationPropertyDetails;

  /// No description provided for @registrationPropertyName.
  ///
  /// In en, this message translates to:
  /// **'Property name'**
  String get registrationPropertyName;

  /// No description provided for @registrationTotalArea.
  ///
  /// In en, this message translates to:
  /// **'Total area (ha)'**
  String get registrationTotalArea;

  /// No description provided for @registrationZipCode.
  ///
  /// In en, this message translates to:
  /// **'ZIP Code'**
  String get registrationZipCode;

  /// No description provided for @registrationState.
  ///
  /// In en, this message translates to:
  /// **'State'**
  String get registrationState;

  /// No description provided for @registrationSelectState.
  ///
  /// In en, this message translates to:
  /// **'Select a state'**
  String get registrationSelectState;

  /// No description provided for @registrationGpsCoordinates.
  ///
  /// In en, this message translates to:
  /// **'GPS Coordinates'**
  String get registrationGpsCoordinates;

  /// No description provided for @registrationTapToCapture.
  ///
  /// In en, this message translates to:
  /// **'Tap to capture location'**
  String get registrationTapToCapture;

  /// No description provided for @registrationCapture.
  ///
  /// In en, this message translates to:
  /// **'CAPTURE'**
  String get registrationCapture;

  /// No description provided for @registrationTermsTitle.
  ///
  /// In en, this message translates to:
  /// **'Terms and Privacy'**
  String get registrationTermsTitle;

  /// No description provided for @registrationAcceptTerms.
  ///
  /// In en, this message translates to:
  /// **'I accept the Terms of Use. I understand how my data will be processed in accordance with LGPD guidelines.'**
  String get registrationAcceptTerms;

  /// No description provided for @registrationReadTerms.
  ///
  /// In en, this message translates to:
  /// **'Read Terms of Use'**
  String get registrationReadTerms;

  /// No description provided for @registrationMarketingConsent.
  ///
  /// In en, this message translates to:
  /// **'I want to receive quotation reports and agribusiness news via Email and WhatsApp.'**
  String get registrationMarketingConsent;

  /// No description provided for @registrationCreateAccountButton.
  ///
  /// In en, this message translates to:
  /// **'Create Account'**
  String get registrationCreateAccountButton;

  /// No description provided for @registrationLoginButton.
  ///
  /// In en, this message translates to:
  /// **'Log In'**
  String get registrationLoginButton;

  /// No description provided for @registrationAcceptTermsError.
  ///
  /// In en, this message translates to:
  /// **'Accept the Terms of Use to continue.'**
  String get registrationAcceptTermsError;

  /// No description provided for @homeGreeting.
  ///
  /// In en, this message translates to:
  /// **'Good morning,'**
  String get homeGreeting;

  /// No description provided for @homeHello.
  ///
  /// In en, this message translates to:
  /// **'Hello, {firstName}!'**
  String homeHello(String firstName);

  /// No description provided for @homeFarmerDefault.
  ///
  /// In en, this message translates to:
  /// **'Farmer'**
  String get homeFarmerDefault;

  /// No description provided for @homeSearchPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Search inputs, machines or orders...'**
  String get homeSearchPlaceholder;

  /// No description provided for @homeNewQuote.
  ///
  /// In en, this message translates to:
  /// **'New Quote'**
  String get homeNewQuote;

  /// No description provided for @homeMyQuotes.
  ///
  /// In en, this message translates to:
  /// **'My Quotes'**
  String get homeMyQuotes;

  /// No description provided for @homeMyOrders.
  ///
  /// In en, this message translates to:
  /// **'My Orders'**
  String get homeMyOrders;

  /// No description provided for @homeRecurring.
  ///
  /// In en, this message translates to:
  /// **'Recurring'**
  String get homeRecurring;

  /// No description provided for @homeCategories.
  ///
  /// In en, this message translates to:
  /// **'Categories'**
  String get homeCategories;

  /// No description provided for @homeViewAll.
  ///
  /// In en, this message translates to:
  /// **'View All'**
  String get homeViewAll;

  /// No description provided for @homeViewAllCaps.
  ///
  /// In en, this message translates to:
  /// **'VIEW ALL'**
  String get homeViewAllCaps;

  /// No description provided for @homeRecentQuotes.
  ///
  /// In en, this message translates to:
  /// **'Recent Quotes'**
  String get homeRecentQuotes;

  /// No description provided for @homeViewAllQuotes.
  ///
  /// In en, this message translates to:
  /// **'View All'**
  String get homeViewAllQuotes;

  /// No description provided for @homeCategoryAll.
  ///
  /// In en, this message translates to:
  /// **'All'**
  String get homeCategoryAll;

  /// No description provided for @homeCategoryPesticides.
  ///
  /// In en, this message translates to:
  /// **'Pesticides'**
  String get homeCategoryPesticides;

  /// No description provided for @homeCategorySeeds.
  ///
  /// In en, this message translates to:
  /// **'Seeds'**
  String get homeCategorySeeds;

  /// No description provided for @homeCategoryNutrition.
  ///
  /// In en, this message translates to:
  /// **'Nutrition'**
  String get homeCategoryNutrition;

  /// No description provided for @homeCategoryMachinery.
  ///
  /// In en, this message translates to:
  /// **'Machinery'**
  String get homeCategoryMachinery;

  /// No description provided for @homeCategoryIrrigation.
  ///
  /// In en, this message translates to:
  /// **'Irrigation'**
  String get homeCategoryIrrigation;

  /// No description provided for @homeItemCount.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, =1{1 item} other{{count} items}}'**
  String homeItemCount(int count);

  /// No description provided for @splashDigitalEstate.
  ///
  /// In en, this message translates to:
  /// **'DIGITAL ESTATE'**
  String get splashDigitalEstate;

  /// No description provided for @splashStartingSeason.
  ///
  /// In en, this message translates to:
  /// **'STARTING SEASON'**
  String get splashStartingSeason;

  /// No description provided for @kycIdFront.
  ///
  /// In en, this message translates to:
  /// **'ID (Front)'**
  String get kycIdFront;

  /// No description provided for @kycIdFrontDesc.
  ///
  /// In en, this message translates to:
  /// **'National ID or Driver\'s License (front)'**
  String get kycIdFrontDesc;

  /// No description provided for @kycIdBack.
  ///
  /// In en, this message translates to:
  /// **'ID (Back)'**
  String get kycIdBack;

  /// No description provided for @kycIdBackDesc.
  ///
  /// In en, this message translates to:
  /// **'National ID or Driver\'s License (back)'**
  String get kycIdBackDesc;

  /// No description provided for @kycAddressProof.
  ///
  /// In en, this message translates to:
  /// **'Proof of Address'**
  String get kycAddressProof;

  /// No description provided for @kycAddressProofDesc.
  ///
  /// In en, this message translates to:
  /// **'Utility Bill'**
  String get kycAddressProofDesc;

  /// No description provided for @kycRuralDoc.
  ///
  /// In en, this message translates to:
  /// **'Rural Producer Doc.'**
  String get kycRuralDoc;

  /// No description provided for @kycRuralDocDesc.
  ///
  /// In en, this message translates to:
  /// **'State registration or DAP'**
  String get kycRuralDocDesc;

  /// No description provided for @kycDocumentSentSuccess.
  ///
  /// In en, this message translates to:
  /// **'Document sent successfully!'**
  String get kycDocumentSentSuccess;

  /// No description provided for @kycDocumentSentError.
  ///
  /// In en, this message translates to:
  /// **'Error sending document.'**
  String get kycDocumentSentError;

  /// No description provided for @kycCamera.
  ///
  /// In en, this message translates to:
  /// **'Camera'**
  String get kycCamera;

  /// No description provided for @kycGallery.
  ///
  /// In en, this message translates to:
  /// **'Gallery'**
  String get kycGallery;

  /// No description provided for @kycIdentityVerified.
  ///
  /// In en, this message translates to:
  /// **'Identity Verified'**
  String get kycIdentityVerified;

  /// No description provided for @kycUnderReview.
  ///
  /// In en, this message translates to:
  /// **'Under review'**
  String get kycUnderReview;

  /// No description provided for @kycDocumentCenter.
  ///
  /// In en, this message translates to:
  /// **'Document Center'**
  String get kycDocumentCenter;

  /// No description provided for @kycDocumentCenterDesc.
  ///
  /// In en, this message translates to:
  /// **'Keep your property compliant and up to date.'**
  String get kycDocumentCenterDesc;

  /// No description provided for @kycSent.
  ///
  /// In en, this message translates to:
  /// **'sent'**
  String get kycSent;

  /// No description provided for @kycRealtimeAnalysis.
  ///
  /// In en, this message translates to:
  /// **'Real-time analysis · 4 business hours'**
  String get kycRealtimeAnalysis;

  /// No description provided for @kycResend.
  ///
  /// In en, this message translates to:
  /// **'Resend'**
  String get kycResend;

  /// No description provided for @kycSendButton.
  ///
  /// In en, this message translates to:
  /// **'Send'**
  String get kycSendButton;

  /// No description provided for @kycContinue.
  ///
  /// In en, this message translates to:
  /// **'Continue'**
  String get kycContinue;

  /// No description provided for @productSearchTitle.
  ///
  /// In en, this message translates to:
  /// **'Find the best\nfor your harvest.'**
  String get productSearchTitle;

  /// No description provided for @productSearchPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Search pesticides, seeds...'**
  String get productSearchPlaceholder;

  /// No description provided for @productSearchFilters.
  ///
  /// In en, this message translates to:
  /// **'Filters'**
  String get productSearchFilters;

  /// No description provided for @productSearchRuralCredit.
  ///
  /// In en, this message translates to:
  /// **'RURAL CREDIT'**
  String get productSearchRuralCredit;

  /// No description provided for @productSearchEligible.
  ///
  /// In en, this message translates to:
  /// **'Eligible'**
  String get productSearchEligible;

  /// No description provided for @productSearchAll.
  ///
  /// In en, this message translates to:
  /// **'All'**
  String get productSearchAll;

  /// No description provided for @productSearchApplyFilters.
  ///
  /// In en, this message translates to:
  /// **'Apply Filters'**
  String get productSearchApplyFilters;

  /// No description provided for @productSearchAvailable.
  ///
  /// In en, this message translates to:
  /// **'AVAILABLE PRODUCTS'**
  String get productSearchAvailable;

  /// No description provided for @productSearchError.
  ///
  /// In en, this message translates to:
  /// **'Error loading products'**
  String get productSearchError;

  /// No description provided for @productSearchNoResults.
  ///
  /// In en, this message translates to:
  /// **'No product found'**
  String get productSearchNoResults;

  /// No description provided for @productSearchNoResultsHint.
  ///
  /// In en, this message translates to:
  /// **'Try other terms or remove filters'**
  String get productSearchNoResultsHint;

  /// No description provided for @productSearchAddedToQuote.
  ///
  /// In en, this message translates to:
  /// **'Added to quote'**
  String get productSearchAddedToQuote;

  /// No description provided for @productDetailError.
  ///
  /// In en, this message translates to:
  /// **'Error loading product'**
  String get productDetailError;

  /// No description provided for @productDetailRuralCredit.
  ///
  /// In en, this message translates to:
  /// **'RURAL CREDIT'**
  String get productDetailRuralCredit;

  /// No description provided for @productDetailPriceOnRequest.
  ///
  /// In en, this message translates to:
  /// **'Price on request'**
  String get productDetailPriceOnRequest;

  /// No description provided for @productDetailAvailable.
  ///
  /// In en, this message translates to:
  /// **'Available'**
  String get productDetailAvailable;

  /// No description provided for @productDetailDemandIndex.
  ///
  /// In en, this message translates to:
  /// **'REGIONAL DEMAND INDEX'**
  String get productDetailDemandIndex;

  /// No description provided for @productDetailDescription.
  ///
  /// In en, this message translates to:
  /// **'ASSET DESCRIPTION'**
  String get productDetailDescription;

  /// No description provided for @productDetailDefaultDesc.
  ///
  /// In en, this message translates to:
  /// **'Premium product for your harvest.'**
  String get productDetailDefaultDesc;

  /// No description provided for @productDetailSpecs.
  ///
  /// In en, this message translates to:
  /// **'SPECIFICATIONS'**
  String get productDetailSpecs;

  /// No description provided for @productDetailGuarantee.
  ///
  /// In en, this message translates to:
  /// **'iFarm Guarantee'**
  String get productDetailGuarantee;

  /// No description provided for @productDetailInspection.
  ///
  /// In en, this message translates to:
  /// **'Certified technical inspection included'**
  String get productDetailInspection;

  /// No description provided for @productDetailAddToQuote.
  ///
  /// In en, this message translates to:
  /// **'Add to Quote'**
  String get productDetailAddToQuote;

  /// No description provided for @productDetailAddedToQuote.
  ///
  /// In en, this message translates to:
  /// **'Added to quote'**
  String get productDetailAddedToQuote;

  /// No description provided for @quoteBuilderPaymentPix.
  ///
  /// In en, this message translates to:
  /// **'PIX · immediate'**
  String get quoteBuilderPaymentPix;

  /// No description provided for @quoteBuilderPaymentRural.
  ///
  /// In en, this message translates to:
  /// **'Rural Credit · approval 48h'**
  String get quoteBuilderPaymentRural;

  /// No description provided for @quoteBuilderPaymentBoleto.
  ///
  /// In en, this message translates to:
  /// **'Boleto · 30/60 days'**
  String get quoteBuilderPaymentBoleto;

  /// No description provided for @quoteBuilderPaymentCard.
  ///
  /// In en, this message translates to:
  /// **'Credit Card'**
  String get quoteBuilderPaymentCard;

  /// No description provided for @quoteBuilderSentSuccess.
  ///
  /// In en, this message translates to:
  /// **'Quote sent successfully!'**
  String get quoteBuilderSentSuccess;

  /// No description provided for @quoteBuilderEmptyCart.
  ///
  /// In en, this message translates to:
  /// **'Empty cart'**
  String get quoteBuilderEmptyCart;

  /// No description provided for @quoteBuilderEmptyCartHint.
  ///
  /// In en, this message translates to:
  /// **'Add products to create a quote'**
  String get quoteBuilderEmptyCartHint;

  /// No description provided for @quoteBuilderSearchProducts.
  ///
  /// In en, this message translates to:
  /// **'Search Products'**
  String get quoteBuilderSearchProducts;

  /// No description provided for @quoteBuilderItems.
  ///
  /// In en, this message translates to:
  /// **'Items ({count})'**
  String quoteBuilderItems(int count);

  /// No description provided for @quoteBuilderDeliveryMode.
  ///
  /// In en, this message translates to:
  /// **'Delivery Mode'**
  String get quoteBuilderDeliveryMode;

  /// No description provided for @quoteBuilderPaymentMethod.
  ///
  /// In en, this message translates to:
  /// **'Payment Method'**
  String get quoteBuilderPaymentMethod;

  /// No description provided for @quoteBuilderValidity.
  ///
  /// In en, this message translates to:
  /// **'Validity Period'**
  String get quoteBuilderValidity;

  /// No description provided for @quoteBuilderTitle.
  ///
  /// In en, this message translates to:
  /// **'New Quote'**
  String get quoteBuilderTitle;

  /// No description provided for @quoteBuilderSending.
  ///
  /// In en, this message translates to:
  /// **'Sending...'**
  String get quoteBuilderSending;

  /// No description provided for @quoteBuilderSendQuote.
  ///
  /// In en, this message translates to:
  /// **'Send Quote'**
  String get quoteBuilderSendQuote;

  /// No description provided for @myQuotesTabActive.
  ///
  /// In en, this message translates to:
  /// **'Active'**
  String get myQuotesTabActive;

  /// No description provided for @myQuotesTabWithProposals.
  ///
  /// In en, this message translates to:
  /// **'With Proposals'**
  String get myQuotesTabWithProposals;

  /// No description provided for @myQuotesTabAccepted.
  ///
  /// In en, this message translates to:
  /// **'Accepted'**
  String get myQuotesTabAccepted;

  /// No description provided for @myQuotesTabExpired.
  ///
  /// In en, this message translates to:
  /// **'Expired'**
  String get myQuotesTabExpired;

  /// No description provided for @myQuotesSearch.
  ///
  /// In en, this message translates to:
  /// **'Search'**
  String get myQuotesSearch;

  /// No description provided for @myQuotesRecurring.
  ///
  /// In en, this message translates to:
  /// **'Recurring'**
  String get myQuotesRecurring;

  /// No description provided for @myQuotesEmpty.
  ///
  /// In en, this message translates to:
  /// **'No quotes'**
  String get myQuotesEmpty;

  /// No description provided for @myQuotesEmptyHint.
  ///
  /// In en, this message translates to:
  /// **'Your quotes will appear here'**
  String get myQuotesEmptyHint;

  /// No description provided for @myQuotesBestOffer.
  ///
  /// In en, this message translates to:
  /// **'Best offer: '**
  String get myQuotesBestOffer;

  /// No description provided for @quoteDetailTitle.
  ///
  /// In en, this message translates to:
  /// **'Quote Detail'**
  String get quoteDetailTitle;

  /// No description provided for @quoteDetailExpiresIn.
  ///
  /// In en, this message translates to:
  /// **'Expires in'**
  String get quoteDetailExpiresIn;

  /// No description provided for @quoteDetailPayment.
  ///
  /// In en, this message translates to:
  /// **'Payment'**
  String get quoteDetailPayment;

  /// No description provided for @quoteDetailDelivery.
  ///
  /// In en, this message translates to:
  /// **'Delivery'**
  String get quoteDetailDelivery;

  /// No description provided for @quoteDetailRequestedItems.
  ///
  /// In en, this message translates to:
  /// **'Requested Items'**
  String get quoteDetailRequestedItems;

  /// No description provided for @quoteDetailProposals.
  ///
  /// In en, this message translates to:
  /// **'Proposals ({count})'**
  String quoteDetailProposals(int count);

  /// No description provided for @quoteDetailCompare.
  ///
  /// In en, this message translates to:
  /// **'Compare'**
  String get quoteDetailCompare;

  /// No description provided for @quoteDetailRecommended.
  ///
  /// In en, this message translates to:
  /// **'RECOMMENDED'**
  String get quoteDetailRecommended;

  /// No description provided for @proposalComparisonTitle.
  ///
  /// In en, this message translates to:
  /// **'Compare Proposals'**
  String get proposalComparisonTitle;

  /// No description provided for @proposalComparisonEmpty.
  ///
  /// In en, this message translates to:
  /// **'No proposals available'**
  String get proposalComparisonEmpty;

  /// No description provided for @proposalComparisonBestValue.
  ///
  /// In en, this message translates to:
  /// **'BEST VALUE'**
  String get proposalComparisonBestValue;

  /// No description provided for @proposalComparisonFastDelivery.
  ///
  /// In en, this message translates to:
  /// **'FAST DELIVERY'**
  String get proposalComparisonFastDelivery;

  /// No description provided for @proposalComparisonTaxes.
  ///
  /// In en, this message translates to:
  /// **'Taxes'**
  String get proposalComparisonTaxes;

  /// No description provided for @proposalComparisonAccept.
  ///
  /// In en, this message translates to:
  /// **'Accept Proposal'**
  String get proposalComparisonAccept;

  /// No description provided for @proposalComparisonSavings.
  ///
  /// In en, this message translates to:
  /// **'Estimated savings of R\$ {value} vs. regional average'**
  String proposalComparisonSavings(String value);

  /// No description provided for @proposalDetailAccepted.
  ///
  /// In en, this message translates to:
  /// **'Proposal accepted! Order created.'**
  String get proposalDetailAccepted;

  /// No description provided for @proposalDetailTitle.
  ///
  /// In en, this message translates to:
  /// **'Proposal Details'**
  String get proposalDetailTitle;

  /// No description provided for @proposalDetailFreightCif.
  ///
  /// In en, this message translates to:
  /// **'CIF FREIGHT'**
  String get proposalDetailFreightCif;

  /// No description provided for @proposalDetailFreightFob.
  ///
  /// In en, this message translates to:
  /// **'FOB FREIGHT'**
  String get proposalDetailFreightFob;

  /// No description provided for @proposalDetailItems.
  ///
  /// In en, this message translates to:
  /// **'Items'**
  String get proposalDetailItems;

  /// No description provided for @proposalDetailIcms.
  ///
  /// In en, this message translates to:
  /// **'ICMS'**
  String get proposalDetailIcms;

  /// No description provided for @proposalDetailDifal.
  ///
  /// In en, this message translates to:
  /// **'DIFAL'**
  String get proposalDetailDifal;

  /// No description provided for @proposalDetailSt.
  ///
  /// In en, this message translates to:
  /// **'ST'**
  String get proposalDetailSt;

  /// No description provided for @proposalDetailTotalWithTaxes.
  ///
  /// In en, this message translates to:
  /// **'TOTAL W/ TAXES AND FREIGHT'**
  String get proposalDetailTotalWithTaxes;

  /// No description provided for @proposalDetailNotes.
  ///
  /// In en, this message translates to:
  /// **'Notes'**
  String get proposalDetailNotes;

  /// No description provided for @proposalDetailConfirmOrder.
  ///
  /// In en, this message translates to:
  /// **'Yes, Confirm Order'**
  String get proposalDetailConfirmOrder;

  /// No description provided for @proposalDetailGoBack.
  ///
  /// In en, this message translates to:
  /// **'Go Back and Review'**
  String get proposalDetailGoBack;

  /// No description provided for @proposalDetailConfirmTitle.
  ///
  /// In en, this message translates to:
  /// **'Confirm Order'**
  String get proposalDetailConfirmTitle;

  /// No description provided for @proposalDetailConfirmMessage.
  ///
  /// In en, this message translates to:
  /// **'This action cannot be undone. By confirming, an order will be created.'**
  String get proposalDetailConfirmMessage;

  /// No description provided for @recurringQuotesNewTitle.
  ///
  /// In en, this message translates to:
  /// **'New Recurring Quote'**
  String get recurringQuotesNewTitle;

  /// No description provided for @recurringQuotesProduct.
  ///
  /// In en, this message translates to:
  /// **'Product (ID or name)'**
  String get recurringQuotesProduct;

  /// No description provided for @recurringQuotesQuantity.
  ///
  /// In en, this message translates to:
  /// **'Quantity'**
  String get recurringQuotesQuantity;

  /// No description provided for @recurringQuotesFrequency.
  ///
  /// In en, this message translates to:
  /// **'Frequency'**
  String get recurringQuotesFrequency;

  /// No description provided for @recurringQuotesCreate.
  ///
  /// In en, this message translates to:
  /// **'Create Recurring'**
  String get recurringQuotesCreate;

  /// No description provided for @recurringQuotesTitle.
  ///
  /// In en, this message translates to:
  /// **'Recurring Quotes'**
  String get recurringQuotesTitle;

  /// No description provided for @recurringQuotesEmpty.
  ///
  /// In en, this message translates to:
  /// **'No recurring quotes'**
  String get recurringQuotesEmpty;

  /// No description provided for @recurringQuotesEmptyHint.
  ///
  /// In en, this message translates to:
  /// **'Create one to automate your purchases'**
  String get recurringQuotesEmptyHint;

  /// No description provided for @recurringQuotesNextDate.
  ///
  /// In en, this message translates to:
  /// **'Next Date: {date}'**
  String recurringQuotesNextDate(String date);

  /// No description provided for @ordersTabAwaitingPayment.
  ///
  /// In en, this message translates to:
  /// **'Awaiting Payment'**
  String get ordersTabAwaitingPayment;

  /// No description provided for @ordersTabPaid.
  ///
  /// In en, this message translates to:
  /// **'Paid'**
  String get ordersTabPaid;

  /// No description provided for @ordersTabDispatched.
  ///
  /// In en, this message translates to:
  /// **'Dispatched'**
  String get ordersTabDispatched;

  /// No description provided for @ordersTabDelivered.
  ///
  /// In en, this message translates to:
  /// **'Delivered'**
  String get ordersTabDelivered;

  /// No description provided for @ordersNoOrders.
  ///
  /// In en, this message translates to:
  /// **'No orders'**
  String get ordersNoOrders;

  /// No description provided for @ordersNoOrdersHint.
  ///
  /// In en, this message translates to:
  /// **'No orders with this status.'**
  String get ordersNoOrdersHint;

  /// No description provided for @ordersPayNow.
  ///
  /// In en, this message translates to:
  /// **'Pay Now'**
  String get ordersPayNow;

  /// No description provided for @ordersViewDetails.
  ///
  /// In en, this message translates to:
  /// **'View Details'**
  String get ordersViewDetails;

  /// No description provided for @ordersTrack.
  ///
  /// In en, this message translates to:
  /// **'Track'**
  String get ordersTrack;

  /// No description provided for @ordersConfirmReceipt.
  ///
  /// In en, this message translates to:
  /// **'Confirm Receipt'**
  String get ordersConfirmReceipt;

  /// No description provided for @ordersUnknownRetailer.
  ///
  /// In en, this message translates to:
  /// **'Unknown retailer'**
  String get ordersUnknownRetailer;

  /// No description provided for @ordersItemCount.
  ///
  /// In en, this message translates to:
  /// **'{count} item(s)'**
  String ordersItemCount(int count);

  /// No description provided for @ordersTotal.
  ///
  /// In en, this message translates to:
  /// **'Total'**
  String get ordersTotal;

  /// No description provided for @orderDetailTitle.
  ///
  /// In en, this message translates to:
  /// **'Order'**
  String get orderDetailTitle;

  /// No description provided for @orderDetailReceiptConfirmed.
  ///
  /// In en, this message translates to:
  /// **'Receipt confirmed successfully!'**
  String get orderDetailReceiptConfirmed;

  /// No description provided for @orderDetailReceiptError.
  ///
  /// In en, this message translates to:
  /// **'Error confirming receipt.'**
  String get orderDetailReceiptError;

  /// No description provided for @orderDetailDisputeOpened.
  ///
  /// In en, this message translates to:
  /// **'Dispute opened successfully.'**
  String get orderDetailDisputeOpened;

  /// No description provided for @orderDetailDisputeError.
  ///
  /// In en, this message translates to:
  /// **'Error opening dispute.'**
  String get orderDetailDisputeError;

  /// No description provided for @orderDetailConfirmReceiptTitle.
  ///
  /// In en, this message translates to:
  /// **'Confirm Receipt'**
  String get orderDetailConfirmReceiptTitle;

  /// No description provided for @orderDetailConfirmReceiptMessage.
  ///
  /// In en, this message translates to:
  /// **'Confirm you received the order?'**
  String get orderDetailConfirmReceiptMessage;

  /// No description provided for @orderDetailConfirmReceiptWarning.
  ///
  /// In en, this message translates to:
  /// **'By confirming, payment will be released to the supplier. This action cannot be undone.'**
  String get orderDetailConfirmReceiptWarning;

  /// No description provided for @orderDetailOpenDispute.
  ///
  /// In en, this message translates to:
  /// **'Open Dispute'**
  String get orderDetailOpenDispute;

  /// No description provided for @orderDetailDisputeReason.
  ///
  /// In en, this message translates to:
  /// **'Describe the reason for the dispute:'**
  String get orderDetailDisputeReason;

  /// No description provided for @orderDetailDisputeReasonLabel.
  ///
  /// In en, this message translates to:
  /// **'Reason'**
  String get orderDetailDisputeReasonLabel;

  /// No description provided for @orderDetailDisputeReasonHint.
  ///
  /// In en, this message translates to:
  /// **'E.g.: Product didn\'t arrive, damaged product...'**
  String get orderDetailDisputeReasonHint;

  /// No description provided for @orderDetailSendDispute.
  ///
  /// In en, this message translates to:
  /// **'Send Dispute'**
  String get orderDetailSendDispute;

  /// No description provided for @orderDetailRateSupplier.
  ///
  /// In en, this message translates to:
  /// **'Rate Supplier'**
  String get orderDetailRateSupplier;

  /// No description provided for @orderDetailRateComingSoon.
  ///
  /// In en, this message translates to:
  /// **'Rating feature coming soon.'**
  String get orderDetailRateComingSoon;

  /// No description provided for @orderDetailStepCreated.
  ///
  /// In en, this message translates to:
  /// **'Created'**
  String get orderDetailStepCreated;

  /// No description provided for @orderDetailStepPaid.
  ///
  /// In en, this message translates to:
  /// **'Paid'**
  String get orderDetailStepPaid;

  /// No description provided for @orderDetailStepInTransit.
  ///
  /// In en, this message translates to:
  /// **'In Transit'**
  String get orderDetailStepInTransit;

  /// No description provided for @orderDetailStepDelivered.
  ///
  /// In en, this message translates to:
  /// **'Delivered'**
  String get orderDetailStepDelivered;

  /// No description provided for @orderDetailOrderStatus.
  ///
  /// In en, this message translates to:
  /// **'Order Status'**
  String get orderDetailOrderStatus;

  /// No description provided for @orderDetailReasonLabel.
  ///
  /// In en, this message translates to:
  /// **'Reason:'**
  String get orderDetailReasonLabel;

  /// No description provided for @orderDetailTimeline.
  ///
  /// In en, this message translates to:
  /// **'Timeline'**
  String get orderDetailTimeline;

  /// No description provided for @orderDetailTracking.
  ///
  /// In en, this message translates to:
  /// **'Tracking: '**
  String get orderDetailTracking;

  /// No description provided for @orderDetailCityState.
  ///
  /// In en, this message translates to:
  /// **'City, State'**
  String get orderDetailCityState;

  /// No description provided for @orderDetailOrderItems.
  ///
  /// In en, this message translates to:
  /// **'Order Items'**
  String get orderDetailOrderItems;

  /// No description provided for @paymentCopied.
  ///
  /// In en, this message translates to:
  /// **'{label} copied!'**
  String paymentCopied(String label);

  /// No description provided for @paymentViaPix.
  ///
  /// In en, this message translates to:
  /// **'Payment via PIX'**
  String get paymentViaPix;

  /// No description provided for @paymentError.
  ///
  /// In en, this message translates to:
  /// **'Error loading payment'**
  String get paymentError;

  /// No description provided for @paymentPixTitle.
  ///
  /// In en, this message translates to:
  /// **'PIX Payment'**
  String get paymentPixTitle;

  /// No description provided for @paymentPixInstructions.
  ///
  /// In en, this message translates to:
  /// **'Open your bank app and choose the Pay with QR Code option'**
  String get paymentPixInstructions;

  /// No description provided for @paymentCopyPixCode.
  ///
  /// In en, this message translates to:
  /// **'Copy PIX code'**
  String get paymentCopyPixCode;

  /// No description provided for @paymentPixCode.
  ///
  /// In en, this message translates to:
  /// **'PIX Code'**
  String get paymentPixCode;

  /// No description provided for @paymentNeedHelp.
  ///
  /// In en, this message translates to:
  /// **'I need help with PIX'**
  String get paymentNeedHelp;

  /// No description provided for @paymentSecure.
  ///
  /// In en, this message translates to:
  /// **'Payment processed securely'**
  String get paymentSecure;

  /// No description provided for @paymentOrderGenerated.
  ///
  /// In en, this message translates to:
  /// **'Order Generated'**
  String get paymentOrderGenerated;

  /// No description provided for @paymentAwaitingPayment.
  ///
  /// In en, this message translates to:
  /// **'Awaiting Payment'**
  String get paymentAwaitingPayment;

  /// No description provided for @paymentCodeExpires.
  ///
  /// In en, this message translates to:
  /// **'The code expires in 2 hours'**
  String get paymentCodeExpires;

  /// No description provided for @paymentPreparingShipment.
  ///
  /// In en, this message translates to:
  /// **'Preparing for Shipment'**
  String get paymentPreparingShipment;

  /// No description provided for @paymentPending.
  ///
  /// In en, this message translates to:
  /// **'Pending'**
  String get paymentPending;

  /// No description provided for @paymentBoleto.
  ///
  /// In en, this message translates to:
  /// **'Bank Slip'**
  String get paymentBoleto;

  /// No description provided for @paymentBoletoExpiry.
  ///
  /// In en, this message translates to:
  /// **'Due date: {date}'**
  String paymentBoletoExpiry(String date);

  /// No description provided for @paymentDigitableLine.
  ///
  /// In en, this message translates to:
  /// **'Digitable line'**
  String get paymentDigitableLine;

  /// No description provided for @paymentCopyDigitableLine.
  ///
  /// In en, this message translates to:
  /// **'Copy digitable line'**
  String get paymentCopyDigitableLine;

  /// No description provided for @paymentOpenBoleto.
  ///
  /// In en, this message translates to:
  /// **'Open bank slip in browser'**
  String get paymentOpenBoleto;

  /// No description provided for @paymentConfirmed.
  ///
  /// In en, this message translates to:
  /// **'Payment confirmed!'**
  String get paymentConfirmed;

  /// No description provided for @paymentProcessing.
  ///
  /// In en, this message translates to:
  /// **'Your order is being processed.'**
  String get paymentProcessing;

  /// No description provided for @paymentBackToOrder.
  ///
  /// In en, this message translates to:
  /// **'Back to order'**
  String get paymentBackToOrder;

  /// No description provided for @paymentExpired.
  ///
  /// In en, this message translates to:
  /// **'This payment has expired. Contact support.'**
  String get paymentExpired;

  /// No description provided for @paymentAboutBoleto.
  ///
  /// In en, this message translates to:
  /// **'About the bank slip:'**
  String get paymentAboutBoleto;

  /// No description provided for @paymentBoletoClearing.
  ///
  /// In en, this message translates to:
  /// **'Clearing time: up to 3 business days'**
  String get paymentBoletoClearing;

  /// No description provided for @paymentBoletoWhere.
  ///
  /// In en, this message translates to:
  /// **'Pay at any bank, lottery shop or via internet banking'**
  String get paymentBoletoWhere;

  /// No description provided for @paymentBoletoExpiredNote.
  ///
  /// In en, this message translates to:
  /// **'After the due date, the slip cannot be paid'**
  String get paymentBoletoExpiredNote;

  /// No description provided for @profileError.
  ///
  /// In en, this message translates to:
  /// **'Error loading profile.'**
  String get profileError;

  /// No description provided for @profileMyAccount.
  ///
  /// In en, this message translates to:
  /// **'My Account'**
  String get profileMyAccount;

  /// No description provided for @profileEditProfile.
  ///
  /// In en, this message translates to:
  /// **'Edit Profile'**
  String get profileEditProfile;

  /// No description provided for @profilePayment.
  ///
  /// In en, this message translates to:
  /// **'Payment'**
  String get profilePayment;

  /// No description provided for @profileNotifications.
  ///
  /// In en, this message translates to:
  /// **'Notifications'**
  String get profileNotifications;

  /// No description provided for @profileSettings.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get profileSettings;

  /// No description provided for @profilePrivacyLgpd.
  ///
  /// In en, this message translates to:
  /// **'Privacy and LGPD'**
  String get profilePrivacyLgpd;

  /// No description provided for @profileHelp.
  ///
  /// In en, this message translates to:
  /// **'Help'**
  String get profileHelp;

  /// No description provided for @profileSecurity.
  ///
  /// In en, this message translates to:
  /// **'Security'**
  String get profileSecurity;

  /// No description provided for @profileLogout.
  ///
  /// In en, this message translates to:
  /// **'Log Out'**
  String get profileLogout;

  /// No description provided for @profileFarmerDefault.
  ///
  /// In en, this message translates to:
  /// **'Farmer'**
  String get profileFarmerDefault;

  /// No description provided for @profileAssets.
  ///
  /// In en, this message translates to:
  /// **'Assets'**
  String get profileAssets;

  /// No description provided for @profileQuotes.
  ///
  /// In en, this message translates to:
  /// **'Quotes'**
  String get profileQuotes;

  /// No description provided for @profileOrders.
  ///
  /// In en, this message translates to:
  /// **'Orders'**
  String get profileOrders;

  /// No description provided for @profileSeasonGoal.
  ///
  /// In en, this message translates to:
  /// **'SEASON GOAL'**
  String get profileSeasonGoal;

  /// No description provided for @profileSacks.
  ///
  /// In en, this message translates to:
  /// **'2,400 Sacks'**
  String get profileSacks;

  /// No description provided for @profileGoalReached.
  ///
  /// In en, this message translates to:
  /// **'85% reached'**
  String get profileGoalReached;

  /// No description provided for @profileLogoutConfirm.
  ///
  /// In en, this message translates to:
  /// **'Do you want to log out?'**
  String get profileLogoutConfirm;

  /// No description provided for @profileLogoutMessage.
  ///
  /// In en, this message translates to:
  /// **'You will need to log in again to access iFarm.'**
  String get profileLogoutMessage;

  /// No description provided for @editProfileSuccess.
  ///
  /// In en, this message translates to:
  /// **'Profile updated successfully!'**
  String get editProfileSuccess;

  /// No description provided for @editProfileError.
  ///
  /// In en, this message translates to:
  /// **'Error saving profile. Try again.'**
  String get editProfileError;

  /// No description provided for @editProfileTitle.
  ///
  /// In en, this message translates to:
  /// **'Edit Profile'**
  String get editProfileTitle;

  /// No description provided for @editProfilePersonalData.
  ///
  /// In en, this message translates to:
  /// **'PERSONAL DATA'**
  String get editProfilePersonalData;

  /// No description provided for @editProfileFullName.
  ///
  /// In en, this message translates to:
  /// **'Full name'**
  String get editProfileFullName;

  /// No description provided for @editProfileFullNameHint.
  ///
  /// In en, this message translates to:
  /// **'Your full name'**
  String get editProfileFullNameHint;

  /// No description provided for @editProfileNameRequired.
  ///
  /// In en, this message translates to:
  /// **'Name is required'**
  String get editProfileNameRequired;

  /// No description provided for @editProfilePhone.
  ///
  /// In en, this message translates to:
  /// **'Phone / WhatsApp'**
  String get editProfilePhone;

  /// No description provided for @editProfilePhoneHint.
  ///
  /// In en, this message translates to:
  /// **'(00) 00000-0000'**
  String get editProfilePhoneHint;

  /// No description provided for @editProfilePhoneRequired.
  ///
  /// In en, this message translates to:
  /// **'Phone is required'**
  String get editProfilePhoneRequired;

  /// No description provided for @editProfilePhoneInvalid.
  ///
  /// In en, this message translates to:
  /// **'Invalid phone'**
  String get editProfilePhoneInvalid;

  /// No description provided for @editProfileCpf.
  ///
  /// In en, this message translates to:
  /// **'CPF'**
  String get editProfileCpf;

  /// No description provided for @editProfileCpfHint.
  ///
  /// In en, this message translates to:
  /// **'000.000.000-00'**
  String get editProfileCpfHint;

  /// No description provided for @editProfileFarm.
  ///
  /// In en, this message translates to:
  /// **'FARM'**
  String get editProfileFarm;

  /// No description provided for @editProfileFarmName.
  ///
  /// In en, this message translates to:
  /// **'Farm name'**
  String get editProfileFarmName;

  /// No description provided for @editProfileFarmNameHint.
  ///
  /// In en, this message translates to:
  /// **'E.g.: Santa Fé Farm'**
  String get editProfileFarmNameHint;

  /// No description provided for @editProfileState.
  ///
  /// In en, this message translates to:
  /// **'State'**
  String get editProfileState;

  /// No description provided for @editProfileSelectState.
  ///
  /// In en, this message translates to:
  /// **'Select the state'**
  String get editProfileSelectState;

  /// No description provided for @editProfileAddress.
  ///
  /// In en, this message translates to:
  /// **'Property Address'**
  String get editProfileAddress;

  /// No description provided for @editProfileAddressHint.
  ///
  /// In en, this message translates to:
  /// **'E.g.: Highway BR-163, km 45'**
  String get editProfileAddressHint;

  /// No description provided for @editProfileAdjustOnMap.
  ///
  /// In en, this message translates to:
  /// **'Adjust on Map'**
  String get editProfileAdjustOnMap;

  /// No description provided for @editProfileTotalArea.
  ///
  /// In en, this message translates to:
  /// **'Total area (ha)'**
  String get editProfileTotalArea;

  /// No description provided for @editProfileTotalAreaHint.
  ///
  /// In en, this message translates to:
  /// **'E.g.: 500'**
  String get editProfileTotalAreaHint;

  /// No description provided for @editProfileCrops.
  ///
  /// In en, this message translates to:
  /// **'Crops (comma separated)'**
  String get editProfileCrops;

  /// No description provided for @editProfileCropsHint.
  ///
  /// In en, this message translates to:
  /// **'E.g.: Soybean, Corn, Wheat'**
  String get editProfileCropsHint;

  /// No description provided for @editProfileSave.
  ///
  /// In en, this message translates to:
  /// **'Save Changes'**
  String get editProfileSave;

  /// No description provided for @editProfileChangePhoto.
  ///
  /// In en, this message translates to:
  /// **'CHANGE PHOTO'**
  String get editProfileChangePhoto;

  /// No description provided for @settingsTitle.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get settingsTitle;

  /// No description provided for @settingsPreferencesSaved.
  ///
  /// In en, this message translates to:
  /// **'Preferences saved!'**
  String get settingsPreferencesSaved;

  /// No description provided for @settingsPreferencesError.
  ///
  /// In en, this message translates to:
  /// **'Error saving preferences.'**
  String get settingsPreferencesError;

  /// No description provided for @settingsNewQuotes.
  ///
  /// In en, this message translates to:
  /// **'New quotes'**
  String get settingsNewQuotes;

  /// No description provided for @settingsProposalsReceived.
  ///
  /// In en, this message translates to:
  /// **'Proposals received'**
  String get settingsProposalsReceived;

  /// No description provided for @settingsOrderUpdates.
  ///
  /// In en, this message translates to:
  /// **'Order updates'**
  String get settingsOrderUpdates;

  /// No description provided for @settingsPaymentConfirmations.
  ///
  /// In en, this message translates to:
  /// **'Payment confirmations'**
  String get settingsPaymentConfirmations;

  /// No description provided for @settingsAppSection.
  ///
  /// In en, this message translates to:
  /// **'App'**
  String get settingsAppSection;

  /// No description provided for @settingsAppVersion.
  ///
  /// In en, this message translates to:
  /// **'App version'**
  String get settingsAppVersion;

  /// No description provided for @settingsAccountSection.
  ///
  /// In en, this message translates to:
  /// **'Account'**
  String get settingsAccountSection;

  /// No description provided for @settingsPrivacyPolicy.
  ///
  /// In en, this message translates to:
  /// **'Privacy Policy'**
  String get settingsPrivacyPolicy;

  /// No description provided for @settingsExportData.
  ///
  /// In en, this message translates to:
  /// **'Export my data'**
  String get settingsExportData;

  /// No description provided for @settingsDeleteAccount.
  ///
  /// In en, this message translates to:
  /// **'Delete account'**
  String get settingsDeleteAccount;

  /// No description provided for @settingsSavePreferences.
  ///
  /// In en, this message translates to:
  /// **'Save Preferences'**
  String get settingsSavePreferences;

  /// No description provided for @settingsDeleteAccountMessage.
  ///
  /// In en, this message translates to:
  /// **'To delete your account access the Privacy and LGPD section. The process is irreversible.'**
  String get settingsDeleteAccountMessage;

  /// No description provided for @settingsContinue.
  ///
  /// In en, this message translates to:
  /// **'Continue'**
  String get settingsContinue;

  /// No description provided for @privacyTitle.
  ///
  /// In en, this message translates to:
  /// **'Privacy'**
  String get privacyTitle;

  /// No description provided for @privacyYourRights.
  ///
  /// In en, this message translates to:
  /// **'Your LGPD Rights'**
  String get privacyYourRights;

  /// No description provided for @privacyConsents.
  ///
  /// In en, this message translates to:
  /// **'Consents'**
  String get privacyConsents;

  /// No description provided for @privacyTermsOfUse.
  ///
  /// In en, this message translates to:
  /// **'Terms of Use'**
  String get privacyTermsOfUse;

  /// No description provided for @privacyPrivacyPolicy.
  ///
  /// In en, this message translates to:
  /// **'Privacy Policy'**
  String get privacyPrivacyPolicy;

  /// No description provided for @privacyMarketingComms.
  ///
  /// In en, this message translates to:
  /// **'Marketing Communications'**
  String get privacyMarketingComms;

  /// No description provided for @privacyMarketingDesc.
  ///
  /// In en, this message translates to:
  /// **'Receive promotions and news from iFarm'**
  String get privacyMarketingDesc;

  /// No description provided for @privacyAcceptedOn.
  ///
  /// In en, this message translates to:
  /// **'Accepted on {date}'**
  String privacyAcceptedOn(String date);

  /// No description provided for @privacyStorageUsage.
  ///
  /// In en, this message translates to:
  /// **'STORAGE USAGE'**
  String get privacyStorageUsage;

  /// No description provided for @privacyExportData.
  ///
  /// In en, this message translates to:
  /// **'Export my data'**
  String get privacyExportData;

  /// No description provided for @privacyExportDataDesc.
  ///
  /// In en, this message translates to:
  /// **'Receive a JSON and CSV file with all your personal data stored on the iFarm platform.'**
  String get privacyExportDataDesc;

  /// No description provided for @privacyDangerZone.
  ///
  /// In en, this message translates to:
  /// **'Danger Zone'**
  String get privacyDangerZone;

  /// No description provided for @privacyDeleteAccount.
  ///
  /// In en, this message translates to:
  /// **'Delete my account'**
  String get privacyDeleteAccount;

  /// No description provided for @privacyDeleteAccountDesc.
  ///
  /// In en, this message translates to:
  /// **'Request permanent deletion of all your data. This action is irreversible and implies termination of active contracts.'**
  String get privacyDeleteAccountDesc;

  /// No description provided for @privacyRightAccess.
  ///
  /// In en, this message translates to:
  /// **'Access'**
  String get privacyRightAccess;

  /// No description provided for @privacyRightCorrection.
  ///
  /// In en, this message translates to:
  /// **'Correction'**
  String get privacyRightCorrection;

  /// No description provided for @privacyRightDeletion.
  ///
  /// In en, this message translates to:
  /// **'Deletion'**
  String get privacyRightDeletion;

  /// No description provided for @privacyRightPortability.
  ///
  /// In en, this message translates to:
  /// **'Portability'**
  String get privacyRightPortability;

  /// No description provided for @privacyRightRevocation.
  ///
  /// In en, this message translates to:
  /// **'Consent Revocation'**
  String get privacyRightRevocation;

  /// No description provided for @privacyExportError.
  ///
  /// In en, this message translates to:
  /// **'Error exporting data. Try again.'**
  String get privacyExportError;

  /// No description provided for @privacyStorageInfo.
  ///
  /// In en, this message translates to:
  /// **'{used} of {total} used'**
  String privacyStorageInfo(String used, String total);

  /// No description provided for @privacyCompanyInfo.
  ///
  /// In en, this message translates to:
  /// **'iFarm Tecnologia Ltda. • CNPJ 00.000.000/0001-00 • v{version}'**
  String privacyCompanyInfo(String version);

  /// No description provided for @notificationsTitle.
  ///
  /// In en, this message translates to:
  /// **'Notifications'**
  String get notificationsTitle;

  /// No description provided for @notificationsMarkAllRead.
  ///
  /// In en, this message translates to:
  /// **'Mark all as read'**
  String get notificationsMarkAllRead;

  /// No description provided for @notificationsError.
  ///
  /// In en, this message translates to:
  /// **'Error loading notifications.'**
  String get notificationsError;

  /// No description provided for @notificationsAllClear.
  ///
  /// In en, this message translates to:
  /// **'All clear here'**
  String get notificationsAllClear;

  /// No description provided for @notificationsAllClearHint.
  ///
  /// In en, this message translates to:
  /// **'You will be notified about quotes,\norders and payments here.'**
  String get notificationsAllClearHint;

  /// No description provided for @notificationsChipQuote.
  ///
  /// In en, this message translates to:
  /// **'Quote'**
  String get notificationsChipQuote;

  /// No description provided for @notificationsChipOrder.
  ///
  /// In en, this message translates to:
  /// **'Order'**
  String get notificationsChipOrder;

  /// No description provided for @notificationsChipPayment.
  ///
  /// In en, this message translates to:
  /// **'Payment'**
  String get notificationsChipPayment;

  /// No description provided for @notificationsChipDelivery.
  ///
  /// In en, this message translates to:
  /// **'Delivery'**
  String get notificationsChipDelivery;

  /// No description provided for @notificationsChipKyc.
  ///
  /// In en, this message translates to:
  /// **'KYC'**
  String get notificationsChipKyc;

  /// No description provided for @notificationsChipSystem.
  ///
  /// In en, this message translates to:
  /// **'System'**
  String get notificationsChipSystem;

  /// No description provided for @notificationsGroupToday.
  ///
  /// In en, this message translates to:
  /// **'Today'**
  String get notificationsGroupToday;

  /// No description provided for @notificationsGroupYesterday.
  ///
  /// In en, this message translates to:
  /// **'Yesterday'**
  String get notificationsGroupYesterday;

  /// No description provided for @notificationsGroupThisWeek.
  ///
  /// In en, this message translates to:
  /// **'This week'**
  String get notificationsGroupThisWeek;

  /// No description provided for @notificationsGroupOlder.
  ///
  /// In en, this message translates to:
  /// **'Older'**
  String get notificationsGroupOlder;

  /// No description provided for @quoteStatusOpen.
  ///
  /// In en, this message translates to:
  /// **'Open'**
  String get quoteStatusOpen;

  /// No description provided for @quoteStatusInProposals.
  ///
  /// In en, this message translates to:
  /// **'With Proposals'**
  String get quoteStatusInProposals;

  /// No description provided for @quoteStatusAccepted.
  ///
  /// In en, this message translates to:
  /// **'Accepted'**
  String get quoteStatusAccepted;

  /// No description provided for @quoteStatusExpired.
  ///
  /// In en, this message translates to:
  /// **'Expired'**
  String get quoteStatusExpired;

  /// No description provided for @quoteStatusCancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled'**
  String get quoteStatusCancelled;

  /// No description provided for @orderStatusAwaitingPayment.
  ///
  /// In en, this message translates to:
  /// **'Awaiting Payment'**
  String get orderStatusAwaitingPayment;

  /// No description provided for @orderStatusPaid.
  ///
  /// In en, this message translates to:
  /// **'Paid'**
  String get orderStatusPaid;

  /// No description provided for @orderStatusPreparing.
  ///
  /// In en, this message translates to:
  /// **'Preparing'**
  String get orderStatusPreparing;

  /// No description provided for @orderStatusDispatched.
  ///
  /// In en, this message translates to:
  /// **'Dispatched'**
  String get orderStatusDispatched;

  /// No description provided for @orderStatusDelivered.
  ///
  /// In en, this message translates to:
  /// **'Delivered'**
  String get orderStatusDelivered;

  /// No description provided for @orderStatusDisputed.
  ///
  /// In en, this message translates to:
  /// **'Disputed'**
  String get orderStatusDisputed;

  /// No description provided for @orderStatusCancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled'**
  String get orderStatusCancelled;

  /// No description provided for @orderStatusRefunded.
  ///
  /// In en, this message translates to:
  /// **'Refunded'**
  String get orderStatusRefunded;

  /// No description provided for @paymentMethodPix.
  ///
  /// In en, this message translates to:
  /// **'PIX'**
  String get paymentMethodPix;

  /// No description provided for @paymentMethodBoleto.
  ///
  /// In en, this message translates to:
  /// **'Boleto'**
  String get paymentMethodBoleto;

  /// No description provided for @paymentMethodCreditCard.
  ///
  /// In en, this message translates to:
  /// **'Credit Card'**
  String get paymentMethodCreditCard;

  /// No description provided for @paymentMethodRuralCredit.
  ///
  /// In en, this message translates to:
  /// **'Rural Credit'**
  String get paymentMethodRuralCredit;

  /// No description provided for @deliveryModeAddress.
  ///
  /// In en, this message translates to:
  /// **'Delivery to Address'**
  String get deliveryModeAddress;

  /// No description provided for @deliveryModeGeolocation.
  ///
  /// In en, this message translates to:
  /// **'GPS Delivery'**
  String get deliveryModeGeolocation;

  /// No description provided for @deliveryModeStorePickup.
  ///
  /// In en, this message translates to:
  /// **'Store Pickup'**
  String get deliveryModeStorePickup;

  /// No description provided for @kycStatusNotStarted.
  ///
  /// In en, this message translates to:
  /// **'Not Started'**
  String get kycStatusNotStarted;

  /// No description provided for @kycStatusDocumentsSubmitted.
  ///
  /// In en, this message translates to:
  /// **'Documents Submitted'**
  String get kycStatusDocumentsSubmitted;

  /// No description provided for @kycStatusUnderReview.
  ///
  /// In en, this message translates to:
  /// **'Under Review'**
  String get kycStatusUnderReview;

  /// No description provided for @kycStatusApproved.
  ///
  /// In en, this message translates to:
  /// **'Approved'**
  String get kycStatusApproved;

  /// No description provided for @kycStatusRejected.
  ///
  /// In en, this message translates to:
  /// **'Rejected'**
  String get kycStatusRejected;

  /// No description provided for @kycStatusResubmissionRequired.
  ///
  /// In en, this message translates to:
  /// **'Resubmission Required'**
  String get kycStatusResubmissionRequired;

  /// No description provided for @recurringFrequencyWeekly.
  ///
  /// In en, this message translates to:
  /// **'Weekly'**
  String get recurringFrequencyWeekly;

  /// No description provided for @recurringFrequencyBiweekly.
  ///
  /// In en, this message translates to:
  /// **'Biweekly'**
  String get recurringFrequencyBiweekly;

  /// No description provided for @recurringFrequencyMonthly.
  ///
  /// In en, this message translates to:
  /// **'Monthly'**
  String get recurringFrequencyMonthly;

  /// No description provided for @recurringFrequencyCustom.
  ///
  /// In en, this message translates to:
  /// **'Custom'**
  String get recurringFrequencyCustom;

  /// No description provided for @recurringStatusActive.
  ///
  /// In en, this message translates to:
  /// **'Active'**
  String get recurringStatusActive;

  /// No description provided for @recurringStatusPaused.
  ///
  /// In en, this message translates to:
  /// **'Paused'**
  String get recurringStatusPaused;

  /// No description provided for @recurringStatusCancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled'**
  String get recurringStatusCancelled;

  /// No description provided for @productCategoryFertilizers.
  ///
  /// In en, this message translates to:
  /// **'Fertilizers'**
  String get productCategoryFertilizers;

  /// No description provided for @productCategoryPesticides.
  ///
  /// In en, this message translates to:
  /// **'Pesticides'**
  String get productCategoryPesticides;

  /// No description provided for @productCategorySeeds.
  ///
  /// In en, this message translates to:
  /// **'Seeds'**
  String get productCategorySeeds;

  /// No description provided for @productCategoryMachinery.
  ///
  /// In en, this message translates to:
  /// **'Machinery'**
  String get productCategoryMachinery;

  /// No description provided for @productCategoryIrrigation.
  ///
  /// In en, this message translates to:
  /// **'Irrigation'**
  String get productCategoryIrrigation;

  /// No description provided for @productCategoryAnimalNutrition.
  ///
  /// In en, this message translates to:
  /// **'Animal Nutrition'**
  String get productCategoryAnimalNutrition;

  /// No description provided for @productCategoryPpeSafety.
  ///
  /// In en, this message translates to:
  /// **'PPE'**
  String get productCategoryPpeSafety;

  /// No description provided for @productCategoryVeterinary.
  ///
  /// In en, this message translates to:
  /// **'Veterinary'**
  String get productCategoryVeterinary;

  /// No description provided for @productCategoryOther.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get productCategoryOther;

  /// No description provided for @kycDocTypeFront.
  ///
  /// In en, this message translates to:
  /// **'ID (Front)'**
  String get kycDocTypeFront;

  /// No description provided for @kycDocTypeBack.
  ///
  /// In en, this message translates to:
  /// **'ID (Back)'**
  String get kycDocTypeBack;

  /// No description provided for @kycDocTypeAddress.
  ///
  /// In en, this message translates to:
  /// **'Proof of Address'**
  String get kycDocTypeAddress;

  /// No description provided for @kycDocTypeRural.
  ///
  /// In en, this message translates to:
  /// **'Rural Producer Doc.'**
  String get kycDocTypeRural;

  /// No description provided for @validatorRequired.
  ///
  /// In en, this message translates to:
  /// **'{field} is required'**
  String validatorRequired(String field);

  /// No description provided for @validatorFieldDefault.
  ///
  /// In en, this message translates to:
  /// **'Field'**
  String get validatorFieldDefault;

  /// No description provided for @validatorEmailRequired.
  ///
  /// In en, this message translates to:
  /// **'Email is required'**
  String get validatorEmailRequired;

  /// No description provided for @validatorEmailInvalid.
  ///
  /// In en, this message translates to:
  /// **'Invalid email'**
  String get validatorEmailInvalid;

  /// No description provided for @validatorPasswordRequired.
  ///
  /// In en, this message translates to:
  /// **'Password is required'**
  String get validatorPasswordRequired;

  /// No description provided for @validatorPasswordMinLength.
  ///
  /// In en, this message translates to:
  /// **'Password must have at least 8 characters'**
  String get validatorPasswordMinLength;

  /// No description provided for @validatorCpfRequired.
  ///
  /// In en, this message translates to:
  /// **'CPF is required'**
  String get validatorCpfRequired;

  /// No description provided for @validatorCpfInvalid.
  ///
  /// In en, this message translates to:
  /// **'Invalid CPF'**
  String get validatorCpfInvalid;

  /// No description provided for @validatorCnpjRequired.
  ///
  /// In en, this message translates to:
  /// **'CNPJ is required'**
  String get validatorCnpjRequired;

  /// No description provided for @validatorCnpjInvalid.
  ///
  /// In en, this message translates to:
  /// **'Invalid CNPJ'**
  String get validatorCnpjInvalid;

  /// No description provided for @validatorFederalTaxIdRequired.
  ///
  /// In en, this message translates to:
  /// **'CPF/CNPJ is required'**
  String get validatorFederalTaxIdRequired;

  /// No description provided for @validatorFederalTaxIdInvalid.
  ///
  /// In en, this message translates to:
  /// **'Invalid CPF/CNPJ'**
  String get validatorFederalTaxIdInvalid;

  /// No description provided for @validatorPhoneRequired.
  ///
  /// In en, this message translates to:
  /// **'Phone is required'**
  String get validatorPhoneRequired;

  /// No description provided for @validatorPhoneInvalid.
  ///
  /// In en, this message translates to:
  /// **'Invalid phone'**
  String get validatorPhoneInvalid;

  /// No description provided for @validatorNcmRequired.
  ///
  /// In en, this message translates to:
  /// **'NCM is required'**
  String get validatorNcmRequired;

  /// No description provided for @validatorNcmInvalid.
  ///
  /// In en, this message translates to:
  /// **'NCM must have 8 digits'**
  String get validatorNcmInvalid;

  /// No description provided for @validatorMinLength.
  ///
  /// In en, this message translates to:
  /// **'{field} must have at least {min} characters'**
  String validatorMinLength(String field, int min);

  /// No description provided for @validatorMaxLength.
  ///
  /// In en, this message translates to:
  /// **'{field} must have at most {max} characters'**
  String validatorMaxLength(String field, int max);

  /// No description provided for @validatorDisputeReasonRequired.
  ///
  /// In en, this message translates to:
  /// **'Reason is required'**
  String get validatorDisputeReasonRequired;

  /// No description provided for @validatorDisputeReasonMinLength.
  ///
  /// In en, this message translates to:
  /// **'Describe the issue with at least 20 characters'**
  String get validatorDisputeReasonMinLength;

  /// No description provided for @timeAgoNow.
  ///
  /// In en, this message translates to:
  /// **'Now'**
  String get timeAgoNow;

  /// No description provided for @timeAgoMinutes.
  ///
  /// In en, this message translates to:
  /// **'{minutes}min ago'**
  String timeAgoMinutes(int minutes);

  /// No description provided for @timeAgoHours.
  ///
  /// In en, this message translates to:
  /// **'{hours}h ago'**
  String timeAgoHours(int hours);

  /// No description provided for @timeAgoDays.
  ///
  /// In en, this message translates to:
  /// **'{days}d ago'**
  String timeAgoDays(int days);

  /// No description provided for @badgeNcm.
  ///
  /// In en, this message translates to:
  /// **'NCM {code}'**
  String badgeNcm(String code);

  /// No description provided for @badgeRuralCredit.
  ///
  /// In en, this message translates to:
  /// **'Rural Credit'**
  String get badgeRuralCredit;

  /// No description provided for @editProfilePropertyName.
  ///
  /// In en, this message translates to:
  /// **'Property name'**
  String get editProfilePropertyName;

  /// No description provided for @errorCheckConnection.
  ///
  /// In en, this message translates to:
  /// **'Check your connection and try again'**
  String get errorCheckConnection;

  /// No description provided for @notificationsEmpty.
  ///
  /// In en, this message translates to:
  /// **'All clear!'**
  String get notificationsEmpty;

  /// No description provided for @notificationsEmptyHint.
  ///
  /// In en, this message translates to:
  /// **'You have no notifications'**
  String get notificationsEmptyHint;

  /// No description provided for @notificationsOlder.
  ///
  /// In en, this message translates to:
  /// **'Older'**
  String get notificationsOlder;

  /// No description provided for @notificationsOrders.
  ///
  /// In en, this message translates to:
  /// **'Orders'**
  String get notificationsOrders;

  /// No description provided for @notificationsQuotes.
  ///
  /// In en, this message translates to:
  /// **'Quotes'**
  String get notificationsQuotes;

  /// No description provided for @notificationsSystem.
  ///
  /// In en, this message translates to:
  /// **'System'**
  String get notificationsSystem;

  /// No description provided for @notificationsThisWeek.
  ///
  /// In en, this message translates to:
  /// **'This week'**
  String get notificationsThisWeek;

  /// No description provided for @notificationsToday.
  ///
  /// In en, this message translates to:
  /// **'Today'**
  String get notificationsToday;

  /// No description provided for @orderDetailCreatedAt.
  ///
  /// In en, this message translates to:
  /// **'Created'**
  String get orderDetailCreatedAt;

  /// No description provided for @orderDetailDelivered.
  ///
  /// In en, this message translates to:
  /// **'Delivered'**
  String get orderDetailDelivered;

  /// No description provided for @orderDetailDisputeHint.
  ///
  /// In en, this message translates to:
  /// **'Describe the issue with your order'**
  String get orderDetailDisputeHint;

  /// No description provided for @orderDetailFreight.
  ///
  /// In en, this message translates to:
  /// **'Freight'**
  String get orderDetailFreight;

  /// No description provided for @orderDetailItems.
  ///
  /// In en, this message translates to:
  /// **'Items'**
  String get orderDetailItems;

  /// No description provided for @orderDetailPaymentConfirmed.
  ///
  /// In en, this message translates to:
  /// **'Payment confirmed'**
  String get orderDetailPaymentConfirmed;

  /// No description provided for @orderDetailShipped.
  ///
  /// In en, this message translates to:
  /// **'Shipped'**
  String get orderDetailShipped;

  /// No description provided for @orderDetailStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get orderDetailStatus;

  /// No description provided for @orderDetailSubmitDispute.
  ///
  /// In en, this message translates to:
  /// **'Submit dispute'**
  String get orderDetailSubmitDispute;

  /// No description provided for @orderDetailSubtotal.
  ///
  /// In en, this message translates to:
  /// **'Subtotal'**
  String get orderDetailSubtotal;

  /// No description provided for @orderDetailSummary.
  ///
  /// In en, this message translates to:
  /// **'Summary'**
  String get orderDetailSummary;

  /// No description provided for @orderDetailTaxes.
  ///
  /// In en, this message translates to:
  /// **'Taxes'**
  String get orderDetailTaxes;

  /// No description provided for @orderDetailTotal.
  ///
  /// In en, this message translates to:
  /// **'Total'**
  String get orderDetailTotal;

  /// No description provided for @ordersEmpty.
  ///
  /// In en, this message translates to:
  /// **'No orders yet'**
  String get ordersEmpty;

  /// No description provided for @ordersTabCancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled'**
  String get ordersTabCancelled;

  /// No description provided for @ordersTabInProgress.
  ///
  /// In en, this message translates to:
  /// **'In progress'**
  String get ordersTabInProgress;

  /// No description provided for @paymentBarcodeCopied.
  ///
  /// In en, this message translates to:
  /// **'Barcode copied!'**
  String get paymentBarcodeCopied;

  /// No description provided for @paymentCopyBarcode.
  ///
  /// In en, this message translates to:
  /// **'Copy barcode'**
  String get paymentCopyBarcode;

  /// No description provided for @paymentDueDate.
  ///
  /// In en, this message translates to:
  /// **'Due date'**
  String get paymentDueDate;

  /// No description provided for @paymentExpiresIn.
  ///
  /// In en, this message translates to:
  /// **'Expires in'**
  String get paymentExpiresIn;

  /// No description provided for @paymentTitle.
  ///
  /// In en, this message translates to:
  /// **'Payment'**
  String get paymentTitle;

  /// No description provided for @paymentViaBoleto.
  ///
  /// In en, this message translates to:
  /// **'Pay via Boleto'**
  String get paymentViaBoleto;

  /// No description provided for @privacyDeleteAccountButton.
  ///
  /// In en, this message translates to:
  /// **'Delete account'**
  String get privacyDeleteAccountButton;

  /// No description provided for @privacyMarketing.
  ///
  /// In en, this message translates to:
  /// **'Marketing'**
  String get privacyMarketing;

  /// No description provided for @productDetailDefaultDescription.
  ///
  /// In en, this message translates to:
  /// **'No description available'**
  String get productDetailDefaultDescription;

  /// No description provided for @productDetailRegionalDemandIndex.
  ///
  /// In en, this message translates to:
  /// **'Regional demand index'**
  String get productDetailRegionalDemandIndex;

  /// No description provided for @productDetailRetry.
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get productDetailRetry;

  /// No description provided for @productDetailTechnicalInfo.
  ///
  /// In en, this message translates to:
  /// **'Technical information'**
  String get productDetailTechnicalInfo;

  /// No description provided for @productDetailWarrantyDescription.
  ///
  /// In en, this message translates to:
  /// **'Product covered by manufacturer warranty'**
  String get productDetailWarrantyDescription;

  /// No description provided for @productDetailWarrantyTitle.
  ///
  /// In en, this message translates to:
  /// **'Warranty'**
  String get productDetailWarrantyTitle;

  /// No description provided for @productSearchAvailableProducts.
  ///
  /// In en, this message translates to:
  /// **'Available products'**
  String get productSearchAvailableProducts;

  /// No description provided for @productSearchDefaultUnit.
  ///
  /// In en, this message translates to:
  /// **'unit'**
  String get productSearchDefaultUnit;

  /// No description provided for @productSearchEmpty.
  ///
  /// In en, this message translates to:
  /// **'No products found'**
  String get productSearchEmpty;

  /// No description provided for @productSearchEmptyHint.
  ///
  /// In en, this message translates to:
  /// **'Try adjusting your filters'**
  String get productSearchEmptyHint;

  /// No description provided for @productSearchHeroTitle.
  ///
  /// In en, this message translates to:
  /// **'Find the best agricultural products'**
  String get productSearchHeroTitle;

  /// No description provided for @productSearchLoadError.
  ///
  /// In en, this message translates to:
  /// **'Error loading products'**
  String get productSearchLoadError;

  /// No description provided for @productSearchPriceOnRequest.
  ///
  /// In en, this message translates to:
  /// **'Price on request'**
  String get productSearchPriceOnRequest;

  /// No description provided for @productSearchRetry.
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get productSearchRetry;

  /// No description provided for @productSearchRuralCreditLabel.
  ///
  /// In en, this message translates to:
  /// **'Accepts rural credit'**
  String get productSearchRuralCreditLabel;

  /// No description provided for @profileCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get profileCancel;

  /// No description provided for @profileConfirm.
  ///
  /// In en, this message translates to:
  /// **'Confirm'**
  String get profileConfirm;

  /// No description provided for @profilePrivacy.
  ///
  /// In en, this message translates to:
  /// **'Privacy'**
  String get profilePrivacy;

  /// No description provided for @proposalComparisonBestPrice.
  ///
  /// In en, this message translates to:
  /// **'Best price'**
  String get proposalComparisonBestPrice;

  /// No description provided for @proposalComparisonDeliveryTime.
  ///
  /// In en, this message translates to:
  /// **'Delivery time'**
  String get proposalComparisonDeliveryTime;

  /// No description provided for @proposalComparisonEstimatedSavingsGeneric.
  ///
  /// In en, this message translates to:
  /// **'Compare proposals to find savings'**
  String get proposalComparisonEstimatedSavingsGeneric;

  /// No description provided for @proposalComparisonFreight.
  ///
  /// In en, this message translates to:
  /// **'Freight'**
  String get proposalComparisonFreight;

  /// No description provided for @proposalComparisonSelect.
  ///
  /// In en, this message translates to:
  /// **'Select'**
  String get proposalComparisonSelect;

  /// No description provided for @proposalComparisonTotalPrice.
  ///
  /// In en, this message translates to:
  /// **'Total price'**
  String get proposalComparisonTotalPrice;

  /// No description provided for @proposalDetailAccept.
  ///
  /// In en, this message translates to:
  /// **'Accept'**
  String get proposalDetailAccept;

  /// No description provided for @proposalDetailAcceptSuccess.
  ///
  /// In en, this message translates to:
  /// **'Proposal accepted successfully!'**
  String get proposalDetailAcceptSuccess;

  /// No description provided for @proposalDetailCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get proposalDetailCancel;

  /// No description provided for @proposalDetailConfirm.
  ///
  /// In en, this message translates to:
  /// **'Confirm'**
  String get proposalDetailConfirm;

  /// No description provided for @proposalDetailConfirmAccept.
  ///
  /// In en, this message translates to:
  /// **'Confirm acceptance?'**
  String get proposalDetailConfirmAccept;

  /// No description provided for @proposalDetailFreeShipping.
  ///
  /// In en, this message translates to:
  /// **'Free shipping'**
  String get proposalDetailFreeShipping;

  /// No description provided for @proposalDetailObservations.
  ///
  /// In en, this message translates to:
  /// **'Observations'**
  String get proposalDetailObservations;

  /// No description provided for @proposalDetailSubtotal.
  ///
  /// In en, this message translates to:
  /// **'Subtotal'**
  String get proposalDetailSubtotal;

  /// No description provided for @proposalDetailTaxes.
  ///
  /// In en, this message translates to:
  /// **'Taxes'**
  String get proposalDetailTaxes;

  /// No description provided for @proposalDetailTotal.
  ///
  /// In en, this message translates to:
  /// **'Total'**
  String get proposalDetailTotal;

  /// No description provided for @quoteBuilderDeliveryAddress.
  ///
  /// In en, this message translates to:
  /// **'Delivery address'**
  String get quoteBuilderDeliveryAddress;

  /// No description provided for @quoteBuilderPaymentCondition.
  ///
  /// In en, this message translates to:
  /// **'Payment condition'**
  String get quoteBuilderPaymentCondition;

  /// No description provided for @quoteBuilderSubmit.
  ///
  /// In en, this message translates to:
  /// **'Submit quote'**
  String get quoteBuilderSubmit;

  /// No description provided for @quoteDetailCompareProposals.
  ///
  /// In en, this message translates to:
  /// **'Compare proposals'**
  String get quoteDetailCompareProposals;

  /// No description provided for @quoteDetailExpiration.
  ///
  /// In en, this message translates to:
  /// **'Expiration'**
  String get quoteDetailExpiration;

  /// No description provided for @quoteDetailItems.
  ///
  /// In en, this message translates to:
  /// **'Items'**
  String get quoteDetailItems;

  /// No description provided for @recurringQuotesNew.
  ///
  /// In en, this message translates to:
  /// **'New recurring quote'**
  String get recurringQuotesNew;

  /// No description provided for @recurringQuotesProductLabel.
  ///
  /// In en, this message translates to:
  /// **'Product'**
  String get recurringQuotesProductLabel;

  /// No description provided for @recurringQuotesQuantityLabel.
  ///
  /// In en, this message translates to:
  /// **'Quantity'**
  String get recurringQuotesQuantityLabel;

  /// No description provided for @settingsNotifications.
  ///
  /// In en, this message translates to:
  /// **'Notifications'**
  String get settingsNotifications;

  /// No description provided for @settingsOrderAlerts.
  ///
  /// In en, this message translates to:
  /// **'Order alerts'**
  String get settingsOrderAlerts;

  /// No description provided for @settingsQuoteAlerts.
  ///
  /// In en, this message translates to:
  /// **'Quote alerts'**
  String get settingsQuoteAlerts;

  /// No description provided for @paymentCopyPixKey.
  ///
  /// In en, this message translates to:
  /// **'Copy PIX key'**
  String get paymentCopyPixKey;

  /// No description provided for @paymentPixKeyCopied.
  ///
  /// In en, this message translates to:
  /// **'PIX key copied!'**
  String get paymentPixKeyCopied;

  /// No description provided for @quoteBuilderSuccess.
  ///
  /// In en, this message translates to:
  /// **'Quote submitted successfully!'**
  String get quoteBuilderSuccess;

  /// No description provided for @myQuotesItemCount.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, =1{1 item} other{{count} items}}'**
  String myQuotesItemCount(int count);

  /// No description provided for @proposalComparisonDays.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, =1{1 day} other{{count} days}}'**
  String proposalComparisonDays(int count);

  /// No description provided for @proposalComparisonEstimatedSavings.
  ///
  /// In en, this message translates to:
  /// **'Estimated savings: {value}'**
  String proposalComparisonEstimatedSavings(String value);

  /// No description provided for @proposalDetailBusinessDays.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, =1{1 business day} other{{count} business days}}'**
  String proposalDetailBusinessDays(int count);

  /// No description provided for @quoteBuilderItemCount.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, =1{1 item} other{{count} items}}'**
  String quoteBuilderItemCount(int count);

  /// No description provided for @geoTitle.
  ///
  /// In en, this message translates to:
  /// **'Smart Location'**
  String get geoTitle;

  /// No description provided for @geoAllow.
  ///
  /// In en, this message translates to:
  /// **'Allow Location'**
  String get geoAllow;

  /// No description provided for @geoSkip.
  ///
  /// In en, this message translates to:
  /// **'Not now'**
  String get geoSkip;

  /// No description provided for @geoPrivacy.
  ///
  /// In en, this message translates to:
  /// **'PRIVACY PROTECTED'**
  String get geoPrivacy;

  /// No description provided for @geoDescPart1.
  ///
  /// In en, this message translates to:
  /// **'So that '**
  String get geoDescPart1;

  /// No description provided for @geoDescHighlight1.
  ///
  /// In en, this message translates to:
  /// **'iFarm'**
  String get geoDescHighlight1;

  /// No description provided for @geoDescPart2.
  ///
  /// In en, this message translates to:
  /// **' can find the best suppliers near you and calculate freight with '**
  String get geoDescPart2;

  /// No description provided for @geoDescHighlight2.
  ///
  /// In en, this message translates to:
  /// **'surgical precision'**
  String get geoDescHighlight2;

  /// No description provided for @geoDescPart3.
  ///
  /// In en, this message translates to:
  /// **', we need your location.'**
  String get geoDescPart3;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'pt'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'pt':
      return AppLocalizationsPt();
  }

  throw FlutterError(
      'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
      'an issue with the localizations generation tool. Please file an issue '
      'on GitHub with a reproducible sample app and the gen-l10n configuration '
      'that was used.');
}
