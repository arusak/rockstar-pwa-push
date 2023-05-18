import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pathsPlugin from 'vite-tsconfig-paths';
import checkerPlugin from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  return {
    plugins: [
      react(),
      pathsPlugin(),
      checkerPlugin({
        overlay: false,
        typescript: true,
      }),
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'service-worker.ts',
        manifest: {

        },
        injectRegister: 'auto',
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
    },
    css: {
      devSourcemap: true,
      modules: {
        generateScopedName:
          mode === 'production'
            ? '[hash:base64:8]'
            : (name, filename, css) => {
              const i = css.indexOf('.' + name);
              const line = css.substring(0, i).split(/[\r\n]/).length;
              const file = path.basename(filename, '.module.css');

              return `${file}_${name}_${String(line).padStart(3, '0')}`;
            },
      },
    },
    assetsInclude: ['**/*.mov'],
    server: {
      port: 3000,
    },
    build: {
      outDir: 'build',
    },
    preview: {
      port: 8080,
    },
    test: {
      globals: true,
    },
  };
});
