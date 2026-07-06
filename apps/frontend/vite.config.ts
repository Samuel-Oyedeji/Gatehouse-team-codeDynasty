import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  ssr: {
    // Radix UI pulls in tslib at runtime; bundle it so Vercel functions don't miss traced deps.
    noExternal: ["tslib", /^@radix-ui\//],
  },
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
      server: { entry: "server" },
    }),
    nitro({
      preset: "vercel",
      vercel: { entryFormat: "node" },
      traceDeps: ["tslib"],
    }),
    viteReact(),
  ],
});
