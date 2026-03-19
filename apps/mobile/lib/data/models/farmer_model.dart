import '../../core/constants/enums.dart';

class FarmAddress {
  final String? street;
  final String? number;
  final String? complement;
  final String? neighborhood;
  final String? city;
  final String? stateProvince;
  final String? postalCode;
  final String? countryCode;

  const FarmAddress({
    this.street,
    this.number,
    this.complement,
    this.neighborhood,
    this.city,
    this.stateProvince,
    this.postalCode,
    this.countryCode,
  });

  factory FarmAddress.fromJson(Map<String, dynamic> json) {
    return FarmAddress(
      street: json['street'] as String?,
      number: json['number'] as String?,
      complement: json['complement'] as String?,
      neighborhood: json['neighborhood'] as String?,
      city: json['city'] as String?,
      stateProvince: json['stateProvince'] as String?,
      postalCode: json['postalCode'] as String?,
      countryCode: json['countryCode'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    if (street != null) 'street': street,
    if (number != null) 'number': number,
    if (complement != null) 'complement': complement,
    if (neighborhood != null) 'neighborhood': neighborhood,
    if (city != null) 'city': city,
    if (stateProvince != null) 'stateProvince': stateProvince,
    if (postalCode != null) 'postalCode': postalCode,
    if (countryCode != null) 'countryCode': countryCode,
  };

  String get formatted {
    final parts = <String>[];
    if (street != null) parts.add('$street${number != null ? ', $number' : ''}');
    if (neighborhood != null) parts.add(neighborhood!);
    if (city != null) parts.add(city!);
    if (stateProvince != null) parts.add(stateProvince!);
    return parts.join(' - ');
  }
}

class KycDocument {
  final String documentType;
  final String s3Key;
  final DateTime uploadedAt;
  final String status;

  const KycDocument({
    required this.documentType,
    required this.s3Key,
    required this.uploadedAt,
    required this.status,
  });

  factory KycDocument.fromJson(Map<String, dynamic> json) {
    return KycDocument(
      documentType: json['documentType'] as String? ?? '',
      s3Key: json['s3Key'] as String? ?? '',
      uploadedAt: DateTime.tryParse(json['uploadedAt'] as String? ?? '') ?? DateTime.now(),
      status: json['status'] as String? ?? '',
    );
  }
}

class ConsentItem {
  final DateTime acceptedAt;
  final String termsVersion;
  final String ipAddress;
  final String? deviceId;

  const ConsentItem({
    required this.acceptedAt,
    required this.termsVersion,
    required this.ipAddress,
    this.deviceId,
  });

  Map<String, dynamic> toJson() => {
    'acceptedAt': acceptedAt.toIso8601String(),
    'termsVersion': termsVersion,
    'ipAddress': ipAddress,
    if (deviceId != null) 'deviceId': deviceId,
  };
}

class FarmerModel {
  final String id;
  final String fullName;
  final String email;
  final String phoneNumber;
  final String? federalTaxId;
  final String? farmName;
  final FarmAddress? farmAddress;
  final FarmerStatus status;
  final KycStatus kycStatus;
  final List<KycDocument> kycDocuments;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const FarmerModel({
    required this.id,
    required this.fullName,
    required this.email,
    required this.phoneNumber,
    this.federalTaxId,
    this.farmName,
    this.farmAddress,
    required this.status,
    required this.kycStatus,
    required this.kycDocuments,
    this.createdAt,
    this.updatedAt,
  });

  factory FarmerModel.fromJson(Map<String, dynamic> json) {
    return FarmerModel(
      id: (json['_id'] ?? json['id'] ?? '') as String,
      fullName: json['fullName'] as String? ?? '',
      email: json['email'] as String? ?? '',
      phoneNumber: json['phoneNumber'] as String? ?? '',
      federalTaxId: json['federalTaxId'] as String?,
      farmName: json['farmName'] as String?,
      farmAddress: json['farmAddress'] != null
          ? FarmAddress.fromJson(json['farmAddress'] as Map<String, dynamic>)
          : null,
      status: FarmerStatus.fromString(json['status'] as String? ?? 'PENDING'),
      kycStatus: KycStatus.fromString(json['kycStatus'] as String? ?? 'NOT_STARTED'),
      kycDocuments: (json['kycDocuments'] as List<dynamic>? ?? [])
          .map((e) => KycDocument.fromJson(e as Map<String, dynamic>))
          .toList(),
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? ''),
      updatedAt: DateTime.tryParse(json['updatedAt'] as String? ?? ''),
    );
  }

  Map<String, dynamic> toJson() => {
    '_id': id,
    'fullName': fullName,
    'email': email,
    'phoneNumber': phoneNumber,
    if (federalTaxId != null) 'federalTaxId': federalTaxId,
    if (farmName != null) 'farmName': farmName,
    if (farmAddress != null) 'farmAddress': farmAddress!.toJson(),
    'status': status.value,
    'kycStatus': kycStatus.value,
  };

  FarmerModel copyWith({
    String? fullName,
    String? phoneNumber,
    String? farmName,
    FarmAddress? farmAddress,
    KycStatus? kycStatus,
  }) {
    return FarmerModel(
      id: id,
      fullName: fullName ?? this.fullName,
      email: email,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      federalTaxId: federalTaxId,
      farmName: farmName ?? this.farmName,
      farmAddress: farmAddress ?? this.farmAddress,
      status: status,
      kycStatus: kycStatus ?? this.kycStatus,
      kycDocuments: kycDocuments,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }
}
