import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Globe } from 'lucide-react';
import { AppUserMenu } from './AppUserMenu';

const open = () => fireEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }));

describe('AppUserMenu', () => {
  it('monta os itens padrão na ordem canônica, com os extras depois', () => {
    render(
      <AppUserMenu
        name="Ana Jetooh"
        email="ana@jetooh.com"
        initials="AJ"
        onProfile={() => {}}
        onSettings={() => {}}
        extraItems={[{ label: 'Idioma', icon: Globe, onClick: () => {} }]}
        isDark={false}
        onToggleTheme={() => {}}
        onLogout={() => {}}
      />,
    );
    open();
    const labels = screen.getAllByRole('menuitem').map((el) => el.textContent);
    expect(labels).toEqual(['Minha Conta', 'Configurações', 'Idioma', 'Sair']);
  });

  it('omite "Minha Conta" e "Configurações" quando a app não passa os callbacks', () => {
    render(
      <AppUserMenu
        name="Equipe JETOOH"
        email="admin@jetooh.com"
        initials="EJ"
        isDark
        onToggleTheme={() => {}}
        onLogout={() => {}}
      />,
    );
    open();
    expect(screen.queryByRole('menuitem', { name: /Minha Conta/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: /Configurações/ })).not.toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Sair/ })).toBeInTheDocument();
  });

  it('dispara os callbacks dos itens padrão', () => {
    const onProfile = vi.fn();
    const onSettings = vi.fn();
    const onLogout = vi.fn();
    render(
      <AppUserMenu
        name="Ana"
        email="ana@jetooh.com"
        initials="A"
        onProfile={onProfile}
        onSettings={onSettings}
        onLogout={onLogout}
      />,
    );
    open();
    fireEvent.click(screen.getByRole('menuitem', { name: /Minha Conta/ }));
    expect(onProfile).toHaveBeenCalledTimes(1);
    open();
    fireEvent.click(screen.getByRole('menuitem', { name: /Configurações/ }));
    expect(onSettings).toHaveBeenCalledTimes(1);
    open();
    fireEvent.click(screen.getByRole('menuitem', { name: /Sair/ }));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('mostra nome, e-mail e o toggle de tema (mesmo menu no mobile, avatar sm)', () => {
    const onToggleTheme = vi.fn();
    render(
      <AppUserMenu
        name="Ana Jetooh"
        email="ana@jetooh.com"
        initials="AJ"
        avatarSize="sm"
        isDark={false}
        onToggleTheme={onToggleTheme}
        onLogout={() => {}}
      />,
    );
    open();
    expect(screen.getByText('Ana Jetooh')).toBeInTheDocument();
    expect(screen.getByText('ana@jetooh.com')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('switch', { name: 'Alternar tema escuro' }));
    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('repassa `apps`/`currentAppSlug` para a seção "Trocar de app" do UserMenu', () => {
    render(
      <AppUserMenu
        name="Ana"
        initials="A"
        apps={[
          { slug: 'platform', name: 'Platform', icon: 'monitor', url: 'https://platform.jetooh.com' },
          { slug: 'admin', name: 'Admin', icon: null, url: 'https://admin.jetooh.com' },
        ]}
        currentAppSlug="platform"
        onLogout={() => {}}
      />,
    );
    open();
    expect(screen.getByText('Trocar de app')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Platform/ })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('menuitem', { name: /Admin/ })).toBeInTheDocument();
  });
});
