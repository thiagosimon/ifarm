import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { LanguageProvider } from '@/lib/i18n'

export const metadata: Metadata = {
  metadataBase: new URL('https://ifarm.com.br'),
  title: 'iFarm | Marketplace Agro com Cotação Inteligente',
  description:
    'Conecte produtores e lojistas em uma plataforma agro com cotação inteligente, painel web, app mobile e evolução para crédito rural, IoT e ESG.',
  keywords: [
    'marketplace agro',
    'cotação agrícola',
    'insumos rurais',
    'agronegócio digital',
    'iFarm',
    'plataforma rural',
    'crédito rural',
    'IoT campo',
    'ESG agro',
  ],
  authors: [{ name: 'iFarm' }],
  creator: 'iFarm',
  publisher: 'iFarm',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://ifarm.com.br',
    siteName: 'iFarm',
    title: 'iFarm | Marketplace Agro com Cotação Inteligente',
    description:
      'Conecte produtores e lojistas em uma plataforma agro com cotação inteligente, painel web, app mobile e evolução para crédito rural, IoT e ESG.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iFarm | Marketplace Agro com Cotação Inteligente',
    description:
      'Conecte produtores e lojistas em uma plataforma agro com cotação inteligente.',
    creator: '@ifarm_agro',
  },
  alternates: {
    canonical: 'https://ifarm.com.br',
  },
}

export const viewport: Viewport = {
  themeColor: '#89d89e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
<body className="antialiased">
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
