import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ background: '#101415' }}
    >
      <div className="text-center max-w-md">
        <div className="mb-6">
          <h1 className="text-8xl font-extrabold tracking-tighter" style={{ color: 'rgba(137, 216, 158, 0.3)' }}>
            404
          </h1>
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-3" style={{ color: '#E0E3E4' }}>
          Página não encontrada
        </h2>
        <p className="text-sm font-light mb-8" style={{ color: '#bfc9be' }}>
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-colors"
          style={{ background: '#a4f5b8', color: '#00391b' }}
        >
          <Home className="h-4 w-4" />
          Ir para o Dashboard
        </Link>
      </div>
    </div>
  );
}
