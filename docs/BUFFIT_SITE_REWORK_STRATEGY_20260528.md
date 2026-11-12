# BUFF IT Site Rework Strategy — 2026-05-28

## User Outcome

Сайт должен не просто красиво показывать BUFF IT, а вести человека от первого знакомства к правильному следующему шагу: платное 12-недельное ведение, диагностика, личный контакт, гайд/канал или маршрут безопасности.

## Current Diagnosis

1. Главная уже задает премиальный warm wellness вайб, но часть вторичных страниц пока выглядит как короткие заглушки.
2. Сервисы уже есть, но местами вставлены одинаковым списком, а не как логичные инструменты в пути клиента.
3. Программы заведены системно, но detail-страницы были слишком шаблонными: одинаковые пояснения к outcomes и слабая связка с APP/CALLS/FOOD/GUIDE/HEALTH.
4. Дубли ролей остаются: `app.html` / `self-training.html`, `health.html` / `safety.html`, частично `about.html` / `method.html`. Их надо развести по JTBD, а не удалять вслепую.
5. Дизайн-система после header cleanup стала стабильнее; новый контент надо добавлять через существующие компоненты и токены, без локального визуального хардкода.

## Funnel Architecture

| Stage | What person feels | Page/surface | Tool | Desired next action |
|---|---|---|---|---|
| First touch | “Что это и зачем мне?” | content, referrals, `index.html` | site | choose goal or start |
| Recognition | “Это про мою ситуацию” | `men.html`, `women.html`, program pages | program catalog | open route detail |
| Trust | “Понятно, как это будет работать” | `programs.html`, `training.html`, `method.html` | кейсы/method/services | diagnostics or direct message |
| Qualification | “Мне подобрали первый шаг” | Telegram bot | `@YokhanGym_bot` | route result + consult |
| Human close | “Мне спокойно начать с человеком” | Telegram personal / calls | `@yokhan_yokhan`, CALLS | buy 2+DZ or 3/week |
| Delivery | “Меня ведут, а не бросили с PDF” | APP, Personal, chat, FOOD, GUIDE, HEALTH | support tools | complete weeks and collect cases |
| Not ready | “Я присмотрюсь без давления” | GUIDE, channel, links | `@igor_it_fit`, guide | warm follow-up |
| Unsafe | “Тренировка не первый шаг” | HEALTH, safety | red-flag route | doctor/safety-first path |

## Tool Integration Rules

- Bot is not the beginning of the funnel. The site must create enough recognition before the bot.
- APP is not the main paid product yet. It supports coach-led clients now; later it becomes the budget subscription lane.
- CALLS is a trust and correction tool, not a standalone tech product in client copy.
- FOOD/smartcart belongs where food blocks progress: weight loss, glutes, new image, maintenance.
- GUIDE is the not-ready and beginner path; it should reduce fear before sale.
- HEALTH is a safety boundary and authority layer. It should not overpromise treatment.
- Personal Telegram is for warm/high-intent leads and context-heavy cases.

## Page Jobs

| Page | Job | Priority work |
|---|---|---|
| `index.html` | ecosystem router and premium first impression | add FOOD/GUIDE/HEALTH more explicitly in the daily system layer |
| `start.html` | decision bridge before bot/direct contact | clarify where each entry leads after the click |
| `programs.html` | main catalog and commercial explanation | show tools as part of the 12-week route, not side services |
| `program-*.html` | goal-specific sales page | make outcomes specific and connect each route to supporting tools |
| `ecosystem.html` | map of product families | explain current status and how services connect during delivery |
| `training.html` | paid coaching overview | keep goal-first, reduce self-training distraction |
| `app.html` | support app now / self-training later | separate current client support from future subscription |
| `self-training.html` | current low-ticket lane | one-time 5–8k consultation: goal, science-based program, one correction after a week |
| `health.html` | safety authority hub | clarify red flags and safe start |
| `safety.html` | first aid / home kit material | make it narrower than health hub |
| `guide.html` | beginner/non-ready trust path | add concrete guide contents and route back to diagnostics |
| `calls-access.html` | call as route clarity | show when a call is better than bot/direct text |
| `links.html` | all exits | include FOOD/CALLS/HEALTH/APP statuses and correct targets |

## New Tool Ideas To Consider

1. Source/start-param dashboard: page -> CTA -> bot start -> diagnostic completion -> consult -> paid client.
2. Diagnostic result page: after bot, a shareable route summary with price, risks, tools, next step.
3. Proof vault: structured cases, screenshots, training logs, measurements and testimonials.
4. Lead follow-up CRM in Telegram: readiness, objection, next contact date, content sent.
5. Red-flag/readiness screener: separates sales-ready, guide-ready and health-first leads.
6. Weekly readiness check-in: sleep/stress/pain/walks/training completion feeding APP/DAYFLOW.
7. Smartcart route presets: product basket by goal and budget, linked from FOOD and program pages.

## P0 Implementation Batch

This batch does not touch the header. It updates `data/tool-map.json`, `start.html`, `ecosystem.html`, `programs.html`, and all `program-*.html` pages.

## P1 Implementation Batch

This batch keeps the header untouched and fixes route clarity:

- `app.html` is now the current support workspace inside coach-led delivery.
- `self-training.html` is now the current low-ticket lane: one-time 5–8k consultation, science-based program, and one correction after a week.
- `health.html` is the safety authority hub and red-flag boundary.
- `safety.html` is the narrower first-aid and home-kit material.
- `about.html` is trust in the person/contact/boundaries.
- `method.html` is the route-building logic and 12-week method.
- `guide.html`, `calls-access.html`, `links.html`, and `bot.html` now explain their next-step jobs.
- `data/cta-map.json` and `docs/CTA_SOURCE_PARAM_MAP_20260528.md` define page -> CTA -> start-param -> post-bot route.
## Remaining Inputs Needed From Igor

- Real screenshots/photos for APP, bot, calls, smartcart and guide.
- Exact bot result messages per route.
- Case material: before state, constraint, route, timeline, result, permission level.
- Future recorded self-training subscription remains later; current public budget offer is the one-time consultation.