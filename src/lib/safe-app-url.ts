// Defesa em profundidade para o redirect de página inteira da seção "Trocar de
// app" do UserMenu: a URL do destino vem de fora (GET /me/apps, resposta da
// api). Nunca fazemos `window.location.href = <url do payload>` sem checar que
// o host pertence ao ecossistema — evita que uma resposta adulterada vire um
// redirect para um domínio arbitrário (open redirect / phishing). Centralizado
// aqui (em vez de em cada app consumidora) para não duplicar a checagem 4x —
// ver `jetooh-shared-theme-single-source`. Espelha `isSafeAppUrl` do app `my`
// (que fica fora do pacote por não consumir `@jetooh/ui`).
const ALLOWED_SUFFIX = ".jetooh.com"
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"])

export function isSafeAppUrl(url: string): boolean {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return false
  }
  const { hostname, protocol } = parsed
  if (LOCAL_HOSTS.has(hostname)) return protocol === "http:" || protocol === "https:"
  if (protocol !== "https:") return false
  return hostname === "jetooh.com" || hostname.endsWith(ALLOWED_SUFFIX)
}
