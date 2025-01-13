import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // base: 'https://trazo.io/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    reporters: ['verbose'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: []
    }
  },
  optimizeDeps: {
    exclude: ['date-fns']
  },
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
    // this sets a default host to "localhost"
    host: 'localhost',
    base: 'https://app.trazo.io/'
  },
  resolve: {
    alias: [
      { find: 'views', replacement: resolve(__dirname, './src/views') },
      { find: 'components', replacement: resolve(__dirname, './src/components') },
      { find: 'utils', replacement: resolve(__dirname, './src/utils') },
      { find: 'assets', replacement: resolve(__dirname, './src/assets') },
      { find: 'store', replacement: resolve(__dirname, './src/store') },
      { find: 'layouts', replacement: resolve(__dirname, './src/layouts') },
      { find: 'routes.tsx', replacement: resolve(__dirname, './src/routes.tsx') },
      { find: 'variables', replacement: resolve(__dirname, './src/variables') },
      { find: 'config', replacement: resolve(__dirname, './src/config') },
      { find: 'contexts', replacement: resolve(__dirname, './src/contexts') },
      { find: 'theme', replacement: resolve(__dirname, './src/theme') },
      { find: 'i18n', replacement: resolve(__dirname, './src/i18n') }
    ]
  }
});
