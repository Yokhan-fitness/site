import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { preparePublicPresentation } from './public-presentation.mjs';
import { readLandingHomeCandidate, homepageCandidatePinsetSha256 } from './landing-home-candidate.mjs';

export const PUBLIC_EXTERNAL_HOSTS = new Set([
  'fitness.yokhan.xyz',
  'connect.yokhan.xyz',
  'calls.yokhan.xyz',
  'portfolio.yokhan.xyz',
  'giants.yokhan.xyz',
  'courier.yokhan.xyz',
  'gauss.yokhan.xyz',
  'yokhan.xyz',
  't.me',
  'pubmed.ncbi.nlm.nih.gov',
  'www.cdc.gov',
  'www.ncbi.nlm.nih.gov',
  'www.who.int',
]);
const AUTHORED_HOMEPAGE_EXTERNAL_HOSTS = new Set([...PUBLIC_EXTERNAL_HOSTS, 'kitchen.yokhan.xyz']);
export const PUBLIC_SCRIPTS = new Set(['js/nav-menu.js', 'js/nav-state.js', 'js/public-profile.js', 'js/buffit-landing-home.js', 'js/public-account.js', 'js/coaching-source.js']);
export const PUBLIC_PAGE_EXCLUDES = new Set(['account.html', 'yandex_daceb2f35abb6b87.html']);
export const RESOURCE_ROOTS = ['css/', 'js/', 'fonts/', 'assets/', 'landing-media/', 'coach/'];
export const FORBIDDEN_PATH = /(^|\/)(?:\.env(?:\.[^/]*)?|raw|private|clients?|secrets?|\.git|\.session-cache|\.deploy)(?:\/|$)/i;
export const FORBIDDEN_SUFFIX = /(?:\.(?:env|pem|key|p12|pfx|crt|cer|der|secret|secrets|token|credentials?|sqlite3?|db|dump|bak|backup|zip|tar|gz|7z))$/i;
export const PUBLIC_OUTPUT_PARENT = path.resolve('C:/Users/iohan/Documents/PersonalAssistant/outputs/buffit-entry-20261010');
export const PUBLIC_OUTPUT = path.join(PUBLIC_OUTPUT_PARENT, 'landing-r1-build3');
export function isAllowedPublicOutput(output) {
  const resolved = path.resolve(output);
  const nameAllowed = /^landing-[a-z0-9-]+$/i.test(path.basename(resolved));
  if (!nameAllowed) return false;
  if (path.dirname(resolved).toLowerCase() === PUBLIC_OUTPUT_PARENT.toLowerCase()) return true;
  const managedRoot = process.env.AGENT_RUN_OUTPUT;
  if (!managedRoot) return false;
  try {
    const root = fs.realpathSync(path.resolve(managedRoot));
    const fromRoot = path.relative(root, resolved);
    if (!fromRoot || fromRoot === '..' || fromRoot.startsWith(`..${path.sep}`) || path.isAbsolute(fromRoot)) return false;
    let cursor = root;
    for (const part of fromRoot.split(path.sep).slice(0, -1).filter(Boolean)) {
      cursor = path.join(cursor, part);
      if (fs.existsSync(cursor) && fs.lstatSync(cursor).isSymbolicLink()) return false;
    }
    return true;
  } catch { return false; }
}

const HASH = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const slash = (value) => value.split(path.sep).join('/');
const htmlFiles = (repo) => fs.readdirSync(repo, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.html') && !PUBLIC_PAGE_EXCLUDES.has(entry.name))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b));

function assertNoSymlink(repo, candidate) {
  const relative = path.relative(repo, candidate);
  let cursor = repo;
  for (const segment of relative.split(path.sep).filter(Boolean)) {
    cursor = path.join(cursor, segment);
    if (fs.existsSync(cursor) && fs.lstatSync(cursor).isSymbolicLink()) {
      throw new Error(`Symlink source is forbidden: ${slash(path.relative(repo, cursor))}`);
    }
  }
}

export function resolveSourceUrl(repo, owner, rawValue) {
  const value = String(rawValue ?? '').trim().replaceAll('&amp;', '&');
  if (!value || value.startsWith('#') || value.startsWith('?') || /^(?:data:|blob:|javascript:|mailto:|tel:|https?:|\/\/)/i.test(value)) return null;
  let decoded;
  try {
    decoded = decodeURIComponent(value.split(/[?#]/, 1)[0]);
  } catch {
    throw new Error(`Malformed URL encoding: ${owner} -> ${value}`);
  }
  if (!decoded || decoded === '/') return null;
  if (decoded.includes('\0') || decoded.includes('\\')) throw new Error(`Unsafe local URL: ${owner} -> ${value}`);
  const candidate = decoded.startsWith('/')
    ? path.resolve(repo, `.${decoded}`)
    : path.resolve(repo, path.dirname(owner), decoded);
  if (candidate !== repo && !candidate.startsWith(`${repo}${path.sep}`)) throw new Error(`Path escapes repository: ${owner} -> ${value}`);
  const sourcePath = slash(path.relative(repo, candidate));
  if (!sourcePath || FORBIDDEN_PATH.test(sourcePath) || FORBIDDEN_SUFFIX.test(sourcePath)) throw new Error(`Sensitive/raw path is forbidden: ${sourcePath || value}`);
  assertNoSymlink(repo, candidate);
  let file = candidate;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return null;
  return { candidate: file, sourcePath: slash(path.relative(repo, file)) };
}

function packageLocalPath(owner, rawValue) {
  const value = String(rawValue ?? '').trim().replaceAll('&amp;', '&');
  if (!value || value.startsWith('#') || value.startsWith('?') || /^(?:https?:|mailto:|tel:|data:|blob:|javascript:|file:|\/\/)/i.test(value)) return null;
  let decoded;
  try { decoded = decodeURIComponent(value.split(/[?#]/, 1)[0]); }
  catch { throw new Error('Homepage candidate contains malformed URL encoding.'); }
  if (!decoded || decoded.includes('\\') || decoded.includes('\0') || decoded.includes(':')) {
    throw new Error('Homepage candidate contains an unsafe local URL.');
  }
  if (decoded === '/') return '';
  const resolved = decoded.startsWith('/')
    ? path.posix.normalize(decoded.slice(1))
    : path.posix.normalize(path.posix.join(path.posix.dirname(owner), decoded));
  if (!resolved || resolved === '.' || resolved === '..' || resolved.startsWith('../') || resolved.startsWith('/')) {
    throw new Error('Homepage candidate local URL escapes the site root.');
  }
  return resolved;
}

function authoredPageExists(localPath, pageSet, aliases) {
  if (localPath === 'index.html' || localPath === '') return true;
  if (localPath.endsWith('.html')) return pageSet.has(localPath);
  const route = `${localPath.replace(/\/$/, '')}/`;
  return aliases.has(route);
}

function validateAuthoredHomepage(candidate, repo, pageSet, aliases) {
  const html = candidate.indexHtml.toString('utf8');
  if (/yokhanfitness\.ru/i.test(html) || /\son[a-z]+\s*=/i.test(html)
    || /<(?:iframe|object|embed)\b/i.test(html)
    || /<meta\b[^>]*http-equiv\s*=\s*["']?refresh/i.test(html)) {
    throw new Error('Homepage candidate contains a blocked public markup pattern.');
  }
  const scriptTags = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
  for (const [, attributes, body] of scriptTags) {
    const tag = `<script ${attributes}>`;
    const src = attrValue(tag, 'src');
    const type = attrValue(tag, 'type');
    const id = attrValue(tag, 'id');
    if (id === 'landing-home-model' && type === 'application/json' && !src) continue;
    if (body.trim()) throw new Error('Homepage candidate contains executable inline script content.');
    if (!src) throw new Error('Homepage candidate contains an unapproved inline script.');
    const localPath = packageLocalPath('index.html', src);
    const authoredRuntime = localPath === candidate.manifest.outputs.runtimeScript;
    if (!localPath || (!authoredRuntime && !PUBLIC_SCRIPTS.has(localPath))) throw new Error('Homepage candidate references an unapproved script.');
    if (!authoredRuntime && !fs.existsSync(path.join(repo, ...localPath.split('/')))) {
      throw new Error(`Homepage candidate script is missing from the public site: ${localPath}.`);
    }
  }
  const attrs = /\b(href|src|poster|action|formaction|srcset)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  for (const [, attrName, doubleQuoted, singleQuoted, unquoted] of html.matchAll(attrs)) {
    const name = attrName.toLowerCase();
    const value = (doubleQuoted ?? singleQuoted ?? unquoted ?? '').replaceAll('&amp;', '&').trim();
    const values = name === 'srcset' ? value.split(',').map(item => item.trim().split(/\s+/, 1)[0]) : [value];
    for (const item of values) {
      if (!item || item.startsWith('#') || item.startsWith('?')) continue;
      let url;
      try { url = new URL(item, 'https://yokhan.xyz/'); }
      catch { throw new Error('Homepage candidate contains an invalid public URL.'); }
      if (url.origin !== 'https://yokhan.xyz') {
        if (name !== 'href' || url.protocol !== 'https:' || !AUTHORED_HOMEPAGE_EXTERNAL_HOSTS.has(url.hostname.toLowerCase())) {
          throw new Error(`Homepage candidate contains a disallowed external URL: ${name}=${url.href}`);
        }
        continue;
      }
      const localPath = packageLocalPath('index.html', item);
      if (!localPath) continue;
      if (localPath.startsWith('landing-media/')) {
        if (!candidate.publicFiles.has(localPath)) throw new Error(`Homepage candidate media is missing: ${localPath}.`);
        continue;
      }
      if (candidate.publicFiles.has(localPath)) continue;
      if (name === 'href' && authoredPageExists(localPath, pageSet, aliases)) continue;
      const found = resolveSourceUrl(repo, 'index.html', item);
      if (!found || !RESOURCE_ROOTS.some(root => found.sourcePath.startsWith(root))
        || found.sourcePath.endsWith('.js') && !PUBLIC_SCRIPTS.has(found.sourcePath)) {
        throw new Error(`Homepage candidate local URL is not in the public site: ${localPath}.`);
      }
    }
  }
  return html;
}

function candidatePathsReferencedByHtml(html, owner, candidateFiles) {
  const found = new Set();
  const attrs = /\b(?:href|src|poster|action|formaction|srcset)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  for (const match of html.matchAll(attrs)) {
    const value = (match[1] ?? match[2] ?? match[3] ?? '').replaceAll('&amp;', '&');
    const values = match[0].toLowerCase().includes('srcset')
      ? value.split(',').map(item => item.trim().split(/\s+/, 1)[0]) : [value];
    for (const item of values) {
      const localPath = packageLocalPath(owner, item);
      if (localPath && candidateFiles.has(localPath)) found.add(localPath);
    }
  }
  return found;
}

function addCssDependencies(repo, initialPaths, destination) {
  const queue = [...initialPaths].filter(file => file.endsWith('.css'));
  const visited = new Set();
  while (queue.length) {
    const owner = queue.pop();
    if (visited.has(owner)) continue;
    visited.add(owner);
    const absolute = path.join(repo, ...owner.split('/'));
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) continue;
    const css = fs.readFileSync(absolute, 'utf8');
    for (const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)|@import\s+(?:url\()?\s*["']([^"']+)["']\s*\)?/gi)) {
      const value = match[1] ?? match[2];
      const found = resolveSourceUrl(repo, owner, value);
      if (!found) continue;
      if (!RESOURCE_ROOTS.some(root => found.sourcePath.startsWith(root)) || found.sourcePath.endsWith('.js')) {
        throw new Error(`CSS dependency outside public allowlist: ${found.sourcePath}`);
      }
      if (!destination.has(found.sourcePath)) {
        destination.add(found.sourcePath);
        if (found.sourcePath.endsWith('.css')) queue.push(found.sourcePath);
      }
    }
  }
}

function assertManagedPath(pathValue, managedRoot, label) {
  const root = fs.realpathSync(path.resolve(managedRoot));
  const absolute = path.resolve(pathValue);
  const fromRoot = path.relative(root, absolute);
  if (!fromRoot || fromRoot === '..' || fromRoot.startsWith(`..${path.sep}`) || path.isAbsolute(fromRoot)) {
    throw new Error(`${label} must stay inside AGENT_RUN_OUTPUT.`);
  }
  let cursor = root;
  for (const part of fromRoot.split(path.sep).slice(0, -1).filter(Boolean)) {
    cursor = path.join(cursor, part);
    if (fs.existsSync(cursor) && fs.lstatSync(cursor).isSymbolicLink()) throw new Error(`${label} cannot traverse a symlink or junction.`);
  }
  return absolute;
}

function verifyStagedPackage(root) {
  const manifestPath = path.join(root, 'manifest.json');
  const manifestBytes = fs.readFileSync(manifestPath);
  const manifest = JSON.parse(manifestBytes.toString('utf8'));
  if (!Array.isArray(manifest.files)) throw new Error('Staged public manifest is incomplete.');
  const expected = new Set(['manifest.json']);
  for (const entry of manifest.files) {
    const relativePath = entry.path.replace(/^site\//, '');
    if (!entry.path.startsWith('site/') || entry.path.includes('\\') || relativePath.split('/').some(part => !part || part === '.' || part === '..')) {
      throw new Error('Staged public manifest contains an unsafe output path.');
    }
    const absolute = path.join(root, ...entry.path.split('/'));
    const bytes = fs.readFileSync(absolute);
    if (!fs.statSync(absolute).isFile() || bytes.length !== entry.bytes || HASH(bytes) !== entry.sha256) {
      throw new Error(`Staged public output failed its manifest check: ${entry.path}.`);
    }
    expected.add(entry.path);
  }
  const actual = new Set();
  const walk = (dir, prefix = '') => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const rel = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.isSymbolicLink()) throw new Error(`Staged public output contains a symlink: ${rel}.`);
      if (item.isDirectory()) walk(path.join(dir, item.name), rel);
      else if (item.isFile()) actual.add(rel);
      else throw new Error(`Staged public output contains an unsupported entry: ${rel}.`);
    }
  };
  walk(root);
  if (actual.size !== expected.size || [...expected].some(file => !actual.has(file))) {
    throw new Error('Staged public output file inventory does not match its manifest.');
  }
}

function attrValue(tag, name) {
  const found = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return found ? (found[1] ?? found[2] ?? found[3] ?? '') : null;
}

function escapeAttr(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
}

function routePathForSource(sourcePath, pageSet) {
  if (sourcePath === 'index.html') return '/';
  if (sourcePath.endsWith('.html')) return pageSet.has(sourcePath) ? `/${sourcePath}` : null;
  return `/${sourcePath}`;
}

function cleanRoute(route) {
  const pathname = route.split(/[?#]/, 1)[0];
  const suffix = route.slice(pathname.length);
  if (pathname === '/index.html') return `/${suffix}`;
  if (pathname === '/guide.html') return `/guide-overview${suffix}`;
  if (pathname === '/app.html') return `/app${suffix}`;
  if (pathname === '/calls-access.html') return `/calls-access${suffix}`;
  return `${pathname}${suffix}`;
}

function rewriteRetiredUrl(raw) {
  const value = raw.replaceAll('&amp;', '&');
  let url;
  try { url = new URL(value); } catch { return null; }
  const host = url.hostname.toLowerCase();
  if (host === 'app.yokhanfitness.ru' || host === 'auth.yokhanfitness.ru') {
    const mode = new URLSearchParams(url.search).get('mode');
    if (mode === 'register' || mode === 'reset' || mode === 'password-reset') return '/account-unavailable.html';
    return 'https://fitness.yokhan.xyz/auth?mode=login&returnTo=%2Fhome';
  }
  if (host === 'callservice.yokhanfitness.ru' || host === 'calls.yokhanfitness.ru') return 'https://calls.yokhan.xyz/';
  if (host === 'smartcart.yokhanfitness.ru' || host === 'dayflow.yokhanfitness.ru') return '/service-unavailable.html';
  if (host === 'guide.yokhanfitness.ru') return '/guide.html';
  if (host === 'yokhanfitness.ru' || host === 'www.yokhanfitness.ru') {
    if (/^\/dayflow(?:\/|$)/i.test(url.pathname)) return '/service-unavailable.html';
    return `https://yokhan.xyz${cleanRoute(`/` + url.pathname.replace(/^\/+/, '') + url.search + url.hash)}`;
  }
  return null;
}

function rewriteTextDomains(html) {
  return html
    .replace(/auth\.yokhanfitness\.ru/gi, 'fitness.yokhan.xyz')
    .replace(/guide\.yokhanfitness\.ru/gi, 'BUFF IT GUIDE')
    .replace(/(?:smartcart|dayflow|callservice)\.yokhanfitness\.ru/gi, 'сервис BUFF IT');
}

function makeGeneratedPage(repo, main, title, description) {
  let html = fs.readFileSync(path.join(repo, 'app.html'), 'utf8');
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  html = html.replace(/<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${description}">`);
  html = html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, main);
  return html;
}

function generatedPages(repo) {
  const projects = `<main><section class="entry-intro"><div class="container"><p class="eyebrow">Yokhan</p><h1 class="heading">Проекты и сервисы</h1><p class="entry-intro__description">Выберите задачу: тренироваться, созвониться, посмотреть работы или открыть игровой проект.</p><div class="hero__actions"><a class="btn btn--primary" href="https://fitness.yokhan.xyz/">Открыть APP</a><a class="btn btn--secondary" href="https://connect.yokhan.xyz/">Открыть CONNECT</a></div></div></section><section class="section"><div class="container"><h2 class="heading section-title">BUFF IT: фитнес и сервисы</h2><div class="support-grid"><a class="support-card" href="https://fitness.yokhan.xyz/"><span>APP</span><h3>Тренировки и план</h3><p>План занятий, упражнения и профиль. Для знакомства — десятиминутная проба без регистрации.</p><strong>Открыть APP →</strong></a><a class="support-card" href="https://fitness.yokhan.xyz/train/guest"><span>Без регистрации</span><h3>Первая тренировка</h3><p>Три упражнения для первого знакомства с форматом.</p><strong>Попробовать 10 минут →</strong></a><a class="support-card" href="https://connect.yokhan.xyz/"><span>CONNECT</span><h3>Видеозвонки</h3><p>Создайте комнату или присоединитесь по ссылке приглашения.</p><strong>Открыть CONNECT →</strong></a></div></div></section><section class="section"><div class="container"><h2 class="heading section-title">Другие проекты</h2><div class="support-grid"><a class="support-card" href="https://portfolio.yokhan.xyz/"><span>Работы</span><h3>Портфолио</h3><p>Публичное портфолио Игоря Назарова.</p><strong>Посмотреть работы →</strong></a><a class="support-card" href="https://giants.yokhan.xyz/"><span>Мир</span><h3>Giant’s Vale</h3><p>Материалы и истории мира Giant’s Vale.</p><strong>Открыть мир →</strong></a><a class="support-card" href="https://courier.yokhan.xyz/"><span>Игра</span><h3>Village Heroes · Iron Courier</h3><p>Браузерный игровой проект.</p><strong>Открыть игру →</strong></a><a class="support-card" href="https://gauss.yokhan.xyz/"><span>Мир</span><h3>GAUSS</h3><p>Миры, культуры и истории научно-фантастической вселенной.</p><strong>Посмотреть проект →</strong></a></div></div></section></main>`;
  const unavailable = `<main>
  <section class="hero"><div class="hero__stage"><div class="hero__inner"><div class="hero__content"><p class="eyebrow">Доступность сервиса</p><h1 class="heading hero__title">Сервис пока недоступен</h1><p class="hero__subtitle">Выберите программу занятий или попробуйте тренировку без регистрации.</p><div class="hero__actions"><a class="btn btn--primary" href="https://fitness.yokhan.xyz/auth?mode=login&amp;returnTo=%2Fhome">Войти в APP</a><a class="btn btn--secondary" href="https://fitness.yokhan.xyz/train/guest">Гостевая тренировка</a><a class="btn btn--secondary" href="https://connect.yokhan.xyz/">CONNECT</a></div><p><a href="/">Вернуться на главную</a></p></div></div></div></section>
</main>`;
  const accountUnavailable = `<main>
  <section class="hero"><div class="hero__stage"><div class="hero__inner"><div class="hero__content"><p class="eyebrow">BUFF IT ID</p><h1 class="heading hero__title">Вход в BUFF IT</h1><p class="hero__subtitle">Для входа в аккаунт перейдите в приложение. Познакомиться с тренировкой можно без регистрации.</p><div class="hero__actions"><a class="btn btn--primary" href="https://fitness.yokhan.xyz/auth?mode=login&amp;returnTo=%2Fhome">Войти</a><a class="btn btn--secondary" href="https://fitness.yokhan.xyz/train/guest">Гостевая тренировка</a><a class="btn btn--secondary" href="/">На главную</a></div></div></div></div></section>
</main>`;
  return new Map([
    ['projects.html', makeGeneratedPage(repo, projects, 'Проекты и сервисы — Yokhan', 'Публичные проекты и доступные сервисы Yokhan.')],
    ['service-unavailable.html', makeGeneratedPage(repo, unavailable, 'Сервис пока недоступен — Yokhan', 'Информация о недоступном сервисе и рабочие публичные переходы.')],
    ['account-unavailable.html', makeGeneratedPage(repo, accountUnavailable, 'Вход в BUFF IT', 'Перейдите на страницу входа в BUFF IT или попробуйте тренировку без регистрации.')],
  ]);
}

function routeAliases(sourcePages) {
  const routes = new Map();
  const base = ['method', 'ecosystem', 'start', 'programs', 'training', 'personal', 'app', 'calls-access', 'nutrition', 'health'];
  for (const slug of base) routes.set(`${slug}/`, sourcePages.has(`${slug}.html`) ? `${slug}.html` : 'service-unavailable.html');
  routes.set('guide-overview/', sourcePages.has('guide.html') ? 'guide.html' : 'service-unavailable.html');
  routes.set('routes/', sourcePages.has('routes.html') ? 'routes.html' : 'service-unavailable.html');
  for (const page of sourcePages) {
    if (/^program-[a-z0-9-]+\.html$/i.test(page)) routes.set(`${page.slice(0, -5)}/`, page);
  }
  return routes;
}

function sourceLinks(html, owner, repo, pageSet, resourceSet) {
  const attrs = /\b(?:href|src|poster|action|formaction|data|srcset)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  for (const match of html.matchAll(attrs)) {
    const value = match[1] ?? match[2] ?? match[3] ?? '';
    const entries = match[0].toLowerCase().includes('srcset')
      ? value.split(',').map((entry) => entry.trim().split(/\s+/, 1)[0])
      : [value];
    for (const item of entries) {
      const found = resolveSourceUrl(repo, owner, item);
      if (!found || found.sourcePath.endsWith('.html')) continue;
      if (!RESOURCE_ROOTS.some((root) => found.sourcePath.startsWith(root))) throw new Error(`Dependency outside public roots: ${found.sourcePath}`);
      if (found.sourcePath.endsWith('.js') && !PUBLIC_SCRIPTS.has(found.sourcePath)) continue;
      resourceSet.add(found.sourcePath);
    }
  }
  for (const match of html.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
    const found = resolveSourceUrl(repo, owner, match[1]);
    if (found && !found.sourcePath.endsWith('.html')) resourceSet.add(found.sourcePath);
  }
  for (const match of html.matchAll(/@import\s+(?:url\()?\s*["']([^"']+)["']\s*\)?/gi)) {
    const found = resolveSourceUrl(repo, owner, match[1]);
    if (found && found.sourcePath.endsWith('.css')) resourceSet.add(found.sourcePath);
  }
  for (const script of PUBLIC_SCRIPTS) {
    if (new RegExp(`<script\\b[^>]*\\bsrc=["'][^"']*${script.replaceAll('/', '\\/')}(?:\\?[^"']*)?["']`, 'i').test(html)) resourceSet.add(script);
  }
}

function normalizeUrl(owner, raw, repo, pageSet, resourceSet) {
  const value = String(raw ?? '').trim().replaceAll('&amp;', '&');
  const suffix = value.slice(value.split(/[?#]/, 1)[0].length);
  if (!value || value.startsWith('#') || value.startsWith('?')) return value;
  if (value === '/') return '/';
  if (value === '/guide.html') return value;
  // Generated public pages have no source file in the repository.
  const generatedPath = value.split(/[?#]/, 1)[0].replace(/^\//, '');
  if (['projects.html', 'service-unavailable.html', 'account-unavailable.html'].includes(generatedPath)
      && pageSet.has(generatedPath)) return `/${generatedPath}${suffix}`;
  const retired = rewriteRetiredUrl(value);
  if (retired) return retired;
  if (/^(?:data:|blob:|javascript:)/i.test(value)) return null;
  if (/^https?:|^\/\//i.test(value)) {
    let url;
    try { url = new URL(value, 'https://invalid.local'); } catch { return null; }
    return PUBLIC_EXTERNAL_HOSTS.has(url.hostname.toLowerCase()) ? url.href : null;
  }
  const found = resolveSourceUrl(repo, owner, value);
  if (!found) {
    const normalized = value.split(/[?#]/, 1)[0];
    if (normalized.toLowerCase().includes('account.html') || /(?:mode=register|mode=reset|password-reset)/i.test(value)) return '/account-unavailable.html';
    if (normalized && /\.html?$/i.test(normalized)) return '/service-unavailable.html';
    return null;
  }
  if (found.sourcePath.endsWith('.html')) {
    if (found.sourcePath === 'account.html') return '/account-unavailable.html';
    return cleanRoute((routePathForSource(found.sourcePath, pageSet) ?? '/service-unavailable.html') + suffix);
  }
  if (!resourceSet.has(found.sourcePath)) return null;
  if (/\.(?:css|js|svg)$/.test(found.sourcePath)) {
    return `/${found.sourcePath}?v=${HASH(fs.readFileSync(found.candidate)).slice(0, 12)}`;
  }
  return `/${found.sourcePath}${suffix}`;
}

function transformHtml(html, owner, repo, pageSet, resourceSet, generated) {
  html = html.replace(/https?:\/\/(?:[a-z0-9-]+\.)?yokhanfitness\.ru[^\s"'<>)]*/gi, (legacy) => {
    const mapped = rewriteRetiredUrl(legacy) ?? legacy.replace(/yokhanfitness\.ru/gi, 'yokhan.xyz');
    return mapped.replaceAll('&', '&amp;');
  });
  html = html.replace(/<script\b([^>]*)>[\s\S]*?<\/script\s*>/gi, (whole, attrs) => {
    const src = attrValue(`<script ${attrs}>`, 'src');
    if (!src) {
      const type = attrValue(`<script ${attrs}>`, 'type')?.toLowerCase();
      return type === 'application/ld+json' ? whole : '';
    }
    const found = resolveSourceUrl(repo, owner, src);
    if (owner === 'index.html' && ['js/nav-state.js', 'js/nav-menu.js'].includes(found?.sourcePath)) return '';
    return found && PUBLIC_SCRIPTS.has(found.sourcePath) && resourceSet.has(found.sourcePath)
      ? `<script${found.sourcePath === 'js/public-profile.js' ? '' : ' defer'} src="/${found.sourcePath}"></script>`
      : '';
  });
  html = html.replace(/<meta\b[^>]*http-equiv\s*=\s*["']?refresh[^>]*>/gi, '');
  html = html.replace(/<(iframe|object|embed)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  html = html.replace(/<(iframe|object|embed)\b[^>]*\/?>/gi, '');
  html = html.replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  html = html.replace(/\s+(href|src|poster|action|formaction|data|srcset)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, (whole, name, quoted) => {
    const value = quoted.slice(1, -1).replaceAll('&amp;', '&');
    const key = name.toLowerCase();
    if (key === 'srcset') {
      const values = value.split(',').map((entry) => {
        const [url, ...descriptor] = entry.trim().split(/\s+/);
        const normalized = normalizeUrl(owner, url, repo, pageSet, resourceSet);
        return normalized ? [normalized, ...descriptor].join(' ') : null;
      }).filter(Boolean);
      return values.length ? ` srcset="${escapeAttr(values.join(', '))}"` : '';
    }
    if (key === 'href' && /^https?:/i.test(value)) {
      const retired = rewriteRetiredUrl(value);
      if (retired) return ` href="${escapeAttr(retired)}"`;
      try {
        const host = new URL(value).hostname.toLowerCase();
        return PUBLIC_EXTERNAL_HOSTS.has(host) ? ` href="${escapeAttr(value)}"` : '';
      } catch { return ''; }
    }
    const normalized = normalizeUrl(owner, value, repo, pageSet, resourceSet);
    return normalized === null ? '' : ` ${name}="${escapeAttr(normalized)}"`;
  });
  html = rewriteTextDomains(html).replace(/yokhanfitness\.ru/gi, 'yokhan.xyz');
  html = html.replace(/url\(\s*["']?(?:https?:)?\/\/[^)]*["']?\s*\)/gi, 'none');
  html = html.replace(/@import\s+(?:url\()?\s*["']?(?:https?:)?\/\/[^;]+;?/gi, '');
  // The canonical header already carries its navigation and responsive controls.
  // Never collapse it into the old three-link fallback.
  if (generated && !html.includes('css/public-entry.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/css/public-entry.css">\n</head>');
  if (generated) html = html.replace(/<title>BUFF IT — План, отметки и прогресс внутри ведения<\/title>/i, '<title>BUFF IT — публичные сервисы и проекты</title>');
  return html;
}

function allPublicPages(repo) {
  const pages = htmlFiles(repo);
  if (fs.existsSync(path.join(repo, 'coach', 'index.html'))) pages.push('coach/index.html');
  return pages.sort((a, b) => a.localeCompare(b));
}

export function buildPublicSite({ repo, output, releaseId = 'landing-public-20261010-r1', homepageCandidate = null }) {
  if (!/^landing-public-[0-9]{8}-[a-z0-9-]+$/.test(releaseId)) throw new Error('Invalid public release ID');
  repo = path.resolve(repo);
  output = path.resolve(output);
  if (fs.existsSync(output)) throw new Error(`Output already exists; refusing overwrite: ${output}`);
  if (!isAllowedPublicOutput(output)) throw new Error('Output must be a fresh landing-* directory in AGENT_RUN_OUTPUT or the historical allowlist.');
  const managedRoot = process.env.AGENT_RUN_OUTPUT ? path.resolve(process.env.AGENT_RUN_OUTPUT) : null;
  if (homepageCandidate && !managedRoot) throw new Error('Authored homepage builds must run inside managed AGENT_RUN_OUTPUT.');
  if (homepageCandidate) {
    assertManagedPath(output, managedRoot, 'Authored homepage output');
    assertManagedPath(homepageCandidate.root, managedRoot, 'Homepage candidate');
  }

  const candidate = homepageCandidate
    ? readLandingHomeCandidate({ root: homepageCandidate.root, expected: homepageCandidate.expected })
    : null;
  const pages = allPublicPages(repo);
  const pageSet = new Set(pages);
  const generated = generatedPages(repo);
  for (const key of generated.keys()) pageSet.add(key);
  const aliases = routeAliases(pageSet);
  if (candidate && !pages.includes('index.html')) throw new Error('Authored homepage requires the existing index.html consumer route.');
  const prepared = new Map(pages.map(sourcePath => [sourcePath,
    candidate && sourcePath === 'index.html'
      ? validateAuthoredHomepage(candidate, repo, pageSet, aliases)
      : preparePublicPresentation(fs.readFileSync(path.join(repo, sourcePath), 'utf8'), sourcePath, repo)]));
  for (const [sourcePath, html] of generated) generated.set(sourcePath, preparePublicPresentation(html, sourcePath, repo));

  const resourceSet = new Set(['coach/favicon.svg']);
  const nonHomeResources = new Set();
  for (const sourcePath of pages) {
    sourceLinks(prepared.get(sourcePath), sourcePath, repo, pageSet, resourceSet);
    if (sourcePath !== 'index.html') sourceLinks(prepared.get(sourcePath), sourcePath, repo, pageSet, nonHomeResources);
  }
  for (const [sourcePath, html] of generated) {
    sourceLinks(html, sourcePath, repo, pageSet, resourceSet);
    sourceLinks(html, sourcePath, repo, pageSet, nonHomeResources);
  }
  if (candidate) {
    for (const sourcePath of candidate.publicFiles.keys()) resourceSet.add(sourcePath);
    // Keep the legacy runtime asset available byte-for-byte for existing package consumers;
    // only the authored index uses the manifest-pinned hashed runtime.
    resourceSet.add('js/buffit-landing-home.js');
    for (const sourcePath of pages.filter(page => page !== 'index.html')) {
      for (const ref of candidatePathsReferencedByHtml(prepared.get(sourcePath), sourcePath, candidate.publicFiles)) nonHomeResources.add(ref);
    }
    for (const [sourcePath, html] of generated) {
      for (const ref of candidatePathsReferencedByHtml(html, sourcePath, candidate.publicFiles)) nonHomeResources.add(ref);
    }
  } else {
    // Legacy home media is discovered from its runtime only for legacy builds.
    const homeRuntime = fs.readFileSync(path.join(repo, 'js/buffit-landing-home.js'), 'utf8');
    for (const match of homeRuntime.matchAll(/["'](\/landing-media\/[A-Za-z0-9_.-]+\.(?:png|webp|avif|svg))["']/g)) {
      const found = resolveSourceUrl(repo, 'index.html', match[1]);
      if (!found || !found.sourcePath.startsWith('landing-media/')) throw new Error(`Missing runtime media: ${match[1]}`);
      resourceSet.add(found.sourcePath);
    }
  }
  addCssDependencies(repo, nonHomeResources, nonHomeResources);
  if (candidate) {
    for (const sourcePath of candidate.publicFiles.keys()) {
      if (!nonHomeResources.has(sourcePath)) continue;
      const original = path.join(repo, ...sourcePath.split('/'));
      if (!fs.existsSync(original) || !fs.statSync(original).isFile()
        || !fs.readFileSync(original).equals(candidate.publicFiles.get(sourcePath))) {
        throw new Error(`Homepage candidate would change a shared non-home resource: ${sourcePath}.`);
      }
    }
  }

  const cssQueue = [...resourceSet].filter(sourcePath => sourcePath.endsWith('.css'));
  const visitedCss = new Set();
  while (cssQueue.length) {
    const owner = cssQueue.pop();
    if (visitedCss.has(owner)) continue;
    visitedCss.add(owner);
    const candidateBytes = candidate?.publicFiles.get(owner);
    const sourcePath = path.join(repo, ...owner.split('/'));
    const bytes = candidateBytes ?? fs.readFileSync(sourcePath);
    const css = bytes.toString('utf8');
    const deps = new Set();
    for (const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)|@import\s+(?:url\()?\s*["']([^"']+)["']\s*\)?/gi)) {
      const value = match[1] ?? match[2];
      const found = resolveSourceUrl(repo, owner, value);
      if (!found) continue;
      if (!RESOURCE_ROOTS.some(root => found.sourcePath.startsWith(root)) || found.sourcePath.endsWith('.js')) {
        throw new Error(`CSS dependency outside public allowlist: ${found.sourcePath}`);
      }
      deps.add(found.sourcePath);
    }
    for (const dep of deps) if (!resourceSet.has(dep)) {
      resourceSet.add(dep);
      if (dep.endsWith('.css')) cssQueue.push(dep);
    }
  }
  for (const sourcePath of resourceSet) {
    if (FORBIDDEN_PATH.test(sourcePath) || FORBIDDEN_SUFFIX.test(sourcePath)) throw new Error(`Forbidden public resource: ${sourcePath}`);
  }

  const gitStatus = execFileSync('git', ['status', '--porcelain', '--untracked-files=all'], { cwd: repo, encoding: 'utf8' });
  const dirtyPaths = new Set(gitStatus.split(/\r?\n/).filter(Boolean).map(line => line.slice(3).replaceAll('\\', '/')));
  const stageParent = path.dirname(output);
  fs.mkdirSync(stageParent, { recursive: true });
  const stage = fs.mkdtempSync(path.join(stageParent, '.landing-site-stage-'));
  const site = path.join(stage, 'site');
  try {
    fs.mkdirSync(site, { recursive: true });
    const copied = [];
    const write = (outputPath, sourcePath, bytes, transformed, sourceBytes) => {
      const normalized = outputPath.replaceAll('\\', '/');
      if (normalized.split('/').some(part => !part || part === '.' || part === '..') || path.isAbsolute(outputPath)) {
        throw new Error(`Unsafe public package path: ${outputPath}`);
      }
      const destination = path.join(site, ...normalized.split('/'));
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, bytes, { flag: 'wx' });
      copied.push({ path: `site/${normalized}`, source: sourcePath, sourceSha256: sourceBytes ? HASH(sourceBytes) : null, sha256: HASH(bytes), bytes: bytes.length, dirty: sourcePath ? dirtyPaths.has(sourcePath) : null, transformed });
    };
    for (const sourcePath of pages) {
      if (candidate && sourcePath === 'index.html') {
        write(sourcePath, null, candidate.indexHtml, false, candidate.indexHtml);
        continue;
      }
      const sourceBytes = fs.readFileSync(path.join(repo, sourcePath));
      const clean = transformHtml(prepared.get(sourcePath), sourcePath, repo, pageSet, resourceSet, false);
      write(sourcePath, sourcePath, Buffer.from(clean), true, sourceBytes);
    }
    for (const [sourcePath, html] of generated) {
      const clean = transformHtml(html, sourcePath, repo, pageSet, resourceSet, true);
      write(sourcePath, null, Buffer.from(clean), true, null);
    }
    for (const rootMeta of ['robots.txt', 'sitemap.xml']) {
      const metaPath = path.join(repo, rootMeta);
      if (fs.existsSync(metaPath) && fs.statSync(metaPath).isFile()) {
        const bytes = fs.readFileSync(metaPath);
        write(rootMeta, rootMeta, bytes, false, bytes);
      }
    }
    for (const sourcePath of [...resourceSet].sort()) {
      const candidateBytes = candidate?.publicFiles.get(sourcePath);
      const sourceBytes = candidateBytes ?? fs.readFileSync(path.join(repo, ...sourcePath.split('/')));
      let bytes = sourceBytes;
      let transformed = false;
      if (sourcePath.endsWith('.css') && !candidateBytes) {
        const css = sourceBytes.toString('utf8');
        const clean = css.replace(/@import\s+(?:url\()?\s*["']?(?:https?:)?\/\/[^;]+;?/gi, '')
          .replace(/url\(\s*["']?(?:https?:)?\/\/[^)]*["']?\s*\)/gi, 'none');
        bytes = Buffer.from(clean);
        transformed = clean !== css;
      }
      write(sourcePath, candidateBytes ? null : sourcePath, bytes, transformed, sourceBytes);
    }
    for (const [alias, target] of aliases) {
      const sourceOutput = path.join(site, ...target.split('/'));
      const bytes = fs.readFileSync(sourceOutput);
      const outputPath = `${alias}index.html`;
      const destination = path.join(site, ...outputPath.split('/'));
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, bytes, { flag: 'wx' });
      copied.push({ path: `site/${outputPath}`, source: target, sourceSha256: null, sha256: HASH(bytes), bytes: bytes.length, dirty: null, transformed: true, aliasOf: `site/${target}` });
    }
    const manifest = {
      artifact: 'buffit-public-static-package',
      version: releaseId,
      releaseId,
      source: { repo: 'YokhanFitnessLanding', commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim(), worktree: 'dirty source snapshot; every shipped source file is recorded and hashed' },
      policy: {
        output: slash(path.relative(path.dirname(output), output)),
        publicPagesOnly: true,
        excludedPages: [...PUBLIC_PAGE_EXCLUDES],
        scripts: [...PUBLIC_SCRIPTS],
        allowedExternalLinkHosts: [...PUBLIC_EXTERNAL_HOSTS],
        appLogin: 'https://fitness.yokhan.xyz/auth?mode=login&returnTo=%2Fhome',
        guestTrial: 'https://fitness.yokhan.xyz/train/guest',
        calls: 'https://calls.yokhan.xyz/',
        registrationAndReset: 'account-unavailable.html',
        unavailableDayFlowSmartCart: 'service-unavailable.html',
        gates: 'existing APP request/status entry; static package does not change VPN or key issuance',
        acquisition: '/coach/ -> /coaching.html -> t.me/yokhan_yokhan',
        coachingPricesRubPerMonth: [32000, 48000],
        rawMediaAndPrivatePathsExcluded: true,
      },
      ...(candidate ? { homepageCandidate: {
        schemaVersion: 1,
        identity: { id: 'buffit.home', owner: 'YokhanFitnessLanding', routeRef: '/' },
        manifestSha256: candidate.manifestSha256,
        sourceSha256: candidate.sourceSha256,
        contentDigest: candidate.contentDigest,
        pageModelDigest: candidate.pageModelDigest,
        pinsetSha256: homepageCandidatePinsetSha256(candidate.pins),
        pins: candidate.pins,
        componentManifestSha256: candidate.manifest.outputs.componentManifestSha256,
        stylesheet: candidate.manifest.outputs.stylesheet,
        runtimeScript: candidate.manifest.outputs.runtimeScript,
      } } : {}),
      routeAliases: Object.fromEntries([...aliases].map(([route, target]) => [`/${route}`, target])),
      files: copied.sort((a, b) => a.path.localeCompare(b.path)),
    };
    fs.writeFileSync(path.join(stage, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
    verifyStagedPackage(stage);
    candidate?.verifyUnchanged();
    if (fs.existsSync(output)) throw new Error('Output appeared during package generation; refusing promotion.');
    fs.renameSync(stage, output);
    return { output, count: copied.length, manifest };
  } catch (error) {
    fs.rmSync(stage, { recursive: true, force: true });
    throw error;
  }
}
