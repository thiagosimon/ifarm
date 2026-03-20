'use client';

import React, { useState } from 'react';
import {
  Store,
  Upload,
  Camera,
  Building2,
  MapPin,
  FileText,
  Settings2,
  Landmark,
  Tag,
  X,
  Clock,
  Truck,
  CreditCard,
  Save,
  RotateCcw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

// -- Types --

interface StoreProfile {
  companyName: string;
  tradeName: string;
  cnpj: string;
  stateRegistration: string;
  email: string;
  phone: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  bio: string;
  specialties: string[];
  deliveryTime: string;
  minOrder: string;
  serviceArea: string;
  businessHours: string;
  paymentMethods: string[];
  bankName: string;
  branch: string;
  account: string;
  holder: string;
}

const initialProfile: StoreProfile = {
  companyName: 'AgroComercial Silva Ltda',
  tradeName: 'AgroComercial Silva',
  cnpj: '12.345.678/0001-90',
  stateRegistration: '123.456.789.012',
  email: 'contato@agrosilva.com.br',
  phone: '(11) 98765-4321',
  zipCode: '14020-000',
  street: 'Av. do Comércio Agrícola',
  number: '1500',
  complement: 'Galpão 3',
  neighborhood: 'Centro',
  city: 'Ribeirão Preto',
  state: 'SP',
  bio: 'Distribuidora de insumos agrícolas com mais de 15 anos de experiência no mercado. Especializada em fertilizantes e defensivos para culturas de soja, milho e café.',
  specialties: ['Fertilizantes', 'Defensivos', 'Sementes', 'Nutrição Foliar'],
  deliveryTime: '5-7 dias úteis',
  minOrder: 'R$ 500,00',
  serviceArea: '300',
  businessHours: 'Seg-Sex 07:00-18:00',
  paymentMethods: ['pix', 'boleto', 'card'],
  bankName: 'Banco do Brasil',
  branch: '1234-5',
  account: '12345-6',
  holder: 'AgroComercial Silva Ltda',
};

const COMPLETION_FIELDS: (keyof StoreProfile)[] = [
  'companyName', 'tradeName', 'cnpj', 'email', 'phone',
  'zipCode', 'street', 'city', 'state', 'bio',
  'deliveryTime', 'bankName', 'branch', 'account',
];

function calcCompletion(profile: StoreProfile): number {
  const filled = COMPLETION_FIELDS.filter((f) => {
    const v = profile[f];
    return typeof v === 'string' ? v.trim().length > 0 : Array.isArray(v) && v.length > 0;
  }).length;
  return Math.round((filled / COMPLETION_FIELDS.length) * 100);
}

const BR_STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const [profile, setProfile] = useState<StoreProfile>(initialProfile);
  const [newTag, setNewTag] = useState('');
  const completion = calcCompletion(profile);

  function updateField<K extends keyof StoreProfile>(key: K, val: StoreProfile[K]) {
    setProfile((prev) => ({ ...prev, [key]: val }));
  }

  function addTag() {
    const tag = newTag.trim();
    if (tag && !profile.specialties.includes(tag)) {
      updateField('specialties', [...profile.specialties, tag]);
    }
    setNewTag('');
  }

  function removeTag(tag: string) {
    updateField('specialties', profile.specialties.filter((t) => t !== tag));
  }

  function togglePayment(method: string) {
    const methods = profile.paymentMethods.includes(method)
      ? profile.paymentMethods.filter((m) => m !== method)
      : [...profile.paymentMethods, method];
    updateField('paymentMethods', methods);
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('title') }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">{t('title')}</h1>
          <p className="text-sm text-on-surface-variant">{t('subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            {t('actions.discard')}
          </Button>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            {t('actions.save')}
          </Button>
        </div>
      </div>

      {/* Profile Completion */}
      <Card className="glass-card">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-on-surface">{t('completion')}</span>
            <span className="text-sm font-bold text-primary">{completion}%</span>
          </div>
          <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
          {completion < 100 && (
            <p className="mt-2 text-xs text-secondary">{t('almostThere')}</p>
          )}
        </CardContent>
      </Card>

      {/* Identity Visual */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-on-surface">
            <Store className="h-5 w-5 text-primary" />
            {t('identity.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
              {t('identity.banner')}
            </label>
            <div className="mt-2 flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-on-surface-variant/50" />
                <p className="mt-1 text-xs text-on-surface-variant">{t('identity.bannerRecommended')}</p>
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
              {t('identity.logo')}
            </label>
            <div className="mt-2 flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-outline-variant bg-surface-container-low">
              <Camera className="h-6 w-6 text-on-surface-variant/50" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Data */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-on-surface">
            <Building2 className="h-5 w-5 text-primary" />
            {t('business.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                {t('business.companyName')}
              </label>
              <Input
                value={profile.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                {t('business.tradeName')}
              </label>
              <Input
                value={profile.tradeName}
                onChange={(e) => updateField('tradeName', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                {t('business.cnpj')}
              </label>
              <Input value={profile.cnpj} disabled className="mt-1 opacity-60" />
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                {t('business.stateRegistration')}
              </label>
              <Input
                value={profile.stateRegistration}
                onChange={(e) => updateField('stateRegistration', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                {t('business.email')}
              </label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                {t('business.phone')}
              </label>
              <Input
                value={profile.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-on-surface">
            <MapPin className="h-5 w-5 text-primary" />
            {t('address.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                {t('address.zipCode')}
              </label>
              <div className="mt-1 flex gap-2">
                <Input
                  value={profile.zipCode}
                  onChange={(e) => updateField('zipCode', e.target.value)}
                />
                <Button variant="outline" size="sm">{t('address.searchZip')}</Button>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                {t('address.street')}
              </label>
              <Input
                value={profile.street}
                onChange={(e) => updateField('street', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                {t('address.number')}
              </label>
              <Input
                value={profile.number}
                onChange={(e) => updateField('number', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                {t('address.complement')}
              </label>
              <Input
                value={profile.complement}
                onChange={(e) => updateField('complement', e.target.value)}
                className="mt-1"
                placeholder={t('address.complementPlaceholder')}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                {t('address.neighborhood')}
              </label>
              <Input
                value={profile.neighborhood}
                onChange={(e) => updateField('neighborhood', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                {t('address.city')}
              </label>
              <Input
                value={profile.city}
                onChange={(e) => updateField('city', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                {t('address.state')}
              </label>
              <select
                value={profile.state}
                onChange={(e) => updateField('state', e.target.value)}
                className="mt-1 w-full rounded-lg border border-outline-variant bg-surface-container px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {BR_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-on-surface">
            <FileText className="h-5 w-5 text-primary" />
            {t('about.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
              {t('about.bio')}
            </label>
            <Textarea
              value={profile.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              rows={4}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
              {t('about.specialties')}
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.specialties.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-primary-container/30 px-3 py-1 text-xs font-medium text-primary"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1 hover:text-error">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder={t('about.addTag')}
                className="max-w-xs"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button variant="outline" size="sm" onClick={addTag}>
                {tCommon('add')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commercial Config */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-on-surface">
            <Settings2 className="h-5 w-5 text-primary" />
            {t('commercial.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                <Truck className="h-3.5 w-3.5" />
                {t('commercial.deliveryTime')}
              </label>
              <Input
                value={profile.deliveryTime}
                onChange={(e) => updateField('deliveryTime', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5" />
                {t('commercial.minOrder')}
              </label>
              <Input
                value={profile.minOrder}
                onChange={(e) => updateField('minOrder', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {t('commercial.serviceArea')}
              </label>
              <Input
                value={profile.serviceArea}
                onChange={(e) => updateField('serviceArea', e.target.value)}
                className="mt-1"
                type="number"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {t('commercial.businessHours')}
              </label>
              <Input
                value={profile.businessHours}
                onChange={(e) => updateField('businessHours', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
              {t('commercial.paymentMethods')}
            </label>
            <div className="mt-2 flex gap-3">
              {(['pix', 'boleto', 'card'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => togglePayment(m)}
                  className={cn(
                    'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                    profile.paymentMethods.includes(m)
                      ? 'border-primary bg-primary-container/30 text-primary'
                      : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
                  )}
                >
                  {t(`commercial.methods.${m}`)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Data */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-on-surface">
            <Landmark className="h-5 w-5 text-primary" />
            {t('bank.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                {t('bank.bankName')}
              </label>
              <Input
                value={profile.bankName}
                onChange={(e) => updateField('bankName', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                {t('bank.branch')}
              </label>
              <Input
                value={profile.branch}
                onChange={(e) => updateField('branch', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                {t('bank.account')}
              </label>
              <Input
                value={profile.account}
                onChange={(e) => updateField('account', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                {t('bank.holder')}
              </label>
              <Input
                value={profile.holder}
                onChange={(e) => updateField('holder', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom actions */}
      <div className="flex justify-end gap-3 pb-8">
        <Button variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          {t('actions.discard')}
        </Button>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          {t('actions.save')}
        </Button>
      </div>
    </div>
  );
}
