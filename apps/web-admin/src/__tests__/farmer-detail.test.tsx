import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import FarmerDetailPage from '@/app/(dashboard)/users/farmers/[id]/page';

describe('FarmerDetailPage', () => {
  it('should render primary actions and default overview tab', () => {
    render(<FarmerDetailPage params={Promise.resolve({ id: '1' })} />);

    expect(screen.getByText('João Oliveira')).toBeInTheDocument();
    expect(screen.getByText('Aprovar KYC')).toBeInTheDocument();
    expect(screen.getByText('Rejeitar KYC')).toBeInTheDocument();
    expect(screen.getByText('Dados da Empresa')).toBeInTheDocument();
  });

  it('should switch between timeline, kyc and orders tabs', () => {
    render(<FarmerDetailPage params={Promise.resolve({ id: '1' })} />);

    fireEvent.click(screen.getByRole('button', { name: 'Histórico' }));
    expect(screen.getByText('Histórico de Atividades')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'KYC' }));
    expect(screen.getByText('Documentação KYC')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Pedidos' }));
    expect(screen.getByText('Nenhum pedido registrado')).toBeInTheDocument();
  });
});
