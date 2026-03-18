import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ---------- Admin Dashboard ----------

export async function fetchAdminDashboard(params?: { from?: string; to?: string }) {
  const { data } = await api.get('/v1/admin/dashboard', { params });
  return data;
}

// ---------- Users / Farmers ----------

export interface UserFilters {
  page?: number;
  limit?: number;
  status?: string;
  kycStatus?: string;
  search?: string;
}

export async function fetchFarmers(filters: UserFilters = {}) {
  const { data } = await api.get('/v1/admin/users/farmers', { params: filters });
  return data;
}

export async function fetchFarmerById(id: string) {
  const { data } = await api.get(`/v1/admin/users/farmers/${id}`);
  return data;
}

export async function approveFarmerKyc(id: string) {
  const { data } = await api.post(`/v1/admin/users/farmers/${id}/kyc/approve`);
  return data;
}

export async function rejectFarmerKyc(id: string, reason: string) {
  const { data } = await api.post(`/v1/admin/users/farmers/${id}/kyc/reject`, { reason });
  return data;
}

export async function suspendFarmer(id: string, reason: string) {
  const { data } = await api.post(`/v1/admin/users/farmers/${id}/suspend`, { reason });
  return data;
}

export async function reactivateFarmer(id: string) {
  const { data } = await api.post(`/v1/admin/users/farmers/${id}/reactivate`);
  return data;
}

// ---------- Users / Retailers ----------

export async function fetchRetailers(filters: UserFilters = {}) {
  const { data } = await api.get('/v1/admin/users/retailers', { params: filters });
  return data;
}

export async function fetchRetailerById(id: string) {
  const { data } = await api.get(`/v1/admin/users/retailers/${id}`);
  return data;
}

export async function approveRetailerKyc(id: string) {
  const { data } = await api.post(`/v1/admin/users/retailers/${id}/kyc/approve`);
  return data;
}

export async function rejectRetailerKyc(id: string, reason: string) {
  const { data } = await api.post(`/v1/admin/users/retailers/${id}/kyc/reject`, { reason });
  return data;
}

export async function suspendRetailer(id: string, reason: string) {
  const { data } = await api.post(`/v1/admin/users/retailers/${id}/suspend`, { reason });
  return data;
}

export async function reactivateRetailer(id: string) {
  const { data } = await api.post(`/v1/admin/users/retailers/${id}/reactivate`);
  return data;
}

// ---------- KYC Queue ----------

export async function fetchKycQueue(params?: { page?: number; limit?: number }) {
  const { data } = await api.get('/v1/admin/kyc/queue', { params });
  return data;
}

export async function getKycDocumentUrl(userId: string, documentKey: string) {
  const { data } = await api.get(`/v1/admin/kyc/${userId}/documents/${documentKey}/url`);
  return data;
}

// ---------- Orders ----------

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export async function fetchOrders(filters: OrderFilters = {}) {
  const { data } = await api.get('/v1/admin/orders', { params: filters });
  return data;
}

export async function fetchOrderById(id: string) {
  const { data } = await api.get(`/v1/admin/orders/${id}`);
  return data;
}

export async function cancelOrder(id: string, reason: string) {
  const { data } = await api.post(`/v1/admin/orders/${id}/cancel`, { reason });
  return data;
}

export async function fetchOrderTimeline(id: string) {
  const { data } = await api.get(`/v1/admin/orders/${id}/timeline`);
  return data;
}

// ---------- Disputes ----------

export interface DisputeFilters {
  page?: number;
  limit?: number;
  status?: string;
}

export async function fetchDisputes(filters: DisputeFilters = {}) {
  const { data } = await api.get('/v1/admin/disputes', { params: filters });
  return data;
}

export async function fetchDisputeById(id: string) {
  const { data } = await api.get(`/v1/admin/disputes/${id}`);
  return data;
}

export type DisputeResolution = 'FARMER_WINS' | 'RETAILER_WINS' | 'PARTIAL_REFUND';

export async function resolveDispute(
  id: string,
  resolution: DisputeResolution,
  details: { reason: string; partialAmount?: number }
) {
  const { data } = await api.post(`/v1/admin/disputes/${id}/resolve`, {
    resolution,
    ...details,
  });
  return data;
}

// ---------- Financial ----------

export interface FinancialFilters {
  from?: string;
  to?: string;
  groupBy?: 'day' | 'week' | 'month';
}

export async function fetchFinancialOverview(filters: FinancialFilters = {}) {
  const { data } = await api.get('/v1/admin/financial/overview', { params: filters });
  return data;
}

export async function fetchPayouts(params?: { page?: number; limit?: number; status?: string }) {
  const { data } = await api.get('/v1/admin/financial/payouts', { params });
  return data;
}

export async function exportFinancialCsv(filters: FinancialFilters = {}) {
  const { data } = await api.get('/v1/admin/financial/export', {
    params: filters,
    responseType: 'blob',
  });
  return data;
}

// ---------- Settings ----------

export interface CommissionTier {
  tierId: string;
  name: string;
  rate: number;
  minGmv?: number;
  maxGmv?: number;
}

export async function fetchCommissionTiers() {
  const { data } = await api.get('/v1/admin/settings/commission-tiers');
  return data;
}

export async function updateCommissionTier(tierId: string, payload: Partial<CommissionTier>) {
  const { data } = await api.put(`/v1/admin/settings/commission-tiers/${tierId}`, payload);
  return data;
}

export async function fetchEnabledRegions() {
  const { data } = await api.get('/v1/admin/settings/regions');
  return data;
}

export async function updateEnabledRegions(regions: string[]) {
  const { data } = await api.put('/v1/admin/settings/regions', { regions });
  return data;
}

export async function fetchSystemConfig() {
  const { data } = await api.get('/v1/admin/settings/config');
  return data;
}

export async function updateSystemConfig(config: Record<string, unknown>) {
  const { data } = await api.put('/v1/admin/settings/config', config);
  return data;
}
