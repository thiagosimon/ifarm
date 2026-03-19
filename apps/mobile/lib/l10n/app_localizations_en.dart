// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appName => 'iFarm';

  @override
  String get tryAgain => 'Try Again';

  @override
  String get cancel => 'Cancel';

  @override
  String get confirm => 'Confirm';

  @override
  String get save => 'Save';

  @override
  String get send => 'Send';

  @override
  String get errorGeneric => 'Something went wrong';

  @override
  String get errorGenericMessage => 'Check your connection and try again.';

  @override
  String get errorUnknown => 'Unknown error';

  @override
  String get errorTimeout => 'Connection timed out. Check your internet.';

  @override
  String get errorNoConnection => 'No internet connection.';

  @override
  String get errorSomethingWrong => 'Something went wrong. Try again.';

  @override
  String get subtotal => 'Subtotal';

  @override
  String get total => 'TOTAL';

  @override
  String get freight => 'Freight';

  @override
  String get free => 'Free';

  @override
  String get businessDays => 'business days';

  @override
  String get toNegotiate => 'To be arranged';

  @override
  String get navHome => 'Home';

  @override
  String get navQuotes => 'Quotes';

  @override
  String get navOrders => 'Orders';

  @override
  String get navAlerts => 'Alerts';

  @override
  String get navProfile => 'Profile';

  @override
  String get welcomeSlideTitle1 => 'Buy at the\nbest price';

  @override
  String get welcomeSlideDesc1 =>
      'Access a global network of agricultural suppliers straight from your phone.';

  @override
  String get welcomeSlideTitle2 => 'Receive multiple\nquotations';

  @override
  String get welcomeSlideDesc2 =>
      'Compare offers in real time and ensure the best profitability for your harvest.';

  @override
  String get welcomeSlideTitle3 => 'Manage\nfrom the field';

  @override
  String get welcomeSlideDesc3 =>
      'All input and logistics management in the palm of your hand, wherever you are.';

  @override
  String get welcomeCreateAccount => 'Create Account';

  @override
  String get welcomeLogin => 'Log In';

  @override
  String get welcomeTagline => 'THE DIGITAL MARKETPLACE OF AGRIBUSINESS';

  @override
  String get loginSubtitle => 'Manage your assets with digital precision.';

  @override
  String get loginEmail => 'E-mail';

  @override
  String get loginPassword => 'Password';

  @override
  String get loginForgotPassword => 'Forgot password?';

  @override
  String get loginButton => 'Log In';

  @override
  String get loginOrAccessWith => 'Or access with';

  @override
  String get loginGoogle => 'Google';

  @override
  String get loginBiometrics => 'Biometrics';

  @override
  String get loginNoAccount => 'Don\'t have an account yet? ';

  @override
  String get loginCreateAccount => 'Create account';

  @override
  String get registrationTitle => 'Create Account';

  @override
  String get registrationPersonalData => 'Personal Data';

  @override
  String get registrationFullName => 'Full name';

  @override
  String get registrationCpf => 'CPF';

  @override
  String get registrationEmail => 'E-mail';

  @override
  String get registrationPhone => 'Phone';

  @override
  String get registrationPassword => 'Password';

  @override
  String get registrationPropertyDetails => 'Property Details';

  @override
  String get registrationPropertyName => 'Property name';

  @override
  String get registrationTotalArea => 'Total area (ha)';

  @override
  String get registrationZipCode => 'ZIP Code';

  @override
  String get registrationState => 'State';

  @override
  String get registrationSelectState => 'Select a state';

  @override
  String get registrationGpsCoordinates => 'GPS Coordinates';

  @override
  String get registrationTapToCapture => 'Tap to capture location';

  @override
  String get registrationCapture => 'CAPTURE';

  @override
  String get registrationTermsTitle => 'Terms and Privacy';

  @override
  String get registrationAcceptTerms =>
      'I accept the Terms of Use. I understand how my data will be processed in accordance with LGPD guidelines.';

  @override
  String get registrationReadTerms => 'Read Terms of Use';

  @override
  String get registrationMarketingConsent =>
      'I want to receive quotation reports and agribusiness news via Email and WhatsApp.';

  @override
  String get registrationCreateAccountButton => 'Create Account';

  @override
  String get registrationLoginButton => 'Log In';

  @override
  String get registrationAcceptTermsError =>
      'Accept the Terms of Use to continue.';

  @override
  String get homeGreeting => 'Good morning,';

  @override
  String homeHello(String firstName) {
    return 'Hello, $firstName!';
  }

  @override
  String get homeFarmerDefault => 'Farmer';

  @override
  String get homeSearchPlaceholder => 'Search inputs, machines or orders...';

  @override
  String get homeNewQuote => 'New Quote';

  @override
  String get homeMyQuotes => 'My Quotes';

  @override
  String get homeMyOrders => 'My Orders';

  @override
  String get homeRecurring => 'Recurring';

  @override
  String get homeCategories => 'Categories';

  @override
  String get homeViewAll => 'View All';

  @override
  String get homeViewAllCaps => 'VIEW ALL';

  @override
  String get homeRecentQuotes => 'Recent Quotes';

  @override
  String get homeViewAllQuotes => 'View All';

  @override
  String get homeCategoryAll => 'All';

  @override
  String get homeCategoryPesticides => 'Pesticides';

  @override
  String get homeCategorySeeds => 'Seeds';

  @override
  String get homeCategoryNutrition => 'Nutrition';

  @override
  String get homeCategoryMachinery => 'Machinery';

  @override
  String get homeCategoryIrrigation => 'Irrigation';

  @override
  String homeItemCount(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count items',
      one: '1 item',
    );
    return '$_temp0';
  }

  @override
  String get splashDigitalEstate => 'DIGITAL ESTATE';

  @override
  String get splashStartingSeason => 'STARTING SEASON';

  @override
  String get kycIdFront => 'ID (Front)';

  @override
  String get kycIdFrontDesc => 'National ID or Driver\'s License (front)';

  @override
  String get kycIdBack => 'ID (Back)';

  @override
  String get kycIdBackDesc => 'National ID or Driver\'s License (back)';

  @override
  String get kycAddressProof => 'Proof of Address';

  @override
  String get kycAddressProofDesc => 'Utility Bill';

  @override
  String get kycRuralDoc => 'Rural Producer Doc.';

  @override
  String get kycRuralDocDesc => 'State registration or DAP';

  @override
  String get kycDocumentSentSuccess => 'Document sent successfully!';

  @override
  String get kycDocumentSentError => 'Error sending document.';

  @override
  String get kycCamera => 'Camera';

  @override
  String get kycGallery => 'Gallery';

  @override
  String get kycIdentityVerified => 'Identity Verified';

  @override
  String get kycUnderReview => 'Under review';

  @override
  String get kycDocumentCenter => 'Document Center';

  @override
  String get kycDocumentCenterDesc =>
      'Keep your property compliant and up to date.';

  @override
  String get kycSent => 'sent';

  @override
  String get kycRealtimeAnalysis => 'Real-time analysis · 4 business hours';

  @override
  String get kycResend => 'Resend';

  @override
  String get kycSendButton => 'Send';

  @override
  String get kycContinue => 'Continue';

  @override
  String get productSearchTitle => 'Find the best\nfor your harvest.';

  @override
  String get productSearchPlaceholder => 'Search pesticides, seeds...';

  @override
  String get productSearchFilters => 'Filters';

  @override
  String get productSearchRuralCredit => 'RURAL CREDIT';

  @override
  String get productSearchEligible => 'Eligible';

  @override
  String get productSearchAll => 'All';

  @override
  String get productSearchApplyFilters => 'Apply Filters';

  @override
  String get productSearchAvailable => 'AVAILABLE PRODUCTS';

  @override
  String get productSearchError => 'Error loading products';

  @override
  String get productSearchNoResults => 'No product found';

  @override
  String get productSearchNoResultsHint => 'Try other terms or remove filters';

  @override
  String get productSearchAddedToQuote => 'Added to quote';

  @override
  String get productDetailError => 'Error loading product';

  @override
  String get productDetailRuralCredit => 'RURAL CREDIT';

  @override
  String get productDetailPriceOnRequest => 'Price on request';

  @override
  String get productDetailAvailable => 'Available';

  @override
  String get productDetailDemandIndex => 'REGIONAL DEMAND INDEX';

  @override
  String get productDetailDescription => 'ASSET DESCRIPTION';

  @override
  String get productDetailDefaultDesc => 'Premium product for your harvest.';

  @override
  String get productDetailSpecs => 'SPECIFICATIONS';

  @override
  String get productDetailGuarantee => 'iFarm Guarantee';

  @override
  String get productDetailInspection =>
      'Certified technical inspection included';

  @override
  String get productDetailAddToQuote => 'Add to Quote';

  @override
  String get productDetailAddedToQuote => 'Added to quote';

  @override
  String get quoteBuilderPaymentPix => 'PIX · immediate';

  @override
  String get quoteBuilderPaymentRural => 'Rural Credit · approval 48h';

  @override
  String get quoteBuilderPaymentBoleto => 'Boleto · 30/60 days';

  @override
  String get quoteBuilderPaymentCard => 'Credit Card';

  @override
  String get quoteBuilderSentSuccess => 'Quote sent successfully!';

  @override
  String get quoteBuilderEmptyCart => 'Empty cart';

  @override
  String get quoteBuilderEmptyCartHint => 'Add products to create a quote';

  @override
  String get quoteBuilderSearchProducts => 'Search Products';

  @override
  String quoteBuilderItems(int count) {
    return 'Items ($count)';
  }

  @override
  String get quoteBuilderDeliveryMode => 'Delivery Mode';

  @override
  String get quoteBuilderPaymentMethod => 'Payment Method';

  @override
  String get quoteBuilderValidity => 'Validity Period';

  @override
  String get quoteBuilderTitle => 'New Quote';

  @override
  String get quoteBuilderSending => 'Sending...';

  @override
  String get quoteBuilderSendQuote => 'Send Quote';

  @override
  String get myQuotesTabActive => 'Active';

  @override
  String get myQuotesTabWithProposals => 'With Proposals';

  @override
  String get myQuotesTabAccepted => 'Accepted';

  @override
  String get myQuotesTabExpired => 'Expired';

  @override
  String get myQuotesSearch => 'Search';

  @override
  String get myQuotesRecurring => 'Recurring';

  @override
  String get myQuotesEmpty => 'No quotes';

  @override
  String get myQuotesEmptyHint => 'Your quotes will appear here';

  @override
  String get myQuotesBestOffer => 'Best offer: ';

  @override
  String get quoteDetailTitle => 'Quote Detail';

  @override
  String get quoteDetailExpiresIn => 'Expires in';

  @override
  String get quoteDetailPayment => 'Payment';

  @override
  String get quoteDetailDelivery => 'Delivery';

  @override
  String get quoteDetailRequestedItems => 'Requested Items';

  @override
  String quoteDetailProposals(int count) {
    return 'Proposals ($count)';
  }

  @override
  String get quoteDetailCompare => 'Compare';

  @override
  String get quoteDetailRecommended => 'RECOMMENDED';

  @override
  String get proposalComparisonTitle => 'Compare Proposals';

  @override
  String get proposalComparisonEmpty => 'No proposals available';

  @override
  String get proposalComparisonBestValue => 'BEST VALUE';

  @override
  String get proposalComparisonFastDelivery => 'FAST DELIVERY';

  @override
  String get proposalComparisonTaxes => 'Taxes';

  @override
  String get proposalComparisonAccept => 'Accept Proposal';

  @override
  String proposalComparisonSavings(String value) {
    return 'Estimated savings of R\$ $value vs. regional average';
  }

  @override
  String get proposalDetailAccepted => 'Proposal accepted! Order created.';

  @override
  String get proposalDetailTitle => 'Proposal Details';

  @override
  String get proposalDetailFreightCif => 'CIF FREIGHT';

  @override
  String get proposalDetailFreightFob => 'FOB FREIGHT';

  @override
  String get proposalDetailItems => 'Items';

  @override
  String get proposalDetailIcms => 'ICMS';

  @override
  String get proposalDetailDifal => 'DIFAL';

  @override
  String get proposalDetailSt => 'ST';

  @override
  String get proposalDetailTotalWithTaxes => 'TOTAL W/ TAXES AND FREIGHT';

  @override
  String get proposalDetailNotes => 'Notes';

  @override
  String get proposalDetailConfirmOrder => 'Yes, Confirm Order';

  @override
  String get proposalDetailGoBack => 'Go Back and Review';

  @override
  String get proposalDetailConfirmTitle => 'Confirm Order';

  @override
  String get proposalDetailConfirmMessage =>
      'This action cannot be undone. By confirming, an order will be created.';

  @override
  String get recurringQuotesNewTitle => 'New Recurring Quote';

  @override
  String get recurringQuotesProduct => 'Product (ID or name)';

  @override
  String get recurringQuotesQuantity => 'Quantity';

  @override
  String get recurringQuotesFrequency => 'Frequency';

  @override
  String get recurringQuotesCreate => 'Create Recurring';

  @override
  String get recurringQuotesTitle => 'Recurring Quotes';

  @override
  String get recurringQuotesEmpty => 'No recurring quotes';

  @override
  String get recurringQuotesEmptyHint =>
      'Create one to automate your purchases';

  @override
  String recurringQuotesNextDate(String date) {
    return 'Next Date: $date';
  }

  @override
  String get ordersTabAwaitingPayment => 'Awaiting Payment';

  @override
  String get ordersTabPaid => 'Paid';

  @override
  String get ordersTabDispatched => 'Dispatched';

  @override
  String get ordersTabDelivered => 'Delivered';

  @override
  String get ordersNoOrders => 'No orders';

  @override
  String get ordersNoOrdersHint => 'No orders with this status.';

  @override
  String get ordersPayNow => 'Pay Now';

  @override
  String get ordersViewDetails => 'View Details';

  @override
  String get ordersTrack => 'Track';

  @override
  String get ordersConfirmReceipt => 'Confirm Receipt';

  @override
  String get ordersUnknownRetailer => 'Unknown retailer';

  @override
  String ordersItemCount(int count) {
    return '$count item(s)';
  }

  @override
  String get ordersTotal => 'Total';

  @override
  String get orderDetailTitle => 'Order';

  @override
  String get orderDetailReceiptConfirmed => 'Receipt confirmed successfully!';

  @override
  String get orderDetailReceiptError => 'Error confirming receipt.';

  @override
  String get orderDetailDisputeOpened => 'Dispute opened successfully.';

  @override
  String get orderDetailDisputeError => 'Error opening dispute.';

  @override
  String get orderDetailConfirmReceiptTitle => 'Confirm Receipt';

  @override
  String get orderDetailConfirmReceiptMessage =>
      'Confirm you received the order?';

  @override
  String get orderDetailConfirmReceiptWarning =>
      'By confirming, payment will be released to the supplier. This action cannot be undone.';

  @override
  String get orderDetailOpenDispute => 'Open Dispute';

  @override
  String get orderDetailDisputeReason => 'Describe the reason for the dispute:';

  @override
  String get orderDetailDisputeReasonLabel => 'Reason';

  @override
  String get orderDetailDisputeReasonHint =>
      'E.g.: Product didn\'t arrive, damaged product...';

  @override
  String get orderDetailSendDispute => 'Send Dispute';

  @override
  String get orderDetailRateSupplier => 'Rate Supplier';

  @override
  String get orderDetailRateComingSoon => 'Rating feature coming soon.';

  @override
  String get orderDetailStepCreated => 'Created';

  @override
  String get orderDetailStepPaid => 'Paid';

  @override
  String get orderDetailStepInTransit => 'In Transit';

  @override
  String get orderDetailStepDelivered => 'Delivered';

  @override
  String get orderDetailOrderStatus => 'Order Status';

  @override
  String get orderDetailReasonLabel => 'Reason:';

  @override
  String get orderDetailTimeline => 'Timeline';

  @override
  String get orderDetailTracking => 'Tracking: ';

  @override
  String get orderDetailCityState => 'City, State';

  @override
  String get orderDetailOrderItems => 'Order Items';

  @override
  String paymentCopied(String label) {
    return '$label copied!';
  }

  @override
  String get paymentViaPix => 'Payment via PIX';

  @override
  String get paymentError => 'Error loading payment';

  @override
  String get paymentPixTitle => 'PIX Payment';

  @override
  String get paymentPixInstructions =>
      'Open your bank app and choose the Pay with QR Code option';

  @override
  String get paymentCopyPixCode => 'Copy PIX code';

  @override
  String get paymentPixCode => 'PIX Code';

  @override
  String get paymentNeedHelp => 'I need help with PIX';

  @override
  String get paymentSecure => 'Payment processed securely';

  @override
  String get paymentOrderGenerated => 'Order Generated';

  @override
  String get paymentAwaitingPayment => 'Awaiting Payment';

  @override
  String get paymentCodeExpires => 'The code expires in 2 hours';

  @override
  String get paymentPreparingShipment => 'Preparing for Shipment';

  @override
  String get paymentPending => 'Pending';

  @override
  String get paymentBoleto => 'Bank Slip';

  @override
  String paymentBoletoExpiry(String date) {
    return 'Due date: $date';
  }

  @override
  String get paymentDigitableLine => 'Digitable line';

  @override
  String get paymentCopyDigitableLine => 'Copy digitable line';

  @override
  String get paymentOpenBoleto => 'Open bank slip in browser';

  @override
  String get paymentConfirmed => 'Payment confirmed!';

  @override
  String get paymentProcessing => 'Your order is being processed.';

  @override
  String get paymentBackToOrder => 'Back to order';

  @override
  String get paymentExpired => 'This payment has expired. Contact support.';

  @override
  String get paymentAboutBoleto => 'About the bank slip:';

  @override
  String get paymentBoletoClearing => 'Clearing time: up to 3 business days';

  @override
  String get paymentBoletoWhere =>
      'Pay at any bank, lottery shop or via internet banking';

  @override
  String get paymentBoletoExpiredNote =>
      'After the due date, the slip cannot be paid';

  @override
  String get profileError => 'Error loading profile.';

  @override
  String get profileMyAccount => 'My Account';

  @override
  String get profileEditProfile => 'Edit Profile';

  @override
  String get profilePayment => 'Payment';

  @override
  String get profileNotifications => 'Notifications';

  @override
  String get profileSettings => 'Settings';

  @override
  String get profilePrivacyLgpd => 'Privacy and LGPD';

  @override
  String get profileHelp => 'Help';

  @override
  String get profileSecurity => 'Security';

  @override
  String get profileLogout => 'Log Out';

  @override
  String get profileFarmerDefault => 'Farmer';

  @override
  String get profileAssets => 'Assets';

  @override
  String get profileQuotes => 'Quotes';

  @override
  String get profileOrders => 'Orders';

  @override
  String get profileSeasonGoal => 'SEASON GOAL';

  @override
  String get profileSacks => '2,400 Sacks';

  @override
  String get profileGoalReached => '85% reached';

  @override
  String get profileLogoutConfirm => 'Do you want to log out?';

  @override
  String get profileLogoutMessage =>
      'You will need to log in again to access iFarm.';

  @override
  String get editProfileSuccess => 'Profile updated successfully!';

  @override
  String get editProfileError => 'Error saving profile. Try again.';

  @override
  String get editProfileTitle => 'Edit Profile';

  @override
  String get editProfilePersonalData => 'PERSONAL DATA';

  @override
  String get editProfileFullName => 'Full name';

  @override
  String get editProfileFullNameHint => 'Your full name';

  @override
  String get editProfileNameRequired => 'Name is required';

  @override
  String get editProfilePhone => 'Phone / WhatsApp';

  @override
  String get editProfilePhoneHint => '(00) 00000-0000';

  @override
  String get editProfilePhoneRequired => 'Phone is required';

  @override
  String get editProfilePhoneInvalid => 'Invalid phone';

  @override
  String get editProfileCpf => 'CPF';

  @override
  String get editProfileCpfHint => '000.000.000-00';

  @override
  String get editProfileFarm => 'FARM';

  @override
  String get editProfileFarmName => 'Farm name';

  @override
  String get editProfileFarmNameHint => 'E.g.: Santa Fé Farm';

  @override
  String get editProfileState => 'State';

  @override
  String get editProfileSelectState => 'Select the state';

  @override
  String get editProfileAddress => 'Property Address';

  @override
  String get editProfileAddressHint => 'E.g.: Highway BR-163, km 45';

  @override
  String get editProfileAdjustOnMap => 'Adjust on Map';

  @override
  String get editProfileTotalArea => 'Total area (ha)';

  @override
  String get editProfileTotalAreaHint => 'E.g.: 500';

  @override
  String get editProfileCrops => 'Crops (comma separated)';

  @override
  String get editProfileCropsHint => 'E.g.: Soybean, Corn, Wheat';

  @override
  String get editProfileSave => 'Save Changes';

  @override
  String get editProfileChangePhoto => 'CHANGE PHOTO';

  @override
  String get settingsTitle => 'Settings';

  @override
  String get settingsPreferencesSaved => 'Preferences saved!';

  @override
  String get settingsPreferencesError => 'Error saving preferences.';

  @override
  String get settingsNewQuotes => 'New quotes';

  @override
  String get settingsProposalsReceived => 'Proposals received';

  @override
  String get settingsOrderUpdates => 'Order updates';

  @override
  String get settingsPaymentConfirmations => 'Payment confirmations';

  @override
  String get settingsAppSection => 'App';

  @override
  String get settingsAppVersion => 'App version';

  @override
  String get settingsAccountSection => 'Account';

  @override
  String get settingsPrivacyPolicy => 'Privacy Policy';

  @override
  String get settingsExportData => 'Export my data';

  @override
  String get settingsDeleteAccount => 'Delete account';

  @override
  String get settingsSavePreferences => 'Save Preferences';

  @override
  String get settingsDeleteAccountMessage =>
      'To delete your account access the Privacy and LGPD section. The process is irreversible.';

  @override
  String get settingsContinue => 'Continue';

  @override
  String get privacyTitle => 'Privacy';

  @override
  String get privacyYourRights => 'Your LGPD Rights';

  @override
  String get privacyConsents => 'Consents';

  @override
  String get privacyTermsOfUse => 'Terms of Use';

  @override
  String get privacyPrivacyPolicy => 'Privacy Policy';

  @override
  String get privacyMarketingComms => 'Marketing Communications';

  @override
  String get privacyMarketingDesc => 'Receive promotions and news from iFarm';

  @override
  String privacyAcceptedOn(String date) {
    return 'Accepted on $date';
  }

  @override
  String get privacyStorageUsage => 'STORAGE USAGE';

  @override
  String get privacyExportData => 'Export my data';

  @override
  String get privacyExportDataDesc =>
      'Receive a JSON and CSV file with all your personal data stored on the iFarm platform.';

  @override
  String get privacyDangerZone => 'Danger Zone';

  @override
  String get privacyDeleteAccount => 'Delete my account';

  @override
  String get privacyDeleteAccountDesc =>
      'Request permanent deletion of all your data. This action is irreversible and implies termination of active contracts.';

  @override
  String get privacyRightAccess => 'Access';

  @override
  String get privacyRightCorrection => 'Correction';

  @override
  String get privacyRightDeletion => 'Deletion';

  @override
  String get privacyRightPortability => 'Portability';

  @override
  String get privacyRightRevocation => 'Consent Revocation';

  @override
  String get privacyExportError => 'Error exporting data. Try again.';

  @override
  String privacyStorageInfo(String used, String total) {
    return '$used of $total used';
  }

  @override
  String privacyCompanyInfo(String version) {
    return 'iFarm Tecnologia Ltda. • CNPJ 00.000.000/0001-00 • v$version';
  }

  @override
  String get notificationsTitle => 'Notifications';

  @override
  String get notificationsMarkAllRead => 'Mark all as read';

  @override
  String get notificationsError => 'Error loading notifications.';

  @override
  String get notificationsAllClear => 'All clear here';

  @override
  String get notificationsAllClearHint =>
      'You will be notified about quotes,\norders and payments here.';

  @override
  String get notificationsChipQuote => 'Quote';

  @override
  String get notificationsChipOrder => 'Order';

  @override
  String get notificationsChipPayment => 'Payment';

  @override
  String get notificationsChipDelivery => 'Delivery';

  @override
  String get notificationsChipKyc => 'KYC';

  @override
  String get notificationsChipSystem => 'System';

  @override
  String get notificationsGroupToday => 'Today';

  @override
  String get notificationsGroupYesterday => 'Yesterday';

  @override
  String get notificationsGroupThisWeek => 'This week';

  @override
  String get notificationsGroupOlder => 'Older';

  @override
  String get quoteStatusOpen => 'Open';

  @override
  String get quoteStatusInProposals => 'With Proposals';

  @override
  String get quoteStatusAccepted => 'Accepted';

  @override
  String get quoteStatusExpired => 'Expired';

  @override
  String get quoteStatusCancelled => 'Cancelled';

  @override
  String get orderStatusAwaitingPayment => 'Awaiting Payment';

  @override
  String get orderStatusPaid => 'Paid';

  @override
  String get orderStatusPreparing => 'Preparing';

  @override
  String get orderStatusDispatched => 'Dispatched';

  @override
  String get orderStatusDelivered => 'Delivered';

  @override
  String get orderStatusDisputed => 'Disputed';

  @override
  String get orderStatusCancelled => 'Cancelled';

  @override
  String get orderStatusRefunded => 'Refunded';

  @override
  String get paymentMethodPix => 'PIX';

  @override
  String get paymentMethodBoleto => 'Boleto';

  @override
  String get paymentMethodCreditCard => 'Credit Card';

  @override
  String get paymentMethodRuralCredit => 'Rural Credit';

  @override
  String get deliveryModeAddress => 'Delivery to Address';

  @override
  String get deliveryModeGeolocation => 'GPS Delivery';

  @override
  String get deliveryModeStorePickup => 'Store Pickup';

  @override
  String get kycStatusNotStarted => 'Not Started';

  @override
  String get kycStatusDocumentsSubmitted => 'Documents Submitted';

  @override
  String get kycStatusUnderReview => 'Under Review';

  @override
  String get kycStatusApproved => 'Approved';

  @override
  String get kycStatusRejected => 'Rejected';

  @override
  String get kycStatusResubmissionRequired => 'Resubmission Required';

  @override
  String get recurringFrequencyWeekly => 'Weekly';

  @override
  String get recurringFrequencyBiweekly => 'Biweekly';

  @override
  String get recurringFrequencyMonthly => 'Monthly';

  @override
  String get recurringFrequencyCustom => 'Custom';

  @override
  String get recurringStatusActive => 'Active';

  @override
  String get recurringStatusPaused => 'Paused';

  @override
  String get recurringStatusCancelled => 'Cancelled';

  @override
  String get productCategoryFertilizers => 'Fertilizers';

  @override
  String get productCategoryPesticides => 'Pesticides';

  @override
  String get productCategorySeeds => 'Seeds';

  @override
  String get productCategoryMachinery => 'Machinery';

  @override
  String get productCategoryIrrigation => 'Irrigation';

  @override
  String get productCategoryAnimalNutrition => 'Animal Nutrition';

  @override
  String get productCategoryPpeSafety => 'PPE';

  @override
  String get productCategoryVeterinary => 'Veterinary';

  @override
  String get productCategoryOther => 'Other';

  @override
  String get kycDocTypeFront => 'ID (Front)';

  @override
  String get kycDocTypeBack => 'ID (Back)';

  @override
  String get kycDocTypeAddress => 'Proof of Address';

  @override
  String get kycDocTypeRural => 'Rural Producer Doc.';

  @override
  String validatorRequired(String field) {
    return '$field is required';
  }

  @override
  String get validatorFieldDefault => 'Field';

  @override
  String get validatorEmailRequired => 'Email is required';

  @override
  String get validatorEmailInvalid => 'Invalid email';

  @override
  String get validatorPasswordRequired => 'Password is required';

  @override
  String get validatorPasswordMinLength =>
      'Password must have at least 8 characters';

  @override
  String get validatorCpfRequired => 'CPF is required';

  @override
  String get validatorCpfInvalid => 'Invalid CPF';

  @override
  String get validatorCnpjRequired => 'CNPJ is required';

  @override
  String get validatorCnpjInvalid => 'Invalid CNPJ';

  @override
  String get validatorFederalTaxIdRequired => 'CPF/CNPJ is required';

  @override
  String get validatorFederalTaxIdInvalid => 'Invalid CPF/CNPJ';

  @override
  String get validatorPhoneRequired => 'Phone is required';

  @override
  String get validatorPhoneInvalid => 'Invalid phone';

  @override
  String get validatorNcmRequired => 'NCM is required';

  @override
  String get validatorNcmInvalid => 'NCM must have 8 digits';

  @override
  String validatorMinLength(String field, int min) {
    return '$field must have at least $min characters';
  }

  @override
  String validatorMaxLength(String field, int max) {
    return '$field must have at most $max characters';
  }

  @override
  String get validatorDisputeReasonRequired => 'Reason is required';

  @override
  String get validatorDisputeReasonMinLength =>
      'Describe the issue with at least 20 characters';

  @override
  String get timeAgoNow => 'Now';

  @override
  String timeAgoMinutes(int minutes) {
    return '${minutes}min ago';
  }

  @override
  String timeAgoHours(int hours) {
    return '${hours}h ago';
  }

  @override
  String timeAgoDays(int days) {
    return '${days}d ago';
  }

  @override
  String badgeNcm(String code) {
    return 'NCM $code';
  }

  @override
  String get badgeRuralCredit => 'Rural Credit';

  @override
  String get editProfilePropertyName => 'Property name';

  @override
  String get errorCheckConnection => 'Check your connection and try again';

  @override
  String get notificationsEmpty => 'All clear!';

  @override
  String get notificationsEmptyHint => 'You have no notifications';

  @override
  String get notificationsOlder => 'Older';

  @override
  String get notificationsOrders => 'Orders';

  @override
  String get notificationsQuotes => 'Quotes';

  @override
  String get notificationsSystem => 'System';

  @override
  String get notificationsThisWeek => 'This week';

  @override
  String get notificationsToday => 'Today';

  @override
  String get orderDetailCreatedAt => 'Created';

  @override
  String get orderDetailDelivered => 'Delivered';

  @override
  String get orderDetailDisputeHint => 'Describe the issue with your order';

  @override
  String get orderDetailFreight => 'Freight';

  @override
  String get orderDetailItems => 'Items';

  @override
  String get orderDetailPaymentConfirmed => 'Payment confirmed';

  @override
  String get orderDetailShipped => 'Shipped';

  @override
  String get orderDetailStatus => 'Status';

  @override
  String get orderDetailSubmitDispute => 'Submit dispute';

  @override
  String get orderDetailSubtotal => 'Subtotal';

  @override
  String get orderDetailSummary => 'Summary';

  @override
  String get orderDetailTaxes => 'Taxes';

  @override
  String get orderDetailTotal => 'Total';

  @override
  String get ordersEmpty => 'No orders yet';

  @override
  String get ordersTabCancelled => 'Cancelled';

  @override
  String get ordersTabInProgress => 'In progress';

  @override
  String get paymentBarcodeCopied => 'Barcode copied!';

  @override
  String get paymentCopyBarcode => 'Copy barcode';

  @override
  String get paymentDueDate => 'Due date';

  @override
  String get paymentExpiresIn => 'Expires in';

  @override
  String get paymentTitle => 'Payment';

  @override
  String get paymentViaBoleto => 'Pay via Boleto';

  @override
  String get privacyDeleteAccountButton => 'Delete account';

  @override
  String get privacyMarketing => 'Marketing';

  @override
  String get productDetailDefaultDescription => 'No description available';

  @override
  String get productDetailRegionalDemandIndex => 'Regional demand index';

  @override
  String get productDetailRetry => 'Retry';

  @override
  String get productDetailTechnicalInfo => 'Technical information';

  @override
  String get productDetailWarrantyDescription =>
      'Product covered by manufacturer warranty';

  @override
  String get productDetailWarrantyTitle => 'Warranty';

  @override
  String get productSearchAvailableProducts => 'Available products';

  @override
  String get productSearchDefaultUnit => 'unit';

  @override
  String get productSearchEmpty => 'No products found';

  @override
  String get productSearchEmptyHint => 'Try adjusting your filters';

  @override
  String get productSearchHeroTitle => 'Find the best agricultural products';

  @override
  String get productSearchLoadError => 'Error loading products';

  @override
  String get productSearchPriceOnRequest => 'Price on request';

  @override
  String get productSearchRetry => 'Retry';

  @override
  String get productSearchRuralCreditLabel => 'Accepts rural credit';

  @override
  String get profileCancel => 'Cancel';

  @override
  String get profileConfirm => 'Confirm';

  @override
  String get profilePrivacy => 'Privacy';

  @override
  String get proposalComparisonBestPrice => 'Best price';

  @override
  String get proposalComparisonDeliveryTime => 'Delivery time';

  @override
  String get proposalComparisonEstimatedSavingsGeneric =>
      'Compare proposals to find savings';

  @override
  String get proposalComparisonFreight => 'Freight';

  @override
  String get proposalComparisonSelect => 'Select';

  @override
  String get proposalComparisonTotalPrice => 'Total price';

  @override
  String get proposalDetailAccept => 'Accept';

  @override
  String get proposalDetailAcceptSuccess => 'Proposal accepted successfully!';

  @override
  String get proposalDetailCancel => 'Cancel';

  @override
  String get proposalDetailConfirm => 'Confirm';

  @override
  String get proposalDetailConfirmAccept => 'Confirm acceptance?';

  @override
  String get proposalDetailFreeShipping => 'Free shipping';

  @override
  String get proposalDetailObservations => 'Observations';

  @override
  String get proposalDetailSubtotal => 'Subtotal';

  @override
  String get proposalDetailTaxes => 'Taxes';

  @override
  String get proposalDetailTotal => 'Total';

  @override
  String get quoteBuilderDeliveryAddress => 'Delivery address';

  @override
  String get quoteBuilderPaymentCondition => 'Payment condition';

  @override
  String get quoteBuilderSubmit => 'Submit quote';

  @override
  String get quoteDetailCompareProposals => 'Compare proposals';

  @override
  String get quoteDetailExpiration => 'Expiration';

  @override
  String get quoteDetailItems => 'Items';

  @override
  String get recurringQuotesNew => 'New recurring quote';

  @override
  String get recurringQuotesProductLabel => 'Product';

  @override
  String get recurringQuotesQuantityLabel => 'Quantity';

  @override
  String get settingsNotifications => 'Notifications';

  @override
  String get settingsOrderAlerts => 'Order alerts';

  @override
  String get settingsQuoteAlerts => 'Quote alerts';

  @override
  String get paymentCopyPixKey => 'Copy PIX key';

  @override
  String get paymentPixKeyCopied => 'PIX key copied!';

  @override
  String get quoteBuilderSuccess => 'Quote submitted successfully!';

  @override
  String myQuotesItemCount(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count items',
      one: '1 item',
    );
    return '$_temp0';
  }

  @override
  String proposalComparisonDays(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count days',
      one: '1 day',
    );
    return '$_temp0';
  }

  @override
  String proposalComparisonEstimatedSavings(String value) {
    return 'Estimated savings: $value';
  }

  @override
  String proposalDetailBusinessDays(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count business days',
      one: '1 business day',
    );
    return '$_temp0';
  }

  @override
  String quoteBuilderItemCount(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count items',
      one: '1 item',
    );
    return '$_temp0';
  }

  @override
  String get geoTitle => 'Smart Location';

  @override
  String get geoAllow => 'Allow Location';

  @override
  String get geoSkip => 'Not now';

  @override
  String get geoPrivacy => 'PRIVACY PROTECTED';

  @override
  String get geoDescPart1 => 'So that ';

  @override
  String get geoDescHighlight1 => 'iFarm';

  @override
  String get geoDescPart2 =>
      ' can find the best suppliers near you and calculate freight with ';

  @override
  String get geoDescHighlight2 => 'surgical precision';

  @override
  String get geoDescPart3 => ', we need your location.';
}
