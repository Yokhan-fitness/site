# Tool Registry

> Searchable index of reusable utilities across this project.
> **Check HERE before writing new code.** See `.claude/library/technical/atomic-reuse.md`.
>
> Maintained by: agents (manual), `scripts/scan-project.sh` (initial), `scripts/audit-reuse.sh` (ongoing).

## Template-Level (available in ALL projects)

| Tool | Path | Purpose |
|------|------|---------|
| check-drift | scripts/check-drift.sh | Template health check (9 checks) |
| check-banlist | scripts/check-banlist.sh | AI-slop word scanner for content |
| session-metrics | scripts/session-metrics.sh | Session stats collector (daily log) |
| sync-template | scripts/sync-template.js | Native digest-bound preview/apply with conflict checks and transactional rollback |
| sync-all | scripts/sync-all.js | One reviewed external plan per project; no blanket apply |
| bootstrap-mcp | scripts/bootstrap-mcp.sh | MCP server auto-setup |
| configure-codex-mcp | scripts/configure-codex-mcp.js | Merge only the managed Codex MCP block and reject unmanaged collisions |
| code-intelligence-tools | scripts/code-intelligence-tools.js | Validate and health-check the pinned ten-tool stack |
| writing-library | scripts/writing-library.js | Discover the external six-source store and retrieve fresh task-bound primary passages |
| validate-agent-sot | scripts/validate-agent-sot.js | Verify agent source registry and instruction entrypoints |
| validate-codex-skills | scripts/validate-codex-skills.js | Validate installed repository skills |
| validate-codex-agents | scripts/validate-codex-agents.js | Validate role profiles without claiming effective runtime |
| test-codex-routing | scripts/test-codex-routing.js | Verify workflow selection and ownership gates |
| validate-text-policy | scripts/validate-text-policy.js | Verify UTF-8, line endings and platform-safe scripts |
| audit-reuse | scripts/audit-reuse.sh | Duplicate detector, extraction candidates |
| scan-project | scripts/scan-project.sh | Initial project scan, registry population |
| test-hooks | scripts/test-hooks.sh | Hook syntax validation |
| brain-search | scripts/brain-search.sh | Search brain/ knowledge base |

## Project-Level (auto-populated by scan-project.sh, updated by agents)

| Tool | Path | Purpose | Used by |
|------|------|---------|---------|
| multi-page landing | index.html, men.html, women.html, method.html, start.html | Static program funnel pages | public website |
| design system notes | docs/DESIGN_SYSTEM.md | Token/component/content rules for this landing | agents |
| BUFF IT rework strategy | docs/BUFFIT_SITE_REWORK_STRATEGY_20260528.md | Funnel/page/tool integration strategy and next tool ideas | agents |
| BUFF IT tool map | data/tool-map.json | Existing surfaces, service roles, and new tool ideas | agents |
| BUFF IT CTA map | data/cta-map.json, docs/CTA_SOURCE_PARAM_MAP_20260528.md | Page CTA, Telegram start-param, funnel stage, and post-bot route map | agents |
| BUFF IT bot result matrix | docs/BOT_RESULT_MESSAGE_MATRIX_20260528.md | Copy contract for post-bot route messages and CTAs | agents |
| public SEO contract | scripts/check-public-seo.py | Local/live canonical inventory, sitemap, metadata, schema, price and source-handoff smoke | SEO releases |
| coaching source test | scripts/test-coaching-source.js | Executes Google, Yandex, internal and direct referrer branches for the coaching CTA | SEO releases |
| coaching rendered check | scripts/check-coaching-layout.mjs | Verifies live mobile/desktop H1, canonical, prices, CTA and horizontal geometry; saves screenshots | SEO releases |
| semantic media role check | scripts/check-media-role-contract.mjs | Verifies pairwise route differentiation, responsive asset pairs, technique review status and exported files | landing media |
| audience media rendered check | scripts/check-audience-media.mjs | Verifies six route heroes use the intended desktop/mobile semantic media without overflow | landing media |
| landing component coverage | scripts/check-landing-component-coverage.mjs | Verifies every required production landing selector has one canonical Storybook owner | landing + design-system adoption |
| generated media exporter | scripts/export-generated-media.ps1 | Copies approved raw output and creates responsive WebP/AVIF derivatives with stable names | landing media |
| page grid rendered check | scripts/check-page-grid.mjs | Enforces wide-frame, content-grid and readable-span geometry at mobile, tablet and desktop widths | landing layout |

## Helpers & Utilities (src/shared/ or lib/)

| Function | Path | Signature | Used by |
|----------|------|-----------|---------|
| _Run `bash scripts/audit-reuse.sh` to detect_ | | | |

## Candidates for Extraction (auto-detected by audit-reuse.sh)

| Function | Found in | Count | Recommendation |
|----------|----------|-------|----------------|
| _Run `bash scripts/audit-reuse.sh` to detect_ | | | |

## Design Tokens & Components

| Component | ID/Path | Variants | Used by |
|-----------|---------|----------|---------|
| token system | css/tokens.css | typography, color, surfaces, spacing, radius, motion | all CSS |
| base primitives | css/base.css | container, section, heading, button, surface-card | index.html |
| header shell | css/header-system.css | fixed shell, logo, desktop triggers, mobile toggle, solid/open/closing states | all pages |
| header dropdown | css/nav-dropdown-system.css | Oura-like top dropdown panel, cards, quick links, mobile submenu | all pages |
| header controller | js/nav-menu.js | token-driven hover/click/focus/Escape/outside close behavior | all pages |
| hero frame shell | css/hero-shell-system.css | shared hero frame geometry after page-level hero styles | all pages |
| hero system | css/hero.css | hero content, preview item, metric tile | index.html |
| page component overrides | css/page-components.css | Oura-like home hero, internal hero surfaces, media/card unification, responsive page fixes | all pages |
| program cards | css/programs.css | default, featured, men/women section themes | index.html |
| sales components | css/sales.css | route cards, specs, friction, FAQ | all pages |
| CTA/footer | css/cta.css | offer strip, footer links | all pages |

---

_Last scan: manual update 2026-05-25_
