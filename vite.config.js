import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: [
      '@denodecom/wasm-vips',
      '@denodecom/wasm-vips/nosimd',
      '@denodecom/wasm-vips/lowmem',
      '@denodecom/wasm-vips/nosimd/lowmem',
    ],
  },
  build: {
    chunkSizeWarningLimit: 10000,
    target: 'esnext',
  },
})
