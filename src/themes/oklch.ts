// Conversão sRGB ↔ OKLCH — a aritmética que sustenta o formato canônico do
// ADR-001 (JET-106).
//
// Por que isto existe como módulo e não como helper de teste: o contrato agora
// declara a camada semântica em `oklch()` e a escala JETOOH em hex. Sem uma
// conversão exata e compartilhada, "o token semântico expõe o grau X" seria
// documentação — e documentação não reprova build. Com ela, o contract.test.ts
// prova round-trip token a token (o que o ADR exige antes de qualquer flip) e o
// contrast.test.tsx consegue medir WCAG sobre valores oklch.
//
// Não é exportado no index.ts: é ferramenta de contrato, não API de componente.
//
// Matrizes de Björn Ottosson (oklab, 2020). Verificadas contra as 4 conversões
// medidas que o ADR-001 publica — o contract.test.ts trava exatamente essas 4
// como âncora independente, para um erro aqui não passar despercebido por o
// mesmo código gerar e conferir os valores.

const M1 = [
  [0.4122214708, 0.5363325363, 0.0514459929],
  [0.2119034982, 0.6806995451, 0.1073969566],
  [0.0883024619, 0.2817188376, 0.6299787005],
] as const;

const M2 = [
  [0.2104542553, 0.793617785, -0.0040720468],
  [1.9779984951, -2.428592205, 0.4505937099],
  [0.0259040371, 0.7827717662, -0.808675766],
] as const;

const srgbToLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linearToSrgb = (c: number) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);
const cbrt = (x: number) => Math.cbrt(x);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export type Oklch = { l: number; c: number; h: number };

/** `#RRGGBB` → canais sRGB em 0..1. */
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
}

const rgbToHex = (rgb: number[]) =>
  `#${rgb.map((c) => Math.round(clamp01(c) * 255).toString(16).padStart(2, '0')).join('')}`;

/** `#RRGGBB` → OKLCH com `l` em PORCENTAGEM (0..100), como o token declara. */
export function hexToOklch(hex: string): Oklch {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear);
  const [l, m, s] = M1.map((row) => row[0] * r + row[1] * g + row[2] * b).map(cbrt);
  const [L, A, B] = M2.map((row) => row[0] * l + row[1] * m + row[2] * s);
  return {
    l: L * 100,
    c: Math.hypot(A, B),
    h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360,
  };
}

/** OKLCH (`l` em porcentagem) → `#RRGGBB`, com gamut clampado em sRGB. */
export function oklchToHex({ l, c, h }: Oklch): string {
  const rad = (h * Math.PI) / 180;
  const A = c * Math.cos(rad);
  const B = c * Math.sin(rad);
  const L = l / 100;
  const lms = [
    L + 0.3963377774 * A + 0.2158037573 * B,
    L - 0.1055613458 * A - 0.0638541728 * B,
    L - 0.0894841775 * A - 1.291485548 * B,
  ].map((x) => x ** 3);
  const linear = [
    4.0767416621 * lms[0] - 3.3077115913 * lms[1] + 0.2309699292 * lms[2],
    -1.2684380046 * lms[0] + 2.6097574011 * lms[1] - 0.3413193965 * lms[2],
    -0.0041960863 * lms[0] - 0.7034186147 * lms[1] + 1.707614701 * lms[2],
  ];
  return rgbToHex(linear.map(linearToSrgb));
}

/**
 * Gramática canônica do ADR-001: `oklch(L% C H)`, com alpha opcional (`/ 15%`)
 * só quando a SEMÂNTICA do token é translúcida. `L` com até 1 casa, `C` com 3
 * casas ou o literal `0`, `H` com até 1 casa (e `0` quando `C` é `0`).
 */
export const OKLCH_CANONICO =
  /^oklch\((\d{1,3}(?:\.\d)?)% (0|\d\.\d{3}) (\d{1,3}(?:\.\d)?)(?: \/ \d{1,3}%)?\)$/;

/**
 * Precisão ESTENDIDA (D6, regra 3): `L` 2 casas / `C` 4 casas / `H` 2 casas.
 * Só é legítima quando o gerador declara que a estendeu — a gramática do
 * contrato continua sendo `OKLCH_CANONICO`, e é a asserção de canonicidade
 * (`forma == gerador(hex)`) que impede a precisão extra de virar folga geral.
 * Existe aqui para `parseOklch` conseguir ler um token estendido de volta: sem
 * isso o round-trip do próprio token que precisou da extensão não fecharia.
 */
export const OKLCH_ESTENDIDO =
  /^oklch\((\d{1,3}(?:\.\d{1,2})?)% (0|\d\.\d{4}) (\d{1,3}(?:\.\d{1,2})?)(?: \/ \d{1,3}%)?\)$/;

/**
 * Parseia uma declaração canônica — ou estendida (D6 regra 3). Devolve `null`
 * se a string não estiver em nenhuma das duas gramáticas.
 */
export function parseOklch(value: string): Oklch | null {
  const m = OKLCH_CANONICO.exec(value) ?? OKLCH_ESTENDIDO.exec(value);
  if (!m) return null;
  return { l: Number(m[1]), c: Number(m[2]), h: Number(m[3]) };
}

/** Referência à camada base: `var(--color-<grau>)`. Ver `parseBaseRef`. */
export const BASE_REF = /^var\(--color-([a-z0-9-]+)\)$/;

/**
 * Extrai o grau referenciado por um token semântico (ADR-001 D1.1: a camada
 * semântica REFERENCIA a base, nunca recopia o valor). `null` se não for uma
 * referência — e aí o guard de literal do contract.test.ts reprova.
 */
export function parseBaseRef(value: string): string | null {
  return BASE_REF.exec(value.trim())?.[1] ?? null;
}

/**
 * Derivação permitida pela D1.1: `color-mix(in oklch, var(--x) N%, <resto>)`,
 * onde o resto é outra `var()` ou `transparent`. É a forma do
 * `--secondary-active-bg` (D3), e o `grau`/`resto` saem como NOME de variável
 * porque quem resolve o nome é quem tem a escala na mão (o teste), não este
 * módulo.
 */
export const COLOR_MIX =
  /^color-mix\(in oklch, var\(--([a-z0-9-]+)\) (\d{1,3})%, (?:var\(--([a-z0-9-]+)\)|(transparent))\)$/;

export type ColorMix = {
  /** Nome da variável do primeiro operando, sem o `--`. */
  origem: string;
  /** Fração do primeiro operando, 0..1. */
  fracao: number;
  /** Nome da variável do segundo operando, ou `null` quando é `transparent`. */
  resto: string | null;
};

/** Parseia a derivação. `null` se a string não for um `color-mix` do contrato. */
export function parseColorMix(value: string): ColorMix | null {
  const m = COLOR_MIX.exec(value.trim());
  if (!m) return null;
  return { origem: m[1], fracao: Number(m[2]) / 100, resto: m[3] ?? null };
}

/**
 * `color-mix(in oklch, a p%, b)` resolvido em hex.
 *
 * Duas sutilezas do CSS Color 4/5 que mudam o resultado e não são opcionais:
 * a interpolação de matiz é pelo ARCO CURTO, e o matiz de uma cor acromática
 * (C≈0, como o branco do `--background` claro) é POWERLESS — quem manda é o
 * matiz do outro operando. Sem a substituição, misturar roxo com branco puxaria
 * o resultado para H=0 e a pílula clara sairia rosada.
 */
export function mixOklch(a: string, p: number, b: string): string {
  const x = hexToOklch(a);
  const y = hexToOklch(b);
  const ACROMATICO = 1e-4;
  const ha = x.c < ACROMATICO ? y.h : x.h;
  const hb = y.c < ACROMATICO ? ha : y.h;
  const arco = ((hb - ha + 540) % 360) - 180;
  return oklchToHex({
    l: x.l * p + y.l * (1 - p),
    c: x.c * p + y.c * (1 - p),
    h: (ha + arco * (1 - p) + 360) % 360,
  });
}

/**
 * `fg` com alpha sobre `bg` opaco, composto em sRGB — o que a tela faz com um
 * `color-mix(…, transparent)`.
 *
 * Existe porque um token translúcido não TEM cor até se saber o que está atrás:
 * a pílula escura do item ativo resolve #2e2452 sobre o rail e #1e1439 sobre o
 * page-bg, e medir WCAG contra o valor "do token" seria medir contra nada.
 */
export function alphaOver(fg: string, alpha: number, bg: string): string {
  const f = hexToRgb(fg);
  const b = hexToRgb(bg);
  return rgbToHex(f.map((c, i) => c * alpha + b[i] * (1 - alpha)));
}

// ---------------------------------------------------------------------------
// ADR-001 D6 — regra de conversão hex → oklch() (JET-117)
//
// O gerador mora AQUI, junto do emissor, e não dentro do contract.test.ts:
// teste que reimplementa o gerador só prova que a cópia concorda com a cópia.
// ---------------------------------------------------------------------------

/** Casas por eixo. A do contrato é a gramática de D1; a estendida é D6 regra 3. */
export type Precisao = { l: number; c: number; h: number };
export const PRECISAO_CONTRATO: Precisao = { l: 1, c: 3, h: 1 };
export const PRECISAO_ESTENDIDA: Precisao = { l: 2, c: 4, h: 2 };

/** Passos varridos por eixo em torno do arredondamento direto (D6 regra 2). */
const VIZINHANCA = 4;

/** `21` e não `21.0`; `163.1` continua `163.1`. */
const num = (n: number, casas: number) => String(Number(n.toFixed(casas)));

/** Arredonda para a grade da precisão — a "grade" que a gramática admite. */
const naGrade = (n: number, casas: number) => Number(n.toFixed(casas));

/** Formata um triplo já arredondado na gramática da precisão dada. */
const formatOklch = (l: number, c: number, h: number, p: Precisao) =>
  c === 0
    ? `oklch(${num(l, p.l)}% 0 0)`
    : `oklch(${num(l, p.l)}% ${c.toFixed(p.c)} ${num(h, p.h)})`;

/** Distância euclidiana em OKLab. `L` entra na escala 0..1, como `a` e `b`. */
const distOklab = (l: number, c: number, h: number, lAlvo: number, aAlvo: number, bAlvo: number) => {
  const r = (h * Math.PI) / 180;
  return Math.hypot((l - lAlvo) / 100, c * Math.cos(r) - aAlvo, c * Math.sin(r) - bAlvo);
};

/**
 * A busca de D6 regra 2 numa precisão. `null` quando nenhuma forma da
 * vizinhança reconverte — é o gatilho da regra 3, não um erro.
 */
function buscarNaPrecisao(alvo: string, exato: Oklch, p: Precisao): string | null {
  const rad = (exato.h * Math.PI) / 180;
  const [aAlvo, bAlvo] = [exato.c * Math.cos(rad), exato.c * Math.sin(rad)];
  const passo = (casas: number) => 10 ** -casas;

  // D6 regra 1 — ACROMÁTICO TEM PRECEDÊNCIA. Quando `C` arredondado é 0 o
  // matiz não existe: varrer `H` faria o gerador eleger um matiz arbitrário
  // para um cinza, e esse matiz vira ruído estável no diff. Só `L` é buscado.
  const acromatico = naGrade(exato.c, p.c) === 0;

  const candidatos: Array<{ css: string; dist: number; l: number; c: number; h: number }> = [];
  for (let dl = -VIZINHANCA; dl <= VIZINHANCA; dl++) {
    const l = naGrade(naGrade(exato.l, p.l) + dl * passo(p.l), p.l);
    if (l < 0 || l > 100) continue;

    if (acromatico) {
      const css = formatOklch(l, 0, 0, p);
      if (oklchToHex(parseOklch(css)!) === alvo) {
        candidatos.push({ css, dist: distOklab(l, 0, 0, exato.l, aAlvo, bAlvo), l, c: 0, h: 0 });
      }
      continue;
    }

    for (let dc = -VIZINHANCA; dc <= VIZINHANCA; dc++) {
      const c = naGrade(naGrade(exato.c, p.c) + dc * passo(p.c), p.c);
      if (c <= 0) continue;
      for (let dh = -VIZINHANCA; dh <= VIZINHANCA; dh++) {
        const h = naGrade((naGrade(exato.h, p.h) + dh * passo(p.h) + 360) % 360, p.h);
        const css = formatOklch(l, c, h, p);
        if (oklchToHex(parseOklch(css)!) !== alvo) continue;
        candidatos.push({ css, dist: distOklab(l, c, h, exato.l, aAlvo, bAlvo), l, c, h });
      }
    }
  }
  if (candidatos.length === 0) return null;

  // Menor distância; desempate DETERMINÍSTICO e numérico (D6): menor `L`,
  // depois menor `C`, depois menor `H`. Ordenar pela string em vez dos números
  // faria `10.1%` vir antes de `9.5%` — ordem lexicográfica não é ordem de cor.
  // Medido: em 2.688 hex nenhum empate de distância chega a acontecer, então
  // hoje o critério nunca desempata nada. É por isso mesmo que ele precisa
  // estar escrito — o dia em que empatar não vai avisar.
  candidatos.sort((x, y) => x.dist - y.dist || x.l - y.l || x.c - y.c || x.h - y.h);
  return candidatos[0].css;
}

/**
 * Forma canônica de um hex da camada base, com a precisão que ela exigiu.
 *
 * Por que não é só arredondar: a gramática do ADR-001 corta em 1 casa de `L`, 3
 * de `C` e 1 de `H`, e para alguns hex o arredondamento ingênuo cai fora do
 * cubo sRGB de origem. `#34d399` é o caso vivo no tema: arredondar dá
 * `oklch(77.3% 0.153 163.2)`, que reconverte para `#35d399` — 1/255 de deriva
 * no canal R. Imperceptível, e é exatamente por isso que é perigoso: sob D1.1 a
 * base é a ÚNICA cópia do valor, então uma deriva silenciosa aqui reescreve a
 * cor de todo mundo que referencia o grau, sem nada acusar.
 *
 * Os três passos de D6, na ordem:
 *
 * 1. `C` arredondado é `0` → `oklch(L% 0 0)`, sem varrer matiz (precedência).
 * 2. Senão, entre as formas da gramática numa vizinhança de ±4 passos por eixo
 *    em torno do arredondamento direto, a canônica é a de menor distância em
 *    OKLab ao valor exato DENTRE as que reconvertem para o hex de origem.
 * 3. Se nenhuma reconverte, o valor não é representável na precisão do
 *    contrato: a precisão é estendida para `L` 2 / `C` 4 / `H` 2 casas para
 *    AQUELE token, e `precisao: 'estendida'` registra a extensão. Aceitar a
 *    deriva nunca é opção — daí o `throw` quando nem a estendida fecha.
 */
export function canonicalOklchDetalhe(hex: string): {
  css: string;
  precisao: 'contrato' | 'estendida';
} {
  const alvo = hex.toLowerCase();
  const exato = hexToOklch(hex);

  const noContrato = buscarNaPrecisao(alvo, exato, PRECISAO_CONTRATO);
  if (noContrato) return { css: noContrato, precisao: 'contrato' };

  const estendida = buscarNaPrecisao(alvo, exato, PRECISAO_ESTENDIDA);
  if (estendida) return { css: estendida, precisao: 'estendida' };

  throw new Error(
    `nenhuma forma de ${hex} reconverte exato, nem na precisão estendida (D6 regra 3) — ` +
      'a deriva não é aceitável, então o valor precisa de decisão de arquitetura',
  );
}

/** A forma canônica. Ver `canonicalOklchDetalhe` para saber se ela estendeu. */
export function canonicalOklch(hex: string): string {
  return canonicalOklchDetalhe(hex).css;
}
