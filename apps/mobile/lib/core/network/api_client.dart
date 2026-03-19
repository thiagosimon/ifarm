import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ifarm_mobile/l10n/app_localizations.dart';
import 'api_endpoints.dart';
import 'auth_interceptor.dart';

final apiClientProvider = Provider<ApiClient>((ref) => ApiClient._create());

class ApiClient {
  late final Dio _dio;

  ApiClient._create() {
    _dio = Dio(
      BaseOptions(
        baseUrl: ApiEndpoints.baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    _dio.interceptors.addAll([
      AuthInterceptor(_dio),
      LogInterceptor(
        requestBody: true,
        responseBody: true,
        error: true,
        logPrint: (obj) => debugPrint(obj.toString()),
      ),
    ]);
  }

  Dio get dio => _dio;

  // GET
  Future<Response> get(
    String path, {
    Map<String, dynamic>? queryParams,
    Options? options,
  }) =>
      _dio.get(path, queryParameters: queryParams, options: options);

  // POST
  Future<Response> post(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParams,
    Options? options,
  }) =>
      _dio.post(path,
          data: data, queryParameters: queryParams, options: options);

  // PATCH
  Future<Response> patch(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParams,
    Options? options,
  }) =>
      _dio.patch(path,
          data: data, queryParameters: queryParams, options: options);

  // DELETE
  Future<Response> delete(
    String path, {
    Map<String, dynamic>? queryParams,
    Options? options,
  }) =>
      _dio.delete(path, queryParameters: queryParams, options: options);

  // Multipart upload
  Future<Response> upload(
    String path,
    FormData formData, {
    void Function(int, int)? onSendProgress,
  }) =>
      _dio.post(
        path,
        data: formData,
        options: Options(contentType: 'multipart/form-data'),
        onSendProgress: onSendProgress,
      );

  // Error message extraction
  static String extractErrorMessage(DioException e, AppLocalizations l) {
    try {
      final data = e.response?.data;
      if (data is Map) {
        return data['message']?.toString() ?? l.errorUnknown;
      }
    } catch (_) {}
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.receiveTimeout:
        return l.errorTimeout;
      case DioExceptionType.connectionError:
        return l.errorNoConnection;
      default:
        return l.errorSomethingWrong;
    }
  }
}

void debugPrint(String message) {
  // ignore: avoid_print
  print('[iFarm API] $message');
}
