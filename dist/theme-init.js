/* Bootstrap de tema do Dashboard2026 — ENVIADO pelo @jetooh/ui (JET-118).
 *
 * Aplica `.dark` no <html> ANTES do primeiro paint, lendo a preferência que a app
 * grava em localStorage('theme'). Sem ele, a app com 41 regras `.dark` no CSS
 * pinta a tela clara e só troca depois que o bundle React monta: flash de tema
 * claro para quem está no escuro (JET-79, medido no `devices`).
 *
 * Por que é um ARQUIVO e não um <script> inline no index.html: CSP com
 * `script-src` SEM 'unsafe-inline' (@security 2026-07-27). O inline volta a
 * exigir hash/nonce por app — três cópias, três chances de divergir.
 *
 * Por que fica no PACOTE e não copiado à mão em cada app: é casca de tema. O
 * `platform` (régua) serve este comportamento hoje; `devices` e `auth` não. Com
 * o pacote enviando, adotar é copiar UM arquivo versionado para o `public/` da
 * app — e o dia em que o modo escuro mudar de chave ou ganhar `system`, muda
 * aqui e vale nas três.
 *
 * REGRAS deste arquivo (é o que o boot.test.ts guarda):
 *  · JS clássico, sem módulo, sem import, sem build — é servido cru pela app.
 *  · Sem dependência: roda antes de qualquer bundle.
 *  · Todo acesso a localStorage dentro de try/catch: em iframe/Safari privado o
 *    getItem LANÇA, e uma exceção aqui aborta o boot da app inteira.
 *  · Só ADICIONA a classe. Remover no boot quebraria a app que já renderiza
 *    `.dark` por outro caminho (SSR, atributo no html).
 *
 * Comportamento é o do `platform` byte a byte — adotar não pode mudar pixel.
 */
(function () {
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'dark') document.documentElement.classList.add('dark');
  } catch (_) {}
})();
