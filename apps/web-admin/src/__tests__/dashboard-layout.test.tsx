import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardLayout from '@/app/(dashboard)/layout';

jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="session-provider">{children}</div>
  ),
}));

jest.mock('@/components/layout/sidebar', () => ({
  Sidebar: () => <aside data-testid="sidebar" />,
}));

jest.mock('@/components/layout/topbar', () => ({
  Topbar: () => <header data-testid="topbar" />,
}));

describe('DashboardLayout', () => {
  it('should render sidebar, topbar and children', () => {
    render(
      <DashboardLayout>
        <div>Conteúdo da tela</div>
      </DashboardLayout>
    );

    expect(screen.getByTestId('session-provider')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo da tela')).toBeInTheDocument();
  });
});

