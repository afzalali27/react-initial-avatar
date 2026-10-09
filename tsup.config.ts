import { defineConfig, type Options } from 'tsup';

const shared: Options = {
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  target: 'es2020',
  external: ['react', 'react/jsx-runtime'],
};

export default defineConfig([
  // The component uses state, so this entry must be a client module.
  { ...shared, entry: { index: 'src/index.ts' }, banner: { js: "'use client';" } },
  // Framework-free helpers, importable from Server Components. No directive.
  { ...shared, entry: { utils: 'src/utils.ts' } },
]);
