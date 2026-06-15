import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(
  await readFile(resolve(root, "packages/create-setu/package.json"), "utf8"),
);
const releaseTag = process.env.GITHUB_REF_NAME;

if (releaseTag && releaseTag !== `v${manifest.version}`) {
  throw new Error(
    `Release tag ${releaseTag} does not match create-setu version v${manifest.version}.`,
  );
}

console.log(
  releaseTag
    ? `Release tag ${releaseTag} matches create-setu version.`
    : `create-setu release version is ${manifest.version}.`,
);
