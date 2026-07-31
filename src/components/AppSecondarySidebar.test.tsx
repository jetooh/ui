import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BarChart3, Monitor, Users } from 'lucide-react';
import { AppSecondarySidebar, AppSubNav, type SidebarSection } from './AppSecondarySidebar';

const sections: SidebarSection[] = [
  {
    heading: 'Gerenciamento',
    items: [
      { id: 'displays', label: 'Visão Geral', icon: BarChart3 },
      { id: 'displays.list', label: 'Meus Displays', icon: Monitor },
    ],
  },
  {
    heading: 'Equipe',
    items: [{ id: 'settings.team', label: 'Membros', icon: Users, badge: 12 }],
  },
];

describe('AppSecondarySidebar', () => {
  it('renderiza headings e itens das seções', () => {
    render(<AppSecondarySidebar sections={sections} activeId="displays" onNavigate={() => {}} />);
    expect(screen.getByText('Gerenciamento')).toBeInTheDocument();
    expect(screen.getByText('Equipe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Meus Displays/ })).toBeInTheDocument();
  });

  it('marca só o item ativo com aria-current', () => {
    render(<AppSecondarySidebar sections={sections} activeId="displays.list" onNavigate={() => {}} />);
    expect(screen.getByRole('button', { name: /Meus Displays/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: /Visão Geral/ })).not.toHaveAttribute('aria-current');
  });

  it('chama onNavigate com o id ao clicar e onPrefetch no hover', () => {
    const onNavigate = vi.fn();
    const onPrefetch = vi.fn();
    render(
      <AppSecondarySidebar
        sections={sections}
        activeId="displays"
        onNavigate={onNavigate}
        onPrefetch={onPrefetch}
      />,
    );
    const item = screen.getByRole('button', { name: /Meus Displays/ });
    fireEvent.mouseEnter(item);
    fireEvent.click(item);
    expect(onPrefetch).toHaveBeenCalledWith('displays.list');
    expect(onNavigate).toHaveBeenCalledWith('displays.list');
  });

  it('mostra o badge do item (9+ acima de 9)', () => {
    render(<AppSecondarySidebar sections={sections} activeId="displays" onNavigate={() => {}} />);
    expect(screen.getByText('9+')).toBeInTheDocument();
  });

  it('não renderiza nada quando não há seções', () => {
    const { container } = render(
      <AppSecondarySidebar sections={[]} activeId="x" onNavigate={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza o slot de widgets (footer)', () => {
    render(
      <AppSecondarySidebar
        sections={sections}
        activeId="displays"
        onNavigate={() => {}}
        footer={<div>Informações</div>}
      />,
    );
    expect(screen.getByText('Informações')).toBeInTheDocument();
  });

  it('mostra o botão Recolher só quando onCollapse é fornecido', () => {
    const onCollapse = vi.fn();
    const { rerender } = render(
      <AppSecondarySidebar sections={sections} activeId="displays" onNavigate={() => {}} />,
    );
    expect(screen.queryByRole('button', { name: 'Recolher' })).not.toBeInTheDocument();

    rerender(
      <AppSecondarySidebar
        sections={sections}
        activeId="displays"
        onNavigate={() => {}}
        onCollapse={onCollapse}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Recolher' }));
    expect(onCollapse).toHaveBeenCalled();
  });
});

describe('AppSubNav', () => {
  const items = sections.flatMap((s) => s.items);

  it('renderiza os itens (flat) e marca o ativo', () => {
    render(<AppSubNav items={items} activeId="settings.team" onNavigate={() => {}} />);
    expect(screen.getByRole('button', { name: /Membros/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: /Visão Geral/ })).not.toHaveAttribute('aria-current');
  });

  it('não renderiza com 1 item ou menos', () => {
    const { container } = render(
      <AppSubNav items={[items[0]]} activeId={items[0].id} onNavigate={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('navega ao clicar', () => {
    const onNavigate = vi.fn();
    render(<AppSubNav items={items} activeId="displays" onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole('button', { name: /Membros/ }));
    expect(onNavigate).toHaveBeenCalledWith('settings.team');
  });
});
