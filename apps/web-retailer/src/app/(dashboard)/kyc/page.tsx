'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Shield, FileCheck, Landmark, ClipboardCheck, Upload, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { cn } from '@/lib/utils';

type KycStatus = 'pending' | 'approved' | 'rejected' | 'inReview';
type StepId = 'documents' | 'bankAccount' | 'review';

interface KycStep {
  id: StepId;
  status: KycStatus;
  completedAt?: string;
}

const STATUS_CONFIG: Record<KycStatus, { icon: React.ElementType; color: string; badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { icon: Clock, color: 'text-yellow-400', badgeVariant: 'outline' },
  approved: { icon: CheckCircle2, color: 'text-emerald-400', badgeVariant: 'default' },
  rejected: { icon: XCircle, color: 'text-red-400', badgeVariant: 'destructive' },
  inReview: { icon: AlertCircle, color: 'text-blue-400', badgeVariant: 'secondary' },
};

const STEP_ICON: Record<StepId, React.ElementType> = {
  documents: FileCheck,
  bankAccount: Landmark,
  review: ClipboardCheck,
};

interface Document {
  id: string;
  name: string;
  description: string;
  status: KycStatus;
  fileName?: string;
}

const INITIAL_STEPS: KycStep[] = [
  { id: 'documents', status: 'inReview', completedAt: '2024-01-15' },
  { id: 'bankAccount', status: 'approved', completedAt: '2024-01-14' },
  { id: 'review', status: 'pending' },
];

const DOCUMENTS: Document[] = [
  { id: '1', name: 'Contrato Social', description: 'Última alteração contratual consolidada', status: 'approved', fileName: 'contrato_social_v3.pdf' },
  { id: '2', name: 'CNPJ', description: 'Cartão CNPJ atualizado (últimos 30 dias)', status: 'approved', fileName: 'cartao_cnpj.pdf' },
  { id: '3', name: 'Comprovante de Endereço', description: 'Conta de luz, água ou telefone (últimos 90 dias)', status: 'inReview', fileName: 'comprovante_endereco.pdf' },
  { id: '4', name: 'Documento do Responsável', description: 'CNH ou RG do representante legal', status: 'pending' },
  { id: '5', name: 'Inscrição Estadual', description: 'Certidão de inscrição estadual ativa', status: 'pending' },
];

export default function KycPage() {
  const t = useTranslations('kyc');
  const tc = useTranslations('common');
  const [steps] = useState(INITIAL_STEPS);
  const [documents] = useState(DOCUMENTS);

  const completedSteps = steps.filter(s => s.status === 'approved').length;
  const progress = Math.round((completedSteps / steps.length) * 100);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('title') }]} />

      <div>
        <h1 className="text-2xl font-bold text-on-surface">{t('title')}</h1>
        <p className="text-sm text-on-surface-variant mt-1">{t('subtitle')}</p>
      </div>

      {/* Progress Overview */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-on-surface">Verificação KYC</h2>
                <p className="text-sm text-on-surface-variant">{completedSteps} de {steps.length} etapas concluídas</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-primary">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-surface-variant overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, idx) => {
          const StepIcon = STEP_ICON[step.id];
          const config = STATUS_CONFIG[step.status];
          const StatusIcon = config.icon;
          return (
            <Card key={step.id} className={cn('glass-card relative', step.status === 'approved' && 'border-emerald-500/30')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-variant/50">
                    <StepIcon className="h-5 w-5 text-on-surface-variant" />
                  </div>
                  <Badge variant={config.badgeVariant} className="gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {t(`status.${step.status}`)}
                  </Badge>
                </div>
                <h3 className="font-semibold text-on-surface">{t(`steps.${step.id}`)}</h3>
                {step.completedAt && (
                  <p className="text-xs text-on-surface-variant mt-1">
                    {tc('completedAt') || 'Concluído em'}: {step.completedAt}
                  </p>
                )}
                {idx < steps.length - 1 && (
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 hidden md:block">
                    <div className={cn('h-0.5 w-4', step.status === 'approved' ? 'bg-emerald-500' : 'bg-surface-variant')} />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Documents */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-on-surface">{t('steps.documents')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {documents.map(doc => {
            const config = STATUS_CONFIG[doc.status];
            const StatusIcon = config.icon;
            return (
              <div key={doc.id} className="flex items-center gap-4 rounded-lg border border-outline-variant/30 p-4">
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', `${config.color} bg-surface-variant/50`)}>
                  <StatusIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-on-surface">{doc.name}</p>
                  <p className="text-sm text-on-surface-variant">{doc.description}</p>
                  {doc.fileName && (
                    <p className="text-xs text-primary mt-1">{doc.fileName}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={config.badgeVariant} className="gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {t(`status.${doc.status}`)}
                  </Badge>
                  {doc.status === 'pending' && (
                    <Button size="sm" className="gap-1">
                      <Upload className="h-4 w-4" />
                      Upload
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Bank Account */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-on-surface">{t('steps.bankAccount')}</CardTitle>
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {t('status.approved')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-surface-variant/30 p-4">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Banco</p>
              <p className="font-medium text-on-surface">Banco do Brasil (001)</p>
            </div>
            <div className="rounded-lg bg-surface-variant/30 p-4">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Agência</p>
              <p className="font-medium text-on-surface">1234-5</p>
            </div>
            <div className="rounded-lg bg-surface-variant/30 p-4">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Conta</p>
              <p className="font-medium text-on-surface">12345-6</p>
            </div>
            <div className="rounded-lg bg-surface-variant/30 p-4">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Titular</p>
              <p className="font-medium text-on-surface">AgroComercial Silva LTDA</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
