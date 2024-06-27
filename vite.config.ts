import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import KumaUI from '@kuma-ui/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    basicSsl(),
    react(),
    KumaUI(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/tesseract-wasm/dist/tesseract-core.wasm',
          dest: './assets',
        },
      ],
    }),
  ],
  optimizeDeps: {
    exclude: ['tesseract-wasm'],
  },
});
