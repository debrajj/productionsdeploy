import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: false,
  },
  preview: {
    host: "::",
    port: 4173,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    minify: 'terser',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@radix-ui/react-direction',
      '@radix-ui/react-use-layout-effect',
      '@radix-ui/react-use-controllable-state',
      '@radix-ui/react-focus-guards',
      '@radix-ui/react-use-size',
      'aria-hidden',
      'use-sidecar',
      'react-remove-scroll-bar',
      'react-style-singleton',
      'use-callback-ref'
    ],
    exclude: ['@radix-ui/react-tabs', '@radix-ui/react-select', '@radix-ui/react-scroll-area']
  },
}));
