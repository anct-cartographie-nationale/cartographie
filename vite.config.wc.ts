import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { fileReplacement } from './vite-plugin-file-replacement';

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  return {
    plugins: [
      fileReplacement('.wc', path.resolve(__dirname, './src')),
      react(),
      ...(isDev
        ? []
        : [
            dts({
              include: ['src/web-components/**/*', 'src/@types/**/*'],
              outDir: 'dist-wc',
              rollupTypes: true
            })
          ])
    ],
    ...(isDev ? { root: 'src/web-components/demo' } : {}),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
      'process.env': JSON.stringify({ NODE_ENV: isDev ? 'development' : 'production' }),
    },
    worker: {
      format: 'es',
      rolldownOptions: {
        output: {
          format: 'es'
        }
      }
    },
    build: {
      target: 'esnext',
      lib: {
        entry: path.resolve(__dirname, 'src/web-components/index.ts'),
        name: 'CartographieWebComponents',
        formats: ['es', 'umd'],
        fileName: (format) => `cartographie.${format}.js`
      },
      outDir: path.resolve(__dirname, 'dist-wc'),
      rolldownOptions: {
        external: [],
        output: {
          globals: {},
          inlineDynamicImports: true
        }
      },
      sourcemap: true
    }
  };
});
