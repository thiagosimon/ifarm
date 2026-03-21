import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import DisputeDetailPage from '@/app/(dashboard)/disputes/[id]/page';

describe('DisputeDetailPage', () => {
  it('should render resolution actions and message timeline', () => {
    render(<DisputeDetailPage params={Promise.resolve({ id: '1' })} />);

    expect(screen.getByText('Disputa #IF-9921')).toBeInTheDocument();
    expect(screen.getByText('Resolver — Farmer')).toBeInTheDocument();
    expect(screen.getByText('Resolver — Retailer')).toBeInTheDocument();
    expect(screen.getByText('Fechar Sem Resolução')).toBeInTheDocument();
    expect(screen.getByText('Mensagens')).toBeInTheDocument();
  });

  it('should allow typing resolution and chat message', () => {
    render(<DisputeDetailPage params={Promise.resolve({ id: '1' })} />);

    const resolutionField = screen.getByPlaceholderText('Descreva a resolução da disputa...');
    const messageField = screen.getByPlaceholderText('Digite uma mensagem...');

    fireEvent.change(resolutionField, { target: { value: 'Conceder ganho de causa ao farmer.' } });
    fireEvent.change(messageField, { target: { value: 'Solicitando novo laudo técnico.' } });

    expect(resolutionField).toHaveValue('Conceder ganho de causa ao farmer.');
    expect(messageField).toHaveValue('Solicitando novo laudo técnico.');
  });
});
