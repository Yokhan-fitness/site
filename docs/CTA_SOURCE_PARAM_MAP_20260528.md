# BUFF IT CTA / Source-Param Map — 2026-05-28

## Зачем

Карта фиксирует, куда ведет каждый значимый CTA сайта: страница, намерение человека, Telegram `start`-параметр, стадия воронки и ожидаемый следующий шаг после бота. Это нужно, чтобы не спорить “куда вести”, а видеть цепочку `страница -> CTA -> бот -> результат -> консультация/гайд/HEALTH`.

## Правила

- Every external bot CTA must use a unique startParam when the page intent differs.
- Program pages use program-catalog start params as the canonical source.
- Personal Telegram links are for warm/context-heavy leads; they do not replace bot diagnostics.
- Guide/channel links are not failure paths; they keep not-ready users inside the warm orbit.
- Health and safety routes must avoid sales pressure when red flags are present.

## Основные CTA

| ID | Page | Label | Start param | Stage | Intent |
|---|---|---|---|---|---|
| home-start | `index.html` | Начать | site/direct | first-choice | choose entry point |
| start-diagnostics | `start.html` | Пройти диагностику | `buffit_start` | qualification | choose route with bot |
| program-picker | `programs.html` | Пройти диагностику | `buffit_program_picker` | qualification | pick 12-week goal route |
| bot-entry | `bot.html` | Открыть бота | `buffit_bot` | qualification | answer diagnostic questions |
| personal-direct | `links.html` | Личная переписка | site/direct | human-close | ask direct question or book consult |
| channel-nurture | `links.html` | Канал | site/direct | nurture | stay in warm orbit |
| app-support | `app.html` | Подобрать маршрут | site/direct | trust | understand app support inside coaching |
| self-consult | `self-training.html` | Запросить разовый разбор | `buffit_self_waitlist` | low-ticket-entry | request one-time science-based training consultation |
| health-check | `health.html` | Проверить старт | `buffit_health_check` | safety | screen safe training entry |
| safety-guide | `safety.html` | Получить материал | `buffit_safety_guide` | safety-material | get first-aid/home-kit material |
| beginner-guide | `guide.html` | Получить гайд | `buffit_guide` | nurture | get beginner guide |
| calls-request | `calls-access.html` | Запросить разбор | `buffit_calls` | human-close | request route/call review |
| method-diagnostics | `method.html` | Пройти диагностику | `buffit_method` | qualification | convert method trust into route |
| links-diagnostics | `links.html` | Открыть диагностику | `buffit_links` | qualification | use links page as quick entry |

## Program CTA Source Params

| Program page | Start param | Segment |
|---|---|---|
| `program-new-image.html` | `buffit_new_image` | универсальный маршрут |
| `program-weight-loss.html` | `buffit_weight_loss` | вес и устойчивость |
| `program-glutes.html` | `buffit_glutes` | женский визуальный оффер |
| `program-athlete-body.html` | `buffit_athlete_body` | мужской визуальный оффер |
| `program-entry-fitness.html` | `buffit_entry` | старт без стыда |
| `program-healthy-back.html` | `buffit_back` | сидячая работа |
| `program-pull-ups.html` | `buffit_pullups` | навык силы |
| `program-flexible-body.html` | `buffit_flexible` | легкость и мобильность |
| `program-maintain-shape.html` | `buffit_maintain` | удержание результата |
| `program-power-exit.html` | `buffit_power_exit` | продвинутый навык |
| `program-front-hang.html` | `buffit_front_hang` | контроль тела |

## Post-Bot Routing

| Result | User state | Next | Page | Message direction |
|---|---|---|---|---|
| hot-fit | goal is urgent, budget and format are acceptable, no red flags | personal Telegram or consultation | `start.html` | Собрали маршрут. Дальше лучше коротко согласовать формат и стартовую неделю лично. |
| warm-fit | goal is real, but needs clarity or trust | program page + CALLS | `calls-access.html` | Похоже, маршрут подходит, но есть детали. Лучше разобрать цель и ограничения на коротком созвоне. |
| not-ready | interested but not ready to buy now | guide + channel | `guide.html` | Не надо покупать на эмоции. Возьми гайд, посмотри базу и вернись к диагностике, когда станет яснее. |
| diy-budget | wants structure, but not full coach-led support | one-time 5–8k consultation + guide fallback | `self-training.html` | Если хочется самому и дешевле, предложить разовую консультацию: цель, ограничения, научно обоснованная программа и одна коррекция через неделю по отзывам. |
| medical-red-flag | pain, injury, neurological symptoms, fever, or unsafe state | HEALTH/safety-first route | `health.html` | Тут не надо продавливаться в тренировку. Сначала безопасность и медицинская рамка, потом нагрузка. |
| food-barrier | training goal is blocked by nutrition chaos | nutrition + smartcart support | `nutrition.html` | Цель упирается не только в тренировки. Нужен простой пищевой ритм и корзина без отдельной войны. |

## Что еще нужно от продукта/бота

- Bot now has a general source-aware route picker; exact route-specific diagnostics/result messages still need implementation.
- Real proof assets and screenshots are still missing for APP, CALLS, FOOD, GUIDE, HEALTH and client cases.
- Self-training subscription remains a later product; current budget lane can show the one-time 5–8k consultation.

## Текущий вывод

Главная продажа сейчас — 12-недельное онлайн-ведение. Для тех, кто хочет сам и дешевле, есть отдельный низкий вход: разовая консультация 5–8к с программой и одной коррекцией через неделю. APP, CALLS, FOOD, GUIDE и HEALTH объясняются как инструменты вокруг маршрута: они снижают риск, экономят время, помогают питанию, удерживают not-ready аудиторию и повышают доверие к старту.
## Bot Implementation Status

- `YokhanGymBot` now preserves `/start buffit_*` source params through quiz FSM clearing.
- `/start` non-invite traffic now receives a general BUFF IT source-aware route picker instead of the old spine-only welcome screen.
- `handlers/buffit_route_picker.py` maps program/service sources into goal-first choices: form/image, weight, health/back, skill, beginner, self-training one-time consultation, guide, calls, and coach-led online training.
- Leads are stored in `quiz_leads.source` when the user continues into the spine diagnostic.
- `quiz_started` and `quiz_completed` analytics include `data.source`; route picker events include `source` too.
- Trainer notification includes `Источник: <source>`.
- Current product gap: route-specific post-picker diagnostics/results are still shallow; next iteration should classify `hot-fit`, `warm-fit`, `not-ready`, `diy-budget`, `medical-red-flag`, and `food-barrier`.

## Outcome Page Sections

- `start.html` and `bot.html` show the full six-outcome map after diagnostics.
- `programs.html[data-outcome="hot-fit"]` handles high-intent users who can move to start-week agreement.
- `calls-access.html[data-outcome="warm-fit"]` handles users who need clarity before choosing a format.
- `guide.html[data-outcome="not-ready"]` handles not-ready users without forcing a sale.
- `self-training.html[data-outcome="diy-budget"]` handles the one-time 5–8k consultation lane.
- `health.html[data-outcome="medical-red-flag"]` handles safety-first routing.
- `nutrition.html[data-outcome="food-barrier"]` handles food and smartcart support before or alongside training.
