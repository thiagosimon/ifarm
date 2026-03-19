import 'package:flutter/material.dart';

enum QuoteStatus {
  open('OPEN'),
  inProposals('IN_PROPOSALS'),
  accepted('ACCEPTED'),
  expired('EXPIRED'),
  cancelled('CANCELLED');

  final String value;
  const QuoteStatus(this.value);

  static QuoteStatus fromString(String v) =>
      QuoteStatus.values.firstWhere((e) => e.value == v, orElse: () => QuoteStatus.open);

  String get label {
    switch (this) {
      case QuoteStatus.open: return 'Aberta';
      case QuoteStatus.inProposals: return 'Com Propostas';
      case QuoteStatus.accepted: return 'Aceita';
      case QuoteStatus.expired: return 'Expirada';
      case QuoteStatus.cancelled: return 'Cancelada';
    }
  }

  Color get color {
    switch (this) {
      case QuoteStatus.open: return const Color(0xFF3B82F6);
      case QuoteStatus.inProposals: return const Color(0xFF795900);
      case QuoteStatus.accepted: return const Color(0xFF005129);
      case QuoteStatus.expired: return const Color(0xFF707A70);
      case QuoteStatus.cancelled: return const Color(0xFFBA1A1A);
    }
  }
}

enum ProposalStatus {
  pending('PENDING'),
  accepted('ACCEPTED'),
  rejected('REJECTED'),
  expired('EXPIRED');

  final String value;
  const ProposalStatus(this.value);

  static ProposalStatus fromString(String v) =>
      ProposalStatus.values.firstWhere((e) => e.value == v, orElse: () => ProposalStatus.pending);
}

enum OrderStatus {
  awaitingPayment('AWAITING_PAYMENT'),
  paid('PAID'),
  preparing('PREPARING'),
  dispatched('DISPATCHED'),
  delivered('DELIVERED'),
  disputed('DISPUTED'),
  cancelled('CANCELLED'),
  refunded('REFUNDED');

  final String value;
  const OrderStatus(this.value);

  static OrderStatus fromString(String v) =>
      OrderStatus.values.firstWhere((e) => e.value == v, orElse: () => OrderStatus.awaitingPayment);

  String get label {
    switch (this) {
      case OrderStatus.awaitingPayment: return 'Ag. Pagamento';
      case OrderStatus.paid: return 'Pago';
      case OrderStatus.preparing: return 'Preparando';
      case OrderStatus.dispatched: return 'Enviado';
      case OrderStatus.delivered: return 'Entregue';
      case OrderStatus.disputed: return 'Em Disputa';
      case OrderStatus.cancelled: return 'Cancelado';
      case OrderStatus.refunded: return 'Reembolsado';
    }
  }
}

enum PaymentMethod {
  pix('PIX'),
  boleto('BOLETO'),
  creditCard('CREDIT_CARD'),
  ruralCredit('RURAL_CREDIT');

  final String value;
  const PaymentMethod(this.value);

  static PaymentMethod fromString(String v) =>
      PaymentMethod.values.firstWhere((e) => e.value == v, orElse: () => PaymentMethod.pix);

  String get label {
    switch (this) {
      case PaymentMethod.pix: return 'PIX';
      case PaymentMethod.boleto: return 'Boleto';
      case PaymentMethod.creditCard: return 'Cartão de Crédito';
      case PaymentMethod.ruralCredit: return 'Crédito Rural';
    }
  }
}

enum TransactionStatus {
  pending('PENDING'),
  paid('PAID'),
  failed('FAILED'),
  refunded('REFUNDED');

  final String value;
  const TransactionStatus(this.value);

  static TransactionStatus fromString(String v) =>
      TransactionStatus.values.firstWhere((e) => e.value == v, orElse: () => TransactionStatus.pending);
}

enum DeliveryMode {
  deliveryAddress('DELIVERY_ADDRESS'),
  deliveryGeolocation('DELIVERY_GEOLOCATION'),
  storePickup('STORE_PICKUP');

  final String value;
  const DeliveryMode(this.value);

  static DeliveryMode fromString(String v) =>
      DeliveryMode.values.firstWhere((e) => e.value == v, orElse: () => DeliveryMode.deliveryAddress);

  String get label {
    switch (this) {
      case DeliveryMode.deliveryAddress: return 'Entrega no Endereço';
      case DeliveryMode.deliveryGeolocation: return 'Entrega por GPS';
      case DeliveryMode.storePickup: return 'Retirada na Loja';
    }
  }
}

enum KycStatus {
  notStarted('NOT_STARTED'),
  documentsSubmitted('DOCUMENTS_SUBMITTED'),
  underReview('UNDER_REVIEW'),
  approved('APPROVED'),
  rejected('REJECTED'),
  resubmissionRequired('RESUBMISSION_REQUIRED');

  final String value;
  const KycStatus(this.value);

  static KycStatus fromString(String v) =>
      KycStatus.values.firstWhere((e) => e.value == v, orElse: () => KycStatus.notStarted);

  String get label {
    switch (this) {
      case KycStatus.notStarted: return 'Não Iniciado';
      case KycStatus.documentsSubmitted: return 'Docs Enviados';
      case KycStatus.underReview: return 'Em Análise';
      case KycStatus.approved: return 'Aprovado';
      case KycStatus.rejected: return 'Rejeitado';
      case KycStatus.resubmissionRequired: return 'Reenvio Necessário';
    }
  }
}

enum FarmerStatus {
  pending('PENDING'),
  active('ACTIVE'),
  suspended('SUSPENDED'),
  deactivated('DEACTIVATED');

  final String value;
  const FarmerStatus(this.value);

  static FarmerStatus fromString(String v) =>
      FarmerStatus.values.firstWhere((e) => e.value == v, orElse: () => FarmerStatus.pending);
}

enum RecurringFrequency {
  weekly('WEEKLY'),
  biweekly('BIWEEKLY'),
  monthly('MONTHLY'),
  custom('CUSTOM');

  final String value;
  const RecurringFrequency(this.value);

  static RecurringFrequency fromString(String v) =>
      RecurringFrequency.values.firstWhere((e) => e.value == v, orElse: () => RecurringFrequency.monthly);

  String get label {
    switch (this) {
      case RecurringFrequency.weekly: return 'Semanal';
      case RecurringFrequency.biweekly: return 'Quinzenal';
      case RecurringFrequency.monthly: return 'Mensal';
      case RecurringFrequency.custom: return 'Personalizado';
    }
  }
}

enum RecurringStatus {
  active('ACTIVE'),
  paused('PAUSED'),
  cancelled('CANCELLED');

  final String value;
  const RecurringStatus(this.value);

  static RecurringStatus fromString(String v) =>
      RecurringStatus.values.firstWhere((e) => e.value == v, orElse: () => RecurringStatus.active);

  String get label {
    switch (this) {
      case RecurringStatus.active: return 'Ativa';
      case RecurringStatus.paused: return 'Pausada';
      case RecurringStatus.cancelled: return 'Cancelada';
    }
  }
}

enum ProductCategory {
  fertilizers('FERTILIZERS', 'Fertilizantes'),
  pesticides('PESTICIDES', 'Defensivos'),
  seeds('SEEDS', 'Sementes'),
  machinery('MACHINERY', 'Máquinas'),
  irrigation('IRRIGATION', 'Irrigação'),
  animalNutrition('ANIMAL_NUTRITION', 'Nutrição Animal'),
  ppeSafety('PPE_SAFETY', 'EPIs'),
  veterinary('VETERINARY', 'Veterinário'),
  other('OTHER', 'Outros');

  final String value;
  final String label;
  const ProductCategory(this.value, this.label);

  static ProductCategory fromString(String v) =>
      ProductCategory.values.firstWhere((e) => e.value == v, orElse: () => ProductCategory.other);
}

enum KycDocumentType {
  idFront('ID_FRONT', 'Identidade (Frente)'),
  idBack('ID_BACK', 'Identidade (Verso)'),
  addressProof('ADDRESS_PROOF', 'Comprovante de Endereço'),
  ruralProducerDoc('RURAL_PRODUCER_DOC', 'Doc. Produtor Rural');

  final String value;
  final String label;
  const KycDocumentType(this.value, this.label);

  static KycDocumentType fromString(String v) =>
      KycDocumentType.values.firstWhere((e) => e.value == v, orElse: () => KycDocumentType.idFront);
}
