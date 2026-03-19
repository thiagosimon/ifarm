import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/api_client.dart';
import '../../core/network/api_endpoints.dart';
import '../models/farmer_model.dart';

final farmerRepositoryProvider = Provider<FarmerRepository>(
  (ref) => FarmerRepository(ref.read(apiClientProvider)),
);

class FarmerRepository {
  final ApiClient _client;
  FarmerRepository(this._client);

  Future<FarmerModel> createFarmer(Map<String, dynamic> data) async {
    final response = await _client.post(ApiEndpoints.farmers, data: data);
    return FarmerModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<FarmerModel> getFarmerById(String id) async {
    final response = await _client.get(ApiEndpoints.farmerById(id));
    return FarmerModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<FarmerModel> updateFarmer(String id, Map<String, dynamic> data) async {
    final response = await _client.patch(ApiEndpoints.farmerById(id), data: data);
    return FarmerModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<Map<String, dynamic>> uploadDocument({
    required String farmerId,
    required String filePath,
    required String documentType,
    void Function(int, int)? onProgress,
  }) async {
    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(filePath),
      'documentType': documentType,
    });
    final response = await _client.upload(
      ApiEndpoints.farmerDocuments(farmerId),
      formData,
      onSendProgress: onProgress,
    );
    return response.data as Map<String, dynamic>;
  }

  Future<String> getDocumentUrl(String farmerId, int idx) async {
    final response = await _client.get(ApiEndpoints.farmerDocumentById(farmerId, idx));
    return (response.data as Map<String, dynamic>)['url'] as String;
  }

  Future<Map<String, dynamic>> exportData(String userId) async {
    final response = await _client.get(
      ApiEndpoints.farmerExport,
      queryParams: {'userId': userId},
    );
    return response.data as Map<String, dynamic>;
  }

  Future<void> deleteAccount(String userId) async {
    await _client.delete(
      ApiEndpoints.farmerDelete,
      queryParams: {'userId': userId},
    );
  }
}
