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
│   │       └── tokens.json    ← tokens canônicos (claro + escuro) — fonte única
│   └── index.ts               ← export raiz (= Dashboard2026 enquanto houver 1 tema)
└── THEMES.md                  ← este arquivo (registro de temas)
```

## Adotar o Dashboard2026 numa app (padrão)

1. `npm install "github:jetooh/ui#main"` (ou npm quando publicado — ver
   `docs/process/ui-npm-publish-migration.md`).
2. `@source "../node_modules/@jetooh/ui/dist"` no `index.css` (Tailwind v4 gera as classes).
3. Definir **todos** os tokens do `tokens.json` no `index.css`, em **claro e escuro**
   (valores da régua = `platform`). Consumir a casca/componentes de `@jetooh/ui`.
4. Rodar `node scripts/token-drift.mjs` (no pilot) — não pode divergir do manifesto.

## Acrescentar um token ao tema — a app vem PRIMEIRO

Token novo no `tokens.json` é mudança de **contrato**: a utility (`border-x`,
`bg-x`, …) só existe no CSS de uma app depois que ela declara `--color-x` no seu
`index.css`. Por isso a ordem do rollout é fixa — inverter a ordem deixa o
componente com a classe apontando para uma variável inexistente (no Tailwind v4
a borda cai para o `currentColor`, ou seja, uma borda quase preta no campo):

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
| Borda que **delimita um controle** (`Input`, `Select`, `NativeSelect`, `DateTimeField`, gatilho e campos de data do `DateRangePicker`) | `borda-controle` (`#8b8b93` claro / `#6b6b8f` escuro) | Campo branco dentro de card branco: a borda é a única delimitação da área clicável e WCAG 1.4.11 exige **3:1**. Mede 3.38:1 sobre `branco` e 3.08:1 sobre `page-bg` (escuro: 3.51:1 e 3.84:1). |
| Borda de **superfície** (card, `PageFrame`, `Modal`, `Toast`, divisores) | `gray-200` | Não delimita controle — 3:1 não é exigido; escurecer sujaria a tela à toa. `gray-200` mede 1.26:1 sobre `branco`. |

Guarda-corpo: `src/components/contrast.test.tsx` calcula os contrastes a partir
do `tokens.json` (claro e escuro) e reprova se um controle voltar a se delimitar
com `border-gray-*` sobre `bg-branco`.

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
