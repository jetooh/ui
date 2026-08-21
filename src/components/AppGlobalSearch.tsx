// Busca global canônica do ecossistema (JET-231): lightbox de busca (Ctrl/⌘K)
// com filtros por categoria, buscas recentes e ações rápidas. Estrutura,
// estilo e a11y ÚNICOS; cada app passa SEUS dados (filtros, resultados,
// recentes, ações) já filtrados/carregados — o componente é apresentacional.
//
// Régua: platform (search-lightbox.tsx, extraído aqui sem mudar 1px). O que
// varia por app entra por prop, nunca por cópia local:
//  • `filters`      — categorias da busca (ausente = sem sidebar/chips de filtro).
//  • `results`      — itens que casam com `query` (a app decide a fonte/algoritmo).
//  • `recentItems`  — mostrados quando `query === ""`.
//  • `quickActions` — mostrados quando `query === ""` e o filtro é "all"/ausente.
//  • `labels`       — textos (permite i18n; default PT-BR).
import { useEffect, useRef, memo } from "react"
import { Search, X, ArrowRight, type LucideIcon } from "lucide-react"

import { cn } from "../lib/cn"

export interface SearchFilterOption {
  key: string
  label: string
  icon: LucideIcon
}

export interface SearchResultItem {
  id: string
  icon: LucideIcon
  label: string
  category: string
  onSelect: () => void
}

export interface AppGlobalSearchLabels {
  placeholder?: string
  filterBy?: string
  recentSearches?: string
  quickActions?: string
  noResults?: string
  close?: string
  navigate?: string
  open?: string
}

export interface AppGlobalSearchProps {
  open: boolean
  onClose: () => void
  query: string
  onQueryChange: (query: string) => void
  /** Categorias de filtro. Ausente/vazio = sem sidebar/chips (busca sem categorias). */
  filters?: SearchFilterOption[]
  activeFilter?: string
  onFilterChange?: (key: string) => void
  /** Resultados para `query` não-vazia — já filtrados/carregados pela app. */
  results?: SearchResultItem[]
  /** Mostrados quando `query === ""`. */
  recentItems?: SearchResultItem[]
  /** Mostrados quando `query === ""` e o filtro ativo é "all"/ausente. */
  quickActions?: SearchResultItem[]
  isLoading?: boolean
  labels?: AppGlobalSearchLabels
  className?: string
}

const DEFAULT_LABELS: Required<AppGlobalSearchLabels> = {
  placeholder: "Buscar...",
  filterBy: "Filtrar por",
  recentSearches: "Buscas recentes",
  quickActions: "Ações rápidas",
  noResults: "Nenhum resultado encontrado",
  close: "fechar",
  navigate: "navegar",
  open: "abrir",
}

function ResultRow({ item, onClose }: { item: SearchResultItem; onClose: () => void }) {
  return (
    <button
      onClick={() => {
        item.onSelect()
        onClose()
      }}
      className="flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-gray-50"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
        <item.icon size={15} strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-preto">{item.label}</p>
        <p className="text-[11px] text-gray-500">{item.category}</p>
      </div>
      <ArrowRight size={14} strokeWidth={1.5} className="shrink-0 text-gray-300" />
    </button>
  )
}

export const AppGlobalSearch = memo(function AppGlobalSearch({
  open,
  onClose,
  query,
  onQueryChange,
  filters = [],
  activeFilter = "all",
  onFilterChange,
  results = [],
  recentItems = [],
  quickActions = [],
  isLoading,
  labels,
  className,
}: AppGlobalSearchProps) {
  const t = { ...DEFAULT_LABELS, ...labels }
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  const showEmptyQuery = query === ""
  const showQuickActions = showEmptyQuery && activeFilter === "all" && quickActions.length > 0

  return (
    <div className={cn("fixed inset-0 z-[100] flex items-start justify-center pt-[5vh] sm:pt-[10vh]", className)}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-preto/50 backdrop-blur-sm" onClick={onClose} />

      {/* Lightbox */}
      <div className="relative mx-3 w-full max-w-[780px] animate-in fade-in zoom-in-95 duration-150 sm:mx-4">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-branco sm:rounded-2xl">
          {/* Search input */}
          <div className="flex items-center gap-3 px-5 py-4">
            <Search size={20} strokeWidth={1.5} className="shrink-0 text-gray-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              className="flex-1 bg-transparent text-[15px] text-preto placeholder:text-gray-500 outline-none"
            />
            <div className="flex items-center gap-2">
              <kbd className="hidden rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] text-gray-500 sm:inline-flex">
                ⌘K
              </kbd>
              <button
                onClick={onClose}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-600"
              >
                <X size={12} strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Content area with sidebar filters */}
          <div className="flex flex-col sm:flex-row sm:min-h-[420px]">
            {filters.length > 0 && (
              <>
                {/* Mobile: horizontal filter chips */}
                <div className="flex gap-1.5 overflow-x-auto border-b border-gray-100 px-4 py-2.5 sm:hidden">
                  {filters.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => onFilterChange?.(filter.key)}
                      className={cn(
                        "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors",
                        activeFilter === filter.key
                          ? "bg-roxo text-branco"
                          : "bg-gray-50 text-gray-500 hover:bg-gray-100",
                      )}
                    >
                      <filter.icon size={13} strokeWidth={1.5} />
                      {filter.label}
                    </button>
                  ))}
                </div>
                {/* Desktop: vertical filter sidebar */}
                <div className="hidden w-[180px] shrink-0 border-r border-gray-100 bg-gray-50/50 p-2 sm:block">
                  <p className="mb-1.5 px-2.5 pt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                    {t.filterBy}
                  </p>
                  <nav className="flex flex-col gap-0.5">
                    {filters.map((filter) => (
                      <button
                        key={filter.key}
                        onClick={() => onFilterChange?.(filter.key)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
                          activeFilter === filter.key
                            ? "bg-branco font-medium text-roxo"
                            : "text-gray-500 hover:bg-branco/60 hover:text-gray-600",
                        )}
                      >
                        <filter.icon
                          size={15}
                          strokeWidth={1.5}
                          className={activeFilter === filter.key ? "text-roxo" : "text-gray-500"}
                        />
                        {filter.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </>
            )}

            {/* Right: results */}
            <div className="flex-1 overflow-y-auto">
              {showEmptyQuery ? (
                <>
                  {recentItems.length > 0 && (
                    <div className="p-3">
                      <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                        {t.recentSearches}
                      </p>
                      <div className="flex flex-col gap-0.5">
                        {recentItems.map((item) => (
                          <ResultRow key={item.id} item={item} onClose={onClose} />
                        ))}
                      </div>
                    </div>
                  )}

                  {showQuickActions && (
                    <div className="border-t border-gray-50 p-3">
                      <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                        {t.quickActions}
                      </p>
                      <div className="flex flex-col gap-0.5">
                        {quickActions.map((item) => (
                          <ResultRow key={item.id} item={item} onClose={onClose} />
                        ))}
                      </div>
                    </div>
                  )}

                  {recentItems.length === 0 && !showQuickActions && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Search size={28} strokeWidth={1} className="mb-2 text-gray-200" />
                      <p className="text-sm text-gray-500">{t.noResults}</p>
                    </div>
                  )}
                </>
              ) : isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div
                    className="h-6 w-6 animate-spin rounded-full border-[2.5px] border-transparent"
                    style={{ borderTopColor: "#8B47FF", borderRightColor: "rgba(139,71,255,0.3)" }}
                  />
                </div>
              ) : results.length > 0 ? (
                <div className="p-3">
                  <div className="flex flex-col gap-0.5">
                    {results.map((item) => (
                      <ResultRow key={item.id} item={item} onClose={onClose} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Search size={28} strokeWidth={1} className="mb-2 text-gray-200" />
                  <p className="text-sm text-gray-500">{t.noResults}</p>
                  <p className="mt-1 text-xs text-gray-300">&quot;{query}&quot;</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end border-t border-gray-100 px-4 py-2">
            <div className="flex items-center gap-3 text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">
                  ESC
                </kbd>
                {t.close}
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">
                  ↑↓
                </kbd>
                {t.navigate}
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">
                  ↵
                </kbd>
                {t.open}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
