# RookDuel Setu

RookDuel Setu is an open-source foundation for professional documentation and learning sites. It combines polished human-facing documentation, interactive learning components, and predictable AI-readable output in one complete template.

Setu was created and is maintained by **Atharva Sen Barai**. RookDuel is his personal brand for publishing and sharing independent work.

See [AUTHORS.md](./AUTHORS.md) for project authorship and contributor attribution.

## Included

- Markdown and MDX documentation through Astro Content Collections
- Responsive Starlight navigation and search
- Custom landing page, About page, and documentation interface
- Interactive code playgrounds and knowledge-check quizzes
- Plain-text output for every page at `/ai/{document-id}.txt`
- Machine-readable document index at `/ai/index.json`
- Validation, CI, and release tooling

## Create a Project

```bash
npm create @rookduel/setu@latest my-site
cd my-site
npm run dev
```

The create command and GitHub Template both include every Setu feature.

To use the public repository directly:

```bash
git clone https://github.com/AtharvaMoves/Setu.git
cd Setu
npm install
npm run dev
```

Open `http://localhost:4321`.

## Main Routes

| Route                          | Purpose                        |
| ------------------------------ | ------------------------------ |
| `/`                            | Template landing page          |
| `/about/`                      | Project purpose and principles |
| `/docs/`                       | Documentation                  |
| `/ai/index.json`               | AI-readable document index     |
| `/ai/docs/getting-started.txt` | Example plain-text document    |

## Customize

1. Update product, repository, route, and content-mode settings in `src/config/setu.ts`.
2. Update Starlight navigation in `astro.config.mjs`.
3. Replace the starter pages in `src/content/docs/docs/`.
4. Adjust landing components in `src/components/landing/`.
5. Reuse or adapt playgrounds and quizzes from `src/components/interactive/`.
6. Run `npm run validate` before publishing.

## Commands

```bash
npm run dev             # Start the local development server
npm run build           # Build the production site
npm run preview         # Preview the production build
npm run check           # Run Astro and TypeScript checks
npm run validate        # Validate config, types, build, and internal links
npm run test:create     # Verify the complete npm create output
npm run test:generated  # Build a freshly generated project
```

## Architecture

- `src/components/` contains documentation, landing, shared, and interactive components.
- `src/config/setu.ts` is the main product and route configuration.
- `src/content/docs/docs/` contains starter documentation.
- `src/pages/ai/` serves AI-readable content.
- `packages/create-setu/` contains the npm create CLI and its generated template snapshot.

### Why Files Appear in `packages/create-setu/templates/base`

The repository root is the Setu source of truth and the complete GitHub Template. npm can only create a project from files inside the published `@rookduel/create-setu` package, so that package carries a generated snapshot under `packages/create-setu/templates/base/`.

Do not edit the snapshot directly. `npm run sync:create` rebuilds it from the root project before tests and publishing. It is a packaging artifact, not a second Setu codebase.

Maintainers can follow [PUBLISHING.md](./PUBLISHING.md).

## License

Setu is released under the MIT License.

Copyright (c) 2026 Atharva Sen Barai.
