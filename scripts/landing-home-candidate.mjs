import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const SHA256 = /^[a-f0-9]{64}$/;
const SOURCE_PATH = 'content/pages/home.md';
const MANIFEST_PATH = 'contracts/landing-home-static-manifest.json';
const COMPONENT_MANIFEST_PATH = 'contracts/landing-component-manifest.json';
const INDEX_PATH = 'index.html';
const PIN_KEYS = ['source', 'parser', 'compiler', 'schema', 'registry', 'renderer', 'tokens', 'fonts', 'media'];
const PAGE_SIGNATURE = [
  'site-header', 'public-hero', 'landing-home-changes', 'landing-home-training',
  'landing-home-adaptive', 'landing-section-formats', 'landing-section-cases',
  'landing-decision-card', 'landing-decision-card', 'landing-cta', 'landing-footer',
];
const MANIFEST_KEYS = ['schemaVersion', 'source', 'pageSignature', 'pageModelDigest', 'pins', 'mediaProvenance', 'outputs', 'media', 'sources', 'files'];
const SOURCE_KEYS = ['component', 'designStyle', 'materialMode', 'materialStyle', 'storyId', 'viewport', 'contentPath', 'contentSha256', 'contentDigest'];
const OUTPUT_KEYS = ['componentManifestSha256', 'indexSha256', 'runtimeScript', 'runtimeScriptSha256', 'stylesheet', 'stylesheetSha256', 'stylesheetAssets'];
const MODEL_KEYS = ['schemaVersion', 'pageId', 'document', 'metadata', 'inlineSlots', 'source', 'sourceMap', 'mediaManifest', 'pins', 'contentDigest'];
const DOCUMENT_KEYS = ['id', 'owner', 'routeRef', 'source_mode', 'sections', 'content'];
const MAX_CANDIDATE_BYTES = 96 * 1024 * 1024;
const MAX_CANDIDATE_FILES = 2048;
const MAX_CANDIDATE_DIRECTORIES = 512;

const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sortedJson = value => {
  if (Array.isArray(value)) return `[${value.map(sortedJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${sortedJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
};

function hasExactKeys(value, keys) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    && sortedJson(Object.keys(value).sort()) === sortedJson([...keys].sort());
}

function requireHash(value, label) {
  if (typeof value !== 'string' || !SHA256.test(value)) throw new Error(`Homepage candidate ${label} must be a lowercase SHA-256 digest.`);
}

function canonicalRelative(value, label) {
  if (typeof value !== 'string' || value.length === 0 || value.includes('\\') || value.includes('\0')
    || value.includes(':') || value.includes('%') || value.startsWith('/') || path.posix.isAbsolute(value)
    || value.split('/').some(part => part === '' || part === '.' || part === '..')) {
    throw new Error(`Homepage candidate ${label} path is not canonical.`);
  }
  return value;
}

function assertWithin(root, target, label) {
  const fromRoot = path.relative(root, target);
  if (!fromRoot || fromRoot === '..' || fromRoot.startsWith(`..${path.sep}`) || path.isAbsolute(fromRoot)) {
    throw new Error(`Homepage candidate ${label} escaped its root.`);
  }
}

function sameIdentity(left, right) {
  return left.dev === right.dev && left.ino === right.ino && left.size === right.size
    && left.mtimeNs === right.mtimeNs && left.ctimeNs === right.ctimeNs;
}

function readStableFile(rootReal, relativePath, maxBytes = MAX_CANDIDATE_BYTES) {
  canonicalRelative(relativePath, 'file');
  const absolute = path.resolve(rootReal, ...relativePath.split('/'));
  assertWithin(rootReal, absolute, 'file');
  let cursor = rootReal;
  for (const segment of relativePath.split('/')) {
    cursor = path.join(cursor, segment);
    const lstat = fs.lstatSync(cursor, { bigint: true });
    if (lstat.isSymbolicLink()) throw new Error(`Homepage candidate symlink is forbidden: ${relativePath}.`);
    if (cursor !== absolute && !lstat.isDirectory()) throw new Error(`Homepage candidate parent is not a directory: ${relativePath}.`);
  }
  const real = fs.realpathSync(absolute);
  assertWithin(rootReal, real, 'file');
  const flags = fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0);
  const fd = fs.openSync(absolute, flags);
  try {
    const before = fs.fstatSync(fd, { bigint: true });
    if (!before.isFile()) throw new Error(`Homepage candidate entry is not a regular file: ${relativePath}.`);
    if (before.size > BigInt(maxBytes)) throw new Error('Homepage candidate file exceeds the bounded read limit.');
    const chunks = [];
    let total = 0;
    while (true) {
      const remaining = maxBytes - total;
      const chunk = Buffer.allocUnsafe(Math.min(64 * 1024, remaining + 1));
      const count = fs.readSync(fd, chunk, 0, chunk.length, null);
      if (count === 0) break;
      total += count;
      if (total > maxBytes) throw new Error('Homepage candidate file grew beyond the bounded read limit.');
      chunks.push(chunk.subarray(0, count));
    }
    const bytes = Buffer.concat(chunks, total);
    const after = fs.fstatSync(fd, { bigint: true });
    const lstatAfter = fs.lstatSync(absolute, { bigint: true });
    if (!sameIdentity(before, after) || !sameIdentity(after, lstatAfter) || lstatAfter.isSymbolicLink()
      || fs.realpathSync(absolute) !== real || BigInt(bytes.length) !== after.size) {
      throw new Error(`Homepage candidate changed while it was read: ${relativePath}.`);
    }
    return { bytes, identity: after, sha256: sha256(bytes) };
  } finally {
    fs.closeSync(fd);
  }
}

function listCandidateFiles(rootReal) {
  const files = [];
  const directories = [];
  const visit = (directory, prefix = '', depth = 0) => {
    if (files.length > MAX_CANDIDATE_FILES || directories.length > MAX_CANDIDATE_DIRECTORIES) {
      throw new Error('Homepage candidate exceeds the bounded file inventory limit.');
    }
    if (depth > 32) throw new Error('Homepage candidate exceeds the bounded directory depth.');
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const name = entry.name;
      const relativePath = prefix ? `${prefix}/${name}` : name;
      canonicalRelative(relativePath, 'tree entry');
      const absolute = path.join(directory, name);
      const lstat = fs.lstatSync(absolute, { bigint: true });
      if (files.length >= MAX_CANDIDATE_FILES || directories.length >= MAX_CANDIDATE_DIRECTORIES) {
        throw new Error('Homepage candidate exceeds the bounded file inventory limit.');
      }
      if (lstat.isSymbolicLink()) throw new Error(`Homepage candidate symlink is forbidden: ${relativePath}.`);
      if (lstat.isDirectory()) {
        directories.push(relativePath);
        visit(absolute, relativePath, depth + 1);
      } else if (lstat.isFile()) files.push(relativePath);
      else throw new Error(`Homepage candidate contains a non-regular entry: ${relativePath}.`);
    }
  };
  visit(rootReal);
  return { files: files.sort(), directories: directories.sort() };
}

function urlPathFromCss(value, stylesheetPath) {
  const raw = value.trim().replaceAll('&amp;', '&');
  if (!raw || raw.startsWith('#') || /^(?:data:|blob:)/i.test(raw)) return null;
  if (/^(?:https?:)?\/\//i.test(raw) || /^(?:javascript|file):/i.test(raw)) {
    throw new Error('Homepage candidate CSS contains an external or executable asset URL.');
  }
  const pathname = raw.split(/[?#]/, 1)[0];
  if (!pathname) return null;
  const resolved = pathname.startsWith('/') ? pathname.slice(1) : path.posix.join(path.posix.dirname(stylesheetPath), pathname);
  const normalized = path.posix.normalize(resolved);
  if (normalized.startsWith('../') || normalized === '..' || normalized.startsWith('/')) {
    throw new Error('Homepage candidate CSS asset path escapes its root.');
  }
  const canonical = canonicalRelative(normalized, 'CSS asset');
  if (!canonical.startsWith('css/buffit-home-markdown-assets/')) {
    throw new Error('Homepage candidate stylesheet assets must stay in the authored CSS asset namespace.');
  }
  return canonical;
}

function candidateHtmlResourcePaths(indexHtml, manifest) {
  const found = new Set();
  const attrs = /\b(?:href|src|poster|action|formaction|data)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  for (const match of indexHtml.matchAll(attrs)) {
    const raw = (match[1] ?? match[2] ?? match[3] ?? '').replaceAll('&amp;', '&').trim();
    if (!raw || raw.startsWith('#') || raw.startsWith('?') || /^(?:https?:|mailto:|tel:|data:|blob:)/i.test(raw)) continue;
    const pathname = raw.split(/[?#]/, 1)[0];
    if (!pathname) continue;
    const normalized = path.posix.normalize(pathname.startsWith('/') ? pathname.slice(1) : pathname);
    if (normalized === 'index.html' || normalized === manifest.outputs.stylesheet
      || normalized === manifest.outputs.runtimeScript || normalized.startsWith('landing-media/')) {
      found.add(canonicalRelative(normalized, 'HTML resource'));
    }
  }
  if (!found.has(manifest.outputs.stylesheet) || !found.has(manifest.outputs.runtimeScript)) {
    throw new Error('Homepage candidate index does not reference its manifest-pinned stylesheet and runtime.');
  }
  return found;
}

function verifyCandidateModel({ manifest, indexHtml, expected }) {
  if (!hasExactKeys(manifest, MANIFEST_KEYS)) throw new Error('Homepage candidate manifest has missing or unknown fields.');
  if (manifest.schemaVersion !== 2 || !hasExactKeys(manifest.source, SOURCE_KEYS)
    || !hasExactKeys(manifest.outputs, OUTPUT_KEYS)) throw new Error('Homepage candidate manifest schema is unsupported.');
  if (manifest.source.component !== 'BuffItLandingHomeScreen' || manifest.source.designStyle !== 'logik'
    || manifest.source.materialMode !== 'light' || manifest.source.materialStyle !== 'flat'
    || manifest.source.viewport !== 'responsive' || manifest.source.contentPath !== SOURCE_PATH) {
    throw new Error('Homepage candidate source identity is not approved.');
  }
  if (!Array.isArray(manifest.pageSignature) || sortedJson(manifest.pageSignature) !== sortedJson(PAGE_SIGNATURE)) {
    throw new Error('Homepage candidate section signature is not approved.');
  }
  if (typeof manifest.outputs.stylesheet !== 'string'
    || !/^css\/buffit-home-markdown-[A-Z2-7]{8}\.css$/.test(manifest.outputs.stylesheet)
    || typeof manifest.outputs.runtimeScript !== 'string'
    || !/^js\/buffit-landing-home-markdown-[A-Z2-7]{8}\.js$/.test(manifest.outputs.runtimeScript)) {
    throw new Error('Homepage candidate stylesheet or runtime path is not approved.');
  }
  if (!manifest.files || typeof manifest.files !== 'object' || Array.isArray(manifest.files)) {
    throw new Error('Homepage candidate complete file hash map is missing.');
  }
  for (const [filePath, digest] of Object.entries(manifest.files)) {
    canonicalRelative(filePath, 'manifest file');
    if (filePath === MANIFEST_PATH) throw new Error('Homepage candidate manifest cannot hash itself.');
    requireHash(digest, `output ${filePath}`);
  }

  const modelScripts = [...indexHtml.matchAll(/<script\b(?=[^>]*\bid="landing-home-model")(?=[^>]*\btype="application\/json")[^>]*>([\s\S]*?)<\/script\s*>/gi)];
  if (modelScripts.length !== 1 || (indexHtml.match(/id="landing-home-model"/g) ?? []).length !== 1
    || (indexHtml.match(/data-buffit-page-model="landing-home-markdown-v1"/g) ?? []).length !== 1
    || indexHtml.includes('data-buffit-page-model="landing-home-v2"')) {
    throw new Error('Homepage candidate must have one matching Markdown model and marker.');
  }
  let payload;
  try { payload = JSON.parse(modelScripts[0][1]); } catch { throw new Error('Homepage candidate inert model JSON is malformed.'); }
  if (!hasExactKeys(payload, ['model', 'mediaUrls']) || !hasExactKeys(payload.model, MODEL_KEYS)) {
    throw new Error('Homepage candidate model shape is malformed.');
  }
  const model = payload.model;
  if (model.schemaVersion !== 1 || model.pageId !== 'buffit.home'
    || !hasExactKeys(model.document, DOCUMENT_KEYS)
    || model.document.id !== 'buffit.home' || model.document.owner !== 'YokhanFitnessLanding'
    || model.document.routeRef !== '/' || model.document.source_mode !== 'markdown'
    || model.source?.path !== SOURCE_PATH || model.source?.sha256 !== expected.sourceSha256
    || manifest.source.contentSha256 !== expected.sourceSha256
    || manifest.sources?.[SOURCE_PATH] !== expected.sourceSha256
    || model.contentDigest !== expected.contentDigest || manifest.source.contentDigest !== expected.contentDigest) {
    throw new Error('Homepage candidate source/model identity or source digest is stale.');
  }
  if (!hasExactKeys(expected.pins, PIN_KEYS) || !hasExactKeys(manifest.pins, PIN_KEYS) || !hasExactKeys(model.pins, PIN_KEYS)
    || sortedJson(expected.pins) !== sortedJson(manifest.pins) || sortedJson(model.pins) !== sortedJson(manifest.pins)) {
    throw new Error('Homepage candidate compiler pinset does not match the controlled expected pinset.');
  }
  for (const key of PIN_KEYS) requireHash(expected.pins[key], `pin ${key}`);
  if (model.pins.source !== expected.sourceSha256 || model.pins.media !== model.mediaManifest?.sha256) {
    throw new Error('Homepage candidate source or media pin does not match its model.');
  }
  const modelWithoutDigest = { ...model };
  delete modelWithoutDigest.contentDigest;
  if (sha256(Buffer.from(sortedJson(modelWithoutDigest), 'utf8')) !== model.contentDigest) {
    throw new Error('Homepage candidate content digest does not match its model.');
  }
  requireHash(manifest.pageModelDigest, 'page model digest');
  const expectedPageDigest = sha256(Buffer.from(sortedJson({
    contentDigest: model.contentDigest,
    modelPins: model.pins,
    sourceHashes: manifest.sources,
    files: manifest.files,
  }), 'utf8'));
  if (manifest.pageModelDigest !== expectedPageDigest) throw new Error('Homepage candidate page digest does not match its model and outputs.');

  const entries = model.mediaManifest?.entries;
  if (!Array.isArray(entries) || entries.length === 0
    || !manifest.mediaProvenance || typeof manifest.mediaProvenance !== 'object' || Array.isArray(manifest.mediaProvenance)) {
    throw new Error('Homepage candidate media provenance is malformed.');
  }
  if (sha256(Buffer.from(sortedJson(entries), 'utf8')) !== model.mediaManifest.sha256
    || sortedJson(Object.keys(payload.mediaUrls ?? {}).sort()) !== sortedJson(entries.map(item => item.ref).sort())
    || sortedJson(Object.keys(manifest.mediaProvenance).sort()) !== sortedJson(entries.map(item => item.ref).sort())) {
    throw new Error('Homepage candidate media maps do not exactly cover the compiled model.');
  }
  const refs = new Set();
  for (const entry of entries) {
    if (!entry || typeof entry !== 'object' || typeof entry.ref !== 'string' || !entry.ref.startsWith('/landing-media/')
      || entry.ref.includes('\\') || entry.ref.includes('%') || entry.ref.includes(':') || /[?#]/.test(entry.ref)
      || (() => { try { canonicalRelative(entry.ref.slice(1), 'media'); return false; } catch { return true; } })()
      || refs.has(entry.ref) || !SHA256.test(entry.sha256 ?? '') || !Number.isSafeInteger(entry.byteLength) || entry.byteLength < 1
      || !/^image\/[A-Za-z0-9.+-]+$/.test(entry.mime)) throw new Error('Homepage candidate contains an invalid media record.');
    refs.add(entry.ref);
    const output = payload.mediaUrls[entry.ref];
    const provenance = manifest.mediaProvenance[entry.ref];
    if (typeof output !== 'string' || !output.startsWith('/landing-media/')
      || manifest.media?.[output] !== entry.sha256 || provenance?.output !== output
      || provenance?.sha256 !== entry.sha256 || provenance?.byteLength !== entry.byteLength
      || provenance?.mime !== entry.mime || !['landing-media', 'ds-local-original'].includes(provenance?.sourceLabel)) {
      throw new Error('Homepage candidate media mapping does not match its source manifest.');
    }
  }
  if (!manifest.media || typeof manifest.media !== 'object' || Array.isArray(manifest.media)
    || !manifest.sources || typeof manifest.sources !== 'object' || Array.isArray(manifest.sources)) {
    throw new Error('Homepage candidate media or source map is malformed.');
  }
  for (const [filePath, digest] of Object.entries(manifest.media)) {
    if (typeof filePath !== 'string' || !filePath.startsWith('/landing-media/') || filePath.includes('\\')
      || filePath.includes('%') || filePath.includes(':') || /[?#]/.test(filePath)) throw new Error('Homepage candidate media path is unsafe.');
    canonicalRelative(filePath.slice(1), 'media');
    requireHash(digest, `media ${filePath}`);
  }
  for (const [filePath, digest] of Object.entries(manifest.sources)) {
    canonicalRelative(filePath, 'source');
    requireHash(digest, `source ${filePath}`);
  }
  return { payload, model };
}

function collectExpectedFiles({ manifest, indexHtml, stylesheet }) {
  const expected = new Set([
    INDEX_PATH,
    MANIFEST_PATH,
    COMPONENT_MANIFEST_PATH,
    manifest.outputs.stylesheet,
    manifest.outputs.runtimeScript,
  ]);
  if (!Array.isArray(manifest.outputs.stylesheetAssets)) {
    throw new Error('Homepage candidate stylesheet asset manifest is missing.');
  }
  const declaredCssAssets = new Set();
  for (const asset of manifest.outputs.stylesheetAssets) {
    if (!hasExactKeys(asset, ['path', 'sha256']) || typeof asset.path !== 'string'
      || !asset.path.startsWith('css/buffit-home-markdown-assets/')) {
      throw new Error('Homepage candidate stylesheet asset record is invalid.');
    }
    canonicalRelative(asset.path, 'stylesheet asset');
    requireHash(asset.sha256, `stylesheet asset ${asset.path}`);
    if (declaredCssAssets.has(asset.path)) throw new Error('Homepage candidate stylesheet asset is duplicated.');
    declaredCssAssets.add(asset.path);
    expected.add(asset.path);
  }
  const referencedCssAssets = new Set();
  for (const ref of Object.keys(manifest.media)) expected.add(canonicalRelative(ref.slice(1), 'media'));
  for (const match of stylesheet.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
    const resourcePath = urlPathFromCss(match[1], manifest.outputs.stylesheet);
    if (resourcePath) {
      expected.add(resourcePath);
      referencedCssAssets.add(resourcePath);
    }
  }
  if (sortedJson([...referencedCssAssets].sort()) !== sortedJson([...declaredCssAssets].sort())) {
    throw new Error('Homepage candidate CSS asset references do not match the declared output closure.');
  }
  if (/@import\b/i.test(stylesheet)) throw new Error('Homepage candidate stylesheet must not import unpinned stylesheets.');
  for (const resourcePath of candidateHtmlResourcePaths(indexHtml, manifest)) expected.add(resourcePath);
  return expected;
}

function validateExpected(expected) {
  if (!expected || typeof expected !== 'object' || Array.isArray(expected)
    || Object.keys(expected).sort().join(',') !== ['contentDigest', 'manifestSha256', 'pins', 'schemaVersion', 'sourceSha256'].sort().join(',')
    || expected.schemaVersion !== 1) {
    throw new Error('Homepage candidate requires the exact controlled expected source, content, manifest and pinset digests.');
  }
  requireHash(expected.sourceSha256, 'source SHA-256');
  requireHash(expected.contentDigest, 'content digest');
  requireHash(expected.manifestSha256, 'manifest SHA-256');
  if (!hasExactKeys(expected.pins, PIN_KEYS)) throw new Error('Homepage candidate expected pinset is incomplete.');
}

/** Read and verify a closed, immutable compiler candidate; returned bytes are the only bytes consumers should package. */
export function readLandingHomeCandidate({ root, expected } = {}) {
  validateExpected(expected);
  if (typeof root !== 'string' || !root) throw new Error('Homepage candidate root is required.');
  const absoluteRoot = path.resolve(root);
  const rootStat = fs.lstatSync(absoluteRoot, { bigint: true });
  if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) throw new Error('Homepage candidate root must be a real directory.');
  const rootReal = fs.realpathSync(absoluteRoot);
  if (rootReal !== absoluteRoot) throw new Error('Homepage candidate root cannot traverse a symlink or junction.');

  const listed = listCandidateFiles(rootReal);
  const manifestRecord = readStableFile(rootReal, MANIFEST_PATH);
  if (manifestRecord.sha256 !== expected.manifestSha256) throw new Error('Homepage candidate manifest digest does not match the controlled expected digest.');
  let manifest;
  try { manifest = JSON.parse(manifestRecord.bytes.toString('utf8')); }
  catch { throw new Error('Homepage candidate manifest is malformed JSON.'); }
  let preflightBytes = manifestRecord.bytes.length;
  for (const relativePath of listed.files) {
    if (relativePath === MANIFEST_PATH) continue;
    canonicalRelative(relativePath, 'file');
    const stat = fs.lstatSync(path.join(rootReal, ...relativePath.split('/')), { bigint: true });
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`Homepage candidate entry is not a regular file: ${relativePath}.`);
    if (stat.size > BigInt(MAX_CANDIDATE_BYTES)) throw new Error('Homepage candidate file exceeds the bounded read limit.');
    preflightBytes += Number(stat.size);
    if (!Number.isSafeInteger(preflightBytes) || preflightBytes > MAX_CANDIDATE_BYTES) {
      throw new Error('Homepage candidate exceeds the bounded total byte limit.');
    }
  }
  const indexRecord = readStableFile(rootReal, INDEX_PATH);
  const stylesheetPath = manifest?.outputs?.stylesheet;
  const runtimePath = manifest?.outputs?.runtimeScript;
  if (typeof stylesheetPath !== 'string' || typeof runtimePath !== 'string') throw new Error('Homepage candidate outputs are missing.');
  canonicalRelative(stylesheetPath, 'stylesheet');
  canonicalRelative(runtimePath, 'runtime');
  const stylesheetRecord = readStableFile(rootReal, stylesheetPath);
  const runtimeRecord = readStableFile(rootReal, runtimePath);
  const componentManifestRecord = readStableFile(rootReal, COMPONENT_MANIFEST_PATH);

  const { model } = verifyCandidateModel({ manifest, indexHtml: indexRecord.bytes.toString('utf8'), expected });
  requireHash(manifest.outputs.indexSha256, 'index');
  requireHash(manifest.outputs.stylesheetSha256, 'stylesheet');
  requireHash(manifest.outputs.runtimeScriptSha256, 'runtime');
  requireHash(manifest.outputs.componentManifestSha256, 'component manifest');
  if (indexRecord.sha256 !== manifest.outputs.indexSha256 || stylesheetRecord.sha256 !== manifest.outputs.stylesheetSha256
    || runtimeRecord.sha256 !== manifest.outputs.runtimeScriptSha256 || componentManifestRecord.sha256 !== manifest.outputs.componentManifestSha256) {
    throw new Error('Homepage candidate output hash does not match its manifest.');
  }
  const html = indexRecord.bytes.toString('utf8');
  const stylesheet = stylesheetRecord.bytes.toString('utf8');
  const expectedFiles = collectExpectedFiles({ manifest, indexHtml: html, stylesheet });
  for (const asset of manifest.outputs.stylesheetAssets) {
    const record = readStableFile(rootReal, asset.path);
    if (record.sha256 !== asset.sha256) throw new Error(`Homepage candidate stylesheet asset hash mismatch: ${asset.path}.`);
  }
  for (const [ref, digest] of Object.entries(manifest.media)) {
    const filePath = canonicalRelative(ref.slice(1), 'media');
    const record = readStableFile(rootReal, filePath);
    const modelEntry = manifest.mediaProvenance?.[ref];
    const sourceEntry = model.mediaManifest.entries.find(entry => entry.ref === ref);
    if (record.sha256 !== digest || sourceEntry && sourceEntry.byteLength !== record.bytes.length
      || modelEntry && modelEntry.byteLength !== record.bytes.length) throw new Error(`Homepage candidate media hash or size mismatch: ${ref}.`);
    expectedFiles.add(filePath);
  }
  if (!manifest.files || typeof manifest.files !== 'object' || Array.isArray(manifest.files)) {
    throw new Error('Homepage candidate complete file hash map is missing.');
  }
  const declaredFiles = new Set();
  for (const [filePath, digest] of Object.entries(manifest.files)) {
    canonicalRelative(filePath, 'manifest file');
    if (filePath === MANIFEST_PATH) throw new Error('Homepage candidate manifest cannot hash itself.');
    requireHash(digest, `output ${filePath}`);
    if (declaredFiles.has(filePath)) throw new Error('Homepage candidate file hash map contains a duplicate path.');
    declaredFiles.add(filePath);
  }
  const expectedOutputFiles = [...expectedFiles].filter(filePath => filePath !== MANIFEST_PATH);
  if (sortedJson([...expectedOutputFiles].sort()) !== sortedJson([...declaredFiles].sort())) {
    throw new Error('Homepage candidate declared file hash map does not match the required output closure.');
  }
  const expectedInventory = new Set([...declaredFiles, MANIFEST_PATH]);
  if (listed.files.length !== expectedInventory.size || listed.files.some(filePath => !expectedInventory.has(filePath))) {
    throw new Error('Homepage candidate inventory does not match its complete file hash map.');
  }
  const actualFiles = new Set(listed.files);
  if (actualFiles.size !== expectedFiles.size || [...actualFiles].some(file => !expectedFiles.has(file))) {
    const missing = [...expectedFiles].filter(file => !actualFiles.has(file));
    const extra = [...actualFiles].filter(file => !expectedFiles.has(file));
    throw new Error(`Homepage candidate closure is not exact (missing ${missing.length}, extra ${extra.length}).`);
  }
  const expectedDirectories = new Set();
  for (const file of expectedFiles) {
    let parent = path.posix.dirname(file);
    while (parent !== '.') { expectedDirectories.add(parent); parent = path.posix.dirname(parent); }
  }
  if (listed.directories.length !== expectedDirectories.size || listed.directories.some(dir => !expectedDirectories.has(dir))) {
    throw new Error('Homepage candidate contains an extra or missing directory.');
  }

  const files = new Map();
  const identities = new Map();
  let snapshotBytes = 0;
  for (const filePath of [...expectedFiles].sort()) {
    const remainingBytes = MAX_CANDIDATE_BYTES - snapshotBytes;
    const record = filePath === INDEX_PATH ? indexRecord
      : filePath === stylesheetPath ? stylesheetRecord
        : filePath === runtimePath ? runtimeRecord
          : filePath === MANIFEST_PATH ? manifestRecord
            : filePath === COMPONENT_MANIFEST_PATH ? componentManifestRecord
              : readStableFile(rootReal, filePath, remainingBytes);
    snapshotBytes += record.bytes.length;
    if (!Number.isSafeInteger(snapshotBytes) || snapshotBytes > MAX_CANDIDATE_BYTES) throw new Error('Homepage candidate total output exceeds the bounded read limit.');
    const expectedHash = filePath === MANIFEST_PATH ? expected.manifestSha256 : manifest.files[filePath];
    if (record.sha256 !== expectedHash) throw new Error(`Homepage candidate file hash does not match its manifest: ${filePath}.`);
    files.set(filePath, Buffer.from(record.bytes));
    identities.set(filePath, { sha256: record.sha256, identity: record.identity });
  }
  const totalBytes = [...files.values()].reduce((total, bytes) => total + bytes.length, 0);
  if (totalBytes > MAX_CANDIDATE_BYTES || totalBytes !== snapshotBytes) throw new Error('Homepage candidate exceeds the bounded total byte limit.');
  const publicFiles = new Map([...files].filter(([file]) => file !== INDEX_PATH && file !== MANIFEST_PATH && file !== COMPONENT_MANIFEST_PATH));

  return Object.freeze({
    root: rootReal,
    manifest,
    manifestSha256: manifestRecord.sha256,
    sourceSha256: manifest.source.contentSha256,
    contentDigest: manifest.source.contentDigest,
    pageModelDigest: manifest.pageModelDigest,
    pins: Object.freeze({ ...manifest.pins }),
    indexHtml: Buffer.from(indexRecord.bytes),
    publicFiles,
    totalBytes,
    verifyUnchanged() {
      const current = listCandidateFiles(rootReal);
      if (current.files.length !== listed.files.length || current.files.some((file, index) => file !== listed.files[index])
        || current.directories.length !== listed.directories.length || current.directories.some((dir, index) => dir !== listed.directories[index])) {
        throw new Error('Homepage candidate file set changed before package promotion.');
      }
      for (const [filePath, captured] of identities) {
        const record = readStableFile(rootReal, filePath);
        if (record.sha256 !== captured.sha256 || !sameIdentity(record.identity, captured.identity)) {
          throw new Error(`Homepage candidate changed before package promotion: ${filePath}.`);
        }
      }
    },
  });
}

export function homepageCandidatePinsetSha256(pins) {
  if (!hasExactKeys(pins, PIN_KEYS)) throw new Error('Homepage candidate pinset is incomplete.');
  for (const key of PIN_KEYS) requireHash(pins[key], `pin ${key}`);
  return sha256(Buffer.from(sortedJson(pins), 'utf8'));
}
