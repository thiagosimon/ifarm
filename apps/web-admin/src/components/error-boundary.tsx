'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="glass-card agro-shadow rounded-2xl p-10 max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-[#ffb4ab]/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-[#ffb4ab]" />
            </div>
            <h2 className="text-xl font-bold tracking-tight mb-2">Algo deu errado</h2>
            <p className="text-sm text-muted-foreground mb-6 font-light leading-relaxed">
              Ocorreu um erro inesperado nesta página. Nossa equipe foi notificada.
            </p>
            <p className="text-xs text-muted-foreground/60 font-mono mb-8">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#a4f5b8] text-[#00391b] font-bold rounded-lg hover:bg-[#a4f5b8]/90 transition-colors mx-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
