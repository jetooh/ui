// Bloco de AVATAR + menu do usuário canônico das aplicações do tema (a peça que
// fica à direita do header, no desktop e no mobile). O `UserMenu` já era a casca
// única (popover, avatar, tema, "Sair"); o `AppUserMenu` padroniza a COMPOSIÇÃO —
// quais itens existem, com que rótulo, ícone e em que ordem — para que o avatar
// seja idêntico em platform, admin e devices.
//
// Ordem canônica do menu:
//   [nome + e-mail] · Minha Conta · Configurações · (extras da app) · Tema Escuro · Sair
//
// Cada app passa só os CALLBACKS do que ela tem: sem `onProfile` o item "Minha
// Conta" não aparece (ex.: admin, que é área interna e não tem painel pessoal);
// sem `onSettings` idem. Itens específicos de uma app (ex.: "Idioma" no platform,
// "Voltar ao admin" durante impersonation) entram por `extraItems`, sempre DEPOIS
// dos padrão — nunca substituindo/renomeando os canônicos.
import { Settings, User } from "lucide-react"

import { UserMenu, type UserMenuItem } from "./UserMenu"

/** Rótulos canônicos dos itens padrão — iguais em todas as apps do tema. */
export const USER_MENU_PROFILE_LABEL = "Minha Conta"
export const USER_MENU_SETTINGS_LABEL = "Configurações"

export interface AppUserMenuProps {
  name?: string
  email?: string
  avatarUrl?: string
  /** Iniciais do fallback do avatar (ex.: "AJ"). */
  initials: string
  /** Ação do item padrão "Minha Conta". Ausente = o item não aparece. */
  onProfile?: () => void
  /** Ação do item padrão "Configurações". Ausente = o item não aparece. */
  onSettings?: () => void
  /** Itens específicos da app, sempre depois dos padrão (ex.: Idioma). */
  extraItems?: UserMenuItem[]
  /** Tema atual escuro? Com `onToggleTheme`, mostra o switch de tema. */
  isDark?: boolean
  onToggleTheme?: () => void
  onLogout: () => void
  /** "md" (h-10) no header desktop; "sm" (h-8) no header mobile. Default: "md". */
  avatarSize?: "sm" | "md"
}

export function AppUserMenu({
  name,
  email,
  avatarUrl,
  initials,
  onProfile,
  onSettings,
  extraItems,
  isDark,
  onToggleTheme,
  onLogout,
  avatarSize = "md",
}: AppUserMenuProps) {
  const items: UserMenuItem[] = [
    ...(onProfile ? [{ label: USER_MENU_PROFILE_LABEL, icon: User, onClick: onProfile }] : []),
    ...(onSettings ? [{ label: USER_MENU_SETTINGS_LABEL, icon: Settings, onClick: onSettings }] : []),
    ...(extraItems ?? []),
  ]

  return (
    <UserMenu
      name={name}
      email={email}
      avatarUrl={avatarUrl}
      initials={initials}
      items={items}
      isDark={isDark}
      onToggleTheme={onToggleTheme}
      onLogout={onLogout}
      avatarSize={avatarSize}
    />
  )
}
