'use client';

import React from 'react';

export interface CommissionTier {
  id: string;
  name: string;
  rate: number;
  minGmv: number;
  maxGmv: number | null;
}

export interface SystemSettings {
  holdbackDays: number;
  defaultServiceFee: number;
  maxSimultaneousQuotes: number;
  disputeSlaBusinessDays: number;
  minOrderValue: number;
  maxCommissionRate: number;
  enabledStates: string[];
}

interface UseSettingsReturn {
  tiers: CommissionTier[];
  settings: SystemSettings | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  updateTier: (id: string, data: Partial<CommissionTier>) => Promise<void>;
  updateSettings: (data: Partial<SystemSettings>) => Promise<void>;
  toggleState: (state: string) => void;
  refresh: () => void;
}

export function useSettings(): UseSettingsReturn {
  const [tiers, setTiers] = React.useState<CommissionTier[]>([]);
  const [settings, setSettings] = React.useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const fetchSettings = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tiersRes, settingsRes] = await Promise.all([
        fetch('/api/v1/settings/commission-tiers'),
        fetch('/api/v1/settings/system'),
      ]);
      const [tiersData, settingsData] = await Promise.all([
        tiersRes.ok ? tiersRes.json() : [],
        settingsRes.ok ? settingsRes.json() : null,
      ]);
      setTiers(tiersData);
      setSettings(settingsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, [refreshTrigger]);

  React.useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateTier = async (id: string, data: Partial<CommissionTier>) => {
    setIsSaving(true);
    try {
      await fetch(`/api/v1/settings/commission-tiers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setRefreshTrigger((n) => n + 1);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSettings = async (data: Partial<SystemSettings>) => {
    setIsSaving(true);
    try {
      await fetch('/api/v1/settings/system', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setRefreshTrigger((n) => n + 1);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleState = (state: string) => {
    if (!settings) return;
    const enabledStates = settings.enabledStates.includes(state)
      ? settings.enabledStates.filter((s) => s !== state)
      : [...settings.enabledStates, state];
    setSettings({ ...settings, enabledStates });
  };

  return {
    tiers,
    settings,
    isLoading,
    isSaving,
    error,
    updateTier,
    updateSettings,
    toggleState,
    refresh: () => setRefreshTrigger((n) => n + 1),
  };
}
