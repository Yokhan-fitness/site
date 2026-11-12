import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const manifest = readJson("contracts/landing-component-manifest.json");
const html = readdirSync(root)
  .filter((name) => name.endsWith(".html"))
  .map((name) => readFileSync(join(root, name), "utf8"))
  .join("\n");
const ownedSelectors = new Set(manifest.components.flatMap((component) => component.selectors));
const failures = [];

for (const selector of manifest.coveragePolicy.requiredSelectors) {
  const className = selector.slice(1);
  if (!hasClass(html, className)) failures.push(`declared selector is absent from landing HTML: ${selector}`);
  if (!ownedSelectors.has(selector)) failures.push(`landing selector has no design-system owner: ${selector}`);
}

for (const component of manifest.components) {
  const usedSelectors = component.selectors.filter((selector) => hasClass(html, selector.slice(1)));
  if (usedSelectors.length === 0) failures.push(`${component.id}: no mapped selector is used by landing HTML`);
}

if (failures.length > 0) {
  console.error(["BUFF IT landing component coverage failed:", ...failures].join("\n"));
  process.exit(1);
}

console.log(`buffit_landing_component_coverage_ok components=${manifest.components.length} required=${manifest.coveragePolicy.requiredSelectors.length}`);

function hasClass(source, className) {
  const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`class=[\"'][^\"']*\\b${escaped}\\b`).test(source);
}

function readJson(path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}
