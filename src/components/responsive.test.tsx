import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Monitor, Activity, DollarSign } from 'lucide-react';

import { AppBottomNav } from './AppBottomNav';
import { Card, CardAction, CardHeader, CardTitle } from './Card';
import { ContentHeader } from './ContentHeader';
import { DetailHeader } from './DetailHeader';
import { Input } from './Input';
import { KpiCard, KpiGrid } from './KpiCard';
import { PageFrame } from './PageFrame';
import { SegmentedTabs } from './SegmentedTabs';
import { Table, TableBody, TableCell, TableRow } from './Table';

// Contratos de RESPONSIVIDADE do tema Dashboard2026. jsdom não faz layout, então
// o que se protege aqui é o contrato de classes/estrutura que produz o
// comportamento responsivo — cada asserção corresponde a um defeito medido com
// Playwright (overflow horizontal / conteúdo cortado / alvo de toque < 40px).
// Como o pacote é fonte única, o teste protege TODAS as apps do tema.
describe('responsividade — contratos do tema', () => {
  it('PageFrame usa 100dvh (com fallback h-screen) — 100vh mente no mobile', () => {
    const { container } = render(
      <PageFrame rail={null} mainId="conteudo">
        <p>conteúdo</p>
      </PageFrame>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('h-screen');
    expect(root.className).toContain('supports-[height:100dvh]:h-dvh');
  });

  it('PageFrame reserva o safe-area inferior quando há bottom-nav', () => {
    const nav = <AppBottomNav items={[{ id: 'a', label: 'A', icon: Monitor }]} activeId="a" onNavigate={() => {}} />;
    const { container, rerender } = render(
      <PageFrame rail={null} mainId="conteudo" mobileBottomNav={nav}>
        <p>conteúdo</p>
      </PageFrame>,
    );
    expect(container.querySelector('.h-\\[env\\(safe-area-inset-bottom\\)\\]')).not.toBeNull();

    rerender(
      <PageFrame rail={null} mainId="conteudo">
        <p>conteúdo</p>
      </PageFrame>,
    );
    expect(container.querySelector('.h-\\[env\\(safe-area-inset-bottom\\)\\]')).toBeNull();
  });

  it('SegmentedTabs rola na horizontal em vez de estourar o container', () => {
    render(
      <SegmentedTabs
        items={[
          { id: 'a', label: 'Visão geral', icon: Activity },
          { id: 'b', label: 'Financeiro', icon: DollarSign },
        ]}
        value="a"
        onChange={() => {}}
      />,
    );
    const list = screen.getByRole('tablist');
    expect(list.className).toContain('max-w-full');
    expect(list.className).toContain('overflow-x-auto');
    // Abas não podem encolher nem quebrar dentro do trilho com scroll.
    for (const tab of screen.getAllByRole('tab')) {
      expect(tab.className).toContain('shrink-0');
      expect(tab.className).toContain('whitespace-nowrap');
    }
  });

  it('KpiCard deixa o valor longo quebrar em vez de ser cortado pelo Card', () => {
    render(<KpiCard label="Faturamento" value="R$ 3.482.995,00" icon={DollarSign} />);
    const value = screen.getByText('R$ 3.482.995,00');
    expect(value.className).toContain('break-words');
    // A coluna de texto precisa de min-w-0 para poder encolher no flex.
    expect((value.parentElement as HTMLElement).className).toContain('min-w-0');
  });

  it('KpiGrid permite que os cards encolham abaixo do conteúdo', () => {
    const { container } = render(
      <KpiGrid>
        <div>a</div>
      </KpiGrid>,
    );
    expect((container.firstElementChild as HTMLElement).className).toContain('[&>*]:min-w-0');
  });

  it('DetailHeader reflui (wrap) com título longo + status + ação', () => {
    const { container } = render(
      <DetailHeader
        onBack={() => {}}
        title="Shopping Center Iguatemi — Praça de Alimentação Piso 3"
        status={{ label: 'Operando', variant: 'online' }}
        action={<button type="button">Inativar</button>}
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('flex-wrap');
    expect(screen.getByRole('heading', { level: 2 }).className).toContain('min-w-0');
  });

  it('ContentHeader trunca o título e protege as ações de serem espremidas', () => {
    const { container } = render(
      <ContentHeader icon={Monitor} moduleTitle="Displays" description="Gestão da rede">
        <button type="button">Ação</button>
      </ContentHeader>,
    );
    expect(screen.getByRole('heading', { level: 1 }).className).toContain('truncate');
    const actions = container.querySelector('[class*="shrink-0"][class*="items-center"]:last-child');
    expect(actions).not.toBeNull();
  });

  it('Table mantém o scroll horizontal dentro do container', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const wrapper = container.querySelector('[data-slot="table-container"]') as HTMLElement;
    expect(wrapper.className).toContain('overflow-x-auto');
    expect(wrapper.className).toContain('max-w-full');
  });

  it('CardHeader empilha as ações no celular e limita a coluna delas no desktop', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Meus Displays</CardTitle>
          <CardAction>
            <div className="flex items-center gap-2">
              <button type="button">Filtros</button>
            </div>
          </CardAction>
        </CardHeader>
      </Card>,
    );
    const header = container.querySelector('[data-slot="card-header"]') as HTMLElement;
    // 1 coluna no celular; a partir de sm a ação ganha coluna própria COM TETO
    // (`fit-content(70%)`) — com `auto` a trilha zerava a coluna do título.
    expect(header.className).toContain('has-data-[slot=card-action]:grid-cols-1');
    expect(header.className).toContain('has-data-[slot=card-action]:sm:grid-cols-[1fr_fit-content(70%)]');

    const action = container.querySelector('[data-slot="card-action"]') as HTMLElement;
    // A barra de ações das apps é um `flex` — precisa poder quebrar linha.
    expect(action.className).toContain('[&>*]:flex-wrap');
    expect(action.className).toContain('max-w-full');
  });

  it('Input tem alvo/fonte de toque (40px e 16px evitam o zoom do iOS)', () => {
    const { container } = render(<Input aria-label="campo" />);
    const input = container.querySelector('input') as HTMLElement;
    expect(input.className).toContain('pointer-coarse:min-h-10');
    expect(input.className).toContain('pointer-coarse:text-[16px]');
  });
});
