import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Título do cabeçalho. Ausente = sem cabeçalho (nem X). */
  title?: ReactNode;
  /** Subtítulo/descrição opcional abaixo do título. */
  description?: ReactNode;
  children: ReactNode;
  /** Rodapé (ex.: Cancelar/Aplicar). Ausente = sem rodapé. */
  footer?: ReactNode;
  /** Largura máxima do card. Régua do platform = md. */
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' } as const;

/**
 * Modal canônico do ecossistema JETOOH — extraído do padrão do platform
 * (party-add-modal): overlay `bg-preto/40` com `backdrop-blur-sm`, card
 * `rounded-2xl` com borda cinza e SEM sombra (régua flat), entrada
 * `animate-fade-in-up` (0.2s). Esc e clique no overlay fecham.
 *
 * Fonte ÚNICA: mudou aqui → muda em todo app que consome @jetooh/ui.
 */
export function Modal({ open, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-preto/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative z-10 mx-4 w-full ${SIZES[size]} animate-fade-in-up`}
        style={{ animationDuration: '0.2s' }}
      >
        <div className="rounded-2xl border border-gray-200 bg-branco">
          {title != null && (
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-6 py-4">
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold text-preto">{title}</h3>
                {description != null && (
                  <p className="mt-0.5 text-[12.5px] leading-relaxed text-gray-400">{description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-preto"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>
          )}
          <div className="px-6 py-5">{children}</div>
          {footer != null && (
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4">{footer}</div>
          )}
        </div>
      </div>
    </div>
  );
}
