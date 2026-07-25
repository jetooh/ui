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
});
