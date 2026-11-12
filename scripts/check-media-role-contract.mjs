import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONTRACT_PATH = resolve(ROOT, "data", "media-role-contract.json");
const TOKEN_PATH = resolve(ROOT, "css", "tokens.css");
const WEB_ASSET_DIR = resolve(ROOT, "assets", "generated", "web");
const PLACEMENT_WIRING_PATHS = [
  resolve(ROOT, "index.html"),
  resolve(ROOT, "coaching.html"),
  resolve(ROOT, "css", "home-flow.css"),
  resolve(ROOT, "css", "generated-media.css"),
];
const ALLOW_PENDING_TECHNIQUE = process.env.ALLOW_PENDING_TECHNIQUE === "1";
const MOVEMENT_ROLES = new Set(["women", "men", "health"]);

const contract = JSON.parse(await readFile(CONTRACT_PATH, "utf8"));
const GENERATED_ASSET_KINDS = new Set(contract.placementPolicy?.generatedAssetKinds ?? []);
const tokenSource = await readFile(TOKEN_PATH, "utf8");
const placementWiringSource = (await Promise.all(
  PLACEMENT_WIRING_PATHS.map((path) => readFile(path, "utf8")),
)).join("\n");
const failures = [];

function getDistinctDimensions(left, right) {
  return contract.dimensions.filter((dimension) => left[dimension] !== right[dimension]);
}

function checkPairwiseDifferentiation(entries) {
  for (let leftIndex = 0; leftIndex < entries.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < entries.length; rightIndex += 1) {
      const [leftName, leftRole] = entries[leftIndex];
      const [rightName, rightRole] = entries[rightIndex];
      const distinct = getDistinctDimensions(leftRole, rightRole);
      if (distinct.length < contract.minimumDistinctDimensions) {
        failures.push(`${leftName}/${rightName}: only ${distinct.length} distinct dimensions`);
      }
    }
  }
}

function checkRole(name, role) {
  for (const dimension of contract.dimensions) {
    if (!role[dimension]) failures.push(`${name}: missing ${dimension}`);
  }
  for (const variant of ["desktop", "mobile"]) {
    const asset = role.assets?.[variant];
    if (!asset || !tokenSource.includes(asset)) {
      failures.push(`${name}: ${variant} asset is not wired in css/tokens.css`);
    }
    for (const extension of ["avif", "webp"]) {
      if (asset && !existsSync(resolve(WEB_ASSET_DIR, `${asset}.${extension}`))) {
        failures.push(`${name}: missing ${variant} ${extension} export`);
      }
    }
  }
  if (!MOVEMENT_ROLES.has(name)) return;
  if (!Array.isArray(role.techniqueChecks) || role.techniqueChecks.length < 4) {
    failures.push(`${name}: fewer than four observable technique checks`);
  }
  if (!ALLOW_PENDING_TECHNIQUE && role.technicalReview?.status !== "approved") {
    failures.push(`${name}: visual technique review is not approved`);
  }
}

function checkPlacementAsset(placementName, variant, asset, assetOwners) {
  if (!asset) {
    failures.push(`${placementName}: missing ${variant} asset`);
    return;
  }
  if (!placementWiringSource.includes(asset)) {
    failures.push(`${placementName}: ${variant} asset is not wired in the declared route sources`);
  }
  for (const extension of ["avif", "webp"]) {
    if (!existsSync(resolve(WEB_ASSET_DIR, `${asset}.${extension}`))) {
      failures.push(`${placementName}: missing ${variant} ${extension} export`);
    }
  }
  assetOwners.set(asset, [...(assetOwners.get(asset) ?? []), placementName]);
}

function checkPlacements() {
  const placements = Object.entries(contract.placements ?? {});
  const assetOwners = new Map();
  const routeSlots = new Set();
  for (const [placementName, placement] of placements) {
    for (const field of contract.placementPolicy?.requiredFields ?? []) {
      if (!placement[field]) failures.push(`${placementName}: missing placement field ${field}`);
    }
    const routeSlot = `${placement.route}::${placement.slot}`;
    if (routeSlots.has(routeSlot)) failures.push(`${placementName}: duplicate route/slot ${routeSlot}`);
    routeSlots.add(routeSlot);
    if (contract.placementPolicy?.codeNativeKinds?.includes(placement.assetKind)) {
      if (!placement.selector || !placementWiringSource.includes(placement.selector.slice(1))) {
        failures.push(`${placementName}: code-native selector is not wired`);
      }
    } else if (GENERATED_ASSET_KINDS.has(placement.assetKind) || !placement.assetKind) {
      if (GENERATED_ASSET_KINDS.has(placement.assetKind)) {
        for (const field of contract.placementPolicy?.generatedAssetRequiredFields ?? []) {
          if (!placement[field]) failures.push(`${placementName}: missing generated asset field ${field}`);
        }
      }
      for (const variant of ["desktop", "mobile"]) {
        checkPlacementAsset(placementName, variant, placement.assets?.[variant], assetOwners);
      }
    } else {
      failures.push(`${placementName}: unsupported asset kind ${placement.assetKind}`);
    }
    if (placement.sceneId?.includes("igor") && placement.identityReview?.status !== "approved") {
      failures.push(`${placementName}: trainer identity review is not approved`);
    }
    if (Array.isArray(placement.techniqueChecks) && placement.techniqueChecks.length > 0) {
      if (!ALLOW_PENDING_TECHNIQUE && placement.technicalReview?.status !== "approved") {
        failures.push(`${placementName}: placement technique review is not approved`);
      }
    }
  }
  for (const [asset, owners] of assetOwners) {
    if (owners.length > (contract.placementPolicy?.assetReuseLimit ?? 1)) {
      failures.push(`${asset}: reused by placements ${owners.join(", ")}`);
    }
  }
  return placements.length;
}

const entries = Object.entries(contract.roles);
if (contract.placementPolicy?.codeNativeKinds?.includes("route-map")) {
  failures.push("placementPolicy: route-map must be generated media, not code-native art");
}
for (const forbiddenDirection of contract.placementPolicy?.forbiddenPromptDirections ?? []) {
  if (!forbiddenDirection.trim()) failures.push("placementPolicy: forbidden prompt directions must be non-empty");
}
checkPairwiseDifferentiation(entries);
for (const [name, role] of entries) checkRole(name, role);
const placementCount = checkPlacements();

if (failures.length > 0) {
  console.error(JSON.stringify({ failures }, null, 2));
  process.exit(1);
}

console.log(
  `media_role_contract_ok roles=${entries.length} placements=${placementCount} dimensions=${contract.dimensions.length} minDistinct=${contract.minimumDistinctDimensions}`,
);
