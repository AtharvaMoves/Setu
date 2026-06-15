---
title: Deployment
description: Build and deploy Setu as a static site.
sidebar:
  order: 7
---

Setu builds to static files in `dist/` and works with any static hosting provider.

## Before deployment

Update `site.url` in `src/config/setu.ts`. This value controls canonical URLs, structured metadata, and sitemap generation.

Then run:

```bash
npm run validate
```

## Provider settings

| Provider         | Build command   | Output directory |
| ---------------- | --------------- | ---------------- |
| Vercel           | `npm run build` | `dist`           |
| Netlify          | `npm run build` | `dist`           |
| Cloudflare Pages | `npm run build` | `dist`           |
| GitHub Pages     | `npm run build` | `dist`           |

For a subpath deployment, configure Astro's `base` option and verify all internal links before publishing.
