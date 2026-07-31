import * as React from "react"

import { cn } from "../lib/cn"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground border border-gray-100 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
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
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
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
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 group-data-[size=sm]/card:px-3", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
