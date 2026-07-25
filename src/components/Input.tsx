// Input canônico — campo de formulário padrão do ecossistema. rounded-lg, borda
// gray-200, foco roxo (border-roxo + ring-roxo/30). Régua = estilo de form do platform.
import * as React from "react"

import { cn } from "../lib/cn"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full rounded-lg border border-gray-200 bg-branco px-3 py-2 text-[14px] text-preto outline-hidden transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:border-roxo focus:ring-1 focus:ring-roxo/30 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
