# Publishing Setu

Setu is distributed in two equivalent ways:

- The public GitHub Template repository contains the complete source and maintainer tooling.
- `@rookduel/create-setu` creates a complete user project from a synchronized template snapshot.

Setu is created and maintained by Atharva Sen Barai. RookDuel is his personal brand; the npm `@rookduel` organization is used as the package namespace.

## One-Time Setup

1. Push this workspace to the public `AtharvaMoves/Setu` GitHub repository.
2. In GitHub, open **Settings > General** and enable **Template repository**.
3. Create or confirm the `rookduel` organization on npm.
4. Confirm the create-package name is available:

   ```bash
   npm view @rookduel/create-setu
   ```

## Publish the First Version

1. Update `packages/create-setu/package.json` and `CHANGELOG.md`.
2. Install and validate:

   ```bash
   npm ci
   npm run validate
   npm run validate:release
   npm run test:create
   npm run test:generated
   npm run pack:check
   ```

3. Log in with an npm account that owns the `@rookduel` scope and has 2FA enabled:

   ```bash
   npm login
   ```

4. Publish:

   ```bash
   npm publish --workspace @rookduel/create-setu --access public
   ```

5. On npm, configure a trusted publisher:
   - Organization or user: `AtharvaMoves`
   - Repository: `Setu`
   - Workflow filename: `release.yml`
   - Allowed action: `npm publish`
   - Environment: leave empty unless the workflow uses one
6. Commit and push the release state, then create a GitHub release whose tag matches the package version, such as `v0.1.0`.

Publishing a GitHub release starts `.github/workflows/release.yml`. The workflow validates Setu and publishes the create package only when that version does not already exist.

## Manual Publish Fallback

```bash
npm login
npm publish --workspace @rookduel/create-setu --access public
```

## Verify a Published Release

Run outside the Setu repository:

```bash
npm create @rookduel/setu@latest setu-site
cd setu-site
npm run build
```

Also create a repository using GitHub's **Use this template** button and follow `TEMPLATE_SETUP.md`.
