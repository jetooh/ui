// Input canônico — campo de formulário padrão do ecossistema. rounded-lg, borda
// gray-200, foco roxo (border-roxo + ring-roxo/30). Régua = estilo de form do platform.
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
        "flex w-full rounded-lg border border-gray-200 bg-branco px-3 py-2 text-[14px] text-preto outline-hidden transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:border-roxo focus:ring-1 focus:ring-roxo/30 disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:min-h-10 pointer-coarse:text-[16px]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
