---
title: Project Structure
description: Find the main content, configuration, component, route, and style locations.
sidebar:
  order: 1
---

| Path                          | Responsibility                                           |
| ----------------------------- | -------------------------------------------------------- |
| `astro.config.mjs`            | Astro, Starlight, sidebar, and integration configuration |
| `src/content/docs/docs/`      | Documentation source files                               |
| `src/content.config.ts`       | Content collection schema                                |
| `src/config/setu.ts`          | Central product, route, and repository configuration     |
| `src/components/docs/`        | Documentation interface overrides                        |
| `src/components/interactive/` | Built-in playground and quiz components                  |
| `src/components/landing/`     | Public landing page sections                             |
| `src/pages/ai/`               | AI-readable index and plain-text routes                  |
| `src/consts/site.ts`          | Shared product and repository constants                  |
| `src/styles/` and `src/*.css` | Global and feature-specific styles                       |

Keep content, product configuration, and interface code separate. That makes future upgrades and template reuse easier.
