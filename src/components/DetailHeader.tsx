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
    // `flex-wrap` + `min-w-0`: nome longo de entidade + status + ação não cabem
    // em uma linha no mobile/tablet — em vez de estourar a largura, refluem em
    // linhas. A ação ocupa linha própria no mobile (`w-full`) e volta à direita
    // a partir de `sm`.
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {/* Voltar em `borda-controle` (JET-102): único controle ícone-só do
          header. Sem rótulo, o alvo de 32px é a CAIXA, não a seta — e em
          `gray-200` (1.26:1) a caixa some sobre o branco. É 1 elemento por
          tela, então escurecer não adiciona peso visual nenhum. */}
      <Button
        variant="outline"
        size="icon"
        aria-label={backLabel}
        className="h-8 w-8 shrink-0 border-borda-controle pointer-coarse:h-10 pointer-coarse:w-10"
        onClick={onBack}
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
      </Button>
      <h2 className="min-w-0 break-words text-base font-bold text-preto">{title}</h2>
      {titleAdornment}
      {status && <StatusBadge label={status.label} variant={status.variant} />}
      {action && <div className="w-full sm:ml-auto sm:w-auto">{action}</div>}
    </div>
  );
}
