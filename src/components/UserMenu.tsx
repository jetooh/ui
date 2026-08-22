// Menu do usuário canônico: botão de avatar + popover (fecha ao tocar fora).
// Lógica/estilo ÚNICOS; cada app passa os dados (nome/email/avatar/iniciais) e os
// callbacks. Régua = platform (content-header) / devices (AppHeader).
//
// Dois modos, mesma API:
//  • SIMPLES (retrocompat mobile): só nome/iniciais/onLogout → popover "Sair".
//  • RICO (header desktop): passe `email`, `items`, `accountHref` e/ou
//    `onToggleTheme` → popover com header (nome+email), itens, toggle de tema e
//    "Sair" — igual ao menu do avatar do platform/devices.
import { useEffect, useRef, useState } from "react"
import { LogOut, User, Moon, Sun, Check, type LucideIcon } from "lucide-react"

import { Avatar, AvatarImage, AvatarFallback } from "./Avatar"
import { Switch } from "./Switch"
import { Skeleton } from "./Skeleton"
import { appSwitcherIcon } from "../lib/app-switcher-icon"
import { isSafeAppUrl } from "../lib/safe-app-url"

export interface UserMenuItem {
  label: string
  icon?: LucideIcon
  /** Ação ao clicar (fecha o menu antes de executar). */
  onClick?: () => void
  /** Alternativa a onClick: navega para um href (link). */
  href?: string
}

/** Um app do ecossistema, para a seção "Trocar de app" (formato de `GET /me/apps`). */
export interface UserMenuApp {
  slug: string
  name: string
  icon: string | null
  url: string
}

export interface UserMenuProps {
  name?: string
  email?: string
  avatarUrl?: string
  /** Iniciais para o fallback do avatar (ex.: "AJ"). */
  initials: string
  /** Itens extras entre o header e o "Sair" (ex.: Minha Conta, Configurações). */
  items?: UserMenuItem[]
  /** Atalho: adiciona um item "Minha Conta" (ícone User) que navega para o href. */
  accountHref?: string
  /**
   * Apps para a seção "Trocar de app" (entre o cabeçalho e os itens canônicos).
   * Ausente, vazio, ou só o app atual (nada para trocar) = seção não aparece —
   * retrocompatível, nenhuma app quebra ao repinar o pacote antes de adotar isto.
   */
  apps?: UserMenuApp[]
  /** Slug do app atual — destaca a linha correspondente e a deixa não-clicável. */
  currentAppSlug?: string
  /** true enquanto `apps` ainda está carregando — mostra skeleton em vez de nada. */
  appsLoading?: boolean
  /** Tema atual escuro? Quando `onToggleTheme` existe, mostra o toggle de tema. */
  isDark?: boolean
  /** Alterna o tema claro/escuro. Se ausente, o toggle de tema não aparece. */
  onToggleTheme?: () => void
  onLogout: () => void
  /** Tamanho do avatar: "sm" (h-8, mobile, default) ou "md" (h-10, header). */
  avatarSize?: "sm" | "md"
}

function openApp(url: string) {
  if (!isSafeAppUrl(url)) { console.error("[UserMenu] host fora do ecossistema, redirect bloqueado:", url); return }
  window.location.href = url
}

export function UserMenu({
  name,
  email,
  avatarUrl,
  initials,
  items,
  accountHref,
  apps,
  currentAppSlug,
  appsLoading,
  isDark,
  onToggleTheme,
  onLogout,
  avatarSize = "sm",
}: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Fecha ao tocar/clicar fora e no Escape — via listener no `document`, não um
  // backdrop `fixed inset-0`. O backdrop falhava sempre que algum elemento da
  // casca (rail, sidebar) tinha z-index >= o dele (ex.: AppRail é z-50, o
  // backdrop era z-40): o clique era capturado por esse elemento antes de
  // chegar ao backdrop, e o menu nunca fechava (JET-264). `pointerdown` no
  // `document` não depende de stacking context — dispara pelo bubbling, seja
  // qual for o elemento clicado.
  useEffect(() => {
    if (!open) return

    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  // Itens efetivos: "Minha Conta" (accountHref) na frente dos itens passados.
  const menuItems: UserMenuItem[] = [
    ...(accountHref ? [{ label: "Minha Conta", icon: User, href: accountHref }] : []),
    ...(items ?? []),
  ]

  // Nada para trocar (sem apps, ou só o app atual): seção não aparece — mesmo
  // comportamento de antes de existir a prop `apps`.
  const switchableApps = apps ?? []
  const hasAppsToSwitch = switchableApps.length > 1 || (switchableApps.length === 1 && switchableApps[0].slug !== currentAppSlug)
  const showAppSwitcher = Boolean(appsLoading || hasAppsToSwitch)

  // Modo rico: quando há header (email), itens, switcher de apps ou toggle de tema.
  const rich = Boolean(email || menuItems.length > 0 || showAppSwitcher || onToggleTheme)
  const avatarCls = avatarSize === "md" ? "h-10 w-10" : "h-8 w-8"

  const runItem = (it: UserMenuItem) => {
    setOpen(false)
    if (it.onClick) it.onClick()
    else if (it.href) window.location.href = it.href
  }

  const runApp = (app: UserMenuApp) => {
    setOpen(false)
    openApp(app.url)
  }

  return (
    <div className="relative ml-1" ref={containerRef}>
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menu do usuário"
        // Alvo de toque de 40px em telas de toque, sem mudar o tamanho visual do
        // avatar (h-8 = 32px) — WCAG 2.5.8 Target Size (Minimum).
        className="flex items-center justify-center pointer-coarse:min-h-10 pointer-coarse:min-w-10"
      >
        <Avatar className={`${avatarCls} border border-gray-200`}>
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} className="object-cover" />}
          <AvatarFallback className="bg-roxo text-xs font-semibold text-branco">{initials}</AvatarFallback>
        </Avatar>
      </button>

      {open && (
        rich ? (
            <div
              role="menu"
              className="absolute right-0 top-10 z-50 max-h-[80vh] w-60 overflow-x-hidden overflow-y-auto rounded-xl border border-gray-200 bg-branco py-1.5 shadow-lg"
            >
              {(name || email) && (
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-medium text-preto">{name || "—"}</p>
                  {email && <p className="text-xs text-gray-500">{email}</p>}
                </div>
              )}

              {showAppSwitcher && (
                <div className="border-b border-gray-100 py-1.5">
                  <p className="px-4 pb-1 pt-0.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Trocar de app
                  </p>
                  {appsLoading ? (
                    <div className="space-y-1.5 px-4 py-1" aria-hidden="true">
                      <Skeleton className="h-8 w-full rounded-lg" />
                      <Skeleton className="h-8 w-full rounded-lg" />
                    </div>
                  ) : (
                    switchableApps.map((app) => {
                      const Icon = appSwitcherIcon(app.icon)
                      const isCurrent = app.slug === currentAppSlug
                      return isCurrent ? (
                        <div
                          key={app.slug}
                          role="menuitem"
                          aria-current="true"
                          aria-disabled="true"
                          className="flex w-full items-center gap-3 rounded-lg bg-roxo/5 px-4 py-2 text-[13px] font-medium text-roxo"
                        >
                          <Icon size={15} strokeWidth={1.5} />
                          <span className="flex-1 text-left">{app.name}</span>
                          <Check size={15} strokeWidth={2} />
                        </div>
                      ) : (
                        <button
                          key={app.slug}
                          role="menuitem"
                          onClick={() => runApp(app)}
                          className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-gray-600 transition-colors hover:bg-gray-50 hover:text-preto"
                        >
                          <Icon size={15} strokeWidth={1.5} />
                          {app.name}
                        </button>
                      )
                    })
                  )}
                </div>
              )}

              <div className="py-1.5">
                {menuItems.map((it, i) => {
                  const Icon = it.icon
                  return (
                    <button
                      key={`${it.label}-${i}`}
                      role="menuitem"
                      onClick={() => runItem(it)}
                      className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-gray-600 transition-colors hover:bg-gray-50 hover:text-preto"
                    >
                      {Icon && <Icon size={15} strokeWidth={1.5} />}
                      {it.label}
                    </button>
                  )
                })}

                {onToggleTheme && (
                  <div className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-gray-600">
                    {isDark ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
                    <span className="flex-1 text-left">Tema Escuro</span>
                    <Switch
                      checked={Boolean(isDark)}
                      onCheckedChange={() => onToggleTheme()}
                      size="sm"
                      label="Alternar tema escuro"
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-1.5">
                <button
                  role="menuitem"
                  onClick={() => { setOpen(false); onLogout() }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-gray-600 transition-colors hover:bg-gray-50 hover:text-preto"
                >
                  <LogOut size={15} strokeWidth={1.5} />
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <div
              role="menu"
              className="absolute right-0 top-10 z-50 max-h-[80vh] w-44 overflow-x-hidden overflow-y-auto rounded-xl border border-gray-100 bg-branco py-1.5 shadow-lg"
            >
              <button
                role="menuitem"
                onClick={() => { setOpen(false); onLogout() }}
                className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-gray-600 transition-colors hover:bg-gray-50 hover:text-preto"
              >
                <LogOut size={15} strokeWidth={1.5} />
                Sair
              </button>
            </div>
          )
      )}
    </div>
  )
}
