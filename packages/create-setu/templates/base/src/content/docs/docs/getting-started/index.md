---
title: Getting Started
description: Install, run, rename, and prepare Setu for your documentation.
sidebar:
  order: 1
---

## Requirements

- Node.js 20 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Astro prints the local URL, usually `http://localhost:4321`.

## Rename the template

Update these locations first:

- `src/consts/site.ts` for reusable product and repository values
- `astro.config.mjs` for the Starlight title, social links, edit link, and sidebar
- `src/components/landing/` for the public landing page
- `README.md` and `LICENSE` for repository information

## Replace starter content

Remove or rewrite the pages inside `src/content/docs/docs/`. Keep the `docs` folder if you want documentation URLs to continue using `/docs/`.

## Verify the result

```bash
npm run build
```

The build validates content frontmatter, page routes, and generated AI endpoints.
