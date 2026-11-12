import { Buffer } from "node:buffer";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DS_ROOT = resolve(process.env.BUFFIT_DS_ROOT ?? resolve(ROOT, "..", "BuffItDesignSystem"));
const RUNTIME_PATH = resolve(DS_ROOT, "scripts", "rendered-token-check", "runtime.mjs");
const OUTPUT_DIR = resolve(ROOT, "test-results", "audience-media-current");
const OVERFLOW_TOLERANCE_PX = 1;
const IMAGE_WAIT_TIMEOUT_MS = 5_000;

const CASES = [
  { asset: "b03-08-women-strength-ceramic", file: "program-glutes.html", role: "audience-women", version: "v3" },
  { asset: "b03-07-men-capability-ceramic", file: "program-pull-ups.html", role: "audience-men", version: "v3" },
  { asset: "b01-09-health-safe-return-ceramic", file: "health.html", role: "audience-health", version: "v3" },
  { asset: "b01-10-food-rhythm-ceramic", file: "nutrition.html", role: "audience-food", version: "v3" },
  { asset: "b01-07-app-in-use-ceramic", file: "app.html", role: "audience-app", version: "v3" },
  { asset: "b01-08-guide-materials-ceramic", file: "guide.html", role: "audience-guide", version: "v2" },
];

const VIEWPORTS = [
  { height: 844, mobile: true, name: "mobile-390", width: 390 },
  { height: 1000, mobile: false, name: "desktop-1440", width: 1440 },
];

const FORBIDDEN_TOKEN_PATTERNS = [
  { label: "remote stock media", pattern: /images\.unsplash\.com/ },
  { label: "dark surface alias", pattern: /--surface-ink:\s*var\(--color-ink/ },
  { label: "dark media overlay", pattern: /--media-overlay-(?:soft|strong|deep):[^;]*color-ink/s },
  { label: "dark primary control", pattern: /--accent-primary:\s*var\(--color-ink/ },
];

const runtime = await import(pathToFileURL(RUNTIME_PATH).href);
const server = await runtime.startStaticServer(ROOT);
const chrome = await runtime.startChrome();
const page = await runtime.openPage(chrome.port);
const failures = [];

async function waitForImages(currentPage) {
  await runtime.evaluate(currentPage, `Promise.race([
    Promise.all([...document.images].map((image) => image.decode().catch(() => undefined))),
    new Promise((resolve) => setTimeout(resolve, ${IMAGE_WAIT_TIMEOUT_MS}))
  ])`);
}

async function inspectPage(currentCase, viewport) {
  const url = `http://127.0.0.1:${server.port}/${currentCase.file}`;
  await runtime.navigateDocument(page, url, viewport);
  await waitForImages(page);
  return runtime.evaluate(page, `(() => {
    const body = document.body;
    const hero = document.querySelector('.hero__stage');
    return {
      background: hero ? getComputedStyle(hero).backgroundImage : '',
      hasAudienceRoot: body.classList.contains('audience-hero-page'),
      hasRole: body.classList.contains('${currentCase.role}'),
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  })()`);
}

async function capturePage(currentCase, viewport) {
  const screenshot = await page.send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
  });
  const fileName = `${currentCase.role}-${viewport.name}.png`;
  await writeFile(resolve(OUTPUT_DIR, fileName), Buffer.from(screenshot.data, "base64"));
}

function collectFailures(currentCase, viewport, result) {
  const prefix = `${currentCase.file}/${viewport.name}`;
  if (!result.hasAudienceRoot) failures.push(`${prefix}: audience root`);
  if (!result.hasRole) failures.push(`${prefix}: semantic role`);
  if (!result.background.includes(currentCase.asset)) failures.push(`${prefix}: semantic image`);
  if (!result.background.includes(currentCase.version)) failures.push(`${prefix}: semantic image version`);
  const expectedResponsiveVariant = viewport.mobile ? "mobile" : "desktop";
  if (!result.background.includes(expectedResponsiveVariant)) {
    failures.push(`${prefix}: expected ${expectedResponsiveVariant} art direction`);
  }
  if (result.overflow > OVERFLOW_TOLERANCE_PX) failures.push(`${prefix}: overflow ${result.overflow}px`);
}

async function checkCeramicTokenContract() {
  const source = await readFile(resolve(ROOT, "css", "tokens.css"), "utf8");
  for (const contract of FORBIDDEN_TOKEN_PATTERNS) {
    if (contract.pattern.test(source)) failures.push(`tokens: ${contract.label}`);
  }
}

try {
  await mkdir(OUTPUT_DIR, { recursive: true });
  await checkCeramicTokenContract();
  for (const currentCase of CASES) {
    for (const viewport of VIEWPORTS) {
      const result = await inspectPage(currentCase, viewport);
      collectFailures(currentCase, viewport, result);
      await capturePage(currentCase, viewport);
    }
  }
} finally {
  await chrome.close();
  await server.close();
}

if (failures.length > 0) {
  console.error(JSON.stringify({ failures }, null, 2));
  process.exit(1);
}

console.log(`audience_media_ok pages=${CASES.length} viewports=${VIEWPORTS.length} output=${OUTPUT_DIR}`);
