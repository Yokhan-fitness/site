import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  extractCanonicalHeader,
  loadRegistry,
  validateCanonicalHeader,
  validateRegistry,
} from "./site-header-contract.mjs";
import { preparePublicPresentation } from "./public-presentation.mjs";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("ecosystem registry has the required app identities and current hosts", () => {
  const registry = loadRegistry(repo);
  const ids = new Set(registry.apps.map((app) => app.id));
  for (const id of ["public", "app", "calls", "auth", "guide", "programs", "coaching", "method", "start", "safety", "ecosystem", "portfolio", "kitchen", "guest", "telegram"]) {
    assert(ids.has(id), `missing app ${id}`);
  }
  assert.equal(registry.header.public.account.entryId, "app");
  assert.match(registry.header.public.account.loginHref, /returnTo=%2Fhome/);
  assert.doesNotMatch(JSON.stringify(registry), /yokhanfitness\.ru/i);
});

test("canonical public header only links to registered external hosts", () => {
  const registry = loadRegistry(repo);
  const header = extractCanonicalHeader(fs.readFileSync(path.join(repo, "index.html"), "utf8"));
  const result = validateCanonicalHeader(header, registry);
  assert(result.external.length > 0);
  for (const href of result.external) {
    assert.match(href, /^https:\/\//);
  }
});

test("an unregistered external host is refused before public injection", () => {
  const registry = loadRegistry(repo);
  const header = '<nav class="nav"><a href="https://unknown.example/">bad</a></nav>';
  assert.throws(() => validateCanonicalHeader(header, registry), /unregistered host/);
});

test("an unregistered path on a registered host is refused", () => {
  const registry = loadRegistry(repo);
  const header = '<nav class="nav"><a href="https://fitness.yokhan.xyz/not-registered">bad</a></nav>';
  assert.throws(() => validateCanonicalHeader(header, registry), /URL is not registered/);
});

test("public presentation injects the canonical header and drops the old one", () => {
  const page = "<!doctype html><html><head></head><body><nav class=\"nav\"><a href=\"/old\">old</a></nav></body></html>";
  const output = preparePublicPresentation(page, "ecosystem.html", repo);
  assert(output.includes('aria-label="Основная навигация"'));
  assert(!output.includes('href="/old"'));
  assert(output.includes('src="/js/public-account.js"'));
});

test("contract document points at the registry and same-origin session", () => {
  const contract = JSON.parse(fs.readFileSync(path.join(repo, "contracts", "site-header.contract.json"), "utf8"));
  assert.equal(contract.sources.apps, "data/ecosystem.apps.json");
  assert.equal(contract.session.path, "/api/session");
  assert.equal(contract.session.cache, "no-store");
  assert.deepEqual(contract.surfaces, ["public", "app", "calls"]);
  validateRegistry(loadRegistry(repo));
});
