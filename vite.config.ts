import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    // Root directory where index.html is located
    root: './',
    
    // Public base path
    base: './',
    
    // Build configuration
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      
      // Minification for production
      minify: isDev ? false : 'terser',
      
      // Source maps
      sourcemap: isDev,
      
      // Rollup options for customizing the build
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          smartFridgePlan: resolve(__dirname, 'smart-fridge-plan.html'),
          robot: resolve(__dirname, 'learning-interface-of-robot-pepper.html'),
          elearning: resolve(__dirname, 'elearning.html'),
          reinvinted: resolve(__dirname, 'reinvinted.html'),
          // Add more HTML entry points here as needed
          // about: resolve(__dirname, 'about.html'),
          // portfolio: resolve(__dirname, 'portfolio.html'),
        },
        output: {
          // Single output files for CSS and JS
          entryFileNames: 'assets/js/[name].js',
          chunkFileNames: 'assets/js/[name].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'assets/css/[name][extname]';
            }
            return 'assets/[name][extname]';
          },
          // Disable code splitting to get single files
          manualChunks: undefined,
        },
      },
      
      // Terser options for production minification
      terserOptions: {
        compress: {
          drop_console: !isDev,
          drop_debugger: !isDev,
        },
      },
    },
    
    // CSS preprocessing
    css: {
      preprocessorOptions: {
        scss: {
          // Additional SCSS options can go here
        },
      },
      devSourcemap: isDev,
    },
    
    // Resolve configuration
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@styles': resolve(__dirname, 'src/styles'),
        '@scripts': resolve(__dirname, 'src/scripts'),
      },
    },
    
    // Server configuration for development
    server: {
      port: 3000,
      open: true,
    },
    
    // Preview server configuration
    preview: {
      port: 4173,
    },
  };
});
