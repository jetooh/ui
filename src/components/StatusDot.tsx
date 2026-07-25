// Indicador de status (bolinha colorida com pulso opcional) — padrão duplicado
// inline nos apps (online/offline/pareando, "ao vivo"). A LÓGICA de cor/pulse
// fica no app (cada um tem seu enum de status); aqui unifica só o markup.
//   <StatusDot color="bg-verde" pulse />            // online
//   <StatusDot color="bg-red-400" />                // offline (sem pulso)
//   <StatusDot color="bg-verde" pulse size="sm" />  // "ao vivo"
import { cn } from "../lib/cn"

const SIZES = { sm: "h-1.5 w-1.5", md: "h-2 w-2", lg: "h-2.5 w-2.5" } as const

export interface StatusDotProps {
  /** Classe de cor de fundo, ex.: "bg-verde", "bg-red-400", "bg-roxo". */
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
