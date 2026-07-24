# @jetooh/ui

Design System **compartilhado** do ecossistema JETOOH — fonte única de componentes
e tokens de tema. **Régua visual: platform.**

Consumo (multi-repo): cada app depende por git-dep em branch flutuante
`"@jetooh/ui": "github:jetooh/ui#main"`. Como os Dockerfiles usam `npm install`,
cada build puxa o `main` atual. Mudou aqui → cada app absorve ao rebuildar.

Integração por app (1x): adicionar `./node_modules/@jetooh/ui/dist/**/*.js` ao
`content` do Tailwind (senão as classes do pacote não entram no CSS). Tokens
`branco/preto/roxo`, `gray-*` e a animação `animate-fade-in-up` devem existir no
tema do app (já existem em platform e devices).

## Componentes
- `Modal` — modal padrão (overlay com blur, card rounded-2xl com borda, SEM sombra).
