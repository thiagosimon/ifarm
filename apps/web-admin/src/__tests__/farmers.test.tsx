import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FarmersPage from '@/app/(dashboard)/users/farmers/page';

describe('FarmersPage', () => {
  it('should render page title', () => {
    render(<FarmersPage />);
    expect(screen.getByText('Gestão de Farmers')).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<FarmersPage />);
    expect(screen.getByPlaceholderText('Nome, email ou CNPJ...')).toBeInTheDocument();
  });

  it('should render farmers table with data', () => {
    render(<FarmersPage />);
    // Table should have header columns
    expect(screen.getByText('Nome + Email')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('should filter farmers by search term', () => {
    render(<FarmersPage />);
    const searchInput = screen.getByPlaceholderText('Nome, email ou CNPJ...');
    // Type a search term that matches no farmer
    fireEvent.change(searchInput, { target: { value: 'xyznonexistent999' } });
    expect(screen.getByText('Nenhum farmer encontrado')).toBeInTheDocument();
  });

  it('should render "Novo Farmer" button', () => {
    render(<FarmersPage />);
    expect(screen.getByText('Novo Farmer')).toBeInTheDocument();
  });

  it('should render filter controls', () => {
    render(<FarmersPage />);
    expect(screen.getByText('Pesquisa')).toBeInTheDocument();
  });
});
