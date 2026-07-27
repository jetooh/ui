// StatusBadge — molécula canônica (pílula = StatusDot + rótulo) para estados de
// status (online/offline/pareando/…). Fonte única: antes cada app recriava um
// <span> literal porque o <Badge> tem `overflow-hidden`, que CLIPA o anel do
// `animate-ping` do StatusDot. Esta pílula NÃO usa overflow-hidden, então o
// pulso aparece inteiro.
//   <StatusBadge variant="online" label="Online" />
//   <StatusBadge label="Custom" color="bg-verde" pillClassName="bg-verde/10 text-verde-dark border-verde/20" pulse />
//   <DeviceStatusBadge status={device.status} />
import { cn } from "../lib/cn"
import { StatusDot } from "./StatusDot"

export type StatusVariant = "online" | "offline" | "pairing" | "warning" | "neutral"

// Tom de cada variante: cor do dot + classes da pílula (bg/text/border) + pulso.
// Régua = platform/devices (mesmos tokens dos badges de status já em produção).
const TONES: Record<StatusVariant, { dot: string; pill: string; pulse: boolean }> = {
  online: { dot: "bg-verde", pill: "bg-verde/10 text-verde-dark border-verde/20", pulse: true },
  offline: { dot: "bg-red-400", pill: "bg-red-50 text-red-700 border-red-200", pulse: false },
  pairing: { dot: "bg-roxo", pill: "bg-roxo/10 text-roxo border-roxo/20", pulse: true },
  warning: { dot: "bg-amber-500", pill: "bg-amber-50 text-amber-700 border-amber-200", pulse: false },
  neutral: { dot: "bg-gray-400", pill: "bg-gray-100 text-gray-600 border-gray-200", pulse: false },
}

export interface StatusBadgeProps {
  label: string
  /** Variante semântica com tom pronto. Ignorada nos campos que você sobrescrever. */
  variant?: StatusVariant
  /** Sobrescreve a cor do StatusDot (classe bg-*). */
  color?: string
  /** Sobrescreve as classes da pílula (bg/text/border). */
  pillClassName?: string
  /** Sobrescreve o pulso do dot. */
  pulse?: boolean
  size?: "sm" | "md"
  className?: string
}

export function StatusBadge({
  label,
  variant = "neutral",
  color,
  pillClassName,
  pulse,
  size = "sm",
  className,
}: StatusBadgeProps) {
  const tone = TONES[variant]
  const dotColor = color ?? tone.dot
  const dotPulse = pulse ?? tone.pulse
  return (
    <span
      className={cn(
        // sem overflow-hidden — o anel do animate-ping não é cortado.
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-4xl border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
        pillClassName ?? tone.pill,
        className,
      )}
    >
      <StatusDot color={dotColor} pulse={dotPulse} size={size} />
      {label}
    </span>
  )
}

// ── Status de device (centraliza rótulo + tom; hoje diverge entre telas) ────────
export type DeviceStatus = "online" | "offline" | "pairing" | (string & {})

/**
 * Mapa canônico de status de device → rótulo PT + variante + pulso.
 * Centraliza a divergência histórica ("Pareando" vs "Aguardando aparelho"):
 * rótulo canônico do device = statusLabel do devices ("Pareando").
 */
export function deviceStatusMeta(status: DeviceStatus): { label: string; variant: StatusVariant; pulse: boolean } {
  switch (status) {
    case "online":
      return { label: "Online", variant: "online", pulse: true }
    case "pairing":
      return { label: "Pareando", variant: "pairing", pulse: true }
    case "offline":
      return { label: "Offline", variant: "offline", pulse: false }
    default:
      return { label: "Offline", variant: "neutral", pulse: false }
  }
}

export interface DeviceStatusBadgeProps {
  status: DeviceStatus
  size?: "sm" | "md"
  className?: string
}

/** Badge de status de device pronto: recebe só o status e resolve rótulo/tom. */
export function DeviceStatusBadge({ status, size = "sm", className }: DeviceStatusBadgeProps) {
  const meta = deviceStatusMeta(status)
  return <StatusBadge label={meta.label} variant={meta.variant} pulse={meta.pulse} size={size} className={className} />
}
