'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  Users, UserPlus, Mail, Shield, Eye, Settings, MoreVertical, Search,
  X, Check, AlertTriangle, Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { cn } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100/api';

type Role = 'admin' | 'manager' | 'operator' | 'viewer';
type Status = 'active' | 'invited' | 'inactive';

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  createdAt?: string;
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

const ROLES: Role[] = ['admin', 'manager', 'operator', 'viewer'];

// ---- Modal ----
interface MemberModalProps {
  open: boolean;
  member: TeamMember | null;
  onClose: () => void;
  onSaved: (m: TeamMember) => void;
}

function MemberModal({ open, member, onClose, onSaved }: MemberModalProps) {
  const t = useTranslations('team');
  const tc = useTranslations('common');
  const isEdit = !!member;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('viewer');
  const [status, setStatus] = useState<Status>('active');
  const [createLogin, setCreateLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName(member?.name ?? '');
      setEmail(member?.email ?? '');
      setRole(member?.role ?? 'viewer');
      setStatus(member?.status ?? 'active');
      setCreateLogin(false);
      setError('');
    }
  }, [open, member]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    setError('');

    const GATEWAY = API_URL.replace('/api', '');
    try {
      const gatewayUrl = isEdit
        ? `${GATEWAY}/api/v1/identity/team-members/${member!._id}`
        : `${GATEWAY}/api/v1/identity/team-members`;

      const res = await fetch(gatewayUrl, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), role, status }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Erro ao salvar membro');
      }

      const data = await res.json();
      onSaved(data.data);

      if (!isEdit && createLogin) {
        // Create Keycloak login via auth-service register endpoint
        await fetch(`${GATEWAY}/api/v1/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), fullName: name.trim(), role: 'retailer_member' }),
        }).catch(() => {/* non-fatal */});
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-outline-variant bg-surface-container shadow-2xl">
        <div className="flex items-center justify-between border-b border-outline-variant/30 p-5">
          <h2 className="text-lg font-semibold text-on-surface">
            {isEdit ? t('editMember') : t('addMember')}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-surface-variant/30 transition-colors">
            <X className="h-5 w-5 text-on-surface-variant" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-error-container/20 px-3 py-2 text-sm text-red-400">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-on-surface-variant mb-1 block">{t('fields.name')} *</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('fields.namePlaceholder')}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-on-surface-variant mb-1 block">{t('fields.email')} *</label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@empresa.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-on-surface-variant mb-1 block">{t('fields.role')} *</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as Role)}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {ROLES.map(r => (
                <option key={r} value={r}>{t(`roles.${r}`)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-on-surface-variant mb-1 block">{t('fields.status')}</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as Status)}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="active">{t('status.active')}</option>
              <option value="invited">{t('status.invited')}</option>
              <option value="inactive">{t('status.inactive')}</option>
            </select>
          </div>

          {!isEdit && (
            <div className="flex items-center gap-3 rounded-lg border border-outline-variant/30 p-3">
              <button
                type="button"
                role="switch"
                aria-checked={createLogin}
                onClick={() => setCreateLogin(!createLogin)}
                className={cn(
                  'relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0',
                  createLogin ? 'bg-primary' : 'bg-surface-variant'
                )}
              >
                <span className={cn(
                  'inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform',
                  createLogin ? 'translate-x-4' : 'translate-x-0.5'
                )} />
              </button>
              <div>
                <p className="text-sm font-medium text-on-surface">{t('createLogin')}</p>
                <p className="text-xs text-on-surface-variant">{t('createLoginDesc')}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
              {tc('cancel')}
            </Button>
            <Button type="submit" className="flex-1 gap-2" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {tc('save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Delete Dialog ----
interface DeleteDialogProps {
  open: boolean;
  member: TeamMember | null;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

function DeleteDialog({ open, member, onClose, onConfirm, loading }: DeleteDialogProps) {
  const t = useTranslations('team');
  const tc = useTranslations('common');

  if (!open || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-outline-variant bg-surface-container shadow-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-on-surface">{t('deleteTitle')}</h2>
            <p className="text-sm text-on-surface-variant">{t('deleteConfirm', { name: member.name })}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>{tc('cancel')}</Button>
          <Button
            className="flex-1 gap-2 bg-red-500 hover:bg-red-600 text-white"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {tc('delete')}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---- Context Menu ----
interface ContextMenuProps {
  member: TeamMember;
  onEdit: () => void;
  onDelete: () => void;
}

function ContextMenu({ member, onEdit, onDelete }: ContextMenuProps) {
  const tc = useTranslations('common');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 shrink-0"
        onClick={() => setOpen(!open)}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute right-0 top-9 z-50 w-36 rounded-xl border border-outline-variant bg-surface-container shadow-2xl overflow-hidden">
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high transition-colors"
            onClick={() => { setOpen(false); onEdit(); }}
          >
            <Settings className="h-4 w-4" />
            {tc('edit')}
          </button>
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            onClick={() => { setOpen(false); onDelete(); }}
          >
            <X className="h-4 w-4" />
            {tc('delete')}
          </button>
        </div>
      )}
    </div>
  );
}

// ---- Main Page ----
export default function TeamPage() {
  const t = useTranslations('team');
  const tc = useTranslations('common');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editMember, setEditMember] = useState<TeamMember | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMember, setDeleteMember] = useState<TeamMember | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const GATEWAY = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100/api').replace('/api', '');

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    try {
      const res = await fetch(`${GATEWAY}/api/v1/identity/team-members`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.data ?? []);
      }
    } catch {
      // silently fail — show empty list
    } finally {
      setLoading(false);
    }
  }

  function handleSaved(saved: TeamMember) {
    setMembers(prev => {
      const idx = prev.findIndex(m => m._id === saved._id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = saved;
        return updated;
      }
      return [saved, ...prev];
    });
    setModalOpen(false);
    setEditMember(null);
  }

  async function handleDelete() {
    if (!deleteMember) return;
    setDeleteLoading(true);
    try {
      await fetch(`${GATEWAY}/api/v1/identity/team-members/${deleteMember._id}`, { method: 'DELETE' });
      setMembers(prev => prev.filter(m => m._id !== deleteMember._id));
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setDeleteMember(null);
    }
  }

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const roleCount = (role: Role) => members.filter(m => m.role === role).length;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('title') }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">{t('title')}</h1>
          <p className="text-sm text-on-surface-variant mt-1">{t('subtitle')}</p>
        </div>
        <Button className="gap-2" onClick={() => { setEditMember(null); setModalOpen(true); }}>
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
          placeholder={tc('search')}
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
            {members.length} {t('membersCount')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-on-surface-variant/40 mb-4" />
              <p className="text-on-surface-variant">{tc('noResults')}</p>
            </div>
          ) : (
            filtered.map(member => {
              const RoleIcon = ROLE_ICON[member.role];
              const initials = member.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
              return (
                <div key={member._id} className="flex items-center gap-4 rounded-lg border border-outline-variant/30 p-4 hover:bg-surface-variant/20 transition-colors">
                  <div className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-semibold text-sm',
                    member.status === 'invited' ? 'bg-surface-variant text-on-surface-variant' : 'bg-primary/20 text-primary'
                  )}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-on-surface">{member.name}</p>
                      {member.status === 'invited' && (
                        <Badge variant="outline" className="text-xs">
                          <Mail className="h-3 w-3 mr-1" />
                          {t('status.invited')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-on-surface-variant">{member.email}</p>
                  </div>
                  <Badge variant="outline" className={cn('gap-1', ROLE_COLOR[member.role])}>
                    <RoleIcon className="h-3 w-3" />
                    {t(`roles.${member.role}`)}
                  </Badge>
                  <ContextMenu
                    member={member}
                    onEdit={() => { setEditMember(member); setModalOpen(true); }}
                    onDelete={() => { setDeleteMember(member); setDeleteDialogOpen(true); }}
                  />
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <MemberModal
        open={modalOpen}
        member={editMember}
        onClose={() => { setModalOpen(false); setEditMember(null); }}
        onSaved={handleSaved}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        member={deleteMember}
        onClose={() => { setDeleteDialogOpen(false); setDeleteMember(null); }}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
