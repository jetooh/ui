import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserMenu } from './UserMenu';

describe('UserMenu', () => {
  it('começa fechado (aria-expanded=false) e mostra as iniciais', () => {
    render(<UserMenu name="Ana Jetooh" initials="AJ" onLogout={() => {}} />);
    const trigger = screen.getByRole('button', { name: 'Menu do usuário' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('AJ')).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: /Sair/ })).not.toBeInTheDocument();
  });

  it('abre o menu e chama onLogout ao clicar em Sair', () => {
    const onLogout = vi.fn();
    render(<UserMenu name="Ana" initials="A" onLogout={onLogout} />);
    fireEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }));
    const sair = screen.getByRole('menuitem', { name: /Sair/ });
    expect(sair).toBeInTheDocument();
    fireEvent.click(sair);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
