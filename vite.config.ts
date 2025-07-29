import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2015',
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-select', '@radix-ui/react-dialog', '@radix-ui/react-toast'],
          charts: ['recharts'],
          // Utility chunks
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
          icons: ['lucide-react'],
        }
      }
    },
  },
});
