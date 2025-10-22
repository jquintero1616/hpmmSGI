import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: 5173,
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
