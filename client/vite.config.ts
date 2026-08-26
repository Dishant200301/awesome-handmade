import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    host: true,
    watch: {
      ignored: ["**/public/images/**"],
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/admin": {
        target: "http://localhost:5174",
        changeOrigin: true,
        ws: true,
      },
    },

  },
  plugins: [
    react(),
    tsconfigPaths(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
