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

  it('modo rico: mostra nome+email, itens e o toggle de tema', () => {
    const onToggleTheme = vi.fn();
    const onAccount = vi.fn();
    render(
      <UserMenu
        name="Ana Jetooh"
        email="ana@jetooh.com"
        initials="AJ"
        items={[{ label: 'Configurações', onClick: onAccount }]}
        isDark={false}
        onToggleTheme={onToggleTheme}
        onLogout={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }));
    expect(screen.getByText('ana@jetooh.com')).toBeInTheDocument();
    const cfg = screen.getByRole('menuitem', { name: /Configurações/ });
    fireEvent.click(cfg);
    expect(onAccount).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Alternar tema escuro' }));
    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });
});
