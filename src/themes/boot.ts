// Camada de BOOT do Dashboard2026 — fonte única dos valores que precisam existir
// ANTES de qualquer CSS var (JET-118, metade-pacote de JET-79/JET-80).
//
// Por que existe uma quarta camada, além da base e da semântica do ADR-001: o
// splash de boot pinta a tela no `index.html`, antes do bundle e antes do
// `theme.css`. Ali não há `var(--color-roxo)` para referenciar — o valor tem que
// estar escrito. A regra D1.1 ("a semântica nunca escreve valor") não se aplica
// aqui porque esta camada não é semântica; a regra que se aplica é a outra
// metade da mesma ideia: se o valor precisa ser escrito, ele é escrito UMA vez,
// e essa vez é aqui.
//
// Medido em 2026-08-13 nos três `index.html` de produção: o bloco de boot (CSS
// + markup, 830 B) é BYTE A BYTE idêntico em `auth`, `platform` e `devices`, e
// o <BrandLoading /> deste pacote repetia os mesmos literais uma quarta vez.
// Nenhuma app diverge — é triplicação pura, então centralizar não muda pixel.
//
// Os três literais JÁ SÃO graus da escala JETOOH (ver `mapeamento` abaixo e o
// `bootContract` do manifest). Eles ficam escritos aqui, e não importados do
// tokens.json, porque este módulo é código enviado no dist: importar JSON
// mudaria o formato do bundle. O que garante que não divergem é o
// `boot.test.ts`, que compara cada um com o `tokens.json` — o mesmo contrato do
// `theme.css`, que também escreve valor e também é conferido por teste.
//
// Mapeamento literal → grau da base (guardado em boot.test.ts):
//   bg      #0B0F0C  = colors.preto        (grau DE MODO — ver a ressalva)
//   ring    #8B47FF  = colors.roxo         (estático nos dois modos)
//   logo    #ffffff  = colors['branco-fixo'] (estático nos dois modos)
//
// Ressalva do `bg` (D5, guard de modo): `preto` vale #0B0F0C no claro e #F3F4F6
// no escuro. O splash é uma tela SEMPRE escura — é a mesma arte do
// jetooh.com.br, não a superfície da app — então ele usa o valor CLARO de
// `preto` como constante estática. Isso é uma dívida honesta e está registrada
// em `bootContract.lacunas.fundoDoSplash` no manifesto: o correto seria um grau
// estático (`preto-fixo`, como `branco-fixo`), e criá-lo é mudança de contrato,
// não desta issue.

/** Cores da camada de boot. Ver o mapeamento para a escala JETOOH acima. */
export const BOOT_COLORS = {
  /** Fundo do splash de boot. `colors.preto` (valor do modo claro, ver ressalva). */
  bg: '#0B0F0C',
  /** Anel de progresso e cor de marca do `<meta name="theme-color">`. `colors.roxo`. */
  ring: '#8B47FF',
  /** Rastro do anel: `ring` a 30%. Escrito em rgba() porque o anel gira antes do CSS da app. */
  ringTrail: 'rgba(139, 71, 255, 0.3)',
  /** Preenchimento do logo. `colors['branco-fixo']` — branco de verdade, nos dois modos. */
  logo: '#ffffff',
} as const;

/**
 * Chave do localStorage lida pelo `theme-init.js` e escrita pelo seletor de tema
 * da app. Está aqui para que a app não redigite a string: se ela divergir do
 * bootstrap, o modo escuro volta a piscar e nada quebra visivelmente no teste.
 */
export const BOOT_THEME_STORAGE_KEY = 'theme';

/** Valor que o `theme-init.js` reconhece como "escuro" na chave acima. */
export const BOOT_THEME_DARK_VALUE = 'dark';

/**
 * `d` do logo JETOOH (viewBox 0 0 512 512). Fonte única do desenho: o
 * <BrandLoading /> (React, pós-hidratação) e o `boot.html` (pré-hidratação)
 * mostram o MESMO logo, e o boot.test.ts falha se um dos dois for editado
 * sozinho.
 */
export const BOOT_LOGO_PATH =
  'M247.26,29.65C67.56,37.31-33.89,241.82,72.17,388.72c104.35,144.53,327.7,117.1,394.22-47.79C527.76,188.81,410.5,22.69,247.26,29.65ZM179.39,365.5c-33.69,1.47-64.42-21.23-76.28-52.12-.85-2.2-4.64-12.97-4.64-14.47v-95.8c32.69-.77,63.54,21.36,75.31,51.4,1.43,3.64,5.61,16.95,5.61,20.24v90.75ZM286.15,296.11c0,2.68-3.87,14.28-5.05,17.43-11.34,30.28-43.02,53.37-75.87,51.97v-173.91c0-2.38,3.44-13.47,4.48-16.31,11.01-30.16,43.87-54.03,76.43-52.53v173.35ZM391.79,365.5c-31.67,1.6-63.55-20.91-75.16-49.86-1.27-3.18-5.75-16.86-5.75-19.53v-92.15c2.97-1.55,8.55-.67,12.01-.21,28.96,3.85,54.16,24.92,64.26,52.05.93,2.5,4.64,13.68,4.64,15.59v94.12Z';
