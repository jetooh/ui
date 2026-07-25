// src/components/Modal.tsx
import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var SIZES = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" };
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
  if (!open) return null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "fixed inset-0 z-[9999] flex items-center justify-center",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": title != null ? titleId : void 0,
      "aria-describedby": description != null ? descId : void 0,
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-preto/40 backdrop-blur-sm", onClick: onClose }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `relative z-10 mx-4 w-full ${SIZES[size]} animate-fade-in-up`,
            style: { animationDuration: "0.2s" },
            children: /* @__PURE__ */ jsxs("div", { ref: cardRef, tabIndex: -1, className: "rounded-2xl border border-gray-200 bg-branco outline-none", children: [
              title != null && /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-gray-100 px-6 py-4", children: [
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
              /* @__PURE__ */ jsx("div", { className: "px-6 py-5", children }),
              footer != null && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4", children: footer })
            ] })
          }
        )
      ]
    }
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
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9"
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
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive: "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline"
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
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
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
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
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

// src/components/KpiCard.tsx
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { jsx as jsx6, jsxs as jsxs3 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx6(Card, { className: "gap-0", children: /* @__PURE__ */ jsxs3(CardHeader, { className: "flex flex-row items-start justify-between", children: [
    /* @__PURE__ */ jsxs3("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx6("span", { className: "text-xs font-medium uppercase tracking-wider text-gray-500", children: label }),
      /* @__PURE__ */ jsx6("span", { className: "text-2xl font-bold tracking-tight text-preto", children: value }),
      trend && /* @__PURE__ */ jsxs3(
        "span",
        {
          className: `flex items-center gap-1 text-xs font-medium ${trendUp ? "text-verde-dark" : "text-red-600"}`,
          children: [
            trendUp ? /* @__PURE__ */ jsx6(ArrowUpRight, { size: 12, strokeWidth: 2 }) : /* @__PURE__ */ jsx6(ArrowDownRight, { size: 12, strokeWidth: 2 }),
            trend
          ]
        }
      ),
      hint && /* @__PURE__ */ jsx6("span", { className: "text-xs text-gray-500", children: hint })
    ] }),
    /* @__PURE__ */ jsx6(
      "div",
      {
        className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`,
        children: /* @__PURE__ */ jsx6(Icon2, { size: 20, strokeWidth: 1.5 })
      }
    )
  ] }) });
}
var LG_COLS = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5"
};
function KpiGrid({
  children,
  className,
  cols = 4
}) {
  return /* @__PURE__ */ jsx6("div", { className: `grid grid-cols-2 gap-2.5 sm:gap-4 ${LG_COLS[cols]} ${className ?? ""}`, children });
}

// src/components/Table.tsx
import { jsx as jsx7 } from "react/jsx-runtime";
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsx7(
    "div",
    {
      "data-slot": "table-container",
      tabIndex: 0,
      role: "group",
      className: "relative w-full overflow-x-auto outline-none",
      children: /* @__PURE__ */ jsx7(
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
  return /* @__PURE__ */ jsx7(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsx7(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx7(
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
  return /* @__PURE__ */ jsx7(
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
  return /* @__PURE__ */ jsx7(
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
  return /* @__PURE__ */ jsx7(
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
  return /* @__PURE__ */ jsx7(
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
import { createPortal } from "react-dom";
import { CheckCircle2, AlertCircle, Info, X as X2 } from "lucide-react";
import { jsx as jsx8, jsxs as jsxs4 } from "react/jsx-runtime";
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
  success: /* @__PURE__ */ jsx8(CheckCircle2, { size: 16, strokeWidth: 1.75, className: "shrink-0 text-verde" }),
  destructive: /* @__PURE__ */ jsx8(AlertCircle, { size: 16, strokeWidth: 1.75, className: "shrink-0 text-status-critico" }),
  info: /* @__PURE__ */ jsx8(Info, { size: 16, strokeWidth: 1.75, className: "shrink-0 text-roxo" }),
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
  return createPortal(
    /* @__PURE__ */ jsx8(
      "div",
      {
        className: "pointer-events-none fixed bottom-4 right-4 z-[10000] flex max-w-[calc(100vw-2rem)] flex-col gap-2",
        role: "region",
        "aria-live": "polite",
        "aria-label": "Notifica\xE7\xF5es",
        children: list.map((t) => /* @__PURE__ */ jsxs4(
          "div",
          {
            role: t.variant === "destructive" ? "alert" : "status",
            className: "pointer-events-auto flex w-full items-start gap-2 rounded-lg border border-gray-200 bg-branco px-3.5 py-2.5 text-[13px] text-preto shadow-lg",
            children: [
              ICON[t.variant],
              /* @__PURE__ */ jsxs4("div", { className: cn("flex min-w-0 flex-col gap-0.5", !t.description && "justify-center"), children: [
                t.title && /* @__PURE__ */ jsx8("span", { className: "max-w-xs font-medium leading-snug", children: t.title }),
                t.description && /* @__PURE__ */ jsx8("span", { className: "max-w-xs text-xs leading-snug text-gray-500", children: t.description })
              ] }),
              /* @__PURE__ */ jsx8(
                "button",
                {
                  onClick: () => dismiss(t.id),
                  "aria-label": "Fechar notifica\xE7\xE3o",
                  className: "ml-1 shrink-0 text-gray-500 transition-colors hover:text-preto",
                  children: /* @__PURE__ */ jsx8(X2, { size: 14, strokeWidth: 2 })
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
import { jsx as jsx9, jsxs as jsxs5 } from "react/jsx-runtime";
var SIZES2 = { sm: "h-1.5 w-1.5", md: "h-2 w-2", lg: "h-2.5 w-2.5" };
function StatusDot({ color, pulse = false, size = "md", className }) {
  const s = SIZES2[size];
  return /* @__PURE__ */ jsxs5("span", { className: cn("relative flex", s, className), children: [
    pulse && /* @__PURE__ */ jsx9("span", { className: cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", color) }),
    /* @__PURE__ */ jsx9("span", { className: cn("relative inline-flex rounded-full", s, color) })
  ] });
}

// src/components/AppRail.tsx
import { memo } from "react";
import { ChevronRight } from "lucide-react";
import { jsx as jsx10, jsxs as jsxs6 } from "react/jsx-runtime";
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
  const renderItem = (item) => /* @__PURE__ */ jsxs6(
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
        /* @__PURE__ */ jsx10(item.icon, { size: 20, strokeWidth: 1.5 }),
        item.badge != null && item.badge > 0 && /* @__PURE__ */ jsx10("span", { className: "absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-rail-bg", children: item.badge > 9 ? "9+" : item.badge }),
        /* @__PURE__ */ jsx10("span", { className: "pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover/rail-item:opacity-100", children: item.label })
      ]
    },
    item.id
  );
  return /* @__PURE__ */ jsxs6(
    "div",
    {
      className: cn(
        "fixed left-0 top-0 z-50 h-full w-[78px] flex-col items-center bg-rail-bg py-5",
        hideOnMobile ? "hidden lg:flex" : "flex"
      ),
      children: [
        /* @__PURE__ */ jsx10("div", { className: "absolute -right-4 top-0 h-4 w-4 bg-rail-bg", children: /* @__PURE__ */ jsx10("div", { className: "h-full w-full rounded-tl-full bg-page-bg" }) }),
        /* @__PURE__ */ jsx10("div", { className: "absolute -right-4 bottom-0 h-4 w-4 bg-rail-bg", children: /* @__PURE__ */ jsx10("div", { className: "h-full w-full rounded-bl-full bg-page-bg" }) }),
        /* @__PURE__ */ jsx10("div", { className: "mb-6 flex h-10 w-10 items-center justify-center", children: /* @__PURE__ */ jsx10("img", { src: logoSrc, alt: "JETOOH", width: 32, height: 32, className: "h-8 w-8 invert" }) }),
        /* @__PURE__ */ jsx10("nav", { className: "flex flex-1 flex-col items-center gap-1", children: items2.map(renderItem) }),
        (bottomItems?.length || onExpand) && /* @__PURE__ */ jsxs6("div", { className: "flex flex-col items-center gap-1", children: [
          bottomItems?.map(renderItem),
          onExpand && /* @__PURE__ */ jsx10(
            "button",
            {
              onClick: onExpand,
              "aria-label": "Expandir menu",
              className: "flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-roxo transition-colors hover:bg-white/20",
              children: /* @__PURE__ */ jsx10(ChevronRight, { size: 18, strokeWidth: 2 })
            }
          )
        ] })
      ]
    }
  );
});

// src/components/ContentHeader.tsx
import { ChevronDown } from "lucide-react";
import { Fragment, jsx as jsx11, jsxs as jsxs7 } from "react/jsx-runtime";
function ContentHeader({
  icon: Icon2,
  moduleTitle,
  subTitle,
  description,
  customLeft,
  children,
  className
}) {
  return /* @__PURE__ */ jsxs7(
    "div",
    {
      className: `sticky top-0 z-10 flex items-center justify-between rounded-t-xl border-b border-gray-100 bg-branco/95 px-8 py-4 backdrop-blur-sm ${className ?? ""}`,
      children: [
        customLeft ?? /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx11("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-roxo/10 text-roxo", children: /* @__PURE__ */ jsx11(Icon2, { size: 20, strokeWidth: 1.5 }) }),
          /* @__PURE__ */ jsxs7("div", { children: [
            /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx11("h1", { className: "text-2xl font-bold text-preto", children: moduleTitle }),
              subTitle && /* @__PURE__ */ jsxs7(Fragment, { children: [
                /* @__PURE__ */ jsx11(ChevronDown, { size: 16, strokeWidth: 1.5, className: "-rotate-90 text-gray-300" }),
                /* @__PURE__ */ jsx11("span", { className: "text-2xl font-bold text-preto", children: subTitle })
              ] })
            ] }),
            description && /* @__PURE__ */ jsx11("p", { className: "mt-0.5 text-[12px] text-gray-500", children: description })
          ] })
        ] }),
        /* @__PURE__ */ jsx11("div", { className: "flex items-center gap-3", children })
      ]
    }
  );
}

// src/components/EmptyState.tsx
import { jsx as jsx12, jsxs as jsxs8 } from "react/jsx-runtime";
function EmptyState({ icon: Icon2, title, description, actionLabel, onAction }) {
  return /* @__PURE__ */ jsxs8("div", { className: "flex flex-col items-center justify-center px-4 py-16 text-center", children: [
    /* @__PURE__ */ jsx12("div", { className: "mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-300", children: /* @__PURE__ */ jsx12(Icon2, { size: 28, strokeWidth: 1.5, "aria-hidden": "true" }) }),
    /* @__PURE__ */ jsx12("h3", { className: "mb-1 text-[15px] font-semibold text-preto", children: title }),
    description && /* @__PURE__ */ jsx12("p", { className: "mb-5 max-w-sm text-[13px] text-gray-500", children: description }),
    actionLabel && onAction && /* @__PURE__ */ jsx12(
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
  return /* @__PURE__ */ jsxs8("div", { className: "flex flex-col items-center justify-center px-4 py-12", children: [
    /* @__PURE__ */ jsx12("div", { className: "mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-300", children: /* @__PURE__ */ jsxs8("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsx12("circle", { cx: "11", cy: "11", r: "8" }),
      /* @__PURE__ */ jsx12("path", { d: "m21 21-4.3-4.3" })
    ] }) }),
    /* @__PURE__ */ jsx12("h3", { className: "mb-1 text-[14px] font-semibold text-preto", children: "Nenhum resultado encontrado" }),
    /* @__PURE__ */ jsxs8("p", { className: "text-center text-[13px] text-gray-500", children: [
      'Nenhum resultado para "',
      query,
      '". Tente outro termo.'
    ] })
  ] });
}

// src/components/Input.tsx
import * as React2 from "react";
import { jsx as jsx13 } from "react/jsx-runtime";
var Input = React2.forwardRef(({ className, type, ...props }, ref) => {
  return /* @__PURE__ */ jsx13(
    "input",
    {
      type,
      className: cn(
        "flex w-full rounded-lg border border-gray-200 bg-branco px-3 py-2 text-[14px] text-preto outline-hidden transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:border-roxo focus:ring-1 focus:ring-roxo/30 disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ref,
      ...props
    }
  );
});
Input.displayName = "Input";

// src/components/Label.tsx
import * as React3 from "react";
import { jsx as jsx14 } from "react/jsx-runtime";
var Label = React3.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx14(
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

// src/components/Separator.tsx
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { jsx as jsx15 } from "react/jsx-runtime";
function Separator({
  className,
  orientation = "horizontal",
  ...props
}) {
  return /* @__PURE__ */ jsx15(
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
import { jsx as jsx16, jsxs as jsxs9 } from "react/jsx-runtime";
function TooltipProvider({
  delay = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx16(
    TooltipPrimitive.Provider,
    {
      "data-slot": "tooltip-provider",
      delay,
      ...props
    }
  );
}
function Tooltip({ ...props }) {
  return /* @__PURE__ */ jsx16(TooltipPrimitive.Root, { "data-slot": "tooltip", ...props });
}
function TooltipTrigger({ ...props }) {
  return /* @__PURE__ */ jsx16(TooltipPrimitive.Trigger, { "data-slot": "tooltip-trigger", ...props });
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
  return /* @__PURE__ */ jsx16(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx16(
    TooltipPrimitive.Positioner,
    {
      align,
      alignOffset,
      side,
      sideOffset,
      className: "isolate z-50",
      children: /* @__PURE__ */ jsxs9(
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
            /* @__PURE__ */ jsx16(TooltipPrimitive.Arrow, { className: "z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" })
          ]
        }
      )
    }
  ) });
}

// src/components/DropdownMenu.tsx
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { ChevronRight as ChevronRightIcon, Check as CheckIcon } from "lucide-react";
import { jsx as jsx17, jsxs as jsxs10 } from "react/jsx-runtime";
function DropdownMenu({ ...props }) {
  return /* @__PURE__ */ jsx17(MenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuPortal({ ...props }) {
  return /* @__PURE__ */ jsx17(MenuPrimitive.Portal, { "data-slot": "dropdown-menu-portal", ...props });
}
function DropdownMenuTrigger({ ...props }) {
  return /* @__PURE__ */ jsx17(MenuPrimitive.Trigger, { "data-slot": "dropdown-menu-trigger", ...props });
}
function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx17(MenuPrimitive.Portal, { children: /* @__PURE__ */ jsx17(
    MenuPrimitive.Positioner,
    {
      className: "isolate z-50 outline-none",
      align,
      alignOffset,
      side,
      sideOffset,
      children: /* @__PURE__ */ jsx17(
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
  return /* @__PURE__ */ jsx17(MenuPrimitive.Group, { "data-slot": "dropdown-menu-group", ...props });
}
function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsx17(
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
  return /* @__PURE__ */ jsx17(
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
  return /* @__PURE__ */ jsx17(MenuPrimitive.SubmenuRoot, { "data-slot": "dropdown-menu-sub", ...props });
}
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs10(
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
        /* @__PURE__ */ jsx17(ChevronRightIcon, { className: "ml-auto" })
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
  return /* @__PURE__ */ jsx17(
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
  return /* @__PURE__ */ jsxs10(
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
        /* @__PURE__ */ jsx17(
          "span",
          {
            className: "pointer-events-none absolute right-2 flex items-center justify-center",
            "data-slot": "dropdown-menu-checkbox-item-indicator",
            children: /* @__PURE__ */ jsx17(MenuPrimitive.CheckboxItemIndicator, { children: /* @__PURE__ */ jsx17(
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
  return /* @__PURE__ */ jsx17(
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
  return /* @__PURE__ */ jsxs10(
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
        /* @__PURE__ */ jsx17(
          "span",
          {
            className: "pointer-events-none absolute right-2 flex items-center justify-center",
            "data-slot": "dropdown-menu-radio-item-indicator",
            children: /* @__PURE__ */ jsx17(MenuPrimitive.RadioItemIndicator, { children: /* @__PURE__ */ jsx17(
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
  return /* @__PURE__ */ jsx17(
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
  return /* @__PURE__ */ jsx17(
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
import { Check, ChevronDown as ChevronDown2, ChevronUp } from "lucide-react";
import { jsx as jsx18, jsxs as jsxs11 } from "react/jsx-runtime";
var Select = SelectPrimitive.Root;
var SelectGroup = SelectPrimitive.Group;
var SelectValue = SelectPrimitive.Value;
var SelectTrigger = React4.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs11(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex w-full items-center justify-between rounded-lg border border-gray-200 bg-branco px-3 py-2 text-[14px] text-preto outline-hidden transition-colors placeholder:text-gray-400 focus:border-roxo focus:ring-1 focus:ring-roxo/30 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx18(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx18(ChevronDown2, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
var SelectScrollUpButton = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx18(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx18(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
var SelectScrollDownButton = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx18(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx18(ChevronDown2, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
var SelectContent = React4.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx18(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs11(
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
      /* @__PURE__ */ jsx18(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx18(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx18(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
var SelectLabel = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx18(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("py-1.5 pl-8 pr-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
var SelectItem = React4.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs11(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-[13px] text-gray-600 outline-hidden transition-colors focus:bg-gray-50 focus:text-preto data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx18("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx18(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx18(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx18(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
var SelectSeparator = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx18(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

// src/components/ConfirmDialog.tsx
import { Loader2 } from "lucide-react";
import { Fragment as Fragment2, jsx as jsx19, jsxs as jsxs12 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs12(
    Modal,
    {
      open,
      onClose,
      footer: /* @__PURE__ */ jsxs12(Fragment2, { children: [
        /* @__PURE__ */ jsx19(
          Button,
          {
            variant: "outline",
            size: "default",
            onClick: onClose,
            className: "border-gray-200 px-4 text-[13px] font-medium text-gray-600 hover:border-gray-300 hover:text-preto",
            children: cancelLabel
          }
        ),
        /* @__PURE__ */ jsxs12(
          Button,
          {
            size: "default",
            onClick: onConfirm,
            disabled: loading,
            className: `gap-2 px-5 text-[13px] font-semibold text-branco disabled:opacity-50 ${destructive ? "bg-status-critico hover:bg-status-critico/90" : "bg-roxo hover:bg-roxo-hover"}`,
            children: [
              loading && /* @__PURE__ */ jsx19(Loader2, { size: 14, className: "animate-spin" }),
              confirmLabel
            ]
          }
        )
      ] }),
      children: [
        /* @__PURE__ */ jsx19("h2", { className: "text-[15px] font-semibold text-preto", children: title }),
        /* @__PURE__ */ jsx19("div", { className: "mt-1 text-[13px] text-gray-500", children: description })
      ]
    }
  );
}

// src/components/AlertDialog.tsx
import * as React5 from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { jsx as jsx20, jsxs as jsxs13 } from "react/jsx-runtime";
var AlertDialog = AlertDialogPrimitive.Root;
var AlertDialogTrigger = AlertDialogPrimitive.Trigger;
var AlertDialogPortal = AlertDialogPrimitive.Portal;
var AlertDialogOverlay = React5.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx20(
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
var AlertDialogContent = React5.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs13(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsx20(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsx20(
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
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx20("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx20(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = React5.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx20(
  AlertDialogPrimitive.Title,
  {
    ref,
    className: cn("text-[15px] font-semibold text-preto", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
var AlertDialogDescription = React5.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx20(
  AlertDialogPrimitive.Description,
  {
    ref,
    className: cn("text-[13px] text-gray-500", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
var AlertDialogAction = React5.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx20(
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
var AlertDialogCancel = React5.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx20(
  AlertDialogPrimitive.Cancel,
  {
    ref,
    className: cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 border-gray-200 px-4 text-[13px] font-medium text-gray-600 hover:border-gray-300 hover:text-preto sm:mt-0",
      className
    ),
    ...props
  }
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
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
  AppRail,
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Badge,
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
  SearchEmptyState,
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
  StatusDot,
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
  badgeVariants,
  buttonVariants,
  cn,
  toast,
  useToast
};
