import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FORBIDDEN_PATH, FORBIDDEN_SUFFIX, isAllowedPublicOutput, PUBLIC_EXTERNAL_HOSTS, PUBLIC_OUTPUT, PUBLIC_PAGE_EXCLUDES, PUBLIC_SCRIPTS, resolveSourceUrl } from './stockholm-public-core.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputArg = process.argv[2]?.startsWith('--') ? null : process.argv[2];
const output = path.resolve(outputArg ?? PUBLIC_OUTPUT);
const site = path.join(output, 'site');
assert.ok(isAllowedPublicOutput(output), 'test only accepts a landing-* child of the assigned output parent');

function testSafeResolver() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'stockholm-public-test-'));
  try {
    fs.mkdirSync(path.join(fixture, 'css'), { recursive: true });
    fs.mkdirSync(path.join(fixture, 'raw'), { recursive: true });
    fs.writeFileSync(path.join(fixture, 'css', 'base.css'), 'ok');
    fs.writeFileSync(path.join(fixture, '.env'), 'excluded');
    assert.equal(resolveSourceUrl(fixture, 'index.html', 'css/base.css')?.sourcePath, 'css/base.css');
    assert.throws(() => resolveSourceUrl(fixture, 'index.html', '%2e%2e/%2e%2e/outside.txt'), /Path escapes repository/);
    assert.throws(() => resolveSourceUrl(fixture, 'index.html', 'bad%ZZ.css'), /Malformed URL encoding/);
    assert.throws(() => resolveSourceUrl(fixture, 'index.html', '.env'), /Sensitive\/raw path/);
    assert.throws(() => resolveSourceUrl(fixture, 'index.html', 'raw/photo.webp'), /Sensitive\/raw path/);
    const linkPath = path.join(fixture, 'css', 'linked.css');
    try {
      fs.symlinkSync(path.join(fixture, 'css', 'base.css'), linkPath);
      assert.throws(() => resolveSourceUrl(fixture, 'index.html', 'css/linked.css'), /Symlink source is forbidden/);
    } catch (error) {
      if (error.code !== 'EPERM' && error.code !== 'EACCES' && !/Symlink source is forbidden/.test(error.message)) throw error;
    }
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}
testSafeResolver();
if (process.argv.includes('--unit-only')) {
  console.log('Stockholm public path safety checks passed.');
  process.exit(0);
}
assert.ok(fs.existsSync(path.join(output, 'manifest.json')), 'build manifest exists');
assert.ok(fs.existsSync(site), 'public site folder exists');
const manifest = JSON.parse(fs.readFileSync(path.join(output, 'manifest.json'), 'utf8'));
const inventory = manifest.files.map((entry) => entry.path.replace(/^site\//, ''));
const inventorySet = new Set(inventory);
assert.match(manifest.releaseId, /^landing-public-[0-9]{8}-[a-z0-9-]+$/);
assert.ok(manifest.routeAliases && typeof manifest.routeAliases === 'object', 'deployment route aliases are present');
for (const [route, target] of Object.entries(manifest.routeAliases)) {
  assert.match(route, /^\/[a-z0-9-]+\/$/i, `clean route alias is normalized: ${route}`);
  assert.ok(inventorySet.has(target), `route alias target is inventoried: ${route} -> ${target}`);
  assert.ok(inventorySet.has(`${route.slice(1)}index.html`), `route alias entry exists: ${route}`);
}

function outputPathForUrl(fromFile, value) {
  const url = new URL(value, 'https://public.test/');
  if (url.origin !== 'https://public.test') {
    if (url.hostname.toLowerCase() === 'yokhan.xyz') {
      if (url.pathname === '/') return 'index.html';
      const pathname = decodeURIComponent(url.pathname).replace(/^\/+/, '');
      return pathname.endsWith('/') ? `${pathname}index.html` : pathname;
    }
    assert.ok(PUBLIC_EXTERNAL_HOSTS.has(url.hostname.toLowerCase()), `unapproved external target: ${url.href}`);
    return null;
  }
  if (url.pathname === '/') return 'index.html';
  let pathname = decodeURIComponent(url.pathname).replace(/^\/+/, '');
  if (!pathname) return 'index.html';
  if (!pathname.includes('.') && !pathname.endsWith('/')) pathname += '/';
  if (pathname.endsWith('/')) return `${pathname}index.html`;
  return pathname;
}

function localExists(target, fromFile) {
  const resolved = path.resolve(site, target);
  assert.ok(resolved === site || resolved.startsWith(`${site}${path.sep}`), `output URL escapes site: ${fromFile} -> ${target}`);
  return fs.existsSync(resolved) && fs.statSync(resolved).isFile();
}

assert.ok(inventorySet.has('index.html'));
assert.ok(!inventory.some((file) => PUBLIC_PAGE_EXCLUDES.has(path.basename(file))));
assert.ok(!inventory.some((file) => FORBIDDEN_PATH.test(file) || FORBIDDEN_SUFFIX.test(file)), 'private and secret paths are excluded');
for (const entry of manifest.files) {
  const file = path.join(output, entry.path.replaceAll('/', path.sep));
  assert.ok(fs.existsSync(file), `manifest inventory file exists: ${entry.path}`);
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.length, entry.bytes, `size matches manifest: ${entry.path}`);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), entry.sha256, `output hash matches manifest: ${entry.path}`);
  if (entry.source && entry.sourceSha256) {
    const sourcePath = path.resolve(repo, entry.source);
    assert.ok(sourcePath === repo || sourcePath.startsWith(`${repo}${path.sep}`), `source path is confined: ${entry.source}`);
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(sourcePath)).digest('hex'), entry.sourceSha256, `source hash matches manifest: ${entry.source}`);
    assert.equal(typeof entry.dirty, 'boolean', `dirty state is recorded: ${entry.source}`);
  }
}

const htmlFiles = inventory.filter((file) => file.endsWith('.html'));
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(site, file), 'utf8');
  assert.doesNotMatch(html, /yokhanfitness\.ru/i, `${file} has no retired domain`);
  assert.doesNotMatch(html, /stockholm-preview|preview-disabled|Предпросмотр|preview notice/i, `${file} is production, not inert preview output`);
  assert.doesNotMatch(html, /mode=(?:register|reset|password-reset)/i, `${file} does not point to unavailable auth modes`);
  assert.doesNotMatch(html, /\son[a-z]+\s*=/i, `${file} has no inline event handlers`);
  assert.doesNotMatch(html, /<script\b(?![^>]*\btype\s*=\s*["']application\/ld\+json["'])[^>]*>(?!\s*<\/script>)[\s\S]*?<\/script\s*>/i, `${file} has no inline script`);

  const attrPattern = /\b(href|src|poster|action|formaction|data|srcset)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  for (const match of html.matchAll(attrPattern)) {
    const name = match[1].toLowerCase();
    const value = (match[2] ?? match[3] ?? match[4] ?? '').replaceAll('&amp;', '&');
    const urls = name === 'srcset'
      ? value.split(',').map((item) => item.trim().split(/\s+/, 1)[0])
      : [value];
    for (const raw of urls) {
      if (!raw || raw.startsWith('#') || raw.startsWith('?') || /^(?:mailto:|tel:|data:|blob:)/i.test(raw)) continue;
      const target = outputPathForUrl(file, raw);
      if (target) assert.ok(localExists(target, file), `local ${name} resolves: ${file} -> ${raw}`);
    }
  }

  for (const match of html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)) {
    const src = match[1].replaceAll('&amp;', '&');
    const target = outputPathForUrl(file, src);
    assert.ok(target && localExists(target, file), `script target exists: ${file} -> ${src}`);
    const relative = target.replace(/^\//, '');
    assert.ok(PUBLIC_SCRIPTS.has(relative), `only navigation scripts run: ${src}`);
  }
}

for (const file of inventory.filter((name) => name.endsWith('.css'))) {
  const css = fs.readFileSync(path.join(site, file), 'utf8');
  assert.doesNotMatch(css, /@import\s+(?:url\()?\s*["']?(?:https?:)?\/\//i, `${file} has no remote CSS imports`);
  assert.doesNotMatch(css, /url\(\s*["']?(?:https?:)?\/\//i, `${file} has no remote media/font URLs`);
  for (const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
    const raw = match[1].trim();
    if (!raw || raw === 'none' || /^(?:data:|blob:)/i.test(raw)) continue;
    const url = new URL(raw, `https://public.test/${file}`);
    assert.equal(url.origin, 'https://public.test', `CSS URL stays local: ${file} -> ${raw}`);
    const cleanRaw = decodeURIComponent(raw.split(/[?#]/, 1)[0]);
    const target = cleanRaw.startsWith('/')
      ? cleanRaw.replace(/^\/+/, '')
      : path.posix.normalize(path.posix.join(path.posix.dirname(file), cleanRaw));
    assert.ok(localExists(target, file), `CSS dependency exists: ${file} -> ${raw}`);
  }
}

const siteText = htmlFiles.map((file) => fs.readFileSync(path.join(site, file), 'utf8')).join('\n');
assert.match(siteText, /https:\/\/fitness\.yokhan\.xyz\/auth\?mode=login&amp;returnTo=%2Fhome/);
assert.match(siteText, /https:\/\/fitness\.yokhan\.xyz\/train\/guest/);
assert.match(siteText, /https:\/\/calls\.yokhan\.xyz\//);
assert.match(siteText, /https:\/\/t\.me\/yokhan_yokhan/);
assert.match(siteText, /32\s?000[\s\S]*48\s?000|48\s?000[\s\S]*32\s?000/);
assert.match(fs.readFileSync(path.join(site, 'account-unavailable.html'), 'utf8'), /Для входа в аккаунт перейдите в приложение/);
assert.match(fs.readFileSync(path.join(site, 'service-unavailable.html'), 'utf8'), /попробуйте тренировку без регистрации/);
assert.match(fs.readFileSync(path.join(site, 'projects.html'), 'utf8'), /portfolio\.yokhan\.xyz[\s\S]*giants\.yokhan\.xyz[\s\S]*courier\.yokhan\.xyz[\s\S]*gauss\.yokhan\.xyz/);
for (const route of ['method', 'ecosystem', 'start', 'programs', 'training', 'personal', 'routes', 'app', 'guide-overview', 'calls-access', 'nutrition', 'health']) {
  assert.ok(localExists(`${route}/index.html`, route), `root route alias exists: /${route}/`);
}
for (const page of inventory.filter((file) => /^program-[^/]+\.html$/.test(file))) {
  assert.ok(localExists(`${page.slice(0, -5)}/index.html`, page), `program route alias exists: /${page.slice(0, -5)}/`);
}
const home = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
const mainNav = home.match(/<nav\b[^>]*class="nav\b[\s\S]*?<\/nav>/i)?.[0] ?? '';
assert.ok(mainNav, 'canonical home header exists');
assert.match(mainNav, /nav__trigger/, 'approved navigation dropdowns are preserved');
assert.match(mainNav, /nav__mobile-toggle/, 'approved mobile menu is preserved');
assert.match(home, /src="\/js\/buffit-landing-home\.js\?v=[a-f0-9]+"/, 'home hydration runtime is preserved');
assert.doesNotMatch(home, /&amp;amp;/, 'HTML href values are escaped once');
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(site, file), 'utf8');
  assert.match(html, /data-buffit-design-style="logik" data-buffit-mode="light"/, file + ': deterministic profile default');
  assert.match(html, /data-public-profile-select="style"/, file + ': style selection');
  assert.match(html, /data-public-profile-select="mode"/, file + ': mode selection');
  assert.match(html, /src="\/js\/public-profile\.js\?v=[a-f0-9]+"/, file + ': shared persisted profile');
  assert.match(html, /href="\/assets\/buffit-favicon\.svg\?v=[a-f0-9]+"/, file + ': current identity');
  if (!/unavailable|routes\//.test(file)) assert.doesNotMatch(html, /Источник правды|Что еще нужно собрать|Почему это покупают|мужской визуальный оффер|Зачем это покупают|Человек покупает|Покупается не|Программы из бота|Нужно меньше спорить с зеркалом|прогревает неготовых|Похудеть навсегда|Горячий запрос|Теплый —/, file + ': public copy');
}
console.log(`Stockholm public package checks passed: ${inventory.length} files, ${htmlFiles.length} HTML pages, ${PUBLIC_SCRIPTS.size} allowed public scripts.`);

for (const file of ['index.html','start.html','links.html','app.html','calls-access.html','projects.html']) {
  const html=fs.readFileSync(path.join(site,file),'utf8');
  const nav=html.match(/<nav\b[\s\S]*?<\/nav>/i)?.[0] ?? '';
  assert.match(nav,/https:\/\/fitness\.yokhan\.xyz\//,file + ': APP navigation');
  assert.match(nav,/https:\/\/calls\.yokhan\.xyz\//,file + ': CALLS navigation');
  assert.match(nav,/programs\.html/,file + ': program navigation');
  assert.match(nav,/method\.html/,file + ': method navigation');
}
assert.doesNotMatch(home,/те же компоненты|декоративный мокап/);
