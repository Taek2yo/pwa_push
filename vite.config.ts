import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        icons: [
          {
            src: "/icon-192.png",
            type: "image/png",
            sizes: "192x192",
          },

          {
            src: "/icon-512.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
      },
    }),
  ],
});
