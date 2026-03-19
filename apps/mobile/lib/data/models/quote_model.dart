import '../../core/constants/enums.dart';

class QuoteItemSnapshot {
  final String name;
  final String category;
  final String tariffCode;
  final String measurementUnit;

  const QuoteItemSnapshot({
    required this.name,
    required this.category,
    required this.tariffCode,
    required this.measurementUnit,
  });

  factory QuoteItemSnapshot.fromJson(Map<String, dynamic> json) => QuoteItemSnapshot(
    name: json['name'] as String? ?? '',
    category: json['category'] as String? ?? '',
    tariffCode: json['tariffCode'] as String? ?? '',
    measurementUnit: json['measurementUnit'] as String? ?? '',
  );

  Map<String, dynamic> toJson() => {
    'name': name,
    'category': category,
    'tariffCode': tariffCode,
    'measurementUnit': measurementUnit,
  };
}

class QuoteItem {
  final String productId;
  final QuoteItemSnapshot productSnapshot;
  final double quantity;
  final String measurementUnit;

  const QuoteItem({
    required this.productId,
    required this.productSnapshot,
    required this.quantity,
    required this.measurementUnit,
  });

  factory QuoteItem.fromJson(Map<String, dynamic> json) => QuoteItem(
    productId: (json['productId'] ?? '') as String,
    productSnapshot: QuoteItemSnapshot.fromJson(
        json['productSnapshot'] as Map<String, dynamic>? ?? {}),
    quantity: (json['quantity'] as num? ?? 1).toDouble(),
    measurementUnit: json['measurementUnit'] as String? ?? 'un',
  );

  Map<String, dynamic> toJson() => {
    'productId': productId,
    'productSnapshot': productSnapshot.toJson(),
    'quantity': quantity,
    'measurementUnit': measurementUnit,
  };
}

class DeliveryAddress {
  final String? city;
  final String? stateProvince;
  final String? postalCode;
  final String? countryCode;

  const DeliveryAddress({this.city, this.stateProvince, this.postalCode, this.countryCode});

  factory DeliveryAddress.fromJson(Map<String, dynamic> json) => DeliveryAddress(
    city: json['city'] as String?,
    stateProvince: json['stateProvince'] as String?,
    postalCode: json['postalCode'] as String?,
    countryCode: json['countryCode'] as String?,
  );

  Map<String, dynamic> toJson() => {
    if (city != null) 'city': city,
    if (stateProvince != null) 'stateProvince': stateProvince,
    if (postalCode != null) 'postalCode': postalCode,
    if (countryCode != null) 'countryCode': countryCode,
  };
}

class BestProposalSummary {
  final String proposalId;
  final String retailerName;
  final double totalWithTaxAndDelivery;

  const BestProposalSummary({
    required this.proposalId,
    required this.retailerName,
    required this.totalWithTaxAndDelivery,
  });

  factory BestProposalSummary.fromJson(Map<String, dynamic> json) => BestProposalSummary(
    proposalId: (json['proposalId'] ?? '') as String,
    retailerName: json['retailerName'] as String? ?? '',
    totalWithTaxAndDelivery: (json['totalWithTaxAndDelivery'] as num? ?? 0).toDouble(),
  );
}

class QuoteModel {
  final String id;
  final String quoteNumber;
  final String farmerId;
  final List<QuoteItem> items;
  final DeliveryMode deliveryMode;
  final DeliveryAddress? deliveryAddress;
  final PaymentMethod preferredPaymentMethod;
  final QuoteStatus status;
  final int proposalCount;
  final BestProposalSummary? bestProposal;
  final DateTime expiresAt;
  final DateTime? createdAt;

  const QuoteModel({
    required this.id,
    required this.quoteNumber,
    required this.farmerId,
    required this.items,
    required this.deliveryMode,
    this.deliveryAddress,
    required this.preferredPaymentMethod,
    required this.status,
    required this.proposalCount,
    this.bestProposal,
    required this.expiresAt,
    this.createdAt,
  });

  factory QuoteModel.fromJson(Map<String, dynamic> json) {
    return QuoteModel(
      id: (json['_id'] ?? json['id'] ?? '') as String,
      quoteNumber: json['quoteNumber'] as String? ?? '',
      farmerId: (json['farmerId'] ?? '') as String,
      items: (json['items'] as List<dynamic>? ?? [])
          .map((e) => QuoteItem.fromJson(e as Map<String, dynamic>))
          .toList(),
      deliveryMode: DeliveryMode.fromString(json['deliveryMode'] as String? ?? 'DELIVERY_ADDRESS'),
      deliveryAddress: json['deliveryAddress'] != null
          ? DeliveryAddress.fromJson(json['deliveryAddress'] as Map<String, dynamic>)
          : null,
      preferredPaymentMethod:
          PaymentMethod.fromString(json['preferredPaymentMethod'] as String? ?? 'PIX'),
      status: QuoteStatus.fromString(json['status'] as String? ?? 'OPEN'),
      proposalCount: json['proposalCount'] as int? ?? 0,
      bestProposal: json['bestProposal'] != null
          ? BestProposalSummary.fromJson(json['bestProposal'] as Map<String, dynamic>)
          : null,
      expiresAt: DateTime.tryParse(json['expiresAt'] as String? ?? '') ?? DateTime.now(),
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? ''),
    );
  }
}
