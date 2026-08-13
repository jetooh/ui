import * as React from 'react';
import { CalendarClock } from 'lucide-react';
import { Input } from './Input';
import { Label } from './Label';
import { cn } from '../lib/cn';

export interface DateTimeFieldProps {
  id: string;
  label?: React.ReactNode;
  /** Valor em ISO 8601 (UTC) ou null/'' (vazio). */
  value: string | null;
  /** Recebe ISO (UTC), ou null quando o campo é limpo. */
  onChange: (isoOrNull: string | null) => void;
  /** Limites opcionais, em ISO (UTC). */
  min?: string | null;
  max?: string | null;
  disabled?: boolean;
  /** Texto de apoio abaixo do campo. */
  hint?: React.ReactNode;
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** ISO (UTC) → 'YYYY-MM-DDTHH:mm' em hora LOCAL (formato do input datetime-local). */
function isoToLocalInput(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 'YYYY-MM-DDTHH:mm' (hora local do usuário) → ISO (UTC). Vazio → null. */
function localInputToIso(local: string): string | null {
  if (!local) return null;
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * DateTimeField — PADRÃO do tema Dashboard2026 para data + hora num ÚNICO campo.
 * Usa `<input type="datetime-local">` nativo (data e hora juntas, com o picker do
 * SO), na régua de form do `@jetooh/ui` (mesmo estilo do `Input`) + ícone. Na
 * BORDA trabalha em ISO 8601/UTC (`value`/`onChange`) e converte de/para a hora
 * LOCAL do usuário internamente. Use em qualquer app do tema no lugar de pares
 * soltos de data + hora (menos campos, menos erro, toque amigável).
 */
export function DateTimeField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  disabled,
  hint,
  className,
}: DateTimeFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label != null && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <CalendarClock
          size={15}
          strokeWidth={1.75}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <Input
          id={id}
          type="datetime-local"
          value={isoToLocalInput(value)}
          onChange={(e) => onChange(localInputToIso(e.target.value))}
          min={min ? isoToLocalInput(min) : undefined}
          max={max ? isoToLocalInput(max) : undefined}
          disabled={disabled}
          className="pl-9"
        />
      </div>
      {hint != null && <p className="text-[12px] text-gray-500">{hint}</p>}
    </div>
  );
}
