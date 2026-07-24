import * as React from "react"
import { cn } from "../lib/cn";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-gray-200/60", className)}
      {...props}
    />
  );
}

function SkeletonKpiCard() {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-card py-4 px-4 ring-1 ring-foreground/10">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-20" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
}

// Larguras DETERMINÍSTICAS por coluna — nunca usar Math.random() aqui: o
// skeleton re-renderiza várias vezes (Suspense → mount → data) e larguras
// aleatórias fazem as barras "pularem" a cada render (parece trocar 2-3x).
const COL_WIDTHS = [120, 90, 140, 80, 110, 100, 130, 95];

function SkeletonTableRow({ cols = 5 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0">
      <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
      <div className="flex-1 flex items-center gap-8">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" style={{ maxWidth: `${COL_WIDTHS[i % COL_WIDTHS.length]}px` }} />
        ))}
      </div>
    </div>
  );
}

function SkeletonTable({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl bg-card ring-1 ring-foreground/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTableRow key={i} cols={cols} />
      ))}
    </div>
  );
}

// Loading PADRÃO de página/rota. Fonte única: editar aqui muda o loading de
// TODAS as páginas e do fallback de Suspense (todas as rotas). Usado tanto na
// fase de carregar o chunk (Suspense) quanto na de carregar os dados (hooks),
// para que o usuário veja UM skeleton contínuo — não vários diferentes.
function Loading() {
  return (
    <div className="px-4 py-4 sm:p-6 sm:pb-8 lg:p-8 lg:pb-10 space-y-6">
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonKpiCard key={i} />
        ))}
      </div>
      <SkeletonTable />
    </div>
  );
}

// Alias de compatibilidade — páginas antigas importam SkeletonPage; agora ele É
// o Loading padrão (mesma fonte única).
const SkeletonPage = Loading;

// Loading PADRÃO de aba/seção (ex.: abas do detalhe de display). Spinner roxo da
// marca, centralizado — fonte única para o "loading → dados" de todas as abas.
function TabLoading() {
  return (
    <div className="flex items-center justify-center py-16">
      <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-roxo border-t-transparent" />
    </div>
  );
}

export { Skeleton, SkeletonKpiCard, SkeletonTableRow, SkeletonTable, SkeletonPage, Loading, TabLoading };
