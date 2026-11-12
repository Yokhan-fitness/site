# PROJECT_SPEC -- YokhanFitnessLanding

## What this project is

YokhanFitnessLanding is a static multipage BUFF IT fitness/wellness site. Its job is to expand first acquaintance, segment visitors by goal/readiness, and route them to Telegram diagnostics, personal contact, guides, or the current paid 12-week coaching offer.

## Stack

- Static HTML pages in the repository root.
- CSS design system in `css/`: tokens, shared components, hero/header/dropdown systems, program/detail/page components.
- Lightweight browser JS in `js/`: navigation menu state, scroll header state, pointer glow.
- Structured content maps in `data`: CTA map, program catalog, tool map, product matrix.

## Key surfaces

- `index.html` -- premium ecosystem entry.
- `programs.html`, `men.html`, `women.html`, `program-*.html` -- goal routes and program details.
- `coaching.html`, `training.html`, `self-training.html` -- product formats and pricing.
- `app.html`, `calls-access.html`, `nutrition.html`, `guide.html`, `health.html`, `safety.html` -- support tools and safety/material routes.
- `start.html`, `bot.html`, `links.html` -- routing/entry surfaces.
- `account.html` -- BUFF IT ID / Keycloak SSO entry hub. It routes to Keycloak and connected services; it must not store tokens, passwords, refresh tokens, or client secrets.

## Current product state

- Main paid offer: 12-week online coaching, optional extension to 16 weeks.
- Formats: 2 trainings/week + homework or 3 trainings/week.
- Fixed coaching pricing: 26k/month and 34k/month. Do not publish future or launch pricing.
- A short fit conversation clarifies the goal, schedule, constraints and format; do not market it as a temporary launch promotion.
- Low-ticket route: one-time consultation for 5-8k with a science-based program and one correction after a week.

## Current constraints

- Header/dropdown is a shared sensitive component. Do not edit it casually; previous regressions came from duplicated nav markup and competing CSS owners.
- Keep visual values token/component based. Prefer existing grids/cards/sections before adding new CSS.
- Avoid medical treatment claims. HEALTH is a safety boundary and red-flag router, not a promise to treat diagnoses.
- Use UTF-8 without BOM. After Cyrillic rewrites, scan for replacement question marks and mojibake.
- Keep `data/sso-map.json` aligned with live SSO status before changing user-facing account/service links.

## Last scan

2026-05-29

## Public Verification

Run after public deploys:

```powershell
py -3 scripts\check-public-buffit.py --base-url https://yokhanfitness.ru/
```

This verifies current customer-facing markers, rejects stale offer terms, and confirms that public `data/*.json` files are served as JSON rather than falling through to the HTML shell.

