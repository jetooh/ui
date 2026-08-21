import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Home, Monitor, Settings } from 'lucide-react';
import { AppRail, type RailItem } from './AppRail';

const items: RailItem[] = [
  { id: 'dash', label: 'Dashboard', icon: Home },
  { id: 'disp', label: 'Displays', icon: Monitor, badge: 3 },
];
const bottom: RailItem[] = [{ id: 'settings', label: 'Config', icon: Settings }];

describe('AppRail', () => {
  it('renderiza os itens e marca o ativo com aria-current', () => {
    render(<AppRail items={items} activeId="disp" onNavigate={() => {}} />);
    expect(screen.getByRole('button', { name: 'Dashboard' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('button', { name: /Displays/ })).toHaveAttribute('aria-current', 'page');
  });

  it('chama onNavigate com o id ao clicar', () => {
    const onNavigate = vi.fn();
    render(<AppRail items={items} activeId="dash" onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole('button', { name: /Displays/ }));
    expect(onNavigate).toHaveBeenCalledWith('disp');
  });

  it('mostra o badge de notificação quando > 0', () => {
    render(<AppRail items={items} activeId="dash" onNavigate={() => {}} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('dispara onPrefetch no hover', () => {
    const onPrefetch = vi.fn();
    render(<AppRail items={items} activeId="dash" onNavigate={() => {}} onPrefetch={onPrefetch} />);
    fireEvent.mouseEnter(screen.getByRole('button', { name: /Displays/ }));
    expect(onPrefetch).toHaveBeenCalledWith('disp');
  });

  it('renderiza bottomItems e o botão de expandir', () => {
    const onExpand = vi.fn();
    render(<AppRail items={items} bottomItems={bottom} activeId="dash" onNavigate={() => {}} onExpand={onExpand} />);
    expect(screen.getByRole('button', { name: 'Config' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Expandir menu' }));
    expect(onExpand).toHaveBeenCalled();
  });

  describe('item com href', () => {
    const linkedItems: RailItem[] = [
      { id: '/dashboard', label: 'Dashboard', href: '/dashboard', icon: Home },
      { id: '/devices', label: 'Dispositivos', href: '/devices', icon: Monitor },
    ];

    it('renderiza <a href> real em vez de <button>', () => {
      render(<AppRail items={linkedItems} activeId="/devices" onNavigate={() => {}} />);
      const link = screen.getByRole('link', { name: 'Dispositivos' });
      expect(link).toHaveAttribute('href', '/devices');
      expect(link).toHaveAttribute('aria-current', 'page');
      expect(screen.queryByRole('button', { name: 'Dispositivos' })).not.toBeInTheDocument();
    });

    it('clique normal previne o reload e navega client-side via onNavigate', () => {
      const onNavigate = vi.fn();
      render(<AppRail items={linkedItems} activeId="/dashboard" onNavigate={onNavigate} />);
      const link = screen.getByRole('link', { name: 'Dispositivos' });
      const event = fireEvent.click(link);
      expect(onNavigate).toHaveBeenCalledWith('/devices');
      expect(event).toBe(false); // preventDefault() foi chamado (sem reload)
    });

    it('Ctrl/Cmd+clique não chama onNavigate nem previne o default (abre em nova aba)', () => {
      const onNavigate = vi.fn();
      render(<AppRail items={linkedItems} activeId="/dashboard" onNavigate={onNavigate} />);
      const link = screen.getByRole('link', { name: 'Dispositivos' });
      const event = fireEvent.click(link, { ctrlKey: true });
      expect(onNavigate).not.toHaveBeenCalled();
      expect(event).toBe(true); // preventDefault() NÃO foi chamado
    });
  });
});
