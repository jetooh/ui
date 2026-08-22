/* Bootstrap de tema do Dashboard2026 — ENVIADO pelo @jetooh/ui (JET-118, JET-265).
 *
 * Aplica `.dark` no <html> ANTES do primeiro paint, lendo a preferência
 * persistida. Sem ele, a app com dezenas de regras `.dark` no CSS pinta a tela
 * clara e só troca depois que o bundle React monta: flash de tema claro para
 * quem está no escuro (JET-79, medido no `devices`).
 *
 * Ordem de leitura (JET-265): cookie do domínio pai (`.jetooh.com`, escrito
 * pelo `ThemeProvider` do pacote — atravessa subdomínio) → localStorage
 * (fallback de quem escolheu antes do cookie existir; o `ThemeProvider` migra
 * para cookie na primeira leitura) → claro (default, sem preferência salva).
 *
 * Por que é um ARQUIVO e não um <script> inline no index.html: CSP com
 * `script-src` SEM 'unsafe-inline' (@security 2026-07-27). O inline volta a
 * exigir hash/nonce por app — quatro cópias, quatro chances de divergir.
 *
 * Por que fica no PACOTE e não copiado à mão em cada app: é casca de tema.
 * Adotar é copiar UM arquivo versionado para o `public/` da app — e o dia em
 * que o modo escuro mudar de chave ou de storage, muda aqui e vale em todas.
 *
 * REGRAS deste arquivo (é o que o boot.test.ts guarda):
 *  · JS clássico, sem módulo, sem import, sem build — é servido cru pela app.
 *  · Sem dependência: roda antes de qualquer bundle.
 *  · Todo acesso a document.cookie/localStorage dentro de try/catch: em
 *    iframe/Safari privado o getItem LANÇA, e uma exceção aqui aborta o boot
 *    da app inteira.
 *  · Só ADICIONA a classe. Remover no boot quebraria a app que já renderiza
 *    `.dark` por outro caminho (SSR, atributo no html).
 *
 * Comportamento é o do `platform` (régua) byte a byte — adotar não pode mudar
 * pixel, só passa a atravessar subdomínio.
 */
(function () {
  try {
    var match = document.cookie.match(/(?:^|; )theme=([^;]*)/);
    var stored = match ? decodeURIComponent(match[1]) : localStorage.getItem('theme');
    if (stored === 'dark') document.documentElement.classList.add('dark');
  } catch (_) {}
})();
