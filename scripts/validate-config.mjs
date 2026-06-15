import { setuConfig } from "../src/config/setu.ts";

const errors = [];
const { site, routes } = setuConfig;
const contentModes = new Set(["documentation", "learning", "hybrid"]);

if (!site.name.trim()) errors.push("site.name must not be empty");
if (!site.description.trim()) errors.push("site.description must not be empty");
if (!contentModes.has(setuConfig.contentMode))
  errors.push("contentMode must be documentation, learning, or hybrid");

for (const [label, value] of [
  ["site.url", site.url],
  ["site.mainSiteUrl", site.mainSiteUrl],
  ["site.repository.url", site.repository.url],
]) {
  try {
    new URL(value);
  } catch {
    errors.push(`${label} must be an absolute URL`);
  }
}

for (const [label, value] of Object.entries(routes)) {
  if (!value.startsWith("/")) errors.push(`routes.${label} must begin with /`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log("Setu configuration is valid.");
