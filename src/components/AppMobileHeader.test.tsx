import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppMobileHeader } from './AppMobileHeader';

describe('AppMobileHeader', () => {
  it('mostra o hambúrguer quando onMenuToggle é passado e o dispara', () => {
    const onMenuToggle = vi.fn();
    render(<AppMobileHeader onMenuToggle={onMenuToggle} userMenu={<span>menu</span>} />);
    const burger = screen.getByRole('button', { name: 'Abrir menu' });
    fireEvent.click(burger);
    expect(onMenuToggle).toHaveBeenCalled();
  });

  it('sem onMenuToggle não renderiza hambúrguer; renderiza ações e userMenu', () => {
    render(
      <AppMobileHeader actions={<button>busca</button>} userMenu={<button>avatar</button>} />,
    );
    expect(screen.queryByRole('button', { name: 'Abrir menu' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'busca' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'avatar' })).toBeInTheDocument();
  });
});
