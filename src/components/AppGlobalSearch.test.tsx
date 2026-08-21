import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Monitor, FolderTree } from 'lucide-react';
import { AppGlobalSearch, type SearchResultItem } from './AppGlobalSearch';

const recentItems: SearchResultItem[] = [
  { id: 'r1', icon: Monitor, label: 'SP-014', category: 'Dispositivo', onSelect: () => {} },
];

describe('AppGlobalSearch', () => {
  it('não renderiza nada quando open=false', () => {
    const { container } = render(
      <AppGlobalSearch open={false} onClose={() => {}} query="" onQueryChange={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('mostra recentes com query vazia e chama onSelect + onClose ao clicar', () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(
      <AppGlobalSearch
        open
        onClose={onClose}
        query=""
        onQueryChange={() => {}}
        recentItems={[{ ...recentItems[0], onSelect }]}
      />,
    );
    fireEvent.click(screen.getByText('SP-014'));
    expect(onSelect).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('mostra resultados reais quando query != "" (sem inventar dado)', () => {
    const results: SearchResultItem[] = [
      { id: 'g1', icon: FolderTree, label: 'Grupo Centro', category: 'Grupo', onSelect: () => {} },
    ];
    render(
      <AppGlobalSearch open onClose={() => {}} query="centro" onQueryChange={() => {}} results={results} />,
    );
    expect(screen.getByText('Grupo Centro')).toBeInTheDocument();
  });

  it('mostra "sem resultados" quando query != "" e results está vazio', () => {
    render(<AppGlobalSearch open onClose={() => {}} query="xyz" onQueryChange={() => {}} results={[]} />);
    expect(screen.getByText('Nenhum resultado encontrado')).toBeInTheDocument();
  });

  it('fecha com Escape', () => {
    const onClose = vi.fn();
    render(<AppGlobalSearch open onClose={onClose} query="" onQueryChange={() => {}} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
