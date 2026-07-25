// Frame do body canônico (a "casca" do esqueleto de página): fundo cinza +
// skip-link + rail + [extras] + card branca com respiro + header sticky +
// região <main> com scroll + rodapé. Slots por prop; margens/respiro e ids
// ficam por app (passados via props) porque variam (submenu, mobile). Régua =
// platform AppShell / devices Layout.
import { type ReactNode } from "react"

import { cn } from "../lib/cn"

export interface PageFrameProps {
  /** Rail de navegação (AppRail). */
  rail: ReactNode
  /** Header de topo do mobile. */
  mobileHeader?: ReactNode
  /** Slots extras fora do fluxo (sidebar secundária, overlays, lightboxes). */
  extras?: ReactNode
  /** Header sticky de conteúdo (ContentHeader) — envolto em sticky + hidden lg:block. */
  header?: ReactNode
  /** Título de página no mobile (h1). */
  mobileTitle?: ReactNode
  /** Rodapé (dentro do scroll, ao fim do conteúdo). */
  footer?: ReactNode
  /** Barra de navegação inferior do mobile. */
  mobileBottomNav?: ReactNode
  children: ReactNode
  /** id da região <main> = alvo do skip-link (ex.: "conteudo" | "main-content"). */
  mainId: string
  /** Classes do respiro/margem da área de conteúdo (variam por app: submenu, ml do rail). */
  contentAreaClassName?: string
  /** Página full-bleed (mapa etc.): sem scroll, card com overflow-hidden. */
  fullBleed?: boolean
  /** key do bloco de conteúdo (reinicia o animate-fade-in-up ao trocar de página). */
  contentKey?: string
}

export function PageFrame({
  rail,
  mobileHeader,
  extras,
  header,
  mobileTitle,
  footer,
  mobileBottomNav,
  children,
  mainId,
  contentAreaClassName,
  fullBleed,
  contentKey,
}: PageFrameProps) {
  return (
    <div className="h-screen overflow-hidden bg-page-bg">
      <a
        href={`#${mainId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[10001] focus:rounded-lg focus:bg-roxo focus:px-4 focus:py-2 focus:text-[13px] focus:font-semibold focus:text-branco"
      >
        Pular para o conteúdo
      </a>
      {mobileHeader}
      {rail}
      {extras}

      <div className={cn("flex h-screen flex-col", contentAreaClassName)}>
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col bg-branco lg:rounded-xl lg:border lg:border-gray-200",
            fullBleed && "overflow-hidden",
          )}
        >
          {header && <div className="sticky top-0 z-10 hidden lg:block">{header}</div>}
          {mobileTitle && <div className="block px-4 pb-1 pt-3 lg:hidden">{mobileTitle}</div>}

          <div
            role="main"
            id={mainId}
            className={cn("min-h-0 flex-1", !fullBleed && "content-scroll overflow-y-auto")}
          >
            <div className={cn("flex flex-col", fullBleed ? "h-full" : "min-h-full")}>
              <div key={contentKey} className="min-h-0 flex-1 animate-fade-in-up">
                {children}
              </div>
              {footer}
            </div>
          </div>
        </div>
      </div>

      {mobileBottomNav}
    </div>
  )
}
