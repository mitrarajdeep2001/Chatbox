import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import {nodePolyfills} from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0", // Bind to all available network interfaces
    // port: 3000, // Optional: Specify a custom port
  },
  plugins: [react(), nodePolyfills()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
