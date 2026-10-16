import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages 项目站点部署在 /phrase-memo/ 下，仓库名需与此一致
export default defineConfig({
  base: '/phrase-memo/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      workbox: {
        // 离线词典 dict.json 约 2.8 MB，需要预缓存，默认的 2 MiB 上限放不下
        globPatterns: ['**/*.{js,css,html,png,json,webmanifest}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: '口语短语记忆',
        short_name: '短语记忆',
        description: '用间隔重复记忆日常英语口语短语',
        lang: 'zh-CN',
        theme_color: '#3b6cf6',
        background_color: '#f5f6fa',
        display: 'standalone',
        start_url: '/phrase-memo/',
        scope: '/phrase-memo/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
