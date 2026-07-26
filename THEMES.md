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
