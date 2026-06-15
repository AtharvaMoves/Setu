---
title: Customization
description: Adapt Setu's identity, navigation, landing page, documentation interface, and interactive features.
sidebar:
  order: 4
---

## Product Identity

Update `src/config/setu.ts` to change shared names, URLs, repository settings, routes, and content mode. Update `astro.config.mjs` when changing Starlight-specific navigation.

## Navigation

The documentation sidebar is defined in `astro.config.mjs`. You can add explicit links or autogenerate groups from content directories.

The public landing navigation lives in `src/components/landing/Header.tsx`. The documentation header lives in `src/components/docs/Header.astro`.

## Visual Design

The main style files are:

- `src/tailwind.css`
- `src/starlight-overrides.css`
- `src/styles/playground.css`
- `src/styles/quiz.css`

Keep brand changes centralized and verify both light and dark themes.

## Interactive Components

Playgrounds and quizzes live in `src/components/interactive/`. Reuse them from MDX pages, adapt their behavior, or remove individual usages that your project does not need.
