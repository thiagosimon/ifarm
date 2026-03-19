import '../../core/constants/enums.dart';

class RecurringConfigModel {
  final String id;
  final String farmerId;
  final String productId;
  final String? productName;
  final double quantity;
  final String measurementUnit;
  final RecurringFrequency frequency;
  final RecurringStatus status;
  final bool autoAccept;
  final double? maxAcceptPrice;
  final DeliveryMode deliveryMode;
  final PaymentMethod preferredPaymentMethod;
  final DateTime? nextExecutionAt;
  final DateTime? createdAt;

  const RecurringConfigModel({
    required this.id,
    required this.farmerId,
    required this.productId,
    this.productName,
    required this.quantity,
    required this.measurementUnit,
    required this.frequency,
    required this.status,
    required this.autoAccept,
    this.maxAcceptPrice,
    required this.deliveryMode,
    required this.preferredPaymentMethod,
    this.nextExecutionAt,
    this.createdAt,
  });

  factory RecurringConfigModel.fromJson(Map<String, dynamic> json) {
    return RecurringConfigModel(
      id: (json['_id'] ?? json['id'] ?? '') as String,
      farmerId: json['farmerId'] as String? ?? '',
      productId: json['productId'] as String? ?? '',
      productName: json['productName'] as String?,
      quantity: (json['quantity'] as num? ?? 1).toDouble(),
      measurementUnit: json['measurementUnit'] as String? ?? 'un',
      frequency: RecurringFrequency.fromString(json['frequency'] as String? ?? 'MONTHLY'),
      status: RecurringStatus.fromString(json['status'] as String? ?? 'ACTIVE'),
      autoAccept: json['autoAccept'] as bool? ?? false,
      maxAcceptPrice: (json['maxAcceptPrice'] as num?)?.toDouble(),
      deliveryMode: DeliveryMode.fromString(json['deliveryMode'] as String? ?? 'DELIVERY_ADDRESS'),
      preferredPaymentMethod:
          PaymentMethod.fromString(json['preferredPaymentMethod'] as String? ?? 'PIX'),
      nextExecutionAt: DateTime.tryParse(json['nextExecutionAt'] as String? ?? ''),
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? ''),
    );
  }
}
