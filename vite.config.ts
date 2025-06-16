import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  // base: 'https://trazo.io/',
  plugins: [
    react(),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/bundle-analysis.html'
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    reporters: ['verbose'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: []
    }
  },
  optimizeDeps: {
    exclude: ['date-fns'],
    include: [
      // Pre-bundle critical dependencies for faster mobile loading
      'react',
      'react-dom',
      '@chakra-ui/react',
      '@reduxjs/toolkit/query/react'
    ]
  },
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
    // this sets a default host to "localhost"
    host: 'localhost',
    // Proxy API requests to Django backend
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  },
  build: {
    // Enhanced mobile performance optimization
    target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
    chunkSizeWarningLimit: 500, // Stricter limit for mobile
    reportCompressedSize: false, // Faster builds
    rollupOptions: {
      output: {
        // Enhanced manual chunking strategy for mobile performance
        manualChunks: (id) => {
          // CRITICAL PATH - QR Scanning Experience (highest priority)
          if (
            id.includes('src/views/Scan/ProductDetail') ||
            id.includes('src/components/CarbonScore') ||
            id.includes('src/components/BlockchainVerificationBadge') ||
            id.includes('src/store/api/carbonApi')
          ) {
            return 'qr-critical';
          }

          // CORE REACT - Required for initial render
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/scheduler')
          ) {
            return 'react-core';
          }

          // ROUTING - Needed early for navigation
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run')) {
            return 'routing';
          }

          // UI ESSENTIALS - Core UI components for QR page
          if (
            id.includes('node_modules/@chakra-ui/react') ||
            id.includes('node_modules/@chakra-ui/system') ||
            id.includes('node_modules/@emotion/react') ||
            id.includes('node_modules/@emotion/styled')
          ) {
            return 'ui-core';
          }

          // STATE MANAGEMENT - RTK Query for API calls
          if (
            id.includes('node_modules/@reduxjs/toolkit') ||
            id.includes('node_modules/react-redux') ||
            id.includes('src/store')
          ) {
            return 'state-management';
          }

          // ICONS - Split by usage frequency
          if (id.includes('node_modules/react-icons/fa')) {
            return 'icons-primary'; // FontAwesome icons (most used)
          }
          if (id.includes('node_modules/react-icons')) {
            return 'icons-secondary'; // Other icon libraries
          }

          // ANIMATIONS - Used in carbon score
          if (
            id.includes('node_modules/framer-motion') ||
            id.includes('node_modules/@emotion/css')
          ) {
            return 'animations';
          }

          // HEAVY FEATURES - Lazy loaded only when needed
          if (
            id.includes('node_modules/@react-google-maps') ||
            id.includes('node_modules/google-maps') ||
            id.includes('src/components/Map')
          ) {
            return 'maps-lazy';
          }

          // FORMS - Lazy loaded for admin/producer features
          if (
            id.includes('node_modules/react-hook-form') ||
            id.includes('node_modules/@hookform') ||
            id.includes('src/components/Forms')
          ) {
            return 'forms-lazy';
          }

          // CHARTS - Dashboard only, lazy loaded
          if (
            id.includes('node_modules/recharts') ||
            id.includes('node_modules/apexcharts') ||
            id.includes('src/components/Charts')
          ) {
            return 'charts-lazy';
          }

          // DEPRECATED FEATURES - To be removed
          if (
            id.includes('src/views/Education') ||
            id.includes('src/views/ROI') ||
            id.includes('roi') ||
            id.includes('education')
          ) {
            return 'deprecated-remove';
          }

          // ADMIN FEATURES - Heavy dashboard components
          if (id.includes('src/views/Dashboard') || id.includes('src/views/Admin')) {
            return 'admin-features';
          }

          // UTILITIES - Common helpers
          if (
            id.includes('node_modules/lodash') ||
            id.includes('node_modules/axios') ||
            id.includes('node_modules/uuid') ||
            id.includes('node_modules/date-fns')
          ) {
            return 'utils';
          }

          // UI EXTENSIONS - Additional Chakra components
          if (id.includes('node_modules/@chakra-ui')) {
            return 'ui-extended';
          }

          // REMAINING VENDOR - Everything else
          if (id.includes('node_modules')) {
            return 'vendor-misc';
          }
        },
        // Generate smaller initial bundles
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()
            : 'chunk';
          return `assets/[name]-[hash].js`;
        },
        // Better asset handling for mobile
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|ttf|eot/i.test(ext || '')) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2, // Multiple passes for better optimization
        pure_funcs: ['console.log'], // Remove console.log calls
        unsafe_arrows: true, // Convert arrow functions for smaller size
        unsafe_methods: true // Optimize method calls
      },
      mangle: {
        properties: {
          regex: /^_/ // Mangle private properties
        }
      },
      format: {
        comments: false // Remove all comments
      }
    },
    cssCodeSplit: true,
    sourcemap: false, // No sourcemaps in production for smaller size
    // Image optimization settings
    assetsInlineLimit: 4096 // Inline small assets (4KB)
  },
  resolve: {
    alias: [
      { find: 'views', replacement: resolve(__dirname, './src/views') },
      { find: 'components', replacement: resolve(__dirname, './src/components') },
      { find: 'hooks', replacement: resolve(__dirname, './src/hooks') },
      { find: 'utils', replacement: resolve(__dirname, './src/utils') },
      { find: 'assets', replacement: resolve(__dirname, './src/assets') },
      { find: 'store', replacement: resolve(__dirname, './src/store') },
      { find: 'layouts', replacement: resolve(__dirname, './src/layouts') },
      { find: 'routes.tsx', replacement: resolve(__dirname, './src/routes.tsx') },
      { find: 'variables', replacement: resolve(__dirname, './src/variables') },
      { find: 'config', replacement: resolve(__dirname, './src/config') },
      { find: 'contexts', replacement: resolve(__dirname, './src/contexts') },
      { find: 'theme', replacement: resolve(__dirname, './src/theme') },
      { find: 'i18n', replacement: resolve(__dirname, './src/i18n') },
      { find: 'services', replacement: resolve(__dirname, './src/services') }
    ]
  },
  // Enhanced mobile-specific optimizations
  esbuild: {
    // Tree shaking optimization
    treeShaking: true,
    // Optimize for mobile devices
    target: 'es2018',
    // Remove unused imports
    drop: ['console', 'debugger']
  }
});

// Helper function to check if a module exists
function checkModuleExists(moduleName: string): boolean {
  try {
    require.resolve(moduleName);
    return true;
  } catch (e) {
    return false;
  }
}
