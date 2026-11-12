import fs from "node:fs";
import path from "node:path";

const REQUIRED_APPS = ["public", "app", "calls", "auth", "guide", "programs", "coaching", "method", "start", "safety", "ecosystem", "portfolio", "kitchen", "guest", "telegram"];
const REQUIRED_SURFACES = ["public", "app", "calls"];
const STALE_HOST = /(?:^|\.)yokhanfitness\.ru$/i;

function parseHttpsUrl(value, label) {
  if (typeof value !== "string" || !value) throw new Error(`ecosystem.apps.json: ${label} must be an https URL`);
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`ecosystem.apps.json: ${label} is not a valid URL`);
  }
  if (url.protocol !== "https:") throw new Error(`ecosystem.apps.json: ${label} must use https`);
  return url;
}

export function loadRegistry(repo) {
  const file = path.join(repo, "data", "ecosystem.apps.json");
  const registry = JSON.parse(fs.readFileSync(file, "utf8"));
  validateRegistry(registry);
  return registry;
}

export function validateRegistry(registry) {
  if (!registry || registry.schemaVersion !== 1) throw new Error("ecosystem.apps.json: schemaVersion must be 1");
  if (!Array.isArray(registry.apps) || registry.apps.length === 0) throw new Error("ecosystem.apps.json: apps must be a non-empty array");
  if (!registry.header || !registry.header.public) throw new Error("ecosystem.apps.json: header.public is required");

  const ids = new Set();
  const hosts = new Set();
  for (const app of registry.apps) {
    if (!app || typeof app.id !== "string" || !/^[a-z0-9-]+$/.test(app.id)) throw new Error("ecosystem.apps.json: invalid app id");
    if (ids.has(app.id)) throw new Error(`ecosystem.apps.json: duplicate app id ${app.id}`);
    ids.add(app.id);
    if (typeof app.label !== "string" || !app.label.trim()) throw new Error(`ecosystem.apps.json: ${app.id} has no label`);
    const url = parseHttpsUrl(app.href, app.id);
    hosts.add(url.hostname.toLowerCase());
    if (!Array.isArray(app.surfaces) || app.surfaces.length === 0) throw new Error(`ecosystem.apps.json: ${app.id} has no surfaces`);
    for (const surface of app.surfaces) {
      if (!REQUIRED_SURFACES.includes(surface)) throw new Error(`ecosystem.apps.json: ${app.id} has unknown surface ${surface}`);
    }
    for (const key of ["loginHref", "accountHref", "logoutHref"]) {
      if (app[key] !== undefined) parseHttpsUrl(app[key], `${app.id}.${key}`);
    }
  }

  for (const id of REQUIRED_APPS) {
    if (!ids.has(id)) throw new Error(`ecosystem.apps.json: required app ${id} is missing`);
  }

  const publicHeader = registry.header.public;
  parseHttpsUrl(publicHeader.brandHref, "header.public.brandHref");
  if (!publicHeader.account || publicHeader.account.entryId !== "app") throw new Error("ecosystem.apps.json: header.public.account.entryId must be app");
  parseHttpsUrl(publicHeader.account.loginHref, "header.public.account.loginHref");
  parseHttpsUrl(publicHeader.account.accountHref, "header.public.account.accountHref");
  if (!publicHeader.account.loginHref.includes("returnTo=%2Fhome")) throw new Error("ecosystem.apps.json: public login must return to %2Fhome");

  if (!Array.isArray(publicHeader.groups) || publicHeader.groups.length === 0) throw new Error("ecosystem.apps.json: header.public.groups is required");
  for (const group of publicHeader.groups) {
    if (!group || typeof group.id !== "string" || !group.id) throw new Error("ecosystem.apps.json: invalid header group");
    if (!Array.isArray(group.links) || group.links.length === 0) throw new Error(`ecosystem.apps.json: group ${group.id} has no links`);
    for (const id of group.links) {
      if (!ids.has(id)) throw new Error(`ecosystem.apps.json: group ${group.id} references unknown app ${id}`);
    }
  }

  if (!registry.returnTo || !Array.isArray(registry.returnTo.allowedOrigins)) throw new Error("ecosystem.apps.json: returnTo.allowedOrigins is required");
  for (const origin of registry.returnTo.allowedOrigins) {
    const url = parseHttpsUrl(origin, "returnTo.allowedOrigins");
    if (url.origin !== origin.replace(/\/$/, "")) throw new Error(`ecosystem.apps.json: returnTo origin must be a bare origin: ${origin}`);
    hosts.add(url.hostname.toLowerCase());
  }

  for (const host of hosts) {
    if (STALE_HOST.test(host)) throw new Error(`ecosystem.apps.json: stale host ${host}`);
  }

  return { ids, hosts, registry };
}

export function extractCanonicalHeader(html) {
  const header = html.match(/<nav\b[^>]*class="nav\b[\s\S]*?<\/nav>/i)?.[0];
  if (!header) throw new Error("Canonical homepage header is missing");
  return header;
}

function urlKey(value) {
  const url = new URL(value);
  const pathname = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
  return `${url.hostname.toLowerCase()}${pathname}`;
}

export function validateCanonicalHeader(header, registry) {
  const validation = validateRegistry(registry);
  const allowed = new Set();
  const prefixes = new Set();
  for (const app of registry.apps) {
    for (const value of [app.href, app.loginHref, app.accountHref, app.logoutHref]) {
      if (value) allowed.add(urlKey(value));
    }
    if (app.id === "portfolio") prefixes.add(`${new URL(app.href).hostname.toLowerCase()}/projects/`);
  }
  const hrefs = [...header.matchAll(/\bhref="([^"]+)"/gi)].map((match) => match[1].replaceAll("&amp;", "&"));
  const external = [];
  const headerKeys = new Set();
  for (const href of hrefs) {
    if (!/^https?:\/\//i.test(href)) {
      if (href.startsWith("//") || href.startsWith("#") || /^(?:mailto|tel|javascript):/i.test(href)) continue;
      headerKeys.add(urlKey(new URL(href, `${registry.publicOrigin}/`).href));
      continue;
    }
    let url;
    try {
      url = new URL(href);
    } catch {
      throw new Error(`Canonical header has an invalid URL: ${href}`);
    }
    if (url.protocol !== "https:") throw new Error(`Canonical header must use https: ${href}`);
    const host = url.hostname.toLowerCase();
    if (!validation.hosts.has(host)) throw new Error(`Canonical header links to an unregistered host: ${host} (${href})`);
    const key = urlKey(href);
    if (!allowed.has(key) && ![...prefixes].some((prefix) => key.startsWith(prefix))) {
      throw new Error(`Canonical header URL is not registered: ${href}`);
    }
    headerKeys.add(key);
    external.push(href);
  }

  for (const group of registry.header.public.groups) {
    for (const id of group.links) {
      const app = registry.apps.find((item) => item.id === id);
      const keys = [app.href, app.loginHref, app.accountHref, app.logoutHref].filter(Boolean).map(urlKey);
      if (!keys.some((key) => headerKeys.has(key))) {
        throw new Error(`Canonical header does not expose registered app ${id} from group ${group.id}`);
      }
    }
  }

  return { hrefs, external, hosts: validation.hosts };
}
