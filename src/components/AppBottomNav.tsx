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
    // `min-h-14` + `pb-[env(safe-area-inset-bottom)]`: em telas com home
    // indicator (iPhone) a barra ficava embaixo do gesto do sistema. O respiro
    // extra é devolvido ao conteúdo pelo espaçador do PageFrame.
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex min-h-14 items-stretch justify-around border-t border-gray-200 bg-branco/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden">
      {items.map((item) => {
        const active = activeId === item.id
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            aria-current={active ? "page" : undefined}
            className={cn(
              // `min-w-0 flex-1` + `truncate`: com 5-6 abas em 360px os rótulos
              // dividem a barra por igual em vez de estourá-la.
              "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[10px] transition-all duration-150 [&>span]:max-w-full [&>span]:truncate",
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
