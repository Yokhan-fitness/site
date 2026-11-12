const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const SOURCE_PATH = path.resolve(__dirname, "../js/coaching-source.js");
const ORGANIC_HREF = "https://t.me/YokhanGym_bot?start=buffit_coaching_seo";
const DIRECT_HREF = "https://t.me/YokhanGym_bot?start=buffit_coaching";

function runSource(referrer) {
  const link = {
    dataset: { organicHref: ORGANIC_HREF },
    href: DIRECT_HREF,
    setAttribute(name, value) {
      if (name === "href") this.href = value;
    },
  };
  const document = {
    referrer,
    querySelectorAll(selector) {
      assert.equal(selector, "[data-organic-href]");
      return [link];
    },
  };
  const source = fs.readFileSync(SOURCE_PATH, "utf8");
  vm.runInNewContext(source, { document, URL });
  return link.href;
}

const cases = [
  ["Google", "https://www.google.com/search?q=fitness", ORGANIC_HREF],
  ["Yandex", "https://yandex.ru/search/?text=fitness", ORGANIC_HREF],
  ["internal", "https://yokhanfitness.ru/coach/", DIRECT_HREF],
  ["empty", "", DIRECT_HREF],
];

for (const [name, referrer, expectedHref] of cases) {
  assert.equal(runSource(referrer), expectedHref, `${name} referrer`);
  console.log(`PASS ${name} referrer`);
}
