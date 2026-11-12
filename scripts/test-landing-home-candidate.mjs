import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { readLandingHomeCandidate, homepageCandidatePinsetSha256 } from './landing-home-candidate.mjs';
import { buildPublicSite, isAllowedPublicOutput } from './stockholm-public-core.mjs';

const managedRoot = process.env.AGENT_RUN_OUTPUT;
assert.ok(managedRoot, 'focused fixture suite must run through managed-temp');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const canonical = value => Array.isArray(value) ? `[${value.map(canonical).join(',')}]`
  : value && typeof value === 'object' ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`
    : JSON.stringify(value);
const signature = [
  'site-header', 'public-hero', 'landing-home-changes', 'landing-home-training',
  'landing-home-adaptive', 'landing-section-formats', 'landing-section-cases',
  'landing-decision-card', 'landing-decision-card', 'landing-cta', 'landing-footer',
];
const sourceSha256 = '1'.repeat(64);
const basePins = {
  source: sourceSha256,
  parser: '2'.repeat(64), compiler: '3'.repeat(64), schema: '4'.repeat(64), registry: '5'.repeat(64),
  renderer: '6'.repeat(64), tokens: '7'.repeat(64), fonts: '8'.repeat(64), media: '',
};
const pngBytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]);
const fontBytes = Buffer.from('tiny synthetic font');
const candidateStylesheetPath = 'css/buffit-home-markdown-ABCD2345.css';
const candidateRuntimePath = 'js/buffit-landing-home-markdown-EFGH5672.js';
const candidateFontPath = 'css/buffit-home-markdown-assets/font.woff2';
const stylesheetBytes = Buffer.from('@font-face{font-family:test;src:url("buffit-home-markdown-assets/font.woff2")}\n');
const runtimeBytes = Buffer.from('document.documentElement.dataset.runtime="candidate";');
const componentBytes = Buffer.from('{"version":1,"owner":"@buffit/design-system"}');
const mediaPath = '/landing-media/page.png';
const mediaEntry = { ref: mediaPath, sha256: sha(pngBytes), byteLength: pngBytes.length, mime: 'image/png' };
const entries = [mediaEntry];
basePins.media = sha(Buffer.from(canonical(entries), 'utf8'));

function freshRoot(prefix) {
  return fs.mkdtempSync(path.join(managedRoot, `${prefix}-`));
}

function put(root, relative, bytes) {
  const destination = path.join(root, ...relative.split('/'));
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, bytes);
}

function makeIndex(payload) {
  return Buffer.from(`<!doctype html><html lang="ru"><head><link rel="stylesheet" href="/${candidateStylesheetPath}"><title>Кандидат</title></head><body><main data-buffit-page-model="landing-home-markdown-v1" data-landing-home-root=""><div data-public-header-root="true"></div><div data-landing-component="public-hero"></div><section class="buffit-landing-home-changes"></section><a id="training"></a><a id="system"></a><div data-landing-section="formats"></div><div data-landing-section="cases"></div><article class="buffit-landing-decision-card card-one"></article><article class="buffit-landing-decision-card card-two"></article><div class="buffit-landing-cta action"><a href="https://t.me/yokhan_yokhan">Написать Игорю</a><a href="https://kitchen.yokhan.xyz/food/">Открыть «Еду»</a></div><footer class="buffit-landing-footer"></footer><img src="${mediaPath}" alt="fixture"></main><script id="landing-home-model" type="application/json">${JSON.stringify(payload)}</script><script defer src="/${candidateRuntimePath}"></script></body></html>`, 'utf8');
}

function makeCandidate(root = freshRoot('candidate')) {
  const candidateRoot = path.join(root, 'candidate');
  fs.mkdirSync(candidateRoot, { recursive: true });
  put(candidateRoot, candidateStylesheetPath, stylesheetBytes);
  put(candidateRoot, candidateFontPath, fontBytes);
  put(candidateRoot, candidateRuntimePath, runtimeBytes);
  put(candidateRoot, 'landing-media/page.png', pngBytes);
  put(candidateRoot, 'contracts/landing-component-manifest.json', componentBytes);
  const modelWithoutDigest = {
    schemaVersion: 1,
    pageId: 'buffit.home',
    document: {
      id: 'buffit.home', owner: 'YokhanFitnessLanding', routeRef: '/', source_mode: 'markdown',
      sections: [], content: {},
    },
    metadata: {}, inlineSlots: {}, source: { path: 'content/pages/home.md', sha256: sourceSha256 },
    sourceMap: {}, mediaManifest: { entries, sha256: basePins.media }, pins: { ...basePins },
  };
  const model = { ...modelWithoutDigest, contentDigest: sha(Buffer.from(canonical(modelWithoutDigest), 'utf8')) };
  const payload = { model, mediaUrls: { [mediaPath]: mediaPath } };
  const indexBytes = makeIndex(payload);
  const manifest = {
    schemaVersion: 2,
    source: {
      component: 'BuffItLandingHomeScreen', designStyle: 'logik', materialMode: 'light', materialStyle: 'flat',
      storyId: 'buff-it-design-system-07-screens-public-web-landing-home--desktop-public-home',
      viewport: 'responsive', contentPath: 'content/pages/home.md', contentSha256: sourceSha256,
      contentDigest: model.contentDigest,
    },
    pageSignature: signature,
    pins: { ...basePins },
    mediaProvenance: { [mediaPath]: { output: mediaPath, sourceLabel: 'landing-media', sha256: sha(pngBytes), byteLength: pngBytes.length, mime: 'image/png' } },
    outputs: {
      componentManifestSha256: sha(componentBytes), indexSha256: sha(indexBytes),
      runtimeScript: candidateRuntimePath, runtimeScriptSha256: sha(runtimeBytes),
      stylesheet: candidateStylesheetPath, stylesheetSha256: sha(stylesheetBytes),
      stylesheetAssets: [{ path: candidateFontPath, sha256: sha(fontBytes) }],
    },
    media: { [mediaPath]: sha(pngBytes) },
    sources: { 'content/pages/home.md': sourceSha256 },
    files: {
      'index.html': sha(indexBytes),
      [candidateStylesheetPath]: sha(stylesheetBytes),
      [candidateFontPath]: sha(fontBytes),
      [candidateRuntimePath]: sha(runtimeBytes),
      'landing-media/page.png': sha(pngBytes),
      'contracts/landing-component-manifest.json': sha(componentBytes),
    },
  };
  manifest.pageModelDigest = sha(Buffer.from(canonical({
    contentDigest: model.contentDigest, modelPins: model.pins, sourceHashes: manifest.sources, files: manifest.files,
  }), 'utf8'));
  put(candidateRoot, 'index.html', indexBytes);
  const manifestBytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
  put(candidateRoot, 'contracts/landing-home-static-manifest.json', manifestBytes);
  const expected = {
    schemaVersion: 1, sourceSha256, contentDigest: model.contentDigest,
    manifestSha256: sha(manifestBytes), pins: { ...basePins },
  };
  return { root: candidateRoot, expected, manifest, indexBytes };
}

function rewriteManifest(candidate, mutate) {
  const manifestPath = path.join(candidate.root, 'contracts/landing-home-static-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  mutate(manifest);
  const payload = JSON.parse(fs.readFileSync(path.join(candidate.root, 'index.html'), 'utf8').match(/<script id="landing-home-model" type="application\/json">([\s\S]*?)<\/script>/)[1]);
  manifest.pageModelDigest = sha(Buffer.from(canonical({
    contentDigest: payload.model.contentDigest,
    modelPins: payload.model.pins,
    sourceHashes: manifest.sources,
    files: manifest.files,
  }), 'utf8'));
  const bytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
  put(candidate.root, 'contracts/landing-home-static-manifest.json', bytes);
  candidate.expected.manifestSha256 = sha(bytes);
  return manifest;
}

const requiredApps = ['public', 'app', 'calls', 'auth', 'guide', 'programs', 'coaching', 'method', 'start', 'safety', 'ecosystem', 'portfolio', 'kitchen', 'guest', 'telegram'];
function makePublicRepo(candidate, root = freshRoot('public-repo')) {
  const apps = requiredApps.map(id => ({
    id, label: id,
    href: id === 'public' ? 'https://yokhan.xyz/' : id === 'telegram' ? 'https://t.me/yokhan_yokhan' : `https://fitness.yokhan.xyz/${id}`,
    surfaces: ['public'],
    ...(id === 'app' ? { loginHref: 'https://fitness.yokhan.xyz/auth?mode=login&returnTo=%2Fhome', accountHref: 'https://fitness.yokhan.xyz/account' } : {}),
  }));
  const appById = Object.fromEntries(apps.map(item => [item.id, item]));
  const registry = {
    schemaVersion: 1, publicOrigin: 'https://yokhan.xyz', apps,
    header: { public: {
      brandHref: 'https://yokhan.xyz/',
      account: { entryId: 'app', loginHref: appById.app.loginHref, accountHref: appById.app.accountHref },
      groups: [{ id: 'fixture', links: requiredApps }],
    } },
    returnTo: { allowedOrigins: ['https://yokhan.xyz', 'https://fitness.yokhan.xyz', 'https://t.me'] },
  };
  const nav = `<nav class="nav">${apps.map(item => `<a href="${item.href}">${item.label}</a>`).join('')}<a href="${appById.app.loginHref}">login</a><a href="${appById.app.accountHref}">account</a></nav>`;
  put(root, 'data/ecosystem.apps.json', Buffer.from(JSON.stringify(registry)));
  put(root, 'app.html', Buffer.from('<!doctype html><html><head><title>App</title><meta name="description" content="App"></head><body><main>Generated page fixture.</main></body></html>'));
  put(root, 'index.html', Buffer.from(`<!doctype html><html><head><title>Legacy home</title><link rel="stylesheet" href="css/buffit-home-system.css"></head><body>${nav}<main>Legacy home bytes</main><script defer src="js/buffit-landing-home.js"></script></body></html>`));
  put(root, 'about.html', Buffer.from('<!doctype html><html><head><title>About</title></head><body><main id="about">Other route remains.</main><script defer src="/js/buffit-landing-home.js"></script></body></html>'));
  put(root, 'css/buffit-home-system.css', stylesheetBytes);
  put(root, 'css/buffit-home-assets/font.woff2', fontBytes);
  put(root, 'css/public-profile.css', Buffer.from('.profile{display:block}'));
  put(root, 'js/buffit-landing-home.js', Buffer.from('window.legacyHomeMedia="/landing-media/legacy-only.webp";'));
  put(root, 'js/nav-menu.js', Buffer.from('window.navMenu=true;'));
  put(root, 'js/public-profile.js', Buffer.from('window.profile=true;'));
  put(root, 'js/public-account.js', Buffer.from('window.account=true;'));
  put(root, 'landing-media/legacy-only.webp', Buffer.from('legacy media'));
  put(root, 'assets/buffit-favicon.svg', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'));
  put(root, 'coach/favicon.svg', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'));
  execFileSync('git', ['init', '--quiet'], { cwd: root });
  execFileSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'add', '.'], { cwd: root });
  execFileSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '--quiet', '-m', 'fixture'], { cwd: root });
  return root;
}

test('candidate reader requires complete expected source, manifest digest and pins', () => {
  const fixture = makeCandidate();
  const read = readLandingHomeCandidate(fixture);
  assert.equal(read.sourceSha256, sourceSha256);
  assert.equal(read.manifestSha256, fixture.expected.manifestSha256);
  assert.equal(read.publicFiles.get(candidateRuntimePath).toString(), runtimeBytes.toString());
  assert.equal(homepageCandidatePinsetSha256(read.pins), homepageCandidatePinsetSha256(fixture.expected.pins));
  assert.throws(() => readLandingHomeCandidate({ ...fixture, expected: { ...fixture.expected, sourceSha256: '9'.repeat(64) } }), /stale/);
  assert.throws(() => readLandingHomeCandidate({ ...fixture, expected: { ...fixture.expected, pins: { ...fixture.expected.pins, compiler: '9'.repeat(64) } } }), /pinset/);
  assert.throws(() => readLandingHomeCandidate({ ...fixture, expected: { sourceSha256 } }), /exact controlled expected/);
});

test('candidate rejects missing, extra, corrupt and malformed entries', () => {
  const missing = makeCandidate();
  fs.rmSync(path.join(missing.root, candidateFontPath));
  assert.throws(() => readLandingHomeCandidate(missing), /ENOENT|missing/);

  const extra = makeCandidate();
  put(extra.root, 'notes.txt', Buffer.from('not part of the exact candidate'));
  assert.throws(() => readLandingHomeCandidate(extra), /inventory does not match|closure is not exact/);

  const corrupt = makeCandidate();
  put(corrupt.root, candidateRuntimePath, Buffer.from('altered runtime'));
  assert.throws(() => readLandingHomeCandidate(corrupt), /output hash/);

  const malformed = makeCandidate();
  const broken = Buffer.from('{ invalid json');
  put(malformed.root, 'contracts/landing-home-static-manifest.json', broken);
  malformed.expected.manifestSha256 = sha(broken);
  assert.throws(() => readLandingHomeCandidate(malformed), /malformed JSON/);
});

test('candidate rejects noncanonical path escapes before reading any target', () => {
  const escaped = makeCandidate();
  const manifestPath = path.join(escaped.root, 'contracts/landing-home-static-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.outputs.stylesheet = '../../outside.css';
  const bytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
  put(escaped.root, 'contracts/landing-home-static-manifest.json', bytes);
  escaped.expected.manifestSha256 = sha(bytes);
  assert.throws(() => readLandingHomeCandidate(escaped), /canonical/);
});

test('candidate requires every declared byte hash, including fonts, to match before first read', () => {
  const changedFont = makeCandidate();
  put(changedFont.root, candidateFontPath, Buffer.from('font changed before initial read'));
  assert.throws(() => readLandingHomeCandidate(changedFont), /stylesheet asset hash mismatch|file hash does not match/);

  const missingHash = makeCandidate();
  rewriteManifest(missingHash, manifest => delete manifest.files[candidateRuntimePath]);
  assert.throws(() => readLandingHomeCandidate(missingHash), /file hash map/);

  const extraHash = makeCandidate();
  rewriteManifest(extraHash, manifest => { manifest.files['js/extra.js'] = sha(Buffer.from('not present')); });
  assert.throws(() => readLandingHomeCandidate(extraHash), /file hash map/);
});

test('candidate rejects symlink escapes and reports mutation after read', t => {
  const linked = makeCandidate();
  const target = path.join(linked.root, candidateFontPath);
  const outside = path.join(managedRoot, 'outside-font.bin');
  fs.writeFileSync(outside, fontBytes);
  fs.rmSync(target);
  let symlinkAvailable = true;
  try { fs.symlinkSync(outside, target, 'file'); }
  catch (error) {
    if (['EPERM', 'EACCES', 'ENOTSUP', 'UNKNOWN'].includes(error.code)) {
      symlinkAvailable = false;
      t.diagnostic(`Symlink creation unavailable: ${error.code}`);
    }
    else throw error;
  }
  if (symlinkAvailable) assert.throws(() => readLandingHomeCandidate(linked), /symlink is forbidden/);

  const changed = makeCandidate();
  const snapshot = readLandingHomeCandidate(changed);
  put(changed.root, candidateRuntimePath, Buffer.from('mutated after snapshot'));
  assert.throws(() => snapshot.verifyUnchanged(), /changed before package promotion/);
});

test('authored package preserves compiled home bytes and every non-home baseline file', () => {
  const candidate = makeCandidate();
  const repo = makePublicRepo(candidate);
  const baselineOutput = path.join(managedRoot, 'landing-baseline');
  const authoredOutput = path.join(managedRoot, 'landing-authored');
  assert.ok(isAllowedPublicOutput(baselineOutput));
  const baseline = buildPublicSite({ repo, output: baselineOutput });
  const baselineFiles = new Map(baseline.manifest.files
    .filter(entry => !entry.path.endsWith('/index.html') || entry.path === 'site/about.html')
    .filter(entry => entry.path.startsWith('site/') && entry.path !== 'site/index.html'
      && entry.path !== 'site/landing-media/legacy-only.webp')
    .map(entry => [entry.path, fs.readFileSync(path.join(baselineOutput, entry.path))]));
  const built = buildPublicSite({ repo, output: authoredOutput, homepageCandidate: candidate });
  const outputRoot = path.join(authoredOutput, 'site');
  assert.deepEqual(fs.readFileSync(path.join(outputRoot, 'index.html')), candidate.indexBytes, 'compiled home stays byte-identical');
  assert.deepEqual(fs.readFileSync(path.join(outputRoot, candidateStylesheetPath)), stylesheetBytes, 'candidate stylesheet stays byte-identical');
  assert.deepEqual(fs.readFileSync(path.join(outputRoot, candidateRuntimePath)), runtimeBytes, 'candidate runtime stays byte-identical');
  assert.equal(fs.existsSync(path.join(outputRoot, 'landing-media/legacy-only.webp')), false, 'legacy-only home media is omitted');
  for (const [relative, bytes] of baselineFiles) {
    assert.deepEqual(fs.readFileSync(path.join(authoredOutput, relative)), bytes, `non-home output unchanged: ${relative}`);
  }
  assert.equal(built.manifest.homepageCandidate.manifestSha256, candidate.expected.manifestSha256);
  assert.equal(built.manifest.homepageCandidate.sourceSha256, candidate.expected.sourceSha256);
  assert.equal(built.manifest.homepageCandidate.pinsetSha256, homepageCandidatePinsetSha256(candidate.expected.pins));
  assert.match(fs.readFileSync(path.join(outputRoot, 'index.html'), 'utf8'), /href="https:\/\/t\.me\/yokhan_yokhan"/);
});

test('candidate failure leaves no output or staging tree and never overwrites an existing output', () => {
  const candidate = makeCandidate();
  const repo = makePublicRepo(candidate);
  const invalid = { ...candidate, expected: { ...candidate.expected, sourceSha256: '9'.repeat(64) } };
  const failedOutput = path.join(managedRoot, 'landing-invalid');
  assert.throws(() => buildPublicSite({ repo, output: failedOutput, homepageCandidate: invalid }), /stale/);
  assert.equal(fs.existsSync(failedOutput), false);
  assert.equal(fs.readdirSync(managedRoot).some(name => name.startsWith('.landing-site-stage-')), false);

  const existingOutput = path.join(managedRoot, 'landing-existing');
  fs.mkdirSync(existingOutput);
  fs.writeFileSync(path.join(existingOutput, 'owned.txt'), 'keep me');
  assert.throws(() => buildPublicSite({ repo, output: existingOutput, homepageCandidate: candidate }), /refusing overwrite/);
  assert.equal(fs.readFileSync(path.join(existingOutput, 'owned.txt'), 'utf8'), 'keep me');
});

test('authored link validation admits the source-owned food app route and rejects unknown hosts', () => {
  const candidate = makeCandidate();
  const indexPath = path.join(candidate.root, 'index.html');
  const indexBytes = fs.readFileSync(indexPath, 'utf8').replace('</body>', '<a href="https://outside.example.invalid/path">external</a></body>');
  put(candidate.root, 'index.html', Buffer.from(indexBytes));
  rewriteManifest(candidate, manifest => {
    manifest.outputs.indexSha256 = sha(Buffer.from(indexBytes));
    manifest.files['index.html'] = sha(Buffer.from(indexBytes));
  });
  const repo = makePublicRepo(candidate);
  const output = path.join(managedRoot, 'landing-disallowed-external');
  assert.throws(() => buildPublicSite({ repo, output, homepageCandidate: candidate }), /disallowed external URL/);
  assert.equal(fs.existsSync(output), false);
});

test('failed staged write is removed before promotion', () => {
  const candidate = makeCandidate();
  const repo = makePublicRepo(candidate);
  const output = path.join(managedRoot, 'landing-stage-failure');
  const originalWriteFile = fs.writeFileSync;
  fs.writeFileSync = function patchedWriteFile(file, ...args) {
    if (String(file).includes('.landing-site-stage-') && String(file).endsWith(`${path.sep}about.html`)) {
      throw new Error('fixture stage write failure');
    }
    return originalWriteFile.call(fs, file, ...args);
  };
  try {
    assert.throws(() => buildPublicSite({ repo, output, homepageCandidate: candidate }), /fixture stage write failure/);
  } finally { fs.writeFileSync = originalWriteFile; }
  assert.equal(fs.existsSync(output), false);
  assert.equal(fs.readdirSync(managedRoot).some(name => name.startsWith('.landing-site-stage-')), false);
});
