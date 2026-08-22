import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { ThemeProvider, useTheme } from './ThemeProvider';

function Probe() {
  const { theme, setTheme } = useTheme();
  return (
    <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme}
    </button>
  );
}

function readCookie(): string | null {
  const match = document.cookie.match(/(?:^|; )theme=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

describe('ThemeProvider (JET-265: cookie cross-subdomínio)', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    localStorage.clear();
    document.cookie = 'theme=; Path=/; Max-Age=0';
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
    localStorage.clear();
    document.cookie = 'theme=; Path=/; Max-Age=0';
  });

  it('sem cookie e sem localStorage, resolve para claro (default inalterado)', () => {
    render(<ThemeProvider><Probe /></ThemeProvider>);
    expect(screen.getByRole('button')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('cookie tem prioridade sobre localStorage', () => {
    document.cookie = 'theme=dark; Path=/';
    localStorage.setItem('theme', 'light');
    render(<ThemeProvider><Probe /></ThemeProvider>);
    expect(screen.getByRole('button')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('sem cookie, cai para localStorage e MIGRA o valor para cookie', () => {
    localStorage.setItem('theme', 'dark');
    render(<ThemeProvider><Probe /></ThemeProvider>);
    expect(screen.getByRole('button')).toHaveTextContent('dark');
    expect(readCookie()).toBe('dark');
  });

  it('setTheme grava cookie E localStorage, e aplica a classe', () => {
    render(<ThemeProvider><Probe /></ThemeProvider>);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('dark');
    expect(readCookie()).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('useTheme fora do provider lança', () => {
    const spy = () => render(<Probe />);
    expect(spy).toThrow('useTheme must be used within a ThemeProvider');
  });
});
