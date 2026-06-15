# Contributing to RookDuel Setu

Setu was created by Atharva Sen Barai and is shared through RookDuel, his personal brand.

## Local setup

```bash
npm install
npm run dev
```

## Documentation changes

- Place documentation under `src/content/docs/docs/`.
- Use Markdown by default and MDX only when an interactive component is required.
- Include a clear `title` and `description` in frontmatter.
- Keep examples generic so the repository remains useful as a template.
- Verify that both the human page and its `/ai/...txt` output remain readable.

## Code changes

- Keep changes focused and consistent with existing Astro, React, and Starlight patterns.
- Keep reusable feature code inside the appropriate `src/components/` or `src/styles/` directory.
- Do not add generated content or copied third-party documentation.
- Run `npm run validate` before opening a pull request.

## Pull requests

Explain the problem, the chosen approach, and the validation performed. Include screenshots for visible interface changes.
