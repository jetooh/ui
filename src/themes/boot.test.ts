// Guard-rail da CAMADA DE BOOT (JET-118).
//
// A camada de boot é a única do tema que escreve valor de cor fora do
// tokens.json/theme.css — não por descuido, mas porque roda antes de existir
// `var(--color-*)`. O preço disso é que ela pode divergir da escala sem que
// nada quebre visivelmente: o splash continua pintando, só que num roxo velho.
// Este arquivo cobra o preço.
//
// O que ele guarda:
//   1. `boot.ts` bate com o `tokens.json` — todo literal da camada de boot é um
//      grau da escala JETOOH, e o teste falha se um dos dois mudar sozinho.
//   2. `boot.css` e `boot.html` não reescrevem valor por conta própria: as cores
//      do CSS são as do `boot.ts`, e o logo do HTML é o mesmo `d` do
//      <BrandLoading />.
//   3. `theme-init.js` faz o que promete em jsdom: aplica `.dark` só com a
//      preferência escura, e NÃO derruba o boot da app quando o localStorage
//      lança (iframe/Safari privado — é o motivo do try/catch).
//   4. Os três arquivos ficam no publicDir do tsup e estão no `exports` do
//      package.json — senão o pacote "envia" algo que não chega no dist.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import tokens from './dashboard-2026/tokens.json';
import manifest from './dashboard-2026/manifest.json';
import { BOOT_COLORS, BOOT_LOGO_PATH, BOOT_THEME_STORAGE_KEY, BOOT_THEME_DARK_VALUE } from './boot';

// publicDir do tsup.config.ts: tudo que estiver aqui vai para o dist como arquivo.
const PUBLIC_DIR = resolve(process.cwd(), 'src/themes/dashboard-2026');
const read = (f: string) => readFileSync(resolve(PUBLIC_DIR, f), 'utf8');

const themeInit = read('theme-init.js');
const bootCss = read('boot.css');
const bootHtml = read('boot.html');
const brandLoading = readFileSync(resolve(process.cwd(), 'src/components/BrandLoading.tsx'), 'utf8');
const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')) as {
  exports: Record<string, unknown>;
  files: string[];
};

const colors = tokens.colors as Record<string, string>;
const bootMap = manifest.bootContract.mapeamento;

// Só as declarações — sem os comentários, que citam os literais de propósito.
const cssDeclaracoes = bootCss.replace(/\/\*[\s\S]*?\*\//g, '');

describe('camada de boot: o literal é um grau da escala, não um valor inventado', () => {
  it('BOOT_COLORS.bg é o `preto` do tokens.json (valor claro — o splash é sempre escuro)', () => {
    expect(BOOT_COLORS.bg.toLowerCase()).toBe(colors.preto.toLowerCase());
  });

  it('BOOT_COLORS.ring é o `roxo` do tokens.json', () => {
    expect(BOOT_COLORS.ring.toLowerCase()).toBe(colors.roxo.toLowerCase());
  });

  it('BOOT_COLORS.logo é o `branco-fixo` do tokens.json', () => {
    expect(BOOT_COLORS.logo.toLowerCase()).toBe(colors['branco-fixo'].toLowerCase());
  });

  it('BOOT_COLORS.ringTrail é o MESMO roxo a 30% — não um roxo parecido', () => {
    // O rastro do anel é o único valor derivado da camada: se ele for escrito à
    // mão, a troca do roxo deixa anel e rastro de famílias diferentes.
    const m = BOOT_COLORS.ringTrail.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);
    expect(m, `ringTrail fora do formato rgba(): ${BOOT_COLORS.ringTrail}`).not.toBeNull();
    const [r, g, b] = m!.slice(1, 4).map(Number);
    const hex = `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
    expect(hex.toLowerCase()).toBe(BOOT_COLORS.ring.toLowerCase());
    expect(Number(m![4])).toBe(0.3);
  });

  it('o mapeamento do manifesto descreve os literais que o boot.ts realmente usa', () => {
    // O manifesto é o que a app e o token-drift leem. Se ele contar outra
    // história, a dívida fica registrada contra um valor que não existe.
    expect(bootMap.bg.literal.toLowerCase()).toBe(BOOT_COLORS.bg.toLowerCase());
    expect(bootMap.ring.literal.toLowerCase()).toBe(BOOT_COLORS.ring.toLowerCase());
    expect(bootMap.ringTrail.literal).toBe(BOOT_COLORS.ringTrail);
    expect(bootMap.logo.literal.toLowerCase()).toBe(BOOT_COLORS.logo.toLowerCase());
  });

  it('a lacuna do fundo (grau de modo usado como estático) continua registrada', () => {
    // Enquanto não existir `preto-fixo`, a torção fica explícita e com dono —
    // que é a diferença entre dívida e esquecimento.
    expect(manifest.bootContract.lacunas.fundoDoSplash.dono).toBeTruthy();
    expect(colors.preto).not.toBe((tokens.colorsDark as Record<string, string>).preto);
  });
});

describe('camada de boot: um valor, um arquivo', () => {
  it('o boot.css usa exatamente as cores do boot.ts', () => {
    expect(cssDeclaracoes).toContain(`background: ${BOOT_COLORS.bg}`);
    expect(cssDeclaracoes).toContain(`border-top-color: ${BOOT_COLORS.ring}`);
    expect(cssDeclaracoes).toContain(`border-right-color: ${BOOT_COLORS.ringTrail}`);
    expect(cssDeclaracoes).toContain(`fill: ${BOOT_COLORS.logo}`);
  });

  it('o boot.css não escreve NENHUMA outra cor', () => {
    const conhecidas = new Set(
      [BOOT_COLORS.bg, BOOT_COLORS.ring, BOOT_COLORS.logo].map((c) => c.toLowerCase()),
    );
    const hexes = (cssDeclaracoes.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []).map((h) => h.toLowerCase());
    expect([...new Set(hexes)].filter((h) => !conhecidas.has(h))).toEqual([]);
    const rgbas = cssDeclaracoes.match(/rgba?\([^)]*\)/g) ?? [];
    expect(rgbas.filter((c) => c !== BOOT_COLORS.ringTrail)).toEqual([]);
  });

  it('o boot.html usa o logo do boot.ts, e o <BrandLoading /> usa o mesmo', () => {
    // As duas metades do MESMO splash: boot.html antes da hidratação, o
    // componente depois. Logo diferente entre elas = emenda visível na troca.
    expect(bootHtml).toContain(BOOT_LOGO_PATH);
    expect(brandLoading).toContain('BOOT_LOGO_PATH');
    expect(brandLoading).not.toMatch(/\bd="M[\d.,\-]/);
  });

  it('o <BrandLoading /> não reescreve os hex do boot', () => {
    // Era a quarta cópia dos literais, ao lado das três dos index.html.
    expect(brandLoading.replace(/\/\/.*$/gm, '')).not.toMatch(/#[0-9a-fA-F]{6}\b/);
  });

  it('as classes do boot.html são as que o boot.css estiliza', () => {
    for (const cls of ['jt-ring', 'jt-logo']) {
      expect(bootHtml).toContain(`class="${cls}"`);
      expect(cssDeclaracoes).toContain(`.${cls}`);
    }
    expect(bootHtml).toContain('id="initial-loading"');
    expect(cssDeclaracoes).toContain('#initial-loading');
    // A app remove o splash adicionando .hide — sem a regra, o splash fica na tela.
    expect(cssDeclaracoes).toContain('#initial-loading.hide');
  });
});

describe('theme-init.js: aplica o modo antes do primeiro paint', () => {
  const rodar = () => new Function(themeInit)();
  const limparCookie = () => {
    document.cookie = `${BOOT_THEME_STORAGE_KEY}=; Path=/; Max-Age=0`;
  };

  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    localStorage.clear();
    limparCookie();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    limparCookie();
  });

  it('aplica .dark quando a preferência guardada é escura', () => {
    localStorage.setItem(BOOT_THEME_STORAGE_KEY, BOOT_THEME_DARK_VALUE);
    rodar();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('não aplica .dark sem preferência guardada (default é claro)', () => {
    rodar();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('não aplica .dark com preferência clara', () => {
    localStorage.setItem(BOOT_THEME_STORAGE_KEY, 'light');
    rodar();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('JET-265: cookie do domínio pai tem prioridade sobre o localStorage', () => {
    document.cookie = `${BOOT_THEME_STORAGE_KEY}=${BOOT_THEME_DARK_VALUE}; Path=/`;
    localStorage.setItem(BOOT_THEME_STORAGE_KEY, 'light');
    rodar();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('JET-265: sem cookie, cai para o localStorage (fallback de quem escolheu antes)', () => {
    localStorage.setItem(BOOT_THEME_STORAGE_KEY, BOOT_THEME_DARK_VALUE);
    rodar();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('só ADICIONA: não tira o .dark que a app já tenha posto', () => {
    document.documentElement.classList.add('dark');
    localStorage.setItem(BOOT_THEME_STORAGE_KEY, 'light');
    rodar();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('não lança quando o localStorage é proibido (iframe/Safari privado)', () => {
    // Sem o try/catch, a exceção aqui aborta o <script> e a app não sobe.
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('The operation is insecure.', 'SecurityError');
    });
    expect(() => rodar()).not.toThrow();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('a chave e o valor lidos são os que o boot.ts exporta para a app', () => {
    // O seletor de tema da app grava por este contrato; string divergente =
    // flash de tema de volta, sem erro nenhum no console.
    expect(themeInit).toContain(`localStorage.getItem('${BOOT_THEME_STORAGE_KEY}')`);
    expect(themeInit).toContain(`=== '${BOOT_THEME_DARK_VALUE}'`);
  });

  it('JET-265: lê document.cookie ANTES do localStorage (cookie é a fonte cross-subdomínio)', () => {
    const idxCookie = themeInit.indexOf('document.cookie');
    const idxLocalStorage = themeInit.indexOf('localStorage.getItem');
    expect(idxCookie).toBeGreaterThan(-1);
    expect(idxLocalStorage).toBeGreaterThan(-1);
    expect(idxCookie).toBeLessThan(idxLocalStorage);
  });

  it('é JS clássico sem dependência: roda cru, servido pela app', () => {
    expect(themeInit).not.toMatch(/^\s*(import|export)\s/m);
    expect(themeInit).not.toContain('require(');
    expect(themeInit).not.toContain('document.write');
  });
});

describe('camada de boot: o pacote realmente ENVIA os arquivos', () => {
  it('os três estão no publicDir do tsup (= vão para o dist)', () => {
    // Ler daqui já provou que existem; o que este teste guarda é o caminho:
    // fora do publicDir, o arquivo existe no repo e some no pacote publicado.
    const tsup = readFileSync(resolve(process.cwd(), 'tsup.config.ts'), 'utf8');
    expect(tsup).toContain("publicDir: 'src/themes/dashboard-2026'");
    expect(pkg.files).toContain('dist');
  });

  it('o package.json exporta os três subcaminhos', () => {
    expect(pkg.exports['./theme-init.js']).toBe('./dist/theme-init.js');
    expect(pkg.exports['./boot.css']).toBe('./dist/boot.css');
    expect(pkg.exports['./boot.html']).toBe('./dist/boot.html');
  });

  it('o manifesto descreve os três e como a app os serve', () => {
    expect(Object.keys(manifest.bootContract.enviaNoDist)).toEqual([
      'theme-init.js',
      'boot.css',
      'boot.html',
    ]);
    expect(manifest.bootContract.comoAdotar.length).toBeGreaterThanOrEqual(4);
  });
});
