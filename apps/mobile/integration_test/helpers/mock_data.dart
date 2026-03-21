// Shared mock data fixtures for all integration tests.
library mock_data;

import 'package:ifarm_mobile/data/models/user_model.dart';
import 'package:ifarm_mobile/data/models/quote_model.dart';
import 'package:ifarm_mobile/data/models/proposal_model.dart';
import 'package:ifarm_mobile/data/models/order_model.dart';
import 'package:ifarm_mobile/data/models/farmer_model.dart';
import 'package:ifarm_mobile/data/models/product_model.dart';
import 'package:ifarm_mobile/data/models/paginated_response.dart';
import 'package:ifarm_mobile/data/models/app_notification_model.dart';
import 'package:ifarm_mobile/data/repositories/quotation_repository.dart';
import 'package:ifarm_mobile/core/constants/enums.dart';

// ─── User ────────────────────────────────────────────────────────────────────

const kMockUser = UserModel(
  sub: 'user-123',
  email: 'produtor@ifarm.com.br',
  name: 'João da Silva',
  roles: ['FARMER'],
);

// ─── Farmer ───────────────────────────────────────────────────────────────────

const kMockFarmer = FarmerModel(
  id: 'farmer-123',
  fullName: 'João da Silva',
  email: 'produtor@ifarm.com.br',
  phoneNumber: '(11) 99999-1234',
  federalTaxId: '123.456.789-00',
  farmName: 'Fazenda São João',
  farmAddress: FarmAddress(
    city: 'Ribeirão Preto',
    stateProvince: 'SP',
    postalCode: '14000-000',
    countryCode: 'BR',
  ),
  status: FarmerStatus.active,
  kycStatus: KycStatus.approved,
  kycDocuments: [],
);

const kMockFarmersPaginated = PaginatedResponse<FarmerModel>(
  data: [kMockFarmer],
  meta: PaginationMeta(page: 1, limit: 20, total: 1, totalPages: 1),
);

// ─── Products ─────────────────────────────────────────────────────────────────

const kMockProduct = ProductModel(
  id: 'prod-001',
  name: 'Soja Premium',
  description: 'Soja de alta qualidade para exportação',
  brand: 'iFarm Seeds',
  category: ProductCategory.seeds,
  tariffCode: '1201.10.00',
  isRuralCreditEligible: true,
  measurementUnit: 'kg',
  images: [],
  attributes: [],
  tags: ['soja', 'grãos'],
);

const kMockProductsPaginated = PaginatedResponse<ProductModel>(
  data: [kMockProduct],
  meta: PaginationMeta(page: 1, limit: 20, total: 1, totalPages: 1),
);

// ─── Quotes ───────────────────────────────────────────────────────────────────

final kMockQuote = QuoteModel(
  id: 'quote-001',
  quoteNumber: 'COT-2024-001',
  farmerId: 'farmer-123',
  items: const [
    QuoteItem(
      productId: 'prod-001',
      productSnapshot: QuoteItemSnapshot(
        name: 'Soja Premium',
        category: 'SEEDS',
        tariffCode: '1201.10.00',
        measurementUnit: 'kg',
      ),
      quantity: 5000,
      measurementUnit: 'kg',
    ),
  ],
  deliveryMode: DeliveryMode.deliveryAddress,
  deliveryAddress: const DeliveryAddress(
    city: 'São Paulo',
    stateProvince: 'SP',
    postalCode: '01310-100',
    countryCode: 'BR',
  ),
  preferredPaymentMethod: PaymentMethod.pix,
  status: QuoteStatus.open,
  proposalCount: 2,
  expiresAt: DateTime(2025, 12, 31),
  createdAt: DateTime(2025, 3, 1),
);

final kMockQuotesPaginated = PaginatedResponse<QuoteModel>(
  data: [kMockQuote],
  meta: const PaginationMeta(page: 1, limit: 20, total: 1, totalPages: 1),
);

const kMockProposal = ProposalModel(
  id: 'proposal-001',
  quoteId: 'quote-001',
  retailerId: 'retailer-001',
  retailerSnapshot: RetailerSnapshot(
    businessName: 'AgroDistribuidora Ltda',
    tradeName: 'AgroDistrib',
    avgRating: 4.7,
    stateProvince: 'SP',
  ),
  items: [
    ProposalItem(
      productId: 'prod-001',
      unitPrice: 2.45,
      totalPrice: 12250.0,
    ),
  ],
  subtotalAmount: 12250.0,
  deliveryFee: 0.0,
  deliveryDays: 7,
  totalWithTaxAndDelivery: 12250.0,
  paymentMethods: ['PIX'],
  observations: '',
  status: ProposalStatus.pending,
);

final kMockQuoteWithProposals = QuoteWithProposals(
  quote: kMockQuote,
  proposals: const [kMockProposal],
);

// ─── Orders ───────────────────────────────────────────────────────────────────

final kMockOrder = OrderModel(
  id: 'order-001',
  orderNumber: 'PED-2024-001',
  quoteId: 'quote-001',
  proposalId: 'proposal-001',
  farmerId: 'farmer-123',
  retailerId: 'retailer-001',
  retailer: const OrderRetailerInfo(
    id: 'retailer-001',
    businessName: 'AgroDistribuidora Ltda',
    tradeName: 'AgroDistrib',
    avgRating: 4.7,
  ),
  items: const [
    OrderItem(
      productId: 'prod-001',
      name: 'Soja Premium',
      quantity: 5000,
      unitPrice: 2.45,
      totalPrice: 12250.0,
    ),
  ],
  totalAmount: 12250.0,
  status: OrderStatus.paid,
  paymentMethod: PaymentMethod.pix,
  statusHistory: [
    StatusHistoryEntry(
      status: 'AWAITING_PAYMENT',
      changedAt: DateTime(2025, 3, 1),
      changedBy: 'system',
    ),
    StatusHistoryEntry(
      status: 'PAID',
      changedAt: DateTime(2025, 3, 2),
      changedBy: 'system',
    ),
  ],
  createdAt: DateTime(2025, 3, 1),
  updatedAt: DateTime(2025, 3, 2),
);

final kMockOrdersPaginated = PaginatedResponse<OrderModel>(
  data: [kMockOrder],
  meta: const PaginationMeta(page: 1, limit: 20, total: 1, totalPages: 1),
);

// ─── Notifications ────────────────────────────────────────────────────────────

final kMockNotification = AppNotificationModel(
  id: 'notif-001',
  title: 'Nova proposta recebida',
  body: 'AgroDistribuidora enviou uma proposta para sua cotação de Soja Premium',
  type: 'proposal',
  isRead: false,
  createdAt: DateTime(2025, 3, 20, 10, 0),
);

final kMockNotifications = [kMockNotification];
