'use client';

import React, { Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Shield, AlertCircle, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [loading, setLoading] = React.useState(false);

  const handleKeycloakLogin = async () => {
    setLoading(true);
    try {
      await signIn('keycloak', { callbackUrl });
    } catch {
      setLoading(false);
    }
  };

  const errorMessages: Record<string, string> = {
    AccessDenied: 'Acesso negado. Somente administradores podem acessar este painel.',
    OAuthAccountNotLinked: 'Conta não vinculada. Contate o suporte.',
    default: 'Ocorreu um erro ao fazer login. Tente novamente.',
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ background: '#101415' }}
    >
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-1/4 -right-1/4 h-[600px] w-[600px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #a4f5b8, transparent)' }}
        />
        <div
          className="absolute -bottom-1/4 -left-1/4 h-[600px] w-[600px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #f6be39, transparent)' }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl"
            style={{ background: 'rgba(137, 216, 158, 0.1)', border: '1px solid rgba(137, 216, 158, 0.2)' }}
          >
            <Leaf className="h-12 w-12" style={{ color: '#89D89E' }} fill="#89D89E" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter" style={{ color: '#89D89E' }}>
            iFarm
          </h1>
          <div className="mt-2 flex items-center justify-center gap-2">
            <Shield className="h-4 w-4" style={{ color: '#f6be39' }} />
            <p className="text-sm font-extrabold uppercase tracking-widest" style={{ color: '#f6be39' }}>
              Admin Panel
            </p>
          </div>
          <p className="mt-3 text-sm font-light" style={{ color: '#E0E3E4', opacity: 0.6 }}>
            Plataforma de Gestão do Agronegócio Brasileiro
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="mb-6 flex items-start gap-3 rounded-xl p-4"
            style={{
              background: 'rgba(255, 180, 171, 0.1)',
              border: '1px solid rgba(255, 180, 171, 0.2)',
            }}
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" style={{ color: '#ffb4ab' }} />
            <p className="text-sm" style={{ color: '#ffb4ab' }}>
              {errorMessages[error] || errorMessages.default}
            </p>
          </div>
        )}

        {/* Login Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(39, 42, 44, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(137, 216, 158, 0.05)',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(137, 216, 158, 0.05)',
          }}
        >
          <h2 className="text-xl font-bold tracking-tight text-center mb-2" style={{ color: '#E0E3E4' }}>
            Entrar
          </h2>
          <p className="text-center text-sm font-light mb-8" style={{ color: '#bfc9be' }}>
            Acesso restrito a operadores com perfil ADMIN
          </p>

          <Button
            className="w-full font-bold text-sm h-12 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #a4f5b8, #89D89E)',
              color: '#00391b',
              fontSize: '0.9rem',
            }}
            onClick={handleKeycloakLogin}
            loading={loading}
          >
            <Shield className="mr-2 h-5 w-5" />
            Entrar com SSO (Keycloak)
          </Button>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px" style={{ background: 'rgba(137, 216, 158, 0.1)' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#899389' }}>
              Seguro
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(137, 216, 158, 0.1)' }} />
          </div>

          <p className="mt-6 text-center text-xs" style={{ color: '#899389' }}>
            Autenticação via Keycloak SSO com OAuth2/OIDC + PKCE
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs" style={{ color: '#899389', opacity: 0.6 }}>
          iFarm Platform v1.0 · Ambiente{' '}
          <span style={{ color: '#f6be39', opacity: 1 }}>
            {process.env.NODE_ENV === 'production' ? 'Produção' : 'Desenvolvimento'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#101415' }}>
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-transparent" style={{ borderTopColor: '#89D89E' }} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
