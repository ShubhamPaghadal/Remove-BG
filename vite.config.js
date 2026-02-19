import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

function wasmVipsFixPlugin() {
  return {
    name: 'wasm-vips-fix',
    enforce: 'pre',
    load(id) {
      if (id.includes('@denodecom/wasm-vips') && id.endsWith('.js')) {
        let code = fs.readFileSync(id, 'utf8');

        // Use a function call instead of new URL constructor to hide from Vite's static analysis
        // And use globalThis to make it even more obscure
        const patch = `
          const _VITE_IGNORE_URL = (p, b) => new (globalThis["URL"] || URL)(p, b);
          const _VITE_IGNORE_WORKER = (p, o) => new (globalThis["Worker"] || Worker)(p, o);
        `;

        const modified = patch + code
          .replace(/new URL\(/g, '_VITE_IGNORE_URL(')
          .replace(/new Worker\(/g, '_VITE_IGNORE_WORKER(')
          .replace(/import\.meta\.url/g, '(globalThis.location ? globalThis.location.href : "file:///")');

        return modified;
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [wasmVipsFixPlugin(), react()],
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
