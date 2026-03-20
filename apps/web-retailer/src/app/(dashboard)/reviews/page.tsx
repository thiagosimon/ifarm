'use client';

import React, { useState } from 'react';
import {
  Star,
  TrendingUp,
  Users,
  Clock,
  Download,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

// -- Types --

interface Review {
  id: string;
  customer: string;
  rating: number;
  comment: string;
  orderId: string;
  date: string;
  replied: boolean;
  replyTime?: string;
}

interface MonthData {
  month: string;
  avg: number;
  count: number;
}

// -- Mock Data --

const DISTRIBUTION = [
  { stars: 5, count: 198, pct: 58 },
  { stars: 4, count: 87, pct: 26 },
  { stars: 3, count: 32, pct: 9 },
  { stars: 2, count: 15, pct: 4 },
  { stars: 1, count: 10, pct: 3 },
];

const REVIEWS: Review[] = [
  { id: '1', customer: 'Fazenda São João', rating: 5, comment: 'Excelente qualidade dos fertilizantes. Entrega dentro do prazo e embalagem perfeita. Recomendo!', orderId: 'ORD-2024-0089', date: '2', replied: true, replyTime: '2h' },
  { id: '2', customer: 'Cooperativa Agroverde', rating: 4, comment: 'Bom atendimento e produtos de qualidade. Porém a entrega atrasou 1 dia.', orderId: 'ORD-2024-0085', date: '3', replied: true, replyTime: '4h' },
  { id: '3', customer: 'Sítio Boa Esperança', rating: 5, comment: 'Sempre entregam os melhores defensivos. Parceiro de confiança há mais de 3 anos!', orderId: 'ORD-2024-0078', date: '5', replied: false },
  { id: '4', customer: 'Fazenda Três Irmãos', rating: 3, comment: 'Produto bom, mas houve problema com um item do pedido. O suporte resolveu rápido.', orderId: 'ORD-2024-0072', date: '7', replied: true, replyTime: '1h' },
  { id: '5', customer: 'Agropecuária Central', rating: 5, comment: 'Sementes de altíssima qualidade. Germinação acima de 95%. Muito satisfeito!', orderId: 'ORD-2024-0065', date: '10', replied: false },
  { id: '6', customer: 'Fazenda Vista Alegre', rating: 2, comment: 'Pedido veio incompleto. Faltaram 2 itens.', orderId: 'ORD-2024-0060', date: '12', replied: true, replyTime: '30min' },
];

const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;

const EVOLUTION: MonthData[] = [
  { month: 'jan', avg: 4.2, count: 18 },
  { month: 'feb', avg: 4.3, count: 22 },
  { month: 'mar', avg: 4.1, count: 20 },
  { month: 'apr', avg: 4.5, count: 28 },
  { month: 'may', avg: 4.4, count: 25 },
  { month: 'jun', avg: 4.6, count: 30 },
  { month: 'jul', avg: 4.5, count: 27 },
  { month: 'aug', avg: 4.7, count: 32 },
  { month: 'sep', avg: 4.6, count: 29 },
  { month: 'oct', avg: 4.8, count: 35 },
  { month: 'nov', avg: 4.7, count: 33 },
  { month: 'dec', avg: 4.8, count: 38 },
];

const TOTAL_REVIEWS = 342;
const OVERALL_RATING = 4.6;

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            'transition-colors',
            i <= rating ? 'fill-secondary text-secondary' : 'text-outline-variant/30'
          )}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}

type FilterType = 'all' | 'pending' | 'replied';

export default function ReviewsPage() {
  const t = useTranslations('reviews');
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredReviews = REVIEWS.filter((r) => {
    if (filter === 'pending') return !r.replied;
    if (filter === 'replied') return r.replied;
    return true;
  });

  const maxEvolution = Math.max(...EVOLUTION.map((e) => e.avg));

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('title') }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">{t('title')}</h1>
          <p className="text-sm text-on-surface-variant">{t('subtitle')}</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          {t('exportReport')}
        </Button>
      </div>

      {/* Overall Rating + KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Overall Score Card */}
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="text-5xl font-bold text-primary">{OVERALL_RATING}</div>
            <StarRating rating={Math.round(OVERALL_RATING)} size={20} />
            <p className="mt-2 text-xs text-on-surface-variant">
              {t('basedOn', { count: TOTAL_REVIEWS })}
            </p>
          </CardContent>
        </Card>

        {/* KPI: NPS */}
        <Card className="glass-card">
          <CardContent className="py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container/30">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">{t('kpi.nps')}</p>
                <p className="text-2xl font-bold text-on-surface">72</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-on-surface-variant">{t('kpi.npsDescription')}</p>
          </CardContent>
        </Card>

        {/* KPI: Repurchase Rate */}
        <Card className="glass-card">
          <CardContent className="py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-container/30">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">{t('kpi.repurchaseRate')}</p>
                <p className="text-2xl font-bold text-on-surface">68%</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-on-surface-variant">{t('kpi.repurchaseDescription')}</p>
          </CardContent>
        </Card>

        {/* KPI: Response Time */}
        <Card className="glass-card">
          <CardContent className="py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tertiary-container/30">
                <Clock className="h-5 w-5 text-tertiary" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">{t('kpi.responseTime')}</p>
                <p className="text-2xl font-bold text-on-surface">2.4h</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-on-surface-variant">{t('kpi.responseDescription')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution + Evolution */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Star Distribution */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-on-surface">{t('distribution')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {DISTRIBUTION.map((d) => (
              <div key={d.stars} className="flex items-center gap-3">
                <span className="w-8 text-right text-sm font-medium text-on-surface">
                  {d.stars} <Star className="inline h-3 w-3 fill-secondary text-secondary" />
                </span>
                <div className="flex-1 h-3 rounded-full bg-surface-container-high overflow-hidden">
                  <div
                    className="h-full rounded-full bg-secondary transition-all"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <span className="w-12 text-right text-xs text-on-surface-variant">
                  {d.count} ({d.pct}%)
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Evolution Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-on-surface">{t('evolution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1.5" style={{ height: 160 }}>
              {EVOLUTION.map((e) => {
                const heightPct = (e.avg / 5) * 100;
                return (
                  <div key={e.month} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[10px] font-medium text-primary">{e.avg}</span>
                    <div
                      className="w-full rounded-t-md bg-primary/80 hover:bg-primary transition-colors"
                      style={{ height: `${heightPct}%` }}
                      title={`${t(`months.${e.month}`)} — ${e.avg} (${e.count})`}
                    />
                    <span className="text-[10px] text-on-surface-variant">
                      {t(`months.${e.month}`)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-on-surface">{t('recentReviews')}</CardTitle>
            <div className="flex gap-2">
              {(['all', 'pending', 'replied'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                    filter === f
                      ? 'bg-primary-container/30 text-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  )}
                >
                  {t(`filters.${f}`)}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredReviews.length === 0 ? (
            <p className="py-8 text-center text-sm text-on-surface-variant">{t('noReviews')}</p>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container/30 text-sm font-bold text-primary">
                        {review.customer.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-on-surface">{review.customer}</p>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} size={12} />
                          <span className="text-xs text-on-surface-variant">
                            {t('daysAgo', { count: review.date })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-on-surface-variant">{review.comment}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-xs text-outline">{t('order', { id: review.orderId })}</span>
                      {review.replied && (
                        <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                          {t('respondedIn', { time: review.replyTime })}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {!review.replied && (
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                      <MessageSquare className="h-3 w-3" />
                      {t('reply')}
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
