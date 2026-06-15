---
title: AI-readable Output
description: Understand how Setu exposes documentation as plain text for AI systems.
sidebar:
  order: 3
---

Setu publishes a clean text representation of every documentation page. The same source content can therefore serve readers, search systems, assistants, and retrieval pipelines.

## Discover pages

Request:

```text
/ai/index.json
```

The response contains each document title, description, order, and plain-text URL.

## Read a page

A content ID becomes a matching text route:

```text
Human: /docs/getting-started/
AI:    /ai/docs/getting-started.txt
```

The route removes frontmatter and interface-only MDX while preserving headings, prose, lists, and code blocks.

## Important boundary

These endpoints improve discoverability and parsing. They do not grant permission to reuse private or copyrighted content. Only publish material you are authorized to distribute.
