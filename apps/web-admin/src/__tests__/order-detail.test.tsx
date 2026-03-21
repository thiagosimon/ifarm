import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderDetailPage from '@/app/(dashboard)/orders/[id]/page';

describe('OrderDetailPage', () => {
  it('should render order header, timeline and action buttons', () => {
    render(<OrderDetailPage params={Promise.resolve({ id: '1' })} />);

    expect(screen.getByText('Pedido #IF-20934')).toBeInTheDocument();
    expect(screen.getByText('Timeline do Pedido')).toBeInTheDocument();
    expect(screen.getByText('Cancelar Pedido')).toBeInTheDocument();
    expect(screen.getByText('Abrir Disputa')).toBeInTheDocument();
    expect(screen.getByText('Gerar NF-e')).toBeInTheDocument();
  });

  it('should render items and total values', () => {
    render(<OrderDetailPage params={Promise.resolve({ id: '1' })} />);

    expect(screen.getByText('Soja Transgênica Granel')).toBeInTheDocument();
    expect(screen.getByText('Soja Convencional')).toBeInTheDocument();
    expect(screen.getByText('Valor Total')).toBeInTheDocument();
  });
});
