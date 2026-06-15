---
title: Welcome to Setu
description: Understand the documentation template, its structure, and the features included by default.
sidebar:
  order: 1
---

RookDuel Setu is a documentation foundation for projects that need polished pages for people and predictable text output for AI systems.

It uses Astro for the site, Starlight for documentation features, and Markdown or MDX as the content source.

Setu was created by Atharva Sen Barai and is published through RookDuel, his personal brand.

## What is included

- A responsive documentation interface with navigation, search, and theme support
- A custom landing page that can introduce your product or project
- Markdown and MDX content collections with validated frontmatter
- Built-in playgrounds and knowledge-check quizzes for MDX pages
- A plain-text endpoint for each documentation page
- A JSON index that lets automated systems discover those endpoints

## How content flows

1. You write a Markdown or MDX file in `src/content/docs/docs/`.
2. Starlight renders it as a human-facing page under `/docs/`.
3. Setu strips interface-only MDX and exposes the useful text under `/ai/`.
4. `/ai/index.json` lists every available AI-readable page.

Start with [Getting Started](/docs/getting-started/) to run and rename the template.
