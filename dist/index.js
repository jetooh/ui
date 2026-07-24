// src/components/Modal.tsx
import { X } from "lucide-react";
import { useEffect } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var SIZES = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" };
function Modal({ open, onClose, title, description, children, footer, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center", role: "dialog", "aria-modal": "true", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-preto/40 backdrop-blur-sm", onClick: onClose }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `relative z-10 mx-4 w-full ${SIZES[size]} animate-fade-in-up`,
        style: { animationDuration: "0.2s" },
        children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-gray-200 bg-branco", children: [
          title != null && /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-gray-100 px-6 py-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-[15px] font-semibold text-preto", children: title }),
              description != null && /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-[12.5px] leading-relaxed text-gray-400", children: description })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                "aria-label": "Fechar",
                className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-preto",
                children: /* @__PURE__ */ jsx(X, { size: 16, strokeWidth: 1.5 })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "px-6 py-5", children }),
          footer != null && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4", children: footer })
        ] })
      }
    )
  ] });
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
  return /* @__PURE__ */ jsx5("div", { className: "flex flex-col gap-4 rounded-xl bg-card py-4 px-4 ring-1 ring-foreground/10", children: /* @__PURE__ */ jsxs2("div", { className: "flex items-start justify-between", children: [
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
  return /* @__PURE__ */ jsxs2("div", { className: "rounded-xl bg-card ring-1 ring-foreground/10 overflow-hidden", children: [
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
export {
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
  Loading,
  Modal,
  Skeleton,
  SkeletonKpiCard,
  SkeletonPage,
  SkeletonTable,
  SkeletonTableRow,
  TabLoading,
  badgeVariants,
  buttonVariants,
  cn
};
