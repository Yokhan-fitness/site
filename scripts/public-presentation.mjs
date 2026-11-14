import fs from 'node:fs';
import path from 'node:path';
import {
  extractCanonicalHeader,
  loadRegistry,
  validateCanonicalHeader,
} from './site-header-contract.mjs';

const appearance = `<section class="public-appearance" aria-label="Оформление сайта"><label>Стиль <select aria-label="Стиль сайта" data-public-profile-select="style"><option value="logik">Logik</option><option value="estet">Estet</option></select></label><label>Тема <select aria-label="Тема сайта" data-public-profile-select="mode"><option value="light">Светлая</option><option value="dark">Тёмная</option></select></label></section>`;

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
    if (!html.includes('href="/css/buffit-home-system.css"'))
      html = html.replace('</head>', '<link rel="stylesheet" href="/css/buffit-home-system.css">\n</head>');
    html = html.replace(/<script\b[^>]*src="[^\"]*js\/nav-menu\.js"[^>]*><\/script>/gi, '');
    html = html.replace('</body>', '<script defer src="/js/nav-menu.js"></script>\n</body>');
  }
  html = html.replace(/<html\b[^>]*>/i, tag => tag.replace(/\s+data-buffit-(?:design-style|mode)="[^"]*"/g, '').replace('>', ' data-buffit-design-style="logik" data-buffit-mode="light">'));
  html = html.replace(/<link\b[^>]*rel="(?:shortcut )?icon"[^>]*>/gi, '');
  html = html.replace(/<script\b[^>]*src="[^"]*js\/public-profile\.js[^"]*"[^>]*><\/script>\s*/gi, '');
  // This external script is CSP-compatible and runs before styles load.
  html = html.replace(/<head>/i, '<head>\n<script src="/js/public-profile.js"></script>\n<link rel="icon" type="image/svg+xml" href="/assets/buffit-favicon.svg?v=20261017">');
  html = html.replace('</head>', '<link rel="stylesheet" href="/css/public-profile.css">\n</head>');
  html = html.replace('</body>', `${appearance}\n</body>`);
  if (!html.includes('src="/js/public-account.js"'))
    html = html.replace('</body>', '<script defer src="/js/public-account.js"></script>\n</body>');
  return html;
}
