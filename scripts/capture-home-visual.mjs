import { Buffer } from "node:buffer";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DS_ROOT = resolve(process.env.BUFFIT_DS_ROOT ?? resolve(ROOT, "..", "BuffItDesignSystem"));
const RUNTIME_PATH = resolve(DS_ROOT, "scripts", "rendered-token-check", "runtime.mjs");
const OUTPUT_DIR = resolve(ROOT, "test-results", "home-ui-current");
const MOBILE_VIEWPORT = { height: 844, mobile: true, width: 390 };
const MOBILE_REVIEW_VIEWPORT = { height: 844, mobile: true, width: 402 };
const COMPACT_VIEWPORT = { height: 900, mobile: false, width: 1280 };
const DESKTOP_VIEWPORT = { height: 1000, mobile: false, width: 1440 };
const NAV_OPEN_WAIT_MS = 1_100;

const runtime = await import(pathToFileURL(RUNTIME_PATH).href);
const server = await runtime.startStaticServer(ROOT);
const chrome = await runtime.startChrome();
const page = await runtime.openPage(chrome.port);
const url = `http://127.0.0.1:${server.port}/index.html`;

try {
  await mkdir(OUTPUT_DIR, { recursive: true });
  await runtime.navigateDocument(page, url, MOBILE_VIEWPORT);
  await capture(page, "home-mobile-390.png");

  await runtime.evaluate(page, `document.querySelector(".nav__mobile-toggle")?.click(); true`);
  await waitForFrames(runtime, page);
  await capture(page, "home-mobile-menu-390.png");

  const routeTop = await runtime.evaluate(page, `
    document.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }));
    document.querySelector(".product-choice")?.getBoundingClientRect().top + window.scrollY;
  `);
  await waitForFrames(runtime, page);
  await capture(page, "home-mobile-routes-390.png", {
    clip: { height: MOBILE_VIEWPORT.height, scale: 1, width: MOBILE_VIEWPORT.width, x: 0, y: routeTop },
  });

  await runtime.navigateDocument(page, url, MOBILE_REVIEW_VIEWPORT);
  const featureBoundaryTop = await runtime.evaluate(page, `
    (() => {
      const y = Math.max(0, document.querySelector(".pdp-feature").offsetTop - 360);
      scrollTo(0, y);
      return y;
    })()
  `);
  await waitForFrames(runtime, page);
  await capture(page, "home-mobile-feature-boundary-402.png", {
    clip: {
      height: MOBILE_REVIEW_VIEWPORT.height,
      scale: 1,
      width: MOBILE_REVIEW_VIEWPORT.width,
      x: 0,
      y: featureBoundaryTop,
    },
  });

  await runtime.navigateDocument(page, url, COMPACT_VIEWPORT);
  await runtime.evaluate(page, `document.querySelector(".nav__mobile-toggle")?.click(); true`);
  await runtime.evaluate(page, `document.querySelector(".nav__trigger")?.click(); true`);
  await waitForFrames(runtime, page);
  await capture(page, "home-compact-menu-1280.png");

  await runtime.navigateDocument(page, url, DESKTOP_VIEWPORT);
  await capture(page, "home-desktop-1440.png");

  const desktopMenuNames = [
    "programs",
    "coaching",
    "materials",
    "approach",
  ];
  for (let index = 0; index < desktopMenuNames.length; index += 1) {
    await runtime.evaluate(page, `document.querySelectorAll(".nav__trigger")[${index}]?.click(); true`);
    await runtime.evaluate(page, `new Promise((resolve) => setTimeout(resolve, ${NAV_OPEN_WAIT_MS}))`);
    await waitForFrames(runtime, page);
    const legacyName = index === 0 ? "home-desktop-menu-1440.png" : null;
    await capture(page, legacyName ?? `home-desktop-menu-${desktopMenuNames[index]}-1440.png`);
  }
  console.log(`buffit_home_visual_ok output=${OUTPUT_DIR}`);
} finally {
  await chrome.close();
  await server.close();
}

async function capture(browserPage, fileName, options = {}) {
  const result = await browserPage.send("Page.captureScreenshot", {
    captureBeyondViewport: Boolean(options.clip),
    clip: options.clip,
    format: "png",
    fromSurface: true,
  });
  await writeFile(resolve(OUTPUT_DIR, fileName), Buffer.from(result.data, "base64"));
}

async function waitForFrames(runtimeApi, browserPage) {
  await runtimeApi.evaluate(
    browserPage,
    "new Promise((resolveFrames) => requestAnimationFrame(() => requestAnimationFrame(resolveFrames)))",
  );
}
