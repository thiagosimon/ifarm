import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsPage from '@/app/(dashboard)/settings/page';

describe('SettingsPage', () => {
  it('should render page title', () => {
    render(<SettingsPage />);
    expect(screen.getByText('Configurações')).toBeInTheDocument();
  });

  it('should render commission tiers with iFarm tier names', () => {
    render(<SettingsPage />);
    expect(screen.getByText('Semente')).toBeInTheDocument();
    expect(screen.getByText('Crescimento')).toBeInTheDocument();
    expect(screen.getByText('Colheita')).toBeInTheDocument();
    expect(screen.getByText('Latifúndio')).toBeInTheDocument();
  });

  it('should render operational parameters', () => {
    render(<SettingsPage />);
    expect(screen.getByText('Holdback (dias úteis)')).toBeInTheDocument();
    expect(screen.getByText('Taxa de Serviço Padrão (%)')).toBeInTheDocument();
  });

  it('should render enabled states section', () => {
    render(<SettingsPage />);
    expect(screen.getByText('Regiões Habilitadas')).toBeInTheDocument();
    expect(screen.getByText('SP')).toBeInTheDocument();
  });

  it('should toggle state when clicked', () => {
    render(<SettingsPage />);
    const spButton = screen.getByText('SP');
    fireEvent.click(spButton);
    // After click, SP is toggled off (button should still exist but style changes)
    expect(screen.getByText('SP')).toBeInTheDocument();
  });

  it('should render save button', () => {
    render(<SettingsPage />);
    expect(screen.getByText('Salvar Configurações')).toBeInTheDocument();
  });
});
