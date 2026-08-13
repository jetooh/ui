import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
// Cartão de SEÇÃO canônico do tema: ícone + título + ação à direita, borda sob o
// cabeçalho, corpo rente (tabelas/listas) ou com respiro (formulários, via
// bodyClassName). Compõe as primitivas do pacote — convenção única de cabeçalho
// de seção. Régua: platform.
import { Card, CardAction, CardHeader, CardTitle } from './Card';
import { cn } from '../lib/cn';

export interface SectionCardProps {
  /** Ícone semântico da seção (mesma coisa → mesmo ícone). */
  icon?: LucideIcon;
  title: string;
  /** Ação à direita do título (ex.: botão "Novo"). */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Respiro do corpo. Omitido = corpo rente (tabelas/listas cuidam do próprio). */
  bodyClassName?: string;
}

export function SectionCard({ icon: Icon, title, action, children, className, bodyClassName }: SectionCardProps) {
  return (
    <Card className={cn('gap-0 overflow-hidden p-0', className)}>
      <CardHeader className="items-center border-b border-gray-100 py-4">
        <CardTitle className="flex items-center gap-2 text-preto">
          {/* D4 (JET-106): ícone DECORATIVO — não carrega informação que o título
              ao lado já não dê. Era o cinza 400 cru, que a JET-99 proibiu e o
              contrato não declara; vai para `text-muted-foreground`, um dos 18
              semânticos, que expõe o grau gray-500 (4.83:1 claro / 7.04:1 escuro). */}
          {Icon && <Icon size={16} strokeWidth={1.5} className="text-muted-foreground" />}
          {title}
        </CardTitle>
        {action && <CardAction className="self-center">{action}</CardAction>}
      </CardHeader>
      {bodyClassName ? <div className={bodyClassName}>{children}</div> : children}
    </Card>
  );
}
