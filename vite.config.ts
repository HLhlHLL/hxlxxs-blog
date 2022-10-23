import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  css: {
    postcss: {
      plugins: []
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/style/variable.scss";`
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://p83xirby.lc-cn-n1-shared.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    open: true
  }
})
