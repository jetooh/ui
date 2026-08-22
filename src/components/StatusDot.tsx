// Indicador de status (bolinha colorida com pulso opcional) — padrão duplicado
// inline nos apps (online/offline/pareando, "ao vivo"). A LÓGICA de cor/pulse
// fica no app (cada um tem seu enum de status); aqui unifica só o markup.
//   <StatusDot color="bg-verde-dark" pulse />            // online
//   <StatusDot color="bg-status-critico" />              // offline (sem pulso)
//   <StatusDot color="bg-verde-dark" pulse size="sm" />  // "ao vivo"
//
// D8 (JET-120) — QUAL VERDE. Um dot SOZINHO é a única coisa que carrega o
// estado: conteúdo não-textual, mínimo 3:1 sobre a superfície por WCAG 1.4.11.
// `bg-verde` é o grau de PREENCHIMENTO e reprova no claro (1.92 / 1.75 / 1.63
// sobre branco / page-bg / gray-100); `bg-verde-dark` é o grau de legibilidade
// e passa nos dois modos (5.48 / 4.99 / 4.65 claro, 9.29 / 10.17 / 8.68 escuro).
// A exceção é o dot DENTRO do <StatusBadge>, que fica ao lado do rótulo — ali
// quem identifica o estado é o texto, e o dot segue em `bg-verde`.
import { cn } from "../lib/cn"

const SIZES = { sm: "h-1.5 w-1.5", md: "h-2 w-2", lg: "h-2.5 w-2.5" } as const

export interface StatusDotProps {
  /**
   * Classe de cor de fundo, ex.: "bg-verde-dark", "bg-status-critico", "bg-roxo".
   * Dot SOZINHO precisa de 3:1 sobre a superfície (WCAG 1.4.11) — use o grau de
   * legibilidade (`bg-verde-dark`), não o de preenchimento (`bg-verde`).
   */
  color: string
  /** Anel pulsante (animate-ping) — use para estados "vivos" (online/ao vivo). */
  pulse?: boolean
  size?: keyof typeof SIZES
  /** Extras no wrapper (ex.: "mr-1.5" quando fica antes de um label). */
  className?: string
}

export function StatusDot({ color, pulse = false, size = "md", className }: StatusDotProps) {
  const s = SIZES[size]
  return (
    <span className={cn("relative flex", s, className)}>
      {pulse && (
        <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", color)} />
      )}
      <span className={cn("relative inline-flex rounded-full", s, color)} />
    </span>
  )
}
