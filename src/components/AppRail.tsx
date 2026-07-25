// Rail de navegação canônico do ecossistema (a "casca" do menu lateral).
// Estrutura/estilo/a11y ÚNICOS; cada app passa SEUS itens + o item ativo + como
// navegar (router-agnóstico: botão + onNavigate(id)). Badge de notificação e
// botão de expandir são opcionais. Régua = platform (icon-rail).
import { memo } from "react"
import { ChevronRight, type LucideIcon } from "lucide-react"

import { cn } from "../lib/cn"

export interface RailItem {
  id: string
  label: string
  icon: LucideIcon
  /** Contador de notificação (bolinha vermelha). Ausente/0 = sem badge. */
  badge?: number
}

export interface AppRailProps {
  items: RailItem[]
  /** Itens de baixo (logs/ajuda etc.) — separados do bloco principal. */
  bottomItems?: RailItem[]
  activeId: string
  onNavigate: (id: string) => void
  onPrefetch?: (id: string) => void
  logoSrc?: string
  /** Botão "expandir menu" (quando a sidebar secundária está recolhida). */
  onExpand?: () => void
  /** Esconde no mobile (`hidden lg:flex`). Default: sempre visível. */
  hideOnMobile?: boolean
}

export const AppRail = memo(function AppRail({
  items,
  bottomItems,
  activeId,
  onNavigate,
  onPrefetch,
  logoSrc = "/icone.svg",
  onExpand,
  hideOnMobile,
}: AppRailProps) {
  const renderItem = (item: RailItem) => (
    <button
      key={item.id}
      title={item.label}
      aria-current={activeId === item.id ? "page" : undefined}
      onClick={() => onNavigate(item.id)}
      onMouseEnter={() => onPrefetch?.(item.id)}
      className={cn(
        "group/rail-item relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-150",
        activeId === item.id
          ? "border border-rail-active-border bg-rail-active-bg text-white"
          : "text-[#9CA3AF] hover:bg-rail-icon-hover hover:text-rail-icon-hover-text",
      )}
    >
      <item.icon size={20} strokeWidth={1.5} />
      {item.badge != null && item.badge > 0 && (
        <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-rail-bg">
          {item.badge > 9 ? "9+" : item.badge}
        </span>
      )}
      <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover/rail-item:opacity-100">
        {item.label}
      </span>
    </button>
  )

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-50 h-full w-[78px] flex-col items-center bg-rail-bg py-5",
        hideOnMobile ? "hidden lg:flex" : "flex",
      )}
    >
      {/* Curvas decorativas (canto direito) */}
      <div className="absolute -right-4 top-0 h-4 w-4 bg-rail-bg">
        <div className="h-full w-full rounded-tl-full bg-page-bg" />
      </div>
      <div className="absolute -right-4 bottom-0 h-4 w-4 bg-rail-bg">
        <div className="h-full w-full rounded-bl-full bg-page-bg" />
      </div>

      <div className="mb-6 flex h-10 w-10 items-center justify-center">
        <img src={logoSrc} alt="JETOOH" width={32} height={32} className="h-8 w-8 invert" />
      </div>

      <nav className="flex flex-1 flex-col items-center gap-1">{items.map(renderItem)}</nav>

      {(bottomItems?.length || onExpand) && (
        <div className="flex flex-col items-center gap-1">
          {bottomItems?.map(renderItem)}
          {onExpand && (
            <button
              onClick={onExpand}
              aria-label="Expandir menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-roxo transition-colors hover:bg-white/20"
            >
              <ChevronRight size={18} strokeWidth={2} />
            </button>
          )}
        </div>
      )}
    </div>
  )
})
