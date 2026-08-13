// Guard-rail de contraste (JET-99). O pacote é fonte única: um controle de
// formulário com texto abaixo do mínimo WCAG aqui reprova em TODAS as apps que
// consomem o componente (platform, admin, devices).
//
// O teste faz duas coisas:
//   1. calcula o contraste dos tokens do tema a partir do próprio tokens.json
//      (fonte única), em claro E escuro — se alguém escurecer/clarear um token,
//      o teste cai junto;
//   2. proíbe `gray-400` como cor de TEXTO/ícone nos controles de formulário —
//      gray-400 é o default do Tailwind (#99a1af), não é token JETOOH, fica de
//      fora do token-drift e mede 2.60:1.
//
// Fora de escopo (medido e documentado na JET-99): a borda `gray-200` dos
// controles (1.26:1, mínimo 3:1 de WCAG 1.4.11). Corrigi-la exige token novo no
// contrato do tema + rollout coordenado no index.css das apps; trocar a classe
// aqui sem isso deixaria o campo SEM borda.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import tokens from '../themes/dashboard-2026/tokens.json';
import { Input } from './Input';
import { DateTimeField } from './DateTimeField';

/** Luminância relativa WCAG 2.x de um hex `#RRGGBB`. */
function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const channel = (i: number) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

/** Razão de contraste WCAG entre duas cores hex. */
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const TEXT_MIN = 4.5; // WCAG 1.4.3, texto normal
const GRAY_400 = '#99a1af'; // default do Tailwind v4 — NÃO é token JETOOH

// Controles de formulário: onde placeholder/hint/ícone-de-campo são texto para
// o usuário. SectionCard fica de fora de propósito (ícone decorativo ao lado de
// um título que já tem contraste — trade-off visual próprio, ver JET-99).
const FORM_CONTROLS = [
  'Input.tsx',
  'Select.tsx',
  'NativeSelect.tsx',
  'DateTimeField.tsx',
  'DateRangePicker.tsx',
] as const;

// `import.meta.url` no ambiente jsdom vira URL http, não file — lê pela raiz do
// projeto (cwd do vitest), que é estável em CI e local.
const source = (file: string) =>
  readFileSync(resolve(process.cwd(), 'src/components', file), 'utf8');

describe('contraste dos tokens do tema (tokens.json = fonte única)', () => {
  it('gray-500 serve como cor de texto auxiliar no claro e no escuro', () => {
    expect(contrast(tokens.colors['gray-500'], tokens.colors.branco)).toBeGreaterThanOrEqual(TEXT_MIN);
    expect(contrast(tokens.colorsDark['gray-500'], tokens.colorsDark.branco)).toBeGreaterThanOrEqual(TEXT_MIN);
  });

  it('gray-400 do Tailwind reprova como texto — por isso é proibido nos controles', () => {
    expect(contrast(GRAY_400, tokens.colors.branco)).toBeLessThan(TEXT_MIN);
    expect(tokens.colors).not.toHaveProperty('gray-400');
  });

  it('gray-300 não é alternativa: continua abaixo do mínimo de texto', () => {
    expect(contrast(tokens.colors['gray-300'], tokens.colors.branco)).toBeLessThan(TEXT_MIN);
  });
});

describe('controles de formulário não usam gray-400 em texto/ícone', () => {
  it.each(FORM_CONTROLS)('%s', (file) => {
    const code = source(file);
    // `bg-gray-400` (preenchimento) não é texto e não entra na regra.
    const offenders = code.match(/(?:placeholder:)?text-gray-400/g) ?? [];
    expect(offenders).toEqual([]);
  });
});

describe('render: placeholder e hint saem em gray-500', () => {
  it('Input aplica placeholder:text-gray-500', () => {
    render(<Input placeholder="seu@email.com" />);
    const input = screen.getByPlaceholderText('seu@email.com');
    expect(input.className).toContain('placeholder:text-gray-500');
    expect(input.className).not.toContain('placeholder:text-gray-400');
  });

  it('DateTimeField aplica text-gray-500 no hint', () => {
    render(<DateTimeField id="quando" label="Quando" value={null} onChange={() => {}} hint="Fuso local" />);
    expect(screen.getByText('Fuso local').className).toContain('text-gray-500');
  });
});
