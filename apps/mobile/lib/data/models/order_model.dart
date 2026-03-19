import '../../core/constants/enums.dart';

class OrderItem {
  final String productId;
  final String name;
  final double quantity;
  final double unitPrice;
  final double totalPrice;

  const OrderItem({
    required this.productId,
    required this.name,
    required this.quantity,
    required this.unitPrice,
    required this.totalPrice,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) => OrderItem(
    productId: json['productId'] as String? ?? '',
    name: json['name'] as String? ?? '',
    quantity: (json['quantity'] as num? ?? 1).toDouble(),
    unitPrice: (json['unitPrice'] as num? ?? 0).toDouble(),
    totalPrice: (json['totalPrice'] as num? ?? 0).toDouble(),
  );
}

class StatusHistoryEntry {
  final String status;
  final DateTime changedAt;
  final String changedBy;
  final String? note;

  const StatusHistoryEntry({
    required this.status,
    required this.changedAt,
    required this.changedBy,
    this.note,
  });

  factory StatusHistoryEntry.fromJson(Map<String, dynamic> json) => StatusHistoryEntry(
    status: json['status'] as String? ?? '',
    changedAt: DateTime.tryParse(json['changedAt'] as String? ?? '') ?? DateTime.now(),
    changedBy: json['changedBy'] as String? ?? '',
    note: json['note'] as String?,
  );
}

class OrderRetailerInfo {
  final String id;
  final String businessName;
  final String? tradeName;
  final double avgRating;

  const OrderRetailerInfo({
    required this.id,
    required this.businessName,
    this.tradeName,
    required this.avgRating,
  });

  factory OrderRetailerInfo.fromJson(Map<String, dynamic> json) => OrderRetailerInfo(
    id: json['id'] as String? ?? '',
    businessName: json['businessName'] as String? ?? '',
    tradeName: json['tradeName'] as String?,
    avgRating: (json['avgRating'] as num? ?? 0).toDouble(),
  );

  String get displayName => (tradeName?.isNotEmpty ?? false) ? tradeName! : businessName;
}

class OrderModel {
  final String id;
  final String orderNumber;
  final String quoteId;
  final String proposalId;
  final String farmerId;
  final String retailerId;
  final OrderRetailerInfo? retailer;
  final List<OrderItem> items;
  final double totalAmount;
  final OrderStatus status;
  final PaymentMethod paymentMethod;
  final String? trackingCode;
  final DateTime? deliveredAt;
  final String? disputeReason;
  final List<StatusHistoryEntry> statusHistory;
  final DateTime createdAt;
  final DateTime updatedAt;

  const OrderModel({
    required this.id,
    required this.orderNumber,
    required this.quoteId,
    required this.proposalId,
    required this.farmerId,
    required this.retailerId,
    this.retailer,
    required this.items,
    required this.totalAmount,
    required this.status,
    required this.paymentMethod,
    this.trackingCode,
    this.deliveredAt,
    this.disputeReason,
    required this.statusHistory,
    required this.createdAt,
    required this.updatedAt,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    return OrderModel(
      id: json['id'] as String? ?? '',
      orderNumber: json['orderNumber'] as String? ?? '',
      quoteId: json['quoteId'] as String? ?? '',
      proposalId: json['proposalId'] as String? ?? '',
      farmerId: json['farmerId'] as String? ?? '',
      retailerId: json['retailerId'] as String? ?? '',
      retailer: json['retailer'] != null
          ? OrderRetailerInfo.fromJson(json['retailer'] as Map<String, dynamic>)
          : null,
      items: (json['items'] as List<dynamic>? ?? [])
          .map((e) => OrderItem.fromJson(e as Map<String, dynamic>))
          .toList(),
      totalAmount: (json['totalAmount'] as num? ?? 0).toDouble(),
      status: OrderStatus.fromString(json['status'] as String? ?? 'AWAITING_PAYMENT'),
      paymentMethod: PaymentMethod.fromString(json['paymentMethod'] as String? ?? 'PIX'),
      trackingCode: json['trackingCode'] as String?,
      deliveredAt: DateTime.tryParse(json['deliveredAt'] as String? ?? ''),
      disputeReason: json['disputeReason'] as String?,
      statusHistory: (json['statusHistory'] as List<dynamic>? ?? [])
          .map((e) => StatusHistoryEntry.fromJson(e as Map<String, dynamic>))
          .toList(),
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? '') ?? DateTime.now(),
      updatedAt: DateTime.tryParse(json['updatedAt'] as String? ?? '') ?? DateTime.now(),
    );
  }

  bool get canConfirmDelivery => status == OrderStatus.dispatched;

  bool get canDispute {
    if (status != OrderStatus.delivered) return false;
    if (deliveredAt == null) return false;
    return DateTime.now().difference(deliveredAt!).inDays <= 7;
  }

  bool get canReview => status == OrderStatus.delivered;
}
