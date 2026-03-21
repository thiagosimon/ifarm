import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Sidebar } from '@/components/layout/sidebar';

const usePathnameMock = jest.fn();
const signOutMock = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => usePathnameMock(),
}));

jest.mock('next-auth/react', () => ({
  signOut: (...args: unknown[]) => signOutMock(...args),
}));

describe('Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should expand user group when current route is a child route', () => {
    usePathnameMock.mockReturnValue('/users/farmers');

    render(<Sidebar />);

    expect(screen.getByRole('link', { name: 'Farmers' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Retailers' })).toBeInTheDocument();
  });

  it('should collapse and expand user group manually', () => {
    usePathnameMock.mockReturnValue('/dashboard');

    render(<Sidebar />);

    fireEvent.click(screen.getByRole('button', { name: 'Usuários' }));
    expect(screen.getByRole('link', { name: 'Farmers' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Usuários' }));
    expect(screen.queryByRole('link', { name: 'Farmers' })).not.toBeInTheDocument();
  });

  it('should sign out with login callback', () => {
    usePathnameMock.mockReturnValue('/dashboard');

    render(<Sidebar />);
    fireEvent.click(screen.getByRole('button', { name: 'Sair' }));

    expect(signOutMock).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });
});

