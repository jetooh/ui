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
export {
  Modal
};
