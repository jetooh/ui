import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from './Switch';

describe('Switch', () => {
  it('expõe role=switch com aria-checked refletindo o estado', () => {
    const { rerender } = render(<Switch checked={false} onCheckedChange={() => {}} label="Ativar" />);
    const sw = screen.getByRole('switch', { name: 'Ativar' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
    rerender(<Switch checked onCheckedChange={() => {}} label="Ativar" />);
    expect(screen.getByRole('switch', { name: 'Ativar' })).toHaveAttribute('aria-checked', 'true');
  });

  it('chama onCheckedChange com o valor invertido ao clicar', () => {
    const onChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onChange} label="Ativar" />);
    fireEvent.click(screen.getByRole('switch', { name: 'Ativar' }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('não dispara quando disabled', () => {
    const onChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onChange} disabled label="Ativar" />);
    fireEvent.click(screen.getByRole('switch', { name: 'Ativar' }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
