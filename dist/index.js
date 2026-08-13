// src/components/Modal.tsx
import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { jsx, jsxs } from "react/jsx-runtime";
var SIZES = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-2xl", "2xl": "max-w-3xl", "3xl": "max-w-5xl", screen: "max-w-[80vw]" };
var FOCUSABLE = 'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';
function Modal({ open, onClose, title, description, children, footer, size = "md" }) {
  const cardRef = useRef(null);
  const titleId = useId();
  const descId = useId();
  useEffect(() => {
    if (!open) return;
    const prevActive = document.activeElement;
    const card = cardRef.current;
    const getFocusable = () => card ? Array.from(card.querySelectorAll(FOCUSABLE)).filter(
      (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement
    ) : [];
    const focusables = getFocusable();
    (focusables[0] ?? card)?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const f = getFocusable();
      if (f.length === 0) {
        e.preventDefault();
        card?.focus();
        return;
      }
      e.preventDefault();
      const idx = f.indexOf(document.activeElement);
      let next;
      if (e.shiftKey) next = idx <= 0 ? f[f.length - 1] : f[idx - 1];
      else next = idx === -1 || idx === f.length - 1 ? f[0] : f[idx + 1];
      next.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prevActive?.focus?.();
    };
  }, [open, onClose]);
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-4",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": title != null ? titleId : void 0,
        "aria-describedby": description != null ? descId : void 0,
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-preto/40 backdrop-blur-sm", onClick: onClose }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `relative z-10 w-full ${SIZES[size]} animate-fade-in-up`,
              style: { animationDuration: "0.2s" },
              children: /* @__PURE__ */ jsxs(
                "div",
                {
                  ref: cardRef,
                  tabIndex: -1,
                  className: `flex w-full flex-col rounded-2xl border border-gray-200 bg-branco outline-none ${size === "screen" ? "h-[80vh]" : "max-h-[calc(100dvh-2rem)]"}`,
                  children: [
                    title != null && /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-start justify-between gap-3 border-b border-gray-100 px-6 py-4", children: [
                      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                        /* @__PURE__ */ jsx("h3", { id: titleId, className: "text-[15px] font-semibold text-preto", children: title }),
                        description != null && /* @__PURE__ */ jsx("p", { id: descId, className: "mt-0.5 text-[12.5px] leading-relaxed text-gray-500", children: description })
                      ] }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: onClose,
                          "aria-label": "Fechar",
                          className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-preto",
                          children: /* @__PURE__ */ jsx(X, { size: 16, strokeWidth: 1.5 })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: `min-h-0 overflow-y-auto overscroll-contain px-6 py-5 ${size === "screen" ? "flex-1" : ""}`, children }),
                    footer != null && /* @__PURE__ */ jsx("div", { className: "flex shrink-0 items-center justify-end gap-2 border-t border-gray-100 px-6 py-4", children: footer })
                  ]
                }
              )
            }
          )
        ]
      }
    ),
    document.body
  );
}

// src/components/Avatar.tsx
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";

// src/lib/cn.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/Avatar.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
function Avatar({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx2(
    AvatarPrimitive.Root,
    {
      "data-slot": "avatar",
      "data-size": size,
      className: cn(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
        className
      ),
      ...props
    }
  );
}
function AvatarImage({ className, ...props }) {
  return /* @__PURE__ */ jsx2(
    AvatarPrimitive.Image,
    {
      "data-slot": "avatar-image",
      className: cn("aspect-square size-full rounded-full object-cover", className),
      ...props
    }
  );
}
function AvatarFallback({ className, ...props }) {
  return /* @__PURE__ */ jsx2(
    AvatarPrimitive.Fallback,
    {
      "data-slot": "avatar-fallback",
      className: cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs",
        className
      ),
      ...props
    }
  );
}
function AvatarBadge({ className, ...props }) {
  return /* @__PURE__ */ jsx2(
    "span",
    {
      "data-slot": "avatar-badge",
      className: cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      ),
      ...props
    }
  );
}
function AvatarGroup({ className, ...props }) {
  return /* @__PURE__ */ jsx2(
    "div",
    {
      "data-slot": "avatar-group",
      className: cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      ),
      ...props
    }
  );
}
function AvatarGroupCount({ className, ...props }) {
  return /* @__PURE__ */ jsx2(
    "div",
    {
      "data-slot": "avatar-group-count",
      className: cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      ),
      ...props
    }
  );
}

// src/components/Button.tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva } from "class-variance-authority";
import { jsx as jsx3 } from "react/jsx-runtime";
var buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        outline: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-link underline-offset-4 hover:underline"
      },
      // `pointer-coarse:` = só em telas de TOQUE (celular/tablet): os tamanhos
      // "normais" (default/lg/icon/icon-lg) sobem para 40px de alvo, atendendo
      // WCAG 2.5.8 (Target Size Minimum) sem engordar nada no desktop. Os
      // tamanhos declaradamente compactos (xs/sm) ficam como estão — quem os usa
      // pediu densidade de propósito.
      size: {
        default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 pointer-coarse:h-10 pointer-coarse:px-3.5",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 pointer-coarse:h-11 pointer-coarse:px-3.5",
        icon: "size-8 pointer-coarse:size-10",
        "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9 pointer-coarse:size-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx3(
    ButtonPrimitive,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}

// src/components/Badge.tsx
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva as cva2 } from "class-variance-authority";
var badgeVariants = cva2(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary-hover",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive: "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-link underline-offset-4 hover:underline"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant = "default",
  render,
  ...props
}) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps(
      {
        className: cn(badgeVariants({ variant }), className)
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant
    }
  });
}

// src/components/Card.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
function Card({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx4(
    "div",
    {
      "data-slot": "card",
      "data-size": size,
      className: cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground border border-gray-100 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx4(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        // Cabeçalho com AÇÕES (busca + filtro + "Novo …"):
        //  • abaixo de `sm` o bloco de ações EMPILHA sob o título — antes a
        //    coluna `auto` da ação estourava a largura do card no celular e
        //    gerava scroll lateral;
        //  • de `sm` para cima a coluna da ação é `fit-content(70%)`, NÃO `auto`:
        //    com `auto` a trilha assumia o max-content da barra (582px num header
        //    de 626px), zerava a coluna do título e o texto do título ficava POR
        //    CIMA das ações. Com o teto de 70% a barra quebra dentro do próprio
        //    espaço (ver `[&>*]:flex-wrap` no CardAction) e o título mantém 30%.
        // Usa breakpoint de viewport, não container query: `@container/card-header`
        // vale só para os DESCENDENTES — um elemento não consulta o próprio
        // container, então `@md/card-header:` aqui nunca casaria.
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-1 has-data-[slot=card-action]:gap-3 has-data-[slot=card-action]:sm:grid-cols-[1fr_fit-content(70%)] has-data-[slot=card-action]:sm:gap-1 has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx4(
    "div",
    {
      "data-slot": "card-title",
      className: cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      ),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx4(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  );
}
function CardAction({ className, ...props }) {
  return /* @__PURE__ */ jsx4(
    "div",
    {
      "data-slot": "card-action",
      className: cn(
        // No celular a ação ocupa a linha inteira (justify-self-start); a partir
        // de `sm` volta para a coluna da direita, como antes.
        //
        // `[&>*]:flex-wrap`: as apps montam a barra de ações como um
        // `<div className="flex items-center gap-2">` (busca + filtro + botão).
        // Sem `flex-wrap` essa linha não quebra e estoura o card no mobile.
        // A regra é inócua quando o filho NÃO é um container flex (flex-wrap só
        // tem efeito em display:flex), então vale para toda app do tema sem
        // precisar tocar em cada tela.
        "max-w-full justify-self-start [&>*]:flex-wrap sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:self-start sm:justify-self-end",
        className
      ),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx4(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-4 group-data-[size=sm]/card:px-3", className),
      ...props
    }
  );
}
function CardFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx4(
    "div",
    {
      "data-slot": "card-footer",
      className: cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className
      ),
      ...props
    }
  );
}

// src/components/Skeleton.tsx
import { jsx as jsx5, jsxs as jsxs2 } from "react/jsx-runtime";
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx5(
    "div",
    {
      className: cn("animate-pulse rounded-lg bg-gray-200/60", className),
      ...props
    }
  );
}
function SkeletonKpiCard() {
  return /* @__PURE__ */ jsx5("div", { className: "flex flex-col gap-4 rounded-xl border border-gray-100 bg-card py-4 px-4", children: /* @__PURE__ */ jsxs2("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxs2("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx5(Skeleton, { className: "h-3 w-24" }),
      /* @__PURE__ */ jsx5(Skeleton, { className: "h-7 w-20" })
    ] }),
    /* @__PURE__ */ jsx5(Skeleton, { className: "h-10 w-10 rounded-lg" })
  ] }) });
}
var COL_WIDTHS = [120, 90, 140, 80, 110, 100, 130, 95];
function SkeletonTableRow({ cols = 5 }) {
  return /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0", children: [
    /* @__PURE__ */ jsx5(Skeleton, { className: "h-9 w-9 rounded-lg shrink-0" }),
    /* @__PURE__ */ jsx5("div", { className: "flex-1 flex items-center gap-8", children: Array.from({ length: cols }).map((_, i) => /* @__PURE__ */ jsx5(Skeleton, { className: "h-4 flex-1", style: { maxWidth: `${COL_WIDTHS[i % COL_WIDTHS.length]}px` } }, i)) })
  ] });
}
function SkeletonTable({ rows = 5, cols = 5 }) {
  return /* @__PURE__ */ jsxs2("div", { className: "rounded-xl border border-gray-100 bg-card overflow-hidden", children: [
    /* @__PURE__ */ jsxs2("div", { className: "flex items-center justify-between px-4 py-4 border-b border-gray-100", children: [
      /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx5(Skeleton, { className: "h-4 w-4 rounded" }),
        /* @__PURE__ */ jsx5(Skeleton, { className: "h-4 w-24" })
      ] }),
      /* @__PURE__ */ jsx5(Skeleton, { className: "h-8 w-28 rounded-lg" })
    ] }),
    Array.from({ length: rows }).map((_, i) => /* @__PURE__ */ jsx5(SkeletonTableRow, { cols }, i))
  ] });
}
function Loading() {
  return /* @__PURE__ */ jsxs2("div", { className: "px-4 py-4 sm:p-6 sm:pb-8 lg:p-8 lg:pb-10 space-y-6", children: [
    /* @__PURE__ */ jsx5("div", { className: "grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4", children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx5(SkeletonKpiCard, {}, i)) }),
    /* @__PURE__ */ jsx5(SkeletonTable, {})
  ] });
}
var SkeletonPage = Loading;
function TabLoading() {
  return /* @__PURE__ */ jsx5("div", { className: "flex items-center justify-center py-16", children: /* @__PURE__ */ jsx5("span", { className: "inline-block h-6 w-6 animate-spin rounded-full border-2 border-roxo border-t-transparent" }) });
}

// src/components/BrandLoading.tsx
import { jsx as jsx6, jsxs as jsxs3 } from "react/jsx-runtime";
function BrandLoading() {
  return /* @__PURE__ */ jsx6(
    "div",
    {
      className: "fixed inset-0 z-[99999] flex items-center justify-center",
      style: { background: "#0B0F0C" },
      children: /* @__PURE__ */ jsxs3("div", { className: "relative flex items-center justify-center", children: [
        /* @__PURE__ */ jsx6(
          "div",
          {
            className: "absolute h-28 w-28 animate-spin rounded-full border-[3px] border-transparent",
            style: { borderTopColor: "#8B47FF", borderRightColor: "rgba(139,71,255,0.3)" }
          }
        ),
        /* @__PURE__ */ jsx6("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512", className: "h-24 w-24 fill-white", children: /* @__PURE__ */ jsx6("path", { d: "M247.26,29.65C67.56,37.31-33.89,241.82,72.17,388.72c104.35,144.53,327.7,117.1,394.22-47.79C527.76,188.81,410.5,22.69,247.26,29.65ZM179.39,365.5c-33.69,1.47-64.42-21.23-76.28-52.12-.85-2.2-4.64-12.97-4.64-14.47v-95.8c32.69-.77,63.54,21.36,75.31,51.4,1.43,3.64,5.61,16.95,5.61,20.24v90.75ZM286.15,296.11c0,2.68-3.87,14.28-5.05,17.43-11.34,30.28-43.02,53.37-75.87,51.97v-173.91c0-2.38,3.44-13.47,4.48-16.31,11.01-30.16,43.87-54.03,76.43-52.53v173.35ZM391.79,365.5c-31.67,1.6-63.55-20.91-75.16-49.86-1.27-3.18-5.75-16.86-5.75-19.53v-92.15c2.97-1.55,8.55-.67,12.01-.21,28.96,3.85,54.16,24.92,64.26,52.05.93,2.5,4.64,13.68,4.64,15.59v94.12Z" }) })
      ] })
    }
  );
}

// src/components/KpiCard.tsx
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { jsx as jsx7, jsxs as jsxs4 } from "react/jsx-runtime";
function KpiCard({
  label,
  value,
  icon: Icon2,
  iconBg = "bg-roxo/10",
  iconColor = "text-roxo",
  trend,
  trendUp,
  hint
}) {
  return /* @__PURE__ */ jsx7(Card, { className: "gap-0", children: /* @__PURE__ */ jsxs4(CardHeader, { className: "flex flex-row items-start justify-between gap-2", children: [
    /* @__PURE__ */ jsxs4("div", { className: "flex min-w-0 flex-col gap-1", children: [
      /* @__PURE__ */ jsx7("span", { className: "text-xs font-medium uppercase tracking-wider text-gray-500", children: label }),
      /* @__PURE__ */ jsx7("span", { className: "break-words text-2xl font-bold tracking-tight text-preto", children: value }),
      trend && /* @__PURE__ */ jsxs4(
        "span",
        {
          className: `flex items-center gap-1 text-xs font-medium ${trendUp ? "text-verde-dark" : "text-red-600"}`,
          children: [
            trendUp ? /* @__PURE__ */ jsx7(ArrowUpRight, { size: 12, strokeWidth: 2 }) : /* @__PURE__ */ jsx7(ArrowDownRight, { size: 12, strokeWidth: 2 }),
            trend
          ]
        }
      ),
      hint && /* @__PURE__ */ jsx7("span", { className: "text-xs text-gray-500", children: hint })
    ] }),
    /* @__PURE__ */ jsx7(
      "div",
      {
        className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`,
        children: /* @__PURE__ */ jsx7(Icon2, { size: 20, strokeWidth: 1.5 })
      }
    )
  ] }) });
}
var WIDE_COLS = {
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
  5: "xl:grid-cols-5"
};
function KpiGrid({
  children,
  className,
  cols = 4
}) {
  return (
    // 1 coluna abaixo de `sm` (todo celular em retrato): com 2 colunas em 360px
    // sobram ~80px úteis por card e um valor de moeda ("R$ 3.482.995,00") ou
    // quebrava no meio do número ou era cortado pelo `overflow-hidden` do Card.
    // `[&>*]:min-w-0` deixa cada card encolher abaixo do próprio conteúdo (item
    // de grid tem `min-width:auto` por padrão).
    /* @__PURE__ */ jsx7("div", { className: `grid grid-cols-1 gap-2.5 [&>*]:min-w-0 sm:grid-cols-2 sm:gap-4 ${WIDE_COLS[cols]} ${className ?? ""}`, children })
  );
}

// src/components/Table.tsx
import { jsx as jsx8 } from "react/jsx-runtime";
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsx8(
    "div",
    {
      "data-slot": "table-container",
      tabIndex: 0,
      role: "group",
      className: "relative w-full max-w-full overflow-x-auto overscroll-x-contain outline-none",
      children: /* @__PURE__ */ jsx8(
        "table",
        {
          "data-slot": "table",
          className: cn("w-full caption-bottom text-sm", className),
          ...props
        }
      )
    }
  );
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx8(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsx8(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx8(
    "tfoot",
    {
      "data-slot": "table-footer",
      className: cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      ),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsx8(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsx8(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsx8(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      ),
      ...props
    }
  );
}
function TableCaption({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx8(
    "caption",
    {
      "data-slot": "table-caption",
      className: cn("mt-4 text-sm text-muted-foreground", className),
      ...props
    }
  );
}

// src/components/Toast.tsx
import * as React from "react";
import { createPortal as createPortal2 } from "react-dom";
import { CheckCircle2, AlertCircle, Info, X as X2 } from "lucide-react";
import { jsx as jsx9, jsxs as jsxs5 } from "react/jsx-runtime";
var LIMIT = 5;
var DURATION = 4500;
var counter = 0;
var items = [];
var listeners = /* @__PURE__ */ new Set();
var emit = () => {
  for (const l of listeners) l(items);
};
function dismiss(id) {
  items = items.filter((t) => t.id !== id);
  emit();
}
function normalizeVariant(v) {
  if (v === "destructive" || v === "success" || v === "info") return v;
  return "default";
}
function baseToast(opts) {
  const id = String(++counter);
  const item = {
    id,
    title: opts.title,
    description: opts.description,
    variant: normalizeVariant(opts.variant)
  };
  items = [item, ...items].slice(0, LIMIT);
  emit();
  const timer = setTimeout(() => dismiss(id), DURATION);
  return {
    id,
    dismiss: () => {
      clearTimeout(timer);
      dismiss(id);
    },
    update: (next) => {
      items = items.map((t) => t.id === id ? { ...t, ...next, variant: normalizeVariant(next.variant) } : t);
      emit();
    }
  };
}
var toast = Object.assign(baseToast, {
  success: (message) => baseToast({ title: message, variant: "success" }),
  error: (message) => baseToast({ title: message, variant: "destructive" }),
  info: (message) => baseToast({ title: message, variant: "info" })
});
function useToast() {
  const [list, setList] = React.useState(items);
  React.useEffect(() => {
    listeners.add(setList);
    setList(items);
    return () => {
      listeners.delete(setList);
    };
  }, []);
  return {
    toasts: list,
    toast,
    dismiss: (id) => {
      if (id) dismiss(id);
      else {
        items = [];
        emit();
      }
    }
  };
}
var ICON = {
  success: /* @__PURE__ */ jsx9(CheckCircle2, { size: 16, strokeWidth: 1.75, className: "shrink-0 text-verde" }),
  destructive: /* @__PURE__ */ jsx9(AlertCircle, { size: 16, strokeWidth: 1.75, className: "shrink-0 text-status-critico" }),
  info: /* @__PURE__ */ jsx9(Info, { size: 16, strokeWidth: 1.75, className: "shrink-0 text-roxo" }),
  default: null
};
function Toaster() {
  const [list, setList] = React.useState([]);
  React.useEffect(() => {
    listeners.add(setList);
    setList(items);
    return () => {
      listeners.delete(setList);
    };
  }, []);
  if (typeof document === "undefined") return null;
  return createPortal2(
    /* @__PURE__ */ jsx9(
      "div",
      {
        className: "pointer-events-none fixed bottom-4 right-4 z-[10000] flex max-w-[calc(100vw-2rem)] flex-col gap-2",
        role: "region",
        "aria-live": "polite",
        "aria-label": "Notifica\xE7\xF5es",
        children: list.map((t) => /* @__PURE__ */ jsxs5(
          "div",
          {
            role: t.variant === "destructive" ? "alert" : "status",
            className: "pointer-events-auto flex w-full items-start gap-2 rounded-lg border border-gray-200 bg-branco px-3.5 py-2.5 text-[13px] text-preto shadow-lg",
            children: [
              ICON[t.variant],
              /* @__PURE__ */ jsxs5("div", { className: cn("flex min-w-0 flex-col gap-0.5", !t.description && "justify-center"), children: [
                t.title && /* @__PURE__ */ jsx9("span", { className: "max-w-xs font-medium leading-snug", children: t.title }),
                t.description && /* @__PURE__ */ jsx9("span", { className: "max-w-xs text-xs leading-snug text-gray-500", children: t.description })
              ] }),
              /* @__PURE__ */ jsx9(
                "button",
                {
                  onClick: () => dismiss(t.id),
                  "aria-label": "Fechar notifica\xE7\xE3o",
                  className: "ml-1 shrink-0 text-gray-500 transition-colors hover:text-preto",
                  children: /* @__PURE__ */ jsx9(X2, { size: 14, strokeWidth: 2 })
                }
              )
            ]
          },
          t.id
        ))
      }
    ),
    document.body
  );
}

// src/components/StatusDot.tsx
import { jsx as jsx10, jsxs as jsxs6 } from "react/jsx-runtime";
var SIZES2 = { sm: "h-1.5 w-1.5", md: "h-2 w-2", lg: "h-2.5 w-2.5" };
function StatusDot({ color, pulse = false, size = "md", className }) {
  const s = SIZES2[size];
  return /* @__PURE__ */ jsxs6("span", { className: cn("relative flex", s, className), children: [
    pulse && /* @__PURE__ */ jsx10("span", { className: cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", color) }),
    /* @__PURE__ */ jsx10("span", { className: cn("relative inline-flex rounded-full", s, color) })
  ] });
}

// src/components/StatusBadge.tsx
import { jsx as jsx11, jsxs as jsxs7 } from "react/jsx-runtime";
var TONES = {
  online: { dot: "bg-verde", pill: "bg-verde/10 text-verde-dark border-verde/20", pulse: true },
  offline: { dot: "bg-red-400", pill: "bg-red-50 text-red-700 border-red-200", pulse: false },
  pairing: { dot: "bg-roxo", pill: "bg-roxo/10 text-roxo border-roxo/20", pulse: true },
  warning: { dot: "bg-amber-500", pill: "bg-amber-50 text-amber-700 border-amber-200", pulse: false },
  // D4 (JET-106): o dot do badge CARREGA estado — é conteúdo não-textual, mínimo
  // 3:1 por WCAG 1.4.11. O cinza 400 cru media 2.20:1 sobre a pílula (gray-100) e
  // reprovava. `bg-muted-foreground` é o token semântico que expõe o grau
  // gray-500 (oklch(55.1% 0.023 264)): 4.09:1 claro / 6.57:1 escuro sobre a
  // pílula. O cinza 400 continua PROIBIDO e fora do contrato — ver contrast.test.tsx.
  neutral: { dot: "bg-muted-foreground", pill: "bg-gray-100 text-gray-600 border-gray-200", pulse: false }
};
function StatusBadge({
  label,
  variant = "neutral",
  color,
  pillClassName,
  pulse,
  size = "sm",
  className
}) {
  const tone = TONES[variant];
  const dotColor = color ?? tone.dot;
  const dotPulse = pulse ?? tone.pulse;
  return /* @__PURE__ */ jsxs7(
    "span",
    {
      className: cn(
        // sem overflow-hidden — o anel do animate-ping não é cortado.
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-4xl border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
        pillClassName ?? tone.pill,
        className
      ),
      children: [
        /* @__PURE__ */ jsx11(StatusDot, { color: dotColor, pulse: dotPulse, size }),
        label
      ]
    }
  );
}
function deviceStatusMeta(status) {
  switch (status) {
    case "online":
      return { label: "Online", variant: "online", pulse: true };
    case "pairing":
      return { label: "Pareando", variant: "pairing", pulse: true };
    case "offline":
      return { label: "Offline", variant: "offline", pulse: false };
    default:
      return { label: "Offline", variant: "neutral", pulse: false };
  }
}
function DeviceStatusBadge({ status, size = "sm", className }) {
  const meta = deviceStatusMeta(status);
  return /* @__PURE__ */ jsx11(StatusBadge, { label: meta.label, variant: meta.variant, pulse: meta.pulse, size, className });
}

// src/components/Switch.tsx
import { jsx as jsx12 } from "react/jsx-runtime";
var TRACK = {
  sm: "h-5 w-9",
  default: "h-6 w-11"
};
var THUMB = {
  sm: "h-4 w-4 translate-x-0.5",
  default: "h-5 w-5 translate-x-0.5"
};
var THUMB_ON = {
  sm: "translate-x-4",
  default: "translate-x-[22px]"
};
function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  size = "default",
  label,
  color = "bg-roxo",
  id,
  className
}) {
  return /* @__PURE__ */ jsx12(
    "button",
    {
      type: "button",
      role: "switch",
      id,
      "aria-checked": checked,
      "aria-label": label,
      disabled,
      onClick: () => onCheckedChange(!checked),
      className: cn(
        "relative inline-flex shrink-0 items-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-roxo/40 focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        TRACK[size],
        checked ? color : "bg-gray-200",
        className
      ),
      children: /* @__PURE__ */ jsx12(
        "span",
        {
          className: cn(
            "inline-block transform rounded-full bg-white shadow-xs transition-transform",
            THUMB[size],
            checked && THUMB_ON[size]
          )
        }
      )
    }
  );
}

// src/components/DateRangePicker.tsx
import { useState as useState2, useEffect as useEffect3 } from "react";
import { createPortal as createPortal3 } from "react-dom";
import { Calendar, CalendarDays, CalendarCheck, CalendarClock, Sun, History, ChevronDown, X as X3 } from "lucide-react";
import { jsx as jsx13, jsxs as jsxs8 } from "react/jsx-runtime";
var PRESETS = [
  { id: "today", label: "Hoje" },
  { id: "yesterday", label: "Ontem" },
  { id: "week_to_date", label: "Semana at\xE9 hoje" },
  { id: "last_week", label: "Semana passada" },
  { id: "month_to_date", label: "M\xEAs at\xE9 hoje" },
  { id: "last_month", label: "M\xEAs passado" },
  { id: "quarter_to_date", label: "Trimestre at\xE9 hoje" },
  { id: "last_quarter", label: "Trimestre passado" },
  { id: "year_to_date", label: "Ano at\xE9 hoje" },
  { id: "last_year", label: "Ano passado" }
];
var iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
function computePreset(id) {
  const now = /* @__PURE__ */ new Date();
  const y = now.getFullYear(), m = now.getMonth();
  switch (id) {
    case "today":
      return { from: iso(now), to: iso(now) };
    case "yesterday": {
      const d = new Date(now);
      d.setDate(d.getDate() - 1);
      return { from: iso(d), to: iso(d) };
    }
    case "week_to_date": {
      const d = new Date(now);
      const dow = (d.getDay() + 6) % 7;
      d.setDate(d.getDate() - dow);
      return { from: iso(d), to: iso(now) };
    }
    case "last_week": {
      const mon = new Date(now);
      const dow = (mon.getDay() + 6) % 7;
      mon.setDate(mon.getDate() - dow - 7);
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);
      return { from: iso(mon), to: iso(sun) };
    }
    case "month_to_date":
      return { from: iso(new Date(y, m, 1)), to: iso(now) };
    case "last_month":
      return { from: iso(new Date(y, m - 1, 1)), to: iso(new Date(y, m, 0)) };
    case "quarter_to_date": {
      const qs = Math.floor(m / 3) * 3;
      return { from: iso(new Date(y, qs, 1)), to: iso(now) };
    }
    case "last_quarter": {
      const qs = Math.floor(m / 3) * 3 - 3;
      return { from: iso(new Date(y, qs, 1)), to: iso(new Date(y, qs + 3, 0)) };
    }
    case "year_to_date":
      return { from: iso(new Date(y, 0, 1)), to: iso(now) };
    case "last_year":
      return { from: iso(new Date(y - 1, 0, 1)), to: iso(new Date(y - 1, 11, 31)) };
    default:
      return { from: iso(new Date(y, m, 1)), to: iso(now) };
  }
}
function comparisonRange(from, to, compare) {
  const f = /* @__PURE__ */ new Date(from + "T00:00:00"), t = /* @__PURE__ */ new Date(to + "T00:00:00");
  if (compare === "year") {
    const f22 = new Date(f);
    f22.setFullYear(f.getFullYear() - 1);
    const t22 = new Date(t);
    t22.setFullYear(t.getFullYear() - 1);
    return { from: iso(f22), to: iso(t22) };
  }
  const days = Math.round((t.getTime() - f.getTime()) / 864e5) + 1;
  const t2 = new Date(f);
  t2.setDate(f.getDate() - 1);
  const f2 = new Date(t2);
  f2.setDate(t2.getDate() - (days - 1));
  return { from: iso(f2), to: iso(t2) };
}
function defaultRange() {
  const { from, to } = computePreset("month_to_date");
  return { preset: "month_to_date", from, to, compare: "year" };
}
function fmtRange(from, to) {
  if (!from || !to) return "\u2014";
  const f = /* @__PURE__ */ new Date(from + "T00:00:00"), t = /* @__PURE__ */ new Date(to + "T00:00:00");
  const d = (x, withYear) => x.toLocaleDateString("pt-BR", { day: "numeric", month: "short", ...withYear ? { year: "numeric" } : {} });
  return `${d(f, f.getFullYear() !== t.getFullYear())} \u2013 ${d(t, true)}`;
}
var PRESET_ICONS = {
  today: Sun,
  yesterday: History,
  week_to_date: CalendarDays,
  last_week: CalendarDays,
  month_to_date: Calendar,
  last_month: Calendar,
  quarter_to_date: CalendarClock,
  last_quarter: CalendarClock,
  year_to_date: CalendarCheck,
  last_year: CalendarCheck
};
var presetLabel = (id) => PRESETS.find((p) => p.id === id)?.label ?? "Personalizado";
var compareLabel = (c) => c === "year" ? "Ano anterior" : "Per\xEDodo anterior";
function DateRangePicker({ value, onApply }) {
  const [open, setOpen] = useState2(false);
  const [tab, setTab] = useState2(value.preset === "custom" ? "custom" : "presets");
  const [draft, setDraft] = useState2(value);
  useEffect3(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  const openPicker = () => {
    setDraft(value);
    setTab(value.preset === "custom" ? "custom" : "presets");
    setOpen(true);
  };
  const pickPreset = (id) => {
    const { from, to } = computePreset(id);
    setDraft((d) => ({ ...d, preset: id, from, to }));
  };
  const apply = () => {
    onApply(draft);
    setOpen(false);
  };
  const comp = comparisonRange(value.from, value.to, value.compare);
  const draftComp = comparisonRange(draft.from, draft.to, draft.compare);
  return /* @__PURE__ */ jsxs8("div", { className: "flex justify-start", children: [
    /* @__PURE__ */ jsxs8(
      "button",
      {
        onClick: openPicker,
        title: `vs. ${compareLabel(value.compare)} (${fmtRange(comp.from, comp.to)})`,
        className: "inline-flex max-w-full items-center gap-2 rounded-lg border border-borda-controle bg-branco px-3 py-1.5 text-[13px] text-gray-600 transition-colors hover:border-roxo hover:text-preto pointer-coarse:min-h-10",
        children: [
          /* @__PURE__ */ jsx13(Calendar, { size: 14, strokeWidth: 1.5, className: "shrink-0 text-gray-500" }),
          /* @__PURE__ */ jsx13("span", { className: "truncate font-medium text-preto", children: presetLabel(value.preset) }),
          /* @__PURE__ */ jsxs8("span", { className: "truncate text-gray-500", children: [
            "(",
            fmtRange(value.from, value.to),
            ")"
          ] }),
          /* @__PURE__ */ jsx13(ChevronDown, { size: 14, className: "shrink-0 text-gray-500" })
        ]
      }
    ),
    open && createPortal3(
      // Mesma lição do Modal: o card é limitado a `100dvh - 2rem` e ROLA por
      // dentro. Antes, num celular (360x640) o lightbox era mais alto que a
      // tela e as datas / o botão "Atualizar" ficavam cortados e inalcançáveis.
      /* @__PURE__ */ jsx13("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-preto/40 p-4", onClick: () => setOpen(false), children: /* @__PURE__ */ jsxs8(
        "div",
        {
          className: "max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto overscroll-contain rounded-2xl bg-branco shadow-xl",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-between border-b border-gray-100 px-6 py-4", children: [
              /* @__PURE__ */ jsxs8("p", { className: "flex items-center gap-2 text-[15px] font-semibold text-preto", children: [
                /* @__PURE__ */ jsx13(Calendar, { size: 18, strokeWidth: 1.5, className: "text-roxo" }),
                " Selecione um per\xEDodo"
              ] }),
              /* @__PURE__ */ jsx13("button", { onClick: () => setOpen(false), className: "flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-600", children: /* @__PURE__ */ jsx13(X3, { size: 16, strokeWidth: 1.5 }) })
            ] }),
            /* @__PURE__ */ jsx13("div", { className: "grid grid-cols-2 border-b border-gray-100", children: ["presets", "custom"].map((tb) => /* @__PURE__ */ jsxs8(
              "button",
              {
                onClick: () => setTab(tb),
                className: `flex items-center justify-center gap-1.5 py-3.5 text-[14px] font-medium ${tab === tb ? "border-b-2 border-roxo text-roxo" : "text-gray-500 hover:text-preto"}`,
                children: [
                  tb === "presets" ? /* @__PURE__ */ jsx13(CalendarCheck, { size: 15, strokeWidth: 1.5 }) : /* @__PURE__ */ jsx13(Calendar, { size: 15, strokeWidth: 1.5 }),
                  tb === "presets" ? "Predefinidos" : "Personalizado"
                ]
              },
              tb
            )) }),
            tab === "presets" ? (
              // 1 coluna em telas estreitas (2 colunas de ~150px cortavam
              // rótulos como "Trimestre passado"); `min-h` só a partir de sm.
              // EXCEÇÃO REGISTRADA (JET-102, decisão de design): os cartões de
              // opção — estes e os de "Comparar com" abaixo — ficam em
              // `gray-200`. Cada cartão tem ícone (gray-500, 4.83:1) e rótulo
              // (gray-600, 7.56:1): é o RÓTULO que identifica o controle, então
              // a borda não é informação exigida pela WCAG 1.4.11. E o estado
              // selecionado é `border-roxo` + `bg-roxo/5` + peso — escurecer as
              // bordas não-selecionadas encolheria justamente o contraste entre
              // selecionado e não-selecionado, que É exigido pela 1.4.11.
              // Reavaliar só se o cartão perder o rótulo de texto.
              /* @__PURE__ */ jsx13("div", { className: "grid grid-cols-1 content-start gap-2.5 p-5 sm:min-h-[320px] sm:grid-cols-2", children: PRESETS.map((p) => {
                const Ic = PRESET_ICONS[p.id] ?? Calendar;
                const on = draft.preset === p.id;
                return /* @__PURE__ */ jsxs8(
                  "button",
                  {
                    onClick: () => pickPreset(p.id),
                    className: `flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-[14px] transition-colors ${on ? "border-roxo bg-roxo/5 font-semibold text-roxo" : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`,
                    children: [
                      /* @__PURE__ */ jsx13(Ic, { size: 18, strokeWidth: 1.5, className: on ? "text-roxo" : "text-gray-500" }),
                      p.label
                    ]
                  },
                  p.id
                );
              }) })
            ) : /* @__PURE__ */ jsxs8("div", { className: "flex flex-col justify-center gap-4 p-6 sm:min-h-[320px]", children: [
              /* @__PURE__ */ jsxs8("label", { className: "block", children: [
                /* @__PURE__ */ jsxs8("span", { className: "mb-1.5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-gray-500", children: [
                  /* @__PURE__ */ jsx13(CalendarDays, { size: 16, strokeWidth: 1.5, className: "text-roxo" }),
                  " Data inicial"
                ] }),
                /* @__PURE__ */ jsx13(
                  "input",
                  {
                    type: "date",
                    value: draft.from,
                    max: draft.to || void 0,
                    onChange: (e) => setDraft((d) => ({ ...d, preset: "custom", from: e.target.value })),
                    className: "h-14 w-full rounded-xl border border-borda-controle px-4 text-[18px] font-bold text-preto focus:border-roxo focus:outline-none focus:ring-2 focus:ring-roxo/20"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs8("label", { className: "block", children: [
                /* @__PURE__ */ jsxs8("span", { className: "mb-1.5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-gray-500", children: [
                  /* @__PURE__ */ jsx13(CalendarCheck, { size: 16, strokeWidth: 1.5, className: "text-roxo" }),
                  " Data final"
                ] }),
                /* @__PURE__ */ jsx13(
                  "input",
                  {
                    type: "date",
                    value: draft.to,
                    min: draft.from || void 0,
                    onChange: (e) => setDraft((d) => ({ ...d, preset: "custom", to: e.target.value })),
                    className: "h-14 w-full rounded-xl border border-borda-controle px-4 text-[18px] font-bold text-preto focus:border-roxo focus:outline-none focus:ring-2 focus:ring-roxo/20"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx13("p", { className: "w-full rounded-xl bg-roxo/5 px-4 py-3.5 text-center text-[14px] font-semibold text-roxo", children: draft.from && draft.to ? fmtRange(draft.from, draft.to) : "Selecione as duas datas" })
            ] }),
            /* @__PURE__ */ jsxs8("p", { className: "flex items-center gap-1.5 border-t border-gray-100 px-6 pt-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500", children: [
              /* @__PURE__ */ jsx13(History, { size: 13, strokeWidth: 1.5 }),
              " Comparar com"
            ] }),
            /* @__PURE__ */ jsx13("div", { className: "grid grid-cols-1 gap-2.5 px-5 py-3 sm:grid-cols-2", children: ["period", "year"].map((c) => {
              const on = draft.compare === c;
              return /* @__PURE__ */ jsxs8(
                "button",
                {
                  onClick: () => setDraft((d) => ({ ...d, compare: c })),
                  className: `flex items-center gap-3 rounded-xl border px-4 py-3 text-[14px] transition-colors ${on ? "border-roxo bg-roxo/5 font-semibold text-roxo" : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`,
                  children: [
                    c === "year" ? /* @__PURE__ */ jsx13(CalendarCheck, { size: 17, strokeWidth: 1.5, className: on ? "text-roxo" : "text-gray-500" }) : /* @__PURE__ */ jsx13(History, { size: 17, strokeWidth: 1.5, className: on ? "text-roxo" : "text-gray-500" }),
                    compareLabel(c)
                  ]
                },
                c
              );
            }) }),
            /* @__PURE__ */ jsxs8("div", { className: "flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-6 py-4", children: [
              /* @__PURE__ */ jsxs8("span", { className: "min-w-0 text-[12px] text-gray-500", children: [
                fmtRange(draft.from, draft.to),
                " ",
                /* @__PURE__ */ jsx13("span", { className: "text-gray-300", children: "\xB7" }),
                " vs. ",
                fmtRange(draftComp.from, draftComp.to)
              ] }),
              /* @__PURE__ */ jsx13("button", { onClick: apply, className: "shrink-0 rounded-lg bg-roxo px-6 py-2.5 text-[13px] font-semibold text-branco hover:bg-roxo-hover", children: "Atualizar" })
            ] })
          ]
        }
      ) }),
      document.body
    )
  ] });
}

// src/components/AppRail.tsx
import { memo } from "react";
import { ChevronRight } from "lucide-react";
import { jsx as jsx14, jsxs as jsxs9 } from "react/jsx-runtime";
var AppRail = memo(function AppRail2({
  items: items2,
  bottomItems,
  activeId,
  onNavigate,
  onPrefetch,
  logoSrc = "/icone.svg",
  onExpand,
  hideOnMobile
}) {
  const renderItem = (item) => /* @__PURE__ */ jsxs9(
    "button",
    {
      title: item.label,
      "aria-current": activeId === item.id ? "page" : void 0,
      onClick: () => onNavigate(item.id),
      onMouseEnter: () => onPrefetch?.(item.id),
      className: cn(
        "group/rail-item relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-150",
        activeId === item.id ? "border border-rail-active-border bg-rail-active-bg text-white" : "text-[#9CA3AF] hover:bg-rail-icon-hover hover:text-rail-icon-hover-text"
      ),
      children: [
        /* @__PURE__ */ jsx14(item.icon, { size: 20, strokeWidth: 1.5 }),
        item.badge != null && item.badge > 0 && /* @__PURE__ */ jsx14("span", { className: "absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-rail-bg", children: item.badge > 9 ? "9+" : item.badge }),
        /* @__PURE__ */ jsx14("span", { className: "pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-rail-bg px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover/rail-item:opacity-100", children: item.label })
      ]
    },
    item.id
  );
  return /* @__PURE__ */ jsxs9(
    "div",
    {
      className: cn(
        "fixed left-0 top-0 z-50 h-full w-[78px] flex-col items-center bg-rail-bg py-5",
        hideOnMobile ? "hidden lg:flex" : "flex"
      ),
      children: [
        /* @__PURE__ */ jsx14("div", { className: "absolute -right-4 top-0 h-4 w-4 bg-rail-bg", children: /* @__PURE__ */ jsx14("div", { className: "h-full w-full rounded-tl-full bg-page-bg" }) }),
        /* @__PURE__ */ jsx14("div", { className: "absolute -right-4 bottom-0 h-4 w-4 bg-rail-bg", children: /* @__PURE__ */ jsx14("div", { className: "h-full w-full rounded-bl-full bg-page-bg" }) }),
        /* @__PURE__ */ jsx14("div", { className: "mb-6 flex h-10 w-10 items-center justify-center", children: /* @__PURE__ */ jsx14("img", { src: logoSrc, alt: "JETOOH", width: 32, height: 32, className: "h-8 w-8 invert" }) }),
        /* @__PURE__ */ jsx14("nav", { className: "flex flex-1 flex-col items-center gap-1", children: items2.map(renderItem) }),
        (bottomItems?.length || onExpand) && /* @__PURE__ */ jsxs9("div", { className: "flex flex-col items-center gap-1", children: [
          bottomItems?.map(renderItem),
          onExpand && /* @__PURE__ */ jsx14(
            "button",
            {
              onClick: onExpand,
              "aria-label": "Expandir menu",
              className: "flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-roxo transition-colors hover:bg-white/20",
              children: /* @__PURE__ */ jsx14(ChevronRight, { size: 18, strokeWidth: 2 })
            }
          )
        ] })
      ]
    }
  );
});

// src/components/AppSecondarySidebar.tsx
import { memo as memo2 } from "react";
import { ChevronLeft } from "lucide-react";
import { jsx as jsx15, jsxs as jsxs10 } from "react/jsx-runtime";
var AppSecondarySidebar = memo2(function AppSecondarySidebar2({
  sections,
  activeId,
  onNavigate,
  onPrefetch,
  footer,
  onCollapse,
  collapseLabel = "Recolher",
  hideOnMobile,
  className
}) {
  if (sections.length === 0) return null;
  return /* @__PURE__ */ jsx15(
    "aside",
    {
      className: cn(
        "fixed left-[78px] top-0 z-40 h-full w-[220px] bg-page-bg",
        hideOnMobile ? "hidden lg:flex" : "flex",
        className
      ),
      children: /* @__PURE__ */ jsxs10("div", { className: "sidebar-scroll flex max-h-full w-full flex-col overflow-y-auto pt-[84px]", children: [
        /* @__PURE__ */ jsx15("nav", { className: "pb-4 pl-6 pr-5", children: sections.map((section) => /* @__PURE__ */ jsxs10("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx15("h3", { className: "mb-2 pl-3 text-[11px] font-bold uppercase tracking-widest text-preto", children: section.heading }),
          /* @__PURE__ */ jsx15("ul", { className: "flex flex-col gap-0.5", children: section.items.map((item) => {
            const isActive = activeId === item.id;
            return /* @__PURE__ */ jsx15("li", { children: /* @__PURE__ */ jsxs10(
              "button",
              {
                onClick: () => onNavigate(item.id),
                onMouseEnter: () => onPrefetch?.(item.id),
                "aria-current": isActive ? "page" : void 0,
                className: cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-all duration-150",
                  isActive ? "bg-secondary-active-bg font-medium text-secondary-active" : "text-secondary-text hover:text-secondary-text-hover"
                ),
                children: [
                  /* @__PURE__ */ jsx15(
                    item.icon,
                    {
                      size: 15,
                      strokeWidth: 1.5,
                      className: isActive ? "text-secondary-active" : "text-gray-500"
                    }
                  ),
                  /* @__PURE__ */ jsx15("span", { className: "flex-1 text-left", children: item.label }),
                  item.badge != null && item.badge > 0 && /* @__PURE__ */ jsx15("span", { className: "flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white", children: item.badge > 9 ? "9+" : item.badge })
                ]
              }
            ) }, item.id);
          }) })
        ] }, section.heading)) }),
        footer,
        onCollapse && /* @__PURE__ */ jsx15("div", { className: "mt-auto border-t border-gray-200/60 py-3 pl-6 pr-5", children: /* @__PURE__ */ jsxs10(
          "button",
          {
            onClick: onCollapse,
            className: "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-gray-600",
            children: [
              /* @__PURE__ */ jsx15(ChevronLeft, { size: 14, strokeWidth: 1.5 }),
              /* @__PURE__ */ jsx15("span", { children: collapseLabel })
            ]
          }
        ) })
      ] })
    }
  );
});
var AppSubNav = memo2(function AppSubNav2({
  items: items2,
  activeId,
  onNavigate,
  className
}) {
  if (items2.length <= 1) return null;
  return /* @__PURE__ */ jsx15(
    "div",
    {
      className: cn(
        // Scrollbar escondida (a barra nativa cobria o rótulo em telas curtas) e
        // `overscroll-x-contain` para o swipe lateral não navegar a página.
        "sticky top-0 z-10 flex gap-1.5 overflow-x-auto overscroll-x-contain border-b border-gray-200 bg-branco px-4 py-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden",
        className
      ),
      children: items2.map((item) => {
        const isActive = activeId === item.id;
        return /* @__PURE__ */ jsxs10(
          "button",
          {
            onClick: () => onNavigate(item.id),
            "aria-current": isActive ? "page" : void 0,
            className: cn(
              // `min-h-10`: alvo de toque de 40px (era 32) — WCAG 2.5.8.
              "flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] transition-colors",
              isActive ? "bg-secondary-active-bg font-medium text-secondary-active" : "text-gray-600 hover:text-preto"
            ),
            children: [
              /* @__PURE__ */ jsx15(item.icon, { size: 14, strokeWidth: 1.5 }),
              /* @__PURE__ */ jsx15("span", { children: item.label })
            ]
          },
          item.id
        );
      })
    }
  );
});

// src/components/ContentHeader.tsx
import { ChevronDown as ChevronDown2 } from "lucide-react";
import { Fragment, jsx as jsx16, jsxs as jsxs11 } from "react/jsx-runtime";
function ContentHeader({
  icon: Icon2,
  moduleTitle,
  subTitle,
  description,
  customLeft,
  children,
  className
}) {
  return /* @__PURE__ */ jsxs11(
    "div",
    {
      className: `sticky top-0 z-10 flex items-center justify-between gap-3 rounded-t-xl border-b border-gray-100 bg-branco/95 px-4 py-4 backdrop-blur-sm xl:px-8 ${className ?? ""}`,
      children: [
        customLeft ?? // `min-w-0` deixa o bloco de título encolher (senão empurra as ações
        // para fora); `truncate` evita que título longo quebre o header.
        /* @__PURE__ */ jsxs11("div", { className: "flex min-w-0 items-center gap-3 xl:gap-4", children: [
          /* @__PURE__ */ jsx16("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-roxo/10 text-roxo", children: /* @__PURE__ */ jsx16(Icon2, { size: 20, strokeWidth: 1.5 }) }),
          /* @__PURE__ */ jsxs11("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxs11("div", { className: "flex min-w-0 items-center gap-1", children: [
              /* @__PURE__ */ jsx16("h1", { className: "truncate text-xl font-bold text-preto xl:text-2xl", children: moduleTitle }),
              subTitle && /* @__PURE__ */ jsxs11(Fragment, { children: [
                /* @__PURE__ */ jsx16(ChevronDown2, { size: 16, strokeWidth: 1.5, className: "shrink-0 -rotate-90 text-gray-300" }),
                /* @__PURE__ */ jsx16("span", { className: "truncate text-xl font-bold text-preto xl:text-2xl", children: subTitle })
              ] })
            ] }),
            description && /* @__PURE__ */ jsx16("p", { className: "mt-0.5 truncate text-[12px] text-gray-500", children: description })
          ] })
        ] }),
        /* @__PURE__ */ jsx16("div", { className: "flex shrink-0 items-center gap-2 xl:gap-3", children })
      ]
    }
  );
}

// src/components/AppFooter.tsx
import { memo as memo3 } from "react";
import { Globe, MessageCircle, Mail, ExternalLink } from "lucide-react";
import { jsx as jsx17, jsxs as jsxs12 } from "react/jsx-runtime";
var socialLinks = [
  { icon: Globe, href: "#", label: "Website" },
  { icon: MessageCircle, href: "#", label: "WhatsApp" },
  { icon: Mail, href: "#", label: "Email" },
  { icon: ExternalLink, href: "#", label: "Link" }
];
var footerLinks = [
  { label: "Suporte", href: "#" },
  { label: "Termos de Uso", href: "#" },
  { label: "Pol\xEDtica de Privacidade", href: "#" }
];
var AppFooter = memo3(function AppFooter2() {
  return /* @__PURE__ */ jsxs12("footer", { className: "mt-auto flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8", children: [
    /* @__PURE__ */ jsx17("p", { className: "text-xs text-gray-500", children: "\xA9 2026 Jetooh. Todos os direitos reservados." }),
    /* @__PURE__ */ jsxs12("div", { className: "flex flex-wrap items-center gap-4", children: [
      footerLinks.map((link) => /* @__PURE__ */ jsx17(
        "a",
        {
          href: link.href,
          className: "inline-flex items-center text-xs text-gray-500 transition-colors hover:text-gray-600 pointer-coarse:min-h-10",
          children: link.label
        },
        link.label
      )),
      /* @__PURE__ */ jsx17("div", { className: "flex items-center gap-2", children: socialLinks.map((social) => /* @__PURE__ */ jsx17(
        "a",
        {
          href: social.href,
          "aria-label": social.label,
          className: "flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-600 pointer-coarse:h-10 pointer-coarse:w-10",
          children: /* @__PURE__ */ jsx17(social.icon, { size: 14, strokeWidth: 1.5 })
        },
        social.label
      )) })
    ] })
  ] });
});

// src/components/PageFrame.tsx
import { jsx as jsx18, jsxs as jsxs13 } from "react/jsx-runtime";
function PageFrame({
  rail,
  mobileHeader,
  extras,
  header,
  mobileTitle,
  footer,
  mobileBottomNav,
  children,
  mainId,
  contentAreaClassName,
  fullBleed,
  contentKey
}) {
  return (
    // Altura da casca em `100dvh` (dynamic viewport) quando o browser suporta:
    // no mobile a barra de URL entra/sai e `100vh` MENTE (é maior que a área
    // visível), cortando o fim do conteúdo/rodapé. `h-screen` fica de fallback
    // via `@supports`. Mesma lição já aplicada no login do auth.
    /* @__PURE__ */ jsxs13("div", { className: "h-screen overflow-hidden bg-page-bg supports-[height:100dvh]:h-dvh", children: [
      /* @__PURE__ */ jsx18(
        "a",
        {
          href: `#${mainId}`,
          className: "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[10001] focus:rounded-lg focus:bg-roxo focus:px-4 focus:py-2 focus:text-[13px] focus:font-semibold focus:text-branco",
          children: "Pular para o conte\xFAdo"
        }
      ),
      mobileHeader,
      rail,
      extras,
      /* @__PURE__ */ jsx18("div", { className: cn("flex h-screen flex-col supports-[height:100dvh]:h-dvh", contentAreaClassName), children: /* @__PURE__ */ jsxs13(
        "div",
        {
          className: cn(
            "flex min-h-0 flex-1 flex-col bg-branco lg:rounded-xl lg:border lg:border-gray-200",
            fullBleed && "overflow-hidden"
          ),
          children: [
            header && /* @__PURE__ */ jsx18("div", { className: "sticky top-0 z-10 hidden lg:block", children: header }),
            mobileTitle && /* @__PURE__ */ jsx18("div", { className: "block px-4 pb-1 pt-3 lg:hidden", children: mobileTitle }),
            /* @__PURE__ */ jsx18(
              "div",
              {
                role: "main",
                id: mainId,
                className: cn("min-h-0 flex-1", !fullBleed && "content-scroll overflow-y-auto"),
                children: /* @__PURE__ */ jsxs13("div", { className: cn("flex flex-col", fullBleed ? "h-full" : "min-h-full"), children: [
                  /* @__PURE__ */ jsx18("div", { className: "min-h-0 flex-1 animate-fade-in-up", children }, contentKey),
                  footer,
                  mobileBottomNav && /* @__PURE__ */ jsx18("div", { "aria-hidden": true, className: "h-[env(safe-area-inset-bottom)] shrink-0 lg:hidden" })
                ] })
              }
            )
          ]
        }
      ) }),
      mobileBottomNav
    ] })
  );
}

// src/components/AppBottomNav.tsx
import { memo as memo4 } from "react";
import { jsx as jsx19, jsxs as jsxs14 } from "react/jsx-runtime";
var AppBottomNav = memo4(function AppBottomNav2({ items: items2, activeId, onNavigate }) {
  return (
    // `min-h-14` + `pb-[env(safe-area-inset-bottom)]`: em telas com home
    // indicator (iPhone) a barra ficava embaixo do gesto do sistema. O respiro
    // extra é devolvido ao conteúdo pelo espaçador do PageFrame.
    /* @__PURE__ */ jsx19("nav", { className: "fixed bottom-0 left-0 right-0 z-30 flex min-h-14 items-stretch justify-around border-t border-gray-200 bg-branco/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden", children: items2.map((item) => {
      const active = activeId === item.id;
      return /* @__PURE__ */ jsxs14(
        "button",
        {
          onClick: () => onNavigate(item.id),
          "aria-current": active ? "page" : void 0,
          className: cn(
            // `min-w-0 flex-1` + `truncate`: com 5-6 abas em 360px os rótulos
            // dividem a barra por igual em vez de estourá-la.
            "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[10px] transition-all duration-150 [&>span]:max-w-full [&>span]:truncate",
            active ? "font-semibold text-roxo" : "text-gray-500"
          ),
          children: [
            /* @__PURE__ */ jsx19(item.icon, { size: 20, strokeWidth: active ? 2 : 1.5 }),
            /* @__PURE__ */ jsx19("span", { children: item.label })
          ]
        },
        item.id
      );
    }) })
  );
});

// src/components/AppMobileHeader.tsx
import { Menu } from "lucide-react";
import { jsx as jsx20, jsxs as jsxs15 } from "react/jsx-runtime";
function AppMobileHeader({ onMenuToggle, logoSrc = "/icone.svg", actions, userMenu }) {
  return (
    // `gap-2` + `min-w-0`: com ações extras (busca/sino) o bloco da direita não
    // pode empurrar o logo para fora da barra.
    /* @__PURE__ */ jsxs15("header", { className: "fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-gray-200 bg-branco px-4 lg:hidden", children: [
      /* @__PURE__ */ jsxs15("div", { className: "flex min-w-0 items-center gap-2", children: [
        onMenuToggle && /* @__PURE__ */ jsx20(
          "button",
          {
            onClick: onMenuToggle,
            "aria-label": "Abrir menu",
            className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100",
            children: /* @__PURE__ */ jsx20(Menu, { size: 20, strokeWidth: 1.5 })
          }
        ),
        /* @__PURE__ */ jsx20("img", { src: logoSrc, alt: "JETOOH", width: 24, height: 24, className: "h-6 w-6 shrink-0" })
      ] }),
      /* @__PURE__ */ jsxs15("div", { className: "flex shrink-0 items-center gap-1", children: [
        actions,
        userMenu
      ] })
    ] })
  );
}

// src/components/UserMenu.tsx
import { useState as useState3 } from "react";
import { LogOut, User, Moon, Sun as Sun2 } from "lucide-react";
import { Fragment as Fragment2, jsx as jsx21, jsxs as jsxs16 } from "react/jsx-runtime";
function UserMenu({
  name,
  email,
  avatarUrl,
  initials,
  items: items2,
  accountHref,
  isDark,
  onToggleTheme,
  onLogout,
  avatarSize = "sm"
}) {
  const [open, setOpen] = useState3(false);
  const menuItems = [
    ...accountHref ? [{ label: "Minha Conta", icon: User, href: accountHref }] : [],
    ...items2 ?? []
  ];
  const rich = Boolean(email || menuItems.length > 0 || onToggleTheme);
  const avatarCls = avatarSize === "md" ? "h-10 w-10" : "h-8 w-8";
  const runItem = (it) => {
    setOpen(false);
    if (it.onClick) it.onClick();
    else if (it.href) window.location.href = it.href;
  };
  return /* @__PURE__ */ jsxs16("div", { className: "relative ml-1", children: [
    /* @__PURE__ */ jsx21(
      "button",
      {
        onClick: () => setOpen((v) => !v),
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-label": "Menu do usu\xE1rio",
        className: "flex items-center justify-center pointer-coarse:min-h-10 pointer-coarse:min-w-10",
        children: /* @__PURE__ */ jsxs16(Avatar, { className: `${avatarCls} border border-gray-200`, children: [
          avatarUrl && /* @__PURE__ */ jsx21(AvatarImage, { src: avatarUrl, alt: name, className: "object-cover" }),
          /* @__PURE__ */ jsx21(AvatarFallback, { className: "bg-roxo text-xs font-semibold text-branco", children: initials })
        ] })
      }
    ),
    open && /* @__PURE__ */ jsxs16(Fragment2, { children: [
      /* @__PURE__ */ jsx21("div", { className: "fixed inset-0 z-40", onClick: () => setOpen(false) }),
      rich ? /* @__PURE__ */ jsxs16(
        "div",
        {
          role: "menu",
          className: "absolute right-0 top-10 z-50 w-60 overflow-hidden rounded-xl border border-gray-200 bg-branco py-1.5 shadow-lg",
          children: [
            (name || email) && /* @__PURE__ */ jsxs16("div", { className: "border-b border-gray-100 px-4 py-3", children: [
              /* @__PURE__ */ jsx21("p", { className: "text-sm font-medium text-preto", children: name || "\u2014" }),
              email && /* @__PURE__ */ jsx21("p", { className: "text-xs text-gray-500", children: email })
            ] }),
            /* @__PURE__ */ jsxs16("div", { className: "py-1.5", children: [
              menuItems.map((it, i) => {
                const Icon2 = it.icon;
                return /* @__PURE__ */ jsxs16(
                  "button",
                  {
                    role: "menuitem",
                    onClick: () => runItem(it),
                    className: "flex w-full items-center gap-3 px-4 py-2 text-[13px] text-gray-600 transition-colors hover:bg-gray-50 hover:text-preto",
                    children: [
                      Icon2 && /* @__PURE__ */ jsx21(Icon2, { size: 15, strokeWidth: 1.5 }),
                      it.label
                    ]
                  },
                  `${it.label}-${i}`
                );
              }),
              onToggleTheme && /* @__PURE__ */ jsxs16("div", { className: "flex w-full items-center gap-3 px-4 py-2 text-[13px] text-gray-600", children: [
                isDark ? /* @__PURE__ */ jsx21(Sun2, { size: 15, strokeWidth: 1.5 }) : /* @__PURE__ */ jsx21(Moon, { size: 15, strokeWidth: 1.5 }),
                /* @__PURE__ */ jsx21("span", { className: "flex-1 text-left", children: "Tema Escuro" }),
                /* @__PURE__ */ jsx21(
                  Switch,
                  {
                    checked: Boolean(isDark),
                    onCheckedChange: () => onToggleTheme(),
                    size: "sm",
                    label: "Alternar tema escuro"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx21("div", { className: "border-t border-gray-100 pt-1.5", children: /* @__PURE__ */ jsxs16(
              "button",
              {
                role: "menuitem",
                onClick: () => {
                  setOpen(false);
                  onLogout();
                },
                className: "flex w-full items-center gap-3 px-4 py-2 text-[13px] text-gray-600 transition-colors hover:bg-gray-50 hover:text-preto",
                children: [
                  /* @__PURE__ */ jsx21(LogOut, { size: 15, strokeWidth: 1.5 }),
                  "Sair"
                ]
              }
            ) })
          ]
        }
      ) : /* @__PURE__ */ jsx21(
        "div",
        {
          role: "menu",
          className: "absolute right-0 top-10 z-50 w-44 overflow-hidden rounded-xl border border-gray-100 bg-branco py-1.5 shadow-lg",
          children: /* @__PURE__ */ jsxs16(
            "button",
            {
              role: "menuitem",
              onClick: () => {
                setOpen(false);
                onLogout();
              },
              className: "flex w-full items-center gap-3 px-4 py-2 text-[13px] text-gray-600 transition-colors hover:bg-gray-50 hover:text-preto",
              children: [
                /* @__PURE__ */ jsx21(LogOut, { size: 15, strokeWidth: 1.5 }),
                "Sair"
              ]
            }
          )
        }
      )
    ] })
  ] });
}

// src/components/AppUserMenu.tsx
import { Settings, User as User2 } from "lucide-react";
import { jsx as jsx22 } from "react/jsx-runtime";
var USER_MENU_PROFILE_LABEL = "Minha Conta";
var USER_MENU_SETTINGS_LABEL = "Configura\xE7\xF5es";
function AppUserMenu({
  name,
  email,
  avatarUrl,
  initials,
  onProfile,
  onSettings,
  extraItems,
  isDark,
  onToggleTheme,
  onLogout,
  avatarSize = "md"
}) {
  const items2 = [
    ...onProfile ? [{ label: USER_MENU_PROFILE_LABEL, icon: User2, onClick: onProfile }] : [],
    ...onSettings ? [{ label: USER_MENU_SETTINGS_LABEL, icon: Settings, onClick: onSettings }] : [],
    ...extraItems ?? []
  ];
  return /* @__PURE__ */ jsx22(
    UserMenu,
    {
      name,
      email,
      avatarUrl,
      initials,
      items: items2,
      isDark,
      onToggleTheme,
      onLogout,
      avatarSize
    }
  );
}

// src/components/EmptyState.tsx
import { jsx as jsx23, jsxs as jsxs17 } from "react/jsx-runtime";
function EmptyState({ icon: Icon2, title, description, actionLabel, onAction }) {
  return /* @__PURE__ */ jsxs17("div", { className: "flex flex-col items-center justify-center px-4 py-16 text-center", children: [
    /* @__PURE__ */ jsx23("div", { className: "mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-300", children: /* @__PURE__ */ jsx23(Icon2, { size: 28, strokeWidth: 1.5, "aria-hidden": "true" }) }),
    /* @__PURE__ */ jsx23("h3", { className: "mb-1 text-[15px] font-semibold text-preto", children: title }),
    description && /* @__PURE__ */ jsx23("p", { className: "mb-5 max-w-sm text-[13px] text-gray-500", children: description }),
    actionLabel && onAction && /* @__PURE__ */ jsx23(
      Button,
      {
        size: "default",
        className: "gap-2 bg-roxo px-5 text-[13px] font-semibold text-branco hover:bg-roxo-hover",
        onClick: onAction,
        children: actionLabel
      }
    )
  ] });
}
function SearchEmptyState({ query }) {
  return /* @__PURE__ */ jsxs17("div", { className: "flex flex-col items-center justify-center px-4 py-12", children: [
    /* @__PURE__ */ jsx23("div", { className: "mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-300", children: /* @__PURE__ */ jsxs17("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsx23("circle", { cx: "11", cy: "11", r: "8" }),
      /* @__PURE__ */ jsx23("path", { d: "m21 21-4.3-4.3" })
    ] }) }),
    /* @__PURE__ */ jsx23("h3", { className: "mb-1 text-[14px] font-semibold text-preto", children: "Nenhum resultado encontrado" }),
    /* @__PURE__ */ jsxs17("p", { className: "text-center text-[13px] text-gray-500", children: [
      'Nenhum resultado para "',
      query,
      '". Tente outro termo.'
    ] })
  ] });
}

// src/components/Input.tsx
import * as React2 from "react";
import { jsx as jsx24 } from "react/jsx-runtime";
var Input = React2.forwardRef(({ className, type, ...props }, ref) => {
  return /* @__PURE__ */ jsx24(
    "input",
    {
      type,
      className: cn(
        // Em telas de toque: `min-h-10` (40px de alvo, o py-2 dá 38) e
        // `text-[16px]` — abaixo de 16px o Safari do iOS DÁ ZOOM ao focar o
        // campo, e o zoom desloca/estoura o layout da página.
        "flex w-full rounded-lg border border-borda-controle bg-branco px-3 py-2 text-[14px] text-preto outline-hidden transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:border-roxo focus:ring-1 focus:ring-roxo/30 disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:min-h-10 pointer-coarse:text-[16px]",
        className
      ),
      ref,
      ...props
    }
  );
});
Input.displayName = "Input";

// src/components/DateTimeField.tsx
import { CalendarClock as CalendarClock2 } from "lucide-react";

// src/components/Label.tsx
import * as React3 from "react";
import { jsx as jsx25 } from "react/jsx-runtime";
var Label = React3.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx25(
    "label",
    {
      ref,
      className: cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      ),
      ...props
    }
  )
);
Label.displayName = "Label";

// src/components/DateTimeField.tsx
import { jsx as jsx26, jsxs as jsxs18 } from "react/jsx-runtime";
var pad = (n) => String(n).padStart(2, "0");
function isoToLocalInput(iso2) {
  if (!iso2) return "";
  const d = new Date(iso2);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function localInputToIso(local) {
  if (!local) return null;
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
function DateTimeField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  disabled,
  hint,
  className
}) {
  return /* @__PURE__ */ jsxs18("div", { className: cn("space-y-1.5", className), children: [
    label != null && /* @__PURE__ */ jsx26(Label, { htmlFor: id, children: label }),
    /* @__PURE__ */ jsxs18("div", { className: "relative", children: [
      /* @__PURE__ */ jsx26(
        CalendarClock2,
        {
          size: 15,
          strokeWidth: 1.75,
          className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        }
      ),
      /* @__PURE__ */ jsx26(
        Input,
        {
          id,
          type: "datetime-local",
          value: isoToLocalInput(value),
          onChange: (e) => onChange(localInputToIso(e.target.value)),
          min: min ? isoToLocalInput(min) : void 0,
          max: max ? isoToLocalInput(max) : void 0,
          disabled,
          className: "pl-9"
        }
      )
    ] }),
    hint != null && /* @__PURE__ */ jsx26("p", { className: "text-[12px] text-gray-500", children: hint })
  ] });
}

// src/components/Separator.tsx
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { jsx as jsx27 } from "react/jsx-runtime";
function Separator({
  className,
  orientation = "horizontal",
  ...props
}) {
  return /* @__PURE__ */ jsx27(
    SeparatorPrimitive,
    {
      "data-slot": "separator",
      orientation,
      className: cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      ),
      ...props
    }
  );
}

// src/components/Tooltip.tsx
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { jsx as jsx28, jsxs as jsxs19 } from "react/jsx-runtime";
function TooltipProvider({
  delay = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx28(
    TooltipPrimitive.Provider,
    {
      "data-slot": "tooltip-provider",
      delay,
      ...props
    }
  );
}
function Tooltip({ ...props }) {
  return /* @__PURE__ */ jsx28(TooltipPrimitive.Root, { "data-slot": "tooltip", ...props });
}
function TooltipTrigger({ ...props }) {
  return /* @__PURE__ */ jsx28(TooltipPrimitive.Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx28(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx28(
    TooltipPrimitive.Positioner,
    {
      align,
      alignOffset,
      side,
      sideOffset,
      className: "isolate z-50",
      children: /* @__PURE__ */ jsxs19(
        TooltipPrimitive.Popup,
        {
          "data-slot": "tooltip-content",
          className: cn(
            "z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          ),
          ...props,
          children: [
            children,
            /* @__PURE__ */ jsx28(TooltipPrimitive.Arrow, { className: "z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" })
          ]
        }
      )
    }
  ) });
}

// src/components/DropdownMenu.tsx
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { ChevronRight as ChevronRightIcon, Check as CheckIcon } from "lucide-react";
import { jsx as jsx29, jsxs as jsxs20 } from "react/jsx-runtime";
function DropdownMenu({ ...props }) {
  return /* @__PURE__ */ jsx29(MenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuPortal({ ...props }) {
  return /* @__PURE__ */ jsx29(MenuPrimitive.Portal, { "data-slot": "dropdown-menu-portal", ...props });
}
function DropdownMenuTrigger({ ...props }) {
  return /* @__PURE__ */ jsx29(MenuPrimitive.Trigger, { "data-slot": "dropdown-menu-trigger", ...props });
}
function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx29(MenuPrimitive.Portal, { children: /* @__PURE__ */ jsx29(
    MenuPrimitive.Positioner,
    {
      className: "isolate z-50 outline-none",
      align,
      alignOffset,
      side,
      sideOffset,
      children: /* @__PURE__ */ jsx29(
        MenuPrimitive.Popup,
        {
          "data-slot": "dropdown-menu-content",
          className: cn("z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95", className),
          ...props
        }
      )
    }
  ) });
}
function DropdownMenuGroup({ ...props }) {
  return /* @__PURE__ */ jsx29(MenuPrimitive.Group, { "data-slot": "dropdown-menu-group", ...props });
}
function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsx29(
    MenuPrimitive.GroupLabel,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn(
        "px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx29(
    MenuPrimitive.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuSub({ ...props }) {
  return /* @__PURE__ */ jsx29(MenuPrimitive.SubmenuRoot, { "data-slot": "dropdown-menu-sub", ...props });
}
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs20(
    MenuPrimitive.SubmenuTrigger,
    {
      "data-slot": "dropdown-menu-sub-trigger",
      "data-inset": inset,
      className: cn(
        "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-popup-open:bg-accent data-popup-open:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx29(ChevronRightIcon, { className: "ml-auto" })
      ]
    }
  );
}
function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx29(
    DropdownMenuContent,
    {
      "data-slot": "dropdown-menu-sub-content",
      className: cn("w-auto min-w-[96px] rounded-lg bg-popover p-1 text-popover-foreground ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className),
      align,
      alignOffset,
      side,
      sideOffset,
      ...props
    }
  );
}
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsxs20(
    MenuPrimitive.CheckboxItem,
    {
      "data-slot": "dropdown-menu-checkbox-item",
      "data-inset": inset,
      className: cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      checked,
      ...props,
      children: [
        /* @__PURE__ */ jsx29(
          "span",
          {
            className: "pointer-events-none absolute right-2 flex items-center justify-center",
            "data-slot": "dropdown-menu-checkbox-item-indicator",
            children: /* @__PURE__ */ jsx29(MenuPrimitive.CheckboxItemIndicator, { children: /* @__PURE__ */ jsx29(
              CheckIcon,
              {}
            ) })
          }
        ),
        children
      ]
    }
  );
}
function DropdownMenuRadioGroup({ ...props }) {
  return /* @__PURE__ */ jsx29(
    MenuPrimitive.RadioGroup,
    {
      "data-slot": "dropdown-menu-radio-group",
      ...props
    }
  );
}
function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsxs20(
    MenuPrimitive.RadioItem,
    {
      "data-slot": "dropdown-menu-radio-item",
      "data-inset": inset,
      className: cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx29(
          "span",
          {
            className: "pointer-events-none absolute right-2 flex items-center justify-center",
            "data-slot": "dropdown-menu-radio-item-indicator",
            children: /* @__PURE__ */ jsx29(MenuPrimitive.RadioItemIndicator, { children: /* @__PURE__ */ jsx29(
              CheckIcon,
              {}
            ) })
          }
        ),
        children
      ]
    }
  );
}
function DropdownMenuSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx29(
    MenuPrimitive.Separator,
    {
      "data-slot": "dropdown-menu-separator",
      className: cn("-mx-1 my-1 h-px bg-border", className),
      ...props
    }
  );
}
function DropdownMenuShortcut({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx29(
    "span",
    {
      "data-slot": "dropdown-menu-shortcut",
      className: cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground",
        className
      ),
      ...props
    }
  );
}

// src/components/Select.tsx
import * as React4 from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown as ChevronDown3, ChevronUp } from "lucide-react";
import { jsx as jsx30, jsxs as jsxs21 } from "react/jsx-runtime";
var Select = SelectPrimitive.Root;
var SelectGroup = SelectPrimitive.Group;
var SelectValue = SelectPrimitive.Value;
var SelectTrigger = React4.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs21(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex w-full items-center justify-between rounded-lg border border-borda-controle bg-branco px-3 py-2 text-[14px] text-preto outline-hidden transition-colors placeholder:text-gray-500 focus:border-roxo focus:ring-1 focus:ring-roxo/30 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx30(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx30(ChevronDown3, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
var SelectScrollUpButton = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx30(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx30(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
var SelectScrollDownButton = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx30(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx30(ChevronDown3, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
var SelectContent = React4.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx30(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs21(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-xl bg-branco text-preto ring-1 ring-foreground/10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx30(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx30(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx30(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
var SelectLabel = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx30(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("py-1.5 pl-8 pr-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
var SelectItem = React4.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs21(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-[13px] text-gray-600 outline-hidden transition-colors focus:bg-gray-50 focus:text-preto data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx30("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx30(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx30(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx30(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
var SelectSeparator = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx30(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

// src/components/NativeSelect.tsx
import * as React5 from "react";
import { ChevronDown as ChevronDown4 } from "lucide-react";
import { jsx as jsx31, jsxs as jsxs22 } from "react/jsx-runtime";
var NativeSelect = React5.forwardRef(
  ({ className, wrapperClassName, children, ...props }, ref) => /* @__PURE__ */ jsxs22("div", { className: cn("relative", wrapperClassName), children: [
    /* @__PURE__ */ jsx31(
      "select",
      {
        ref,
        className: cn(
          // Mesmo tratamento de toque do Input: 40px de alvo e fonte 16px
          // (evita o zoom automático do Safari iOS ao focar o campo).
          "flex w-full appearance-none items-center rounded-lg border border-borda-controle bg-branco px-3 py-2 pr-9 text-[14px] text-preto outline-hidden transition-colors focus:border-roxo focus:ring-1 focus:ring-roxo/30 disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:min-h-10 pointer-coarse:text-[16px]",
          className
        ),
        ...props,
        children
      }
    ),
    /* @__PURE__ */ jsx31(ChevronDown4, { className: "pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 opacity-50" })
  ] })
);
NativeSelect.displayName = "NativeSelect";

// src/components/ConfirmDialog.tsx
import { Loader2 } from "lucide-react";
import { Fragment as Fragment3, jsx as jsx32, jsxs as jsxs23 } from "react/jsx-runtime";
function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  loading = false,
  onConfirm,
  onClose
}) {
  return /* @__PURE__ */ jsxs23(
    Modal,
    {
      open,
      onClose,
      footer: /* @__PURE__ */ jsxs23(Fragment3, { children: [
        /* @__PURE__ */ jsx32(
          Button,
          {
            variant: "outline",
            size: "default",
            onClick: onClose,
            className: "border-gray-200 px-4 text-[13px] font-medium text-gray-600 hover:border-gray-300 hover:text-preto",
            children: cancelLabel
          }
        ),
        /* @__PURE__ */ jsxs23(
          Button,
          {
            size: "default",
            onClick: onConfirm,
            disabled: loading,
            className: `gap-2 px-5 text-[13px] font-semibold text-branco disabled:opacity-50 ${destructive ? "bg-status-critico hover:bg-status-critico/90" : "bg-roxo hover:bg-roxo-hover"}`,
            children: [
              loading && /* @__PURE__ */ jsx32(Loader2, { size: 14, className: "animate-spin" }),
              confirmLabel
            ]
          }
        )
      ] }),
      children: [
        /* @__PURE__ */ jsx32("h2", { className: "text-[15px] font-semibold text-preto", children: title }),
        /* @__PURE__ */ jsx32("div", { className: "mt-1 text-[13px] text-gray-500", children: description })
      ]
    }
  );
}

// src/components/AlertDialog.tsx
import * as React6 from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { jsx as jsx33, jsxs as jsxs24 } from "react/jsx-runtime";
var AlertDialog = AlertDialogPrimitive.Root;
var AlertDialogTrigger = AlertDialogPrimitive.Trigger;
var AlertDialogPortal = AlertDialogPrimitive.Portal;
var AlertDialogOverlay = React6.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx33(
  AlertDialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-[9999] bg-preto/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
var AlertDialogContent = React6.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs24(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsx33(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsx33(
    AlertDialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-[9999] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl border border-gray-200 bg-branco p-6 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx33("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx33(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = React6.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx33(
  AlertDialogPrimitive.Title,
  {
    ref,
    className: cn("text-[15px] font-semibold text-preto", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
var AlertDialogDescription = React6.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx33(
  AlertDialogPrimitive.Description,
  {
    ref,
    className: cn("text-[13px] text-gray-500", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
var AlertDialogAction = React6.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx33(
  AlertDialogPrimitive.Action,
  {
    ref,
    className: cn(
      buttonVariants(),
      "bg-roxo px-4 text-[13px] font-semibold text-branco hover:bg-roxo-hover",
      className
    ),
    ...props
  }
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
var AlertDialogCancel = React6.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx33(
  AlertDialogPrimitive.Cancel,
  {
    ref,
    className: cn(
      buttonVariants({ variant: "outline" }),
      // EXCEÇÃO REGISTRADA (JET-102): mesma do `ConfirmDialog` — o rótulo de
      // texto (gray-600 = 7.56:1) já identifica o botão, então a borda não é
      // informação exigida pela WCAG 1.4.11 e `gray-200` fica.
      "mt-2 border-gray-200 px-4 text-[13px] font-medium text-gray-600 hover:border-gray-300 hover:text-preto sm:mt-0",
      className
    ),
    ...props
  }
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

// src/components/SectionCard.tsx
import { jsx as jsx34, jsxs as jsxs25 } from "react/jsx-runtime";
function SectionCard({ icon: Icon2, title, action, children, className, bodyClassName }) {
  return /* @__PURE__ */ jsxs25(Card, { className: cn("gap-0 overflow-hidden p-0", className), children: [
    /* @__PURE__ */ jsxs25(CardHeader, { className: "items-center border-b border-gray-100 py-4", children: [
      /* @__PURE__ */ jsxs25(CardTitle, { className: "flex items-center gap-2 text-preto", children: [
        Icon2 && /* @__PURE__ */ jsx34(Icon2, { size: 16, strokeWidth: 1.5, className: "text-muted-foreground" }),
        title
      ] }),
      action && /* @__PURE__ */ jsx34(CardAction, { className: "self-center", children: action })
    ] }),
    bodyClassName ? /* @__PURE__ */ jsx34("div", { className: bodyClassName, children }) : children
  ] });
}

// src/components/SegmentedTabs.tsx
import { jsx as jsx35, jsxs as jsxs26 } from "react/jsx-runtime";
function SegmentedTabs({
  items: items2,
  value,
  onChange,
  className,
  ariaLabel
}) {
  return /* @__PURE__ */ jsx35(
    "div",
    {
      role: "tablist",
      "aria-label": ariaLabel,
      className: cn(
        "inline-flex max-w-full items-center gap-1 overflow-x-auto overscroll-x-contain rounded-xl border border-gray-100 bg-branco p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      ),
      children: items2.map((it) => {
        const Icon2 = it.icon;
        const active = it.id === value;
        return /* @__PURE__ */ jsxs26(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": active,
            onClick: () => onChange(it.id),
            className: cn(
              // `shrink-0`/`whitespace-nowrap`: dentro do trilho com scroll a aba
              // não pode encolher nem quebrar o rótulo. `pointer-coarse:min-h-10`
              // dá alvo de toque de 40px em telas de toque (WCAG 2.5.8) sem
              // engordar o controle no desktop.
              "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors pointer-coarse:min-h-10",
              active ? "bg-preto/5 text-preto" : "text-gray-500 hover:text-preto"
            ),
            children: [
              Icon2 && /* @__PURE__ */ jsx35(Icon2, { size: 15, strokeWidth: 1.5 }),
              it.label,
              it.badge !== void 0 && it.badge !== 0 && it.badge !== "" && /* @__PURE__ */ jsx35(
                "span",
                {
                  className: cn(
                    "ml-0.5 inline-flex min-w-[18px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold leading-none tabular-nums",
                    active ? "bg-preto/10 text-preto" : "bg-gray-100 text-gray-500"
                  ),
                  children: it.badge
                }
              )
            ]
          },
          it.id
        );
      })
    }
  );
}

// src/components/DetailHeader.tsx
import { ArrowLeft } from "lucide-react";
import { jsx as jsx36, jsxs as jsxs27 } from "react/jsx-runtime";
function DetailHeader({ onBack, backLabel = "Voltar", title, titleAdornment, status, action }) {
  return (
    // `flex-wrap` + `min-w-0`: nome longo de entidade + status + ação não cabem
    // em uma linha no mobile/tablet — em vez de estourar a largura, refluem em
    // linhas. A ação ocupa linha própria no mobile (`w-full`) e volta à direita
    // a partir de `sm`.
    /* @__PURE__ */ jsxs27("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-2", children: [
      /* @__PURE__ */ jsx36(
        Button,
        {
          variant: "outline",
          size: "icon",
          "aria-label": backLabel,
          className: "h-8 w-8 shrink-0 border-borda-controle pointer-coarse:h-10 pointer-coarse:w-10",
          onClick: onBack,
          children: /* @__PURE__ */ jsx36(ArrowLeft, { size: 16, strokeWidth: 1.5 })
        }
      ),
      /* @__PURE__ */ jsx36("h2", { className: "min-w-0 break-words text-base font-bold text-preto", children: title }),
      titleAdornment,
      status && /* @__PURE__ */ jsx36(StatusBadge, { label: status.label, variant: status.variant }),
      action && /* @__PURE__ */ jsx36("div", { className: "w-full sm:ml-auto sm:w-auto", children: action })
    ] })
  );
}
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  AppBottomNav,
  AppFooter,
  AppMobileHeader,
  AppRail,
  AppSecondarySidebar,
  AppSubNav,
  AppUserMenu,
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Badge,
  BrandLoading,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ConfirmDialog,
  ContentHeader,
  DateRangePicker,
  DateTimeField,
  DetailHeader,
  DeviceStatusBadge,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  EmptyState,
  Input,
  KpiCard,
  KpiGrid,
  Label,
  Loading,
  Modal,
  NativeSelect,
  PRESETS,
  PageFrame,
  SearchEmptyState,
  SectionCard,
  SegmentedTabs,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  SkeletonKpiCard,
  SkeletonPage,
  SkeletonTable,
  SkeletonTableRow,
  StatusBadge,
  StatusDot,
  Switch,
  TabLoading,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  USER_MENU_PROFILE_LABEL,
  USER_MENU_SETTINGS_LABEL,
  UserMenu,
  badgeVariants,
  buttonVariants,
  cn,
  comparisonRange,
  computePreset,
  defaultRange,
  deviceStatusMeta,
  toast,
  useToast
};
