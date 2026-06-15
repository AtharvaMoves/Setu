---
title: Configuration
description: Reference Setu's central product, route, repository, and content settings.
sidebar:
  order: 2
---

`src/config/setu.ts` is the primary configuration file.

## Site

The `site` section controls the public name, description, canonical production URL, related main-site URL, language, and repository metadata.

## Routes

The `routes` section provides shared URLs used by landing and documentation navigation.

## Content Mode

Set `contentMode` to `documentation`, `learning`, or `hybrid` to declare the intended project experience.

After changing configuration, run:

```bash
npm run validate:config
```

Content frontmatter can also declare `contentType`, `audience`, `version`, and `status`. These fields are included in the AI-readable index.
