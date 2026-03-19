import '../../core/constants/enums.dart';

class ProposalItem {
  final String productId;
  final double unitPrice;
  final double totalPrice;

  const ProposalItem({
    required this.productId,
    required this.unitPrice,
    required this.totalPrice,
  });

  factory ProposalItem.fromJson(Map<String, dynamic> json) => ProposalItem(
    productId: (json['productId'] ?? '') as String,
    unitPrice: (json['unitPrice'] as num? ?? 0).toDouble(),
    totalPrice: (json['totalPrice'] as num? ?? 0).toDouble(),
  );
}

class RetailerSnapshot {
  final String businessName;
  final String tradeName;
  final double avgRating;
  final String stateProvince;

  const RetailerSnapshot({
    required this.businessName,
    required this.tradeName,
    required this.avgRating,
    required this.stateProvince,
  });

  factory RetailerSnapshot.fromJson(Map<String, dynamic> json) => RetailerSnapshot(
    businessName: json['businessName'] as String? ?? '',
    tradeName: json['tradeName'] as String? ?? '',
    avgRating: (json['avgRating'] as num? ?? 0).toDouble(),
    stateProvince: json['stateProvince'] as String? ?? '',
  );

  String get displayName => tradeName.isNotEmpty ? tradeName : businessName;
}

class TaxInfo {
  final String stateSalesTaxType;
  final double stateSalesTaxRate;
  final double stateSalesTaxAmount;
  final double interstateVatDifferential;
  final double taxSubstitutionAmount;
  final String legalBasis;
  final double totalWithTax;

  const TaxInfo({
    required this.stateSalesTaxType,
    required this.stateSalesTaxRate,
    required this.stateSalesTaxAmount,
    required this.interstateVatDifferential,
    required this.taxSubstitutionAmount,
    required this.legalBasis,
    required this.totalWithTax,
  });

  factory TaxInfo.fromJson(Map<String, dynamic> json) => TaxInfo(
    stateSalesTaxType: json['stateSalesTaxType'] as String? ?? '',
    stateSalesTaxRate: (json['stateSalesTaxRate'] as num? ?? 0).toDouble(),
    stateSalesTaxAmount: (json['stateSalesTaxAmount'] as num? ?? 0).toDouble(),
    interstateVatDifferential: (json['interstateVatDifferential'] as num? ?? 0).toDouble(),
    taxSubstitutionAmount: (json['taxSubstitutionAmount'] as num? ?? 0).toDouble(),
    legalBasis: json['legalBasis'] as String? ?? '',
    totalWithTax: (json['totalWithTax'] as num? ?? 0).toDouble(),
  );
}

class ProposalModel {
  final String id;
  final String quoteId;
  final String retailerId;
  final RetailerSnapshot retailerSnapshot;
  final List<ProposalItem> items;
  final double subtotalAmount;
  final double deliveryFee;
  final int deliveryDays;
  final TaxInfo? taxInfo;
  final double totalWithTaxAndDelivery;
  final List<String> paymentMethods;
  final String observations;
  final ProposalStatus status;
  final DateTime? createdAt;

  const ProposalModel({
    required this.id,
    required this.quoteId,
    required this.retailerId,
    required this.retailerSnapshot,
    required this.items,
    required this.subtotalAmount,
    required this.deliveryFee,
    required this.deliveryDays,
    this.taxInfo,
    required this.totalWithTaxAndDelivery,
    required this.paymentMethods,
    required this.observations,
    required this.status,
    this.createdAt,
  });

  factory ProposalModel.fromJson(Map<String, dynamic> json) {
    return ProposalModel(
      id: (json['_id'] ?? json['id'] ?? '') as String,
      quoteId: (json['quoteId'] ?? '') as String,
      retailerId: (json['retailerId'] ?? '') as String,
      retailerSnapshot: RetailerSnapshot.fromJson(
          json['retailerSnapshot'] as Map<String, dynamic>? ?? {}),
      items: (json['items'] as List<dynamic>? ?? [])
          .map((e) => ProposalItem.fromJson(e as Map<String, dynamic>))
          .toList(),
      subtotalAmount: (json['subtotalAmount'] as num? ?? 0).toDouble(),
      deliveryFee: (json['deliveryFee'] as num? ?? 0).toDouble(),
      deliveryDays: json['deliveryDays'] as int? ?? 1,
      taxInfo: json['taxInfo'] != null
          ? TaxInfo.fromJson(json['taxInfo'] as Map<String, dynamic>)
          : null,
      totalWithTaxAndDelivery: (json['totalWithTaxAndDelivery'] as num? ?? 0).toDouble(),
      paymentMethods: (json['paymentMethods'] as List<dynamic>? ?? [])
          .map((e) => e.toString())
          .toList(),
      observations: json['observations'] as String? ?? '',
      status: ProposalStatus.fromString(json['status'] as String? ?? 'PENDING'),
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? ''),
    );
  }
}
