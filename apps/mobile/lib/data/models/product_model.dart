import '../../core/constants/enums.dart';

class ProductImage {
  final String url;
  final String s3Key;
  final bool isPrimary;

  const ProductImage({required this.url, required this.s3Key, required this.isPrimary});

  factory ProductImage.fromJson(Map<String, dynamic> json) => ProductImage(
    url: json['url'] as String? ?? '',
    s3Key: json['s3Key'] as String? ?? '',
    isPrimary: json['isPrimary'] as bool? ?? false,
  );
}

class ProductAttribute {
  final String key;
  final String value;
  final String? unit;

  const ProductAttribute({required this.key, required this.value, this.unit});

  factory ProductAttribute.fromJson(Map<String, dynamic> json) => ProductAttribute(
    key: json['key'] as String? ?? '',
    value: json['value'] as String? ?? '',
    unit: json['unit'] as String?,
  );
}

class ProductModel {
  final String id;
  final String name;
  final String description;
  final String brand;
  final ProductCategory category;
  final String tariffCode;
  final bool isRuralCreditEligible;
  final String measurementUnit;
  final List<ProductImage> images;
  final List<ProductAttribute> attributes;
  final List<String> tags;

  const ProductModel({
    required this.id,
    required this.name,
    required this.description,
    required this.brand,
    required this.category,
    required this.tariffCode,
    required this.isRuralCreditEligible,
    required this.measurementUnit,
    required this.images,
    required this.attributes,
    required this.tags,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: (json['_id'] ?? json['id'] ?? '') as String,
      name: json['name'] as String? ?? '',
      description: json['description'] as String? ?? '',
      brand: json['brand'] as String? ?? '',
      category: ProductCategory.fromString(json['category'] as String? ?? 'OTHER'),
      tariffCode: json['tariffCode'] as String? ?? '',
      isRuralCreditEligible: json['isRuralCreditEligible'] as bool? ?? false,
      measurementUnit: json['measurementUnit'] as String? ?? 'un',
      images: (json['images'] as List<dynamic>? ?? [])
          .map((e) => ProductImage.fromJson(e as Map<String, dynamic>))
          .toList(),
      attributes: (json['attributes'] as List<dynamic>? ?? [])
          .map((e) => ProductAttribute.fromJson(e as Map<String, dynamic>))
          .toList(),
      tags: (json['tags'] as List<dynamic>? ?? []).map((e) => e.toString()).toList(),
    );
  }

  String? get primaryImageUrl {
    if (images.isEmpty) return null;
    try {
      return images.firstWhere((i) => i.isPrimary).url;
    } catch (_) {
      return images.first.url;
    }
  }
}
