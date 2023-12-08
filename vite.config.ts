import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { fileURLToPath, URL } from 'url';
import { resolve } from 'path'

function loadProxy(url: URL) {
  const ret = fileURLToPath(url);
  return ret;
}

export default defineConfig({
  base: './',
  plugins: [solid()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: loadProxy(
          new URL('./src', import.meta.url)
        )
      },
    ],
  },
});
