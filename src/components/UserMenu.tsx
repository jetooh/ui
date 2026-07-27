// Menu do usuário canônico: botão de avatar + popover (fecha ao tocar fora).
// Lógica/estilo ÚNICOS; cada app passa os dados (nome/email/avatar/iniciais) e os
// callbacks. Régua = platform (content-header) / devices (AppHeader).
//
// Dois modos, mesma API:
//  • SIMPLES (retrocompat mobile): só nome/iniciais/onLogout → popover "Sair".
//  • RICO (header desktop): passe `email`, `items`, `accountHref` e/ou
//    `onToggleTheme` → popover com header (nome+email), itens, toggle de tema e
//    "Sair" — igual ao menu do avatar do platform/devices.
import { useState } from "react"
import { LogOut, User, Moon, Sun, type LucideIcon } from "lucide-react"

import { Avatar, AvatarImage, AvatarFallback } from "./Avatar"
import { Switch } from "./Switch"

export interface UserMenuItem {
  label: string
  icon?: LucideIcon
  /** Ação ao clicar (fecha o menu antes de executar). */
  onClick?: () => void
  /** Alternativa a onClick: navega para um href (link). */
  href?: string
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
  /** Tema atual escuro? Quando `onToggleTheme` existe, mostra o toggle de tema. */
  isDark?: boolean
  /** Alterna o tema claro/escuro. Se ausente, o toggle de tema não aparece. */
  onToggleTheme?: () => void
  onLogout: () => void
  /** Tamanho do avatar: "sm" (h-8, mobile, default) ou "md" (h-10, header). */
  avatarSize?: "sm" | "md"
}

export function UserMenu({
  name,
  email,
  avatarUrl,
  initials,
  items,
  accountHref,
  isDark,
  onToggleTheme,
  onLogout,
  avatarSize = "sm",
}: UserMenuProps) {
  const [open, setOpen] = useState(false)

  // Itens efetivos: "Minha Conta" (accountHref) na frente dos itens passados.
  const menuItems: UserMenuItem[] = [
    ...(accountHref ? [{ label: "Minha Conta", icon: User, href: accountHref }] : []),
    ...(items ?? []),
  ]

  // Modo rico: quando há header (email), itens ou toggle de tema.
  const rich = Boolean(email || menuItems.length > 0 || onToggleTheme)
  const avatarCls = avatarSize === "md" ? "h-10 w-10" : "h-8 w-8"

  const runItem = (it: UserMenuItem) => {
    setOpen(false)
    if (it.onClick) it.onClick()
    else if (it.href) window.location.href = it.href
  }

  return (
    <div className="relative ml-1">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menu do usuário"
      >
        <Avatar className={`${avatarCls} border border-gray-200`}>
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} className="object-cover" />}
          <AvatarFallback className="bg-roxo text-xs font-semibold text-branco">{initials}</AvatarFallback>
        </Avatar>
      </button>

      {open && (
        <>
          {/* Backdrop para fechar ao tocar fora. */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {rich ? (
            <div
              role="menu"
              className="absolute right-0 top-10 z-50 w-60 overflow-hidden rounded-xl border border-gray-200 bg-branco py-1.5 shadow-lg"
            >
              {(name || email) && (
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-medium text-preto">{name || "—"}</p>
                  {email && <p className="text-xs text-gray-500">{email}</p>}
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
              className="absolute right-0 top-10 z-50 w-44 overflow-hidden rounded-xl border border-gray-100 bg-branco py-1.5 shadow-lg"
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
          )}
        </>
      )}
    </div>
  )
}
