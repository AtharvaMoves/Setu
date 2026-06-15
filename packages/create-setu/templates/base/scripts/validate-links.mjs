import { access, readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const files = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else files.push(path);
  }
}

await walk(root);
const htmlFiles = files.filter((file) => extname(file) === ".html");
const broken = new Set();

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  for (const [, href] of html.matchAll(
    /href=["']([^"'#?]+)(?:[?#][^"']*)?["']/g,
  )) {
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const target = href.endsWith("/") ? `${href}index.html` : href;
    const normalizedTarget = target.replace(/^\/+/, "");
    const candidates = [
      join(root, normalizedTarget),
      join(root, `${normalizedTarget}.html`),
      join(root, normalizedTarget, "index.html"),
    ];
    let exists = false;
    for (const candidate of candidates) {
      try {
        await access(candidate);
        exists = true;
        break;
      } catch {}
    }
    if (!exists) broken.add(`${relative(root, file)} -> ${href}`);
  }
}

if (broken.size) {
  console.error(
    `Broken internal links:\n${[...broken].map((item) => `- ${item}`).join("\n")}`,
  );
  process.exit(1);
}

console.log(`Validated internal links across ${htmlFiles.length} HTML files.`);
