'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Settings, Globe, Bell, Shield, Plug, Check,
  ChevronRight, Moon, Sun, Smartphone, Mail, MessageSquare,
  Key, Monitor, Languages, Clock, Calendar, DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { cn } from '@/lib/utils';

type SettingsTab = 'general' | 'notifications' | 'security' | 'integrations';

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-outline-variant/20 last:border-0">
      <div>
        <p className="text-sm font-medium text-on-surface">{label}</p>
        {description && <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          checked ? 'bg-primary' : 'bg-surface-variant'
        )}
      >
        <span className={cn(
          'inline-block h-4 w-4 rounded-full bg-white transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1'
        )} />
      </button>
    </div>
  );
}

const TABS: { id: SettingsTab; icon: React.ElementType }[] = [
  { id: 'general', icon: Globe },
  { id: 'notifications', icon: Bell },
  { id: 'security', icon: Shield },
  { id: 'integrations', icon: Plug },
];

export default function SettingsPage() {
  const t = useTranslations('settings');
  const tc = useTranslations('common');
  const [tab, setTab] = useState<SettingsTab>('general');
  const [saved, setSaved] = useState(false);

  // Toggle states for notifications
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [quotationNotif, setQuotationNotif] = useState(true);
  const [orderNotif, setOrderNotif] = useState(true);
  const [financialNotif, setFinancialNotif] = useState(true);

  // Toggle states for security
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('title') }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">{t('title')}</h1>
          <p className="text-sm text-on-surface-variant mt-1">{t('subtitle')}</p>
        </div>
        <Button className="gap-2" onClick={handleSave}>
          {saved ? <Check className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
          {saved ? t('saved') : tc('save')}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab Navigation */}
        <div className="lg:w-56 flex-shrink-0">
          <Card className="glass-card">
            <CardContent className="p-2">
              {TABS.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left',
                    tab === id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-on-surface-variant hover:bg-surface-variant/30'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(`sections.${id}`)}
                  <ChevronRight className={cn('h-3 w-3 ml-auto transition-opacity', tab === id ? 'opacity-100' : 'opacity-0')} />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* General Settings */}
          {tab === 'general' && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-on-surface">
                  <Globe className="h-5 w-5" />
                  {t('sections.general')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-on-surface flex items-center gap-2 mb-2">
                    <Languages className="h-4 w-4 text-on-surface-variant" />
                    {t('general.language')}
                  </label>
                  <select className="w-full sm:w-64 rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface">
                    <option value="pt-BR">Português (BR)</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-on-surface flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-on-surface-variant" />
                    {t('general.timezone')}
                  </label>
                  <select className="w-full sm:w-64 rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface">
                    <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                    <option value="America/Manaus">Manaus (GMT-4)</option>
                    <option value="America/Belem">Belém (GMT-3)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-on-surface flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-on-surface-variant" />
                    {t('general.dateFormat')}
                  </label>
                  <select className="w-full sm:w-64 rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface">
                    <option value="dd/MM/yyyy">DD/MM/AAAA</option>
                    <option value="MM/dd/yyyy">MM/DD/AAAA</option>
                    <option value="yyyy-MM-dd">AAAA-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-on-surface flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-on-surface-variant" />
                    {t('general.currency')}
                  </label>
                  <select className="w-full sm:w-64 rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface">
                    <option value="BRL">Real (R$)</option>
                    <option value="USD">Dollar ($)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {tab === 'notifications' && (
            <div className="space-y-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-on-surface text-base">
                    <Bell className="h-5 w-5" />
                    {t('notificationSettings.channels')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ToggleRow label={t('notificationSettings.email')} description="Receba atualizações por e-mail" checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
                  <ToggleRow label={t('notificationSettings.push')} description="Notificações no navegador" checked={pushNotif} onChange={() => setPushNotif(!pushNotif)} />
                  <ToggleRow label={t('notificationSettings.sms')} description="Alertas via SMS" checked={smsNotif} onChange={() => setSmsNotif(!smsNotif)} />
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-on-surface text-base">
                    <MessageSquare className="h-5 w-5" />
                    {t('notificationSettings.events')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ToggleRow label={t('notificationSettings.quotations')} description="Novas cotações e propostas" checked={quotationNotif} onChange={() => setQuotationNotif(!quotationNotif)} />
                  <ToggleRow label={t('notificationSettings.orders')} description="Atualizações de pedidos" checked={orderNotif} onChange={() => setOrderNotif(!orderNotif)} />
                  <ToggleRow label={t('notificationSettings.financial')} description="Pagamentos e comissões" checked={financialNotif} onChange={() => setFinancialNotif(!financialNotif)} />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security Settings */}
          {tab === 'security' && (
            <div className="space-y-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-on-surface text-base">
                    <Key className="h-5 w-5" />
                    {t('security.changePassword')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm text-on-surface-variant mb-1 block">Senha atual</label>
                    <Input type="password" placeholder="••••••••" className="max-w-sm" />
                  </div>
                  <div>
                    <label className="text-sm text-on-surface-variant mb-1 block">Nova senha</label>
                    <Input type="password" placeholder="••••••••" className="max-w-sm" />
                  </div>
                  <div>
                    <label className="text-sm text-on-surface-variant mb-1 block">Confirmar nova senha</label>
                    <Input type="password" placeholder="••••••••" className="max-w-sm" />
                  </div>
                  <Button variant="outline" size="sm">{t('security.changePassword')}</Button>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-on-surface text-base">
                    <Shield className="h-5 w-5" />
                    {t('security.twoFactor')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ToggleRow
                    label={t('security.twoFactor')}
                    description={twoFactor ? t('security.enabled') : t('security.disabled')}
                    checked={twoFactor}
                    onChange={() => setTwoFactor(!twoFactor)}
                  />
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-on-surface text-base">
                    <Monitor className="h-5 w-5" />
                    {t('security.sessions')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { device: 'Chrome — macOS', location: 'São Paulo, BR', current: true },
                      { device: 'Safari — iPhone', location: 'São Paulo, BR', current: false },
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-outline-variant/20 last:border-0">
                        <div className="flex items-center gap-3">
                          <Monitor className="h-4 w-4 text-on-surface-variant" />
                          <div>
                            <p className="text-sm text-on-surface">{session.device}</p>
                            <p className="text-xs text-on-surface-variant">{session.location}</p>
                          </div>
                        </div>
                        {session.current ? (
                          <span className="text-xs text-primary font-medium">Sessão atual</span>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-xs text-red-400">Encerrar</Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Integrations Settings */}
          {tab === 'integrations' && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-on-surface">
                  <Plug className="h-5 w-5" />
                  {t('sections.integrations')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Pagar.me', desc: 'Gateway de pagamento', connected: true, icon: '💳' },
                    { name: 'WhatsApp Business', desc: 'Meta Cloud API', connected: true, icon: '💬' },
                    { name: 'Nota Fiscal (Serpro)', desc: 'Emissão de NF-e', connected: false, icon: '📄' },
                    { name: 'IoT Sensores', desc: 'Monitoramento em tempo real', connected: false, icon: '📡' },
                  ].map((integration) => (
                    <div key={integration.name} className="flex items-center justify-between py-3 border-b border-outline-variant/20 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-on-surface">{integration.name}</p>
                          <p className="text-xs text-on-surface-variant">{integration.desc}</p>
                        </div>
                      </div>
                      <Button
                        variant={integration.connected ? 'outline' : 'default'}
                        size="sm"
                        className="text-xs"
                      >
                        {integration.connected ? tc('connected') : tc('connect')}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
