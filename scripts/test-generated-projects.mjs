import { exec as execCommand, execFile } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";

const exec = promisify(execFile);
const execShell = promisify(execCommand);
const root = resolve(import.meta.dirname, "..");
const cli = join(root, "packages", "create-setu", "bin", "create-setu.mjs");
const temporaryRoot = await mkdtemp(join(tmpdir(), "setu-generated-build-"));

try {
  const target = join(temporaryRoot, "complete-site");
  await exec(process.execPath, [cli, target, "--no-install"], { cwd: root });
  await execShell("npm install --no-audit --no-fund", { cwd: target });
  await execShell("npm run build", { cwd: target });
  console.log("Generated complete Setu project builds successfully.");
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
