import 'package:flutter/widgets.dart';
import 'package:ifarm_mobile/l10n/app_localizations.dart';
import 'enums.dart';

extension QuoteStatusL10n on QuoteStatus {
  String localizedLabel(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    switch (this) {
      case QuoteStatus.open:
        return l.quoteStatusOpen;
      case QuoteStatus.inProposals:
        return l.quoteStatusInProposals;
      case QuoteStatus.accepted:
        return l.quoteStatusAccepted;
      case QuoteStatus.expired:
        return l.quoteStatusExpired;
      case QuoteStatus.cancelled:
        return l.quoteStatusCancelled;
    }
  }
}

extension OrderStatusL10n on OrderStatus {
  String localizedLabel(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    switch (this) {
      case OrderStatus.awaitingPayment:
        return l.orderStatusAwaitingPayment;
      case OrderStatus.paid:
        return l.orderStatusPaid;
      case OrderStatus.preparing:
        return l.orderStatusPreparing;
      case OrderStatus.dispatched:
        return l.orderStatusDispatched;
      case OrderStatus.delivered:
        return l.orderStatusDelivered;
      case OrderStatus.disputed:
        return l.orderStatusDisputed;
      case OrderStatus.cancelled:
        return l.orderStatusCancelled;
      case OrderStatus.refunded:
        return l.orderStatusRefunded;
    }
  }
}

extension PaymentMethodL10n on PaymentMethod {
  String localizedLabel(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    switch (this) {
      case PaymentMethod.pix:
        return l.paymentMethodPix;
      case PaymentMethod.boleto:
        return l.paymentMethodBoleto;
      case PaymentMethod.creditCard:
        return l.paymentMethodCreditCard;
      case PaymentMethod.ruralCredit:
        return l.paymentMethodRuralCredit;
    }
  }
}

extension DeliveryModeL10n on DeliveryMode {
  String localizedLabel(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    switch (this) {
      case DeliveryMode.deliveryAddress:
        return l.deliveryModeAddress;
      case DeliveryMode.deliveryGeolocation:
        return l.deliveryModeGeolocation;
      case DeliveryMode.storePickup:
        return l.deliveryModeStorePickup;
    }
  }
}

extension KycStatusL10n on KycStatus {
  String localizedLabel(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    switch (this) {
      case KycStatus.notStarted:
        return l.kycStatusNotStarted;
      case KycStatus.documentsSubmitted:
        return l.kycStatusDocumentsSubmitted;
      case KycStatus.underReview:
        return l.kycStatusUnderReview;
      case KycStatus.approved:
        return l.kycStatusApproved;
      case KycStatus.rejected:
        return l.kycStatusRejected;
      case KycStatus.resubmissionRequired:
        return l.kycStatusResubmissionRequired;
    }
  }
}

extension RecurringFrequencyL10n on RecurringFrequency {
  String localizedLabel(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    switch (this) {
      case RecurringFrequency.weekly:
        return l.recurringFrequencyWeekly;
      case RecurringFrequency.biweekly:
        return l.recurringFrequencyBiweekly;
      case RecurringFrequency.monthly:
        return l.recurringFrequencyMonthly;
      case RecurringFrequency.custom:
        return l.recurringFrequencyCustom;
    }
  }
}

extension RecurringStatusL10n on RecurringStatus {
  String localizedLabel(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    switch (this) {
      case RecurringStatus.active:
        return l.recurringStatusActive;
      case RecurringStatus.paused:
        return l.recurringStatusPaused;
      case RecurringStatus.cancelled:
        return l.recurringStatusCancelled;
    }
  }
}

extension ProductCategoryL10n on ProductCategory {
  String localizedLabel(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    switch (this) {
      case ProductCategory.fertilizers:
        return l.productCategoryFertilizers;
      case ProductCategory.pesticides:
        return l.productCategoryPesticides;
      case ProductCategory.seeds:
        return l.productCategorySeeds;
      case ProductCategory.machinery:
        return l.productCategoryMachinery;
      case ProductCategory.irrigation:
        return l.productCategoryIrrigation;
      case ProductCategory.animalNutrition:
        return l.productCategoryAnimalNutrition;
      case ProductCategory.ppeSafety:
        return l.productCategoryPpeSafety;
      case ProductCategory.veterinary:
        return l.productCategoryVeterinary;
      case ProductCategory.other:
        return l.productCategoryOther;
    }
  }
}

extension KycDocumentTypeL10n on KycDocumentType {
  String localizedLabel(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    switch (this) {
      case KycDocumentType.idFront:
        return l.kycDocTypeFront;
      case KycDocumentType.idBack:
        return l.kycDocTypeBack;
      case KycDocumentType.addressProof:
        return l.kycDocTypeAddress;
      case KycDocumentType.ruralProducerDoc:
        return l.kycDocTypeRural;
    }
  }
}
