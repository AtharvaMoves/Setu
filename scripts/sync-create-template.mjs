import { cp, mkdir, readdir, rename, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const createPackage = join(root, "packages", "create-setu");
const excludedTopLevel = new Set([
  ".astro",
  ".git",
  "dist",
  "node_modules",
  "packages",
]);

async function reset(path) {
  await rm(path, { recursive: true, force: true });
  await mkdir(path, { recursive: true });
}

async function syncTemplate() {
  const target = join(createPackage, "templates", "base");
  await reset(target);
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (excludedTopLevel.has(entry.name)) continue;
    await cp(join(root, entry.name), join(target, entry.name), {
      recursive: entry.isDirectory(),
    });
  }
  await rename(
    join(target, "src", "content.config.ts"),
    join(target, "src", "setu-content-config.template"),
  );
  await Promise.all([
    rm(join(target, "package-lock.json"), { force: true }),
    rm(join(target, "PUBLISHING.md"), { force: true }),
    rm(join(target, ".github", "CODEOWNERS"), { force: true }),
    rm(join(target, ".github", "workflows", "release.yml"), { force: true }),
    rm(join(target, "scripts", "sync-create-template.mjs"), { force: true }),
    rm(join(target, "scripts", "test-generated-projects.mjs"), { force: true }),
    rm(join(target, "scripts", "validate-release.mjs"), { force: true }),
  ]);
}

await Promise.all([
  syncTemplate(),
  cp(join(root, "LICENSE"), join(createPackage, "LICENSE")),
]);

console.log("Synchronized the complete create-setu template.");
