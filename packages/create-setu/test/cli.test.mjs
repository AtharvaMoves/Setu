import { execFile } from "node:child_process";
import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = resolve(import.meta.dirname, "..", "..", "..");
const cli = join(root, "packages", "create-setu", "bin", "create-setu.mjs");
const temporaryRoot = await mkdtemp(join(tmpdir(), "setu-create-test-"));

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

try {
  const target = join(temporaryRoot, "complete-site");
  await exec(process.execPath, [cli, target, "--no-install"], { cwd: root });

  for (const path of [
    ["src", "components", "interactive", "CodePlayground.tsx"],
    ["src", "components", "interactive", "Playground.astro"],
    ["src", "components", "interactive", "Quiz.tsx"],
    ["src", "content", "docs", "docs", "guides", "interactive-demo.mdx"],
    ["src", "content.config.ts"],
    ["src", "pages", "about.astro"],
  ]) {
    if (!(await exists(join(target, ...path))))
      throw new Error(`Generated project is missing ${path.join("/")}.`);
  }

  if (await exists(join(target, "package-lock.json")))
    throw new Error("Generated project inherited the workspace lockfile.");

  const manifest = JSON.parse(
    await readFile(join(target, "package.json"), "utf8"),
  );
  if (manifest.workspaces)
    throw new Error("Generated project inherited workspace configuration.");
  for (const script of [
    "sync:create",
    "validate:release",
    "test:create",
    "test:generated",
    "pack:check",
  ]) {
    if (manifest.scripts[script])
      throw new Error(`Generated project inherited ${script}.`);
  }

  const workflow = await readFile(
    join(target, ".github", "workflows", "build.yml"),
    "utf8",
  );
  if (workflow.includes("test:create") || workflow.includes("test:generated"))
    throw new Error("Generated project inherited workspace-only CI tests.");

  console.log("create-setu complete template passed.");
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
