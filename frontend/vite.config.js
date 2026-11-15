import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ProBiz ERP frontend — Vite build (migrated from Create React App).
// The app keeps using `process.env.REACT_APP_API_URL`, so the existing
// deploy configs (Docker, Railway, Vercel, GitHub Actions) that inject
// that build arg keep working unchanged — it is defined below.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // expose on the LAN for start-local-network.bat / multi-branch use
  },
  preview: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
  },
  define: {
    'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || ''),
  },
  // The codebase keeps JSX in .js files (CRA convention); teach esbuild to
  // parse them as JSX, both for app sources and dependency pre-bundling.
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
});
