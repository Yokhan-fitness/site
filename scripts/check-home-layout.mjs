import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DS_ROOT = resolve(process.env.BUFFIT_DS_ROOT ?? resolve(ROOT, "..", "BuffItDesignSystem"));
const RUNTIME_PATH = resolve(DS_ROOT, "scripts", "rendered-token-check", "runtime.mjs");
const CONTRACT_PATH = resolve(ROOT, "contracts", "design-system-consumer.json");
const MANIFEST_PATH = resolve(ROOT, "contracts", "landing-home-static-manifest.json");
const VIEWPORTS = [
  { height: 568, mobile: true, width: 320 },
  { height: 800, mobile: true, width: 360 },
  { height: 844, mobile: true, width: 390 },
  { height: 932, mobile: true, width: 430 },
  { height: 1024, mobile: true, width: 768 },
  { height: 1000, mobile: false, width: 1440 },
];

await verifyConsumerContract();
const runtime = await import(pathToFileURL(RUNTIME_PATH).href);
const server = await runtime.startStaticServer(ROOT);
const chrome = await runtime.startChrome();
const page = await runtime.openPage(chrome.port);
const failures = [];

try {
  for (const viewport of VIEWPORTS) {
    const url = `http://127.0.0.1:${server.port}/index.html`;
    await runtime.navigateDocument(page, url, viewport);
    await runtime.evaluate(page, `(
      async () => {
        document.querySelectorAll("img").forEach((image) => { image.loading = "eager"; });
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((resolveImages) => setTimeout(resolveImages, 250));
        await Promise.all([...document.images].map((image) => image.decode().catch(() => null)));
        window.scrollTo(0, 0);
      }
    )()`);
    const result = await runtime.evaluate(
      page,
      `(${auditPage.toString()})(${JSON.stringify(viewport)})`,
    );
    failures.push(...result.failures.map((failure) => ({ ...failure, viewport })));
  }
} finally {
  await chrome.close();
  await server.close();
}

if (failures.length > 0) {
  console.error(JSON.stringify({ failures }, null, 2));
  process.exit(1);
}

console.log(`buffit_home_layout_ok viewports=${VIEWPORTS.length} states=closed+open+escape`);

async function auditPage(viewport) {
  const failures = [];
  const clientWidth = document.documentElement.clientWidth;
  const pageRoot = document.querySelector('[data-buffit-page-model="landing-home-v1"]');
  const nav = document.querySelector(".nav");
  const toggle = nav?.querySelector(".nav__mobile-toggle");
  const firstTrigger = nav?.querySelector(".nav__trigger");
  const firstDropdown = nav?.querySelector(".nav__dropdown");
  const heroAction = document.querySelector(".buffit-landing-public-hero .buffit-button--primary");

  check(Boolean(pageRoot), "page-model", true);
  check(document.documentElement.scrollWidth <= clientWidth + 1, "horizontal-overflow", true);
  check(document.querySelectorAll(".buffit-landing-proof-grid__item").length, "proof-count", 4);
  check(document.querySelectorAll(".buffit-landing-decision-card").length, "decision-card-count", 3);
  check(document.querySelectorAll(".buffit-landing-app-gallery__item").length, "app-preview-count", 3);
  check(pageRoot?.getAttribute("data-buffit-style"), "material", "ceramic");
  checkVisibleBounds(pageRoot, "page-root");
  checkVisibleBounds(nav, "site-header");
  checkVisibleBounds(heroAction, "hero-primary-action");

  if (heroAction) {
    const rect = heroAction.getBoundingClientRect();
    check(rect.bottom <= window.innerHeight + 1, "hero-action-first-viewport", true);
  }

  for (const element of document.querySelectorAll(".nav a[href], .nav button, .buffit-button")) {
    if (!isVisible(element)) continue;
    const rect = element.getBoundingClientRect();
    check(rect.width >= 44 && rect.height >= 44, `touch-target:${element.className}`, true);
    checkVisibleBounds(element, `control:${element.className}`);
  }

  for (const image of document.querySelectorAll("img")) {
    if (!isVisible(image)) continue;
    check(image.complete && image.naturalWidth > 0, `image-load:${image.getAttribute("src")}`, true);
  }

  const appPreviewImages = document.querySelectorAll(".buffit-landing-app-gallery img");
  for (const image of appPreviewImages) {
    check(image.naturalWidth >= 810 && image.naturalHeight >= 1440, `app-preview-density:${image.src}`, true);
  }

  if (!nav || !toggle || !firstTrigger || !firstDropdown) {
    add("navigation-anatomy", false, true);
    return { failures };
  }

  const isMobile = viewport.width <= 864;
  const toggleDisplay = getComputedStyle(toggle).display;
  check(isMobile ? toggleDisplay !== "none" : toggleDisplay === "none", "mobile-toggle-visibility", true);

  if (isMobile) {
    toggle.focus();
    toggle.click();
    await nextFrames();
    check(document.body.classList.contains("is-nav-mobile-open"), "mobile-menu-open", true);
    check(firstTrigger === document.activeElement, "mobile-focus-entry", true);
    firstTrigger.click();
    await nextFrames();
    check(firstDropdown.closest(".nav__group")?.classList.contains("is-open"), "mobile-group-open", true);
    document.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }));
    await nextFrames();
    check(!document.body.classList.contains("is-nav-mobile-open"), "mobile-menu-escape", true);
    check(document.activeElement === toggle, "mobile-focus-return", true);
  } else {
    firstTrigger.focus();
    firstTrigger.click();
    await nextFrames();
    check(firstDropdown.closest(".nav__group")?.classList.contains("is-open"), "desktop-group-open", true);
    document.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }));
    await nextFrames();
    check(document.activeElement === firstTrigger, "desktop-focus-return", true);
  }

  return { failures };

  function checkVisibleBounds(element, label) {
    if (!element || !isVisible(element)) return;
    const rect = element.getBoundingClientRect();
    check(rect.left >= -1 && rect.right <= clientWidth + 1, `bounds:${label}`, true);
  }

  function isVisible(element) {
    const styles = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return styles.display !== "none" && styles.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  }

  function check(actual, property, expected) {
    if (actual !== expected) add(property, actual, expected);
  }

  function add(property, actual, expected) {
    failures.push({ actual, expected, property });
  }

  function nextFrames() {
    return new Promise((resolveFrames) => {
      requestAnimationFrame(() => requestAnimationFrame(resolveFrames));
    });
  }
}

async function verifyConsumerContract() {
  const [contract, manifest, home, packageJson] = await Promise.all([
    readJson(CONTRACT_PATH),
    readJson(MANIFEST_PATH),
    readFile(resolve(ROOT, "index.html"), "utf8"),
    readJson(resolve(DS_ROOT, "package.json")),
  ]);
  if (!home.includes('data-buffit-page-model="landing-home-v1"')) {
    throw new Error("Landing index is not generated from the canonical page model.");
  }
  if (contract.designSystem?.integrationMode !== "generated-static-page-model") {
    throw new Error(`Unexpected integration mode: ${contract.designSystem?.integrationMode}`);
  }
  if (packageJson.version !== contract.designSystem?.packageVersion) {
    throw new Error("Design-system package version drift.");
  }
  const indexHash = sha256(await readFile(resolve(ROOT, "index.html")));
  if (indexHash !== manifest.outputs.indexSha256) {
    throw new Error(`Generated index drift: ${indexHash}`);
  }
  for (const source of contract.canonicalSources ?? []) {
    const actualHash = sha256(await readFile(resolve(DS_ROOT, source.path)));
    if (actualHash !== source.sha256) {
      throw new Error(`Design-system source drift: ${source.path}`);
    }
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}
