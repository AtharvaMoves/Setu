export const setuConfig = {
  site: {
    name: "RookDuel Setu",
    shortName: "Setu",
    description:
      "An open-source, AI-ready documentation template built with Astro and Starlight.",
    url: "https://setu.rookduel.com",
    mainSiteUrl: "https://rookduel.tech",
    language: "en",
    repository: {
      url: "https://github.com/AtharvaMoves/Setu/",
      slug: "AtharvaMoves/Setu",
      branch: "main",
    },
  },
  contentMode: "hybrid" as "documentation" | "learning" | "hybrid",
  routes: {
    docs: "/docs/",
    about: "/about/",
    aiIndex: "/ai/index.json",
  },
} as const;

export type SetuConfig = typeof setuConfig;
