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
  // Contador puro (ex.: "163.934" exibições) NUNCA pode quebrar no meio do
  // número — vira ilegível de relance. Default `false`: mantém `break-words`,
  // aceitável para valor composto (ex.: "R$ 3.482.995,00", que tem espaço
  // para quebrar E prefere isso a ser cortado pelo `overflow-hidden` do
  // Card). `true` troca para `whitespace-nowrap` — use em KPIs cujo valor é
  // sempre um único token numérico.
  valueNoWrap?: boolean
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
  valueNoWrap = false,
}: KpiCardProps) {
  return (
    <Card className="gap-0">
      {/* `flex` explícito: o CardHeader base é grid — sem ele o `flex-row` não
          aplica e o ícone cai para baixo do valor (card esticado). */}
      {/* `gap-2` + `min-w-0`: sem `min-w-0` a coluna de texto não encolhe no flex
          e o valor longo (ex.: "R$ 3.482.995,00") era CORTADO pelo
          `overflow-hidden` do Card em telas estreitas — sumia sem scroll nem
          reticências. Com `min-w-0` + `break-words` o valor quebra a linha. */}
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</span>
          {/* `break-words` é a última barreira: se ainda assim não couber (card
              muito estreito num grid de 4-5 colunas), o valor QUEBRA a linha em
              vez de sumir cortado pelo `overflow-hidden` do Card. `valueNoWrap`
              troca para `whitespace-nowrap` (contador puro, nunca quebra o
              número — ver `KpiCardProps.valueNoWrap`). */}
          <span
            className={`${valueNoWrap ? "whitespace-nowrap" : "break-words"} text-2xl font-bold tracking-tight text-preto`}
          >
            {value}
          </span>
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

// Grid responsivo padrão dos KPIs: 1 col no celular, 2 no tablet, `cols` a partir
// de `xl`. O corte final é `xl` (1280) e não `lg` (1024): com a sidebar
// secundária (298px) sobram ~726px em 1024, e 4-5 colunas ali deixam cada card
// com ~120px úteis — valor de moeda quebrava em 3 linhas.
const WIDE_COLS: Record<3 | 4 | 5, string> = {
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
  5: "xl:grid-cols-5",
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
    // 1 coluna abaixo de `sm` (todo celular em retrato): com 2 colunas em 360px
    // sobram ~80px úteis por card e um valor de moeda ("R$ 3.482.995,00") ou
    // quebrava no meio do número ou era cortado pelo `overflow-hidden` do Card.
    // `[&>*]:min-w-0` deixa cada card encolher abaixo do próprio conteúdo (item
    // de grid tem `min-width:auto` por padrão).
    <div className={`grid grid-cols-1 gap-2.5 [&>*]:min-w-0 sm:grid-cols-2 sm:gap-4 ${WIDE_COLS[cols]} ${className ?? ""}`}>
      {children}
    </div>
  )
}
