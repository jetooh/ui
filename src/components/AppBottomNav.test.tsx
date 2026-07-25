import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Home, Monitor } from 'lucide-react';
import { AppBottomNav, type BottomNavItem } from './AppBottomNav';

const items: BottomNavItem[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'displays', label: 'Displays', icon: Monitor },
];

describe('AppBottomNav', () => {
  it('renderiza as abas e marca a ativa com aria-current', () => {
    render(<AppBottomNav items={items} activeId="displays" onNavigate={() => {}} />);
    expect(screen.getByRole('button', { name: /Displays/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: /Home/ })).not.toHaveAttribute('aria-current');
  });

  it('chama onNavigate com o id da aba', () => {
    const onNavigate = vi.fn();
    render(<AppBottomNav items={items} activeId="dashboard" onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole('button', { name: /Displays/ }));
    expect(onNavigate).toHaveBeenCalledWith('displays');
  });
});
