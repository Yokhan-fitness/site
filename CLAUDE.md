# YokhanFitnessLanding — Landing Page
<!-- Template Version: 6.1.2 -->

## Routing, SOT and systemic safeguards

Use progressive JPEG delivery: show the first useful view, the next evidence
layer, remaining gaps and the signal that requires replanning. This does not
reinstate a universal 1% slice or speculative future skeleton.

Routing uses semantic intent scoring, not keywords alone. Run the local task
router before substantial edits; preserve the accepted parent plan and owners.

SOT conflict protocol: name both conflicting sources and the exact disagreement.
User instructions and project-owned plans outrank shared defaults; do not silently
choose between equally authoritative owners. Ask only for a material decision and
record it in the existing active plan. .claude/agents/PROTOCOL.md is subordinate to this project contract: load only task-relevant context, not all history or fixed rituals; persistent machine memory saves require explicit user authorization; never delete work or restart from scratch automatically—preserve dirty work and archive only within authorized scope. Parent owns broad integration checks.

Thinking tools: map outcome, owner, contracts and feedback; phrase contradictions
as needs without harmful side effects; compare a bounded alternative and name
observed evidence. Avoid ornamental analysis.

Systemic Error Analysis: classify an isolated typo versus a broken module or
ownership boundary; reproduce and identify the causal link before patching. A
second failed repair requires re-diagnosis and the Change Strategy Gate in
`.claude/library/process/change-strategy-gate.md`. Protect verified contracts,
compare destination and transition separately, and record rollback and the
regression guard. Never turn a validator pass into product-delivery evidence.

## Production Product Standard — v6.1.1 operating contract

Preserve the final product quality bar and prioritize app-specific business outcomes first:
a clear, trustworthy acquisition path and reliable customer access. Reports use the
language of the user's request. Do not claim product delivery from infrastructure,
tests or status alone.

Waves are successive usable versions of the same product toward the agreed
final outcome, not technical bundles or internal routes. Research, migrations
and refactors are enabling checkpoints. Reassess the final target and remaining
waves together when constraints change.

For substantial staged work, agree the end result and approximate useful waves;
the parent derives the detailed nearest-wave plan, owners and acceptance evidence.
Inspect and verify child results before integration. Work autonomously inside
accepted scope; ask for material changes to outcome, data, safety, public contracts,
release or irreversible state. Do not require a per-task 1% ritual or speculative
whole-future skeleton. Preserve accepted project plans and AgentOS
Strategy/Tactic/Plan/Todo/Gate ownership.

Load relevant shared rules:
- `.claude/library/product/production-product-standard.md`
- `.claude/library/process/product-goal-loop.md`
- `.claude/library/process/client-executor-contract.md`

Substantive nonfiction, including explanations, uses fresh relevant primary
passages from the external six-source library and concrete current task/draft
application; see `.claude/library/technical/writing-source-grounding.md`.
Actual fiction/lore prose is exempt, not business or technical documents.
Missing sources block grounded writing, not code-only work. No book copies,
symlinks or hardlinks belong in this project.

Sol 6.1 high, bounded Luna 6 high and Astra consultation are role recommendations,
not effective runtime evidence. Correlate actual child results or report
`unverified`; user-wide model/effort/approval/sandbox defaults stay untouched.

Before agent infrastructure changes, read `docs/AGENT_CONTEXT_SOT.md` and
`_reference/agent-sot/sources.json`. Preserve project-owned `project-*` overlays,
dirty work, secrets and active tasks. This repository consumes
`agent-project-template`; use the exact release updater, an external digest-bound
plan, explicit conflict review and rollback. Never self-sync the source.

## Status
**IN PROGRESS** — Landing page built. Deploy target: VPS 82.97.243.54.

Product SOT: `PROJECT_SPEC.md` and the accepted current product plan in
`tasks/current.md` / `tasks/goal.md` govern routes, offer, pricing and visual
direction. Historical details are not permission to restore superseded design
or deploy paths. Preserve the paid `/coach/` -> `/coaching.html` funnel.

## Verification and public copy

Follow `.claude/library/process/self-verification.md`: focused checks after
coherent batches; parent-owned broad integration, no duplicate worker runs.
Repeat broad checks only for stated concrete invalidation; reuse baseline plus
delta honestly. Mandatory product, security, CI and release gates remain binding.
Public Copy Gate: `.claude/library/technical/writing.md#public-copy-gate`.
Use grounded facts and available actions; no invented functionality, proof,
guarantees or dates. Keep production notes/TODOs/debug in the owner handoff;
material warnings and limitations stay truthful and useful.

## Philosophy — Quality Over Speed
1. **Think before you type.** Research and planning ARE the work. Code is just output.
2. **Doubt is a feature.** Surface uncertainty. Enumerate alternatives before choosing.
3. **Slower is faster.** 30-min plan saves 3h rework. Test scenarios prevent production bugs.
4. **One thing done well > three halfway.** Finish a coherent step and verify proportionately. Commit only when authorized by the active workflow.
5. Resolve routine uncertainty through safe investigation; ask only when a missing choice materially changes outcome, scope, data, safety, release or irreversible state.

Slow down: shared/core, can't articulate WHY, 3+ iterations, HIGH/CRITICAL risk.
Speed OK: XS+LOW, covered by tests, following approved plan.

## Stack
- **Language:** HTML + CSS (static, no framework)
- **Design:** Current BUFF IT DS tokens and accepted light ceramic composition; see the product goal and component contracts.
- **Fonts:** Unbounded (headings) + Golos Text (body)
- **Deploy:** Static files on Timeweb VPS

## Map
- `index.html` — ecosystem entry in the static multipage site; page inventory lives in `PROJECT_SPEC.md`
- `css/` — styles, design tokens
- `fonts/` — Unbounded + Golos Text woff2
- `images/` — noise texture, backgrounds
- `tasks/` — session handoff + lessons
- `scripts/` — automation, routing, verification, research helpers

## How This Template Works

**Rules are NOT pre-loaded.** They live in `.claude/library/` and load ON DEMAND per task.

Use context routing when project ownership or specialized rules can change the
result. Load relevant rules and accepted task artifacts; direct answers and
small low-risk edits do not require a full routing ritual.

**On task switch**: `switch_context(keywords="...")`
**After compaction**: `get_active_rules()`
**Fallback (no MCP)**: `bash scripts/route-task.sh "<keywords>"` + Read listed files
**Manual**: `/mode-code` `/mode-design` `/mode-review` `/mode-research` `/mode-write` `/mode-fix` `/mode-plan`

## Session Start
1. `bash scripts/context-restore.sh` — shows mode, task, lessons, git state
2. If Engram: `mem_session_start` + `mem_context`
3. `get_context(keywords="<first task>")` → ready to work

## Session End
Update `tasks/current.md` with handoff (status, files, next steps, blockers).
If Engram: `mem_session_end` with summary.

## MCP Memory (Engram)
- Use relevant project memory and save durable decisions when the workflow benefits.
- On task switch → `mem_save` summary of paused task
- If no Engram → tasks/lessons.md + brain/ (file fallback)

## Runtime Helpers (use instead of manual tool calls)
```
bash scripts/route-task.sh <task>      — route to relevant rules (no guaranteed token-saving claim)
bash scripts/research.sh <path>        — auto research (replaces 6 tool calls)
bash scripts/plan-scaffold.sh <task>   — auto plan template in tasks/current.md
bash scripts/verify-check.sh --size M  — auto verification checklist
bash scripts/context-restore.sh        — context recovery after compaction
bash scripts/measure-context.sh        — token budget meter (chars/token heuristic)
bash scripts/blast-radius.sh <file>    — BFS impact analysis: all affected files
bash scripts/import-graph.sh [dir]     — hot files: most-imported modules
bash scripts/scan-repo.sh <path>       — security scan before opening untrusted repos
```

## Security & Integrations
Hooks in `.claude/` are configured for prompt-injection scanning, sensitive-path blocking, dangerous-command checks and session auditing. Static configuration or passing hook tests do not prove host trust or live lifecycle activation; verify those separately and report them as unverified without direct evidence.
Run disposable tests and builds through `node scripts/managed-temp.js run -- <executable> <args>`.
Optional: **CodeSight** codebase index — see `integrations/codesight.md`, enable in `.mcp.json`.

## Design Work — HARD RULES (Figma, CSS, UI)
1. **NEVER hardcode visual values.** Use tokens/variables. Create tokens FIRST if missing.
2. **NEVER build from raw shapes.** Use components. Create components FIRST if missing.
3. **Build order: System→Tokens→Components→Screens.** NEVER skip to screens.
4. **Every container must have layout mode** (auto-layout / flexbox / grid).
5. **8 states**: Default, Hover, Active, Focus, Disabled, Loading, Error, Empty.
6. **Before creating**: search_design_system — does it already exist?
Correct only your own scoped changes and preserve unrelated work. Full pipeline: `.claude/library/domain/domain-design-pipeline.md`

## Commands (23)
/setup-project, /implement, /commit-push-pr, /review, /refactor, /sprint, /brain-sync, /weekly,
/status, /rollback, /onboard, /update-template, /hotfix, /retrospective, /sync-all,
/audit-tools, /mode-code, /mode-design, /mode-review, /mode-research, /mode-write, /mode-fix, /mode-plan

## Self-Improvement
After each correction: classify type (BUG/KNOWLEDGE_GAP/STYLE/DESIGN_DISAGREEMENT/MISUNDERSTANDING).
BUG or KNOWLEDGE_GAP → log to tasks/lessons.md with Track (BUG/KNOWLEDGE/PATTERN/PROCESS) + Severity (P0-P3).
When >50 entries → promote via `/weekly`.

## Token Economy
- Trust skills/memory over re-reading. Don't re-read files you read this session.
- Only read files you WILL use. Parallelize independent tool calls.
- Delegate only independent work with exact acceptance and non-overlapping ownership.
- After two failed approaches, re-diagnose the boundary before another patch.
- Leave a concise handoff when interrupted; routine switching does not require a new session.

## DON'T
- Use file-size heuristics to identify responsibility problems, not to mechanically split code.
- No `any` — use `unknown` + type guards
- Prefer clear, contained data flow; follow established stack conventions.
- No editing main/master directly
- No skipping tests before commit
- No committing secrets (.env, API keys)
- No presenting solutions without self-verification
- No "you're right!" without logging WHY
- No new code without checking tool-registry first
- No hardcoded visual values (use tokens)
- No building screens without components (system→tokens→components→screens)
- No surface-level analysis ("works"=HTTP 200 is NOT analysis)

## Build & Deploy
```bash
# Local preview
python -m http.server 8080

# Deploy to VPS
scp -r . user@82.97.243.54:/var/www/yokhanfitness/
```

## Project Rules
- Keep component and file responsibilities bounded; numerical size is a diagnostic heuristic.
- Russian language, "ты" form
- NO AI-sounding text
- Mobile-first responsive
- Visual direction and theme follow the accepted product plan and shared DS, not historical page-local defaults.
- CTA links to: t.me/YokhanGym_bot
- Guide link: guide.yokhanfitness.ru

## Design Tokens
Use current shared DS and `css/tokens.css`; verify component ownership and
consumer parity before adoption. Do not copy historical raw values from this
instruction file into product CSS.

## Template Version
6.1.1 — Run `bash scripts/check-drift.sh` to verify health.

## Compaction
After compaction: `bash scripts/context-restore.sh` to recover mode + task + rules.
