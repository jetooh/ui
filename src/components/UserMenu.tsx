// Menu do usuário canônico: botão de avatar + popover com "Sair" (fecha ao tocar
// fora). Lógica/estilo ÚNICOS; cada app passa os dados (nome/avatar/iniciais) e o
// callback de logout. Régua = platform (mobile-header / header desktop).
import { useState } from "react"
import { LogOut } from "lucide-react"

import { Avatar, AvatarImage, AvatarFallback } from "./Avatar"

export interface UserMenuProps {
  name?: string
  avatarUrl?: string
  /** Iniciais para o fallback do avatar (ex.: "AJ"). */
  initials: string
  onLogout: () => void
}

export function UserMenu({ name, avatarUrl, initials, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative ml-1">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menu do usuário"
      >
        <Avatar className="h-8 w-8 border border-gray-200">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} className="object-cover" />}
          <AvatarFallback className="bg-roxo-forte text-xs font-semibold text-branco">{initials}</AvatarFallback>
        </Avatar>
      </button>

      {open && (
        <>
          {/* Backdrop para fechar ao tocar fora. */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
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
        </>
      )}
    </div>
  )
}
