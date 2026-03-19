class CategoryModel {
  final String id;
  final String name;
  final String slug;
  final String? parentId;
  final String? icon;
  final int level;
  final bool isActive;
  final List<CategoryModel> children;

  const CategoryModel({
    required this.id,
    required this.name,
    required this.slug,
    this.parentId,
    this.icon,
    required this.level,
    required this.isActive,
    required this.children,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: (json['_id'] ?? json['id'] ?? '') as String,
      name: json['name'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      parentId: json['parentId'] as String?,
      icon: json['icon'] as String?,
      level: json['level'] as int? ?? 0,
      isActive: json['isActive'] as bool? ?? true,
      children: (json['children'] as List<dynamic>? ?? [])
          .map((e) => CategoryModel.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}
