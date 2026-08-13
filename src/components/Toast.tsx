// Toast CANÔNICO do ecossistema — superset das duas APIs históricas, SEM
// dependência externa (nem Radix). Régua visual = platform (card branco + ícone
// colorido por tipo). Renderiza via portal no body.
//
// Duas formas de disparo, ambas suportadas (nenhum call-site precisa mudar):
//   • imperativa (platform):  toast.success("Salvo")  toast.error("Falhou")  toast.info("...")
//   • objeto (devices/shadcn): toast({ title, description, variant })
//     variant: 'destructive' → erro (vermelho) · 'success' → verde · 'default'/ausente → neutro
// E o hook useToast() → { toasts, toast, dismiss } para quem consome o estado.
import * as React from "react"
import { createPortal } from "react-dom"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"

import { cn } from "../lib/cn"

type ToastVariant = "default" | "destructive" | "success" | "info"
export interface ToastOptions {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: ToastVariant | "outline"
}
interface ToastItem {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant: ToastVariant
}

const LIMIT = 5
const DURATION = 4500

let counter = 0
let items: ToastItem[] = []
const listeners = new Set<(items: ToastItem[]) => void>()
const emit = () => {
  for (const l of listeners) l(items)
}

function dismiss(id: string) {
  items = items.filter((t) => t.id !== id)
  emit()
}

function normalizeVariant(v?: ToastOptions["variant"]): ToastVariant {
  if (v === "destructive" || v === "success" || v === "info") return v
  return "default"
}

function baseToast(opts: ToastOptions) {
  const id = String(++counter)
  const item: ToastItem = {
    id,
    title: opts.title,
    description: opts.description,
    variant: normalizeVariant(opts.variant),
  }
  items = [item, ...items].slice(0, LIMIT)
  emit()
  const timer = setTimeout(() => dismiss(id), DURATION)
  return {
    id,
    dismiss: () => {
      clearTimeout(timer)
      dismiss(id)
    },
    update: (next: ToastOptions) => {
      items = items.map((t) => (t.id === id ? { ...t, ...next, variant: normalizeVariant(next.variant) } : t))
      emit()
    },
  }
}

export const toast = Object.assign(baseToast, {
  success: (message: React.ReactNode) => baseToast({ title: message, variant: "success" }),
  error: (message: React.ReactNode) => baseToast({ title: message, variant: "destructive" }),
  info: (message: React.ReactNode) => baseToast({ title: message, variant: "info" }),
})

export function useToast() {
  const [list, setList] = React.useState<ToastItem[]>(items)
  React.useEffect(() => {
    listeners.add(setList)
    setList(items)
    return () => {
      listeners.delete(setList)
    }
  }, [])
  return {
    toasts: list,
    toast,
    dismiss: (id?: string) => {
      if (id) dismiss(id)
      else {
        items = []
        emit()
      }
    },
  }
}

// D8 (JET-120): o ícone é o que distingue sucesso de erro/neutro — conteúdo
// não-textual que carrega informação, mínimo 3:1 por WCAG 1.4.11. O grau de
// preenchimento `verde` media 1.92:1 sobre o card branco do Toast; `verde-dark`
// é o grau de LEGIBILIDADE do verde e mede 5.48:1 no claro / 9.29:1 no escuro.
// Os outros dois ícones já passavam sobre o card nos dois modos e não mudam:
// `status-critico` 4.83 claro / 3.70 escuro, `roxo` 4.73 / 3.78.
const ICON: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 size={16} strokeWidth={1.75} className="shrink-0 text-verde-dark" />,
  destructive: <AlertCircle size={16} strokeWidth={1.75} className="shrink-0 text-status-critico" />,
  info: <Info size={16} strokeWidth={1.75} className="shrink-0 text-roxo" />,
  default: null,
}

export function Toaster() {
  const [list, setList] = React.useState<ToastItem[]>([])
  React.useEffect(() => {
    listeners.add(setList)
    setList(items)
    return () => {
      listeners.delete(setList)
    }
  }, [])

  if (typeof document === "undefined") return null

  return createPortal(
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[10000] flex max-w-[calc(100vw-2rem)] flex-col gap-2"
      role="region"
      aria-live="polite"
      aria-label="Notificações"
    >
      {list.map((t) => (
        <div
          key={t.id}
          role={t.variant === "destructive" ? "alert" : "status"}
          className="pointer-events-auto flex w-full items-start gap-2 rounded-lg border border-gray-200 bg-branco px-3.5 py-2.5 text-[13px] text-preto shadow-lg"
        >
          {ICON[t.variant]}
          <div className={cn("flex min-w-0 flex-col gap-0.5", !t.description && "justify-center")}>
            {t.title && <span className="max-w-xs font-medium leading-snug">{t.title}</span>}
            {t.description && <span className="max-w-xs text-xs leading-snug text-gray-500">{t.description}</span>}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            aria-label="Fechar notificação"
            className="ml-1 shrink-0 text-gray-500 transition-colors hover:text-preto"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>
      ))}
    </div>,
    document.body
  )
}
