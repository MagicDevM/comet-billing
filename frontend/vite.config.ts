import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate manifest for debugging
    manifest: true,
    
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      
      output: {
        // Ensure assets use file extension
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') ?? ['others'];
          const extension = info[info.length - 1]
          
          return `assets/${extension}/[name]-[hash][extname]`
        },
        
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './src')
    }
  }
})
