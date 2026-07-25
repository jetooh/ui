import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  it('não renderiza quando fechado', () => {
    render(<Modal open={false} onClose={() => {}} title="Oi">corpo</Modal>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renderiza como dialog acessível com título ligado (aria-labelledby)', () => {
    render(<Modal open onClose={() => {}} title="Confirmar" description="tem certeza?">corpo</Modal>);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    const heading = screen.getByRole('heading', { name: 'Confirmar' });
    expect(dialog).toHaveAttribute('aria-labelledby', heading.id);
  });

  it('Esc, clique no overlay e botão Fechar chamam onClose', () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} title="X">corpo</Modal>);
    fireEvent.keyDown(window, { key: 'Escape' });
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
