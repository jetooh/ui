// Persistência de tema cross-subdomínio (JET-265) — cookie no domínio pai.
//
// `localStorage` é por ORIGEM: `admin.jetooh.com` e `devices.jetooh.com` nunca
// compartilham a mesma chave, então a escolha de tema não atravessa apps. Cookie
// com `Domain=.jetooh.com` é o único storage do browser que é compartilhado por
// subdomínios sem round-trip na api — por isso é o mecanismo escolhido aqui, não
// um sync via backend.
//
// A chave do cookie é a MESMA do localStorage (`BOOT_THEME_STORAGE_KEY`, 'theme')
// — um contrato, dois storages: o cookie é a fonte nova; o localStorage continua
// sendo lido como fallback (quem já escolheu antes desta mudança) e é migrado
// para cookie na primeira leitura (ver `ThemeProvider`).
import { BOOT_THEME_STORAGE_KEY } from './boot';

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 ano

function isJetoohDomain(hostname: string): boolean {
  return hostname === 'jetooh.com' || hostname.endsWith('.jetooh.com');
}

/** Lê o cookie de tema. `null` se ausente — nunca lança fora do browser (SSR/teste sem DOM). */
export function getThemeCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${BOOT_THEME_STORAGE_KEY}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Grava o cookie de tema no domínio pai. `Domain=.jetooh.com` só quando o host
 * é o domínio real (produção) — em `localhost`/preview o browser REJEITA um
 * cookie com esse `Domain` (host não é subdomínio dele), então lá o cookie vira
 * host-only automaticamente (mesmo efeito local, sem cross-subdomain — não há
 * subdomínio para atravessar em dev). `Secure` só em HTTPS, pelo mesmo motivo.
 */
export function setThemeCookie(value: string): void {
  if (typeof document === 'undefined') return;
  const { hostname, protocol } = window.location;
  const domain = isJetoohDomain(hostname) ? '; Domain=.jetooh.com' : '';
  const secure = protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    `${BOOT_THEME_STORAGE_KEY}=${encodeURIComponent(value)}; Path=/; ` +
    `Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${domain}${secure}`;
}
