const SEARCH_REFERRER_HOSTS = new Set([
  "google.com",
  "www.google.com",
  "google.ru",
  "www.google.ru",
  "yandex.ru",
  "www.yandex.ru",
  "ya.ru",
  "www.ya.ru",
]);

function getReferrerHost(referrer) {
  if (!referrer) return "";

  try {
    return new URL(referrer).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function applyOrganicCoachingSource() {
  const referrerHost = getReferrerHost(document.referrer);
  if (!SEARCH_REFERRER_HOSTS.has(referrerHost)) return;

  document.querySelectorAll("[data-organic-href]").forEach((link) => {
    link.setAttribute("href", link.dataset.organicHref);
  });
}

applyOrganicCoachingSource();
