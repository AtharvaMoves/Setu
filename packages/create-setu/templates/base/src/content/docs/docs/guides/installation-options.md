---
title: Installation Options
description: Start with the complete Setu template through GitHub or npm.
sidebar:
  order: 1
---

Setu has one complete feature set. Both installation methods include documentation, learning templates, AI-readable output, playgrounds, quizzes, and the public pages.

## npm create

Use the create command for a clean project without repository-maintainer release tooling:

```bash
npm create @rookduel/setu@latest my-site
cd my-site
npm run dev
```

Use `--no-install` when another tool will install dependencies:

```bash
npm create @rookduel/setu@latest my-site -- --no-install
```

## GitHub Template

Use the GitHub Template when you want to start directly from the public repository:

```bash
git clone https://github.com/AtharvaMoves/Setu.git
cd Setu
npm install
npm run dev
```

The repository also includes the create-package synchronization, generated-project tests, and npm release workflow used by Setu maintainers.
