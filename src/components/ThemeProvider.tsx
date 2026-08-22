import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { BOOT_THEME_DARK_VALUE, BOOT_THEME_STORAGE_KEY } from '../themes/boot';
import { getThemeCookie, setThemeCookie } from '../themes/theme-cookie';

// ThemeProvider/useTheme ÚNICOS do ecossistema (JET-265) — fonte única, como
// todo elemento do tema (ver jetooh-shared-theme-single-source). Antes, cada
// app tinha sua própria cópia divergente; a duplicação é o que fazia a escolha
// "existir" quatro vezes, uma por origem, sem nunca se falar.
//
// A persistência agora é por COOKIE no domínio pai (`.jetooh.com`) — o único
// storage do browser compartilhado entre subdomínios. `localStorage` continua
// sendo lido como fallback (compat com quem já escolheu antes desta versão) e é
// migrado para cookie na primeira leitura; novas escolhas gravam nos dois.
//
// Tipo simplificado para `'light' | 'dark'`: o `'system'` que existia em duas
// das quatro cópias nunca era de fato produzido por nenhum toggle da UI (todas
// chamam `setTheme(isDark ? 'light' : 'dark')`) — era estado morto, não
// funcionalidade em uso.
export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function isValidTheme(value: string | null): value is Theme {
  return value === BOOT_THEME_DARK_VALUE || value === 'light';
}

/**
 * Resolve o tema inicial: cookie → localStorage (migrando para cookie quando
 * encontrado só ali) → claro (default — mesmo comportamento de antes, nenhuma
 * app resolvia por `prefers-color-scheme`).
 */
function readInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'light';

  const fromCookie = getThemeCookie();
  if (isValidTheme(fromCookie)) return fromCookie;

  try {
    const fromStorage = localStorage.getItem(BOOT_THEME_STORAGE_KEY);
    if (isValidTheme(fromStorage)) {
      setThemeCookie(fromStorage);
      return fromStorage;
    }
  } catch {
    // Safari privado / iframe: localStorage lança. Sem preferência salva, claro.
  }

  return 'light';
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === BOOT_THEME_DARK_VALUE);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Lazy init (não useEffect): resolve o tema real já no primeiro render, para
  // não piscar o ícone claro no AppUserMenu enquanto o cookie/localStorage é lido.
  const [theme, setThemeState] = useState<Theme>(() => readInitialTheme());

  useEffect(() => {
    // Garante a classe aplicada mesmo em apps sem theme-init.js no boot (ex.:
    // devices antes do JET-265) — idempotente onde o bootstrap já aplicou.
    applyTheme(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    setThemeCookie(next);
    try {
      localStorage.setItem(BOOT_THEME_STORAGE_KEY, next);
    } catch {
      // Safari privado / iframe: o cookie já persistiu a escolha.
    }
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
