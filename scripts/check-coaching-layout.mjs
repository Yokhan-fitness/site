import { Buffer } from "node:buffer";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DS_ROOT = resolve(process.env.BUFFIT_DS_ROOT ?? resolve(ROOT, "..", "BuffItDesignSystem"));
const RUNTIME_PATH = resolve(DS_ROOT, "scripts", "rendered-token-check", "runtime.mjs");
const OUTPUT_DIR = resolve(ROOT, "test-results", "coaching-proof-20260721");
const URL = process.env.COACHING_LAYOUT_URL ?? "https://yokhanfitness.ru/coaching.html?verify=seo-proof-01";
const COACH_URL = process.env.COACH_LAYOUT_URL ?? "https://yokhanfitness.ru/coach/?verify=seo-proof-01";
const IMAGE_WAIT_TIMEOUT_MS = 5_000;
const VIEWPORTS = [
  { asset: "mobile", edgeToEdge: true, height: 844, heroAsset: "mobile", integrated: true, mobile: true, name: "mobile-390", navMode: "mobile", width: 390 },
  { asset: "desktop", edgeToEdge: false, height: 958, heroAsset: "mobile", integrated: true, mobile: false, name: "adaptive-668", navMode: "mobile", width: 668 },
  { asset: "desktop", edgeToEdge: false, height: 958, heroAsset: "desktop", integrated: true, mobile: false, name: "compact-845", navMode: "mobile", width: 845 },
  { asset: "desktop", edgeToEdge: false, height: 958, heroAsset: "desktop", integrated: true, mobile: false, name: "compact-1040", navMode: "mobile", width: 1040 },
  { asset: "desktop", edgeToEdge: false, height: 958, heroAsset: "desktop", integrated: true, mobile: false, name: "compact-1168", navMode: "mobile", width: 1168 },
  { asset: "desktop", edgeToEdge: false, height: 958, heroAsset: "desktop", integrated: true, mobile: false, name: "desktop-1296", navMode: "desktop", width: 1296 },
  { asset: "desktop", edgeToEdge: false, height: 1000, heroAsset: "desktop", integrated: true, mobile: false, name: "desktop-1440", navMode: "desktop", width: 1440 },
];
const PROOF_ASSETS = {
  desktop: {
    height: 900,
    source: "b01-06d-trainer-calibration-ceramic-desktop-v7-1600.avif",
    width: 1600,
  },
  mobile: {
    height: 1000,
    source: "b01-06d-trainer-calibration-ceramic-mobile-v7-800.avif",
    width: 800,
  },
};
const HERO_ASSETS = {
  desktop: "b01-06-calls-igor-ceramic-desktop-v6-1600",
  mobile: "b01-06-calls-igor-ceramic-mobile-v6-800",
};

const runtime = await import(pathToFileURL(RUNTIME_PATH).href);
const chrome = await runtime.startChrome();
const page = await runtime.openPage(chrome.port);
const failures = [];

async function waitForImages(currentPage) {
  await currentPage.send("Runtime.evaluate", {
    awaitPromise: true,
    expression: `(async () => {
      const images = [...document.images];
      await Promise.race([
        Promise.all(images.map((item) => item.complete ? item.decode().catch(() => undefined) : new Promise((resolve) => {
          item.addEventListener('load', resolve, { once: true });
          item.addEventListener('error', resolve, { once: true });
        }))),
        new Promise((resolve) => setTimeout(resolve, ${IMAGE_WAIT_TIMEOUT_MS})),
      ]);
    })()`,
    returnByValue: true,
  });
}

try {
  await mkdir(OUTPUT_DIR, { recursive: true });
  for (const viewport of VIEWPORTS) {
    await runtime.navigateDocument(page, URL, viewport);
    await page.send("Runtime.evaluate", {
      awaitPromise: true,
      expression: `(async () => {
        document.documentElement.style.scrollBehavior = 'auto';
        const image = document.querySelector('.trainer-proof__photo');
        if (image) image.loading = 'eager';
        document.querySelector('.trainer-proof')?.scrollIntoView({ block: 'start' });
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      })()`,
      returnByValue: true,
    });
    await waitForImages(page);
    const result = await runtime.evaluate(page, `(() => {
      const mediaRect = document.querySelector('.trainer-proof__media')?.getBoundingClientRect();
      const copyRect = document.querySelector('.trainer-proof__copy')?.getBoundingClientRect();
      const sectionRect = document.querySelector('.trainer-proof-section')?.getBoundingClientRect();
      const photoStyle = getComputedStyle(document.querySelector('.trainer-proof__photo'));
      const mediaStyle = getComputedStyle(document.querySelector('.trainer-proof__media'));
      const heroStage = document.querySelector('.hero__stage');
      const heroInner = document.querySelector('.hero__inner');
      const heroStageRect = heroStage?.getBoundingClientRect();
      const heroInnerRect = heroInner?.getBoundingClientRect();
      const heroMediaStyle = getComputedStyle(heroStage, '::before');
      const heroOverlayStyle = getComputedStyle(heroStage, '::after');
      const navLinksStyle = getComputedStyle(document.querySelector('.nav__links'));
      const navToggleStyle = getComputedStyle(document.querySelector('.nav__mobile-toggle'));
      const navBrandRect = document.querySelector('.brand-logo')?.getBoundingClientRect();
      const navLinksRect = document.querySelector('.nav__links')?.getBoundingClientRect();
      const navActionsRect = document.querySelector('.nav__actions')?.getBoundingClientRect();
      const proofIntegrated = Boolean(mediaRect && copyRect
        && copyRect.left < mediaRect.right
        && copyRect.right > mediaRect.left
        && copyRect.top < mediaRect.bottom
        && copyRect.bottom > mediaRect.top);
      return ({
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      ctaHref: document.querySelector('[data-organic-href]')?.getAttribute('href'),
      h1: document.querySelector('h1')?.textContent?.trim(),
      heroLayered: Boolean(heroStageRect && heroInnerRect
        && heroMediaStyle.position === 'absolute'
        && heroOverlayStyle.display !== 'none'
        && Math.abs(heroStageRect.top - heroInnerRect.top) < 1
        && Math.abs(heroStageRect.bottom - heroInnerRect.bottom) < 1),
      heroMediaBackground: heroMediaStyle.backgroundImage,
      navLinksVisible: navLinksStyle.display !== 'none',
      navPartsOverlap: Boolean(navBrandRect && navLinksRect && navActionsRect
        && (navBrandRect.right > navLinksRect.left || navLinksRect.right > navActionsRect.left)),
      navToggleVisible: navToggleStyle.display !== 'none',
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      prices: document.body.innerText.includes('32 000') && document.body.innerText.includes('48 000'),
      proofEdgeToEdge: Boolean(mediaRect && sectionRect
        && Math.abs(mediaRect.left - sectionRect.left) < 1
        && Math.abs(mediaRect.right - sectionRect.right) < 1
        && Math.abs(mediaRect.top - sectionRect.top) < 1
        && Math.abs(mediaRect.bottom - sectionRect.bottom) < 1),
      proofMediaPosition: mediaStyle.position,
      proofMediaRadius: photoStyle.borderRadius,
      proofMediaShadow: photoStyle.boxShadow,
      qualification: document.body.innerText.includes('Профессиональная переподготовка, 333 часа'),
      proofColumns: getComputedStyle(document.querySelector('.trainer-proof')).gridTemplateColumns.split(' ').length,
      proofIntegrated,
      proofSourceCount: document.querySelectorAll('.trainer-proof__media source').length,
      trainerImageAlt: document.querySelector('.trainer-proof__photo')?.alt ?? '',
      trainerImageHeight: document.querySelector('.trainer-proof__photo')?.naturalHeight ?? 0,
      trainerImageSource: document.querySelector('.trainer-proof__photo')?.currentSrc ?? '',
      trainerImageWidth: document.querySelector('.trainer-proof__photo')?.naturalWidth ?? 0,
      });
    })()`);
    const expectedAsset = PROOF_ASSETS[viewport.asset];
    if (result.canonical !== "https://yokhanfitness.ru/coaching.html") failures.push(`${viewport.name}: canonical`);
    if (result.ctaHref !== "https://t.me/YokhanGym_bot?start=buffit_coaching") failures.push(`${viewport.name}: direct CTA`);
    if (result.h1 !== "Фитнес-тренер онлайн — Игорь Назаров") failures.push(`${viewport.name}: H1`);
    if (!result.heroLayered) failures.push(`${viewport.name}: main hero background layer`);
    if (!result.heroMediaBackground.includes(HERO_ASSETS[viewport.heroAsset])) failures.push(`${viewport.name}: main hero asset`);
    if (viewport.navMode === "mobile" && (!result.navToggleVisible || result.navLinksVisible)) failures.push(`${viewport.name}: mobile nav mode`);
    if (viewport.navMode === "desktop" && (result.navToggleVisible || !result.navLinksVisible)) failures.push(`${viewport.name}: desktop nav mode`);
    if (viewport.navMode === "desktop" && result.navPartsOverlap) failures.push(`${viewport.name}: desktop nav overlap`);
    if (result.overflow > 1) failures.push(`${viewport.name}: overflow ${result.overflow}px`);
    if (!result.prices) failures.push(`${viewport.name}: prices`);
    if (!result.qualification) failures.push(`${viewport.name}: qualification`);
    if (result.proofColumns !== 1) failures.push(`${viewport.name}: proof columns`);
    if (result.proofIntegrated !== viewport.integrated) failures.push(`${viewport.name}: proof integration`);
    if (result.proofEdgeToEdge !== viewport.edgeToEdge) failures.push(`${viewport.name}: proof edge-to-edge`);
    if (result.proofMediaPosition !== "absolute") failures.push(`${viewport.name}: proof background layer`);
    if (result.proofMediaRadius !== "0px") failures.push(`${viewport.name}: proof radius`);
    if (result.proofMediaShadow !== "none") failures.push(`${viewport.name}: proof shadow`);
    if (result.proofSourceCount !== 3) failures.push(`${viewport.name}: proof source contract`);
    if (!result.trainerImageAlt) failures.push(`${viewport.name}: proof alt`);
    if (!result.trainerImageSource.endsWith(expectedAsset.source)) failures.push(`${viewport.name}: proof source`);
    if (result.trainerImageWidth !== expectedAsset.width) failures.push(`${viewport.name}: proof width`);
    if (result.trainerImageHeight !== expectedAsset.height) failures.push(`${viewport.name}: proof height`);
    const proofScreenshot = await page.send("Page.captureScreenshot", { format: "png", fromSurface: true });
    await writeFile(resolve(OUTPUT_DIR, `${viewport.name}-proof.png`), Buffer.from(proofScreenshot.data, "base64"));
    await page.send("Runtime.evaluate", {
      awaitPromise: true,
      expression: `(async () => {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      })()`,
      returnByValue: true,
    });
    const screenshot = await page.send("Page.captureScreenshot", { format: "png", fromSurface: true });
    await writeFile(resolve(OUTPUT_DIR, `${viewport.name}.png`), Buffer.from(screenshot.data, "base64"));

    await runtime.navigateDocument(page, COACH_URL, viewport);
    await waitForImages(page);
    const coachResult = await runtime.evaluate(page, `({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      portraitHeight: document.querySelector('.coach-portrait')?.naturalHeight ?? 0,
      portraitSource: document.querySelector('.coach-portrait')?.currentSrc ?? '',
      portraitWidth: document.querySelector('.coach-portrait')?.naturalWidth ?? 0,
      sections: document.querySelectorAll('main section').length,
    })`);
    if (coachResult.overflow > 1) failures.push(`${viewport.name}: coach overflow ${coachResult.overflow}px`);
    if (!coachResult.portraitSource.includes('b01-06d-trainer-calibration-ceramic-mobile-v7-800')) failures.push(`${viewport.name}: coach portrait source`);
    if (Math.abs((coachResult.portraitWidth / coachResult.portraitHeight) - 0.8) > 0.01) failures.push(`${viewport.name}: coach portrait ratio`);
    if (coachResult.sections > 4) failures.push(`${viewport.name}: coach section count`);
    const coachScreenshot = await page.send("Page.captureScreenshot", { format: "png", fromSurface: true });
    await writeFile(resolve(OUTPUT_DIR, `${viewport.name}-coach.png`), Buffer.from(coachScreenshot.data, "base64"));
  }
} finally {
  await chrome.close();
}

if (failures.length > 0) {
  console.error(JSON.stringify({ failures }, null, 2));
  process.exit(1);
} else {
  console.log(`coaching_layout_ok viewports=${VIEWPORTS.length} output=${OUTPUT_DIR}`);
  process.exit(0);
}
