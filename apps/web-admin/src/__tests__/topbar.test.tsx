import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Topbar } from '@/components/layout/topbar';

const signOutMock = jest.fn();
const setThemeMock = jest.fn();
const useSessionMock = jest.fn();
const useThemeMock = jest.fn();

jest.mock('next-auth/react', () => ({
  signOut: (...args: unknown[]) => signOutMock(...args),
  useSession: () => useSessionMock(),
}));

jest.mock('@/components/providers/theme-provider', () => ({
  useTheme: () => useThemeMock(),
}));

describe('Topbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSessionMock.mockReturnValue({
      data: {
        user: {
          name: 'Admin iFarm',
          email: 'admin@ifarm.com.br',
        },
      },
    });
    useThemeMock.mockReturnValue({
      theme: 'dark',
      setTheme: setThemeMock,
    });
  });

  it('should render user identity and notifications badge', async () => {
    render(<Topbar />);

    await waitFor(() => {
      expect(screen.getByText('Admin iFarm')).toBeInTheDocument();
    });
    expect(screen.getByText('admin@ifarm.com.br')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should toggle theme when theme button is clicked', async () => {
    render(<Topbar />);

    const themeButton = await screen.findByTitle('Modo claro');
    fireEvent.click(themeButton);

    expect(setThemeMock).toHaveBeenCalledWith('light');
  });

  it('should sign out to login page', () => {
    render(<Topbar />);

    fireEvent.click(screen.getByTitle('Sair'));
    expect(signOutMock).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });
});

