import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.VITE_BASE_PATH_URI,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          clientsClaim: true,
          skipWaiting: true,
          globPatterns: ['**/*.{js,css,html,ico,png,svg}']
        },
        devOptions: {
          enabled: true
        },
        includeAssets: ['favicon.ico', 'favicon-16x16.png'],
        manifest: {
          name: 'Mi tesorería',
          short_name: 'Tesorería',
          description: 'Aplicación para administrar la tesorería',
          theme_color: '#fdfdfd',
          icons: [
            {
              src: 'android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'favicon-32x32.png',
              sizes: '32x32',
              type: 'image/png'
            },
            {
              src: 'favicon-16x16.png',
              sizes: '16x16',
              type: 'image/png'
            },
          ]
        }
      }),
    ],
  };
})
