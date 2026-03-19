class ReviewModel {
  final String id;
  final String orderId;
  final String retailerId;
  final String farmerId;
  final int overallRating;
  final int? deliveryRating;
  final int? productQualityRating;
  final int? communicationRating;
  final String? comment;
  final DateTime createdAt;

  const ReviewModel({
    required this.id,
    required this.orderId,
    required this.retailerId,
    required this.farmerId,
    required this.overallRating,
    this.deliveryRating,
    this.productQualityRating,
    this.communicationRating,
    this.comment,
    required this.createdAt,
  });

  factory ReviewModel.fromJson(Map<String, dynamic> json) {
    return ReviewModel(
      id: (json['_id'] ?? json['id'] ?? '') as String,
      orderId: json['orderId'] as String? ?? '',
      retailerId: json['retailerId'] as String? ?? '',
      farmerId: json['farmerId'] as String? ?? '',
      overallRating: json['overallRating'] as int? ?? 5,
      deliveryRating: json['deliveryRating'] as int?,
      productQualityRating: json['productQualityRating'] as int?,
      communicationRating: json['communicationRating'] as int?,
      comment: json['comment'] as String?,
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? '') ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() => {
    'orderId': orderId,
    'overallRating': overallRating,
    if (deliveryRating != null) 'deliveryRating': deliveryRating,
    if (productQualityRating != null) 'productQualityRating': productQualityRating,
    if (communicationRating != null) 'communicationRating': communicationRating,
    if (comment != null) 'comment': comment,
  };
}
