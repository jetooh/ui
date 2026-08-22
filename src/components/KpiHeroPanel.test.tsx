import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Monitor } from 'lucide-react';
import { KpiHeroPanel } from './KpiHeroPanel';
import { KpiCard } from './KpiCard';

describe('KpiHeroPanel', () => {
  it('renderiza título, ação e os KPIs filhos dentro do KpiGrid', () => {
    render(
      <KpiHeroPanel title="Visão geral" action={<span>ação</span>}>
        <KpiCard label="Dispositivos" value="3" icon={Monitor} />
      </KpiHeroPanel>,
    );
    expect(screen.getByText('Visão geral')).toBeInTheDocument();
    expect(screen.getByText('ação')).toBeInTheDocument();
    expect(screen.getByText('Dispositivos')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('sem título nem ação, não renderiza a linha de cabeçalho', () => {
    const { container } = render(
      <KpiHeroPanel>
        <KpiCard label="X" value="1" icon={Monitor} />
      </KpiHeroPanel>,
    );
    expect(container.querySelector('.mb-3')).toBeNull();
  });

  it('acento lateral roxo (mesma linguagem visual de outras faixas de destaque do tema)', () => {
    const { container } = render(
      <KpiHeroPanel>
        <KpiCard label="X" value="1" icon={Monitor} />
      </KpiHeroPanel>,
    );
    expect(container.querySelector('.border-l-roxo')).not.toBeNull();
  });

  it('gridClassName repassa ao KpiGrid interno (ex.: override de colunas no mobile)', () => {
    const { container } = render(
      <KpiHeroPanel gridClassName="grid-cols-2 lg:items-stretch">
        <KpiCard label="X" value="1" icon={Monitor} />
      </KpiHeroPanel>,
    );
    expect(container.querySelector('.grid-cols-2')).not.toBeNull();
  });
});
