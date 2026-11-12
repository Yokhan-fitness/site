import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = path.resolve(process.argv[2] ?? '');
assert.ok(process.argv[2], 'pass the built landing artifact directory');
const site = path.join(root, 'site');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const files = fs.readdirSync(site, { recursive: true }).filter((entry) => fs.statSync(path.join(site, entry)).isFile()).map((entry) => entry.replaceAll('\\', '/'));
const listed = new Set(manifest.files.map((file) => file.path.slice('site/'.length)));
assert.equal(files.length, listed.size, 'every shipped file is listed exactly once');
assert.ok(!files.some((file) => /(^|[\\/])(?:\.env(?:\..*)?|raw|private|clients?|secrets?|\.git|\.session-cache)(?:[\\/]|$)/i.test(file)), 'no sensitive or raw artifact paths');

const htmlFiles = files.filter((file) => file.endsWith('.html'));
assert.ok(htmlFiles.includes('index.html') && htmlFiles.includes('coaching.html') && htmlFiles.includes('coach/index.html'));
assert.ok(!htmlFiles.includes('account.html'), 'account page is excluded');
const pageSet = new Set(htmlFiles.map((file) => file.replaceAll('\\', '/')));
const assetFiles = new Set(files.map((file) => file.replaceAll('\\', '/')));
const remote = /^(?:https?:)?\/\//i;
function localTarget(owner, raw) {
  const value = raw.trim().replaceAll('&amp;', '&').split(/[?#]/, 1)[0];
  if (!value || value.startsWith('#') || /^(?:mailto:|tel:|javascript:|data:|blob:)/i.test(value)) return null;
  const normalized = path.posix.normalize(value.startsWith('/') ? value.slice(1) : path.posix.join(path.posix.dirname(owner), value));
  return normalized.endsWith('/') ? `${normalized}index.html` : normalized;
}

for (const filename of htmlFiles) {
  const text = fs.readFileSync(path.join(site, filename), 'utf8');
  assert.match(text, /Предпросмотр/, `${filename} has visible preview notice`);
  assert.doesNotMatch(text, /<form\b|<iframe\b|<object\b|<embed\b|<meta\b[^>]*http-equiv\s*=\s*["']?refresh/i, `${filename} has no active form/embed/redirect`);
  assert.doesNotMatch(text, /<link\b(?=[^>]*\brel\s*=\s*["'][^"']*\b(?:canonical|alternate)\b)[^>]*>/i, `${filename} has no canonical or alternate crawler URL`);
  for (const meta of text.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = meta[0];
    const label = tag.match(/\b(?:property|name)\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    const content = tag.match(/\bcontent\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    const key = (label?.[1] ?? label?.[2] ?? '').toLowerCase();
    const value = content?.[1] ?? content?.[2] ?? '';
    assert.ok(!(/^(?:og|twitter):/.test(key) && /^(?:https?:)?\/\//i.test(value)), `${filename} retains remote crawler metadata ${key}`);
  }
  assert.doesNotMatch(text, /<script\b[^>]*\bsrc\s*=\s*["'](?:https?:)?\/\//i, `${filename} does not load a remote script`);
  for (const match of text.matchAll(/\b(href|src|poster|action|formaction|data|srcset)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
    const key = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? '';
    if (key === 'href' && (value.startsWith('#') || value.startsWith('?'))) continue;
    for (const entry of (key === 'srcset' ? value.split(',').map((item) => item.trim().split(/\s+/, 1)[0]) : [value])) {
      assert.ok(!remote.test(entry), `${filename} retains remote ${key}: ${entry}`);
      if (!entry || entry.startsWith('#') || /^(?:mailto:|tel:|javascript:|data:|blob:)/i.test(entry)) continue;
      const target = localTarget(filename, entry);
      if (!target) continue;
      if (key === 'href' && /\.html?$/i.test(target)) assert.ok(pageSet.has(target), `${filename} has unresolved local page ${entry}`);
      else if (key !== 'href') assert.ok(assetFiles.has(target), `${filename} has unresolved local resource ${entry} -> ${target}`);
    }
  }
  for (const match of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
    const value = match[1].trim();
    assert.ok(!remote.test(value), `${filename} contains remote inline media ${value}`);
    if (value === 'none') continue;
    const target = path.posix.normalize(path.posix.join(path.posix.dirname(filename), value));
    assert.ok(assetFiles.has(target), `${filename} has missing inline CSS dependency ${value}`);
  }
}
for (const filename of files.filter((file) => file.endsWith('.css'))) {
  const css = fs.readFileSync(path.join(site, filename), 'utf8');
  for (const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
    const value = match[1].trim();
    assert.ok(!remote.test(value), `${filename} references remote media/font ${value}`);
    const target = path.posix.normalize(path.posix.join(path.posix.dirname(filename.replaceAll('\\', '/')), value));
    assert.ok(assetFiles.has(target), `${filename} has missing CSS dependency ${value}`);
  }
}
for (const file of manifest.files) {
  const destination = path.join(site, file.path.slice('site/'.length));
  assert.equal(sha256(fs.readFileSync(destination)), file.sha256, `hash matches manifest: ${file.path}`);
  assert.equal(typeof file.dirty, 'boolean', `source dirty state is recorded: ${file.path}`);
}
const coach = fs.readFileSync(path.join(site, 'coach/index.html'), 'utf8');
const coaching = fs.readFileSync(path.join(site, 'coaching.html'), 'utf8');
assert.match(coach, /href="\/coaching\.html\?from=coach"/);
assert.match(coaching, /data-preview-target="buffit_coaching"/);
assert.match(coaching, /32 000\s*₽\/мес/);
assert.match(coaching, /48 000\s*₽\/мес/);
assert.match(manifest.source.commit, /^[0-9a-f]{40}$/);
assert.equal(manifest.source.snapshot.startsWith('dirty worktree inputs recorded'), true);
const nginxPath = path.join(root, 'nginx-stockholm-preview.conf');
const nginx = fs.readFileSync(nginxPath, 'utf8');
assert.match(nginx, /listen\s+127\.0\.0\.1:18089;/);
assert.doesNotMatch(nginx, /listen\s+(?:443|0\.0\.0\.0|\[::\]|\*:)/i);
assert.match(nginx, /connect-src 'none'/);
assert.match(nginx, /form-action 'none'/);
assert.match(nginx, /Cache-Control "no-store"/);
assert.match(nginx, /X-Robots-Tag "noindex/);
const profileSource = fs.readFileSync(path.resolve('deploy/nginx/stockholm-preview-loopback.conf'));
assert.equal(sha256(profileSource), manifest.nginxProfile.sha256);
assert.equal(sha256(fs.readFileSync(nginxPath)), manifest.nginxProfile.sha256);
assert.equal(typeof manifest.nginxProfile.dirty, 'boolean');
if (process.argv[3]) {
  const archive = path.resolve(process.argv[3]);
  const extractRoot = fs.mkdtempSync(path.join(root, '.extract-check-'));
  try {
    execFileSync('tar', ['-xzf', archive, '-C', extractRoot], { stdio: 'pipe' });
    const extracted = path.join(extractRoot, path.basename(root));
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(extracted, 'manifest.json'), 'utf8')), manifest);
    for (const file of manifest.files) {
      assert.equal(sha256(fs.readFileSync(path.join(extracted, file.path))), file.sha256, `extractable archive entry: ${file.path}`);
    }
  } finally {
    fs.rmSync(extractRoot, { recursive: true, force: true });
  }
}
console.log(`PASS: ${files.length} files, local dependency closure, safety policy, source hashes, acquisition path, prices`);
