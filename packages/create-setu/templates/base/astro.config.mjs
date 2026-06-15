// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { setuConfig } from "./src/config/setu.ts";

// https://astro.build/config
export default defineConfig({
  site: setuConfig.site.url,
  integrations: [
    starlight({
      title: setuConfig.site.name,
      description: setuConfig.site.description,
      customCss: [
        "./src/tailwind.css",
        "./src/starlight-overrides.css",
        "./src/styles/playground.css",
        "./src/styles/quiz.css",
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: setuConfig.site.repository.url,
        },
      ],
      editLink: {
        baseUrl: `${setuConfig.site.repository.url}edit/${setuConfig.site.repository.branch}/`,
      },
      lastUpdated: true,
      components: {
        Header: "./src/components/docs/Header.astro",
        Sidebar: "./src/components/docs/Sidebar.astro",
      },
      sidebar: [
        {
          label: "Overview",
          items: [{ label: "Welcome", slug: "docs" }],
        },
        {
          label: "Getting Started",
          autogenerate: { directory: "docs/getting-started" },
        },
        {
          label: "Guides",
          autogenerate: { directory: "docs/guides" },
        },
        {
          label: "Templates",
          autogenerate: { directory: "docs/templates" },
        },
        {
          label: "Reference",
          autogenerate: { directory: "docs/reference" },
        },
      ],
    }),
    react(),
  ],

  prefetch: true,
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "@monaco-editor/react",
        "highlight.js/lib/core",
        "highlight.js/lib/languages/xml",
        "highlight.js/lib/languages/css",
        "highlight.js/lib/languages/javascript",
      ],
    },
  },
});
