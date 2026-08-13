// Input canônico — campo de formulário padrão do ecossistema. rounded-lg, borda
// `borda-controle`, foco roxo (border-roxo + ring-roxo/30). Régua = estilo de
// form do platform.
//
// Borda em `borda-controle` (#8b8b93 claro = 3.38:1 sobre branco e 3.08:1 sobre
// page-bg; #6b6b8f escuro = 3.51:1): o campo é branco dentro de card branco, a
// borda é a ÚNICA delimitação da área clicável e WCAG 1.4.11 exige 3:1.
// `gray-200` media 1.26:1 (JET-101) e segue sendo a borda de superfície (card,
// PageFrame, Modal, divisores), onde 3:1 não é exigido.
//
// Placeholder em `gray-500` (#6B7280 = 4.83:1 no claro, #9CA3AF = 7.04:1 no
// escuro): `gray-400` mede 2.60:1 e reprova o mínimo 4.5:1 de WCAG 1.4.3.
// Guardado por `contrast.test.tsx`.
import * as React from "react"

import { cn } from "../lib/cn"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        // Em telas de toque: `min-h-10` (40px de alvo, o py-2 dá 38) e
        // `text-[16px]` — abaixo de 16px o Safari do iOS DÁ ZOOM ao focar o
        // campo, e o zoom desloca/estoura o layout da página.
        "flex w-full rounded-lg border border-borda-controle bg-branco px-3 py-2 text-[14px] text-preto outline-hidden transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:border-roxo focus:ring-1 focus:ring-roxo/30 disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:min-h-10 pointer-coarse:text-[16px]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
