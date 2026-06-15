---
title: Interactive Features
description: Use Setu's built-in playground and quiz components in MDX pages.
sidebar:
  order: 5
---

Setu includes interactive components alongside its documentation foundation:

- Executable code playgrounds
- HTML and CSS split playgrounds
- Knowledge-check quizzes

The reusable source lives under `src/components/interactive/`, and its styles live under `src/styles/`.

Open the [interactive features demo](./interactive-demo/) to use the real components and see their complete MDX connections.

## Usage Principles

Use interaction where it improves understanding. Keep surrounding explanation available as normal written content so the page remains useful before hydration and through Setu's AI-readable output.

React components require an Astro `client:*` directive. The Astro playground renders directly without one.
