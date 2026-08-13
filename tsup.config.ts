import { defineConfig } from 'tsup';
// ESM + tipos. SEM minify: as strings de className ficam legíveis no dist para
// o Tailwind de cada app conseguir escanear (content: node_modules/@jetooh/ui/dist).
export default defineConfig({
  entry: ['src/index.ts'],
  // JET-106: o pacote ENVIA a camada semântica (ADR-001 D0.1). O tema inteiro vai
  // para o dist — `theme.css` para a app importar, `tokens.json`/`manifest.json`
  // para o token-drift do pilot ler o canônico da mesma fonte que o pacote usa.
  publicDir: 'src/themes/dashboard-2026',
  format: ['esm'],
  dts: true,
  clean: true,
  minify: false,
  external: ['react', 'react-dom', 'lucide-react', '@base-ui/react'],
});
