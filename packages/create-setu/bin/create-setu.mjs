#!/usr/bin/env node
import {
  cp,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { spawn } from "node:child_process";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const templateRoot = join(packageRoot, "templates", "base");

function parseArgs(argv) {
  const args = { directory: "", install: true };
  for (const value of argv) {
    if (value === "--no-install") args.install = false;
    else if (value.startsWith("-"))
      throw new Error(`Unknown option "${value}". Use only --no-install.`);
    else if (!args.directory) args.directory = value;
    else throw new Error("Provide only one project directory.");
  }
  return args;
}

async function promptForDirectory(args) {
  if (args.directory) return args;
  const prompt = createInterface({ input, output });
  args.directory =
    (await prompt.question("Project directory (setu-site): ")) || "setu-site";
  prompt.close();
  return args;
}

function packageName(directory) {
  return (
    basename(resolve(directory))
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "setu-site"
  );
}

async function pathExists(path) {
  try {
    await readdir(path);
    return true;
  } catch {
    return false;
  }
}

async function configureProject(target) {
  const packagePath = join(target, "package.json");
  const manifest = JSON.parse(await readFile(packagePath, "utf8"));
  manifest.name = packageName(target);
  manifest.private = true;
  delete manifest.workspaces;
  for (const script of [
    "sync:create",
    "validate:release",
    "test:create",
    "test:generated",
    "pack:check",
  ]) {
    delete manifest.scripts[script];
  }
  await writeFile(packagePath, `${JSON.stringify(manifest, null, 2)}\n`);
  await rm(join(target, "package-lock.json"), { force: true });

  await rm(join(target, ".github", "workflows", "release.yml"), {
    force: true,
  });
  await rm(join(target, ".github", "CODEOWNERS"), { force: true });
  await rm(join(target, "scripts", "sync-create-template.mjs"), {
    force: true,
  });
  await rm(join(target, "scripts", "test-generated-projects.mjs"), {
    force: true,
  });
  await rm(join(target, "scripts", "validate-release.mjs"), {
    force: true,
  });

  const workflowPath = join(target, ".github", "workflows", "build.yml");
  const workflow = (await readFile(workflowPath, "utf8")).replace(
    /\s+- run: npm run test:(?:create|generated)\r?\n/g,
    "\n",
  );
  await writeFile(workflowPath, workflow);

  const readme = `# ${packageName(target)}

Created with the complete [RookDuel Setu](https://github.com/AtharvaMoves/Setu) template.

Setu was created by Atharva Sen Barai and is shared through RookDuel, his personal brand.

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Configuration

Update \`src/config/setu.ts\`, then replace the starter content under \`src/content/docs/docs/\`.

Playgrounds, quizzes, AI-readable output, documentation, and learning-page templates are included.

Run \`npm run validate\` before deployment.
`;
  await writeFile(join(target, "README.md"), readme);
}

async function installDependencies(target) {
  await new Promise((resolvePromise, reject) => {
    const child = spawn("npm", ["install"], {
      cwd: target,
      shell: true,
      stdio: "inherit",
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolvePromise()
        : reject(new Error(`npm install exited with code ${code}`)),
    );
  });
}

async function main() {
  const args = await promptForDirectory(parseArgs(process.argv.slice(2)));
  const target = resolve(args.directory);
  if (await pathExists(target))
    throw new Error(`Target directory already exists: ${target}`);

  await mkdir(target, { recursive: true });
  await cp(templateRoot, target, { recursive: true });
  await rename(
    join(target, "src", "setu-content-config.template"),
    join(target, "src", "content.config.ts"),
  );
  await configureProject(target);
  if (args.install) await installDependencies(target);

  console.log(
    `\nCreated ${packageName(target)} with the complete Setu template.`,
  );
  console.log(`\nNext steps:\n  cd ${args.directory}\n  npm run dev`);
}

main().catch((error) => {
  console.error(`\nSetu creation failed: ${error.message}`);
  process.exit(1);
});
