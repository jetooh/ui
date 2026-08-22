# `@jetooh/ui` — Temas

O `@jetooh/ui` é um design system **multi-tema**. Um **tema** = um conjunto coerente
de **casca** (rail, header, body/frame, footer, mobile) + **componentes** + **tokens**
(cores, radius, tipografia, claro/escuro). Várias aplicações podem **compartilhar** o
mesmo tema; ao mudar um elemento do tema no pacote, muda em **todas** as apps que o usam
(fonte única — ver a regra `jetooh-shared-theme-single-source`).

## Catálogo de temas

| Tema | id | Status | Régua | Apps que usam | Manifesto |
|------|----|--------|-------|---------------|-----------|
| **Dashboard2026** | `dashboard-2026` | active | `platform` | `platform`, `devices` | `src/themes/dashboard-2026/manifest.json` |

> **Dashboard2026** é o tema atual: painel SaaS com rail escuro + card branco, roxo de
> marca, Plus Jakarta Sans, radius 0.625rem, claro+escuro. Casca e componentes listados
> no manifesto. Tokens canônicos em `src/themes/dashboard-2026/tokens.json`; validados
> (claro+escuro) por `scripts/token-drift.mjs` (no pilot).

## Onde mora o quê (estrutura atual)

Hoje há **um** tema, então os componentes são exportados na **raiz** do pacote
(`src/index.ts` → `@jetooh/ui`) e ESSA raiz **é** o Dashboard2026. A identidade do tema
(metadados + tokens + contrato de CSS) vive em `src/themes/dashboard-2026/`.

```
ui/
├── src/
│   ├── components/            ← componentes + casca do Dashboard2026 (exportados na raiz)
│   ├── themes/
│   │   └── dashboard-2026/
│   │       ├── manifest.json  ← id, nome, régua, apps, casca, componentes, contrato CSS
│   │       ├── tokens.json    ← tokens canônicos (claro + escuro) — fonte única
│   │       └── theme.css      ← base + camada semântica ENVIADAS pelo pacote (JET-106)
│   ├── themes/oklch.ts        ← conversão sRGB↔OKLCH (round-trip do contrato)
│   └── index.ts               ← export raiz (= Dashboard2026 enquanto houver 1 tema)
└── THEMES.md                  ← este arquivo (registro de temas)
```

## Adotar o Dashboard2026 numa app (padrão)

1. `npm install "github:jetooh/ui#main"` (ou npm quando publicado — ver
   `docs/process/ui-npm-publish-migration.md`).
2. `@source "../node_modules/@jetooh/ui/dist"` no `index.css` (Tailwind v4 gera as classes).
3. `@import "@jetooh/ui/theme.css"` — traz o tema inteiro pronto, em claro e
   escuro: a **camada base** (escala JETOOH, em `oklch()`) e a **camada
   semântica** (os **20** — os 18 do shadcn + `--primary-hover` e
   `--primary-text` — mais `--secondary-active-bg`). Nada a declarar.

   > `--primary` é papel de **preenchimento**, e só. O hover do preenchimento é
   > `--primary-hover` (sólido) e o papel de texto/link é `--primary-text` — os
   > dois ganharam par próprio na JET-105/D5 porque, com o roxo da marca,
   > `bg-primary/80` cai para 3,43:1 e `text-primary` para 4,30:1 sobre
   > `page-bg`. Com o `--primary` neutro do scaffold isso passava por acidente.
4. Se a app já declara a escala JETOOH no `index.css` (platform, devices), ela
   continua valendo — a declaração local vem depois do `@import` e vence na
   cascata. Apagar a declaração local e ficar só com o que o pacote envia é a
   migração, e é o que o `token-drift` passa a cobrar valor a valor.

   > **Vencer por ordem só vale dentro da mesma camada** (JET-77). O `theme.css`
   > declara `:root, .dark` **sem** `@layer`, e no CSS uma declaração sem camada
   > vence qualquer uma **dentro** de camada — a ordem no arquivo nem é
   > consultada. App que guarda token em `@layer base` (era o caso do `devices`)
   > perde para o pacote sem nada avisar, e o estrago não é "voltou ao valor do
   > contrato": no `devices` o `--border` local era uma tripla HSL lida por
   > `hsl(var(--border))`, então herdar o `oklch()` do pacote produziu
   > `hsl(oklch(…))` — valor inválido, **borda sem cor na app inteira**, 142
   > declarações. Antes de importar, tirar os tokens do `@layer`.
5. Rodar `node scripts/token-drift.mjs` (no pilot) — não pode divergir do manifesto.
6. **Casca de boot** (JET-118) — copiar `dist/theme-init.js` e `dist/boot.css` para o
   `public/` da app, e no `index.html`: `<script src="/theme-init.js">` +
   `<link rel="stylesheet" href="/boot.css">` no `<head>`, `dist/boot.html` inlinado no
   `<body>` antes do `#root`, e o `<meta name="theme-color">` injetado no build a partir
   de `BOOT_COLORS.ring`. Ver a seção abaixo.

## Camada de boot — o que pinta antes de existir `var()` (JET-118)

O `theme.css` só vale depois que o CSS da app carrega. Antes disso existe o
`index.html`: o `<script>` que decide o modo e o splash que cobre a tela até o React
montar. Essa faixa é a **camada de boot**, e ela é a única do tema que **escreve**
valor de cor fora do `tokens.json` — não por descuido: ali `var(--color-roxo)` ainda
não existe.

| arquivo (no `dist`) | o que é | a app usa como |
|---|---|---|
| `theme-init.js` | lê `localStorage('theme')` e põe `.dark` no `<html>` antes do primeiro paint | `<script src="/theme-init.js">` no `<head>` |
| `boot.css` | estilos do splash (`#initial-loading`, `.jt-ring`, `.jt-logo`) | `<link rel="stylesheet" href="/boot.css">` |
| `boot.html` | markup do splash | inlinado no `<body>`, antes do `#root` |
| `BOOT_COLORS` (JS) | os literais da camada, exportados na raiz | injetar `meta theme-color` no build |

Regra: **se precisa ser escrito, é escrito uma vez** — em `src/themes/boot.ts`. Cada
literal é um grau da escala (`bg` = `preto`, `ring` = `roxo`, `logo` = `branco-fixo`,
`ringTrail` = `roxo` a 30%) e o `src/themes/boot.test.ts` reprova se `boot.ts`,
`boot.css`, `boot.html`, o `<BrandLoading />` ou o `tokens.json` mudarem sozinhos.

Por que isso virou arquivo do pacote: em 2026-08-13 o bloco de boot era **byte a byte
idêntico** nos três `index.html` (`auth`, `platform`, `devices`) e o `<BrandLoading />`
repetia os mesmos hex uma **quarta** vez — trocar o roxo da marca exigia editar quatro
arquivos que nenhum sistema de tema alcança. `theme-init.js`, além disso, só o
`platform` servia: no `devices` a URL cai no fallback SPA e devolve o `index.html`, o
que deixa o modo escuro sem pré-aplicação (flash de tema claro no boot — JET-79).

Dívida registrada em `bootContract.lacunas.fundoDoSplash`: `BOOT_COLORS.bg` usa o valor
**claro** de `preto` como constante estática. O splash é arte sempre escura, então o
valor está certo; o correto seria um grau estático `preto-fixo` (par do `branco-fixo`),
que é mudança da camada base com rollout nas 3 apps.

Adotar nas apps é JET-79 (`theme-init.js` no `devices`) e JET-80 (cor de marca nos 3
`index.html`) — as duas travadas na JET-73 (credencial/clone dos repos privados).

## Duas camadas, duas regras (JET-106 / ADR-001)

|  | camada base (`colors`) | camada semântica (`semantic`) |
|---|---|---|
| o que é | a escala JETOOH: `roxo`, `gray-*`, `borda-controle`, … | os 20 do contrato: `--primary`, `--border`, `--muted`, … |
| formato | hex no `tokens.json` → `oklch()` no `theme.css` | **referência**: `var(--color-<grau>)` ou `color-mix()` |
| escreve valor de cor? | **sim — é a única que escreve** | **nunca** (D1.1) |
| quem envia | **o pacote**, via `theme.css` | **o pacote**, via `theme.css` |
| divergir | pode, com entrada em `cssContract.overridesRegistrados` | idem |
| o que o `token-drift` pergunta | "valor efetivo == canônico **ou** override registrado e não vencido?" | idem |

O motivo da assimetria: até a JET-106 o contrato era declaração-obrigatória em
tudo, e por isso qualquer divergência conhecida (`--primary` neutro no platform,
`secondary-active-bg` que o devices não gera) só podia ser registrada como
**lacuna do contrato** — o contrato ficava sem valor canônico à espera de 3 apps
mudarem juntas. Enviar o default separa as duas coisas: o contrato tem um valor
sempre, e a divergência vira dívida com dono e prazo.

Regras de formato da camada base: `L` em % com até 1 casa · `C` com 3 casas
(ou o literal `0`) · `H` com até 1 casa · cinza é `C 0` e `H 0` · alpha só quando
a semântica do token é translúcida. Tripla HSL crua e `hsl(var(--x))` reprovam no
`contract.test.ts`. A forma canônica de um grau é a de **menor precisão que
reconverte exato** para o hex de origem (`canonicalOklch`): arredondar `#34d399`
de forma ingênua dá `#35d399`, e como a base é a única cópia do valor, essa
deriva de 1/255 reescreveria a cor de todo mundo que referencia o grau.

**A camada semântica não escreve cor** (D1.1). Cada um dos 20 é
`var(--color-<grau>)` da base, ou um `color-mix()` sobre `var()` — um literal
aqui seria a segunda cópia do valor da marca, que é a máquina exata que produziu
a JET-78. Dois guards estáticos (sem render) no `contract.test.ts`:

- **literal** — nenhuma função de cor (`oklch(`, `hsl(`, `rgb(`, `#`) do lado
  direito de um token semântico, e a referência tem que apontar para um grau que
  existe;
- **modo** — a base tem graus **de modo** (`branco` = `#FFFFFF` claro,
  `#161625` escuro) e **estáticos** (`roxo`, `roxo-forte`, `roxo-claro`,
  `branco-fixo`, `rail-active-*`), marcados com `estatico` no `tokens.json`. Um
  token semântico invariante de modo (`invarianteDeModo`) só pode referenciar
  grau **estático**. É o que impede `--primary-foreground: var(--color-branco)`
  — o que a própria D1.1 sugere — de virar rótulo `#161625` sobre o roxo no
  escuro, a 3,78:1.
- **coincidência** (D7, JET-109) — a recíproca do anterior: um grau marcado
  **de modo** que entrega o **mesmo valor** nos dois modos está dizendo uma
  coisa e fazendo outra, e é assim que um par escuro que nunca existiu passa
  despercebido. Foi o caso do `secondary-active`: `#7a33ee` nos dois modos, e no
  escuro isso é o rótulo do item **ativo** da sidebar secundária a **2,37:1**
  sobre a pílula. Ou o grau ganha par (`secondary-active` agora é `#7a33ee`
  claro / `#ad86fa` escuro), ou registra `porqueCoincide` explicando por que o
  valor único não esconde uma reprovação **no papel que ele exerce** — é o que
  `verde` e `status-critico` fazem: são graus de preenchimento, e o papel de
  texto ao lado deles (`verde-dark`, `status-critico-texto`) esse sim é de modo.

  > O guard cobrou o que prometia. Ao escrever o `porqueCoincide` do `verde`
  > apareceu um papel que ninguém tinha medido — o de **marca**, na 1.4.11 — e
  > ele reprovava. Virou a JET-120 e a D8, abaixo. A justificativa por escrito
  > não é formalidade: é o momento em que a pergunta "em que papel?" é feita.

## Acrescentar um token ao tema — quem vem primeiro depende do `@import`

> Vale para a **escala JETOOH**. Token semântico novo é outra história: o pacote
> envia o valor, então basta entrar no `tokens.json → semantic` e no `theme.css`
> (o `contract.test.ts` cobra os dois em sincronia, nos dois modos).

Token novo no `tokens.json` é mudança de **contrato**: a utility (`border-x`,
`bg-x`, …) só existe no CSS de uma app se `--color-x` estiver declarado em algum
`@theme` que o Tailwind dela enxergue. Senão a classe aponta para uma variável
inexistente e, no Tailwind v4, a borda cai para o `currentColor` — borda quase
preta no campo.

**Desde a JET-106 há duas fontes possíveis para esse `@theme`**, e é o que a app
já tem no `index.css` que decide a ordem do rollout:

- **App que faz `@import "@jetooh/ui/theme.css"`** — o pacote envia a camada base
  (ver a tabela acima: quem envia é o pacote, nas duas camadas). A utility passa
  a existir junto com o token, e a ordem deixa de ser crítica: subir o pacote
  primeiro não produz borda preta. Declarar o token no `index.css` continua
  válido — a declaração local vem depois do `@import` e vence na cascata — mas
  vira redundância, e apagá-la é a migração descrita em "Adotar o Dashboard2026".
- **App que ainda NÃO faz esse `@import`** — nada mudou: sem declaração local não
  há `--color-x` nenhum, e a app **tem que vir primeiro**.

Enquanto houver uma app dos dois tipos, a ordem abaixo é a que serve para as
duas, porque declarar antes é inofensivo no primeiro caso e obrigatório no
segundo:

1. Token entra no `tokens.json` (claro **e** escuro) e é documentado em
   `manifest.json → cssContract.tokensNovos` (valor, motivo, ordem de rollout).
2. **Cada app consumidora** declara `--color-<token>` no `index.css`, nos dois
   modos, com os valores do `tokens.json`.
3. Só então o pacote passa a usar a classe e as apps sobem a versão do
   `@jetooh/ui` (`github:jetooh/ui#<sha>`).
4. `node scripts/token-drift.mjs` (no pilot) valida claro+escuro em cada app.

> Lembrete: `dist/` é versionado e é o que o Tailwind das apps varre pelo
> `@source`. Mudou classe em `src/`, **rode `npm run build`** — sem o `dist`
> regenerado a correção não chega em app nenhuma.

### Tokens de borda: `borda-controle` × `gray-200`

| Uso | Token | Por quê |
|-----|-------|---------|
| Borda que **delimita um controle** (`Input`, `Select`, `NativeSelect`, `DateTimeField`, gatilho e campos de data do `DateRangePicker`, botão de voltar do `DetailHeader`) | `borda-controle` (`#85858c` claro / `#6b6b8f` escuro) | O controle é branco dentro de card branco: a borda é a única delimitação da área clicável e WCAG 1.4.11 exige **3:1**. Claro mede 3.66 / 3.33 / 3.10 e escuro 3.51 / 3.84 / 3.28 sobre `branco` / `page-bg` / `gray-100`. |
| Borda de **superfície** (card, `PageFrame`, `Modal`, `Toast`, divisores) | `gray-200` | Não delimita controle — 3:1 não é exigido; escurecer sujaria a tela à toa. `gray-200` mede 1.26:1 sobre `branco`. |
| Borda de **controle ROTULADO** (cartões de opção do `DateRangePicker`, botão `Cancelar` do `ConfirmDialog`/`AlertDialog`) | `gray-200` | **Exceção registrada na JET-102.** O rótulo de texto (`gray-600` = 7.56:1) já identifica o controle, então a borda não é "informação necessária para identificar o componente" e a 1.4.11 não a exige. Nos cartões, escurecer as bordas não-selecionadas ainda reduziria o contraste entre selecionado (`border-roxo` + `bg-roxo/5`) e não-selecionado, que **é** exigido. Reavaliar se um desses controles perder o rótulo. |

### Texto sobre fundo **translúcido**: mede-se contra o que fica atrás

O item ativo da sidebar secundária é `text-secondary-active` sobre
`bg-secondary-active-bg`, e no escuro esse fundo é
`color-mix(in oklch, var(--primary) 15%, transparent)` — **translúcido**. Um
token assim não tem cor até se saber o que está embaixo: a mesma pílula resolve
`#1e1439` sobre `page-bg`, `#2e2452` sobre o rail e `#281d46` sobre o card.

Foi exatamente aí que o primeiro par proposto para a JET-109 morreu: `#a06ef7`
mede **4,70:1** contra o **rail** e **4,07:1** contra a **pílula** que fica em
cima dele — aprovado contra o fundo errado. O par fechado (`#ad86fa`) é medido
contra o envelope inteiro (5,08 rail / 5,59 card / 6,23 page-bg) e o
`contrast.test.tsx` **resolve
o `color-mix` a partir da declaração do `tokens.json`**, em vez de comparar com
um hex copiado à mão, justamente para essa distinção não depender de quem lê.

**Regra de bolso para decidir entre os dois:** o controle tem rótulo de texto
ou ícone próprio com ≥3:1? Então quem o identifica é o rótulo, e a borda pode
ficar em `gray-200`. É um campo vazio ou um botão só-ícone, em que o alvo
clicável só existe porque a caixa está desenhada? Então a borda É a informação
e vai em `borda-controle`.

Guarda-corpo: `src/components/contrast.test.tsx` calcula os contrastes a partir
do `tokens.json` (claro e escuro), mede o token contra as **três** superfícies
do envelope (`branco`, `page-bg`, `gray-100`) e reprova se um controle voltar a
se delimitar com `border-gray-*` sobre `bg-branco`.

### Marca de estado × preenchimento: qual verde (D8 / JET-120)

O verde tem dois graus, e o que decide entre eles é **se a cor é a única coisa
que carrega a informação**, não se o elemento é texto ou não.

| Papel | Token | Mínimo | Medido (claro / escuro) |
|---|---|---|---|
| **Marca** de estado: `StatusDot` **sozinho**, ícone `success` do `Toast` | `verde-dark` (`#065f46` claro / `#34d399` escuro) | **3:1** (1.4.11) | 7,68 / 6,99 / 6,51 · 9,29 / 10,17 / 8,68 sobre `branco` / `page-bg` / `gray-100` |
| **Texto** sobre a lavagem (rótulo do `StatusBadge`, trend do `KpiCard`) | `verde-dark` | 4,5:1 (1.4.3) | 7,19 / 6,58 / 6,18 na lavagem clara · 7,79 / 8,81 / 7,24 na escura |
| **Preenchimento**: lavagem `bg-verde/10`, `border-verde/20`, dot do `StatusBadge` **rotulado** | `verde` (`#34d399` nos dois modos) | — | não carrega informação: ver a exceção abaixo |

O defeito que a D8 fechou: `bg-verde` era a marca nos dois primeiros call sites e
media **1,92 / 1,75 / 1,63** no claro — reprovando a 1.4.11 — enquanto passava com
folga no escuro. É o formato da JET-109 ao contrário: um valor só, e o modo em que
ele reprova é o que ninguém olhou.

**A saída não foi um grau novo.** O par de que o papel precisa já era o do
`verde-dark`, e criar um `verde-marca` com os mesmos dois valores seria a segunda
cópia que a D1.1 proíbe — divergiria no primeiro ajuste da paleta. Como o token já
existe no contrato e as apps já o declaram (`text-verde-dark` no `KpiCard` e no
`StatusBadge`), a D8 **não tem rollout de token**: nada a declarar, nada para o
`token-drift` acusar.

**Por que DE MODO e não estático.** A alternativa levantada na issue era travar a
marca no valor claro (o `#047857` de então) nos dois modos, o que exigiria um grau estático.
Passa, mas paga margem no escuro (3,04 no pior caso, contra 8,68) — e a
invariância da D5 existe para marca sobre **preenchimento sólido**, que não
inverte com o modo (`--primary-foreground`, `--primary-hover`). Esta fica sobre a
**superfície da página**, que inverte; então o grau dela inverte junto, como
`--primary-text` e `status-critico-texto`.

**Exceção registrada — dot rotulado:** dentro do `<StatusBadge>` o dot fica ao
lado de `Online`/`Ativo`, e é o rótulo que identifica o estado. A marca não é
"informação necessária" e a 1.4.11 não a exige; escurecer o dot ali só sujaria a
pílula. É a mesma exceção da JET-102, e o `contrast.test.tsx` a amarra à sua
condição: se o rótulo da pílula deixar de passar 4,5:1, a exceção cai junto.

> Dívida de nome registrada no `tokens.json`: `verde-dark` agora exerce dois
> papéis e o nome descreve só o valor claro (no escuro ele é o verde **claro**).
> Renomear é mudança de contrato com rollout nas 3 apps por zero ganho de
> acessibilidade — fica registrado em vez de feito.

### O grau de legibilidade fecha em emerald-800 (D9 / JET-124)

A D8 mediu a **marca** contra o envelope inteiro e deixou o papel de **texto**
medido só contra a superfície **nominal**: a lavagem `bg-verde/10` resolvida em
cima de `branco` (`#ebfbf5`, 5,13:1). Mas a lavagem é **translúcida** — vale para
ela tudo o que a seção acima diz da pílula da sidebar — e o `<StatusBadge>` aceita
`className`, então a pílula `online` também cai sobre `page-bg` e `gray-100`:

| superfície atrás | lavagem resolvida | `#047857` (D8) | `#065f46` (D9) |
|---|---|---|---|
| `branco` `#FFFFFF` | `#ebfbf5` | 5,13:1 ✅ | **7,19:1** |
| `page-bg` `#f4f4f5` | `#e1f1ec` | 4,70:1 ✅ | **6,58:1** |
| `gray-100` `#ECECED` | `#daeae5` | **4,41:1** ❌ | **6,18:1** |

No escuro o grau (`#34d399`) já passava nas três (7,79 / 8,81 / 7,24) e **não
muda**.

**O envelope é o do tema, não o do componente.** A pergunta "em que superfícies
isto pode cair?" é do tema — as mesmas três de `borda-controle` (JET-102) e da
marca (D8). Envelope menor por componente é exatamente a amostragem que fez
nascer a JET-102, a JET-109 e esta.

**A saída é um passo na rampa, não um grau novo.** `verde` é `emerald-400` e
`verde-dark` era `emerald-700`; a D9 desce **um** passo, para `emerald-800`
(`#065f46`). O mesmo passo corrige os **dois** papéis da D8 de uma vez (a marca
sobe para 7,68 / 6,99 / 6,51) e não acrescenta valor nenhum à base. A margem é de
propósito: 6,18 no pior caso em vez de raspar os 4,5 é o que faz o grau aguentar a
lavagem ficar mais densa (`/15` = 5,96, `/20` = 5,81) sem virar defeito de novo —
mudar o tom da lavagem é decisão visual, e ninguém iria remedir contraste por causa
dela.

**As outras duas saídas, e por que não.** *Tornar a lavagem opaca* mataria a classe
de defeito, mas custa um grau novo com par de modo, rollout de contrato nas 3 apps
— e o mesmo teria de ser feito para `bg-roxo/10`. *Exceção medida para `gray-100`*
é a saída que a JET-102 recusou por escrito: a exceção teria de afirmar que a
pílula não cai em `gray-100`, e o `className` afirma que cai.

> **Isto tem rollout, ao contrário da D8:** o **valor** de `--color-verde-dark`
> mudou. Enquanto uma app declarar `#047857` no seu `index.css`, a declaração
> local vence o `theme.css` do pacote e a app **continua reprovando**. Rastreado
> na [JET-103](/JET/issues/JET-103), como a correção de `secondary-active` (D7).

O `contrast.test.tsx` resolve a lavagem **a partir da classe declarada no
`StatusBadge.tsx`** (grau e alpha), não de um hex copiado à mão: trocar a pílula
para `bg-verde/20` move a medida junto em vez de continuar aprovando a pílula
antiga.

### O par de AVISO — âmbar (D10 / JET-298)

Mesmo formato do verde acima, achado na auditoria de dark-mode do `devices`
(2026-08-21): o `StatusBadge` já tinha um `variant="warning"` cru (paleta âmbar
do Tailwind, grau 500 no dot e 50/700/200 na pílula), sem par escuro — nunca
declarado no contrato, então nenhuma app sabia que precisava declará-lo.

| Papel | Token | Mínimo | Medido (claro / escuro) |
|---|---|---|---|
| **Marca**/texto sobre a lavagem | `aviso-texto` (`#92400E` claro / `#F59E0B` escuro) | 3:1 (1.4.11) e 4,5:1 (1.4.3) | marca: 7,09/6,45/6,01 claro · 8,32/9,11/7,77 escuro — texto na lavagem: 6,08/5,55/5,19 claro · 7,07/7,97/6,57 escuro (sobre `branco`/`page-bg`/`gray-100`) |
| **Preenchimento**: lavagem `bg-aviso/10`, `border-aviso/20`, dot da pílula | `aviso` (`#F59E0B` nos dois modos) | — | não carrega informação sozinho: como marca reprova no claro (2,15/1,95/1,82), mesma exceção do `verde` |

**Diferença do verde: nasceu no contrato antes de ter um call-site em produção
com o par certo.** `admin` já consumia `variant="warning"` (CatalogPage,
ModerationPage) com a paleta crua; o claro escolhido (`#92400E`) é o MESMO hex
que essas telas já pintavam (`text-amber-800`), então o defeito era só a
ausência de par escuro — igual ao `verde-dark` antes da D8.

**Rollout não-uniforme (checado 2026-08-22):** `platform`/`devices` importam
`@jetooh/ui/theme.css` e recebem os dois graus automaticamente ao repinar;
`admin` ainda não importa `theme.css` (modelo pré-JET-106) e precisa declarar
`--color-aviso`/`--color-aviso-texto` (+ o par `:root`/`.dark` de
`--base-aviso-texto`) no próprio `index.css` ANTES do repin ter efeito nas 2
telas que já usam `variant="warning"` — ver `manifest.json` →
`cssContract.tokensNovos["aviso | aviso-texto"]`.

## Criar um tema NOVO (quando surgir um 2º tema)

Enquanto houver 1 tema, ele fica na raiz. **Ao introduzir o 2º tema**, migrar para
export por-tema (sem quebrar quem usa a raiz):

1. `src/themes/<novo-id>/` com `manifest.json` + `tokens.json` próprios (nova régua/paleta).
2. Componentes/casca do novo tema em `src/themes/<novo-id>/components/` e um
   `src/themes/<novo-id>/index.ts`.
3. Adicionar um export condicional no `package.json` (`"./themes/<id>"`) e no tsup
   (múltiplos entries), para `import { AppRail } from "@jetooh/ui/themes/<id>"`.
4. Manter a raiz apontando para o Dashboard2026 (compat) OU deprecá-la conscientemente.
5. Registrar o tema neste catálogo + em `token-drift` (roda com `THEME=<id>`).

## Onboarding de app nova — SEMPRE perguntar o tema

Ao criar uma aplicação nova no ecossistema, **perguntar ao dono**:
**(a) seguir um tema existente** (ex.: Dashboard2026) — a app entra na fonte única desse
tema e valida no `token-drift`; ou **(b) criar um tema novo** — segue a seção acima.
Ver a regra `jetooh-theme-system` (onboarding).
