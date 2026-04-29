import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 코어 - 가장 안정적, 캐시 히트율 높음
          'vendor': ['react', 'react-dom'],

          // 애니메이션 - 크기 크고 변경 드묾
          'motion': ['framer-motion', 'motion'],

          // 차트 - Progress.tsx에서만 사용
          'charts': ['recharts'],

          // Supabase - auth.ts, client.ts에서만 사용
          'supabase': ['@supabase/supabase-js'],

          // Radix UI 컴포넌트
          'radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-switch',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-tabs',
            '@radix-ui/react-slot',
          ],

          // 날짜 유틸
          'date-utils': ['date-fns'],
        },
      },
    },
  },
})
