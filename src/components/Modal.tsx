import { X } from 'lucide-react';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

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
  /** Largura máxima do card. Régua do platform = md. `xl`/`2xl` para forms densos. */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'screen';
}

const SIZES = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl', '2xl': 'max-w-3xl', '3xl': 'max-w-5xl', screen: 'max-w-[80vw]' } as const;

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Modal canônico do ecossistema JETOOH — extraído do padrão do platform
 * (party-add-modal): overlay `bg-preto/40` com `backdrop-blur-sm`, card
 * `rounded-2xl` com borda cinza e SEM sombra (régua flat), entrada
 * `animate-fade-in-up` (0.2s). Esc e clique no overlay fecham.
 *
 * A11y (WCAG 2.4.3/4.1.2): ao abrir, foca o primeiro elemento e PRENDE o foco
 * (Tab/Shift+Tab ciclam dentro); ao fechar, devolve o foco ao gatilho; título
 * ligado via `aria-labelledby`. Fonte ÚNICA: mudou aqui → muda em todo app.
 *
 * RUL-10 (full-page): renderizado via `createPortal(..., document.body)` para
 * que o overlay `fixed inset-0` cubra a VIEWPORT inteira (rail, header, rodapé).
 * Sem o portal, um ancestral com `transform`/`filter`/`will-change` (ex.: o
 * wrapper `animate-fade-in-up` da casca) cria containing-block e prende o
 * `position: fixed` à área de conteúdo. O portal escapa desses ancestrais.
 */
export function Modal({ open, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    const prevActive = document.activeElement as HTMLElement | null;
    const card = cardRef.current;
    const getFocusable = () =>
      card
        ? Array.from(card.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
            (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement,
          )
        : [];

    // Move o foco para dentro ao abrir (primeiro focável, ou o próprio card).
    const focusables = getFocusable();
    (focusables[0] ?? card)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const f = getFocusable();
      if (f.length === 0) {
        e.preventDefault();
        card?.focus();
        return;
      }
      // Trap robusto: trata TODO Tab (preventDefault + move explícito com
      // wraparound) — assim o foco nunca escapa do modal.
      e.preventDefault();
      const idx = f.indexOf(document.activeElement as HTMLElement);
      let next: HTMLElement;
      if (e.shiftKey) next = idx <= 0 ? f[f.length - 1] : f[idx - 1];
      else next = idx === -1 || idx === f.length - 1 ? f[0] : f[idx + 1];
      next.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      // Devolve o foco ao elemento que abriu o modal.
      prevActive?.focus?.();
    };
  }, [open, onClose]);

  // Sem `document` (SSR) não há onde portar; nada a renderizar.
  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title != null ? titleId : undefined}
      aria-describedby={description != null ? descId : undefined}
    >
      <div className="absolute inset-0 bg-preto/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative z-10 w-full ${SIZES[size]} animate-fade-in-up`}
        style={{ animationDuration: '0.2s' }}
      >
        {/*
          Card em COLUNA com altura limitada à viewport (`100dvh` — dynamic viewport,
          desconta a barra de URL do mobile — menos o respiro `p-4` do overlay = 2rem).
          Cabeçalho e rodapé ficam FIXOS (`shrink-0`) e SÓ o corpo rola
          (`min-h-0 overflow-y-auto overscroll-contain`). Sem isso, conteúdo mais alto
          que a tela vazava para fora do modal (o card centralizado transbordava a
          viewport). `min-h-0` deixa o corpo encolher no flex; SEM `flex-1` para não
          esticar o corpo (e empurrar o rodapé) em modais curtos. `overscroll-contain`
          evita que o scroll "vaze" para a página atrás no fim do corpo.
        */}
        <div
          ref={cardRef}
          tabIndex={-1}
          className={`flex w-full flex-col rounded-2xl border border-gray-200 bg-branco outline-none ${
            size === 'screen' ? 'h-[80vh]' : 'max-h-[calc(100dvh-2rem)]'
          }`}
        >
          {title != null && (
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-100 px-6 py-4">
              <div className="min-w-0">
                <h3 id={titleId} className="text-[15px] font-semibold text-preto">{title}</h3>
                {description != null && (
                  <p id={descId} className="mt-0.5 text-[12.5px] leading-relaxed text-gray-500">{description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-preto"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>
          )}
          <div className={`min-h-0 overflow-y-auto overscroll-contain px-6 py-5 ${size === 'screen' ? 'flex-1' : ''}`}>{children}</div>
          {footer != null && (
            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-gray-100 px-6 py-4">{footer}</div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
