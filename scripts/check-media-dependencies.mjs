import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = getArg('--base-url');
const HTML_FILES = await getHtmlFiles();
const failures = [];
const assetPaths = new Set();
const cssQueue = [];
const visitedCss = new Set();

for (const htmlPath of HTML_FILES) await scanHtml(htmlPath);
while (cssQueue.length > 0) await scanCss(cssQueue.shift());
await checkLocalAssets();
if (BASE_URL) await checkPublicAssets(BASE_URL);

if (failures.length > 0) {
  console.error(JSON.stringify({ failures }, null, 2));
  process.exit(1);
}

const assets = [...assetPaths].sort();
console.log(`media_dependencies_ok html=${HTML_FILES.length} css=${visitedCss.size} assets=${assets.length}`);
for (const asset of assets) console.log(asset);

async function getHtmlFiles() {
  const rootEntries = await fs.readdir(ROOT, { withFileTypes: true });
  const rootHtml = rootEntries
    .filter(entry => entry.isFile() && entry.name.endsWith('.html'))
    .map(entry => entry.name);
  return [...rootHtml, 'coach/index.html'];
}

async function scanHtml(relativePath) {
  const source = await fs.readFile(path.join(ROOT, relativePath), 'utf8');
  const baseDirectory = path.posix.dirname(relativePath.replaceAll('\\', '/'));
  for (const href of matches(source, /<link\b[^>]*\brel=["'][^"']*stylesheet[^"']*["'][^>]*\bhref=["']([^"']+)["']/gi)) {
    const cssPath = resolveLocalPath(baseDirectory, href);
    if (cssPath) cssQueue.push(cssPath);
  }
  for (const href of matches(source, /<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["'][^"']*stylesheet[^"']*["']/gi)) {
    const cssPath = resolveLocalPath(baseDirectory, href);
    if (cssPath) cssQueue.push(cssPath);
  }
  for (const value of matches(source, /\b(?:src|poster)=["']([^"']+)["']/gi)) addAsset(baseDirectory, value);
  for (const value of matches(source, /\bsrcset=["']([^"']+)["']/gi)) {
    for (const candidate of value.split(',')) addAsset(baseDirectory, candidate.trim().split(/\s+/)[0]);
  }
}

async function scanCss(relativePath) {
  if (!relativePath || visitedCss.has(relativePath)) return;
  visitedCss.add(relativePath);
  const absolutePath = path.join(ROOT, relativePath);
  const source = await fs.readFile(absolutePath, 'utf8').catch(() => null);
  if (source === null) {
    failures.push(`${relativePath}: linked stylesheet is missing locally`);
    return;
  }
  const baseDirectory = path.posix.dirname(relativePath);
  for (const value of matches(source, /@import\s+(?:url\()?\s*["']([^"']+)["']/gi)) {
    const importPath = resolveLocalPath(baseDirectory, value);
    if (importPath) cssQueue.push(importPath);
  }
  for (const value of matches(source, /url\(\s*["']?([^"')]+)["']?\s*\)/gi)) addAsset(baseDirectory, value);
}

function addAsset(baseDirectory, value) {
  const assetPath = resolveLocalPath(baseDirectory, value);
  if (assetPath) assetPaths.add(assetPath);
}

function resolveLocalPath(baseDirectory, rawValue) {
  const value = rawValue.trim();
  if (!value || /^(?:data:|https?:|blob:|#|\/\/)/i.test(value)) return null;
  const withoutSuffix = value.split(/[?#]/, 1)[0];
  const normalized = withoutSuffix.startsWith('/')
    ? path.posix.normalize(withoutSuffix.slice(1))
    : path.posix.normalize(path.posix.join(baseDirectory, withoutSuffix));
  if (normalized.startsWith('../') || path.posix.isAbsolute(normalized)) {
    failures.push(`${rawValue}: resolves outside the site root`);
    return null;
  }
  return normalized;
}

async function checkLocalAssets() {
  for (const assetPath of assetPaths) {
    const stat = await fs.stat(path.join(ROOT, assetPath)).catch(() => null);
    if (!stat?.isFile()) failures.push(`${assetPath}: referenced asset is missing locally`);
  }
}

async function checkPublicAssets(baseUrl) {
  for (const assetPath of assetPaths) {
    const url = new URL(assetPath, ensureTrailingSlash(baseUrl));
    const response = await fetch(url, { headers: { 'user-agent': 'BUFF-IT-release-check/1.0' } }).catch(error => ({ error }));
    if ('error' in response) {
      failures.push(`${assetPath}: public fetch failed: ${response.error.message}`);
      continue;
    }
    if (!response.ok) failures.push(`${assetPath}: public status ${response.status}`);
  }
}

function matches(source, expression) {
  return [...source.matchAll(expression)].map(match => match[1]);
}

function getArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function ensureTrailingSlash(value) {
  return value.endsWith('/') ? value : `${value}/`;
}
