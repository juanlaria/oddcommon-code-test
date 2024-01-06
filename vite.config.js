import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import reactSvgPlugin from 'vite-plugin-react-svg';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), reactSvgPlugin()],
  root: './src/',
  build: {
    outDir: `${path.resolve(__dirname, './dist')}`,
    emptyOutDir: true,
  },
  server: {
    host: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/scripts/components'),
      '@helpers': path.resolve(__dirname, './src/scripts/helpers'),
      '@data': path.resolve(__dirname, './src/scripts/data'),
    },
  },
});
