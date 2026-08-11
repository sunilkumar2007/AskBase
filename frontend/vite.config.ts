import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react()
  ],
  resolve: {
    alias: {
      '@/components/auth': path.resolve(__dirname, './src/features/auth'),
      '@/components/landing': path.resolve(__dirname, './src/features/home'),
      '@/components/charts': path.resolve(__dirname, './src/features/charts'),
      '@/components/diagrams': path.resolve(__dirname, './src/features/reports/diagrams'),
      '@/components/reports': path.resolve(__dirname, './src/features/reports'),
      '@/components/data': path.resolve(__dirname, './src/components/ui/data'),
      '@/components/ai': path.resolve(__dirname, './src/features/chat/components/ai'),
      '@/components/chat': path.resolve(__dirname, './src/features/chat/components'),
      '@/components/layout': path.resolve(__dirname, './src/components/layouts'),
      '@/lib/mock-data': path.resolve(__dirname, './src/services/mock/index.ts'),
      '@/lib/utils': path.resolve(__dirname, './src/utils/cn.ts'),
      '@': path.resolve(__dirname, './src'),
    },
  },
})
