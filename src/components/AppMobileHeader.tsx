// Header de topo do mobile (a "casca" do header mobile): barra fixa h-14 com
// logo à esquerda e menu do usuário à direita. Estrutura/estilo ÚNICOS; o que
// varia por app entra por slot: hambúrguer (onMenuToggle) e ações extras
// (busca/sino) via `actions`; o menu do usuário via `userMenu`. Régua = platform.
import { type ReactNode } from "react"
import { Menu } from "lucide-react"

export interface AppMobileHeaderProps {
  /** Se fornecido, mostra o botão de hambúrguer à esquerda do logo. */
  onMenuToggle?: () => void
  logoSrc?: string
  /** Ações extras à esquerda do menu do usuário (busca, sino…). */
  actions?: ReactNode
  /** Menu do usuário (avatar + Sair) — normalmente <UserMenu/>. */
  userMenu: ReactNode
}

export function AppMobileHeader({ onMenuToggle, logoSrc = "/icone.svg", actions, userMenu }: AppMobileHeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-branco px-4 lg:hidden">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            aria-label="Abrir menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        )}
        <img src={logoSrc} alt="JETOOH" width={24} height={24} />
      </div>

      <div className="flex items-center gap-1">
        {actions}
        {userMenu}
      </div>
    </header>
  )
}
