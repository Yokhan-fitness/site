# YokhanFitness Landing Design System

## Reference Synthesis

Oura-style reference for this pass:
- calm health-tech tone instead of loud sport promo;
- product promise first, then measurable next action;
- warm light health-product surfaces, graphite text, precise action color;
- modular cards for goals, metrics, steps, and decision points.

Local Yokhan constraints:
- static HTML + CSS only;
- Russian direct "ты" voice;
- Telegram bot is the current receiver;
- no stock-looking photo assets in repo yet, so the first pass uses a structured product surface instead of fake imagery.

## Consumer Contract

Shared header geometry, auth action, dropdown controls, tokens and rendered gates are owned by `BuffItDesignSystem`. This repository owns public copy, routes, homepage composition and static adapters.

The executable adoption record is `contracts/design-system-consumer.json`. It pins the design-system package version and SHA-256 of every canonical source consumed by the landing. Run `$env:BUFFIT_DS_ROOT='<path-to-BuffItDesignSystem>'; node scripts/check-home-layout.mjs` to verify source drift, six real-page viewports, closed/open navigation, touch targets, focus entry/return, first-screen CTA, route density and responsive media.

The integration is intentionally `pinned-static-adapter`, not a runtime package import: the design-system package is private, exports raw source and does not yet publish a production CSS bundle.

## Tokens

Shared source of truth: `BuffItDesignSystem/src/css/tokens.css`. Landing-specific aliases and composition tokens live in `css/tokens.css` and must not redefine shared semantics silently.

Token groups:
- typography: `--font-display`, `--font-body`, `--text-*`, `--line-*`;
- color primitives: graphite, ivory, moss, mineral, clay, rose;
- semantic surfaces: `--surface-page`, `--surface-panel`, `--surface-soft`, `--surface-accent`;
- semantic text and accents: `--text-primary`, `--text-secondary`, `--text-muted`, `--accent-*`;
- shape and layout: `--radius-*`, `--space-*`, `--layout-max`, `--nav-height`;
- interaction: `--focus-ring`, `--motion-fast`.

Rules:
- hardcoded color values live only in `tokens.css`;
- section and component files consume semantic tokens;
- card radius is capped at `--radius-sm` for production cards;
- letter spacing is `0`, including display headings.

## Components

CSS component files:
- `css/header-system.css` — fixed Oura-like header shell, solid/open/closing states, mobile toggle.
- `css/account-system.css` — auth-entry appearance only; it must not redefine responsive header geometry.
- `css/home-flow.css` — homepage-only composition, responsive media and density adapters.
- `css/nav-dropdown-system.css` — top dropdown panel, product cards, quick links, mobile submenu.
- `css/hero-shell-system.css` — shared hero frame geometry, including mobile hero padding/width constraints.
- `css/hero.css` — hero content, product preview, metric tiles.
- `css/programs.css` — program catalog, route cards, support/service blocks, offer formats.
- `css/program-detail.css` — program detail grids, outcomes, phases, related routes.
- `css/components.css` and `css/page-components.css` — reusable cards, service/link surfaces, Oura-like media sections and page-level composition.
- `css/sales.css`, `css/cta.css`, `css/ecosystem.css` — sales blocks, CTA/footer, ecosystem/service layouts.

Core components and states:
- Button: default, hover, active, focus, disabled via `aria-disabled`.
- Header trigger/dropdown: default, hover/open, switching, closing, scrolled, mobile open.
- Program card: default and featured variants.
- Route/support/service/link card: default, hover, focus.
- Program detail outcome/phase/related card: default, hover/focus for links.
- Safety note: informational boundary for medical red flags.
## Content Model

Current page structure:
1. `index.html` / `start.html`: premium ecosystem entry and decision bridge before bot/direct contact.
2. `programs.html`, `men.html`, `women.html`, `program-*.html`: goal-specific 12-week routes.
3. `training.html`, `coaching.html`, `app.html`: current paid coach-led delivery and support tooling.
4. `self-training.html`: current low-ticket lane for a one-time 5–8k consultation, not a full coaching subscription.
5. `guide.html`, `health.html`, `safety.html`, `calls-access.html`, `links.html`, `bot.html`: not-ready, safety, call, and routing surfaces.

Claims are intentionally bounded:
- no promise to cure medical conditions;
- no guaranteed fat loss timing;
- no depression/prostate claims until we add source-backed proof blocks and medical wording review.

## Missing Assets

For the next visual-quality pass, add:
- 3-6 real photos or short vertical clips of Igor/training setups;
- before/after or testimonial assets with permission;
- exact proof blocks for each priority program;
- final program packaging: duration, included support, expected client inputs, contraindications.

## Related Working Tables

- `docs/DESIGN_TOKENS_TABLE.md` - full token table by section.
- `docs/CONTENT_ASSET_PLAN.md` - content and asset needs by funnel section.
- `docs/CTA_SOURCE_PARAM_MAP_20260528.md` - CTA, Telegram start-param and post-bot route map.
- `docs/OURA_DESIGN_SYSTEM_STUDY.md` - Oura design-system and sales-architecture study.

## Applied Oura Pattern

Current landing now applies the Oura PDP sequence:
- hero as offer/product selector;
- early men/women program choice;
- mechanism section: inputs -> start -> correction;
- friction removal section;
- package/spec table;
- FAQ and final CTA;
- safety boundary before conversion.

Still missing for a true Oura-level pass:
- real hero media;
- program-specific proof;
- bot/process screenshots;
- final package names and support details.

## Multi-Page Architecture

Applied after the Oura PDP review:
- `index.html` — overview and route chooser.
- `men.html` — male program catalog and male-specific stakes.
- `women.html` — female program catalog and female-specific stakes.
- `method.html` — method, friction removal, package specs, safety boundaries.
- `start.html` — bot/channel/direct-contact start routes, pricing, FAQ.

Navigation uses real pages instead of one-page anchors. Header state is controlled by `js/nav-menu.js`, `js/nav-state.js`, `css/header-system.css`, and `css/nav-dropdown-system.css`; page-local header drift is not allowed.
- docs/PHOTO_SHOT_LIST.md - photo tasks and capture checklist for the next visual pass.
