import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    allowedHosts: ['spirit-above-boc-marvel.trycloudflare.com', '.trycloudflare.com'],
    watch: { 
      usePolling: true,
      interval: 100 
    },
    hmr: {
      clientPort: 5173,
      host: 'localhost',
    },
  },
});
