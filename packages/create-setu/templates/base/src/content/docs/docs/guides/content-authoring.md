---
title: Content Authoring
description: Write clear Markdown documentation and organize it in Setu.
sidebar:
  order: 2
---

Documentation files live in `src/content/docs/docs/`. Folder and file names determine their URLs.

```text
src/content/docs/docs/
|-- index.md
|-- getting-started/
|   `-- index.md
`-- guides/
    `-- content-authoring.md
```

## Frontmatter

Every page should begin with a clear title and description:

```yaml
---
title: Configure Authentication
description: Connect an identity provider and protect private routes.
sidebar:
  order: 2
---
```

The description is used in page metadata and the AI-readable index.

## Markdown or MDX

Use `.md` for standard documentation. Use `.mdx` only when a page needs imported components or JSX.

Keep headings descriptive, introduce code before showing it, and prefer focused pages over long reference dumps.

:::tip
Use MDX when a page needs reusable playgrounds or knowledge-check quizzes.
:::
