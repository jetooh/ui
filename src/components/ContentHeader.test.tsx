import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Monitor } from 'lucide-react';
import { ContentHeader } from './ContentHeader';

describe('ContentHeader', () => {
  it('renderiza título, subtítulo, descrição e ações (children)', () => {
    render(
      <ContentHeader icon={Monitor} moduleTitle="Displays" subTitle="Detalhe" description="Lista completa">
        <button>Ação</button>
      </ContentHeader>,
    );
    expect(screen.getByRole('heading', { name: 'Displays' })).toBeInTheDocument();
    expect(screen.getByText('Detalhe')).toBeInTheDocument();
    expect(screen.getByText('Lista completa')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ação' })).toBeInTheDocument();
  });

  it('customLeft substitui o bloco padrão da esquerda', () => {
    render(
      <ContentHeader icon={Monitor} moduleTitle="Displays" customLeft={<div>Header rico</div>} />,
    );
    expect(screen.getByText('Header rico')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Displays' })).not.toBeInTheDocument();
  });
});
