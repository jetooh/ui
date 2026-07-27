import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangePicker, computePreset, comparisonRange, defaultRange } from './DateRangePicker';

describe('DateRangePicker helpers', () => {
  it('defaultRange = mês até hoje comparando com ano anterior', () => {
    const r = defaultRange();
    expect(r.preset).toBe('month_to_date');
    expect(r.compare).toBe('year');
    expect(r.from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(r.to).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('computePreset("today") tem from === to', () => {
    const { from, to } = computePreset('today');
    expect(from).toBe(to);
  });

  it('comparisonRange("year") recua um ano', () => {
    const c = comparisonRange('2026-03-10', '2026-03-20', 'year');
    expect(c.from).toBe('2025-03-10');
    expect(c.to).toBe('2025-03-20');
  });
});

describe('DateRangePicker', () => {
  it('abre o lightbox e aplica um preset', () => {
    let applied: string | null = null;
    render(
      <DateRangePicker
        value={defaultRange()}
        onApply={(v) => { applied = v.preset; }}
      />,
    );
    // gatilho compacto abre o lightbox (portal no body)
    fireEvent.click(screen.getByRole('button', { name: /Mês até hoje/i }));
    expect(screen.getByText('Selecione um período')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Hoje' }));
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }));
    expect(applied).toBe('today');
  });
});
