import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    solidPlugin(),
    dts({
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    }),
  ],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MetaMorphUI',
      fileName: (format) => `metamorph-ui.${format === 'es' ? 'js' : 'umd.cjs'}`,
    },
    rollupOptions: {
      external: ['solid-js', 'solid-js/web'],
      output: {
        globals: {
          'solid-js': 'Solid',
          'solid-js/web': 'SolidWeb',
        },
      },
    },
    sourcemap: true,
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
