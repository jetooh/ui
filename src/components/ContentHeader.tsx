// Header de topo de página canônico (casca): ícone em caixa roxa + "Módulo ·
// Detalhe" + descrição à esquerda; slot de AÇÕES à direita (children). Sticky,
// fundo branco translúcido com blur. Régua = platform. Cada app põe suas ações
// (busca/notificações/avatar/status) via children.
import { ChevronDown, type LucideIcon } from "lucide-react"
import { type ReactNode } from "react"

export interface ContentHeaderProps {
  /** Ícone do módulo — vai na caixa roxa (rounded-xl bg-roxo/10 text-roxo). */
  icon: LucideIcon
  /** Título do módulo (ex.: "Dispositivos"). */
  moduleTitle: string
  /** Segmento após o "·" (ex.: "Detalhe" em páginas de detalhe). */
  subTitle?: string
  /** Linha pequena cinza abaixo do título. */
  description?: string
  /** Substitui TODO o bloco da esquerda (para headers de detalhe customizados). */
  customLeft?: ReactNode
  /** Ações à direita (busca, notificações, avatar, status) — `flex items-center gap-3`. */
  children?: ReactNode
  className?: string
}

export function ContentHeader({
  icon: Icon,
  moduleTitle,
  subTitle,
  description,
  customLeft,
  children,
  className,
}: ContentHeaderProps) {
  return (
    <div
      className={`sticky top-0 z-10 flex items-center justify-between rounded-t-xl border-b border-gray-100 bg-branco/95 px-8 py-4 backdrop-blur-sm ${className ?? ""}`}
    >
      {customLeft ?? (
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-roxo/10 text-roxo">
            <Icon size={20} strokeWidth={1.5} />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h1 className="text-2xl font-bold text-preto">{moduleTitle}</h1>
              {subTitle && (
                <>
                  <ChevronDown size={16} strokeWidth={1.5} className="-rotate-90 text-gray-300" />
                  <span className="text-2xl font-bold text-preto">{subTitle}</span>
                </>
              )}
            </div>
            {description && <p className="mt-0.5 text-[12px] text-gray-500">{description}</p>}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">{children}</div>
    </div>
  )
}
