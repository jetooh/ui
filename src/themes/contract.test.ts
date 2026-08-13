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
//
// JET-106 acrescentou a QUINTA classificação e as regras que ela traz:
//   5. tokens.semantic                        — camada semântica, em oklch(),
//                                               ENVIADA pelo pacote (theme.css).
// Com ela vieram quatro guardas novos, todos do ADR-001: nenhum token do
// contrato em tripla HSL crua; `hsl(var(` proibido no CSS do pacote; par
// `:root`/`.dark` completo para todo token semântico; e o round-trip que prova
// que cada token semântico converte EXATO para o grau da escala JETOOH que ele
// diz expor.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { describe, it, expect } from 'vitest';

import tokens from './dashboard-2026/tokens.json';
import manifest from './dashboard-2026/manifest.json';
import { OKLCH_CANONICO, hexToOklch, oklchToHex, parseOklch } from './oklch';

const COMPONENTS_DIR = resolve(process.cwd(), 'src/components');
const THEME_DIR = resolve(process.cwd(), 'src/themes/dashboard-2026');
const SRC_DIR = resolve(process.cwd(), 'src');

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

type SemanticEntry = {
  /** Grau da escala JETOOH que o token expõe; `null` = valor próprio. */
  grauClaro: string | null;
  grauEscuro: string | null;
  claro: string;
  escuro: string;
  derivado?: boolean;
  porque?: string;
};
const semantic = tokens.semantic as unknown as Record<string, SemanticEntry>;
const SEMANTIC_TOKENS = Object.keys(semantic);

// A camada semântica conta como DECLARADA: o pacote envia o valor (D0.1), então
// a app não precisa fazer nada para a utility existir. É a diferença entre esta
// camada e a escala JETOOH, que segue declaração-obrigatória.
const declared = new Set([...Object.keys(tokens.colors), ...SEMANTIC_TOKENS]);
const external = new Set<string>([
  ...manifest.cssContract.tokensExternosTailwind.lista,
  ...manifest.cssContract.tokensSoEmVariante.lista,
]);
// `fechadasEm` é o registro de quem SAIU da lista — não é uma lacuna.
const NAO_E_LACUNA = new Set(['nota', 'fechadasEm']);
const gaps = new Set(
  Object.keys(manifest.cssContract.lacunasAbertas).flatMap((key) => {
    if (NAO_E_LACUNA.has(key)) return [];
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

// ---------------------------------------------------------------------------
// JET-106 / ADR-001 — camada semântica: formato canônico e entrega
// ---------------------------------------------------------------------------

/** Todo arquivo de fonte do pacote (para varreduras que valem no repo inteiro). */
function allSources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return allSources(full);
    return /\.(tsx?|css|json)$/.test(name) ? [full] : [];
  });
}

/** Remove comentários CSS antes de parsear — comentário não é declaração. */
const stripCss = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Extrai `--token: valor;` de um bloco nomeado do theme.css. */
function cssBlock(css: string, selector: string): Record<string, string> {
  const re = new RegExp(`${selector}\\s*\\{([^}]*)\\}`);
  const body = re.exec(stripCss(css))?.[1];
  if (body === undefined) throw new Error(`bloco ${selector} não encontrado em theme.css`);
  const out: Record<string, string> = {};
  for (const m of body.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

const THEME_CSS = readFileSync(resolve(THEME_DIR, 'theme.css'), 'utf8');

describe('camada semântica: formato canônico (ADR-001 D1)', () => {
  it('os 18 tokens do shadcn e os 3 que a JET-105/JET-106 acrescentaram', () => {
    const OS_18_DO_SHADCN = [
      'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
      'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'muted',
      'muted-foreground', 'accent', 'accent-foreground', 'destructive', 'border', 'input', 'ring',
    ];
    // O conjunto exato que estava em lacunasAbertas precisa ter saído inteiro.
    expect(OS_18_DO_SHADCN.filter((t) => !SEMANTIC_TOKENS.includes(t))).toEqual([]);
    // Mais `secondary-active-bg` (D3) e o par que a JET-105 separou de --primary.
    expect(SEMANTIC_TOKENS.filter((t) => !OS_18_DO_SHADCN.includes(t))).toEqual([
      'primary-hover',
      'link',
      'secondary-active-bg',
    ]);
    expect(SEMANTIC_TOKENS).toEqual(manifest.cssContract.camadaSemantica.tokens);
  });

  it('todo token semântico tem par :root/.dark COMPLETO — par incompleto reprova', () => {
    // Um token só no claro vira `currentColor` no dark: some a cor, não o build.
    const incompletos = SEMANTIC_TOKENS.filter(
      (t) => !semantic[t].claro?.trim() || !semantic[t].escuro?.trim(),
    );
    expect(incompletos).toEqual([]);
  });

  it('nenhum token do contrato em tripla HSL crua', () => {
    // `262 100% 64%` — o formato que só é cor dentro de um hsl() que alguém
    // lembrou de escrever. É o que o D1 proíbe, e o modo de falha é silencioso.
    const TRIPLA_CRUA = /^\s*-?[\d.]+\s+[\d.]+%\s+[\d.]+%\s*$/;
    const ofensores = SEMANTIC_TOKENS.flatMap((t) =>
      (['claro', 'escuro'] as const)
        .filter((modo) => TRIPLA_CRUA.test(semantic[t][modo]))
        .map((modo) => `${t}.${modo} = ${semantic[t][modo]}`),
    );
    expect(ofensores).toEqual([]);
  });

  it('todo token não-derivado é oklch() canônico: L 1 casa, C 3 casas ou 0, H 1 casa', () => {
    const foraDaGramatica = SEMANTIC_TOKENS.flatMap((t) =>
      (['claro', 'escuro'] as const)
        .filter((modo) => !semantic[t].derivado && !OKLCH_CANONICO.test(semantic[t][modo]))
        .map((modo) => `${t}.${modo} = ${semantic[t][modo]}`),
    );
    expect(foraDaGramatica).toEqual([]);
  });

  it('token derivado é color-mix(in oklch, …) e declara o porquê da derivação', () => {
    for (const t of SEMANTIC_TOKENS.filter((k) => semantic[k].derivado)) {
      expect(semantic[t].claro).toMatch(/^color-mix\(in oklch, /);
      expect(semantic[t].escuro).toMatch(/^color-mix\(in oklch, /);
      expect(semantic[t].porque).toEqual(expect.any(String));
    }
  });

  it('cinza é C 0 e H 0 — chroma zero não carrega matiz', () => {
    for (const t of SEMANTIC_TOKENS.filter((k) => !semantic[k].derivado)) {
      for (const modo of ['claro', 'escuro'] as const) {
        const cor = parseOklch(semantic[t][modo])!;
        if (cor.c === 0) expect(`${t}.${modo}=${cor.h}`).toBe(`${t}.${modo}=0`);
      }
    }
  });

  it('`hsl(var(` está proibido no CSS e no código do pacote', () => {
    // A engrenagem do Tailwind v3/shadcn-legacy. Uma utility do pacote embrulhada
    // em hsl() não sobrevive a um consumidor que declara cor completa — e o repo
    // está no v4, onde `bg-primary/50` funciona nativamente sobre cor completa.
    // A varredura ignora COMENTÁRIO e ignora os .json do tema: lá o padrão só
    // aparece sendo nomeado como proibido, e um guard que proíbe falar do defeito
    // proíbe também documentá-lo.
    const semComentario = (code: string) =>
      code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    const ofensores = allSources(SRC_DIR)
      .filter((f) => /\.(tsx?|css)$/.test(f) && !f.endsWith('contract.test.ts'))
      .filter((f) => semComentario(readFileSync(f, 'utf8')).includes('hsl(var('))
      .map((f) => f.replace(`${SRC_DIR}/`, ''));
    expect(ofensores).toEqual([]);
  });

  it('e o contrato registra a proibição por escrito, não só no teste', () => {
    expect(manifest.cssContract.camadaSemantica.formato.proibido.join(' ')).toContain('hsl(var(--x))');
  });
});

describe('camada semântica: round-trip contra a escala JETOOH (prova exigida pelo ADR-001)', () => {
  // Âncora INDEPENDENTE: as 4 conversões que o ADR-001 publica como medidas.
  // Sem isto, um erro na aritmética do oklch.ts passaria despercebido, porque o
  // mesmo código gera e confere os valores do tokens.json.
  const MEDIDAS_DO_ADR = [
    { hex: '#8b47ff', oklch: 'oklch(58.6% 0.253 294)', o_que: 'roxo da marca' },
    { hex: '#f3edff', oklch: 'oklch(95.6% 0.025 301)', o_que: '--base-roxo-light claro' },
    { hex: '#161625', oklch: 'oklch(20.8% 0.030 284)', o_que: 'fundo escuro' },
    { hex: '#6b7280', oklch: 'oklch(55.1% 0.023 264)', o_que: 'gray-500' },
  ] as const;

  it.each(MEDIDAS_DO_ADR)('$o_que: $hex ↔ $oklch (valor medido no ADR-001)', ({ hex, oklch }) => {
    expect(oklchToHex(parseOklch(oklch)!)).toBe(hex);
    const medido = hexToOklch(hex);
    const esperado = parseOklch(oklch)!;
    expect(Number(medido.l.toFixed(1))).toBe(esperado.l);
    expect(Number(medido.c.toFixed(3))).toBe(esperado.c);
    expect(Math.abs(medido.h - esperado.h)).toBeLessThanOrEqual(0.5);
  });

  it('todo token semântico com grau converte EXATO para o hex do grau', () => {
    // É isto que impede a camada semântica e a escala JETOOH de voltarem a ser
    // duas paletas diferentes — e é o round-trip por token que o ADR-001 pede
    // antes de qualquer flip.
    const erros: string[] = [];
    for (const t of SEMANTIC_TOKENS) {
      for (const [modo, grauKey, escala] of [
        ['claro', 'grauClaro', tokens.colors],
        ['escuro', 'grauEscuro', tokens.colorsDark],
      ] as const) {
        const grau = semantic[t][grauKey];
        if (!grau) continue;
        const esperado = (escala as Record<string, string>)[grau].toLowerCase();
        const obtido = oklchToHex(parseOklch(semantic[t][modo])!);
        if (obtido !== esperado) erros.push(`${t}.${modo}: ${semantic[t][modo]} → ${obtido}, grau ${grau} = ${esperado}`);
      }
    }
    expect(erros).toEqual([]);
  });

  it('token sem grau precisa justificar por que tem valor próprio', () => {
    // Grau `null` sem `porque` é o caminho de volta para a cor escolhida no
    // escuro por alguém que não registrou o motivo.
    for (const t of SEMANTIC_TOKENS) {
      const { grauClaro, grauEscuro, porque } = semantic[t];
      if (grauClaro && grauEscuro) continue;
      // Frase inteira, não um "TODO": a justificativa é o que impede o valor
      // próprio de virar cor escolhida no escuro sem ninguém saber por quê.
      const curtaDemais = (porque ?? '').length <= 80 ? [t] : [];
      expect(curtaDemais).toEqual([]);
    }
  });
});

describe('camada semântica: o pacote ENVIA a camada (ADR-001 D0.1)', () => {
  const root = cssBlock(THEME_CSS, ':root');
  const dark = cssBlock(THEME_CSS, '\\.dark');
  const theme = cssBlock(THEME_CSS, '@theme inline');

  it(':root envia exatamente os tokens da camada semântica', () => {
    expect(Object.keys(root).sort()).toEqual([...SEMANTIC_TOKENS].sort());
  });

  it('.dark envia o mesmo conjunto — par incompleto no CSS reprova igual', () => {
    expect(Object.keys(dark).sort()).toEqual([...SEMANTIC_TOKENS].sort());
  });

  it('@theme inline mapeia --color-<token> para cada um (senão a utility não existe)', () => {
    // No Tailwind v4 `bg-primary` só nasce se `--color-primary` estiver no tema.
    // Declarar `--primary` no :root sem este bloco entrega a variável e nenhuma
    // classe — exatamente a falha silenciosa que a JET-77 descreve.
    expect(Object.keys(theme).sort()).toEqual(SEMANTIC_TOKENS.map((t) => `color-${t}`).sort());
    for (const t of SEMANTIC_TOKENS) expect(theme[`color-${t}`]).toBe(`var(--${t})`);
  });

  it('o theme.css não inventa valor: bate com o tokens.json nos dois modos', () => {
    for (const t of SEMANTIC_TOKENS) {
      expect(`${t} claro = ${root[t]}`).toBe(`${t} claro = ${semantic[t].claro}`);
      expect(`${t} escuro = ${dark[t]}`).toBe(`${t} escuro = ${semantic[t].escuro}`);
    }
  });

  it('o pacote exporta o theme.css e não o trata como sem efeito colateral', () => {
    const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'));
    expect(pkg.exports['./theme.css']).toBe('./dist/theme.css');
    // `sideEffects: false` faria o bundler da app descartar o import do CSS.
    expect(pkg.sideEffects).toContain('**/*.css');
  });
});

describe('overrides são registrados, não escondidos (ADR-001 D0.2)', () => {
  const { entradas, porqueVazia } = manifest.cssContract.overridesRegistrados as unknown as {
    entradas: Array<{
      token: string;
      app: string;
      valorEfetivo: { claro: string; escuro: string };
      valorCanonico: { claro: string; escuro: string };
      dono: string;
      motivo: string;
      ticketExpiracao: string;
    }>;
    porqueVazia?: { nota: string; decisao: string; migracaoPendente: { bloqueadaPor: string } };
  };

  it('lista vazia é decisão registrada, não lista esquecida', () => {
    // O único candidato era o --primary neutro do platform. A JET-105 fechou pelo
    // FLIP, então registrar override seria transformar dívida em permissão: a
    // divergência que sobra é MIGRAÇÃO pendente, e o token-drift deve acusá-la.
    if (entradas.length === 0) {
      expect(porqueVazia?.decisao).toMatch(/JET-\d+/);
      expect(porqueVazia?.migracaoPendente.bloqueadaPor).toMatch(/JET-\d+/);
    }
  });

  it('o canônico do --primary é a marca, não o neutro do scaffold (JET-105, opção A)', () => {
    expect(semantic.primary.claro).toBe('oklch(58.6% 0.253 294)');
    expect(semantic.primary.escuro).toBe('oklch(58.6% 0.253 294)');
    expect(entradas.filter((o) => o.token === 'primary')).toEqual([]);
  });

  it('toda entrada tem token, app, valor efetivo, dono, motivo e ticket de expiração', () => {
    for (const o of entradas) {
      expect(o).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          app: expect.any(String),
          valorEfetivo: expect.objectContaining({ claro: expect.any(String), escuro: expect.any(String) }),
          dono: expect.any(String),
          motivo: expect.any(String),
          ticketExpiracao: expect.stringMatching(/^JET-\d+$/),
        }),
      );
    }
  });

  it('override aponta para token que existe na camada semântica', () => {
    // Override de token inexistente é dívida registrada contra nada.
    expect(entradas.filter((o) => !SEMANTIC_TOKENS.includes(o.token))).toEqual([]);
  });

  it('override só existe porque DIVERGE — valor efetivo igual ao canônico é ruído', () => {
    for (const o of entradas) {
      expect(o.valorEfetivo.claro).not.toBe(semantic[o.token].claro);
    }
  });

  it('o valor canônico registrado no override é o do tokens.json', () => {
    for (const o of entradas) {
      expect(o.valorCanonico.claro).toBe(semantic[o.token].claro);
      expect(o.valorCanonico.escuro).toBe(semantic[o.token].escuro);
    }
  });
});

describe('contrato de tema: lacunas são explícitas, não esquecimento', () => {
  it('a camada semântica saiu de lacunasAbertas — e o registro de saída ficou', () => {
    for (const t of SEMANTIC_TOKENS) expect(gaps.has(t)).toBe(false);
    // Sair da lista é decisão explícita: quem fechou, e por qual decisão.
    expect(Object.keys(manifest.cssContract.lacunasAbertas.fechadasEm)).toEqual([
      'camadaSemanticaShadcn',
      'secondary-active-bg',
      'gray-400',
    ]);
  });

  it('toda lacuna aberta registra o uso e a decisão pendente', () => {
    for (const [key, entry] of Object.entries(manifest.cssContract.lacunasAbertas)) {
      if (NAO_E_LACUNA.has(key)) continue;
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
