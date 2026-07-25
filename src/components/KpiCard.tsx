// KPI card canônico — fonte única do padrão de card de estatística do painel.
//   Card gap-0 + CardHeader flex-row + label uppercase + valor text-2xl + caixa
//   de ícone h-10 w-10 rounded-lg. Use <KpiGrid> como wrapper (grid responsivo).
import type { ReactNode } from "react"
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react"

import { Card, CardHeader } from "./Card"

export interface KpiCardProps {
  label: string
  value: ReactNode
  icon: LucideIcon
  iconBg?: string // ex.: "bg-roxo/10" (default), "bg-verde/10"
  iconColor?: string // ex.: "text-roxo" (default)
  trend?: string | null
  trendUp?: boolean
  hint?: string
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  iconBg = "bg-roxo/10",
  iconColor = "text-roxo",
  trend,
  trendUp,
  hint,
}: KpiCardProps) {
  return (
    <Card className="gap-0">
      {/* `flex` explícito: o CardHeader base é grid — sem ele o `flex-row` não
          aplica e o ícone cai para baixo do valor (card esticado). */}
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</span>
          <span className="text-2xl font-bold tracking-tight text-preto">{value}</span>
          {trend && (
            <span
              className={`flex items-center gap-1 text-xs font-medium ${trendUp ? "text-verde-dark" : "text-red-600"}`}
            >
              {trendUp ? (
                <ArrowUpRight size={12} strokeWidth={2} />
              ) : (
                <ArrowDownRight size={12} strokeWidth={2} />
              )}
              {trend}
            </span>
          )}
          {hint && <span className="text-xs text-gray-500">{hint}</span>}
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}
        >
          <Icon size={20} strokeWidth={1.5} />
        </div>
      </CardHeader>
    </Card>
  )
}

// Grid responsivo padrão dos KPIs (2 col no mobile; `cols` no desktop, default 4).
const LG_COLS: Record<3 | 4 | 5, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
}

export function KpiGrid({
  children,
  className,
  cols = 4,
}: {
  children: ReactNode
  className?: string
  cols?: 3 | 4 | 5
}) {
  return (
    <div className={`grid grid-cols-2 gap-2.5 sm:gap-4 ${LG_COLS[cols]} ${className ?? ""}`}>
      {children}
    </div>
  )
}
