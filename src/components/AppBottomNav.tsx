// Barra de navegação inferior do mobile (a "casca" do bottom-nav). Estrutura/
// estilo/a11y ÚNICOS; cada app passa SUAS abas + a aba ativa + como navegar
// (router-agnóstico: botão + onNavigate(id)). Régua = platform (mobile-bottom-nav).
import { memo } from "react"
import { type LucideIcon } from "lucide-react"

import { cn } from "../lib/cn"

export interface BottomNavItem {
  id: string
  label: string
  icon: LucideIcon
}

export interface AppBottomNavProps {
  items: BottomNavItem[]
  activeId: string
  onNavigate: (id: string) => void
}

export const AppBottomNav = memo(function AppBottomNav({ items, activeId, onNavigate }: AppBottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-14 items-center justify-around border-t border-gray-200 bg-branco/95 backdrop-blur-sm lg:hidden">
      {items.map((item) => {
        const active = activeId === item.id
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] transition-all duration-150",
              active ? "font-semibold text-roxo" : "text-gray-500",
            )}
          >
            <item.icon size={20} strokeWidth={active ? 2 : 1.5} />
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
})
