'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sprout, Shield, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
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
    OAuthAccountNotLinked: 'Conta nao vinculada. Contate o suporte.',
    default: 'Ocorreu um erro ao fazer login. Tente novamente.',
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
            <Sprout className="h-10 w-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">iFarm</h1>
          <div className="mt-1 flex items-center justify-center gap-2">
            <Shield className="h-4 w-4 text-green-400" />
            <p className="text-sm text-green-400 font-medium">Painel Administrativo</p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <p className="text-sm text-red-300">
              {errorMessages[error] || errorMessages.default}
            </p>
          </div>
        )}

        {/* Login Card */}
        <Card className="border-gray-700 bg-gray-800/50 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-white">Entrar</CardTitle>
            <CardDescription className="text-gray-400">
              Acesso restrito a operadores com perfil ADMIN
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Keycloak SSO Login */}
            <Button
              className="w-full bg-green-600 text-white hover:bg-green-700"
              size="lg"
              onClick={handleKeycloakLogin}
              loading={loading}
            >
              <Shield className="mr-2 h-5 w-5" />
              Entrar com SSO (Keycloak)
            </Button>

            <p className="text-center text-xs text-gray-500">
              Problemas para acessar? Contate o time de TI.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          iFarm Platform v1.0 - Ambiente{' '}
          <span className="text-yellow-400">
            {process.env.NODE_ENV === 'production' ? 'Producao' : 'Desenvolvimento'}
          </span>
        </p>
      </div>
    </div>
  );
}
