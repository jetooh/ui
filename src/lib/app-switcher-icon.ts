import { LayoutGrid, Monitor, Presentation, LayoutTemplate, ShieldCheck, UserRound, type LucideIcon } from "lucide-react"

// Mapeia `jet_apps.icon` (mesmo campo que a api já retorna em /me/apps) para um
// ícone lucide, para a seção "Trocar de app" do UserMenu. Espelha o mapa local
// de `my` (que fica fora do pacote por não consumir `@jetooh/ui`) — cobrir todo
// ícone semeado em `jet_apps`; sem entrada aqui cai no genérico.
const ICONS: Record<string, LucideIcon> = {
  monitor: Monitor,
  presentation: Presentation,
  "layout-template": LayoutTemplate,
  "user-round": UserRound,
  shield: ShieldCheck,
}

export function appSwitcherIcon(name: string | null): LucideIcon {
  return (name && ICONS[name]) || LayoutGrid
}
