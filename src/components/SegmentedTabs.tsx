import type { LucideIcon } from 'lucide-react';
// Controle segmentado (pílulas) canônico do tema — casca única para abas leves
// (ex.: Faturas/Saques, Países/Categorias/Motivos). Só estilo via tokens; o que
// varia (itens) entra como dado. Régua: platform.
import { cn } from '../lib/cn';

export interface SegmentedTabItem<T extends string = string> {
  id: T;
  label: string;
  icon?: LucideIcon;
}

export interface SegmentedTabsProps<T extends string> {
  items: SegmentedTabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
  ariaLabel?: string;
}

export function SegmentedTabs<T extends string>({
  items,
  value,
  onChange,
  className,
  ariaLabel,
}: SegmentedTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('inline-flex items-center gap-1 rounded-xl border border-gray-100 bg-branco p-1', className)}
    >
      {items.map((it) => {
        const Icon = it.icon;
        const active = it.id === value;
        return (
          <button
            key={it.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(it.id)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors',
              active ? 'bg-preto/5 text-preto' : 'text-gray-500 hover:text-preto',
            )}
          >
            {Icon && <Icon size={15} strokeWidth={1.5} />}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
