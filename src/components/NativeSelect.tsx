// NativeSelect — <select> NATIVO estilizado com o visual do Select (Radix) do DS.
//
// Por que existe além do `Select` (Radix): formulários com placeholder
// (`<option value="">Selecionar</option>`) e o padrão nativo (teclado/mobile).
// O `SelectItem` do Radix PROÍBE value="" — então telas de formulário/wizard usam
// este NativeSelect, que preserva a semântica nativa mas com a MESMA aparência
// (borda/raio/foco/altura/chevron) do trigger canônico. Fonte única do "campo
// select estilizado" do tema.
import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '../lib/cn';

export interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Classe extra no wrapper (posicionamento/margem). */
  wrapperClassName?: string;
}

// Mesmas classes do SelectTrigger (Select.tsx) + `appearance-none` e `pr-9`
// para o chevron não sobrepor o texto.
export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, wrapperClassName, children, ...props }, ref) => (
    <div className={cn('relative', wrapperClassName)}>
      <select
        ref={ref}
        className={cn(
          // Mesmo tratamento de toque do Input: 40px de alvo e fonte 16px
          // (evita o zoom automático do Safari iOS ao focar o campo).
          'flex w-full appearance-none items-center rounded-lg border border-borda-controle bg-branco px-3 py-2 pr-9 text-[14px] text-preto outline-hidden transition-colors focus:border-roxo focus:ring-1 focus:ring-roxo/30 disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:min-h-10 pointer-coarse:text-[16px]',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 opacity-50" />
    </div>
  ),
);
NativeSelect.displayName = 'NativeSelect';
