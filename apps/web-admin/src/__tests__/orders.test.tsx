import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrdersPage from '@/app/(dashboard)/orders/page';

describe('OrdersPage', () => {
  it('should render page title', () => {
    render(<OrdersPage />);
    expect(screen.getByText('Gestão de Pedidos')).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<OrdersPage />);
    expect(screen.getByPlaceholderText('Pedido, produtor...')).toBeInTheDocument();
  });

  it('should render orders in table', () => {
    render(<OrdersPage />);
    // Static mock data: orders have "ID Pedido" column header
    expect(screen.getByText('ID Pedido')).toBeInTheDocument();
  });

  it('should filter orders to empty state with non-matching search', () => {
    render(<OrdersPage />);
    const searchInput = screen.getByPlaceholderText('Pedido, produtor...');
    fireEvent.change(searchInput, { target: { value: 'xyznonexistent999' } });
    expect(screen.getByText('Nenhum pedido encontrado')).toBeInTheDocument();
  });

  it('should render date range filters', () => {
    render(<OrdersPage />);
    const dateInputs = document.querySelectorAll('input[type="date"]');
    expect(dateInputs.length).toBeGreaterThan(0);
  });
});
