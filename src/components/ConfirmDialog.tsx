// Diálogo de confirmação canônico — sobre o Modal do ecossistema. Para ações
// destrutivas ou que exigem confirmação explícita. Régua: platform.
import type { ReactNode } from "react"
import { Loader2 } from "lucide-react"

import { Modal } from "./Modal"
import { Button } from "./Button"

export interface ConfirmDialogProps {
  open: boolean
  title: string
  description: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      footer={
        <>
          {/* EXCEÇÃO REGISTRADA (JET-102): "Cancelar" fica em `gray-200`. O
              rótulo de texto (gray-600 = 7.56:1) identifica o botão, então a
              borda não é informação exigida pela WCAG 1.4.11 — e escurecê-la
              colocaria a ação secundária competindo com a primária (sólida),
              achatando a hierarquia justo no diálogo destrutivo. */}
          <Button
            variant="outline"
            size="default"
            onClick={onClose}
            className="border-gray-200 px-4 text-[13px] font-medium text-gray-600 hover:border-gray-300 hover:text-preto"
          >
            {cancelLabel}
          </Button>
          <Button
            size="default"
            onClick={onConfirm}
            disabled={loading}
            className={`gap-2 px-5 text-[13px] font-semibold text-branco disabled:opacity-50 ${destructive ? "bg-status-critico hover:bg-status-critico/90" : "bg-roxo hover:bg-roxo-hover"}`}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </Button>
        </>
      }
    >
      {/* Sem header do Modal (confirm não tem X): título+descrição no corpo. */}
      <h2 className="text-[15px] font-semibold text-preto">{title}</h2>
      <div className="mt-1 text-[13px] text-gray-500">{description}</div>
    </Modal>
  )
}
