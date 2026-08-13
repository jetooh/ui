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
//   5. tokens.semantic                        — camada semântica, ENVIADA pelo
//                                               pacote (theme.css).
// Com ela vieram os guardas do ADR-001: nenhum token do contrato em tripla HSL
// crua; `hsl(var(` proibido no CSS do pacote; par `:root`/`.dark` completo para
// todo token semântico; e o round-trip que prova que o valor emitido converte
// EXATO para o hex do grau que ele diz expor.
//
// A revisão 4 do ADR-001 acrescentou os dois que fecham a duplicação de valor:
//   · GUARD DE LITERAL (D1.1) — a camada semântica não escreve cor, só
//     `var(--color-<grau>)` ou `color-mix()` sobre `var()`. Um literal aqui é
//     uma segunda cópia do valor que já existe na base, e duas cópias divergem
//     no primeiro ajuste de marca: é a máquina que produziu a JET-78.
//   · GUARD DE MODO (D5) — a base tem graus DE MODO (`branco` = #FFFFFF claro,
//     #161625 escuro) e ESTÁTICOS (`branco-fixo`). Um token semântico
//     invariante de modo só pode referenciar grau estático. Sem isto,
//     `--primary-foreground: var(--color-branco)` — que é literalmente o que a
//     D1.1 sugere — dá rótulo #161625 sobre o roxo no escuro: 3.78:1, reprova.
// Os dois são estáticos: não precisam render.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { describe, it, expect } from 'vitest';

import tokens from './dashboard-2026/tokens.json';
import manifest from './dashboard-2026/manifest.json';
import {
  OKLCH_CANONICO,
  canonicalOklch,
  canonicalOklchDetalhe,
  hexToOklch,
  oklchToHex,
  parseBaseRef,
  parseOklch,
} from './oklch';

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
  /** Grau da camada base que o token expõe; `null` = valor próprio. */
  grauClaro: string | null;
  grauEscuro: string | null;
  /** REFERÊNCIA ao grau — `var(--color-<grau>)`, nunca o valor (D1.1). */
  claro: string;
  escuro: string;
  /** D5: vale o mesmo nos dois modos, então só pode referenciar base estática. */
  invarianteDeModo?: boolean;
  derivado?: boolean;
  porque?: string;
};
const semantic = tokens.semantic as unknown as Record<string, SemanticEntry>;
const SEMANTIC_TOKENS = Object.keys(semantic);

/** Classificação da camada base: participa do modo, ou é estática (D5). */
const base = tokens.base as unknown as Record<
  string,
  { estatico: boolean; porque?: string; porqueCoincide?: string; precisaoEstendida?: string }
>;
const BASE_TOKENS = Object.keys(tokens.colors);

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
// JET-106 / ADR-001 — as duas camadas do tema
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

type Regra = { seletores: string[]; decls: Record<string, string> };

/** Quebra o theme.css em regras (lista de seletores + declarações). */
function cssRegras(css: string): Regra[] {
  const out: Regra[] = [];
  for (const m of stripCss(css).matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const decls: Record<string, string> = {};
    for (const d of m[2].matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) decls[d[1]] = d[2].trim();
    out.push({ seletores: m[1].split(',').map((s) => s.trim()).filter(Boolean), decls });
  }
  return out;
}

const THEME_CSS = readFileSync(resolve(THEME_DIR, 'theme.css'), 'utf8');
const REGRAS = cssRegras(THEME_CSS);

/** Declarações efetivas de um seletor, na ordem em que a cascata as aplica. */
function declaracoes(seletor: string, manter: (chave: string) => boolean): Record<string, string> {
  const out: Record<string, string> = {};
  for (const r of REGRAS) {
    if (!r.seletores.includes(seletor)) continue;
    for (const [k, v] of Object.entries(r.decls)) if (manter(k)) out[k] = v;
  }
  return out;
}

const ehVarDeCor = (chave: string) => chave.startsWith('color-');
const semNoClaro = declaracoes(':root', (k) => !ehVarDeCor(k));
const semNoEscuro = declaracoes('.dark', (k) => !ehVarDeCor(k));
const baseNoClaro = declaracoes('@theme', ehVarDeCor);
const baseNoEscuro = declaracoes('.dark', ehVarDeCor);
const themeInline = declaracoes('@theme inline', () => true);

// ---------------------------------------------------------------------------
// ADR-001 D1.1 + D5 — camada BASE: onde o valor mora, e quem é de modo
// ---------------------------------------------------------------------------

describe('camada base: a única que escreve valor (ADR-001 D1.1)', () => {
  it('todo grau da escala está classificado — e só os da escala', () => {
    // Sem classificação não existe guard de modo: `estatico` é o que separa
    // `branco` (#FFFFFF claro, #161625 escuro) de `branco-fixo`.
    expect(Object.keys(base).sort()).toEqual(Object.keys(tokens.colors).sort());
  });

  it('`estatico: true` é declaração, mas não pode contradizer o valor medido', () => {
    // A marcação é intenção (coincidir hoje não torna um grau estático), mas o
    // sentido seguro é checável: se o grau diz que não participa do modo, os
    // dois modos precisam ter o MESMO valor. Sem isto, `estatico` viraria um
    // carimbo para escapar do guard de modo.
    const mentindo = BASE_TOKENS.filter(
      (n) => base[n].estatico && tokens.colors[n].toLowerCase() !== tokens.colorsDark[n].toLowerCase(),
    );
    expect(mentindo).toEqual([]);
  });

  it('grau estático justifica por escrito por que não participa do modo', () => {
    const semPorque = BASE_TOKENS.filter((n) => base[n].estatico && (base[n].porque ?? '').length <= 60);
    expect(semPorque).toEqual([]);
  });

  it('grau DE MODO com um valor só justifica a coincidência (guard da D7)', () => {
    // A recíproca do teste acima, e o guard que teria pego a JET-109 sozinho:
    // `secondary-active` estava `estatico: false` — "participo do modo" — e
    // entregava #7a33ee nos dois. A classificação dizia uma coisa e o valor
    // outra, e no escuro isso era um texto a 2.37:1 sobre a pílula.
    //
    // Coincidir não é proibido: `verde` e `status-critico` são graus de
    // PREENCHIMENTO e coincidem legitimamente. O que o guard proíbe é coincidir
    // em SILÊNCIO — ou o grau ganha par, ou registra por que o valor único não
    // esconde uma reprovação NO PAPEL que ele exerce.
    const coincidem = BASE_TOKENS.filter(
      (n) => !base[n].estatico && tokens.colors[n].toLowerCase() === tokens.colorsDark[n].toLowerCase(),
    );
    const semJustificativa = coincidem.filter((n) => (base[n].porqueCoincide ?? '').length <= 60);
    expect(semJustificativa).toEqual([]);
    // E a justificativa é do par, não do grau isolado: quem tem par não pode
    // carregar o carimbo de coincidência como resíduo de um valor antigo.
    const carimboSobrando = BASE_TOKENS.filter((n) => !coincidem.includes(n) && base[n].porqueCoincide);
    expect(carimboSobrando).toEqual([]);
  });

  it('secondary-active tem par de modo de fato — a D7 fechou a ausência', () => {
    // O defeito da JET-109 era literalmente a FALTA de uma linha no `.dark`.
    // Este teste guarda o valor; o mínimo WCAG que ele existe para atingir está
    // em src/components/contrast.test.tsx.
    expect(base['secondary-active'].estatico).toBe(false);
    expect(tokens.colorsDark['secondary-active']).not.toBe(tokens.colors['secondary-active']);
    expect(baseNoEscuro['color-secondary-active']).toBe(canonicalOklch(tokens.colorsDark['secondary-active']));
  });

  it('nenhum grau de hoje precisou estender a precisão — e quem precisar, registra', () => {
    // D6 regra 3: quando nenhuma forma da vizinhança reconverte, a precisão do
    // token vai a L 2 / C 4 / H 2 casas e a extensão fica REGISTRADA ao lado
    // dele. Aceitar a deriva nunca é opção. O ADR afirma que nenhum dos graus
    // de hoje cai nesse caso — este teste é quem verifica a afirmação, e é o
    // que vai acusar no dia em que um grau novo de croma alto entrar.
    const estendidos: string[] = [];
    for (const [modo, escala] of [['claro', tokens.colors], ['escuro', tokens.colorsDark]] as const) {
      for (const n of BASE_TOKENS) {
        const d = canonicalOklchDetalhe((escala as Record<string, string>)[n]);
        if (d.precisao === 'estendida') estendidos.push(`${n}.${modo} = ${d.css}`);
      }
    }
    expect(estendidos).toEqual([]);
    // Quem estende, justifica; e o carimbo não sobra em quem não estende — o
    // mesmo par de guardas que a D7 usa para `porqueCoincide`.
    const nomesEstendidos = new Set(estendidos.map((e) => e.split('.')[0]));
    expect(estendidos.filter((e) => !base[e.split('.')[0]].precisaoEstendida)).toEqual([]);
    expect(BASE_TOKENS.filter((n) => base[n].precisaoEstendida && !nomesEstendidos.has(n))).toEqual([]);
  });

  it('a forma canônica de cada grau reconverte EXATO para o hex de origem', () => {
    // O round-trip que o ADR-001 exige, agora na ÚNICA camada que escreve
    // valor. `canonicalOklch` lança se a gramática não cobrir o hex; aqui a
    // asserção é a volta completa, grau a grau, nos dois modos.
    const erros: string[] = [];
    for (const [modo, escala] of [['claro', tokens.colors], ['escuro', tokens.colorsDark]] as const) {
      for (const n of BASE_TOKENS) {
        const hex = (escala as Record<string, string>)[n].toLowerCase();
        const css = canonicalOklch(hex);
        const volta = oklchToHex(parseOklch(css)!);
        if (volta !== hex) erros.push(`${n}.${modo}: ${hex} → ${css} → ${volta}`);
      }
    }
    expect(erros).toEqual([]);
  });

  it('o @theme envia a base inteira, em oklch() derivado do hex — sem inventar valor', () => {
    expect(Object.keys(baseNoClaro).sort()).toEqual(BASE_TOKENS.map((n) => `color-${n}`).sort());
    for (const n of BASE_TOKENS) {
      expect(`${n} = ${baseNoClaro[`color-${n}`]}`).toBe(`${n} = ${canonicalOklch(tokens.colors[n])}`);
    }
  });

  it('o .dark redeclara exatamente os graus cujo valor escuro DIFERE — nenhum a mais', () => {
    // Redeclarar um grau com o mesmo valor é a segunda cópia que a D1.1 proíbe,
    // com o agravante de parecer decisão de modo. Faltar um é a regressão que a
    // ordem de rollout da JET-101 descreve.
    const deModo = BASE_TOKENS.filter(
      (n) => tokens.colors[n].toLowerCase() !== tokens.colorsDark[n].toLowerCase(),
    );
    expect(Object.keys(baseNoEscuro).sort()).toEqual(deModo.map((n) => `color-${n}`).sort());
    for (const n of deModo) {
      expect(`${n} = ${baseNoEscuro[`color-${n}`]}`).toBe(`${n} = ${canonicalOklch(tokens.colorsDark[n])}`);
    }
  });
});

// ---------------------------------------------------------------------------
// JET-106 / ADR-001 — camada semântica: formato canônico e entrega
// ---------------------------------------------------------------------------

describe('camada semântica: formato canônico (ADR-001 D1)', () => {
  it('os 18 tokens do shadcn, os 2 que a D5 separou de --primary, e o derivado da D3', () => {
    const OS_18_DO_SHADCN = [
      'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
      'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'muted',
      'muted-foreground', 'accent', 'accent-foreground', 'destructive', 'border', 'input', 'ring',
    ];
    // O conjunto exato que estava em lacunasAbertas precisa ter saído inteiro.
    expect(OS_18_DO_SHADCN.filter((t) => !SEMANTIC_TOKENS.includes(t))).toEqual([]);
    // D5: a camada vai a 20 — `--primary` acumulava três papéis, e os dois que
    // não são preenchimento ganharam token próprio. Mais `secondary-active-bg`,
    // que entra por D3 como derivado.
    expect(SEMANTIC_TOKENS.filter((t) => !OS_18_DO_SHADCN.includes(t))).toEqual([
      'primary-hover',
      'primary-text',
      'secondary-active-bg',
    ]);
    expect(SEMANTIC_TOKENS.filter((t) => t !== 'secondary-active-bg')).toHaveLength(20);
    expect(SEMANTIC_TOKENS).toEqual(manifest.cssContract.camadaSemantica.tokens);
  });

  it('todo token semântico tem par :root/.dark COMPLETO — par incompleto reprova', () => {
    // Um token só no claro vira `currentColor` no dark: some a cor, não o build.
    const incompletos = SEMANTIC_TOKENS.filter(
      (t) => !semantic[t].claro?.trim() || !semantic[t].escuro?.trim(),
    );
    expect(incompletos).toEqual([]);
  });

  it('NENHUM valor literal de cor do lado direito — só var() ou color-mix (D1.1)', () => {
    // O guard que impede a JET-78 de renascer. Escrever `oklch(58.6% 0.253 294)`
    // aqui é o valor da marca escrito uma SEGUNDA vez, ao lado do --color-roxo
    // que já o tem: as duas cópias divergem no primeiro ajuste de marca e
    // ninguém descobre até a tela sair errada. É checagem estática, sem render.
    // `color-mix(in oklch, …)` continua permitido: `oklch` ali é o espaço de
    // interpolação e a porcentagem é a DERIVAÇÃO, não uma cópia da cor.
    const LITERAL = /(?:oklch|hsla?|rgba?|lab|lch|hwb|color)\(|#[0-9a-fA-F]{3,8}\b/;
    const ofensores = SEMANTIC_TOKENS.flatMap((t) =>
      (['claro', 'escuro'] as const)
        .filter((modo) => LITERAL.test(semantic[t][modo]))
        .map((modo) => `${t}.${modo} = ${semantic[t][modo]}`),
    );
    expect(ofensores).toEqual([]);
  });

  it('e a forma positiva: referência a um grau que EXISTE na base', () => {
    // O guard de literal sozinho aceitaria `var(--nao-existe)` e qualquer outra
    // coisa que não pareça cor. A regra da D1.1 é mais estreita: ou o token é
    // `var(--color-<grau>)` de um grau declarado, ou é derivado.
    const erros: string[] = [];
    for (const t of SEMANTIC_TOKENS) {
      if (semantic[t].derivado) continue;
      for (const [modo, grauKey] of [['claro', 'grauClaro'], ['escuro', 'grauEscuro']] as const) {
        const ref = parseBaseRef(semantic[t][modo]);
        if (ref === null) erros.push(`${t}.${modo} não é var(--color-*): ${semantic[t][modo]}`);
        else if (!BASE_TOKENS.includes(ref)) erros.push(`${t}.${modo} referencia grau inexistente: ${ref}`);
        else if (ref !== semantic[t][grauKey]) erros.push(`${t}.${modo} referencia ${ref}, mas declara grau ${semantic[t][grauKey]}`);
      }
    }
    expect(erros).toEqual([]);
  });

  it('token INVARIANTE de modo só referencia base ESTÁTICA (guard de modo, D5)', () => {
    // A armadilha que a D1.1 abria: `--primary-foreground: var(--color-branco)`
    // é o que a regra "referencie a base" sugere, e no escuro dá rótulo #161625
    // sobre o roxo = 3.78:1 — reprova. O fill é o mesmo nos dois modos, então o
    // rótulo precisa de base que também seja.
    const erros: string[] = [];
    for (const t of SEMANTIC_TOKENS.filter((k) => semantic[k].invarianteDeModo)) {
      if (semantic[t].claro !== semantic[t].escuro) {
        erros.push(`${t} se diz invariante mas troca de referência entre os modos`);
        continue;
      }
      const ref = parseBaseRef(semantic[t].claro);
      if (!ref || !base[ref]?.estatico) erros.push(`${t} é invariante de modo mas referencia base DE MODO (${ref})`);
    }
    expect(erros).toEqual([]);
  });

  it('e o contrário: token silenciosamente invariante precisa se declarar', () => {
    // Sem este lado, bastava não marcar `invarianteDeModo` para escapar do guard
    // acima — e a marcação passaria a ser opcional, que é o mesmo que não haver
    // guard. Um token que referencia o MESMO grau ESTÁTICO nos dois modos é
    // invariante de fato; ou se declara, ou muda de grau.
    const naoDeclarados = SEMANTIC_TOKENS.filter((t) => {
      if (semantic[t].invarianteDeModo || semantic[t].derivado) return false;
      const ref = parseBaseRef(semantic[t].claro);
      return ref !== null && semantic[t].claro === semantic[t].escuro && base[ref]?.estatico === true;
    });
    expect(naoDeclarados).toEqual([]);
  });

  it('nenhum token do contrato em tripla HSL crua', () => {
    // `262 100% 64%` — o formato que só é cor dentro de um hsl() que alguém
    // lembrou de escrever. É o que o D1 proíbe, e o modo de falha é silencioso.
    // Sobrevive à D1.1 porque a base é hex e o guard vale para as duas camadas.
    const TRIPLA_CRUA = /^\s*-?[\d.]+\s+[\d.]+%\s+[\d.]+%\s*$/;
    const ofensores = [
      ...SEMANTIC_TOKENS.flatMap((t) =>
        (['claro', 'escuro'] as const)
          .filter((modo) => TRIPLA_CRUA.test(semantic[t][modo]))
          .map((modo) => `${t}.${modo} = ${semantic[t][modo]}`),
      ),
      ...Object.entries({ ...baseNoClaro, ...baseNoEscuro })
        .filter(([, v]) => TRIPLA_CRUA.test(v))
        .map(([k, v]) => `${k} = ${v}`),
    ];
    expect(ofensores).toEqual([]);
  });

  it('todo valor emitido é oklch() canônico: L 1 casa, C 3 casas ou 0, H 1 casa', () => {
    // Vale para a camada BASE, que é onde os valores passaram a morar.
    const foraDaGramatica = Object.entries({ ...baseNoClaro, ...baseNoEscuro })
      .filter(([, v]) => !OKLCH_CANONICO.test(v))
      .map(([k, v]) => `${k} = ${v}`);
    expect(foraDaGramatica).toEqual([]);
  });

  it('token derivado é color-mix(in oklch, …) sobre var() e declara o porquê', () => {
    for (const t of SEMANTIC_TOKENS.filter((k) => semantic[k].derivado)) {
      for (const modo of ['claro', 'escuro'] as const) {
        expect(semantic[t][modo]).toMatch(/^color-mix\(in oklch, var\(--[a-z0-9-]+\) \d{1,3}%, /);
      }
      expect(semantic[t].porque).toEqual(expect.any(String));
    }
  });

  it('cinza é C 0 e H 0 — chroma zero não carrega matiz', () => {
    for (const [chave, valor] of Object.entries({ ...baseNoClaro, ...baseNoEscuro })) {
      const cor = parseOklch(valor)!;
      if (cor.c === 0) expect(`${chave}=${cor.h}`).toBe(`${chave}=0`);
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

  it('e o contrato registra as duas proibições por escrito, não só no teste', () => {
    const { proibido } = manifest.cssContract.camadaSemantica.formato;
    expect(proibido.join(' ')).toContain('hsl(var(--x))');
    expect(proibido.join(' ')).toMatch(/literal/i);
  });
});

describe('camada semântica: round-trip contra a escala JETOOH (prova exigida pelo ADR-001)', () => {
  // Âncora INDEPENDENTE: as 4 conversões que o ADR-001 publica como medidas.
  // Sem isto, um erro na aritmética do oklch.ts passaria despercebido, porque o
  // mesmo código gera e confere os valores do tokens.json.
  // Valores da tabela REGENERADA na rev. 5 (D6). A rev. 4 publicava `H` inteiro
  // por convenção — `301`, `284`, `264` — e a D6 tirou essa convenção: `H`
  // inteiro só é correto quando o gerador o emite, e aqui ele emite só no
  // `roxo`. Nenhuma COR muda entre as duas colunas: os quatro já reconvertiam
  // certo e só ganharam a casa decimal que a gramática sempre permitiu.
  const MEDIDAS_DO_ADR = [
    { hex: '#8b47ff', oklch: 'oklch(58.6% 0.253 294)', rev4: 'oklch(58.6% 0.253 294)', o_que: 'roxo da marca' },
    { hex: '#f3edff', oklch: 'oklch(95.6% 0.025 301.1)', rev4: 'oklch(95.6% 0.025 301)', o_que: '--base-roxo-light claro' },
    { hex: '#161625', oklch: 'oklch(20.8% 0.030 283.5)', rev4: 'oklch(20.8% 0.030 284)', o_que: 'fundo escuro' },
    { hex: '#6b7280', oklch: 'oklch(55.1% 0.023 264.4)', rev4: 'oklch(55.1% 0.023 264)', o_que: 'gray-500' },
  ] as const;

  it.each(MEDIDAS_DO_ADR)('$o_que: $hex ↔ $oklch (valor medido no ADR-001)', ({ hex, oklch }) => {
    expect(oklchToHex(parseOklch(oklch)!)).toBe(hex);
    const medido = hexToOklch(hex);
    const esperado = parseOklch(oklch)!;
    expect(Number(medido.l.toFixed(1))).toBe(esperado.l);
    expect(Number(medido.c.toFixed(3))).toBe(esperado.c);
    expect(Math.abs(medido.h - esperado.h)).toBeLessThanOrEqual(0.5);
  });

  it.each(MEDIDAS_DO_ADR)('$o_que: o gerador reproduz a tabela da rev. 5 — $oklch', ({ hex, oklch }) => {
    // A âncora continua INDEPENDENTE: a coluna vem da tabela publicada no
    // ADR-001, medida pela @Aria por fora deste código. Esta asserção é a que
    // prova que o gerador da D6 e o documento dizem a mesma coisa — sem ela, o
    // ADR e o pacote podem divergir em silêncio, que é como a rev. 4 chegou a
    // publicar `oklch(65.3% 0.197 297)` para um hex que ele não reconverte.
    expect(canonicalOklch(hex)).toBe(oklch);
  });

  it('a rev. 4 mudou a STRING de três âncoras e nenhuma COR', () => {
    // O que a D6 promete ("nenhuma cor muda") verificado onde importa: as duas
    // formas resolvem o mesmo hex, então quem já tinha a string antiga no CSS
    // não vê pixel diferente — só deixa de ser canônico.
    for (const { hex, rev4 } of MEDIDAS_DO_ADR) {
      expect(`${hex}: ${oklchToHex(parseOklch(rev4)!)}`).toBe(`${hex}: ${hex}`);
    }
  });

  it('a forma canônica é a que reconverte exato, não a de arredondamento ingênuo', () => {
    // `#34d399` é o caso vivo do tema: arredondar dá oklch(77.3% 0.153 163.2),
    // que reconverte para #35d399 — 1/255 no canal R. Sob D1.1 a base é a única
    // cópia do valor, então essa deriva reescreveria a cor de todo mundo que
    // referencia o grau, sem nada acusar.
    expect(oklchToHex(hexToOklch('#34d399'))).toBe('#34d399');
    expect(canonicalOklch('#34d399')).toBe('oklch(77.3% 0.154 163.1)');
    expect(oklchToHex(parseOklch('oklch(77.3% 0.153 163.2)')!)).toBe('#35d399');
  });

  it('D6 regra 1: cinza sai `C 0 H 0` — o gerador não elege matiz para acromático', () => {
    // Honestidade sobre o que este teste prova: medi a cláusula de precedência
    // contra a variante sem ela em 2.688 hex e as duas concordam em TODOS —
    // para um cinza os candidatos cromáticos ficam sempre mais longe em OKLab,
    // então a forma acromática já venceria por distância. A precedência existe
    // para o resultado não DEPENDER disso: sem ela, "cinza não carrega matiz"
    // seria uma coincidência aritmética que um ajuste de métrica desfaz em
    // silêncio, e o `H` de um cinza viraria ruído estável no diff.
    for (const cinza of ['#ffffff', '#000000', '#1c1c1c', '#808080']) {
      expect(`${cinza} → ${canonicalOklch(cinza)}`).toMatch(/→ oklch\([\d.]+% 0 0\)$/);
      expect(oklchToHex(parseOklch(canonicalOklch(cinza))!)).toBe(cinza);
    }
  });

  it('D6 regra 3: o que a gramática não representa ESTENDE a precisão, nunca deriva', () => {
    // `#0b0dee` é croma alto perto da borda do gamut, onde o passo de 0.001 em
    // `C` é grosso demais: nenhuma das formas de L 1 / C 3 / H 1 na vizinhança
    // reconverte. A regra 3 manda estender AQUELE token para L 2 / C 4 / H 2 —
    // e o resultado tem de reconverter exato, senão a regra não serviu para
    // nada. Este é o caminho que o gerador anterior fechava com um `throw`.
    const d = canonicalOklchDetalhe('#0b0dee');
    expect(d.precisao).toBe('estendida');
    expect(oklchToHex(parseOklch(d.css)!)).toBe('#0b0dee');
    // E a forma estendida NÃO passa pela gramática do contrato: é justamente
    // por isso que a extensão precisa ficar registrada em vez de silenciosa.
    expect(OKLCH_CANONICO.test(d.css)).toBe(false);
  });

  it('D6 regra 2: a janela de ±4 passos é a regra, e ela às vezes custa precisão', () => {
    // Registro de uma consequência MEDIDA da janela normativa, não de um
    // defeito: em `#167577` a forma exata mais próxima está a 5 passos de `H`
    // do arredondamento direto, então a janela de ±4 não a alcança e o gerador
    // fica com uma forma 57% mais distante em OKLab. As duas reconvertem para
    // o mesmo hex — o custo é de canonicidade, não de cor, e nenhum dos graus
    // de hoje cai no caso. Se a janela mudar num rev. futuro, este teste é
    // quem avisa que o valor esperado mudou junto.
    expect(canonicalOklch('#167577')).toBe('oklch(51.4% 0.082 197.1)');
    expect(oklchToHex(parseOklch('oklch(51.4% 0.082 197.1)')!)).toBe('#167577');
    expect(oklchToHex(parseOklch('oklch(51.3% 0.082 196.6)')!)).toBe('#167577');
  });

  it('token com grau expõe o grau da base — a semântica não é uma segunda paleta', () => {
    // Continua sendo o que impede a camada semântica e a escala JETOOH de
    // voltarem a ser duas paletas diferentes. Sob D1.1 a prova ficou mais forte
    // e mais barata: o token REFERENCIA o grau, então basta o grau existir.
    const erros: string[] = [];
    for (const t of SEMANTIC_TOKENS) {
      for (const [modo, grauKey, escala] of [
        ['claro', 'grauClaro', tokens.colors],
        ['escuro', 'grauEscuro', tokens.colorsDark],
      ] as const) {
        const grau = semantic[t][grauKey];
        if (!grau) continue;
        if (!(grau in escala)) erros.push(`${t}.${modo}: grau ${grau} não existe na escala`);
        if (parseBaseRef(semantic[t][modo]) !== grau) erros.push(`${t}.${modo} não referencia o grau ${grau}`);
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
  it(':root envia exatamente os tokens da camada semântica', () => {
    expect(Object.keys(semNoClaro).sort()).toEqual([...SEMANTIC_TOKENS].sort());
  });

  it('.dark envia o mesmo conjunto — par incompleto no CSS reprova igual', () => {
    // Vale mesmo quando a declaração é compartilhada em `:root, .dark`: o que se
    // cobra é o valor EFETIVO por modo, não em quantos blocos ele foi escrito.
    expect(Object.keys(semNoEscuro).sort()).toEqual([...SEMANTIC_TOKENS].sort());
  });

  it('@theme inline mapeia --color-<token> para cada um (senão a utility não existe)', () => {
    // No Tailwind v4 `bg-primary` só nasce se `--color-primary` estiver no tema.
    // Declarar `--primary` no :root sem este bloco entrega a variável e nenhuma
    // classe — exatamente a falha silenciosa que a JET-77 descreve.
    expect(Object.keys(themeInline).sort()).toEqual(SEMANTIC_TOKENS.map((t) => `color-${t}`).sort());
    for (const t of SEMANTIC_TOKENS) expect(themeInline[`color-${t}`]).toBe(`var(--${t})`);
  });

  it('o theme.css não inventa valor: bate com o tokens.json nos dois modos', () => {
    for (const t of SEMANTIC_TOKENS) {
      expect(`${t} claro = ${semNoClaro[t]}`).toBe(`${t} claro = ${semantic[t].claro}`);
      expect(`${t} escuro = ${semNoEscuro[t]}`).toBe(`${t} escuro = ${semantic[t].escuro}`);
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
    // Sob D1.1 o token não carrega mais o valor, então a asserção segue a
    // referência até a base — que é onde o roxo mora — em vez de comparar com
    // uma cópia do literal escrita aqui dentro. Comparar com o literal seria
    // fazer no teste exatamente o que a D1.1 proíbe no CSS.
    expect(semantic.primary.claro).toBe('var(--color-roxo)');
    expect(semantic.primary.escuro).toBe('var(--color-roxo)');
    expect(tokens.colors.roxo).toBe('#8B47FF');
    expect(tokens.colorsDark.roxo).toBe('#8B47FF');
    expect(canonicalOklch(tokens.colors.roxo)).toBe('oklch(58.6% 0.253 294)');
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
