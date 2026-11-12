import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPublicSite, isAllowedPublicOutput, PUBLIC_OUTPUT } from './stockholm-public-core.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const options = new Map();
const positionals = [];
for (let index = 0; index < args.length; index += 1) {
  const value = args[index];
  if (value === '--homepage-candidate' || value === '--homepage-expected') {
    if (options.has(value) || !args[index + 1] || args[index + 1].startsWith('--')) throw new Error(`Expected one value after ${value}.`);
    options.set(value, args[index + 1]);
    index += 1;
  } else if (value.startsWith('--')) {
    throw new Error(`Unknown build option: ${value}`);
  } else positionals.push(value);
}
if (positionals.length < 1 || positionals.length > 2) {
  throw new Error('Usage: build-stockholm-public.mjs <fresh-output> [release-id] [--homepage-candidate <managed-dir> --homepage-expected <managed-json>]');
}
const output = path.resolve(positionals[0]);
if (options.has('--homepage-candidate') !== options.has('--homepage-expected')) {
  throw new Error('Authored homepage mode requires both --homepage-candidate and --homepage-expected.');
}
if (!isAllowedPublicOutput(output)) {
  throw new Error(`Pass a fresh landing-* directory under AGENT_RUN_OUTPUT or the historical output allowlist; default is ${PUBLIC_OUTPUT}`);
}

let homepageCandidate = null;
if (options.has('--homepage-candidate')) {
  const managedRoot = process.env.AGENT_RUN_OUTPUT;
  if (!managedRoot) throw new Error('Authored homepage mode must run through managed-temp with AGENT_RUN_OUTPUT.');
  const expectedPath = path.resolve(options.get('--homepage-expected'));
  const root = fs.realpathSync(path.resolve(managedRoot));
  const relativeExpected = path.relative(root, expectedPath);
  if (!relativeExpected || relativeExpected === '..' || relativeExpected.startsWith(`..${path.sep}`) || path.isAbsolute(relativeExpected)) {
    throw new Error('--homepage-expected must point to a controlled JSON file inside AGENT_RUN_OUTPUT.');
  }
  let cursor = root;
  for (const part of relativeExpected.split(path.sep)) {
    cursor = path.join(cursor, part);
    const stat = fs.lstatSync(cursor);
    if (stat.isSymbolicLink()) throw new Error('--homepage-expected cannot traverse a symlink or junction.');
  }
  const expected = JSON.parse(fs.readFileSync(expectedPath, 'utf8'));
  homepageCandidate = { root: path.resolve(options.get('--homepage-candidate')), expected };
}

const result = buildPublicSite({
  repo,
  output,
  ...(positionals[1] ? { releaseId: positionals[1] } : {}),
  ...(homepageCandidate ? { homepageCandidate } : {}),
});
console.log(`Built ${result.count} public files at ${result.output}`);
console.log(`Manifest: ${path.join(result.output, 'manifest.json')}`);
if (result.manifest.homepageCandidate) console.log(`Homepage candidate manifest: ${result.manifest.homepageCandidate.manifestSha256}`);
