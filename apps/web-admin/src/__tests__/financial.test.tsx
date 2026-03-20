import React from 'react';
import { render, screen } from '@testing-library/react';
import FinancialPage from '@/app/(dashboard)/financial/page';

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    AreaChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="area-chart">{children}</div>
    ),
    Area: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
  };
});

describe('FinancialPage', () => {
  it('should render page title', () => {
    render(<FinancialPage />);
    expect(screen.getByText('Financeiro')).toBeInTheDocument();
  });

  it('should render metric cards', () => {
    render(<FinancialPage />);
    expect(screen.getByText('GMV Total')).toBeInTheDocument();
    expect(screen.getByText('Comissões')).toBeInTheDocument();
  });

  it('should render commission tiers section', () => {
    render(<FinancialPage />);
    expect(screen.getByText('Comissões por Tier')).toBeInTheDocument();
    expect(screen.getByText('Bronze')).toBeInTheDocument();
    expect(screen.getByText('Prata')).toBeInTheDocument();
    expect(screen.getByText('Ouro')).toBeInTheDocument();
  });

  it('should render payouts table', () => {
    render(<FinancialPage />);
    // The payouts table headers are: ID Payout, Farmer, Valor, Status, Data
    expect(screen.getByText('Farmer')).toBeInTheDocument();
    expect(screen.getByText('Valor')).toBeInTheDocument();
  });

  it('should render chart container', () => {
    render(<FinancialPage />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });
});
