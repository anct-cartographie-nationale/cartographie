import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { fileReplacement } from './vite-plugin-file-replacement';

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  return {
    plugins: [
      fileReplacement('.wc'),
      react(),
      ...(isDev
        ? []
        : [
            dts({
              include: ['src/web-components/**/*'],
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
      'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production')
    },
    worker: {
      format: 'es',
      rollupOptions: {
        output: {
          format: 'es'
        }
      }
    },
    esbuild: {
      target: 'esnext'
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext'
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
      rollupOptions: {
        external: [],
        output: {
          globals: {}
        }
      },
      sourcemap: true,
      minify: 'esbuild'
    }
  };
});
