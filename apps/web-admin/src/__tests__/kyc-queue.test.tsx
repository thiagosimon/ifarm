import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import KycQueuePage from '@/app/(dashboard)/kyc/queue/page';

describe('KycQueuePage', () => {
  it('should render the page title', () => {
    render(<KycQueuePage />);
    expect(screen.getByText('Fila KYC')).toBeInTheDocument();
  });

  it('should render stat cards', () => {
    render(<KycQueuePage />);
    expect(screen.getByText('Na Fila')).toBeInTheDocument();
    expect(screen.getByText('Documentos Totais')).toBeInTheDocument();
    expect(screen.getByText('Mais Antigo')).toBeInTheDocument();
  });

  it('should render table headers', () => {
    render(<KycQueuePage />);
    expect(screen.getByText('Usuário')).toBeInTheDocument();
    expect(screen.getByText('CNPJ')).toBeInTheDocument();
  });

  it('should render "Atualizar Fila" button', () => {
    render(<KycQueuePage />);
    expect(screen.getByText('Atualizar Fila')).toBeInTheDocument();
  });

  it('should render action buttons with title for each entry', () => {
    render(<KycQueuePage />);
    // Visualizar buttons with title="Visualizar"
    const visualizarButtons = screen.getAllByTitle('Visualizar');
    expect(visualizarButtons.length).toBeGreaterThan(0);
  });

  it('should open document viewer modal on Visualizar click', () => {
    render(<KycQueuePage />);
    const visualizarButton = screen.getAllByTitle('Visualizar')[0];
    fireEvent.click(visualizarButton);
    // Modal should appear with Aprovar KYC button
    expect(screen.getByText('Aprovar KYC')).toBeInTheDocument();
  });
});
