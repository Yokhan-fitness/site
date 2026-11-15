import fs from 'node:fs';
import path from 'node:path';
import {
  extractCanonicalHeader,
  loadRegistry,
  validateCanonicalHeader,
} from './site-header-contract.mjs';

const appearance = `<section class="public-appearance" aria-label="Оформление сайта"><label>Стиль <select aria-label="Стиль сайта" data-public-profile-select="style"><option value="logik">Logik</option><option value="estet">Estet</option></select></label><label>Тема <select aria-label="Тема сайта" data-public-profile-select="mode"><option value="light">Светлая</option><option value="dark">Тёмная</option></select></label></section>`;

function renderStaticMobileNav(owner) {
  const normalized = String(owner || '').toLowerCase();
  const activeId = normalized === 'index.html'
    ? 'home'
    : /program|training|coach|personal|self-training|start|men|women|health|method|safety/.test(normalized)
      ? 'programs'
      : /nutrition|food/.test(normalized)
        ? 'nutrition'
        : /about/.test(normalized)
          ? 'about'
          : 'services';
  const items = [
    { id: 'home', label: 'Главная', href: '/', icon: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>' },
    { id: 'programs', label: 'Тренировки', href: '/programs.html', icon: '<path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"/><path d="m2.5 21.5 1.4-1.4"/><path d="m20.1 3.9 1.4-1.4"/><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"/><path d="m9.6 14.4 4.8-4.8"/>' },
    { id: 'nutrition', label: 'Еда', href: '/nutrition.html', icon: '<path d="M7 21h10"/><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1"/><path d="m13 12 4-4"/><path d="M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2"/>' },
    { id: 'services', label: 'Сервисы', href: '/ecosystem.html', icon: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>' },
    { id: 'about', label: 'Об авторе', href: '/about.html', icon: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>' },
  ];
  const links = items.map((item) => {
    const active = item.id === activeId;
    return `<a aria-label="${item.label}"${active ? ' aria-current="page"' : ''} class="buffit-bottom-nav__item" data-active="${active}" data-control-id="${item.id}" data-tone="secondary" href="${item.href}"><span class="buffit-bottom-nav__icon"><svg aria-hidden="true" class="buffit-open-icon" data-buffit-icon-profile="logik" fill="none" focusable="false" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.65" viewBox="0 0 24 24" width="24">${item.icon}</svg></span><span class="buffit-bottom-nav__label">${item.label}</span></a>`;
  }).join('');
  return `<nav aria-label="Мобильная навигация" class="buffit-bottom-nav buffit-bottom-nav--app buffit-bottom-nav--floating buffit-public-mobile-nav" data-buffit-nav-profile="logik" data-semantic="app-navigation" data-variant="app" style="--buffit-bottom-nav-active-index:${items.findIndex((i) => i.id === activeId)};--buffit-bottom-nav-item-count:5;--buffit-bottom-nav-menu-inline:calc(var(--buffit-bottom-nav-padding-inline) + var(--buffit-bottom-nav-padding-inline) + 5 * var(--buffit-bottom-nav-item-inline) + 4 * var(--buffit-bottom-nav-item-gap))"><div class="buffit-bottom-nav__menu"><div class="buffit-bottom-nav__glass buffit-material" data-buffit-style="flat" data-buffit-surface-level="overlay">${links}</div></div></nav>`;
}

export function preparePublicPresentation(html, owner, repo) {
  const home = fs.readFileSync(path.join(repo, 'index.html'), 'utf8');
  const header = extractCanonicalHeader(home);
  validateCanonicalHeader(header, loadRegistry(repo));
  if (owner !== 'index.html') {
    const rootedHeader = header.replace(/\bhref="(?!https?:|\/|#)([^"]+)"/gi, 'href="/$1"');
    html = html.replace(/<a\b[^>]*class="promo-bar"[\s\S]*?<\/a>/i, '');
    html = /<nav\b[^>]*class="nav\b/i.test(html)
      ? html.replace(/<nav\b[^>]*class="nav\b[\s\S]*?<\/nav>/i, rootedHeader)
      : html.replace(/(<body\b[^>]*>)/i, `$1\n${rootedHeader}`);
    // Old navigation sheets use a different breakpoint/grid contract. The
    // canonical header bundle owns these selectors throughout the public site.
    html = html.replace(/<link\b[^>]*href="[^\"]*css\/(?:header-system|nav-dropdown-system|account-system|interaction-system)\.css[^\"]*"[^>]*>/gi, '');
    // Header CSS is exported with the accepted Home, not reimplemented here.
    if (!html.includes('buffit-home-system.css') && !html.includes('buffit-page-blocks.css'))
      html = html.replace('</head>', '<link rel="stylesheet" href="/css/buffit-home-system.css">\n</head>');
    html = html.replace(/<script\b[^>]*src="[^\"]*js\/nav-menu\.js"[^>]*><\/script>/gi, '');
    html = html.replace('</body>', '<script defer src="/js/nav-menu.js"></script>\n</body>');
  }
  html = html.replace(
    /<meta(\s+[^>]*\bname=["']viewport["'][^>]*\bcontent=["'])([^"']*)(["'][^>]*)>/iu,
    (match, prefix, content, suffix) => (/viewport-fit\s*=/i.test(content) ? match : `<meta${prefix}${content}, viewport-fit=cover${suffix}>`),
  );
  html = html.replace(/<html\b[^>]*>/i, tag => tag.replace(/\s+data-buffit-(?:design-style|mode)="[^"]*"/g, '').replace('>', ' data-buffit-design-style="logik" data-buffit-mode="light">'));
  html = html.replace(/<link\b[^>]*rel="(?:shortcut )?icon"[^>]*>/gi, '');
  html = html.replace(/<script\b[^>]*src="[^"]*js\/public-profile\.js[^"]*"[^>]*><\/script>\s*/gi, '');
  // This external script is CSP-compatible and runs before styles load.
  html = html.replace(/<head>/i, '<head>\n<script src="/js/public-profile.js"></script>\n<link rel="icon" type="image/svg+xml" href="/assets/buffit-favicon.svg?v=20261017">');
  html = html.replace('</head>', '<link rel="stylesheet" href="/css/public-profile.css">\n</head>');
  if (!html.includes('buffit-public-mobile-nav'))
    html = html.replace('</body>', `${renderStaticMobileNav(owner)}\n</body>`);
  html = html.replace('</body>', `${appearance}\n</body>`);
  if (!html.includes('src="/js/public-account.js"'))
    html = html.replace('</body>', '<script defer src="/js/public-account.js"></script>\n</body>');
  return html;
}
