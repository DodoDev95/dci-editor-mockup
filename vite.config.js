import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.dxf"],
  resolve: {
    alias: {
      "@Types": path.resolve(__dirname, "Types/types.ts"),
      "@assets": path.resolve(__dirname, "assets"),
    },
  },
});
