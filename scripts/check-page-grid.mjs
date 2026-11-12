import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DS_ROOT = resolve(process.env.BUFFIT_DS_ROOT ?? resolve(ROOT, "..", "BuffItDesignSystem"));
const RUNTIME_PATH = resolve(DS_ROOT, "scripts", "rendered-token-check", "runtime.mjs");
const TOLERANCE_PX = 2;
const MOBILE_BREAKPOINT_PX = 640;
const CASES = [
  { file: "index.html", mode: "grid" },
  { file: "coaching.html", mode: "grid", proof: true },
  { file: "guide.html", mode: "readable" },
];
const VIEWPORTS = [
  { height: 844, mobile: true, name: "mobile-390", width: 390 },
  { height: 1024, mobile: false, name: "tablet-768", width: 768 },
  { height: 1000, mobile: false, name: "desktop-1440", width: 1440 },
];

const runtime = await import(pathToFileURL(RUNTIME_PATH).href);
const server = await runtime.startStaticServer(ROOT);
const chrome = await runtime.startChrome();
const page = await runtime.openPage(chrome.port);
const failures = [];

function collectGeometryFailures(currentCase, viewport, result) {
  const prefix = `${currentCase.file}/${viewport.name}`;
  if (result.overflow > TOLERANCE_PX) failures.push(`${prefix}: horizontal overflow ${result.overflow}px`);
  if (!result.tokens.frame || !result.tokens.grid || !result.tokens.readable) failures.push(`${prefix}: missing layout tokens`);
  if (!result.hero) failures.push(`${prefix}: missing hero frame`);
  if (result.hero && Math.abs(result.hero.left - result.hero.right) > TOLERANCE_PX) failures.push(`${prefix}: hero is not centered`);
  if (viewport.width <= MOBILE_BREAKPOINT_PX && result.hero && Math.abs(result.hero.width - result.viewportWidth) > TOLERANCE_PX) {
    failures.push(`${prefix}: mobile hero is not full bleed (${result.hero.width}px)`);
  }
  for (const box of result.content) {
    if (Math.abs(box.left - box.right) > TOLERANCE_PX) failures.push(`${prefix}: ${box.selector} is not centered`);
    const limit = currentCase.mode === "readable" && box.selector.includes("section")
      ? result.tokens.readable
      : result.tokens.grid;
    if (box.width - limit > TOLERANCE_PX) failures.push(`${prefix}: ${box.selector} exceeds ${currentCase.mode} span`);
  }
  if (currentCase.proof && result.proof && result.hero && viewport.width > MOBILE_BREAKPOINT_PX) {
    if (Math.abs(result.proof.left - result.hero.left) > TOLERANCE_PX || Math.abs(result.proof.right - result.hero.right) > TOLERANCE_PX) {
      failures.push(`${prefix}: trainer proof does not reuse the hero wide-frame role`);
    }
  }
}

async function inspect(currentCase, viewport) {
  await runtime.navigateDocument(page, `http://127.0.0.1:${server.port}/${currentCase.file}`, viewport);
  return runtime.evaluate(page, `(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const resolveToken = (name) => {
      const probe = document.createElement('div');
      probe.style.cssText = 'position:fixed;visibility:hidden;width:var(' + name + ');';
      document.body.append(probe);
      const width = probe.getBoundingClientRect().width;
      probe.remove();
      return width;
    };
    const box = (element, selector) => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { selector, left: rect.left, right: viewportWidth - rect.right, width: rect.width };
    };
    const content = [...document.querySelectorAll('.hero__inner, .section > .container')]
      .filter((element) => !element.matches('.trainer-proof-section > .container'))
      .filter((element, index, elements) => elements.indexOf(element) === index)
      .map((element) => box(element, element.matches('.hero__inner') ? '.hero__inner' : '.section > .container'));
    return {
      content,
      hero: box(document.querySelector('.hero__stage'), '.hero__stage'),
      overflow: document.documentElement.scrollWidth - innerWidth,
      proof: box(document.querySelector('.trainer-proof-section > .container'), '.trainer-proof-section > .container'),
      viewportWidth,
      tokens: {
        frame: resolveToken('--page-frame-max'),
        grid: resolveToken('--page-grid-max'),
        readable: resolveToken('--page-readable-max'),
      },
    };
  })()`);
}

try {
  for (const currentCase of CASES) {
    for (const viewport of VIEWPORTS) {
      const result = await inspect(currentCase, viewport);
      collectGeometryFailures(currentCase, viewport, result);
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

console.log(`page_grid_ok pages=${CASES.length} viewports=${VIEWPORTS.length}`);
