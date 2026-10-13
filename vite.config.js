import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      includeAssets: ['icons/*.png'],
      manifest: {
        id: '/',
        name: 'CraveCompass',
        short_name: 'CraveCompass',
        description: 'Swipe dishes you crave. Get matched with Indianapolis restaurants you’ll love.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FFF8F0',
        theme_color: '#FFF8F0',
        categories: ['food', 'lifestyle'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}', '**/*-latin-*.woff2'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            // Food photos: show cached instantly, keep a generous offline set.
            urlPattern: ({ url }) => url.origin === 'https://images.unsplash.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'food-photos',
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith('/api/dishes') || url.pathname === '/api/restaurants',
            handler: 'NetworkFirst',
            options: { cacheName: 'api-catalog', networkTimeoutSeconds: 4 },
          },
        ],
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // One vendor chunk: stable across app deploys, and avoids cross-chunk init cycles.
        manualChunks(id) {
          if (id.includes('node_modules') && !id.includes('qrcode')) return 'vendor';
        },
      },
    },
  },
  server: {
    host: true,
    proxy: {
      '/api': 'http://localhost:' + (process.env.API_PORT || 3001),
    },
  },
});
