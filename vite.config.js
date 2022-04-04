import { defineConfig } from 'vite';

const { resolve } = require('path');

export default defineConfig({
  base: '/fisheye/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, './src/pages/photographer.html'),
      },
    },
  },
});
