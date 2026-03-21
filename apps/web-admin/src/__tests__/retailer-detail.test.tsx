import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import RetailerDetailPage from '@/app/(dashboard)/users/retailers/[id]/page';

describe('RetailerDetailPage', () => {
  it('should render retailer header and management buttons', () => {
    render(<RetailerDetailPage params={Promise.resolve({ id: '1' })} />);

    expect(screen.getByText('AgroFertil S.A.')).toBeInTheDocument();
    expect(screen.getByText('Aprovar KYC')).toBeInTheDocument();
    expect(screen.getByText('Rejeitar KYC')).toBeInTheDocument();
    expect(screen.getByText('Suspender')).toBeInTheDocument();
  });

  it('should switch tabs and show each content section', () => {
    render(<RetailerDetailPage params={Promise.resolve({ id: '1' })} />);

    fireEvent.click(screen.getByRole('button', { name: 'KYC' }));
    expect(screen.getByText('KYC Aprovado')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Pedidos' }));
    expect(screen.getByText('Histórico de pedidos em desenvolvimento')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Visão Geral' }));
    expect(screen.getByText('Dados da Empresa')).toBeInTheDocument();
  });
});
