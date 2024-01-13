import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    svgr({
      svgrOptions: {
        // svgr options
      },
    }),
  ],
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
      '@images': path.resolve(__dirname, './src/public/images'),
    },
  },
});
