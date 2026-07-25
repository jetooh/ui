import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Activity } from 'lucide-react';
import { StatusDot } from './StatusDot';
import { KpiCard } from './KpiCard';
import { Badge } from './Badge';
import { Button } from './Button';
import { AppFooter } from './AppFooter';

describe('StatusDot', () => {
  it('com pulse renderiza o anel animado; sem pulse não', () => {
    const { container, rerender } = render(<StatusDot color="bg-verde" pulse />);
    expect(container.querySelector('.animate-ping')).not.toBeNull();
    rerender(<StatusDot color="bg-red-400" />);
    expect(container.querySelector('.animate-ping')).toBeNull();
  });
});

describe('KpiCard', () => {
  it('renderiza label, valor e trend', () => {
    render(<KpiCard label="Online" value="42" icon={Activity} trend="+5%" trendUp />);
    expect(screen.getByText('Online')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('+5%')).toBeInTheDocument();
  });
});

describe('Badge', () => {
  it('renderiza o texto', () => {
    render(<Badge>Novo</Badge>);
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });
});

describe('Button', () => {
  it('dispara onClick e respeita disabled', () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Salvar</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<Button onClick={onClick} disabled>Salvar</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('AppFooter', () => {
  it('mostra copyright e links institucionais', () => {
    render(<AppFooter />);
    expect(screen.getByText(/Jetooh\. Todos os direitos reservados/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Termos de Uso' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Website' })).toBeInTheDocument();
  });
});
