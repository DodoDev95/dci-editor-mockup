import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.dxf"],
  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "./src/api/*"),
      "@types": path.resolve(__dirname, "./src/Types/types.ts"),
      "@assets": path.resolve(__dirname, "./src/assets/*"),
      "@store": path.resolve(__dirname, "./src/api/store.ts"),
    },
  },
});
