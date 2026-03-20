import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RetailersPage from '@/app/(dashboard)/users/retailers/page';

describe('RetailersPage', () => {
  it('should render page title', () => {
    render(<RetailersPage />);
    expect(screen.getByText('Gestão de Retailers')).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<RetailersPage />);
    expect(screen.getByPlaceholderText('Nome, email ou CNPJ...')).toBeInTheDocument();
  });

  it('should render retailers table header', () => {
    render(<RetailersPage />);
    expect(screen.getByText('Nome + Email')).toBeInTheDocument();
  });

  it('should filter retailers by search term', () => {
    render(<RetailersPage />);
    const searchInput = screen.getByPlaceholderText('Nome, email ou CNPJ...');
    fireEvent.change(searchInput, { target: { value: 'xyznonexistent999' } });
    expect(screen.getByText('Nenhum retailer encontrado')).toBeInTheDocument();
  });

  it('should render "Novo Retailer" button', () => {
    render(<RetailersPage />);
    expect(screen.getByText('Novo Retailer')).toBeInTheDocument();
  });
});
