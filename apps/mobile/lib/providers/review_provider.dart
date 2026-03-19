import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/models/review_model.dart';
import '../data/repositories/review_repository.dart';

final createReviewProvider = StateNotifierProvider<CreateReviewNotifier, AsyncValue<ReviewModel?>>(
  (ref) => CreateReviewNotifier(ref.read(reviewRepositoryProvider)),
);

class CreateReviewNotifier extends StateNotifier<AsyncValue<ReviewModel?>> {
  final ReviewRepository _repository;
  CreateReviewNotifier(this._repository) : super(const AsyncValue.data(null));

  Future<void> submit(Map<String, dynamic> data) async {
    state = const AsyncValue.loading();
    try {
      final review = await _repository.createReview(data);
      state = AsyncValue.data(review);
    } catch (e, s) {
      state = AsyncValue.error(e, s);
    }
  }
}
