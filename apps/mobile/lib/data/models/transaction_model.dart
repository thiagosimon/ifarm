import '../../core/constants/enums.dart';

class TransactionModel {
  final String orderId;
  final double amount;
  final PaymentMethod method;
  final TransactionStatus status;
  final String? pixQrCode;
  final String? boletoUrl;
  final String? boletoBarcode;
  final DateTime? expiresAt;

  const TransactionModel({
    required this.orderId,
    required this.amount,
    required this.method,
    required this.status,
    this.pixQrCode,
    this.boletoUrl,
    this.boletoBarcode,
    this.expiresAt,
  });

  factory TransactionModel.fromJson(Map<String, dynamic> json) {
    return TransactionModel(
      orderId: json['orderId'] as String? ?? '',
      amount: (json['amount'] as num? ?? 0).toDouble(),
      method: PaymentMethod.fromString(json['method'] as String? ?? 'PIX'),
      status: TransactionStatus.fromString(json['status'] as String? ?? 'PENDING'),
      pixQrCode: json['pixQrCode'] as String?,
      boletoUrl: json['boletoUrl'] as String?,
      boletoBarcode: json['boletoBarcode'] as String?,
      expiresAt: DateTime.tryParse(json['expiresAt'] as String? ?? ''),
    );
  }

  bool get isPix => method == PaymentMethod.pix;
  bool get isBoleto => method == PaymentMethod.boleto;
  bool get isPaid => status == TransactionStatus.paid;
  bool get isPending => status == TransactionStatus.pending;
  bool get isFailed => status == TransactionStatus.failed;
}
