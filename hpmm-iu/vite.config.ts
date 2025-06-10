import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 5173, // you can replace this port with any port
  },
/*
  resolve: {
    alias: {
      "@assets": "/src/assets",
      "@components": "/src/components",
      "@contexts": "/src/contexts",
      "@helpers": "/src/helpers",
      "@hooks": "/src/hooks",
      "@interfaces": "/src/interfaces",
      "@routes": "/src/routes",
      "@services": "/src/services",
      "@views": "/src/views",
    },
  },*/
});