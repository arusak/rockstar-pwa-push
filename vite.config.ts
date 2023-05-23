import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pathsPlugin from 'vite-tsconfig-paths';
import checkerPlugin from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync } from 'fs';
import { cssModulesDevClassNames } from './vite-css-modules-dev-classnames';

// https://vitejs.dev/config/
export default defineConfig(() => {
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
        manifestFilename: 'manifest.json',
        injectRegister: 'auto',
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
      cssModulesDevClassNames()
    ],
    resolve: {},
    css: {
      devSourcemap: true,
    },
    server: {
      port: 3000,
      https: {
        key: readFileSync('c:/users/captain/.openssl/localhost.key'),
        cert: readFileSync('c:/users/captain/.openssl/localhost.crt'),
      }
    },
    build: {
      outDir: 'build',
      sourcemap: 'inline'
    },
    preview: {
      port: 8080,
    },
    test: {
      globals: true,
    },
  };
});
