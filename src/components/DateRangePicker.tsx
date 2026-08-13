// DateRangePicker canônico (RUL-11) — gatilho compacto (ícone + preset +
// intervalo + chevron) que abre um LIGHTBOX central (RUL-10, portal no body)
// com Predefinidos (hoje/ontem/semana/mês/trimestre/ano), Personalizado (De/Até),
// "Comparar com" (período anterior / ano anterior) e Atualizar. Fonte única:
// portado do platform (`src/components/ui/date-range-picker.tsx`), MESMA API e
// aparência. Substitui os seletores de data locais dos apps.
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Calendar, CalendarDays, CalendarCheck, CalendarClock, Sun, History, ChevronDown, X, type LucideIcon } from "lucide-react"

export type Compare = "period" | "year"
export interface RangeValue {
  preset: string // id do preset ou "custom"
  from: string // ISO yyyy-mm-dd
  to: string // ISO yyyy-mm-dd
  compare: Compare
}

export const PRESETS: { id: string; label: string }[] = [
  { id: "today", label: "Hoje" },
  { id: "yesterday", label: "Ontem" },
  { id: "week_to_date", label: "Semana até hoje" },
  { id: "last_week", label: "Semana passada" },
  { id: "month_to_date", label: "Mês até hoje" },
  { id: "last_month", label: "Mês passado" },
  { id: "quarter_to_date", label: "Trimestre até hoje" },
  { id: "last_quarter", label: "Trimestre passado" },
  { id: "year_to_date", label: "Ano até hoje" },
  { id: "last_year", label: "Ano passado" },
]

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

export function computePreset(id: string): { from: string; to: string } {
  const now = new Date()
  const y = now.getFullYear(), m = now.getMonth()
  switch (id) {
    case "today": return { from: iso(now), to: iso(now) }
    case "yesterday": { const d = new Date(now); d.setDate(d.getDate() - 1); return { from: iso(d), to: iso(d) } }
    case "week_to_date": { const d = new Date(now); const dow = (d.getDay() + 6) % 7; d.setDate(d.getDate() - dow); return { from: iso(d), to: iso(now) } }
    case "last_week": { const mon = new Date(now); const dow = (mon.getDay() + 6) % 7; mon.setDate(mon.getDate() - dow - 7); const sun = new Date(mon); sun.setDate(mon.getDate() + 6); return { from: iso(mon), to: iso(sun) } }
    case "month_to_date": return { from: iso(new Date(y, m, 1)), to: iso(now) }
    case "last_month": return { from: iso(new Date(y, m - 1, 1)), to: iso(new Date(y, m, 0)) }
    case "quarter_to_date": { const qs = Math.floor(m / 3) * 3; return { from: iso(new Date(y, qs, 1)), to: iso(now) } }
    case "last_quarter": { const qs = Math.floor(m / 3) * 3 - 3; return { from: iso(new Date(y, qs, 1)), to: iso(new Date(y, qs + 3, 0)) } }
    case "year_to_date": return { from: iso(new Date(y, 0, 1)), to: iso(now) }
    case "last_year": return { from: iso(new Date(y - 1, 0, 1)), to: iso(new Date(y - 1, 11, 31)) }
    default: return { from: iso(new Date(y, m, 1)), to: iso(now) }
  }
}

export function comparisonRange(from: string, to: string, compare: Compare): { from: string; to: string } {
  const f = new Date(from + "T00:00:00"), t = new Date(to + "T00:00:00")
  if (compare === "year") {
    const f2 = new Date(f); f2.setFullYear(f.getFullYear() - 1)
    const t2 = new Date(t); t2.setFullYear(t.getFullYear() - 1)
    return { from: iso(f2), to: iso(t2) }
  }
  const days = Math.round((t.getTime() - f.getTime()) / 86_400_000) + 1
  const t2 = new Date(f); t2.setDate(f.getDate() - 1)
  const f2 = new Date(t2); f2.setDate(t2.getDate() - (days - 1))
  return { from: iso(f2), to: iso(t2) }
}

export function defaultRange(): RangeValue {
  const { from, to } = computePreset("month_to_date")
  return { preset: "month_to_date", from, to, compare: "year" }
}

function fmtRange(from: string, to: string): string {
  if (!from || !to) return "—"
  const f = new Date(from + "T00:00:00"), t = new Date(to + "T00:00:00")
  const d = (x: Date, withYear: boolean) => x.toLocaleDateString("pt-BR", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}) })
  return `${d(f, f.getFullYear() !== t.getFullYear())} – ${d(t, true)}`
}

const PRESET_ICONS: Record<string, LucideIcon> = {
  today: Sun, yesterday: History,
  week_to_date: CalendarDays, last_week: CalendarDays,
  month_to_date: Calendar, last_month: Calendar,
  quarter_to_date: CalendarClock, last_quarter: CalendarClock,
  year_to_date: CalendarCheck, last_year: CalendarCheck,
}

const presetLabel = (id: string) => PRESETS.find((p) => p.id === id)?.label ?? "Personalizado"
const compareLabel = (c: Compare) => (c === "year" ? "Ano anterior" : "Período anterior")

export interface DateRangePickerProps {
  value: RangeValue
  onApply: (v: RangeValue) => void
}

export function DateRangePicker({ value, onApply }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<"presets" | "custom">(value.preset === "custom" ? "custom" : "presets")
  const [draft, setDraft] = useState<RangeValue>(value)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    if (open) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  const openPicker = () => { setDraft(value); setTab(value.preset === "custom" ? "custom" : "presets"); setOpen(true) }
  const pickPreset = (id: string) => { const { from, to } = computePreset(id); setDraft((d) => ({ ...d, preset: id, from, to })) }
  const apply = () => { onApply(draft); setOpen(false) }

  const comp = comparisonRange(value.from, value.to, value.compare)
  const draftComp = comparisonRange(draft.from, draft.to, draft.compare)

  return (
    <div className="flex justify-start">
      <button
        onClick={openPicker}
        title={`vs. ${compareLabel(value.compare)} (${fmtRange(comp.from, comp.to)})`}
        // `max-w-full` + `truncate` nos rótulos: em 360px o gatilho (preset +
        // intervalo por extenso) estourava a largura da página.
        className="inline-flex max-w-full items-center gap-2 rounded-lg border border-borda-controle bg-branco px-3 py-1.5 text-[13px] text-gray-600 transition-colors hover:border-roxo hover:text-preto pointer-coarse:min-h-10"
      >
        <Calendar size={14} strokeWidth={1.5} className="shrink-0 text-gray-500" />
        <span className="truncate font-medium text-preto">{presetLabel(value.preset)}</span>
        <span className="truncate text-gray-500">({fmtRange(value.from, value.to)})</span>
        <ChevronDown size={14} className="shrink-0 text-gray-500" />
      </button>

      {/* Lightbox central — portal no body p/ cobrir a PÁGINA INTEIRA (escapa de
          ancestrais com transform/overflow que limitariam o fixed). */}
      {open && createPortal((
        // Mesma lição do Modal: o card é limitado a `100dvh - 2rem` e ROLA por
        // dentro. Antes, num celular (360x640) o lightbox era mais alto que a
        // tela e as datas / o botão "Atualizar" ficavam cortados e inalcançáveis.
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-preto/40 p-4" onClick={() => setOpen(false)}>
          <div
            className="max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto overscroll-contain rounded-2xl bg-branco shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <p className="flex items-center gap-2 text-[15px] font-semibold text-preto"><Calendar size={18} strokeWidth={1.5} className="text-roxo" /> Selecione um período</p>
              <button onClick={() => setOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-600">
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* tabs */}
            <div className="grid grid-cols-2 border-b border-gray-100">
              {(["presets", "custom"] as const).map((tb) => (
                <button key={tb} onClick={() => setTab(tb)}
                  className={`flex items-center justify-center gap-1.5 py-3.5 text-[14px] font-medium ${tab === tb ? "border-b-2 border-roxo text-roxo" : "text-gray-500 hover:text-preto"}`}>
                  {tb === "presets" ? <CalendarCheck size={15} strokeWidth={1.5} /> : <Calendar size={15} strokeWidth={1.5} />}
                  {tb === "presets" ? "Predefinidos" : "Personalizado"}
                </button>
              ))}
            </div>

            {/* corpo — mesma altura nas duas abas; custom centralizado */}
            {tab === "presets" ? (
              // 1 coluna em telas estreitas (2 colunas de ~150px cortavam
              // rótulos como "Trimestre passado"); `min-h` só a partir de sm.
              // EXCEÇÃO REGISTRADA (JET-102, decisão de design): os cartões de
              // opção — estes e os de "Comparar com" abaixo — ficam em
              // `gray-200`. Cada cartão tem ícone (gray-500, 4.83:1) e rótulo
              // (gray-600, 7.56:1): é o RÓTULO que identifica o controle, então
              // a borda não é informação exigida pela WCAG 1.4.11. E o estado
              // selecionado é `border-roxo` + `bg-roxo/5` + peso — escurecer as
              // bordas não-selecionadas encolheria justamente o contraste entre
              // selecionado e não-selecionado, que É exigido pela 1.4.11.
              // Reavaliar só se o cartão perder o rótulo de texto.
              <div className="grid grid-cols-1 content-start gap-2.5 p-5 sm:min-h-[320px] sm:grid-cols-2">
                {PRESETS.map((p) => {
                  const Ic = PRESET_ICONS[p.id] ?? Calendar
                  const on = draft.preset === p.id
                  return (
                    <button key={p.id} onClick={() => pickPreset(p.id)}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-[14px] transition-colors ${on ? "border-roxo bg-roxo/5 font-semibold text-roxo" : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}>
                      <Ic size={18} strokeWidth={1.5} className={on ? "text-roxo" : "text-gray-500"} />
                      {p.label}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col justify-center gap-4 p-6 sm:min-h-[320px]">
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-gray-500">
                    <CalendarDays size={16} strokeWidth={1.5} className="text-roxo" /> Data inicial
                  </span>
                  <input type="date" value={draft.from} max={draft.to || undefined}
                    onChange={(e) => setDraft((d) => ({ ...d, preset: "custom", from: e.target.value }))}
                    className="h-14 w-full rounded-xl border border-borda-controle px-4 text-[18px] font-bold text-preto focus:border-roxo focus:outline-none focus:ring-2 focus:ring-roxo/20" />
                </label>
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-gray-500">
                    <CalendarCheck size={16} strokeWidth={1.5} className="text-roxo" /> Data final
                  </span>
                  <input type="date" value={draft.to} min={draft.from || undefined}
                    onChange={(e) => setDraft((d) => ({ ...d, preset: "custom", to: e.target.value }))}
                    className="h-14 w-full rounded-xl border border-borda-controle px-4 text-[18px] font-bold text-preto focus:border-roxo focus:outline-none focus:ring-2 focus:ring-roxo/20" />
                </label>
                <p className="w-full rounded-xl bg-roxo/5 px-4 py-3.5 text-center text-[14px] font-semibold text-roxo">
                  {draft.from && draft.to ? fmtRange(draft.from, draft.to) : "Selecione as duas datas"}
                </p>
              </div>
            )}

            {/* comparar com */}
            <p className="flex items-center gap-1.5 border-t border-gray-100 px-6 pt-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500"><History size={13} strokeWidth={1.5} /> Comparar com</p>
            <div className="grid grid-cols-1 gap-2.5 px-5 py-3 sm:grid-cols-2">
              {(["period", "year"] as const).map((c) => {
                const on = draft.compare === c
                return (
                  <button key={c} onClick={() => setDraft((d) => ({ ...d, compare: c }))}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-[14px] transition-colors ${on ? "border-roxo bg-roxo/5 font-semibold text-roxo" : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}>
                    {c === "year" ? <CalendarCheck size={17} strokeWidth={1.5} className={on ? "text-roxo" : "text-gray-500"} /> : <History size={17} strokeWidth={1.5} className={on ? "text-roxo" : "text-gray-500"} />}
                    {compareLabel(c)}
                  </button>
                )
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-6 py-4">
              <span className="min-w-0 text-[12px] text-gray-500">
                {fmtRange(draft.from, draft.to)} <span className="text-gray-300">·</span> vs. {fmtRange(draftComp.from, draftComp.to)}
              </span>
              <button onClick={apply} className="shrink-0 rounded-lg bg-roxo px-6 py-2.5 text-[13px] font-semibold text-branco hover:bg-roxo-hover">Atualizar</button>
            </div>
          </div>
        </div>
      ), document.body)}
    </div>
  )
}
