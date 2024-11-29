import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.dxf"],
  build: {
    rollupOptions: {
      input: {
        mainViewer: "./src/DxfViewer/MainViewer.js",
      },
      output: {
        entryFileNames: "assets/[name].js",
        format: "es",
      },
    },
  },
});
