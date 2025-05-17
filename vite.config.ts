import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import tailwindcss from '@tailwindcss/vite'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    wasm(),
    topLevelAwait(),
    tailwindcss(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'maskable-icon-512x512.png'],
    //   manifest: {
    //     name: 'Thought',
    //     short_name: 'Thought',
    //     description: 'A local-first place for thoughts',
    //     theme_color: '#ffffff',
    //     icons: [
    //       {
    //         src: 'pwa-64x64.png',
    //         sizes: '64x64',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'pwa-192x192.png',
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'pwa-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //         purpose: 'any'
    //       },
    //       {
    //         src: 'maskable-icon-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //         purpose: 'maskable'
    //       }
    //     ]
    //   },


    //   workbox: {


    //     runtimeCaching: [
    //       {


    //         urlPattern: ({

    //           request }) =>

    //           request.destination === 'style' ||

    //           request.destination === 'script' ||


    //           request.destination === 'worker',


    //         handler: 'StaleWhileRevalidate',


    //         options: {


    //           cacheName: 'static-resources',


    //           expiration: {


    //             maxEntries: 50,


    //             maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
    //           },
    //         },
    //       },
    //       {


    //         urlPattern: ({

    //           request }) =>

    //           request.destination === 'image',


    //         handler: 'CacheFirst',


    //         options: {


    //           cacheName: 'images',


    //           expiration: {


    //             maxEntries: 100,


    //             maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
    //           },
    //         },
    //       },
    //     ],
    //   },
    //   devOptions: {
    //     enabled: true
    //   }
    // })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
