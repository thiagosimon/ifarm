import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPage from '@/app/(dashboard)/dashboard/page';

// Mock recharts to avoid canvas/SVG issues in jsdom
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
    BarChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="bar-chart">{children}</div>
    ),
    PieChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="pie-chart">{children}</div>
    ),
    Area: () => null,
    Bar: () => null,
    Pie: () => null,
    Cell: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
  };
});

describe('DashboardPage', () => {
  it('should render page title', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render KPI cards', () => {
    render(<DashboardPage />);
    expect(screen.getByText('GMV Total')).toBeInTheDocument();
    expect(screen.getByText('Usuários Ativos')).toBeInTheDocument();
    expect(screen.getByText('Receita Período')).toBeInTheDocument();
  });

  it('should render period selector buttons', () => {
    render(<DashboardPage />);
    expect(screen.getByText('7d')).toBeInTheDocument();
    expect(screen.getByText('30d')).toBeInTheDocument();
    expect(screen.getByText('90d')).toBeInTheDocument();
    expect(screen.getByText('365d')).toBeInTheDocument();
  });

  it('should change active period when button is clicked', () => {
    render(<DashboardPage />);
    const btn30d = screen.getByText('30d');
    fireEvent.click(btn30d);
    expect(btn30d.closest('button')).toHaveStyle({ background: expect.stringContaining('#a4f5b8') });
  });

  it('should render charts section', () => {
    render(<DashboardPage />);
    expect(screen.getAllByTestId('responsive-container').length).toBeGreaterThan(0);
  });

  it('should render activity feed section', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Atividade Recente/i)).toBeInTheDocument();
  });
});
