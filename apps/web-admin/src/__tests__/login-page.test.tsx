import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';

const signInMock = jest.fn();
const useSearchParamsMock = jest.fn();

jest.mock('next-auth/react', () => ({
  signIn: (...args: unknown[]) => signInMock(...args),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: () => useSearchParamsMock(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams('callbackUrl=%2Fdashboard&error=AccessDenied')
    );
    signInMock.mockResolvedValue(undefined);
  });

  it('should render login CTA and show AccessDenied message', () => {
    render(<LoginPage />);
    expect(screen.getByText('Entrar com SSO (Keycloak)')).toBeInTheDocument();
    expect(
      screen.getByText('Acesso negado. Somente administradores podem acessar este painel.')
    ).toBeInTheDocument();
  });

  it('should call keycloak signIn with callback url', async () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams('callbackUrl=%2Forders'));
    render(<LoginPage />);

    fireEvent.click(screen.getByRole('button', { name: /Entrar com SSO/i }));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith('keycloak', { callbackUrl: '/orders' });
    });
  });
});

