'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Leaf,
  Building2,
  Phone,
  MapPin,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Globe,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LegalModal } from '@/components/auth/legal-modal';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
  }
  return digits.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
}

function formatZip(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits.replace(/^(\d{5})(\d)/, '$1-$2');
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface RegisterForm {
  companyName: string;
  tradeName: string;
  cnpj: string;
  phone: string;
  zipCode: string;
  street: string;
  neighborhood: string;
  city: string;
  email: string;
  password: string;
  lgpdConsent: boolean;
  dataProcessing: boolean;
}

const INITIAL_FORM: RegisterForm = {
  companyName: '',
  tradeName: '',
  cnpj: '',
  phone: '',
  zipCode: '',
  street: '',
  neighborhood: '',
  city: '',
  email: '',
  password: '',
  lgpdConsent: false,
  dataProcessing: false,
};

// ─── API ──────────────────────────────────────────────────────────────────────

async function registerRetailer(form: RegisterForm): Promise<void> {
  const cnpjDigits = form.cnpj.replace(/\D/g, '');
  const phoneDigits = form.phone.replace(/\D/g, '');

  const payload = {
    businessName: form.companyName,
    tradeName: form.tradeName || undefined,
    businessRegistrationId: cnpjDigits,
    responsiblePerson: {
      fullName: form.companyName,
      email: form.email,
      phoneNumber: phoneDigits,
    },
    email: form.email,
    phoneNumber: phoneDigits,
    address: {
      street: form.street,
      neighborhood: form.neighborhood,
      city: form.city,
      postalCode: form.zipCode.replace(/\D/g, ''),
      countryCode: 'BR',
    },
    consentHistory: [
      {
        acceptedAt: new Date().toISOString(),
        termsVersion: '2.4',
        ipAddress: '0.0.0.0',
      },
    ],
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';
  const res = await fetch(`${apiUrl}/v1/identity/retailers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? `Erro ${res.status}: tente novamente.`
    );
  }

  // Create Keycloak credentials so the user can log in immediately
  await fetch(`${apiUrl}/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: form.email,
      password: form.password,
      fullName: form.companyName,
      role: 'RETAILER',
    }),
  }).catch(() => {
    // Non-fatal: user can still reset password if this fails
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const t = useTranslations('signup');
  const [form, setForm] = useState<RegisterForm>(INITIAL_FORM);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState<'terms' | 'lgpd' | null>(null);

  function update(field: keyof RegisterForm, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await registerRetailer(form);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  const steps = [
    { label: 'Empresa', number: 1 },
    { label: 'Endereço', number: 2 },
    { label: 'Acesso', number: 3 },
  ];

  return (
    <>
      {/* Legal Modals */}
      <LegalModal
        type="terms"
        open={modal === 'terms'}
        onClose={() => setModal(null)}
        onAccept={() => update('lgpdConsent', true)}
      />
      <LegalModal
        type="lgpd"
        open={modal === 'lgpd'}
        onClose={() => setModal(null)}
        onAccept={() => update('dataProcessing', true)}
      />

      <div className="bg-background text-on-background min-h-screen flex items-center justify-center p-4 bg-agro-overlay relative">
        <main className="w-full max-w-[480px] z-10">
          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
              <Leaf className="h-8 w-8 text-on-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              iFarm <span className="text-primary">Lojista</span>
            </h1>
            <p className="text-on-surface-variant mt-2 text-sm font-medium">
              Portal de Gestão Agro B2B
            </p>
          </div>

          {/* Card */}
          <div className="glass-card p-8 rounded-xl shadow-2xl">
            {done ? (
              /* Success */
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-black text-on-surface">Conta criada com sucesso!</h2>
                <p className="text-sm text-on-surface-variant">
                  Seu cadastro foi recebido. Você receberá um e-mail de confirmação em breve.
                </p>
                <a href="/login" className="w-full mt-4">
                  <Button
                    className="w-full py-4 text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/20"
                    size="lg"
                  >
                    Ir para o login
                  </Button>
                </a>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-xl font-black text-on-surface">{t('title')}</h2>
                  <p className="mt-1 text-sm text-on-surface-variant">{t('subtitle')}</p>
                </div>

                {/* Step indicators */}
                <div className="flex items-center justify-between mb-8">
                  {steps.map((s, idx) => (
                    <React.Fragment key={s.number}>
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            step > s.number
                              ? 'bg-primary text-on-primary'
                              : step === s.number
                              ? 'bg-primary/20 border-2 border-primary text-primary'
                              : 'bg-surface-container-highest text-on-surface-variant'
                          }`}
                        >
                          {step > s.number ? <CheckCircle2 className="h-4 w-4" /> : s.number}
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest ${
                            step >= s.number ? 'text-primary' : 'text-on-surface-variant/50'
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                      {idx < steps.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-2 transition-colors ${
                            step > s.number ? 'bg-primary' : 'bg-outline-variant/30'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Error banner */}
                {error && (
                  <div className="mb-4 flex items-start gap-2 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Step 1: Company */}
                  {step === 1 && (
                    <>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                          {t('fields.companyName')}
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Building2 className="h-5 w-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                          </div>
                          <input
                            className="block w-full pl-11 pr-4 py-3.5 bg-surface-container-low border border-outline-variant text-on-surface rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline-variant"
                            placeholder="Razão Social da empresa"
                            required
                            type="text"
                            value={form.companyName}
                            onChange={(e) => update('companyName', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                          {t('fields.tradeName')}
                        </label>
                        <input
                          className="block w-full px-4 py-3.5 bg-surface-container-low border border-outline-variant text-on-surface rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline-variant"
                          placeholder="Nome Fantasia"
                          required
                          type="text"
                          value={form.tradeName}
                          onChange={(e) => update('tradeName', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                          {t('fields.cnpj')}
                        </label>
                        <input
                          className="block w-full px-4 py-3.5 bg-surface-container-low border border-outline-variant text-on-surface rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline-variant"
                          placeholder="00.000.000/0001-00"
                          required
                          type="text"
                          inputMode="numeric"
                          value={form.cnpj}
                          onChange={(e) => update('cnpj', formatCnpj(e.target.value))}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                          {t('fields.phone')}
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                          </div>
                          <input
                            className="block w-full pl-11 pr-4 py-3.5 bg-surface-container-low border border-outline-variant text-on-surface rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline-variant"
                            placeholder="(11) 99999-9999"
                            required
                            type="tel"
                            value={form.phone}
                            onChange={(e) => update('phone', formatPhone(e.target.value))}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 2: Address */}
                  {step === 2 && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                            {t('fields.zipCode')}
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <MapPin className="h-5 w-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                              className="block w-full pl-11 pr-4 py-3.5 bg-surface-container-low border border-outline-variant text-on-surface rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline-variant"
                              placeholder="00000-000"
                              required
                              type="text"
                              inputMode="numeric"
                              value={form.zipCode}
                              onChange={(e) => update('zipCode', formatZip(e.target.value))}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                            {t('fields.city')}
                          </label>
                          <input
                            className="block w-full px-4 py-3.5 bg-surface-container-low border border-outline-variant text-on-surface rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline-variant"
                            placeholder="Cidade"
                            required
                            type="text"
                            value={form.city}
                            onChange={(e) => update('city', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                          {t('fields.street')}
                        </label>
                        <input
                          className="block w-full px-4 py-3.5 bg-surface-container-low border border-outline-variant text-on-surface rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline-variant"
                          placeholder="Rua, Av., nº..."
                          required
                          type="text"
                          value={form.street}
                          onChange={(e) => update('street', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                          {t('fields.neighborhood')}
                        </label>
                        <input
                          className="block w-full px-4 py-3.5 bg-surface-container-low border border-outline-variant text-on-surface rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline-variant"
                          placeholder="Bairro"
                          required
                          type="text"
                          value={form.neighborhood}
                          onChange={(e) => update('neighborhood', e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {/* Step 3: Credentials + LGPD */}
                  {step === 3 && (
                    <>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                          {t('fields.email')}
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                          </div>
                          <input
                            className="block w-full pl-11 pr-4 py-3.5 bg-surface-container-low border border-outline-variant text-on-surface rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline-variant"
                            placeholder="email@empresa.com.br"
                            required
                            type="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={(e) => update('email', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                          {t('fields.password')}
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                          </div>
                          <input
                            className="block w-full pl-11 pr-12 py-3.5 bg-surface-container-low border border-outline-variant text-on-surface rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline-variant"
                            placeholder="Mínimo 8 caracteres"
                            required
                            minLength={8}
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={form.password}
                            onChange={(e) => update('password', e.target.value)}
                          />
                          <button
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-on-surface"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      {/* LGPD Checkboxes */}
                      <div className="space-y-3 pt-2">
                        {/* Terms */}
                        <div className="flex items-start gap-3">
                          <input
                            className="mt-0.5 h-4 w-4 shrink-0 rounded border-outline-variant bg-surface-container text-primary focus:ring-primary cursor-pointer"
                            required
                            type="checkbox"
                            id="lgpdConsent"
                            checked={form.lgpdConsent}
                            onChange={(e) => update('lgpdConsent', e.target.checked)}
                          />
                          <label htmlFor="lgpdConsent" className="text-sm text-on-surface-variant leading-relaxed">
                            {t('lgpd.consent').split('Terms of Use and Privacy Policy')[0]}
                            {t('lgpd.consent').split('Termos de Uso e Política de Privacidade')[0]}
                            <button
                              type="button"
                              className="font-semibold text-primary underline underline-offset-2 hover:brightness-125 transition-colors"
                              onClick={() => setModal('terms')}
                            >
                              {t('lgpd.consent').includes('Termos')
                                ? 'Termos de Uso e Política de Privacidade'
                                : 'Terms of Use and Privacy Policy'}
                            </button>
                          </label>
                        </div>

                        {/* LGPD */}
                        <div className="flex items-start gap-3">
                          <input
                            className="mt-0.5 h-4 w-4 shrink-0 rounded border-outline-variant bg-surface-container text-primary focus:ring-primary cursor-pointer"
                            required
                            type="checkbox"
                            id="dataProcessing"
                            checked={form.dataProcessing}
                            onChange={(e) => update('dataProcessing', e.target.checked)}
                          />
                          <label htmlFor="dataProcessing" className="text-sm text-on-surface-variant leading-relaxed">
                            Autorizo o tratamento dos meus dados conforme{' '}
                            <button
                              type="button"
                              className="font-semibold text-primary underline underline-offset-2 hover:brightness-125 transition-colors"
                              onClick={() => setModal('lgpd')}
                            >
                              a LGPD
                            </button>
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Navigation */}
                  <div className={`flex gap-3 pt-2 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="flex-1 border-outline-variant/30"
                        onClick={() => setStep((s) => s - 1)}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar
                      </Button>
                    )}
                    <Button
                      type="submit"
                      className={`py-4 text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/20 ${step > 1 ? 'flex-1' : 'w-full'}`}
                      size="lg"
                      loading={loading}
                    >
                      {step < 3 ? (
                        <>
                          Próximo
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        t('submit')
                      )}
                    </Button>
                  </div>
                </form>

                {/* Back to login */}
                <div className="mt-6 pt-6 border-t border-outline-variant/30 text-center">
                  <p className="text-sm text-on-surface-variant">
                    Já tem uma conta?{' '}
                    <a
                      href="/login"
                      className="font-bold text-primary hover:brightness-125 transition-colors ml-1"
                    >
                      Entrar
                    </a>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center">
            <div className="flex justify-center space-x-6 mt-6">
              <div className="flex items-center text-[10px] text-on-surface-variant/40 uppercase tracking-tighter">
                <ShieldCheck className="h-4 w-4 mr-1" />
                Ambiente Seguro
              </div>
              <div className="flex items-center text-[10px] text-on-surface-variant/40 uppercase tracking-tighter">
                <Globe className="h-4 w-4 mr-1" />
                Portal B2B v2.4
              </div>
            </div>
          </footer>
        </main>

        {/* Decorative background glow */}
        <div className="fixed top-0 right-0 -z-0 opacity-20 pointer-events-none">
          <svg fill="none" height="600" viewBox="0 0 600 600" width="600">
            <circle cx="450" cy="150" fill="url(#grad1)" r="300" />
            <defs>
              <radialGradient
                cx="0"
                cy="0"
                gradientTransform="translate(450 150) rotate(90) scale(300)"
                gradientUnits="userSpaceOnUse"
                id="grad1"
                r="1"
              >
                <stop stopColor="#89d89e" />
                <stop offset="1" stopColor="#1A6B3C" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </>
  );
}
