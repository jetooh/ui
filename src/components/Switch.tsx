// Switch (toggle on/off) canônico — fonte única do padrão de toggle dos apps
// (modo manutenção, publicar veiculação, tema escuro, etc.). Antes recriado
// inline em cada app (`role=switch` + trilho + botão). Acessível e controlado.
//   <Switch checked={on} onCheckedChange={setOn} label="Modo manutenção" />
//   <Switch checked={dark} onCheckedChange={setDark} size="sm" />
import { cn } from "../lib/cn"

const TRACK = {
  sm: "h-5 w-9",
  default: "h-6 w-11",
} as const

const THUMB = {
  sm: "h-4 w-4 translate-x-0.5",
  default: "h-5 w-5 translate-x-0.5",
} as const

const THUMB_ON = {
  sm: "translate-x-4",
  default: "translate-x-[22px]",
} as const

export interface SwitchProps {
  /** Estado ligado/desligado (controlado). */
  checked: boolean
  /** Chamado com o novo estado ao alternar. */
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  size?: keyof typeof TRACK
  /** Rótulo acessível (aria-label) — obrigatório quando não há <label> visível. */
  label?: string
  /** Classe de cor do trilho quando ligado (default: primary/roxo). */
  color?: string
  id?: string
  className?: string
}

export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  size = "default",
  label,
  color = "bg-roxo",
  id,
  className,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-roxo/40 focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        TRACK[size],
        checked ? color : "bg-gray-200",
        className,
      )}
    >
      <span
        className={cn(
          "inline-block transform rounded-full bg-white shadow-xs transition-transform",
          THUMB[size],
          checked && THUMB_ON[size],
        )}
      />
    </button>
  )
}
