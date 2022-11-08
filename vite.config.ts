import postcss from './postcss.config'
import copy from 'rollup-plugin-copy'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

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
  preview: {
    port: 5000,
  },
  css: {
    postcss,
  },
})
