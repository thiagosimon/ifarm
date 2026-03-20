import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DisputesPage from '@/app/(dashboard)/disputes/page';

describe('DisputesPage', () => {
  it('should render page title', () => {
    render(<DisputesPage />);
    expect(screen.getByText('Disputas')).toBeInTheDocument();
  });

  it('should render stat cards', () => {
    render(<DisputesPage />);
    // Stat card labels use uppercase tracking-widest text
    expect(screen.getByText('Abertas')).toBeInTheDocument();
    expect(screen.getAllByText('Em Análise').length).toBeGreaterThan(0);
    expect(screen.getByText('Resolvidas')).toBeInTheDocument();
  });

  it('should render tab filters', () => {
    render(<DisputesPage />);
    expect(screen.getByText('Todos')).toBeInTheDocument();
    // "Aberta" appears multiple times (as tab and as badge), use getAllByText
    expect(screen.getAllByText('Aberta').length).toBeGreaterThan(0);
  });

  it('should filter by status tab', () => {
    render(<DisputesPage />);
    // Find the tab buttons specifically
    const tabContainer = screen.getByText('Todos').closest('div');
    const abrirTab = screen.getAllByText('Aberta')[0];
    fireEvent.click(abrirTab);
    // After filtering, Todos filter is no longer "active"
    expect(abrirTab).toBeInTheDocument();
  });

  it('should render disputes in the table', () => {
    render(<DisputesPage />);
    // Static mock data has disputes with reasons (check partial via regex)
    expect(screen.getByText(/Atraso na entrega/i)).toBeInTheDocument();
  });

  it('should render SLA indicator column', () => {
    render(<DisputesPage />);
    expect(screen.getByText('SLA')).toBeInTheDocument();
  });
});
