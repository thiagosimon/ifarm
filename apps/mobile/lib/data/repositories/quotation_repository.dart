import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/api_client.dart';
import '../../core/network/api_endpoints.dart';
import '../models/quote_model.dart';
import '../models/proposal_model.dart';
import '../models/recurring_config_model.dart';
import '../models/paginated_response.dart';

final quotationRepositoryProvider = Provider<QuotationRepository>(
  (ref) => QuotationRepository(ref.read(apiClientProvider)),
);

class QuoteWithProposals {
  final QuoteModel quote;
  final List<ProposalModel> proposals;
  QuoteWithProposals({required this.quote, required this.proposals});
}

class QuotationRepository {
  final ApiClient _client;
  QuotationRepository(this._client);

  Future<QuoteModel> createQuote(Map<String, dynamic> data) async {
    final response = await _client.post(ApiEndpoints.quotes, data: data);
    return QuoteModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<PaginatedResponse<QuoteModel>> getQuotes({
    required String farmerId,
    String? status,
    int page = 1,
    int limit = 20,
  }) async {
    final response = await _client.get(
      ApiEndpoints.quotes,
      queryParams: {
        'farmerId': farmerId,
        if (status != null) 'status': status,
        'page': page,
        'limit': limit,
      },
    );
    return PaginatedResponse.fromJson(
      response.data as Map<String, dynamic>,
      QuoteModel.fromJson,
    );
  }

  Future<QuoteWithProposals> getQuoteById(String id) async {
    final response = await _client.get(ApiEndpoints.quoteById(id));
    final data = response.data as Map<String, dynamic>;
    return QuoteWithProposals(
      quote: QuoteModel.fromJson(data),
      proposals: (data['proposals'] as List<dynamic>? ?? [])
          .map((e) => ProposalModel.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Future<List<ProposalModel>> compareQuote(String id) async {
    final response = await _client.get(ApiEndpoints.quoteCompare(id));
    return (response.data as List<dynamic>)
        .map((e) => ProposalModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<void> acceptProposal({
    required String quoteId,
    required String proposalId,
  }) async {
    await _client.post(ApiEndpoints.acceptProposal(quoteId, proposalId));
  }

  // Recurring
  Future<RecurringConfigModel> createRecurring(Map<String, dynamic> data) async {
    final response = await _client.post(ApiEndpoints.recurringQuotes, data: data);
    return RecurringConfigModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<PaginatedResponse<RecurringConfigModel>> getRecurring({
    required String farmerId,
    int page = 1,
    int limit = 20,
  }) async {
    final response = await _client.get(
      ApiEndpoints.recurringQuotes,
      queryParams: {'farmerId': farmerId, 'page': page, 'limit': limit},
    );
    return PaginatedResponse.fromJson(
      response.data as Map<String, dynamic>,
      RecurringConfigModel.fromJson,
    );
  }

  Future<RecurringConfigModel> updateRecurring(
    String id,
    String farmerId,
    Map<String, dynamic> data,
  ) async {
    final response = await _client.patch(
      ApiEndpoints.recurringById(id),
      data: data,
      queryParams: {'farmerId': farmerId},
    );
    return RecurringConfigModel.fromJson(response.data as Map<String, dynamic>);
  }
}
