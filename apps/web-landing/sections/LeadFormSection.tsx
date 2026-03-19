'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

type ProfileType = '' | 'produtor' | 'lojista'

interface FormData {
  name: string
  profile: ProfileType
  phone: string
  email: string
  city: string
}

interface FormErrors {
  name?: string
  profile?: string
  phone?: string
  email?: string
  city?: string
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.name.trim()) errors.name = 'Nome é obrigatório.'
  if (!data.profile) errors.profile = 'Selecione seu perfil.'
  if (!data.phone.trim()) errors.phone = 'Telefone é obrigatório.'
  if (!data.email.trim()) {
    errors.email = 'E-mail é obrigatório.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'E-mail inválido.'
  }
  if (!data.city.trim()) errors.city = 'Cidade/Estado é obrigatório.'
  return errors
}

export default function LeadFormSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    profile: '',
    phone: '',
    email: '',
    city: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newErrors = validate(formData)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setSubmitted(true)
  }

  const inputBase =
    'w-full px-4 py-3 rounded-card bg-ifarm-surface-low border border-ifarm-outline-variant/40 text-ifarm-on-surface text-sm placeholder-ifarm-outline focus:outline-none focus:ring-2 focus:ring-ifarm-primary focus:border-transparent transition-all duration-200'
  const inputError = 'border-ifarm-error focus:ring-ifarm-error'
  const labelBase = 'block text-sm font-semibold text-ifarm-on-surface mb-1.5'
  const errorMsg = 'mt-1 text-xs text-ifarm-error'

  return (
    <section
      id="lead-form"
      className="bg-white section-padding"
      aria-labelledby="lead-form-title"
    >
      <div className="container-max">
        <div className="max-w-xl mx-auto">
          {/* Card */}
          <div className="bg-white rounded-card-lg shadow-ambient-strong p-8 sm:p-10 border border-ifarm-outline-variant/10">
            {!submitted ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <span className="inline-block text-xs font-bold text-ifarm-primary uppercase tracking-widest mb-3">
                    Fale com a iFarm
                  </span>
                  <h2
                    id="lead-form-title"
                    className="text-2xl sm:text-3xl font-extrabold text-ifarm-on-surface"
                  >
                    Agende sua demonstração
                  </h2>
                  <p className="text-ifarm-on-surface-variant mt-2 text-sm">
                    Retornamos em até 24h para agendar sua demonstração.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="space-y-4">
                    {/* Nome */}
                    <div>
                      <label htmlFor="name" className={labelBase}>
                        Nome completo <span className="text-ifarm-error" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        placeholder="João da Silva"
                        className={`${inputBase} ${errors.name ? inputError : ''}`}
                        value={formData.name}
                        onChange={handleChange}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && (
                        <p id="name-error" className={errorMsg} role="alert">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Perfil */}
                    <div>
                      <label htmlFor="profile" className={labelBase}>
                        Perfil <span className="text-ifarm-error" aria-hidden="true">*</span>
                      </label>
                      <select
                        id="profile"
                        name="profile"
                        required
                        className={`${inputBase} ${errors.profile ? inputError : ''}`}
                        value={formData.profile}
                        onChange={handleChange}
                        aria-describedby={errors.profile ? 'profile-error' : undefined}
                        aria-invalid={!!errors.profile}
                      >
                        <option value="" disabled>
                          Selecione seu perfil
                        </option>
                        <option value="produtor">Produtor Rural</option>
                        <option value="lojista">Lojista ou Fornecedor</option>
                      </select>
                      {errors.profile && (
                        <p id="profile-error" className={errorMsg} role="alert">
                          {errors.profile}
                        </p>
                      )}
                    </div>

                    {/* Telefone */}
                    <div>
                      <label htmlFor="phone" className={labelBase}>
                        WhatsApp / Telefone <span className="text-ifarm-error" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        placeholder="(11) 99999-0000"
                        className={`${inputBase} ${errors.phone ? inputError : ''}`}
                        value={formData.phone}
                        onChange={handleChange}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        aria-invalid={!!errors.phone}
                      />
                      {errors.phone && (
                        <p id="phone-error" className={errorMsg} role="alert">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className={labelBase}>
                        E-mail <span className="text-ifarm-error" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="joao@fazenda.com.br"
                        className={`${inputBase} ${errors.email ? inputError : ''}`}
                        value={formData.email}
                        onChange={handleChange}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <p id="email-error" className={errorMsg} role="alert">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Cidade */}
                    <div>
                      <label htmlFor="city" className={labelBase}>
                        Cidade / Estado <span className="text-ifarm-error" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        placeholder="Ribeirão Preto, SP"
                        className={`${inputBase} ${errors.city ? inputError : ''}`}
                        value={formData.city}
                        onChange={handleChange}
                        aria-describedby={errors.city ? 'city-error' : undefined}
                        aria-invalid={!!errors.city}
                      />
                      {errors.city && (
                        <p id="city-error" className={errorMsg} role="alert">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full justify-center"
                      >
                        Quero conhecer a iFarm
                      </Button>
                    </div>
                  </div>
                </form>

                <p className="text-center text-xs text-ifarm-on-surface-variant mt-4">
                  Ao enviar, você concorda com nossa{' '}
                  <a href="#" className="text-ifarm-primary underline hover:no-underline">
                    Política de Privacidade
                  </a>
                  .
                </p>
              </>
            ) : (
              /* Success state */
              <div className="text-center py-8 flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-ifarm-primary-fixed flex items-center justify-center">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    stroke="#005129"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 16 12 22 26 8" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-ifarm-on-surface mb-2">
                    Recebemos seu contato!
                  </h2>
                  <p className="text-ifarm-on-surface-variant">
                    Nossa equipe retornará em até <strong>24 horas</strong> para agendar
                    sua demonstração.
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-3 bg-ifarm-primary-fixed/30 rounded-card">
                  <span className="text-lg" role="img" aria-hidden="true">
                    🌱
                  </span>
                  <p className="text-sm text-ifarm-primary font-medium">
                    Bem-vindo ao ecossistema digital do agronegócio.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
