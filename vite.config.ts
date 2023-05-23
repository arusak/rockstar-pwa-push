import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import pathsPlugin from 'vite-tsconfig-paths';
import checkerPlugin from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync } from 'fs';
import { cssModulesDevClassNames } from './vite-css-modules-dev-classnames';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const { SSL_PRIVATE_KEY_PATH, SSL_PUBLIC_KEY_PATH } = loadEnv(mode, process.cwd(), '');
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
        key: SSL_PRIVATE_KEY_PATH && readFileSync(SSL_PRIVATE_KEY_PATH),
        cert: SSL_PUBLIC_KEY_PATH && readFileSync(SSL_PUBLIC_KEY_PATH),
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
