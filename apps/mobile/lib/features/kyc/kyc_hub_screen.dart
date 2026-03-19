import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import '../../core/constants/enums.dart';
import '../../data/models/farmer_model.dart';
import '../../data/repositories/farmer_repository.dart';
import '../../providers/farmer_provider.dart';

// ─── Document descriptor ──────────────────────────────────────────────────────
class _DocItem {
  final String name;
  final String hint;
  final IconData icon;
  final String docTypeValue;

  const _DocItem({
    required this.name,
    required this.hint,
    required this.icon,
    required this.docTypeValue,
  });
}

const _kDocs = [
  _DocItem(
    name: 'Identidade (Frente)',
    hint: 'RG ou CNH (frente)',
    icon: Icons.badge_outlined,
    docTypeValue: 'ID_FRONT',
  ),
  _DocItem(
    name: 'Identidade (Verso)',
    hint: 'RG ou CNH (verso)',
    icon: Icons.badge_outlined,
    docTypeValue: 'ID_BACK',
  ),
  _DocItem(
    name: 'Comprovante de Endereço',
    hint: 'Conta de Luz/Água',
    icon: Icons.home_outlined,
    docTypeValue: 'ADDRESS_PROOF',
  ),
  _DocItem(
    name: 'Doc. Produtor Rural',
    hint: 'Cadastro estadual ou DAP',
    icon: Icons.agriculture_outlined,
    docTypeValue: 'RURAL_PRODUCER_DOC',
  ),
];

class KycHubScreen extends ConsumerWidget {
  const KycHubScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final farmerAsync = ref.watch(currentFarmerProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF7F9FB),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF7F9FB),
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        title: const Text(
          'iFarm',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w900,
            letterSpacing: -1,
            color: Color(0xFF005129),
          ),
        ),
      ),
      body: farmerAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: Color(0xFF005129)),
        ),
        error: (e, _) => Center(child: Text(e.toString())),
        data: (farmer) => _KycBody(farmer: farmer),
      ),
    );
  }
}

// ─── Stateful body (manages local upload state) ───────────────────────────────
class _KycBody extends ConsumerStatefulWidget {
  final FarmerModel? farmer;
  const _KycBody({required this.farmer});

  @override
  ConsumerState<_KycBody> createState() => _KycBodyState();
}

class _KycBodyState extends ConsumerState<_KycBody> {
  final _picker = ImagePicker();
  final Map<int, bool> _uploaded = {};
  bool _isUploading = false;

  int get _uploadedCount {
    final localUploaded = _uploaded.values.where((v) => v).length;
    final serverUploaded = widget.farmer?.kycDocuments.length ?? 0;
    return (localUploaded + serverUploaded).clamp(0, _kDocs.length);
  }

  bool _isDocUploaded(int index) {
    if (_uploaded[index] == true) return true;
    final docTypeValue = _kDocs[index].docTypeValue;
    return widget.farmer?.kycDocuments
            .any((d) => d.documentType == docTypeValue) ??
        false;
  }

  Future<void> _pickDocument(int index) async {
    final source = await _showSourcePicker();
    if (source == null || !mounted) return;

    final file = await _picker.pickImage(source: source, imageQuality: 80);
    if (file == null || !mounted) return;

    setState(() => _isUploading = true);
    try {
      final farmer = widget.farmer;
      if (farmer != null) {
        final repo = ref.read(farmerRepositoryProvider);
        await repo.uploadDocument(
          farmerId: farmer.id,
          filePath: file.path,
          documentType: _kDocs[index].docTypeValue,
        );
      }
      setState(() => _uploaded[index] = true);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Documento enviado com sucesso!'),
            backgroundColor: const Color(0xFF005129),
            behavior: SnackBarBehavior.floating,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Erro ao enviar documento.'),
            backgroundColor: const Color(0xFFBA1A1A),
            behavior: SnackBarBehavior.floating,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isUploading = false);
    }
  }

  Future<ImageSource?> _showSourcePicker() {
    return showModalBottomSheet<ImageSource>(
      context: context,
      backgroundColor: const Color(0xFFFFFFFF),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFFBFC9BE),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 16),
            ListTile(
              leading: const Icon(Icons.camera_alt_outlined,
                  color: Color(0xFF005129)),
              title: const Text('Câmera',
                  style: TextStyle(fontSize: 15, color: Color(0xFF191C1E))),
              onTap: () => Navigator.pop(ctx, ImageSource.camera),
            ),
            ListTile(
              leading: const Icon(Icons.photo_library_outlined,
                  color: Color(0xFF005129)),
              title: const Text('Galeria',
                  style: TextStyle(fontSize: 15, color: Color(0xFF191C1E))),
              onTap: () => Navigator.pop(ctx, ImageSource.gallery),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  // ─── KYC status banner ────────────────────────────────────────────────────
  Widget _statusBanner(FarmerModel? farmer) {
    final kycStatus = farmer?.kycStatus ?? KycStatus.notStarted;
    final isApproved = kycStatus == KycStatus.approved;

    final Gradient gradient;
    final IconData statusIcon;
    final String statusLabel;

    if (isApproved) {
      gradient = const LinearGradient(
        colors: [Color(0xFF005129), Color(0xFF1A6B3C)],
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
      );
      statusIcon = Icons.verified_outlined;
      statusLabel = 'Identidade Verificada';
    } else {
      gradient = const LinearGradient(
        colors: [Color(0xFF795900), Color(0xFFFFC641)],
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
      );
      statusIcon = Icons.hourglass_empty_rounded;
      statusLabel = kycStatus.label;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        gradient: gradient,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(statusIcon, color: Colors.white, size: 22),
          const SizedBox(width: 12),
          Text(
            statusLabel,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
          const Spacer(),
          const Text(
            'Em análise',
            style: TextStyle(
              fontSize: 12,
              color: Colors.white70,
            ),
          ),
        ],
      ),
    );
  }

  // ─── Document card ────────────────────────────────────────────────────────
  Widget _docCard(int index) {
    final doc = _kDocs[index];
    final uploaded = _isDocUploaded(index);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0x26BFC9BE),
          width: 1,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x14005129),
            offset: Offset(0, 8),
            blurRadius: 24,
          ),
        ],
      ),
      child: Row(
        children: [
          // Status icon
          Icon(
            uploaded ? Icons.check_circle : Icons.upload_file_outlined,
            color: uploaded
                ? const Color(0xFF005129)
                : const Color(0xFF707A70),
            size: 28,
          ),
          const SizedBox(width: 12),

          // Text info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  doc.name,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF191C1E),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  doc.hint,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF707A70),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(width: 8),

          // Action button
          OutlinedButton(
            onPressed: _isUploading ? null : () => _pickDocument(index),
            style: OutlinedButton.styleFrom(
              foregroundColor: const Color(0xFF005129),
              side: const BorderSide(color: Color(0xFF005129), width: 1),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              padding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              textStyle: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
            child: Text(uploaded ? 'Re-enviar' : 'Enviar'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final farmer = widget.farmer;
    final uploadedCount = _uploadedCount;
    final total = _kDocs.length;
    final progress = total > 0 ? uploadedCount / total : 0.0;

    // Ref ID from farmer id
    final refId = farmer != null && farmer.id.length >= 8
        ? farmer.id.substring(0, 8).toUpperCase()
        : '--------';

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ─── Heading ────────────────────────────────────────────────────
          const Text(
            'Central de Documentos',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w800,
              letterSpacing: -1,
              color: Color(0xFF191C1E),
              height: 1.15,
            ),
          ),

          const SizedBox(height: 8),

          const Text(
            'Mantenha sua propriedade regularizada e em conformidade.',
            style: TextStyle(
              fontSize: 14,
              color: Color(0xFF404940),
              height: 1.5,
            ),
          ),

          const SizedBox(height: 4),

          Text(
            'Ref. #IF-$refId',
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: Color(0xFF707A70),
            ),
          ),

          const SizedBox(height: 24),

          // ─── Status banner ───────────────────────────────────────────────
          _statusBanner(farmer),

          const SizedBox(height: 16),

          // ─── Progress section ────────────────────────────────────────────
          Row(
            children: [
              Text(
                '$uploadedCount/$total enviados',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF191C1E),
                ),
              ),
              const Spacer(),
              Text(
                '${(progress * 100).round()}%',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF191C1E),
                ),
              ),
            ],
          ),

          const SizedBox(height: 8),

          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: progress.clamp(0.0, 1.0),
              minHeight: 6,
              backgroundColor: const Color(0xFFE0E3E5),
              valueColor:
                  const AlwaysStoppedAnimation<Color>(Color(0xFF005129)),
            ),
          ),

          const SizedBox(height: 12),

          // Real-time analysis note
          const Row(
            children: [
              Icon(
                Icons.verified_user,
                color: Color(0xFF005129),
                size: 16,
              ),
              SizedBox(width: 8),
              Text(
                'Análise em tempo real · 4 horas úteis',
                style: TextStyle(
                  fontSize: 12,
                  color: Color(0xFF707A70),
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // ─── Document cards ──────────────────────────────────────────────
          for (int i = 0; i < _kDocs.length; i++) _docCard(i),

          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
