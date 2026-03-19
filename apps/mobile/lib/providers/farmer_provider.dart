import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/storage/secure_storage.dart';
import '../data/models/farmer_model.dart';
import '../data/repositories/farmer_repository.dart';

final farmerIdProvider = FutureProvider<String?>((ref) async {
  return SecureStorage.getFarmerId();
});

final currentFarmerProvider = FutureProvider<FarmerModel?>((ref) async {
  final farmerId = await ref.watch(farmerIdProvider.future);
  if (farmerId == null) return null;
  final repo = ref.read(farmerRepositoryProvider);
  return repo.getFarmerById(farmerId);
});

class FarmerNotifier extends StateNotifier<AsyncValue<FarmerModel?>> {
  final FarmerRepository _repository;

  FarmerNotifier(this._repository) : super(const AsyncValue.loading());

  Future<void> load(String farmerId) async {
    state = const AsyncValue.loading();
    try {
      final farmer = await _repository.getFarmerById(farmerId);
      state = AsyncValue.data(farmer);
    } catch (e, s) {
      state = AsyncValue.error(e, s);
    }
  }

  Future<void> update(String farmerId, Map<String, dynamic> data) async {
    try {
      final updated = await _repository.updateFarmer(farmerId, data);
      state = AsyncValue.data(updated);
    } catch (e, s) {
      state = AsyncValue.error(e, s);
    }
  }
}

final farmerNotifierProvider =
    StateNotifierProvider<FarmerNotifier, AsyncValue<FarmerModel?>>(
  (ref) => FarmerNotifier(ref.read(farmerRepositoryProvider)),
);
