import { v4 as uuid } from 'uuid';

export class FarmerFactory {
  static create(overrides: Record<string, any> = {}) {
    return {
      _id: uuid(),
      externalAuthId: uuid(),
      fullName: 'João Silva',
      federalTaxId: 'ENCRYPTED_11144477735',
      federalTaxIdIv: 'test-iv-base64',
      email: `farmer-${Date.now()}@test.com`,
      phoneNumber: '+5511999999999',
      preferredLanguage: 'pt-BR',
      countryCode: 'BR',
      farmName: 'Fazenda Teste',
      farmAddress: {
        city: 'Ribeirão Preto',
        stateProvince: 'SP',
        postalCode: '14000000',
        countryCode: 'BR',
        location: { type: 'Point', coordinates: [-47.8103, -21.1767] },
      },
      status: 'ACTIVE',
      kycStatus: 'APPROVED',
      taxValidation: { isValidated: true, isPending: false },
      consentHistory: [{ acceptedAt: new Date().toISOString(), termsVersion: '1.0.0', ipAddress: '127.0.0.1' }],
      schemaVersion: 1,
      deletedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides,
    };
  }

  static createWithPendingKyc(overrides: Record<string, any> = {}) {
    return this.create({ status: 'PENDING_VERIFICATION', kycStatus: 'PENDING', ...overrides });
  }
}

export class RetailerFactory {
  static create(overrides: Record<string, any> = {}) {
    return {
      _id: uuid(),
      externalAuthId: uuid(),
      businessName: 'Agro Insumos Ltda',
      tradeName: 'AgroShop',
      businessRegistrationId: 'ENCRYPTED_11222333000181',
      businessRegistrationIdIv: 'test-iv-base64',
      responsiblePerson: { fullName: 'Maria Souza', email: 'maria@agrotest.com', phoneNumber: '+5511988888888' },
      address: {
        city: 'Campinas',
        stateProvince: 'SP',
        postalCode: '13000000',
        countryCode: 'BR',
        location: { type: 'Point', coordinates: [-47.0626, -22.9064] },
      },
      serviceRegions: [{ stateProvince: 'SP' }, { stateProvince: 'MG' }],
      status: 'ACTIVE',
      kycStatus: 'APPROVED',
      paymentAccount: { bankCode: '001', branchNumber: '1234', accountNumber: '12345-6', pagarmeRecipientId: 're_test123' },
      avgRating: 4.5,
      totalReviews: 100,
      totalSales: 250,
      consentHistory: [{ acceptedAt: new Date().toISOString(), termsVersion: '1.0.0', ipAddress: '127.0.0.1' }],
      schemaVersion: 1,
      deletedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides,
    };
  }
}

export class QuoteFactory {
  static create(overrides: Record<string, any> = {}) {
    return {
      _id: uuid(),
      quoteNumber: `QT-${Date.now()}`,
      farmerId: uuid(),
      farmerSnapshot: { fullName: 'João Silva', stateProvince: 'SP' },
      items: [
        {
          productId: uuid(),
          productSnapshot: { name: 'NPK 10-20-20', category: 'FERTILIZERS', tariffCode: '31052000' },
          quantity: 100,
          measurementUnit: 'KG',
        },
      ],
      deliveryMode: 'DELIVERY_ADDRESS',
      deliveryAddress: { city: 'Ribeirão Preto', stateProvince: 'SP', postalCode: '14000000', countryCode: 'BR' },
      preferredPaymentMethod: 'PIX',
      status: 'OPEN',
      proposalCount: 0,
      bestProposal: null,
      selectedProposalId: null,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides,
    };
  }
}

export class OrderFactory {
  static create(overrides: Record<string, any> = {}) {
    return {
      id: uuid(),
      orderNumber: `ORD-${Date.now()}`,
      quoteId: uuid(),
      proposalId: uuid(),
      farmerId: uuid(),
      retailerId: uuid(),
      items: [{ productId: uuid(), name: 'NPK 10-20-20', quantity: 100, unitPrice: 25.00, totalPrice: 2500.00 }],
      totalAmount: 2500.00,
      commissionAmount: 125.00,
      status: 'AWAITING_PAYMENT',
      paymentMethod: 'PIX',
      statusHistory: [{ status: 'AWAITING_PAYMENT', changedAt: new Date().toISOString(), changedBy: 'system' }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides,
    };
  }
}
