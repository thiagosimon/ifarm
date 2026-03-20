'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Users, UserPlus, Mail, Shield, Eye, Settings, MoreVertical, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { cn } from '@/lib/utils';

type Role = 'admin' | 'manager' | 'operator' | 'viewer';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  lastActive: string;
  status: 'active' | 'invited';
}

const ROLE_ICON: Record<Role, React.ElementType> = {
  admin: Shield,
  manager: Settings,
  operator: Users,
  viewer: Eye,
};

const ROLE_COLOR: Record<Role, string> = {
  admin: 'bg-red-500/20 text-red-400 border-red-500/30',
  manager: 'bg-primary/20 text-primary border-primary/30',
  operator: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  viewer: 'bg-surface-variant text-on-surface-variant border-outline-variant/30',
};

const MEMBERS: TeamMember[] = [
  { id: '1', name: 'Carlos Silva', email: 'carlos@agrosilva.com.br', role: 'admin', avatar: 'CS', lastActive: 'Agora', status: 'active' },
  { id: '2', name: 'Maria Oliveira', email: 'maria@agrosilva.com.br', role: 'manager', avatar: 'MO', lastActive: '5 min atrás', status: 'active' },
  { id: '3', name: 'João Santos', email: 'joao@agrosilva.com.br', role: 'operator', avatar: 'JS', lastActive: '2h atrás', status: 'active' },
  { id: '4', name: 'Ana Pereira', email: 'ana@agrosilva.com.br', role: 'operator', avatar: 'AP', lastActive: '1 dia atrás', status: 'active' },
  { id: '5', name: 'Pedro Costa', email: 'pedro@agrosilva.com.br', role: 'viewer', avatar: 'PC', lastActive: '3 dias atrás', status: 'active' },
  { id: '6', name: 'Fernanda Lima', email: 'fernanda@agrosilva.com.br', role: 'viewer', avatar: 'FL', lastActive: 'Convite pendente', status: 'invited' },
];

export default function TeamPage() {
  const t = useTranslations('team');
  const tc = useTranslations('common');
  const [search, setSearch] = useState('');

  const filtered = MEMBERS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const roleCount = (role: Role) => MEMBERS.filter(m => m.role === role).length;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('title') }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">{t('title')}</h1>
          <p className="text-sm text-on-surface-variant mt-1">{t('subtitle')}</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          {t('addMember')}
        </Button>
      </div>

      {/* Role Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        {(['admin', 'manager', 'operator', 'viewer'] as Role[]).map(role => {
          const Icon = ROLE_ICON[role];
          return (
            <Card key={role} className="glass-card">
              <CardContent className="flex items-center gap-3 p-4">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', ROLE_COLOR[role])}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-on-surface">{roleCount(role)}</p>
                  <p className="text-xs text-on-surface-variant">{t(`roles.${role}`)}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
        <Input
          placeholder={tc('search') + '...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Members List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-on-surface flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {MEMBERS.length} membros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filtered.map(member => {
            const RoleIcon = ROLE_ICON[member.role];
            return (
              <div key={member.id} className="flex items-center gap-4 rounded-lg border border-outline-variant/30 p-4 hover:bg-surface-variant/20 transition-colors">
                <div className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-semibold text-sm',
                  member.status === 'invited' ? 'bg-surface-variant text-on-surface-variant' : 'bg-primary/20 text-primary'
                )}>
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-on-surface">{member.name}</p>
                    {member.status === 'invited' && (
                      <Badge variant="outline" className="text-xs">
                        <Mail className="h-3 w-3 mr-1" />
                        Convite
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant">{member.email}</p>
                </div>
                <Badge variant="outline" className={cn('gap-1', ROLE_COLOR[member.role])}>
                  <RoleIcon className="h-3 w-3" />
                  {t(`roles.${member.role}`)}
                </Badge>
                <p className="text-xs text-on-surface-variant/60 w-28 text-right hidden md:block">{member.lastActive}</p>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-on-surface-variant/40 mb-4" />
              <p className="text-on-surface-variant">{tc('noResults')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
