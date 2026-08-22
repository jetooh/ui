import type { ReactNode } from "react"

import { cn } from "../lib/cn"
import { KpiGrid } from "./KpiCard"

export interface KpiHeroPanelProps {
  /** Título curto do painel (ex.: "Visão geral" — opcional, painel funciona sem). */
  title?: string
  /** Ação à direita do título (ex.: seletor de período). */
  action?: ReactNode
  children: ReactNode
  cols?: 3 | 4 | 5
  className?: string
}

// Painel de KPI "hero" — a faixa de destaque acima do conteúdo de uma página de
// detalhe (ex.: topo do device, topo de um relatório). Formaliza um padrão que
// duas telas já reimplementavam à mão (`rounded-2xl bg-gray-50/60 p-4` + KpiGrid
// cru): mesmo painel cinza claro, com o MESMO acento lateral roxo já usado em
// outras faixas de destaque do tema (ex.: "faixa de alcance ao vivo" do devices)
// — não inventa linguagem visual nova, reaproveita a que já existe.
export function KpiHeroPanel({ title, action, children, cols = 4, className }: KpiHeroPanelProps) {
  return (
    <div className={cn("rounded-2xl border-l-[3px] border-l-roxo bg-gray-50/60 p-4", className)}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title && <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</span>}
          {action}
        </div>
      )}
      <KpiGrid cols={cols}>{children}</KpiGrid>
    </div>
  )
}
