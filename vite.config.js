import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import process from "process";

// Sisipkan CSS hasil build ke <style> di index.html agar tidak ada stylesheet yang memblokir render.
const inlineCss = () => ({
  name: "inline-css",
  apply: "build",
  enforce: "post",
  transformIndexHtml: {
    order: "post",
    handler(html, ctx) {
      const bundle = ctx?.bundle;
      if (!bundle) return html;
      return html.replace(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g, (tag, href) => {
        const name = href.replace(/^\//, "");
        const asset = bundle[name];
        if (!asset || asset.type !== "asset") return tag;
        const css = String(asset.source).replace(/<\/style/gi, "<\\/style");
        return `<style>${css}</style>`;
      });
    },
  },
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss(), inlineCss()],
    server: { port: Number(env.APP_PORT) || 3000 },
    preview: { port: Number(env.APP_PORT) || 3000 },
    define: {
      DELCOM_BASEURL: JSON.stringify(
        env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1"
      ),
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html", "lcov"],
        include: ["src/**/*.{js,jsx,ts,tsx}"],
        exclude: ["src/main.jsx", "src/setupTests.js", "src/test-utils.jsx", "**/*.test.{js,jsx}", "node_modules/**"],
      },
    },
  };
});