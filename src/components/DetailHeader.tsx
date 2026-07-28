import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
// Cabeçalho rico da ENTIDADE no corpo (o título do módulo fica no ContentHeader):
// voltar + nome + status + ação. Canônico para páginas de detalhe/ficha. Régua:
// platform.
import { Button } from './Button';
import { StatusBadge, type StatusBadgeProps } from './StatusBadge';

export interface DetailHeaderProps {
  onBack: () => void;
  /** aria-label do botão voltar. */
  backLabel?: string;
  title: string;
  /** Adorno após o título (ex.: ISO do país em cinza). */
  titleAdornment?: ReactNode;
  status?: { label: string; variant: StatusBadgeProps['variant'] };
  /** Ação à direita (ex.: bloquear/inativar). */
  action?: ReactNode;
}

export function DetailHeader({ onBack, backLabel = 'Voltar', title, titleAdornment, status, action }: DetailHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        aria-label={backLabel}
        className="h-8 w-8 border-gray-200"
        onClick={onBack}
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
      </Button>
      <h2 className="text-base font-bold text-preto">{title}</h2>
      {titleAdornment}
      {status && <StatusBadge label={status.label} variant={status.variant} />}
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}
