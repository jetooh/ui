// Empty state canônico — ícone em caixa cinza arredondada + título + descrição +
// CTA roxo opcional. Régua: platform. `description` é opcional (superset).
import { type LucideIcon } from "lucide-react"

import { Button } from "./Button"

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-300">
        <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h3 className="mb-1 text-[15px] font-semibold text-preto">{title}</h3>
      {description && <p className="mb-5 max-w-sm text-[13px] text-gray-400">{description}</p>}
      {actionLabel && onAction && (
        <Button
          size="default"
          className="gap-2 bg-roxo px-5 text-[13px] font-semibold text-branco hover:bg-roxo-hover"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export function SearchEmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-300">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <h3 className="mb-1 text-[14px] font-semibold text-preto">Nenhum resultado encontrado</h3>
      <p className="text-center text-[13px] text-gray-400">
        Nenhum resultado para &quot;{query}&quot;. Tente outro termo.
      </p>
    </div>
  )
}
