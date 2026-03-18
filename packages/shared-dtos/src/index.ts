export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  details?: Array<{ field: string; error: string }>;
}

export interface TaxCalculationRequest {
  tariffCode: string;
  originStateProvince: string;
  destinationStateProvince: string;
  buyerType: 'INDIVIDUAL' | 'BUSINESS';
  subtotalAmount: number;
}

export interface TaxCalculationResponse {
  stateSalesTaxType: string;
  stateSalesTaxRate: number;
  stateSalesTaxAmount: number;
  interstateVatDifferential: number;
  taxSubstitutionAmount: number;
  legalBasis: string;
  totalWithTax: number;
  calculatedAt: string;
}

export interface CommissionCalculationRequest {
  totalAmount: number;
  transactionType: 'PRODUCT' | 'SERVICE';
}

export interface CommissionCalculationResponse {
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
}

export interface AddressDto {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  countryCode: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface ConsentHistoryDto {
  acceptedAt: string;
  termsVersion: string;
  ipAddress: string;
  deviceId?: string;
}
