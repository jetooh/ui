// Guard-rail de COMPLETUDE do contrato de tema (JET-77).
//
// O contrast.test.tsx guarda o VALOR dos tokens. Este aqui guarda a outra
// metade, que não tinha dono: **todo token que o pacote emite como classe
// utilitária BARE precisa estar classificado no contrato**.
//
// Por que isso importa: no Tailwind v4 a utility `bg-verde` só existe no CSS da
// app se a app declarar `--color-verde`. O pacote é compilado no @source da app.
// Então um componente do @jetooh/ui que usa uma classe que o contrato não
// declara sai **sem a cor** na app consumidora — falha silenciosa, e o
// token-drift do pilot não acusa, porque ele compara o que ESTÁ no tokens.json.
// Era exatamente o caso de verde/verde-dark/status-critico/secondary-* antes
// desta issue: 4 componentes pintavam status por classes que nenhuma app novata
// saberia que precisa declarar.
//
// Um token pode estar em quatro lugares, e só quatro:
//   1. tokens.json (colors)                  — token JETOOH, medido, sob drift;
//   2. cssContract.tokensExternosTailwind    — default do Tailwind v4;
//   3. cssContract.tokensSoEmVariante        — token JETOOH que só aparece sob
//                                              hover:/focus:, fora do drift
//                                              porque não dá para medir;
//   4. cssContract.lacunasAbertas            — gap CONHECIDO, com decisão
//                                              pendente registrada e dona.
// Qualquer classe nova fora disso reprova aqui — que é o ponto: o contrato não
// pode voltar a ficar incompleto por esquecimento, só por decisão explícita.
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

import tokens from './dashboard-2026/tokens.json';
import manifest from './dashboard-2026/manifest.json';

const COMPONENTS_DIR = resolve(process.cwd(), 'src/components');

// Prefixos de utility que resolvem uma COR a partir de um token do tema.
const COLOR_PREFIXES = [
  'bg',
  'text',
  'border',
  'ring',
  'fill',
  'stroke',
  'divide',
  'placeholder',
  'outline',
  'decoration',
  'from',
  'to',
  'via',
] as const;

// Sufixos do Tailwind que compartilham o prefixo mas NÃO nomeiam cor: lado
// (`border-b`), espessura (`border-2`), tamanho de fonte (`text-sm`),
// alinhamento (`text-left`), palavras-chave de cor (`bg-transparent`) e
// utilities compostas (`bg-clip-padding`, `ring-offset-2`).
const NOT_A_COLOR = new Set([
  'b', 't', 'l', 'r', 'x', 'y', 's', 'e', 'none', 'auto', 'hidden',
  'solid', 'dashed', 'dotted', 'double', 'transparent', 'current', 'inherit',
  'white', 'black', 'left', 'right', 'center', 'justify', 'start', 'end',
  'wrap', 'nowrap', 'ellipsis', 'clip', 'balance', 'pretty',
  '2xs', 'xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl',
  '6xl', '7xl',
  'clip-padding', 'clip-text', 'clip-border', 'blend-color', 'blend-multiply',
]);

const declared = new Set(Object.keys(tokens.colors));
const external = new Set<string>([
  ...manifest.cssContract.tokensExternosTailwind.lista,
  ...manifest.cssContract.tokensSoEmVariante.lista,
]);
const gaps = new Set(
  Object.keys(manifest.cssContract.lacunasAbertas).flatMap((key) => {
    if (key === 'nota') return [];
    const entry = (manifest.cssContract.lacunasAbertas as Record<string, unknown>)[key];
    const list = (entry as { tokens?: string[] }).tokens;
    return list ?? [key];
  }),
);

type Usage = { token: string; file: string; bare: boolean };

/** Extrai os tokens de cor usados em um arquivo de componente. */
function usages(file: string, code: string): Usage[] {
  const found: Usage[] = [];
  const re = new RegExp(
    // (variantes como `hover:`/`dark:`) + prefixo de cor + nome do token
    String.raw`(?<![\w-])((?:[a-z0-9-]+:)*)(${COLOR_PREFIXES.join('|')})-([a-zA-Z][a-zA-Z0-9._/-]*)`,
    'g',
  );
  for (const m of code.matchAll(re)) {
    const [, variants, , rest] = m;
    const token = rest.split('/')[0]; // `bg-verde/30` → `verde`
    if (NOT_A_COLOR.has(token)) continue;
    if (/^\d/.test(token)) continue; // `border-2`, `ring-1`
    if (/^(b|t|l|r|x|y|s|e)-/.test(token)) continue; // `border-b-2`
    if (/^offset-/.test(token)) continue; // `ring-offset-2`
    found.push({ token, file, bare: variants === '' });
  }
  return found;
}

const ALL: Usage[] = readdirSync(COMPONENTS_DIR)
  .filter((f) => /\.tsx?$/.test(f) && !f.includes('.test.'))
  .flatMap((f) => usages(f, readFileSync(resolve(COMPONENTS_DIR, f), 'utf8')));

/** Onde cada token não classificado aparece — só para a mensagem de erro. */
function unclassified(list: Usage[]) {
  const out = new Map<string, Set<string>>();
  for (const u of list) {
    if (declared.has(u.token) || external.has(u.token) || gaps.has(u.token)) continue;
    if (!out.has(u.token)) out.set(u.token, new Set());
    out.get(u.token)!.add(u.file);
  }
  return [...out].map(([token, files]) => `${token} (${[...files].sort().join(', ')})`).sort();
}

describe('contrato de tema: completude', () => {
  it('o pacote não emite classe BARE de token que o contrato não classifica', () => {
    // BARE = a app precisa da utility sem variante. É o caso que quebra render.
    expect(unclassified(ALL.filter((u) => u.bare))).toEqual([]);
  });

  it('o mesmo vale para tokens usados só em variante (hover:, dark:, …)', () => {
    // Menos grave (a variante some, o estado base continua pintando), mas a
    // utility também só existe se a app declarar o token — por isso eles têm
    // uma seção própria no contrato (`tokensSoEmVariante`) em vez de uma lista
    // solta aqui dentro do teste.
    const variantOnly = ALL.filter(
      (u) => !u.bare && !ALL.some((o) => o.bare && o.token === u.token),
    );
    expect(unclassified(variantOnly)).toEqual([]);
  });

  it('o scanner realmente enxerga os componentes (guarda contra regex vazia)', () => {
    // Sem isto, um erro de regex faria os testes acima passarem por vacuidade.
    expect(ALL.length).toBeGreaterThan(100);
    expect(ALL.some((u) => u.token === 'roxo')).toBe(true);
  });
});

describe('contrato de tema: claro e escuro andam juntos', () => {
  it('colors e colorsDark declaram exatamente o mesmo conjunto de tokens', () => {
    // Um token só no claro vira `currentColor` no dark da app — a regressão que
    // a ordem de rollout da JET-101 descreve, só que dentro do próprio tema.
    expect(Object.keys(tokens.colorsDark).sort()).toEqual(Object.keys(tokens.colors).sort());
  });

  it('todo token declarado é hex de 6 dígitos nos dois modos', () => {
    const hex = /^#[0-9a-fA-F]{6}$/;
    for (const [name, value] of Object.entries(tokens.colors)) {
      expect(`${name}=${value}`).toMatch(new RegExp(`^${name}=#[0-9a-fA-F]{6}$`));
      expect(value).toMatch(hex);
    }
    for (const value of Object.values(tokens.colorsDark)) expect(value).toMatch(hex);
  });
});

describe('contrato de tema: lacunas são explícitas, não esquecimento', () => {
  it('toda lacuna aberta registra o uso e a decisão pendente', () => {
    for (const [key, entry] of Object.entries(manifest.cssContract.lacunasAbertas)) {
      if (key === 'nota') continue;
      expect(entry).toHaveProperty('problema');
      expect(entry).toHaveProperty('decisaoPendente');
      expect((entry as { usadoPor?: string[]; tokens?: string[] })).toEqual(
        expect.objectContaining({ problema: expect.any(String) }),
      );
    }
  });

  it('nenhum token está declarado e em lacuna ao mesmo tempo', () => {
    expect([...gaps].filter((t) => declared.has(t))).toEqual([]);
  });
});
