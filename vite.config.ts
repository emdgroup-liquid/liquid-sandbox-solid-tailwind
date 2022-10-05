import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import copy from 'rollup-plugin-copy'

export default defineConfig({
  plugins: [
    solidPlugin(),
    copy({
      targets: [
        {
          src: 'node_modules/@emdgroup-liquid/liquid/dist/liquid/assets/*',
          dest: 'public/assets',
        },
      ],
      hook: 'buildStart',
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
})
