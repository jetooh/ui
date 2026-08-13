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
// A borda dos controles (era `gray-200`, 1.26:1, mínimo 3:1 de WCAG 1.4.11)
// virou o token `borda-controle` na JET-101 — os testes de borda abaixo medem o
// token contra as DUAS superfícies onde um campo aparece (branco do card e
// page-bg), em claro e escuro.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import tokens from '../themes/dashboard-2026/tokens.json';
import manifest from '../themes/dashboard-2026/manifest.json';
import { Input } from './Input';
import { NativeSelect } from './NativeSelect';
import { DateTimeField } from './DateTimeField';
import { DetailHeader } from './DetailHeader';

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
const UI_MIN = 3; // WCAG 1.4.11, componentes de interface (borda que delimita)
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

// ---------------------------------------------------------------------------
// JET-101 — borda que delimita o controle (WCAG 1.4.11, mínimo 3:1)
// ---------------------------------------------------------------------------
// Um campo branco dentro de card branco só é percebido pela borda: ela é uma
// "parte visual necessária para identificar o controle" e cai na 1.4.11, não na
// 1.4.3. Mede-se contra as TRÊS superfícies em que um controle do tema pode
// aparecer: `branco` (dentro do card), `page-bg` (formulário solto na página) e
// `gray-100` (faixa de chip/ícone). `gray-100` entrou na JET-102: o par escuro
// já passava lá (3.28:1) e o claro não (2.86:1 com o #8b8b93 original) — um par
// assimétrico deixaria um controle passar no escuro e reprovar no claro, que é
// o defeito mais caro de achar. Daí o claro ter fechado em `#85858c`.
const FIELD_SURFACES = ['branco', 'page-bg', 'gray-100'] as const;

describe('borda de controle atinge 3:1 (WCAG 1.4.11)', () => {
  it.each(FIELD_SURFACES)('claro: borda-controle sobre %s', (surface) => {
    expect(contrast(tokens.colors['borda-controle'], tokens.colors[surface])).toBeGreaterThanOrEqual(UI_MIN);
  });

  it.each(FIELD_SURFACES)('escuro: borda-controle sobre %s', (surface) => {
    expect(contrast(tokens.colorsDark['borda-controle'], tokens.colorsDark[surface])).toBeGreaterThanOrEqual(UI_MIN);
  });

  it('gray-200 e gray-300 reprovam como borda de controle — por isso o token novo', () => {
    expect(contrast(tokens.colors['gray-200'], tokens.colors.branco)).toBeLessThan(UI_MIN);
    expect(contrast(tokens.colors['gray-300'], tokens.colors.branco)).toBeLessThan(UI_MIN);
    expect(contrast(tokens.colorsDark['gray-200'], tokens.colorsDark.branco)).toBeLessThan(UI_MIN);
  });

  it('o token existe nos dois modos (contrato: a app declara claro E escuro)', () => {
    expect(tokens.colors).toHaveProperty('borda-controle');
    expect(tokens.colorsDark).toHaveProperty('borda-controle');
  });

  it('o manifesto documenta o token e a ordem de rollout das apps', () => {
    const novo = manifest.cssContract.tokensNovos['borda-controle'];
    expect(novo.claro).toBe(tokens.colors['borda-controle']);
    expect(novo.escuro).toBe(tokens.colorsDark['borda-controle']);
    expect(novo.ordemDeRollout).toMatch(/index\.css/);
  });
});

describe('controles não delimitam campo branco com borda cinza-clara', () => {
  // Regra: qualquer literal de classe que pinte um campo (`bg-branco`) não pode
  // se delimitar com `border-gray-*` — é exatamente o defeito de 1.26:1 da
  // JET-101. Bordas de SUPERFÍCIE (card, Modal, divisores) seguem em gray-200 e
  // não caem aqui porque não têm bg-branco+border no mesmo controle.
  it.each(FORM_CONTROLS)('%s', (file) => {
    const literals = source(file).match(/(["'`])[^"'`]*bg-branco[^"'`]*\1/g) ?? [];
    const offenders = literals.filter((l) => /border-gray-\d/.test(l));
    expect(offenders).toEqual([]);
  });

  it('DateRangePicker: os campos de data usam border-borda-controle', () => {
    const code = source('DateRangePicker.tsx');
    const dateFields = [...code.matchAll(/type="date"[\s\S]{0,600}?className="([^"]*)"/g)].map((m) => m[1]);
    expect(dateFields).toHaveLength(2); // data inicial + data final
    for (const cls of dateFields) expect(cls).toContain('border-borda-controle');
  });

  // JET-102: o `DateRangePicker` tem DOIS grids de cartão de opção — os presets
  // e o "Comparar com" — com a mesma borda. A exceção vale para os dois; travar
  // a igualdade evita a meia-correção (escurecer um grid e esquecer o outro),
  // que deixaria o mesmo painel com duas bordas de opção diferentes.
  it('DateRangePicker: os dois grids de cartão de opção mantêm a MESMA borda (exceção JET-102)', () => {
    const code = source('DateRangePicker.tsx');
    const unselected = [...code.matchAll(/on \? "border-roxo[^"]*" : "([^"]*)"/g)].map((m) => m[1]);
    expect(unselected).toHaveLength(2); // presets + comparar com
    expect(new Set(unselected.map((c) => c.match(/border-[\w-]+/)?.[0])).size).toBe(1);
  });
});

describe('render: os campos saem com a borda do token', () => {
  it('Input aplica border-borda-controle', () => {
    render(<Input placeholder="seu@email.com" />);
    const input = screen.getByPlaceholderText('seu@email.com');
    expect(input.className).toContain('border-borda-controle');
    expect(input.className).not.toContain('border-gray-200');
  });

  // JET-102: o botão de voltar do `DetailHeader` é o único controle ícone-só
  // coberto pelo token — sem rótulo, quem delimita o alvo de 32px é a caixa.
  it('DetailHeader: o botão de voltar aplica border-borda-controle', () => {
    render(<DetailHeader title="Dispositivo 42" onBack={() => {}} />);
    const voltar = screen.getByLabelText('Voltar');
    expect(voltar.className).toContain('border-borda-controle');
    expect(voltar.className).not.toContain('border-gray-200');
  });

  it('NativeSelect aplica border-borda-controle', () => {
    render(
      <NativeSelect aria-label="uf">
        <option value="">Selecionar</option>
      </NativeSelect>,
    );
    const select = screen.getByLabelText('uf');
    expect(select.className).toContain('border-borda-controle');
    expect(select.className).not.toContain('border-gray-200');
  });
});
