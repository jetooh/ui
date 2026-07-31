// Sidebar secundária canônica do ecossistema (o "sub menu" da casca): aside fixo
// à direita do rail (78px) com as SEÇÕES do domínio/módulo ativo. Estrutura,
// estilo e a11y ÚNICOS; cada app passa SEUS dados (seções/itens), o item ativo e
// como navegar (router-agnóstico: botão + onNavigate(id)).
//
// O que varia por app entra por prop/slot, nunca por cópia:
//  • `sections`   — a árvore seção → itens (com ícone e badge opcional).
//  • `footer`     — widgets contextuais (ex.: KPIs de "Informações" do platform).
//  • `onCollapse` — botão "Recolher" (só o platform tem hoje).
//  • `hideOnMobile` — `hidden lg:flex` (admin/devices) vs. render no drawer mobile
//                     (platform, que monta rail+sidebar dentro do painel deslizante).
//
// Régua: platform (secondary-sidebar) + admin (aria-current, ativo em roxo suave).
import { memo, type ReactNode } from "react"
import { ChevronLeft, type LucideIcon } from "lucide-react"

import { cn } from "../lib/cn"

export interface SidebarNavItem {
  /** Identificador do item — rota (`/config/roles`) ou chave de página (`settings.team`). */
  id: string
  label: string
  icon: LucideIcon
  /** Contador de notificação (bolinha vermelha à direita). Ausente/0 = sem badge. */
  badge?: number
}

export interface SidebarSection {
  heading: string
  items: SidebarNavItem[]
}

export interface AppSecondarySidebarProps {
  /** Seções do domínio/módulo ativo. Vazio = sidebar não renderiza (null). */
  sections: SidebarSection[]
  activeId: string
  onNavigate: (id: string) => void
  onPrefetch?: (id: string) => void
  /** Widgets contextuais abaixo da navegação (ex.: KPIs do platform). */
  footer?: ReactNode
  /** Quando fornecido, mostra o botão "Recolher" no rodapé do aside. */
  onCollapse?: () => void
  /** Rótulo do botão de recolher. Default: "Recolher". */
  collapseLabel?: string
  /** Esconde no mobile (`hidden lg:flex`). Default: sempre visível. */
  hideOnMobile?: boolean
  className?: string
}

// Geometria da casca (fixa no tema): a sidebar começa depois do rail (78px) e
// tem 220px. As apps deslocam o conteúdo com `lg:ml-[298px]` (78 + 220) quando há
// sidebar e `lg:ml-[78px]` quando não há.
export const AppSecondarySidebar = memo(function AppSecondarySidebar({
  sections,
  activeId,
  onNavigate,
  onPrefetch,
  footer,
  onCollapse,
  collapseLabel = "Recolher",
  hideOnMobile,
  className,
}: AppSecondarySidebarProps) {
  if (sections.length === 0) return null

  return (
    <aside
      className={cn(
        "fixed left-[78px] top-0 z-40 h-full w-[220px] bg-page-bg",
        hideOnMobile ? "hidden lg:flex" : "flex",
        className,
      )}
    >
      <div className="sidebar-scroll flex max-h-full w-full flex-col overflow-y-auto pt-[84px]">
        <nav className="pb-4 pl-6 pr-5">
          {sections.map((section) => (
            <div key={section.heading} className="mb-5">
              <h3 className="mb-2 pl-3 text-[11px] font-bold uppercase tracking-widest text-preto">
                {section.heading}
              </h3>
              <ul className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const isActive = activeId === item.id
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onNavigate(item.id)}
                        onMouseEnter={() => onPrefetch?.(item.id)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-all duration-150",
                          isActive
                            ? "bg-secondary-active-bg font-medium text-secondary-active"
                            : "text-secondary-text hover:text-secondary-text-hover",
                        )}
                      >
                        <item.icon
                          size={15}
                          strokeWidth={1.5}
                          className={isActive ? "text-secondary-active" : "text-gray-500"}
                        />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge != null && item.badge > 0 && (
                          <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                            {item.badge > 9 ? "9+" : item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {footer}

        {onCollapse && (
          <div className="mt-auto border-t border-gray-200/60 py-3 pl-6 pr-5">
            <button
              onClick={onCollapse}
              className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-gray-600"
            >
              <ChevronLeft size={14} strokeWidth={1.5} />
              <span>{collapseLabel}</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  )
})

export interface AppSubNavProps {
  /** Itens (flat) do domínio/módulo ativo. Com 0 ou 1 item a barra não renderiza. */
  items: SidebarNavItem[]
  activeId: string
  onNavigate: (id: string) => void
  className?: string
}

/**
 * Sub-navegação do MOBILE (a mesma "sub menu" da sidebar, em barra horizontal no
 * topo do conteúdo). O bottom-nav mostra só os domínios; aqui os subitens ficam
 * alcançáveis. Some quando o domínio tem 1 rota só.
 */
export const AppSubNav = memo(function AppSubNav({
  items,
  activeId,
  onNavigate,
  className,
}: AppSubNavProps) {
  if (items.length <= 1) return null

  return (
    <div
      className={cn(
        // Scrollbar escondida (a barra nativa cobria o rótulo em telas curtas) e
        // `overscroll-x-contain` para o swipe lateral não navegar a página.
        "sticky top-0 z-10 flex gap-1.5 overflow-x-auto overscroll-x-contain border-b border-gray-200 bg-branco px-4 py-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = activeId === item.id
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              // `min-h-10`: alvo de toque de 40px (era 32) — WCAG 2.5.8.
              "flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] transition-colors",
              isActive
                ? "bg-secondary-active-bg font-medium text-secondary-active"
                : "text-gray-600 hover:text-preto",
            )}
          >
            <item.icon size={14} strokeWidth={1.5} />
            <span>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
})
