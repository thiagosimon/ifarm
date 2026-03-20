'use client';

import React from 'react';

export interface FinancialMetrics {
  gmvTotal: number;
  commissions: number;
  payoutsProcessed: number;
  payoutsPending: number;
  gmvGrowth: number;
  commissionsGrowth: number;
}

export interface GmvDataPoint {
  date: string;
  gmv: number;
  commission: number;
}

export interface CommissionTierData {
  tier: string;
  value: number;
  percentage: number;
}

export interface Payout {
  id: string;
  farmer: string;
  farmerId: string;
  amount: number;
  status: 'paid' | 'pending' | 'holdback';
  date: string;
  transactionId?: string;
}

interface UseFinancialReturn {
  metrics: FinancialMetrics | null;
  gmvData: GmvDataPoint[];
  commissionTiers: CommissionTierData[];
  payouts: Payout[];
  isLoading: boolean;
  error: string | null;
  dateFrom: string;
  setDateFrom: (v: string) => void;
  dateTo: string;
  setDateTo: (v: string) => void;
  exportCsv: () => Promise<void>;
  refresh: () => void;
}

export function useFinancial(): UseFinancialReturn {
  const [metrics, setMetrics] = React.useState<FinancialMetrics | null>(null);
  const [gmvData, setGmvData] = React.useState<GmvDataPoint[]>([]);
  const [commissionTiers, setCommissionTiers] = React.useState<CommissionTierData[]>([]);
  const [payouts, setPayouts] = React.useState<Payout[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const fetchFinancial = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      });
      const [metricsRes, gmvRes, tiersRes, payoutsRes] = await Promise.all([
        fetch(`/api/v1/financial/metrics?${params}`),
        fetch(`/api/v1/financial/gmv?${params}`),
        fetch(`/api/v1/financial/commission-tiers?${params}`),
        fetch(`/api/v1/financial/payouts?${params}&limit=10`),
      ]);

      const [metricsData, gmvDataRes, tiersData, payoutsData] = await Promise.all([
        metricsRes.ok ? metricsRes.json() : null,
        gmvRes.ok ? gmvRes.json() : [],
        tiersRes.ok ? tiersRes.json() : [],
        payoutsRes.ok ? payoutsRes.json() : { items: [] },
      ]);

      setMetrics(metricsData);
      setGmvData(gmvDataRes);
      setCommissionTiers(tiersData);
      setPayouts(payoutsData.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, [dateFrom, dateTo, refreshTrigger]);

  React.useEffect(() => {
    fetchFinancial();
  }, [fetchFinancial]);

  const exportCsv = async () => {
    const params = new URLSearchParams({
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
    });
    const res = await fetch(`/api/v1/financial/export?${params}`);
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financeiro-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return {
    metrics,
    gmvData,
    commissionTiers,
    payouts,
    isLoading,
    error,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    exportCsv,
    refresh: () => setRefreshTrigger((n) => n + 1),
  };
}
