class UserModel {
  final String sub;
  final String email;
  final String name;
  final List<String> roles;

  const UserModel({
    required this.sub,
    required this.email,
    required this.name,
    required this.roles,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      sub: json['sub'] as String? ?? '',
      email: json['email'] as String? ?? '',
      name: json['name'] as String? ?? '',
      roles: (json['roles'] as List<dynamic>? ?? []).map((e) => e.toString()).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'sub': sub,
    'email': email,
    'name': name,
    'roles': roles,
  };

  bool get isFarmer => roles.contains('FARMER');
}
