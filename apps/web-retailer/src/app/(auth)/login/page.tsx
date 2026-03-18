'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleKeycloakLogin() {
    setLoading(true);
    await signIn('keycloak', { callbackUrl: '/dashboard' });
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-primary-500 p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">iFarm</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight text-white">
            Painel do Lojista
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Gerencie suas cotacoes, pedidos e financeiro em um unico lugar.
            Conecte-se com produtores de todo o Brasil.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <span className="text-sm font-bold text-white">1</span>
            </div>
            <p className="text-sm text-white/80">
              Receba cotacoes de produtores da sua regiao
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <span className="text-sm font-bold text-white">2</span>
            </div>
            <p className="text-sm text-white/80">
              Envie propostas competitivas com precos e prazos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <span className="text-sm font-bold text-white">3</span>
            </div>
            <p className="text-sm text-white/80">
              Acompanhe pedidos e receba pagamentos com seguranca
            </p>
          </div>
        </div>

        <p className="text-xs text-white/50">
          &copy; 2026 iFarm. Todos os direitos reservados.
        </p>
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full flex-col items-center justify-center px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <div className="mb-4 flex items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-primary-500">
                iFarm
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Bem-vindo de volta
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Acesse sua conta de lojista iFarm
            </p>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full"
              size="lg"
              onClick={handleKeycloakLogin}
              loading={loading}
            >
              Entrar com iFarm ID
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  ou entre com suas credenciais
                </span>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleKeycloakLogin();
              }}
              className="space-y-4"
            >
              <Input
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
              />
              <Input
                label="Senha"
                type="password"
                placeholder="Sua senha"
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="rounded border-border text-primary-500 focus:ring-primary-500"
                  />
                  Lembrar-me
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-primary-500 hover:text-primary-600"
                >
                  Esqueceu a senha?
                </a>
              </div>

              <Button type="submit" className="w-full" size="lg" variant="outline">
                Entrar
              </Button>
            </form>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Nao tem uma conta?{' '}
            <a
              href="#"
              className="font-medium text-primary-500 hover:text-primary-600"
            >
              Cadastre-se como lojista
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
