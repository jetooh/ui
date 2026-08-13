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

/** Parseia uma declaração canônica. Devolve `null` se a string não for canônica. */
export function parseOklch(value: string): Oklch | null {
  const m = OKLCH_CANONICO.exec(value);
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

/** `21` e não `21.0`; `163.1` continua `163.1`. */
const num = (n: number) => String(Number(n.toFixed(1)));

/** Formata um triplo já arredondado na gramática canônica do ADR-001. */
const formatOklch = (l: number, c: number, h: number) =>
  c === 0 ? `oklch(${num(l)}% 0 0)` : `oklch(${num(l)}% ${c.toFixed(3)} ${num(h)})`;

/**
 * Forma canônica de um hex da camada base — a de MENOR precisão que reconverte
 * EXATO para o mesmo hex.
 *
 * Por que não é só arredondar: a gramática do ADR-001 corta em 1 casa de `L`, 3
 * de `C` e 1 de `H`, e para alguns hex o arredondamento ingênuo cai fora do
 * cubo sRGB de origem. `#34d399` é o caso vivo no tema: arredondar dá
 * `oklch(77.3% 0.153 163.2)`, que reconverte para `#35d399` — 1/255 de deriva
 * no canal R. Imperceptível, e é exatamente por isso que é perigoso: sob D1.1 a
 * base é a ÚNICA cópia do valor, então uma deriva silenciosa aqui reescreve a
 * cor de todo mundo que referencia o grau, sem nada acusar.
 *
 * Então a busca varre a vizinhança do valor exato dentro da gramática, mantém
 * só os candidatos que reconvertem exato e escolhe o perceptualmente mais
 * próximo do valor real (distância euclidiana em OKLab, com desempate
 * lexicográfico para o resultado não depender da ordem da varredura).
 *
 * Lança se nenhum candidato reconverte exato — silêncio aqui seria a deriva.
 */
export function canonicalOklch(hex: string): string {
  const alvo = hex.toLowerCase();
  const exato = hexToOklch(hex);
  const rad = (exato.h * Math.PI) / 180;
  const [aAlvo, bAlvo] = [exato.c * Math.cos(rad), exato.c * Math.sin(rad)];

  const candidatos: Array<{ css: string; dist: number }> = [];
  for (let dl = -3; dl <= 3; dl++) {
    const l = Number((Math.round(exato.l * 10) / 10 + dl / 10).toFixed(1));
    if (l < 0 || l > 100) continue;
    // Cinza: `C 0` e `H 0` (D1). Entra como candidato próprio, sem varrer H.
    if (Math.abs(exato.c) < 0.0015) {
      const css = formatOklch(l, 0, 0);
      if (oklchToHex(parseOklch(css)!) === alvo) {
        candidatos.push({ css, dist: Math.hypot((l - exato.l) / 100, aAlvo, bAlvo) });
      }
    }
    for (let dc = -3; dc <= 3; dc++) {
      const c = Number((Math.round(exato.c * 1000) / 1000 + dc / 1000).toFixed(3));
      if (c <= 0) continue;
      for (let dh = -5; dh <= 5; dh++) {
        const h = Number(((Math.round(exato.h * 10) / 10 + dh / 10 + 360) % 360).toFixed(1));
        const css = formatOklch(l, c, h);
        if (oklchToHex(parseOklch(css)!) !== alvo) continue;
        const r = (h * Math.PI) / 180;
        candidatos.push({
          css,
          dist: Math.hypot((l - exato.l) / 100, c * Math.cos(r) - aAlvo, c * Math.sin(r) - bAlvo),
        });
      }
    }
  }
  if (candidatos.length === 0) {
    throw new Error(`nenhuma forma canônica de ${hex} reconverte exato — a gramática do ADR-001 não cobre este hex`);
  }
  candidatos.sort((x, y) => x.dist - y.dist || x.css.localeCompare(y.css));
  return candidatos[0].css;
}
