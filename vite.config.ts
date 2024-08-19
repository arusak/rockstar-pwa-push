import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import pathsPlugin from 'vite-tsconfig-paths'
import checkerPlugin from 'vite-plugin-checker'
import {VitePWA} from 'vite-plugin-pwa'
import {readFileSync} from 'fs'
import {readableCssModules} from 'vite-plugin-readable-css-modules'

export default defineConfig(({mode}) => {
    const {SSL_PRIVATE_KEY_PATH, SSL_PUBLIC_KEY_PATH} = loadEnv(mode, process.cwd(), '')
    return {
        plugins: [
            react(),
            pathsPlugin(),
            checkerPlugin({
                overlay: false,
                typescript: true
            }),
            VitePWA({
                strategies: 'injectManifest',
                srcDir: 'src',
                filename: 'service-worker.ts',
                registerType: 'autoUpdate',
                manifest: {
                    name: 'Rockstar PWA + Push Showcase',
                    short_name: 'Rockstar PWA',
                    start_url: '/rockstar-pwa-push/',
                    display: 'standalone',
                    theme_color: '#f5ba22',
                    background_color: '#f5ba22',
                    icons: [
                        {
                            src: 'icon192.png',
                            sizes: '192x192',
                            type: 'image/png',
                            purpose: 'maskable any'
                        },
                        {
                            src: 'icon512.png',
                            sizes: '512x512',
                            type: 'image/png',
                            purpose: 'maskable any'
                        },
                        {
                            src: 'icon192.png',
                            sizes: '192x192',
                            type: 'image/png'
                        },
                        {
                            src: 'icon512.png',
                            sizes: '512x512',
                            type: 'image/png'
                        }
                    ]
                },
                injectRegister: 'auto',
                devOptions: {
                    enabled: true,
                    type: 'module'
                }
            }),
            readableCssModules()
        ],
        define: {
            "import.meta.env.VITE_BUILD": JSON.stringify(new Intl.DateTimeFormat('en-GB', {
                dateStyle: 'short',
                timeStyle: 'short'
            }).format(new Date()))
        },
        css: {
            devSourcemap: true
        },
        server: {
            port: 3333,
            https:
                SSL_PRIVATE_KEY_PATH && SSL_PUBLIC_KEY_PATH
                    ? {
                        key: readFileSync(SSL_PRIVATE_KEY_PATH),
                        cert: readFileSync(SSL_PUBLIC_KEY_PATH)
                    }
                    : undefined
        },
        build: {
            outDir: 'build',
            sourcemap: 'inline'
        },
        preview: {
            port: 8080
        }
    }
})
