import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const repo = path.resolve(import.meta.dirname, '..');
const output = path.resolve(process.argv[2] ?? '');
const expectedOutput = path.resolve('C:/Users/iohan/Documents/Codex/2026-07-18/personalassistant-system-work-handoff/outputs/stockholm-preview-20261009-r1/landing-r2');
if (!process.argv[2] || output.toLowerCase() !== expectedOutput.toLowerCase()) {
  throw new Error(`Pass the exact artifact output directory ${expectedOutput}`);
}
if (fs.existsSync(output) && fs.readdirSync(output).length) fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
const site = path.join(output, 'site');
fs.mkdirSync(site, { recursive: true });

const pageNames = fs.readdirSync(repo).filter((name) =>
  name.endsWith('.html') && name !== 'account.html' && name !== 'yandex_daceb2f35abb6b87.html'
);
pageNames.push('coach/index.html');
pageNames.sort();
const pageSet = new Set(pageNames.map((name) => name.replaceAll('\\', '/')));
const resourceSet = new Set();
const localScriptAllowlist = new Set(['js/nav-menu.js', 'js/nav-state.js', 'js/pointer-glow.js']);
const forbiddenPath = /(^|\/)(?:\.env(?:\..*)?|raw|private|clients?|secrets?|\.git|\.session-cache)(?:\/|$)/i;
const allowedRoots = ['css/', 'js/', 'fonts/', 'assets/', 'landing-media/', 'coach/'];
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const rel = (file) => path.relative(repo, file).split(path.sep).join('/');

function sourceForUrl(owner, rawValue) {
  const value = rawValue.trim().replaceAll('&amp;', '&');
  if (!value || value.startsWith('#') || /^(?:data:|blob:|javascript:|mailto:|tel:|https?:|\/\/)/i.test(value)) return null;
  const pathname = decodeURIComponent(value.split(/[?#]/, 1)[0]);
  if (!pathname) return null;
  let candidate;
  if (pathname.startsWith('/')) candidate = path.resolve(repo, `.${pathname}`);
  else candidate = path.resolve(repo, path.dirname(owner), pathname);
  if (!candidate.startsWith(repo + path.sep) && candidate !== repo) throw new Error(`Path escapes repository: ${owner} -> ${value}`);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) candidate = path.join(candidate, 'index.html');
  const sourcePath = rel(candidate);
  if (forbiddenPath.test(sourcePath)) throw new Error(`Sensitive/raw path is forbidden in preview: ${sourcePath}`);
  return fs.existsSync(candidate) && fs.statSync(candidate).isFile() ? { candidate, sourcePath } : null;
}

function readPage(sourcePath) {
  return fs.readFileSync(path.join(repo, sourcePath), 'utf8');
}

function collectPageResources(sourcePath, html) {
  const attrs = /\b(?:href|src|poster|action|data|srcset)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  for (const match of html.matchAll(attrs)) {
    const raw = match[1] ?? match[2] ?? match[3] ?? '';
    for (const item of raw.split(',').map((part) => part.trim().split(/\s+/, 1)[0])) {
      const found = sourceForUrl(sourcePath, item);
      if (found && !found.sourcePath.endsWith('.html') && (!found.sourcePath.endsWith('.js') || localScriptAllowlist.has(found.sourcePath))) resourceSet.add(found.sourcePath);
    }
  }
  for (const match of html.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
    const found = sourceForUrl(sourcePath, match[1]);
    if (found && !found.sourcePath.endsWith('.html')) resourceSet.add(found.sourcePath);
  }
}

for (const page of pageNames) collectPageResources(page.replaceAll('\\', '/'), readPage(page));
const cssQueue = [...resourceSet].filter((item) => item.endsWith('.css'));
while (cssQueue.length) {
  const cssPath = cssQueue.pop();
  const css = fs.readFileSync(path.join(repo, cssPath), 'utf8');
  for (const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)|@import\s+["']([^"']+)["']/gi)) {
    const value = match[1] ?? match[2] ?? '';
    const found = sourceForUrl(cssPath, value);
    if (!found) continue;
    if (!resourceSet.has(found.sourcePath)) {
      resourceSet.add(found.sourcePath);
      if (found.sourcePath.endsWith('.css')) cssQueue.push(found.sourcePath);
    }
  }
}

// Ensure only rendered, local code can execute. Interactions are limited to the site navigation.
for (const script of localScriptAllowlist) {
  if (resourceSet.has(script)) continue;
  if (pageNames.some((page) => new RegExp(`<script\\b[^>]*\\bsrc=["'][^"']*${script.replaceAll('/', '\\/')}(?:\\?[^"']*)?["']`, 'i').test(readPage(page)))) {
    resourceSet.add(script);
  }
}
for (const asset of resourceSet) {
  if (forbiddenPath.test(asset) || (!allowedRoots.some((root) => asset.startsWith(root)) && !asset.endsWith('.json'))) {
    throw new Error(`Dependency outside preview allowlist: ${asset}`);
  }
}

const localUrlFor = (owner, rawValue) => {
  const found = sourceForUrl(owner, rawValue);
  if (!found) return null;
  const target = found.sourcePath;
  if (target.endsWith('.html')) return pageSet.has(target) ? rawValue : null;
  return resourceSet.has(target) ? rawValue : null;
};

function safeHtml(sourcePath, html) {
  html = html.replace(/<script\b([^>]*)>[\s\S]*?<\/script\s*>/gi, (whole, attrs) => {
    const src = attrs.match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    if (!src) return '';
    const value = src[1] ?? src[2];
    const normalized = value.split(/[?#]/, 1)[0].replace(/^\//, '');
    return localScriptAllowlist.has(normalized) && resourceSet.has(normalized) ? whole.replace(/>[\s\S]*<\/script\s*>$/i, '></script>') : '';
  });
  html = html.replace(/<form\b[\s\S]*?<\/form\s*>/gi, '<div class="preview-disabled"><strong>Предпросмотр</strong><span>Отправка форм отключена.</span></div>');
  html = html.replace(/<meta\b[^>]*http-equiv\s*=\s*["']?refresh[^>]*>/gi, '');
  html = html.replace(/<link\b[^>]*\brel\s*=\s*(?:"[^"]*\b(?:canonical|alternate)\b[^"]*"|'[^']*\b(?:canonical|alternate)\b[^']*')[^>]*>/gi, '');
  html = html.replace(/<meta\b[^>]*>/gi, (tag) => {
    const label = tag.match(/\b(?:property|name)\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    const content = tag.match(/\bcontent\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    const metaName = (label?.[1] ?? label?.[2] ?? '').toLowerCase();
    const metaContent = content?.[1] ?? content?.[2] ?? '';
    return /^(?:og|twitter):/.test(metaName) && /^(?:https?:)?\/\//i.test(metaContent) ? '' : tag;
  });
  html = html.replace(/url\(\s*["']?(?:https?:)?\/\/[^)]*["']?\s*\)/gi, 'none');
  html = html.replace(/<([a-z][^>]*?)>/gi, (tag) => {
    if (/^<\s*\//.test(tag)) return tag;
    const name = tag.match(/^<\s*([a-z][\w:-]*)/i)?.[1]?.toLowerCase();
    if (['iframe', 'object', 'embed'].includes(name)) return '';
    let result = tag.replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    const originalHref = tag.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    const acquisition = (originalHref?.[1] ?? originalHref?.[2] ?? '').replaceAll('&amp;', '&').match(/[?&]start=(buffit_coaching)(?:&|$)/);
    if (acquisition) result = result.replace(/>$/, ` data-preview-target="${acquisition[1]}">`);
    result = result.replace(/\s+data-organic-href\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    result = result.replace(/\s+(href|src|poster|action|formaction|data|srcset)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, (attr, key, quoted) => {
      const value = quoted.slice(1, -1);
      if (key.toLowerCase() === 'href' && (value.startsWith('#') || value.startsWith('?'))) return attr;
      if (key.toLowerCase() === 'srcset') {
        const safeEntries = value.split(',').map((entry) => {
          const [url, ...descriptor] = entry.trim().split(/\s+/);
          const safeUrl = localUrlFor(sourcePath, url);
          return safeUrl ? [safeUrl, ...descriptor].join(' ') : null;
        }).filter(Boolean);
        return safeEntries.length ? ` ${key}="${safeEntries.join(', ')}"` : '';
      }
      const safe = localUrlFor(sourcePath, value);
      return safe ? ` ${key}="${safe}"` : '';
    });
    result = result.replace(/\s+style\s*=\s*("[^"]*"|'[^']*')/i, (attr) => attr.replace(/url\(\s*["']?(?:https?:)?\/\/[^)]*["']?\s*\)/gi, 'none'));
    if (name === 'a' && !/\shref=/i.test(result)) result = result.replace(/>$/, ' aria-disabled="true" title="Недоступно в предпросмотре">');
    if (name === 'button' && /type=["']?submit/i.test(tag)) result = result.replace(/>$/, ' disabled aria-disabled="true">');
    return result;
  });
  html = html.replace(/<body\b([^>]*)>/i, '<body$1><div class="stockholm-preview-notice" role="status"><strong>Предпросмотр</strong><span>Формы, оплата, вход и внешние переходы отключены. Локальная навигация доступна.</span></div>');
  return html;
}

const copied = [];
function writeCopy(sourcePath, bytes, transformed = false) {
  const destination = path.join(site, sourcePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, bytes);
  copied.push({ path: `site/${sourcePath}`, sourceSha256: sha256(fs.readFileSync(path.join(repo, sourcePath))), sha256: sha256(bytes), bytes: bytes.length, dirty: dirtyPaths.has(sourcePath), transformed });
}
const dirtyPaths = new Set(execFileSync('git', ['status', '--porcelain', '--untracked-files=all'], { cwd: repo, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean).map((line) => line.slice(3).replaceAll('\\', '/')));
for (const page of pageNames) {
  const sourcePath = page.replaceAll('\\', '/');
  writeCopy(sourcePath, Buffer.from(safeHtml(sourcePath, readPage(sourcePath))), true);
}
for (const sourcePath of [...resourceSet].sort()) {
  const sourceBytes = fs.readFileSync(path.join(repo, sourcePath));
  let bytes = sourceBytes;
  let transformed = false;
  if (sourcePath.endsWith('.css')) {
    const original = sourceBytes.toString('utf8');
    const clean = original
      .replace(/@import\s+(?:url\()?\s*["']?(?:https?:)?\/\/[^;]+;?/gi, '')
      .replace(/url\(\s*["']?(?:https?:)?\/\/[^)]*["']?\s*\)/gi, 'none');
    bytes = Buffer.from(clean);
    transformed = clean !== original;
  }
  writeCopy(sourcePath, bytes, transformed);
}

const manifest = {
  artifact: 'stockholm-private-preview', version: '20261009-r1', versionDate: '2026-10-09',
  source: { repo: 'YokhanFitnessLanding', commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim(), snapshot: 'dirty worktree inputs recorded per shipped source file; transformed preview files are separately hashed' },
  policy: { publicPagesOnly: true, noAccountPage: true, scripts: [...localScriptAllowlist], externalLinksActionsAuth: 'disabled', remoteFontsMediaAnalytics: 'removed', rawGeneratedAssets: 'excluded unless direct dependency; forbidden in all cases', acquisitionPath: '/coach/ -> /coaching.html -> buffit_coaching', coachingPricesRubPerMonth: [32000, 48000] },
  nginxProfile: { source: 'deploy/nginx/stockholm-preview-loopback.conf', dirty: dirtyPaths.has('deploy/nginx/stockholm-preview-loopback.conf'), sha256: sha256(fs.readFileSync(path.join(repo, 'deploy/nginx/stockholm-preview-loopback.conf'))) },
  files: copied.sort((a, b) => a.path.localeCompare(b.path)),
};
fs.writeFileSync(path.join(output, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(output, 'README.txt'), 'BUFF IT — private static preview bundle\n\nServe the contents of site/ locally only. This is not a production deployment. Forms, payment, login, external links/actions, and remote connections are disabled. See nginx-stockholm-preview.conf for a loopback-only reference server fragment.\n');
fs.copyFileSync(path.join(repo, 'deploy/nginx/stockholm-preview-loopback.conf'), path.join(output, 'nginx-stockholm-preview.conf'));
console.log(`Built ${copied.length} files at ${output}`);
