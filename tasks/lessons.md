# Lessons Learned

Self-improvement log for AI agent sessions. After EVERY user correction or discovered mistake, add an entry below using the format shown in the example. Read this file at the start of every session to avoid repeating past mistakes.

When this file exceeds 50 entries, run `/weekly` to promote recurring patterns into permanent rules (`.claude/rules/`) and archive promoted entries to `brain/03-knowledge/lessons-archive.md`.

---

## Entry Format

```
### [YYYY-MM-DD] — [Brief descriptive title]
**Error**: What went wrong (observable symptom)
**Root cause**: Why it happened (the actual underlying issue)
**Rule**: Concrete, actionable prevention rule for the future
**Applies to**: [agent name / skill name / general]
**Category**: [security | architecture | testing | workflow | tooling | general]
```

---

## Entries

### 2026-07-25 — Design-system downstream markers do not prove pinned static-adapter freshness
**Error**: `BuffItDesignSystem check:downstreams` passed, while the landing release gate still failed because three canonical source hashes in `contracts/design-system-consumer.json` were stale.
**Root cause**: The design-system check validates consumer markers and forbidden patterns; the landing-owned `check-home-layout.mjs` separately owns exact source pinning for the `pinned-static-adapter`.
**Rule**: Before a landing deploy, run both gates. Repin only after the current design-system build, contracts and rendered landing checks pass; never treat the shallow downstream marker check as source-freshness proof.
**Applies to**: Codex / BuffItDesignSystem / YokhanFitnessLanding / deployment
**Category**: workflow

### 2026-07-22 — A partial media allowlist is not a complete landing release
**Error**: Production HTML/CSS referenced 28 generated AVIF/WebP files that were absent from the server, although the previous media release itself had succeeded.
**Root cause**: The release verified only its hand-written allowlist instead of deriving every active media dependency from the rendered HTML/CSS graph.
**Rule**: Before and after a landing media deploy, compute the full HTML → CSS/import → src/srcset/poster/url dependency closure and require every local asset to exist locally and return 200 publicly.
**Applies to**: Codex / landing deploy work
**Category**: workflow

### 2026-03-17 — Example: Hallucinated npm package name
**Error**: Recommended `@utils/smart-merge` package which does not exist on npm.
**Root cause**: Generated a plausible-sounding package name from training data without verifying it exists. No verification step was performed before recommending.
**Rule**: Before recommending ANY external package, verify it exists by running `npm view <package>` or checking the official registry. If unable to verify, state confidence as LOW and flag it explicitly.
**Applies to**: researcher, implementer, general
**Category**: tooling

### 2026-05-25 - Product component drift on BUFF IT landing
**Error**: The landing pass reused the home hero image on internal pages and left navigation/page branding only partially componentized.
**Root cause**: Visual polish was applied before finishing the product component model: shared header, product-family labels, image ownership, and page-level asset rules.
**Rule**: For multi-page brand work, finish brand/navigation/media components first. Do not reuse a hero image as a generic page background; if owned imagery is missing, document a specific image brief and use neutral component surfaces.
**Applies to**: Codex / codex-design-workflow
**Category**: workflow

### 2026-05-26 - Dropdown state was open but clipped
**Error**: BUFF IT navigation dropdown state could be active while the menu was visually missing on secondary pages.
**Root cause**: Legacy `.nav__links { overflow-x: auto; }` clipped the absolutely positioned dropdown, and the first fix checked class/aria state before checking computed visibility and clipping.
**Rule**: For interactive UI fixes, verify both behavior state and rendered state: class/aria, computed visibility/opacity/pointer-events, parent overflow, and a screenshot of the open state.
**Applies to**: Codex / codex-design-workflow
**Category**: testing

### 2026-05-26 - Late CSS layer kept headers inconsistent
**Error**: BUFF IT headers still differed after adding a shared nav component.
**Root cause**: `components.css` loaded after `nav-menu.css` and still contained old `.pdp-hero-page .nav__inner` rules, so the home page was silently overriding the shared header.
**Rule**: Before declaring a shared UI component fixed, inspect the full CSS load order and verify final computed styles on at least one primary and one secondary page.
**Applies to**: Codex / codex-design-workflow
**Category**: testing

### 2026-05-26 - Overdesigned nav dropdown without UX review
**Error**: The BUFF IT desktop dropdown became a large light card grid that looked heavy, covered the hero awkwardly, and did not match current navigation UX expectations.
**Root cause**: The component was shaped visually before reviewing whether the information architecture needed a mega-menu or a compact disclosure dropdown.
**Rule**: For navigation UI, decide the interaction pattern first: compact disclosure for small link sets, mega-menu only for broad category browsing. Validate against current UX/accessibility references before visual polishing.
**Applies to**: Codex / codex-domain-design-review / codex-design-workflow
**Category**: workflow

### 2026-05-26 - Dropdown positioned from shell instead of trigger
**Error**: The BUFF IT dropdown opened as a page-level panel instead of dropping under the active menu item, and the hero shell lost the side inset that defines the page rhythm.
**Root cause**: The final system CSS layer set `.nav__group` to `position: static` and overrode `.hero__stage` to `100vw`, so later token work was bypassing the actual component geometry.
**Rule**: For shared UI shells, verify final computed rectangles, not just class names: nav shell x/right, hero shell x/right, trigger x, dropdown x/y, and viewport bounds on desktop and mobile.
**Applies to**: Codex / codex-design-workflow
**Category**: testing

### 2026-05-26 - Header position drift from page flow
**Error**: BUFF IT header and hover states still looked different between pages, and the button glow became a visually noisy multi-stop effect.
**Root cause**: The nav component still participated in page flow and inherited old hover rules, while the interaction layer added a complex spotlight instead of the requested simple premium hover.
**Rule**: For global headers, keep the shell geometry independent from page content (`fixed` or one shared layout contract) and verify computed rectangles across several page types. For premium hover effects, start with one-color soft-light gradients before adding extra color stops.
**Applies to**: Codex / codex-design-workflow
**Category**: testing

### 2026-05-26 - CSS hover overrode controlled dropdown state
**Error**: Navigation dropdown stayed visually open after Escape because older CSS hover/focus selectors reopened it even after JS removed `is-open`.
**Root cause**: The final dropdown layer only defined the open state and did not explicitly override earlier `:hover`/`:focus-within` open rules from previous nav CSS layers.
**Rule**: For controlled disclosure components, make `is-open` the only visible state in the final CSS layer and add an explicit hidden rule for `:not(.is-open)` to neutralize older hover/focus rules.
**Applies to**: Codex / codex-design-workflow
**Category**: testing

### 2026-05-26 - Decorative dropdown captions hurt UX
**Error**: BUFF IT dropdown kept gold caption labels above every item, first repeating the brand and then adding redundant category text.
**Root cause**: Treated visual hierarchy decoration as useful navigation information instead of checking whether it helps the user choose a destination.
**Rule**: In navigation menus, every visible text layer must help recognition or decision. Remove decorative kickers/captions; put the useful meaning in the main link label and keep descriptions only where they clarify the overview item.
**Applies to**: Codex / codex-design-workflow / codex-domain-communication-review
**Category**: workflow

### 2026-05-27 - Header drift from copied page-local nav
**Error**: BUFF IT header kept changing between pages after dropdown/header tweaks, even though the intended direction was an Oura-like shared header system.
**Root cause**: Header fixes were applied through repeated page-local nav markup and overlapping legacy nav CSS layers instead of making one canonical header contract and verifying identical markup across all pages.
**Rule**: For global navigation, create one canonical header markup and one final loaded CSS contract before page polishing. Verify by hashing every `<nav>` block, checking CSS load order, and confirming no page-specific active state exists in shared header markup.
**Applies to**: Codex / codex-design-workflow / codex-domain-design-review
**Category**: testing
### 2026-05-27 - Inspect reference interaction before approximating it
**Error**: BUFF IT header/dropdown was described as Oura-like while its behavior was still an anchored dropdown, with desktop open-state color bugs and a broken mobile nav layout.
**Root cause**: Implemented from memory and static screenshots instead of first recording the reference interaction states: desktop top, desktop hover, scrolled open state, mobile top, and mobile menu.
**Rule**: For reference-driven UI, capture the reference behavior with browser screenshots/geometry before editing. Verify the local implementation against the same states, not only DOM/HTTP checks.
**Applies to**: Codex / codex-design-workflow / codex-domain-design-review
**Category**: testing
### 2026-05-27 - Mega-menu grid rows must fit the densest menu
**Error**: The Oura-like BUFF IT top dropdown looked close visually but clipped lower menu items when a group had 5-6 real links.
**Root cause**: CSS grid auto rows were driven by two tall feature cards, then additional right-column items created extra rows beyond the fixed panel height.
**Rule**: For shared mega-menu/dropdown systems, test the densest menu group first. Set feature-card spans, compact row tokens, and panel height from measured content geometry, not from the prettiest single menu screenshot.
**Applies to**: Codex / codex-design-workflow / codex-domain-design-review
**Category**: testing

### 2026-05-27 - Navigation hierarchy needs one primary lead
**Error**: The BUFF IT dropdown fit the content but made the first two menu items equally dominant, so the user could not read a clear section hierarchy.
**Root cause**: The CSS used `nth-child(-n + 2)` as a layout convenience instead of mapping visual weight to information architecture.
**Rule**: In navigation dropdowns, dominance must follow IA: one section lead/overview, then peer secondary routes. Do not promote multiple items just to fill a grid.
**Applies to**: Codex / codex-design-workflow / codex-domain-design-review
**Category**: workflow

### 2026-05-27 - CSS length tokens need unit-safe JS parsing
**Error**: The BUFF IT scrolled header became rounded almost at the end of the hero instead of at the intended offset.
**Root cause**: `Number.parseFloat("7.5rem")` returned `7.5`, so JS treated a relative CSS token as 7.5px instead of converting rem to pixels.
**Rule**: When JS reads CSS design tokens, parse units explicitly or measure the computed length. Never assume `parseFloat` preserves CSS units.
**Applies to**: Codex / codex-design-workflow
**Category**: bug

### 2026-05-27 - PowerShell Node stdin can corrupt Cyrillic writes
**Error**: A mass HTML nav rewrite temporarily produced `????` where Russian text should have been.
**Root cause**: Cyrillic content was passed through a PowerShell here-string into Node stdin with an unsafe encoding path.
**Rule**: For Cyrillic file writes on Windows, write with explicit UTF-8 without BOM from .NET or another verified UTF-8 path, then check for `????` and BOM before declaring the edit safe.
**Applies to**: Codex / codex-feature-workflow
**Category**: testing
### 2026-05-28 - Scrolled dropdown inherited header backdrop context
**Error**: BUFF IT dropdown opened from the scrolled header capsule instead of the viewport top, shifted back to the capsule while closing, and inner dropdown chips jumped upward on hover.
**Root cause**: A legacy `body.is-nav-solid .nav__inner` backdrop-filter remained active while the menu was open, creating a containing block for fixed dropdown children. Quicklink hover still used `translateY` from an older motion pattern.
**Rule**: For Oura-like page-level dropdowns, verify top, scrolled open, and scrolled closing states separately. In open and closing states, remove backdrop/filter/transform from header ancestors so fixed panels bind to viewport. Premium menu hover should change light, border, color, or shadow only; avoid Y movement inside dense navigation.
**Applies to**: Codex / codex-design-workflow / codex-domain-design-review
**Category**: bug
### 2026-05-28 - Token system cannot compensate for multiple component owners
**Error**: BUFF IT header/dropdown fixes kept accumulating overrides instead of becoming predictable token changes.
**Root cause**: Legacy `nav.css`, `nav-menu.css`, `nav-system.css`, plus nav rules in shared page CSS were still loaded or discoverable, so the final header files had to fight old component contracts.
**Rule**: For design-system fixes, first establish one owner per component and remove/deprecate competing CSS files. Only then promote values into semantic tokens and validate states. A token is not a system if multiple loaded layers interpret it differently.
**Applies to**: Codex / codex-design-workflow / codex-domain-design-review
**Category**: architecture
**Track**: PROCESS
**Severity**: P1

### 2026-05-30 - Tar deploy can make public data directories unreadable
**Track**: BUG
**Severity**: P1
**Error**: Public `https://yokhanfitness.ru/data/*.json` returned `index.html` with `text/html` even though the JSON files existed on the server.
**Root cause**: The tar deploy created `/var/www/yokhan-landing/data` as `700 root:root`; nginx could not traverse the directory, so `try_files $uri $uri/ /index.html` fell through to the SPA fallback.
**Rule**: After tar-based static deploys, normalize public web permissions: directories `755`, files `644`. Verify at least one file under every newly-created public directory through origin and public HTTPS.
**Applies to**: Codex / deploy / static-site
**Category**: bug

### 2026-05-30 - Public deploy must include CSS-referenced critical assets
**Track**: BUG
**Severity**: P1
**Error**: The public home page requested `assets/buffit-hero-home-training.png` from CSS and got 404, even though local static checks passed.
**Root cause**: Recent deploys uploaded HTML/data but not the existing `assets/` directory; local CSS `url(...)` checks only proved the file existed locally, not that it existed on the server.
**Rule**: Public smoke checks must include critical CSS-referenced assets, not only HTML and JSON. After deploying visual changes, verify browser network on a fresh context and check the hero/background assets return image content types.
**Applies to**: Codex / codex-design-workflow / static deploy
**Category**: bug

### 2026-06-10 - Static docs aliases can hide broken routes behind 200 OK
**Track**: BUG
**Severity**: P1
**Error**: `guide.yokhanfitness.ru` opened visually, but header auth links resolved to `guide.yokhanfitness.ru/hub/login`; nginx fallback returned the guide page with `200`, creating a fake login dead end.
**Root cause**: Public HTML used origin-relative `/hub/*` links while the guide alias serves the same static files from a different host. The guide nginx block also fell back every unknown path to `guide.html`.
**Rule**: For documentation/alias domains, verify in a real browser: rendered page, CTA `href` targets, direct old paths, mobile typography, and nginx fallback behavior. Hub/account links from public pages must use the canonical `https://yokhanfitness.ru/hub/*` origin or an explicit server redirect.
**Applies to**: Codex / codex-design-workflow / static deploy / nginx
**Category**: bug

### 2026-06-10 - Fallback docs need asset-path regression checks
**Track**: BUG
**Severity**: P1
**Error**: `guide.yokhanfitness.ru/Tools/everyday-activity/` rendered as raw browser HTML with all nav dropdown content expanded and no BUFF IT styling.
**Root cause**: The guide nginx fallback served `guide.html` for nested documentation paths, but the document used relative `css/...`, `js/...`, and `fonts/...` paths. On `/Tools/everyday-activity/`, the browser requested `/Tools/everyday-activity/css/...`, and nginx returned HTML instead of assets.
**Rule**: For any static page served through fallback or alias routes, verify a nested production URL in a fresh browser and smoke-check nested asset URLs by content type. Use `<base href="/">`, absolute asset paths, or nginx asset rewrites; never accept `200 text/html` for CSS/JS/font requests.
**Applies to**: Codex / codex-design-workflow / static deploy / nginx
**Category**: bug

### 2026-06-10 - Guide subdomain is Docusaurus, not landing fallback
**Track**: BUG
**Severity**: P1
**Error**: Tried to make `guide.yokhanfitness.ru/Tools/everyday-activity/` work by serving `YokhanFitnessLanding/guide.html`, which replaced the real Docusaurus documentation route.
**Root cause**: Confused the product landing GUIDE page with the documentation product. `guide.yokhanfitness.ru` is backed by `yokhanFitnessDocsWebsite` Docusaurus with `routeBasePath: '/'`; `yokhanfitness.ru/guide.html` is the BUFF IT landing guide page.
**Rule**: Before changing a subdomain root or nginx fallback, locate the owning repo/build artifact. Docusaurus docs domains must serve their `build/` root with `/index.html` fallback; product landing pages must stay on the main site or explicit product routes.
**Applies to**: Codex / static deploy / nginx / Docusaurus
**Category**: bug

### 2026-06-10 - Restoring docs root is not enough without ingress links
**Track**: BUG
**Severity**: P1
**Error**: After restoring `guide.yokhanfitness.ru` to Docusaurus, the main BUFF IT site still linked every GUIDE entry to local `guide.html`, so users could not reach the real docs from the site.
**Root cause**: Fixed the serving layer but did not audit inbound links from the product site. The user's path starts on `yokhanfitness.ru`, not by typing a docs URL manually.
**Rule**: For cross-site docs fixes, verify both sides: target docs routes and all public ingress links from the product site. Smoke checks must fail on local `href="guide.html"` when the intended destination is Docusaurus.
**Applies to**: Codex / static deploy / Docusaurus / UX links
**Category**: bug

# 2026-07-20 — Remote shell substitutions must not cross the PowerShell boundary

- Track: PROCESS
- Severity: P2
- Failure: a deploy preflight embedded a remote `$(sha256sum ...)` expression inside a PowerShell double-quoted string, so PowerShell tried to execute `sha256sum` locally before SSH connected.
- Guard: for remote hash validation from PowerShell, use `echo '<sha>  <path>' | sha256sum -c --status` or a single-quoted remote script. Never place remote `$()` inside a PowerShell double-quoted command.

# 2026-07-22 — Lifestyle media must preserve the user's real-life tension

- Track: PATTERN
- Severity: P1
- Failure: image iterations drifted from an ordinary after-work home workout into office lifestyle and polished fitness-ad imagery, creating a false "successful success" promise.
- Root cause: the generation brief described attractive styling more strongly than the product tension: training must fit a tired adult's real apartment and schedule.
- Guard: every BUFF IT lifestyle brief must state the lived situation, ordinary clothing, imperfect household context, and explicit anti-goals before aesthetic direction. Reject office-dominant, private-gym, showroom, matching-activewear, and camera-pose results before integration.
- Applies to: Codex / image generation / landing media / responsive art direction

# 2026-07-22 — A shared image prompt can erase information architecture

- Track: PATTERN
- Severity: P1
- Failure: six semantic media roles looked like consecutive frames from one beige apartment shoot and several movement poses had ambiguous equipment or joint geometry.
- Root cause: the batch-level prompt owned apartment, daylight, framing and palette, while each product role supplied only a weak subject suffix. Visual consistency overrode navigation and technical legibility.
- Guard: every lead/navigation role must declare location, light, camera, action, subject and accent; adjacent roles differ in at least four dimensions. Movement prompts include observable technique checkpoints, and automated metadata/file checks never substitute for full-resolution biomechanical review.
- Applies to: Codex / image generation / landing navigation / responsive art direction

# 2026-07-22 — A media category is not an art-direction contract

- Track: PATTERN
- Severity: P1
- Failure: broad roles such as “fitness” or “health” allowed one attractive image to spread across unrelated routes and reduced navigation to first-order associations.
- Root cause: the contract owned a category but not the exact route, slot, scene, responsive composition, identity owner or reuse limit.
- Guard: every important placement declares `route + slot + sceneId + responsivePair + reuseLimit`; code-native metaphor is preferred when a photograph would merely repeat the section label.
- Applies to: Codex / landing media / Storybook / design-system contracts

# 2026-07-22 — Generated exercise technique needs a human acceptance gate

- Track: BUG
- Severity: P1
- Failure: a visually plausible training frame showed an unacceptable lumbar position.
- Root cause: file, dimension and semantic checks were treated as enough evidence for biomechanics.
- Guard: movement imagery cannot ship without full-resolution review against explicit visible checkpoints. If anatomy remains uncertain, replace the movement with a safe coaching, calibration or preparation scene rather than trying to hide the defect with crop or overlay.
- Applies to: Codex / image generation / coaching media / release review
