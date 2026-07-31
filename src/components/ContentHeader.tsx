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
      // Respiro e escala do título encolhem no desktop estreito (1024–1280, onde
      // a sidebar secundária consome 298px): `px-4` vira `px-8` só em xl e o
      // título `text-xl` vira `text-2xl` em xl. Sem isso o bloco de ações era
      // empurrado para fora do card.
      className={`sticky top-0 z-10 flex items-center justify-between gap-3 rounded-t-xl border-b border-gray-100 bg-branco/95 px-4 py-4 backdrop-blur-sm xl:px-8 ${className ?? ""}`}
    >
      {customLeft ?? (
        // `min-w-0` deixa o bloco de título encolher (senão empurra as ações
        // para fora); `truncate` evita que título longo quebre o header.
        <div className="flex min-w-0 items-center gap-3 xl:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-roxo/10 text-roxo">
            <Icon size={20} strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-1">
              <h1 className="truncate text-xl font-bold text-preto xl:text-2xl">{moduleTitle}</h1>
              {subTitle && (
                <>
                  <ChevronDown size={16} strokeWidth={1.5} className="shrink-0 -rotate-90 text-gray-300" />
                  <span className="truncate text-xl font-bold text-preto xl:text-2xl">{subTitle}</span>
                </>
              )}
            </div>
            {description && <p className="mt-0.5 truncate text-[12px] text-gray-500">{description}</p>}
          </div>
        </div>
      )}

      {/* `shrink-0`: as ações (busca/sino/avatar) nunca são espremidas — quem
          cede espaço é o título, que trunca. */}
      <div className="flex shrink-0 items-center gap-2 xl:gap-3">{children}</div>
    </div>
  )
}
