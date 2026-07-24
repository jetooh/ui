import { defineConfig } from 'tsup';
// ESM + tipos. SEM minify: as strings de className ficam legíveis no dist para
// o Tailwind de cada app conseguir escanear (content: node_modules/@jetooh/ui/dist).
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  minify: false,
  external: ['react', 'react-dom', 'lucide-react'],
});
