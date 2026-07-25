# @jetooh/ui

Design System **compartilhado** do ecossistema JETOOH — fonte única de componentes
e tokens de tema. **Régua visual: platform** (o canônico é sempre extraído do padrão
do `platform.jetooh.com`). Mudou aqui → muda em todo app que consome, ao rebuildar.

## Consumo (multi-repo)

Cada app depende por **git-dep** em branch flutuante:

```jsonc
// package.json do app
"@jetooh/ui": "github:jetooh/ui#main"
```

Como os Dockerfiles usam `npm install`, cada build puxa o `main` atual. O `dist/` é
**commitado** (sem `prepare`/build no install). Ao mudar um componente: editar `src/`,
`npm run build`, commitar `dist/`, push — depois cada app absorve ao rebuildar (repin
com `npm install "github:jetooh/ui#main"`).

> Dockerfile do app precisa de `RUN apk add --no-cache git` (node:alpine não tem git;
> git-dep exige git).

## Integração Tailwind (1x por app) — v4

Os dois apps (platform e devices) são **Tailwind v4**. O app precisa escanear o `dist`
do pacote, senão as classes usadas aqui não entram no CSS:

```css
/* index.css do app, logo após @import "tailwindcss" */
@source "../node_modules/@jetooh/ui/dist";
```

Tokens exigidos no tema do app (já existem em platform e devices): paleta
`branco/preto/roxo` (+ `roxo-hover`), `verde`/`verde-dark`, `status-critico`,
`gray-*`, os tokens semânticos shadcn (`--primary/--border/--muted/--card`…) e a
animação `animate-fade-in-up`.

## Peer deps

`react`, `react-dom`, `lucide-react`, `@base-ui/react` (Button/Badge/Avatar usam Base UI).
`class-variance-authority`, `clsx` e `tailwind-merge` vão bundlados.

## Componentes

| Export | Descrição |
|--------|-----------|
| `Modal` | Modal padrão: overlay com blur, card `rounded-2xl` com borda, SEM sombra, header (título/descrição/X) e footer opcionais. Props: `open,onClose,title?,description?,footer?,size?`. |
| `Avatar` + `AvatarImage/Fallback/Badge/Group/GroupCount` | Família de avatar (Base UI + tokens semânticos). |
| `Button` + `buttonVariants` | Botão (cva + `@base-ui/react/button`). **Sem `asChild`** (Base UI usa `render`, não Slot) — para link-que-parece-botão, use `<a className={cn(buttonVariants({variant}), …)}>`. |
| `Badge` + `badgeVariants` | Selo (cva + Base UI `useRender`). |
| `Card` + `CardHeader/Title/Description/Action/Content/Footer` | Card e subpartes. |
| `Skeleton` + `SkeletonKpiCard/TableRow/Table/Page`, `Loading`, `TabLoading` | Skeletons e loadings padrão. |
| `KpiCard` + `KpiGrid` | Card de estatística do painel (label/valor/ícone/trend/hint) + grid responsivo. |
| `Table` + `TableHeader/Body/Footer/Row/Head/Cell/Caption` | Tabela. |
| `toast` + `useToast` + `Toaster` | Toast **superset** (sem Radix): `toast.success/error/info(msg)` (imperativo) **e** `toast({title,description,variant})` (objeto shadcn). Monte `<Toaster/>` uma vez no root. |
| `cn` | `clsx` + `tailwind-merge`. |

## Como adicionar/alterar um componente

1. Extraia o padrão do **platform** (régua). Copie o arquivo mudando SÓ o import do `cn`
   para `../lib/cn` — **mantenha aspas duplas** (`sed s/"/'/g` quebra strings cva com
   `'size-'` literal).
2. Exporte em `src/index.ts`. `npm run build`. Commite `src/` + `dist/`. Push.
3. Nos apps, troque o componente local por um **re-export** (`export { X } from '@jetooh/ui'`),
   repine o git-dep, `typecheck` + `build`, deploy, **valide com print + navegando**.

> Verificação de deploy: o hash do `index-*.js` do **platform** pode não mudar num
> re-export verbatim (bundle idêntico). Pollar o hash do **devices** (que troca de
> verdade) e, no platform, um smoke (Toaster/DOM + console limpo) confirma a saúde.
