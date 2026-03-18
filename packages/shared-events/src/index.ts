export const EXCHANGES = {
  IDENTITY: 'identity.events',
  QUOTATION: 'quotation.events',
  ORDER: 'order.events',
  PAYMENT: 'payment.events',
  COMMISSION: 'commission.events',
  IOT: 'iot.events',
} as const;

export const ROUTING_KEYS = {
  IDENTITY_FARMER_REGISTERED: 'identity.farmer.registered',
  IDENTITY_RETAILER_REGISTERED: 'identity.retailer.registered',
  IDENTITY_KYC_APPROVED: 'identity.kyc.approved',
  IDENTITY_KYC_REJECTED: 'identity.kyc.rejected',
  IDENTITY_DOCUMENT_UPLOADED: 'identity.document.uploaded',
  QUOTATION_QUOTE_CREATED: 'quotation.quote.created',
  QUOTATION_PROPOSAL_RECEIVED: 'quotation.proposal.received',
  QUOTATION_PROPOSAL_ACCEPTED: 'quotation.proposal.accepted',
  QUOTATION_QUOTE_EXPIRED: 'quotation.quote.expired',
  QUOTATION_RECURRING_TRIGGERED: 'quotation.recurring.triggered',
  QUOTATION_AUTO_ACCEPTED: 'quotation.auto.accepted',
  ORDER_CREATED: 'order.created',
  ORDER_DISPATCHED: 'order.dispatched',
  ORDER_DELIVERED: 'order.delivered',
  ORDER_DISPUTED: 'order.disputed',
  PAYMENT_PIX_PENDING: 'payment.pix.pending',
  PAYMENT_CONFIRMED: 'payment.confirmed',
  PAYMENT_FAILED: 'payment.failed',
  COMMISSION_RELEASED: 'commission.released',
  IOT_ALERT_TRIGGERED: 'iot.alert.triggered',
} as const;

export interface BaseEvent<T = unknown> {
  eventId: string;
  timestamp: string;
  version: string;
  correlationId: string;
  payload: T;
}

export interface FarmerRegisteredPayload {
  farmerId: string;
  fullName: string;
  email: string;
}

export interface KycApprovedPayload {
  ownerId: string;
  ownerType: 'FARMER' | 'RETAILER';
  approvedAt: string;
}

export interface KycRejectedPayload {
  ownerId: string;
  reason: string;
  documentsToResubmit: string[];
}

export interface QuoteCreatedPayload {
  quoteId: string;
  farmerId: string;
  items: Array<{ productId: string; tariffCode: string; quantity: number }>;
  stateProvince: string;
  preferredPaymentMethod: string;
  expiresAt: string;
}

export interface ProposalReceivedPayload {
  quoteId: string;
  proposalId: string;
  retailerId: string;
  totalWithTax: number;
}

export interface ProposalAcceptedPayload {
  quoteId: string;
  proposalId: string;
  farmerId: string;
  retailerId: string;
  items: Array<{ productId: string; quantity: number; unitPrice: number }>;
  totalAmount: number;
  preferredPaymentMethod: string;
}

export interface OrderCreatedPayload {
  orderId: string;
  orderNumber: string;
  farmerId: string;
  retailerId: string;
  totalAmount: number;
  preferredPaymentMethod: string;
}

export interface PaymentConfirmedPayload {
  orderId: string;
  transactionId: string;
  farmerId: string;
  retailerId: string;
  amount: number;
  method: string;
  paidAt: string;
}

export interface PaymentFailedPayload {
  orderId: string;
  farmerId: string;
  reason: string;
  failedAt: string;
}

export interface OrderDeliveredPayload {
  orderId: string;
  farmerId: string;
  retailerId: string;
  deliveredAt: string;
  totalAmount: number;
}

export interface CommissionReleasedPayload {
  commissionId: string;
  retailerId: string;
  netAmount: number;
  payoutId: string;
}

export interface PixPendingPayload {
  orderId: string;
  farmerId: string;
  pixQrCode: string;
  pixExpiration: string;
  amount: number;
}

export interface OrderDispatchedPayload {
  orderId: string;
  retailerId: string;
  farmerId: string;
  trackingCode: string;
  estimatedDelivery: string;
}
