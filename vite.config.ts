import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/logo.svg', 'assets/logo-mark.svg', 'assets/eddy-mascot.svg'],
      manifest: {
        name: "Eddy's Wallet",
        short_name: "Eddy's Wallet",
        description: 'A family banking app that teaches kids to save, spend, and earn.',
        theme_color: '#7C4DF4',
        background_color: '#FBF9FF',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/assets/logo-mark.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/assets/logo-mark.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
})
