import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { greenApiDevProxyPlugin } from "./vite.greenApiProxy";

export default defineConfig({
  plugins: [react(), greenApiDevProxyPlugin()],
});
