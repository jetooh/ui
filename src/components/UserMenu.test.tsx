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

  const apps = [
    { slug: 'platform', name: 'Platform', icon: 'monitor', url: 'https://platform.jetooh.com' },
    { slug: 'devices', name: 'Devices', icon: 'presentation', url: 'https://devices.jetooh.com' },
  ];

  it('sem `apps`, não mostra a seção "Trocar de app" (retrocompat)', () => {
    render(<UserMenu name="Ana" email="ana@jetooh.com" initials="A" onLogout={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }));
    expect(screen.queryByText('Trocar de app')).not.toBeInTheDocument();
  });

  it('com só o app atual na lista, não mostra a seção (nada para trocar)', () => {
    render(
      <UserMenu
        name="Ana"
        initials="A"
        apps={[apps[0]]}
        currentAppSlug="platform"
        onLogout={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }));
    expect(screen.queryByText('Trocar de app')).not.toBeInTheDocument();
  });

  it('mostra skeleton enquanto `appsLoading`, sem listar apps', () => {
    render(<UserMenu name="Ana" initials="A" appsLoading apps={[]} onLogout={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }));
    expect(screen.getByText('Trocar de app')).toBeInTheDocument();
    expect(screen.queryByText('Platform')).not.toBeInTheDocument();
  });

  it('destaca o app atual (aria-current, não clicável) e navega ao clicar nos outros', () => {
    const originalLocation = window.location;
    // @ts-expect-error -- substituir por um objeto simples só para capturar o href
    delete window.location;
    // @ts-expect-error
    window.location = { href: '' };

    render(
      <UserMenu
        name="Ana"
        initials="A"
        apps={apps}
        currentAppSlug="platform"
        onLogout={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }));

    const current = screen.getByRole('menuitem', { name: /Platform/ });
    expect(current).toHaveAttribute('aria-current', 'true');
    expect(current.tagName).toBe('DIV');

    const other = screen.getByRole('menuitem', { name: /Devices/ });
    expect(other.tagName).toBe('BUTTON');
    fireEvent.click(other);
    expect(window.location.href).toBe('https://devices.jetooh.com');

    window.location = originalLocation;
  });

  it('bloqueia navegação para um app.url fora do ecossistema jetooh.com', () => {
    const originalLocation = window.location;
    // @ts-expect-error
    delete window.location;
    // @ts-expect-error
    window.location = { href: '' };
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <UserMenu
        name="Ana"
        initials="A"
        apps={[{ slug: 'evil', name: 'Evil', icon: null, url: 'https://evil.example.com' }]}
        onLogout={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }));
    fireEvent.click(screen.getByRole('menuitem', { name: /Evil/ }));
    expect(window.location.href).toBe('');
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
    window.location = originalLocation;
  });

  it('fecha ao clicar/tocar fora do popover, mesmo sobre um elemento com z-index alto (ex.: AppRail)', () => {
    render(
      <div>
        {/* Simula um elemento da casca com z-index >= o do antigo backdrop
            (AppRail é z-50) — é exatamente esse caso que o backdrop antigo
            (fixed inset-0 z-40) não cobria (JET-264). */}
        <button className="fixed left-0 top-0 z-50" data-testid="rail-item">
          Rail
        </button>
        <UserMenu name="Ana" initials="A" onLogout={() => {}} />
      </div>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByTestId('rail-item'));

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('NÃO fecha ao clicar dentro do popover', () => {
    render(<UserMenu name="Ana" initials="A" onLogout={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }));
    const menu = screen.getByRole('menu');

    fireEvent.pointerDown(menu);

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('Escape fecha o menu e devolve o foco ao botão do avatar', () => {
    render(<UserMenu name="Ana" initials="A" onLogout={() => {}} />);
    const trigger = screen.getByRole('button', { name: 'Menu do usuário' });
    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('clicar no próprio avatar com o menu aberto apenas fecha (sem reabrir por double-toggle)', () => {
    render(<UserMenu name="Ana" initials="A" onLogout={() => {}} />);
    const trigger = screen.getByRole('button', { name: 'Menu do usuário' });
    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
