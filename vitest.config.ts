import { defineConfig } from 'vitest/config';

// Testes de comportamento/a11y dos componentes canônicos. Como o pacote é fonte
// única, um teste aqui protege TODAS as apps que consomem o componente.
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
});
