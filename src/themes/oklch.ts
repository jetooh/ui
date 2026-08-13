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
