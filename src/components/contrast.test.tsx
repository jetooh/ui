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
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import tokens from '../themes/dashboard-2026/tokens.json';
import manifest from '../themes/dashboard-2026/manifest.json';
import { parseBaseRef, parseColorMix, mixOklch, alphaOver } from '../themes/oklch';
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

// ---------------------------------------------------------------------------
// JET-106 / ADR-001 D4 — gray-400 sai do pacote inteiro, sem virar token
// ---------------------------------------------------------------------------
// A saída fácil seria declarar gray-400 como "token de ícone decorativo". O ADR
// recusa: seria um nome sancionado a um passo de virar texto de novo, que é o
// modo de falha que a JET-99 já pagou. Os 2 usos restantes migraram para o token
// semântico `muted-foreground`, que expõe o MESMO grau `gray-500` que a JET-99
// mediu — e este bloco trava as duas pontas: o valor e o call site.
const semantic = tokens.semantic as unknown as Record<string, { claro: string; escuro: string }>;
/**
 * Hex efetivo de um token semântico. Sob D1.1 o token não tem valor próprio: ele
 * REFERENCIA um grau da camada base, e é lá que a cor mora — então medir WCAG
 * aqui é resolver a referência contra `colors`/`colorsDark`. Lança se a
 * referência não existir, para um token mal escrito não medir `undefined` e
 * passar por acidente.
 */
const sem = (token: string, modo: 'claro' | 'escuro') => {
  const grau = parseBaseRef(semantic[token][modo]);
  const escala = (modo === 'claro' ? tokens.colors : tokens.colorsDark) as Record<string, string>;
  if (grau === null || !(grau in escala)) {
    throw new Error(`${token}.${modo} não referencia um grau da base: ${semantic[token][modo]}`);
  }
  return escala[grau].toLowerCase();
};

describe('gray-400 saiu dos 2 usos e continua fora do contrato (D4)', () => {
  it('gray-400 não aparece em NENHUM componente do pacote', () => {
    const offenders = readdirSync(resolve(process.cwd(), 'src/components'))
      .filter((f) => /\.tsx?$/.test(f) && !f.includes('.test.'))
      .filter((f) => /(?:bg|text|border|fill|stroke)-gray-400/.test(source(f)));
    expect(offenders).toEqual([]);
  });

  it('e continua PROIBIDO como token — a migração não o reabilitou', () => {
    expect(tokens.colors).not.toHaveProperty('gray-400');
    expect(tokens.semantic).not.toHaveProperty('gray-400');
  });

  it('SectionCard: o ícone decorativo usa text-muted-foreground', () => {
    expect(source('SectionCard.tsx')).toContain('text-muted-foreground');
  });

  it('StatusBadge: o dot neutro carrega estado, então precisa de 3:1 sobre a pílula', () => {
    // WCAG 1.4.11: o dot é conteúdo NÃO-TEXTUAL (é ele que diz o estado), medido
    // contra o fundo da própria pílula (gray-100). gray-400 media 2.20:1 ali.
    expect(source('StatusBadge.tsx')).toContain('dot: "bg-muted-foreground"');
    expect(contrast(sem('muted-foreground', 'claro'), tokens.colors['gray-100'])).toBeGreaterThanOrEqual(UI_MIN);
    expect(contrast(sem('muted-foreground', 'escuro'), tokens.colorsDark['gray-100'])).toBeGreaterThanOrEqual(UI_MIN);
    expect(contrast(GRAY_400, tokens.colors['gray-100'])).toBeLessThan(UI_MIN);
  });
});

// ---------------------------------------------------------------------------
// JET-106 — mínimos WCAG da camada semântica que o pacote agora ENVIA
// ---------------------------------------------------------------------------
// Sob D0.1 o valor destes tokens é responsabilidade do pacote, não da app. Então
// o mínimo de contraste passa a ser guardável aqui — e é onde o `--destructive`
// escuro se justifica: o grau de preenchimento (#dc2626) reprova a 3.70:1 como
// TEXTO no escuro, e o token deriva o mesmo C/H com L mais alto até passar.
describe('camada semântica: os pares que o pacote envia atingem o mínimo WCAG', () => {
  const PARES_DE_TEXTO = [
    { fg: 'foreground', bg: 'background', o_que: 'texto base' },
    { fg: 'card-foreground', bg: 'card', o_que: 'texto do cartão' },
    { fg: 'popover-foreground', bg: 'popover', o_que: 'texto do popover' },
    { fg: 'secondary-foreground', bg: 'secondary', o_que: 'texto sobre a superfície sutil' },
    { fg: 'accent-foreground', bg: 'accent', o_que: 'texto sobre o realce' },
    { fg: 'muted-foreground', bg: 'background', o_que: 'texto auxiliar' },
    { fg: 'primary-foreground', bg: 'primary', o_que: 'texto sobre o roxo da marca' },
    { fg: 'destructive', bg: 'background', o_que: 'texto destrutivo' },
  ] as const;

  it.each(PARES_DE_TEXTO)('$o_que: $fg sobre $bg (claro e escuro, mín. 4.5:1)', ({ fg, bg }) => {
    expect(contrast(sem(fg, 'claro'), sem(bg, 'claro'))).toBeGreaterThanOrEqual(TEXT_MIN);
    expect(contrast(sem(fg, 'escuro'), sem(bg, 'escuro'))).toBeGreaterThanOrEqual(TEXT_MIN);
  });

  it('destructive: o escuro PRECISOU derivar — o grau de preenchimento reprova como texto', () => {
    // Guarda o motivo, não só o resultado: se alguém "simplificar" o escuro de
    // volta para o status-critico, este teste diz por que não dá.
    expect(contrast(tokens.colorsDark['status-critico'], sem('background', 'escuro'))).toBeLessThan(TEXT_MIN);
    expect(sem('destructive', 'claro')).toBe(tokens.colors['status-critico'].toLowerCase());
  });

  // -------------------------------------------------------------------------
  // JET-105 (opção A) — `--primary` é papel de PREENCHIMENTO, e só
  // -------------------------------------------------------------------------
  // Com `--primary` neutro (o scaffold do shadcn) os outros dois papéis que ele
  // acumulava passavam por acidente: preto a 80% continua escuro, e preto como
  // texto sobra contraste. Com o roxo da marca os dois reprovam. O defeito não
  // nasceu do flip — ele estava escondido pela divergência.
  const SUPERFICIES_CLARAS = ['branco', 'page-bg'] as const;
  const SUPERFICIES_ESCURAS = ['branco', 'page-bg'] as const;

  it('o pacote não usa --primary com alpha nem como texto', () => {
    const componentes = readdirSync(resolve(process.cwd(), 'src/components'))
      .filter((f) => /\.tsx?$/.test(f) && !f.includes('.test.'));
    // `bg-primary/80` resolvia #a26cff no claro: rótulo branco a 3.43:1.
    expect(componentes.filter((f) => /bg-primary\/\d/.test(source(f)))).toEqual([]);
    // `text-primary` reprova sobre page-bg no claro e sobre o card no escuro.
    // `(?![\w-])` para não confundir com `text-primary-foreground`, que é o
    // rótulo SOBRE o preenchimento e continua correto.
    expect(componentes.filter((f) => /text-primary(?![\w-])/.test(source(f)))).toEqual([]);
  });

  it('primary-hover: rótulo branco sobre o preenchimento sólido do hover (4.5:1)', () => {
    // Sólido de propósito: sobre preenchimento opaco o contraste do rótulo não
    // depende da superfície atrás, então um valor serve nos dois modos.
    for (const modo of ['claro', 'escuro'] as const) {
      expect(contrast(sem('primary-foreground', modo), sem('primary-hover', modo))).toBeGreaterThanOrEqual(TEXT_MIN);
    }
  });

  it('primary-text: o par de texto passa 4.5:1 sobre card e page-bg, nos dois modos', () => {
    for (const surface of SUPERFICIES_CLARAS) {
      expect(contrast(sem('primary-text', 'claro'), tokens.colors[surface])).toBeGreaterThanOrEqual(TEXT_MIN);
    }
    for (const surface of SUPERFICIES_ESCURAS) {
      expect(contrast(sem('primary-text', 'escuro'), tokens.colorsDark[surface])).toBeGreaterThanOrEqual(TEXT_MIN);
    }
  });

  it('e o par de primary-text PRECISA ser assimétrico — nenhum dos dois valores serve sozinho', () => {
    // Guarda o motivo: sem isto, "simplificar" o par para um valor só volta a
    // reprovar em um dos modos, que é o defeito mais caro de achar.
    expect(contrast(sem('primary-text', 'claro'), tokens.colorsDark.branco)).toBeLessThan(TEXT_MIN);
    expect(contrast(sem('primary-text', 'escuro'), tokens.colors.branco)).toBeLessThan(TEXT_MIN);
    // E o roxo do preenchimento não serve para nenhum dos dois: é o ponto todo.
    expect(contrast(sem('primary', 'claro'), tokens.colors['page-bg'])).toBeLessThan(TEXT_MIN);
    expect(contrast(sem('primary', 'escuro'), tokens.colorsDark.branco)).toBeLessThan(TEXT_MIN);
  });

  it('input e ring delimitam controle: 3:1 sobre as três superfícies (WCAG 1.4.11)', () => {
    // `--input` expõe o mesmo grau `borda-controle` que a JET-101/JET-102 fechou;
    // este teste garante que a camada semântica não reintroduza a borda de
    // 1.26:1 por baixo, via `border-input`/`focus-visible:border-ring`.
    for (const surface of FIELD_SURFACES) {
      expect(contrast(sem('input', 'claro'), tokens.colors[surface])).toBeGreaterThanOrEqual(UI_MIN);
      expect(contrast(sem('input', 'escuro'), tokens.colorsDark[surface])).toBeGreaterThanOrEqual(UI_MIN);
    }
    expect(contrast(sem('ring', 'claro'), sem('background', 'claro'))).toBeGreaterThanOrEqual(UI_MIN);
    expect(contrast(sem('ring', 'escuro'), sem('background', 'escuro'))).toBeGreaterThanOrEqual(UI_MIN);
  });
});

// ---------------------------------------------------------------------------
// JET-109 / ADR-001 D7 — o item ATIVO da sidebar secundária, no escuro
// ---------------------------------------------------------------------------
// O texto do item ativo é o rótulo de navegação: é conteúdo, cai na 1.4.3 (4.5:1)
// e não na 1.4.11. Ele reprovava a 2.37:1 no escuro porque `secondary-active`
// tinha UM valor para os dois modos enquanto o fundo invertia.
//
// O que este bloco guarda além do valor: contra QUE fundo se mede. A pílula é
// `color-mix(…, transparent)` — translúcida —, então ela não tem cor até se
// saber o que está atrás. Medir contra o rail em vez da pílula foi o que fez o
// primeiro par proposto (#a06ef7) parecer aprovado a 4.70:1 quando na tela
// mediria 4.07:1. Aqui a pílula é RESOLVIDA a partir da declaração do
// tokens.json, não copiada à mão.
describe('item ativo da sidebar secundária: 4.5:1 sobre a pílula (D7)', () => {
  /** Resolve `--secondary-active-bg` contra a superfície que estiver atrás. */
  const pilula = (modo: 'claro' | 'escuro', atras: string) => {
    const decl = semantic['secondary-active-bg'][modo];
    const mix = parseColorMix(decl);
    if (!mix) throw new Error(`secondary-active-bg.${modo} não é o color-mix do contrato: ${decl}`);
    const primary = sem(mix.origem, modo);
    // `transparent` como resto: o token é translúcido e a tela compõe em sRGB.
    // Qualquer outro resto é opaco, e aí o que está atrás não entra na conta.
    return mix.resto === null
      ? alphaOver(primary, mix.fracao, atras)
      : mixOklch(primary, mix.fracao, sem(mix.resto, modo));
  };

  const ativo = (modo: 'claro' | 'escuro') =>
    (modo === 'claro' ? tokens.colors : tokens.colorsDark)['secondary-active'].toLowerCase();

  // O `<aside>` é `bg-page-bg`, mas aceita `className` — então o envelope são as
  // três superfícies escuras em que a sidebar pode cair, e não só a nominal. A
  // mais CLARA é o pior caso para texto claro (rail-bg), e é ela que governa:
  // medir só a superfície nominal é a mesma amostragem que deixou o defeito
  // nascer.
  const SUPERFICIES_ESCURAS = ['page-bg', 'rail-bg', 'branco'] as const;

  it('escuro: passa 4.5:1 sobre a pílula em TODAS as superfícies do envelope', () => {
    for (const s of SUPERFICIES_ESCURAS) {
      const fundo = pilula('escuro', tokens.colorsDark[s]);
      expect(contrast(ativo('escuro'), fundo)).toBeGreaterThanOrEqual(TEXT_MIN);
    }
  });

  it('claro: o valor do claro NÃO mudou e continua passando sobre a pílula clara', () => {
    // A pílula clara é opaca (mix com `--background`), então não depende do que
    // está atrás. O par assimétrico só se justifica se o claro seguir de pé.
    expect(contrast(ativo('claro'), pilula('claro', tokens.colors.branco))).toBeGreaterThanOrEqual(TEXT_MIN);
  });

  it('o par PRECISA ser assimétrico — nenhum dos dois valores serve nos dois modos', () => {
    // É o teste que guarda o defeito, não só a correção: "simplificar" o par de
    // volta a um valor só reprova em UM dos modos, nos dois sentidos.
    expect(contrast(ativo('claro'), pilula('escuro', tokens.colorsDark['rail-bg']))).toBeLessThan(TEXT_MIN);
    expect(contrast(ativo('escuro'), pilula('claro', tokens.colors.branco))).toBeLessThan(TEXT_MIN);
  });

  it('a medida é contra a PÍLULA, não contra o rail — é onde o par anterior passava', () => {
    // `roxo-claro` (#a06ef7) foi o primeiro par proposto na JET-109: mede 4.70:1
    // sobre o rail e reprova a 4.07:1 sobre a pílula que fica em cima dele. Sem
    // esta asserção, trocar a medida de fundo volta a "aprovar" um par que
    // reprova na tela.
    const rail = tokens.colorsDark['rail-bg'];
    expect(contrast(tokens.colorsDark['roxo-claro'], rail)).toBeGreaterThanOrEqual(TEXT_MIN);
    expect(contrast(tokens.colorsDark['roxo-claro'], pilula('escuro', rail))).toBeLessThan(TEXT_MIN);
  });

  it('margem: o par aguenta --primary trocando, porque a D3 faz o fundo segui-lo', () => {
    // O fundo é derivado de `--primary` (D3), então um par no fio dos 4.5
    // quebraria no dia em que a marca mudasse. `roxo-forte` e `roxo-claro` são
    // os dois roxos que já existem na base.
    for (const grau of ['roxo-forte', 'roxo-claro'] as const) {
      const fundo = alphaOver(tokens.colorsDark[grau], 0.15, tokens.colorsDark['rail-bg']);
      expect(contrast(ativo('escuro'), fundo)).toBeGreaterThanOrEqual(TEXT_MIN);
    }
  });

  it('o call site não mudou, e "ativo" não fica só na cor (1.4.1)', () => {
    const code = source('AppSecondarySidebar.tsx');
    expect(code).toContain('text-secondary-active');
    expect(code).toContain('bg-secondary-active-bg');
    // Cor É o sinal de estado aqui; `font-medium` é o segundo sinal, e é ele que
    // mantém o item ativo identificável sem depender de percepção de cor.
    expect(code).toMatch(/bg-secondary-active-bg font-medium text-secondary-active/);
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
