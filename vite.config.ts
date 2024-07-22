import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      $: resolve(__dirname, "react-maptiler"),
      react: resolve("./node_modules/react"),
      "react-dom": resolve("./node_modules/react-dom"),
    },
  },
});
