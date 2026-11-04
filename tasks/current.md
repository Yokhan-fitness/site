# Current Task — Session Handoff

## Result — 2026-07-25 Mobile homepage and route media production release

- User wants: убедиться, что последняя серия правок закончена, проверить смысловое соответствие изображений и опубликовать результат для проверки с телефона.
- Success means: главная на 390 px использует отдельный mobile hero и отдельную вертикальную карту маршрута; все активные локальные media dependencies доступны публично; общий header не ломается на промежуточных ширинах; production отдаёт ровно проверенную локальную версию.
- Verification: `BuffItDesignSystem` — static validation 34/34, Storybook build, downstream adoption, review index/closeout и landing composition 158/430; `YokhanFitnessLanding` — home layout 12 cases / 6 viewport, coaching layout 7 viewport, page grid, media role, audience media, local/public dependency closure 46 assets, public BUFF IT smoke и production screenshot 390 px.
- Systemic fix: `contracts/design-system-consumer.json` перепривязан к трём проверенным текущим DS-источникам; shallow `check:downstreams` не подменял consumer-owned hash gate.
- Release: на production атомарно опубликован homepage dependency closure из 13 файлов: `index.html`, семь отличавшихся общих CSS, `js/nav-menu.js` и четыре responsive route assets. Backup: `/var/backups/yokhan-landing/home-mobile-route-20260725T155640Z`.
- Production proof: публичный SHA-256 `index.html` совпадает с локальным `52af278417689ff3d955cf85bd33b6ead8511a1c6e385f6ee111ec58d79ea5e5`; mobile route AVIF — `ad87c2df9fc8e227f476118df6cafaaf76d2a2f6df658bc9891965e2a7cc1ebb`; `nginx -t` и внешний HTTPS smoke прошли.
- Truth boundary: production опубликован для публичного лендинга. Storybook остаётся локальным инструментом; его static build и review attachments на публичный сервер не выгружались.

## Completed — 2026-07-22 Landing media, Storybook parity, and grid contract

- User wants: привлекательные, живые и коммерчески убедительные персонажи без stock/influencer театра; все реальные семейства компонентов лендинга доступны в Storybook; ширина страницы следует одной явной сеточной системе и не прыгает между блоками.
- Success means: реализм остаётся в ситуациях и ограничениях аудитории, а не в усталом или неухоженном кастинге; каждый повторяемый landing pattern имеет канонический DS-компонент, управляемую story и consumer mapping; desktop использует `wide-frame -> 12-column content-grid -> readable-span`, mobile — один стабильный gutter без случайных боковых рамок.
- I will verify by: машинная сверка landing selectors с component manifest, Storybook fast/build/coverage checks, rendered geometry на главной, women, coaching и guide при mobile/tablet/desktop, визуальные снимки и проверка responsive media source/crop.
- Strategy: `bounded-replace + staged-swap`. Сначала расширить DS/consumer contracts и добавить regression guards, затем заменить активные semantic media assets и подключить их через те же роли. Не добавлять React runtime в статический сайт и не создавать параллельную Storybook-разметку, не связанную с landing selectors.
- Protected: публичные URL, CTA/start params, `/coach/ -> /coaching.html -> buffit_coaching`, цены, ceramic material axis, существующие APP/Hub/Auth/CALLS контракты. Deployment не входит в этот шаг.
- Replan trigger: если реальный landing pattern нельзя выразить существующими DS primitives без изменения публичной семантики/CTA, остановить перенос конкретного pattern и зафиксировать новый component contract вместо локального CSS workaround.
- Result: six audience media roles now use distinct attractive, healthy casting and scenario-specific v3 art direction; Storybook owns the canonical landing families and selector manifest; rendered grid, responsive media, home layout, 30 static DS gates and Storybook build pass. Local preview only, no deployment.

## Change Strategy — coaching media hero — 2026-07-22

- Acceptance `CS-COACH-HERO-BG-01`: на 390, 668 и 1440 px фотография является фоновым media-слоем секции, а текст и квалификация пересекают её как overlay-контент; последовательный режим `image -> copy` отсутствует.
- Trigger: две локальные правки сохраняли неверный тип компонента `split media + content` и поэтому не устраняли замечание пользователя.
- Posture: evolving public landing. Protected: `/coach/ -> /coaching.html -> buffit_coaching`, цены 26 000/34 000 ₽, текст квалификации, responsive AVIF/WebP и alt.
- Decision: `bounded-replace + direct-swap` внутри `.trainer-proof-section`; публичный маршрут, контент и CTA не меняются. Альтернатива `repair split layout` отклонена как повторение неверной архитектуры.
- Recovery: откат трёх локальных файлов. Regression guard: rendered geometry требует `position:absolute`, edge-to-edge media и overlap media/copy на всех трёх viewport.
- Correction: исходное замечание относилось прежде всего к главному `.hero__stage`. Его mobile media query переводил `::before` в normal flow и создавал вторую grid-строку. Контракт расширен: pseudo-media главного hero остаётся absolute, overlay остаётся видимым, а `.hero__inner` совпадает с границами stage на 390/668/1440 px.

### Grounded media checkpoint

- Прежние office/premium-gym варианты отклонены и не подключены. Активная пара hero показывает обычную тренировку после работы в жилой квартире, в простой футболке и шортах; рабочее место остаётся второстепенным бытовым контекстом.
- Контракт `B01-06/B01-06D` теперь явно запрещает office-dominant композицию, private gym, showroom, matching activewear, позу в камеру и «успешный успех».
- Для 390 px кадр сдвинут так, чтобы лицо не обрезалось краем, при этом hero остаётся единым фоновым слоем с текстовым overlay.
- Общий header переходит в компактный режим до 1280 px включительно: на промежуточных ширинах меню больше не пересекает логотип и actions.
- Rendered regression guard расширен до 390, 668, 845, 1040, 1168, 1296 и 1440 px и проверяет не только media source/geometry, но и реальный nav mode и пересечение desktop-частей.
- Локальный `check-coaching-layout.mjs` прошёл 7 viewport. Общий `check-home-layout.mjs` заблокирован отдельным drift источника design-system runtime: manifest ожидает `3b78c6…`, фактический hash `79d705…`; этот контракт не подменялся ради зелёного теста.

## SEO checkpoint — direct homepage authority path — 2026-07-21

User wants: продолжать SEO сайта по запросам о персональном фитнес-тренере онлайн; Profi.ru остаётся вторичным каналом и не заменяет работу над сайтом.

Success means: зафиксированный запрос `фитнес тренер онлайн` приводит `/coaching.html` в топ-10 Google или Яндекса, затем даёт органический переход, консультацию и исход `paid`, `refused` или `waitlist`.

Current bounded step: передать коммерческой странице прямую тематическую ссылку с уже индексируемой главной, не создавая новую конкурирующую SEO-страницу и не меняя цену или путь заявки.

Result:

- Главная карточка BUFF IT FITNESS теперь ведёт прямо на `coaching.html?from=home` и называет услугу `Персональный фитнес-тренер онлайн`; промежуточный переход через общий обзор `training.html` убран только из этой карточки.
- `data/cta-map.json` фиксирует новый переход `home-coaching`; локальный и публичный SEO-контракт проверяют его как связь индексируемой главной с владельцем запроса.
- `lastmod` главной обновлён на `2026-07-21`; состав sitemap и `lastmod` `/coaching.html` не менялись.
- На production опубликованы только `index.html`, `data/cta-map.json` и `sitemap.xml`. Backup: `/var/backups/yokhan-landing/seo-home-link-20260721-215907`.
- Публичные SEO и BUFF IT smoke прошли. Рендер 390/1440 подтвердил видимую карточку, правильный `href` и отсутствие горизонтального переполнения. IndexNow принял 9 канонических URL с HTTP `202`.

Truth boundary: это усиливающий SEO checkpoint, а не достигнутый SEO-результат. Свежая позиция не снята: прямые интерфейсы Google и Яндекса показали CAPTCHA, а авторизованный Chrome потерял соединение при открытии Search Console. Следующий gate остаётся прежним: видимость `/coaching.html` по фиксированному запросу, затем показ → клик → консультация → коммерческий исход.

## Current proof and profile slice — 2026-07-21

User wants: усилить тот же SEO-маршрут `/coaching.html → консультация → paid/refused/waitlist` реальными доказательствами и привести существующий профиль Игоря Назарова на Profi.ru к тому же онлайн-офферу.

Success means: посетитель поисковой страницы сразу видит реального Игоря и проверяемую квалификацию, а профиль Profi.ru не обещает другой формат, другую цену или медицинский результат; длиннее и тяжелее страница не становится.

I will verify by: проверить происхождение фото и формулировок по оригиналам, сохранить цены 26 000/34 000 ₽ и один coaching CTA, проверить mobile/desktop layout и SEO-контракт, затем прочитать и сохранить фактические поля существующего профиля Profi.ru через авторизованный Chrome.

Current bounded step:

1. Заменить общий блок «Зачем тренер» на компактное знакомство с реальным фото и подтверждённой квалификацией.
2. Не публиковать фотографии дипломов с регистрационными номерами и не выдумывать стаж, кейсы, отзывы или медицинские компетенции.
3. Синхронизировать описание Profi.ru с онлайн-форматом и фиксированными ценами после восстановления управления Chrome.
4. Опубликовать сайт через точный manifest и backup; не считать это SEO-результатом до появления позиции, клика и консультации.

Progressive JPEG checkpoint: первый полезный вид — поисковый посетитель видит конкретного тренера и квалификацию вместо абстрактной теории; следующий слой — согласованный профиль Profi.ru; rough edge — пока нет разрешённых клиентских кейсов и записанного видео; replan trigger — профиль Profi.ru содержит активные услуги или цены, которые нельзя безопасно привести к онлайн-офферу без изменения коммерческого контракта.

Current result:

- На `/coaching.html` общий блок «Зачем тренер» заменён реальным портретом, объяснением пользы живой видеосвязи и проверяемой квалификацией: персональный тренер категории «Мастер», профпереподготовка 333 часа, отдельная подготовка по функциональному тренингу и первой доврачебной помощи.
- `/coach/` получил тот же реальный портрет и краткую квалификацию; старое сгенерированное изображение больше не выдаётся за изображение автора в OG/Twitter.
- Фотографии документов с регистрационными номерами не опубликованы. Стаж, отзывы, клиентские результаты и медицинские компетенции не придуманы.
- Локальный и публичный SEO-контракт, общий публичный BUFF IT smoke и рендер `/coaching.html` + `/coach/` на 390/1440 прошли без горизонтального переполнения. Targeted text policy прошёл; общий text policy по-прежнему падает на старых файлах вне среза.
- Production совпадает с manifest по шести SHA-256. Backup: `/var/backups/yokhan-landing/seo-proof-profile-20260721-212433`. IndexNow принял девять канонических URL с HTTP `202`.
- Профиль Profi.ru пока не изменён: расширение Chrome перестало принимать соединение. Диагностика подтвердила, что расширение и native host установлены; по правилам управления требуется отдельное разрешение пользователя открыть новое окно Chrome и повторить подключение.
- SEO-результат по-прежнему не заявлен: доказательный блок является рычагом доверия и конверсии, а не подтверждением топ-10, клика или консультации.

## Current SEO slice — 2026-07-20

User wants: как можно скорее получить нового клиента из поиска по запросам про онлайн-фитнес-тренера, начиная с одного измеримого запроса.

Success means: заранее зафиксированный запрос `фитнес тренер онлайн` приводит `/coaching.html` в топ-10 Google или Яндекса, затем даёт органический переход, консультацию и исход `paid`, `refused` или `waitlist`.

I will verify by: сохранить запрос и страницу без подмены KPI; проверить индексирование в кабинетах; опубликовать только точечное усиление владельца запроса; проверить canonical, H1, цены, source-параметр, sitemap и публичную страницу; затем измерять позицию, клик и консультацию отдельно от технических действий.

Current bounded step:

1. Сделать H1 `/coaching.html` однозначным ответом на запрос `фитнес тренер онлайн` без добавления новых блоков.
2. Обновить только `lastmod` этой страницы и добавить исполняемый регрессионный тест органической атрибуции.
3. Опубликовать `coaching.html` и `sitemap.xml` через точный hash-manifest и path-scoped backup.
4. Отправить URL на переобход; не считать срез готовым до топ-10, клика и консультации.

Risk/Doubt: конкретный поисковый запрос нельзя надёжно связать с конкретным человеком после перехода; кабинеты дают агрегат запрос ↔ URL, а бот — только cohort источника. Высокая конкуренция может потребовать доказательств и внешних упоминаний после измерения этого изменения.

Current result:

- На production H1 целевой страницы теперь прямо отвечает на фиксированный запрос: `Фитнес-тренер онлайн — Игорь Назаров`.
- В sitemap изменён только `lastmod` `/coaching.html` на `2026-07-20`; состав из девяти канонических URL не менялся.
- Органическая атрибуция защищена исполняемым тестом для Google, Яндекса, внутреннего и прямого перехода. Локальный и публичный SEO-контракт, общий BUFF IT smoke и rendered-проверка 390/1440 прошли.
- Деплой ограничен `coaching.html` и `sitemap.xml`, зафиксирован manifest с SHA-256 и backup `/var/backups/yokhan-landing/seo-slice-01-20260720-035542`.
- IndexNow принял девять канонических URL с HTTP `202`.
- Продуктовый результат не заявлен: Google индексирует страницу, Яндекс пока показывает только главную; топ-10, целевой клик и консультация ещё не подтверждены.

## Result — 2026-07-13 Yandex Webmaster ownership file

- Added and deployed `yandex_daceb2f35abb6b87.html` at the site root.
- Public URL returns `200 text/html; charset=utf-8` and the exact verification marker `Verification: daceb2f35abb6b87`.
- Local SEO contract and public BUFF IT smoke still pass.
- Rollback directory: `/var/backups/yokhan-connectivity/yandex-verification-20260713-084139`.
- Owner action: click `Проверить` in Yandex Webmaster, then add `https://yokhanfitness.ru/sitemap.xml`.

## Plan — 2026-07-12 Service connectivity and autonomous image production

User wants: допилить BUFF IT как связанную систему услуг, а не набор страниц, и дать Codex возможность самостоятельно заказывать и подключать изображения.

Success means: поисковый или продуктовый вход ведёт к одной релевантной услуге, у услуги есть полезное действие и возврат, служебные/дублирующие страницы не конкурируют в поиске, CTA-карта совпадает с production, а Codex может вызвать встроенный image generator и сохранить выбранный asset в проект без отдельного API-ключа.

I will verify by: локальный граф ссылок, публичный service smoke, SEO/canonical/noindex контракт, desktop/mobile browser evidence when the in-app browser is available, image capability inspection and one persistent project workflow for approved raster assets.

Goal → Constraints → Approach → Verification → Risk/Doubt:

- Goal: больше людей доходят от поиска и знакомства до подходящего действия или заявки.
- Constraints: фиксированные 26/34 тыс. ₽, максимум один новый клиент, `/coach/` остаётся редакционной страницей, новый Hub и новые дублирующие лендинги запрещены.
- Approach: назначить один публичный владелец каждой роли, убрать устаревшие маршруты из CTA/архитектурных SOT, усилить контекстные переходы между программой, человеком, оффером и поддерживающим сервисом; встроенный `$imagegen` использовать только для утверждённых растровых слотов.
- Verification: отсутствие локальных dead links, правильные статусы/MIME/redirects на production, один CTA-владелец коммерческого кластера, соответствие цен и source params, сохранённый image-order workflow.
- Risk/Doubt: реальные auth/return states APP/CALLS/GATES требуют доступного браузера и сессий; сгенерированные lifestyle-изображения не должны подменять реальные фотографии Игоря или доказательства клиентов.

Current bounded step:

1. Свести роли `/coach/`, `/coaching.html`, `/about.html`, локального `/guide.html`, `personal.html`, `account.html` и внешних сервисов.
2. Исправить P0/P1 разрывы связности и поисковые дубли без изменения визуального языка.
3. Закрепить уже доступный встроенный image generation путь; не подключать платный API/CLI без отдельной необходимости.
4. Задеплоить только проверенный набор файлов с точным rollback.

Progressive JPEG checkpoint: первый вид — карта владельцев и найденные тупики; следующий слой — исправленные production-переходы и поисковый контракт; rough edge — реальные proof assets; replan trigger — сервис не имеет полезного production-действия или авторизация ведёт в тупик.

Result:

- Production pages now keep the fixed 26/34k coaching contract and route training consideration through the offer instead of launch pricing or a premature bot jump.
- Nutrition opens SmartCart directly and keeps a relevant coaching return; the public link/account surfaces no longer present the unrelated PHOTO product as fitness progress.
- APP, CALLS and FOOD entries now point to their live products. GUIDE random paths return hard 404 while known static routes and assets remain available.
- The built-in Codex image-generation path is documented in `AGENTS.md` and `docs/image-orders/README.md`; approved raster orders need no project API key and generated people cannot stand in for Igor, clients or proof.
- Public SEO and BUFF IT service smoke pass. Browser-rendered desktop/mobile/auth evidence remains unavailable because the installed in-app browser package is missing its runtime module.

Rollback: landing backup `/var/backups/yokhan-connectivity/landing-20260712-195514`; GUIDE nginx backup `/var/backups/yokhan-connectivity/guide-nginx-20260712-200200`.

---
status: IN_PROGRESS
current_task: "Rebrand yokhanfitness.ru public layer to BUFF IT"
blockers:
  - "Real Igor/training/product photos are still missing, so current visuals use external reference imagery."
  - "Bot username and existing subdomains still contain old names at the URL level; visible public copy is rebranded."
  - "Program-detail proof, cases, and screenshots are not prepared yet."
next_steps:
  - "Replace external reference imagery with owned BUFF IT photos/screenshots."
  - "Add source-param map: visible page -> CTA -> Telegram start param -> lead segment."
  - "Build detail pages for priority offers: new image/body, top glutes, lose weight without rollback, male strength/back routes."
last_updated: 2026-05-25
---

# Correction -- 2026-07-11 Restore the accepted cold path

User wants: продолжить вчерашний путь холодного знакомства, а не создавать новый слабый лендинг и новые регистрационные обязанности.

Success means: `/start-home` retired locally and publicly; `/coach` introduces Igor and recommends one next step; `/coaching.html` shows the fixed 26/34k offer without future pricing, temporary promotions, low-ticket diversion, internal service names, or fake proof; the bot receives only the qualified coaching CTA.

Root cause:

- The acquisition work was treated as greenfield despite the accepted `/coach -> /coaching -> bot` role contract already existing in this file.
- A useful-content page was mistaken for a cold sales entry, duplicating the funnel and shifting distribution work to the user.

Current slice:

- Retire `/start-home` and its CTA/bot scaffolding instead of keeping a wrong progressive layer.
- Keep `/coach` editorial and one-column; add only a short verified computer-background bridge and make `/coaching` its first commercial link.
- Clean `/coaching.html` around one human offer, fixed prices, one capacity statement, and one `buffit_coaching` CTA.
- Do not publish client cases, diploma claims, testimonials, or media without the missing originals and permissions.

Verification:

- `/start-home` and `/start-home/` return 404.
- `/coach` stays under 220 visible words and four sections; its first content link is `/coaching.html?from=coach`; direct bot links are absent; personal contact appears once.
- `/coaching.html` contains 26 000 and 34 000, one `buffit_coaching` CTA, and none of 32/42k, launch urgency, 5–8k diversion, `APP / Personal`, `FOOD / smartcart`, or pseudo-proof copy.
- Public HTTP, link, security, MIME, UTF-8 and focused bot tests pass; browser geometry remains an explicit gap if the browser surface is unavailable.

Result:

- `/start-home` files, CTA entry and bot alias scaffolding were deleted; production exact routes `/start-home` and `/start-home/` return 404.
- `/coach` now has 175 visible words, two sections, one personal computer-background bridge, one personal contact, no direct bot link, and `/coaching.html?from=coach` as its first content link.
- `/coaching.html` now shows only 26k/34k, one `buffit_coaching` CTA and one-place capacity; future pricing, launch urgency, 5–8k diversion, internal service labels and unsupported proof cards are absent.
- Public BUFF IT smoke passed; focused public markers passed; bot route picker tests passed 17/17.
- Current live backup: `/var/backups/yokhan-coach/acquisition-correction-live-20260711085953`.
- The initial pre-deploy backup command for this correction failed before copying because PowerShell interpreted a remote shell expression. Yesterday's `/coach` backups remain, but there is no exact timestamped copy of the immediately previous `coaching.html`; the current deployed state is backed up now.
- Browser surface still exposes no available tab, so desktop/mobile rendered geometry is not claimed as verified.

Rollback: restore timestamped production backups of `coach/index.html`, `coaching.html`, `data/cta-map.json`, and nginx; remove the retired-route rule only if `/start-home` is intentionally reinstated.

# Correction -- 2026-07-11 Mobile coach spacing

User feedback: mobile side spacing on the restored path is broken even though the design system already owns the shell inset.

Root cause: the mobile `/coach` override replaced the shared `--shell-padding-x` contract with `calc(var(--space-lg) * 2)`. At a 390px viewport this removed 128px from the content width instead of the intended 32px, producing a 262px text column.

Fix: use the existing `--shell-padding-x` token in the base content frame and delete the mobile width override. Do not add a new spacing value or change shared tokens.

Verification: expected content width is 358px at 390px, 736px at 768px and capped by `--content-lg` on desktop; public CSS hash and BUFF IT smoke must match after deploy. Rendered screenshot remains a required residual check if the browser surface is unavailable.

Result: the oversized mobile width override was deleted; `/coach` now uses `--shell-padding-x`, and the stylesheet cache key is `20260711-mobile-spacing`. Local/public CSS SHA-256 matches (`b7bab6c3214ff8049f0ed7da4d5108aaeac052b457e61560d290ca924efa5bbc`); public smoke passes. Backups: `/var/backups/yokhan-coach/mobile-spacing-20260711090836` and `/var/backups/yokhan-coach/mobile-spacing-html-20260711091026`. In-app browser discovery still returns no tabs, so no screenshot is claimed.

# Plan -- 2026-07-10 Editorial /coach after maximilyahov.ru comparison

Goal: сделать `/coach/` редакционной личной страницей уровня референса — имя и роль, короткое обещание, строка основных ссылок и простые тематические блоки без UI-shell.

Complexity: M, Risk: MEDIUM. Files: `coach/index.html`, `coach/coach.css`, `scripts/check-public-buffit.py`, `tasks/current.md`. Новых runtime dependencies нет; nginx/CSP не меняются.

Root cause and blast radius:

- Дефект локален `/coach`: даже после distill остались header, button treatment, повторный CTA и четыре самостоятельных surface-блока.
- Русская типографика не имела regression-gate для коротких предлогов/союзов перед обычным пробелом.
- Соседние страницы, CTA receiver и nginx contract не затрагиваются.

Implementation:

1. Перестроить hierarchy по референсу: `Имя, роль` в H1; один абзац пользы; inline links/contact; дальше короткие списки по задачам.
2. Удалить header, кнопки, повторный CTA и footer-shell; оставить одну текстовую колонку.
3. Связать короткие русские слова неразрывными пробелами и добавить smoke-regression.
4. Проверить DOM/word count/links/UTF-8/CSS/public smoke, сделать path-scoped backup и deploy двух файлов.

Video boundary: не создавать пустой placeholder. После получения ролика добавить self-hosted `<video controls playsinline preload="metadata">`, poster, captions и `media-src 'self'`; autoplay запрещён.

Acceptance: страница читается как личный авторский сайт, не как интерфейс; основной контакт виден сразу; нет висящих коротких слов и внутренней терминологии.

Plan B: если редакционная версия теряет конверсионную ясность, вернуть только один визуально выделенный link «Стартовый разбор», не возвращая карточки/header/button system.

Result:

- `/coach/` перестроен по редакционной hierarchy референса `maximilyahov.ru`: H1 `Игорь Назаров, тренер`, два абзаца позиционирования, строка ссылок, три коротких тематических раздела и контакт.
- Header, buttons, repeated CTA, footer-shell и UI surface treatment удалены; осталось 52 DOM-элемента и 3 section.
- Короткие русские предлоги/союзы связаны `&nbsp;`; public smoke теперь падает на обычном пробеле после `а/без/в/во/для/до/за/и/из/к/на/над/не/но/о/об/от/по/под/при/с/со/у/я`.
- Все 10 уникальных ссылок вернули `200`; local/public smoke прошли; CSP/404 contract сохранён.
- Local/public SHA-256: `8549ac196a2d48f830f54ddb7f01cb872113c3242e850c32219fa081cd63b2f2`.
- Pre-editorial backup: `/var/backups/yokhan-coach/20260710T201500Z/live-coach`.
- Видео не добавлено без реального asset: согласован будущий self-hosted click-to-play ролик 30–45 секунд с poster/captions, без autoplay.

# Correction -- 2026-07-10 Distill /coach

Classification: DESIGN_DISAGREEMENT + MISUNDERSTANDING.

User feedback: новая production-версия заметно перегружена относительно исходника, а внутренняя продуктовая/техническая логика просочилась в пользовательский текст.

Root cause:

- Я оптимизировал полноту product contract вместо личного голоса и лёгкости страницы.
- Шесть секций, карточные сетки, крупный image hero и повторные CTA превратили личный профиль в каталог.
- Формулировки про канонические страницы, проверку до оплаты и устройство продукта объясняли внутреннюю архитектуру посетителю.

Distill contract:

- One job: понять подход Игоря и выбрать один следующий шаг.
- Keep: исходное обещание, спокойный тон, разбор реальности, корректировки по факту, реальные CTA, safety boundary.
- Remove: image hero, card grids, proof section, product-role explanations, meta-copy, duplicate navigation and repeated sections.
- Collapse: аудитория + форматы в три текстовых маршрута; процесс в три шага; trust — через голос и ясные границы, без отдельного доказательного блока.
- Verification: меньше DOM/слов/секций, ноль banlist-терминов, те же реальные links/CSP/404/public smoke.

Distill result:

- Перегруженный image hero, карточные сетки, proof-блок и продуктовые объяснения удалены.
- Страница снова строится как спокойный текстовый профиль: intro, три маршрута, три шага работы, safety note и короткий контакт.
- Видимый объём сокращён с 427 до 177 слов (`-59%`), секции с 7 до 4, ссылки с 23 до 14, DOM-элементы со 141 до 61.
- В видимом тексте нет `canonical`, `sales`, `product`, `proof`, `contract`, `CTA`, `source`, метаданных или объяснения устройства сайта.
- Все 9 уникальных destinations вернули `200`; local/public smoke прошли; CSP `script-src 'none'`, redirects и строгий `404` сохранены.
- Старый `coach-responsive.css` удалён из live и возвращает `404`; responsive-правила собраны в одном `coach.css` на 249 строк.
- Local/public `coach/index.html` совпадают по SHA-256: `ae68dfc6b5d0ae32e84f12197f6714ca16ca13d46122253971d86572dbe67ebb`.
- Pre-distill backup: `/var/backups/yokhan-coach/20260710T190500Z/live-coach`.

# Plan -- 2026-07-10 Production hardening /coach

User wants: реализовать все предложенные улучшения `/coach` и повторно задеплоить production-версию.

Success means: `/coach/` — быстрая статическая личная страница Игоря внутри BUFF IT с реальными CTA, канонической ролью, проверяемым доверием, безопасным health-копирайтом, social metadata, source attribution и строгим nginx 404 без регрессий соседних маршрутов.

Risk: HIGH — меняются публичный конверсионный путь и production nginx. Пользователь одобрил предложенный набор изменений командой «Делай всё».

Role contract:

- `/coach/` — личная страница тренера: доверие, подход, fit и выбор следующего шага.
- `/coaching.html` — каноническая sales-страница ведения: условия, форматы, состав и цена.
- `/about.html` — подробные принципы работы; в текущем шаге не удаляется, чтобы не расширять blast radius.

Architecture/BOM:

- `coach/index.html` — семантический HTML без React, Babel, inline CSS/JS и внешних execution dependencies.
- `coach/coach.css` — только существующие BUFF IT tokens; локальные layout-компоненты для статического header, hero, trust, formats, safety и footer.
- `coach/favicon.svg` — локальный компактный favicon из BUFF IT wordmark initials.
- `data/cta-map.json` — явный CTA/source contract для `buffit_coach`.
- `/etc/nginx/sites-available/yokhan-static` — exact slash/index redirects, строгий `try_files ... =404`, CSP, frame/referrer/permissions/cache headers.

Implementation order:

1. Зафиксировать CTA и только подтверждённый контент из `about.html`, `coaching.html`, `programs.html`, `links.html` и bot catalog.
2. Заменить архивный runtime-app на статический BUFF IT screen и локальные assets.
3. Добавить CTA contract и regression checks.
4. Локально проверить UTF-8, HTML structure, links, no-dead-end, no-runtime, accessibility contract и HTTP.
5. Сделать remote backup, загрузить release атомарно, применить nginx после `nginx -t`, проверить live и rollback readiness.

Security boundaries:

- Анонимный браузер получает только статические local assets; страница не собирает PII.
- Переходы наружу ограничены Telegram и BUFF IT GUIDE; никакой сторонний код не исполняется в origin.
- Root SSH нужен только для точечного deploy/nginx; backup хранится вне webroot.

Verification:

- Forbidden scan: нет `href="#"`, unpkg, googleapis/gstatic, `<script>`, `<style>` или `style=`.
- Все локальные ссылки/assets существуют; primary bot source `buffit_coach` поддержан ботом и CTA map.
- `/coach` 301, `/coach/` 200, `/coach/index.html` 301, missing asset 404; CSP/security/cache headers присутствуют на 200 и 404.
- Public BUFF IT smoke и hashes соседних маршрутов не меняются.
- Browser geometry/console проверяется при доступности browser surface; недоступность остаётся явным residual risk.

Rollback/Plan B: восстановить timestamped копии nginx и live `coach` из `/var/backups/yokhan-coach/<stamp>`, затем `nginx -t`, reload и повторный smoke.

Result:

- `/coach/` заменён на статическую production-страницу без React, Babel, Google Fonts CDN, inline CSS/JS и `href="#"`.
- Роль зафиксирована: `/coach/` отвечает за доверие и маршрутизацию, `/coaching.html` остаётся sales-SOT, `/about.html` сохраняет подробные принципы без рискованного redirect в этом шаге.
- Реальные CTA ведут в `buffit_coach`, личный Telegram, каноническое ведение, разовый разбор, программы, метод, HEALTH и GUIDE; все 12 уникальных destinations вернули `200`.
- Добавлены canonical, Open Graph/Twitter metadata, local favicon, schema.org microdata и machine-readable CTA contract в `data/cta-map.json`.
- Scoped BUFF IT layout использует существующие tokens и локальные компоненты; mobile controls имеют token-derived minimum height 54px, focus-visible и reduced-motion states.
- Production nginx получил slash/index redirects, строгий `try_files ... =404`, CSP `script-src 'none'`, frame/referrer/permissions/cache/cross-origin headers.
- `/coach` -> `301`, `/coach/` -> `200`, `/coach/index.html` -> `301`, missing asset -> `404`; HTML и assets совпадают с локальными файлами по SHA-256.
- Public smoke `py -3 scripts/check-public-buffit.py --base-url https://yokhanfitness.ru/ --timeout 20` прошёл; 17 bot route-picker tests прошли; hashes `/`, `/guide.html`, `/hub/`, `/coaching.html` не изменились.
- Nginx active и `nginx -t` green; live permissions `755/644`; staging отсутствует.

Backup/rollback:

- Полный pre-change backup: `/var/backups/yokhan-coach/20260710T185500Z` (`yokhan-static`, `cta-map.json`, `live-coach`).
- Дополнительный backup до touch-target polish: `index-before-touch-target.html`, `coach-before-touch-target.css` в том же каталоге.

Residual verification gap:

- In-app browser surface в сессии недоступен, поэтому desktop/mobile screenshots, console и computed geometry не заявлены как выполненные. Статические responsive/accessibility contracts, HTTP, hashes и public flows проверены.

# Plan -- 2026-07-10 Public /coach page

User wants: опубликовать страницу из архива `igor-fitness-hub-golos-clean(1)` рядом с другими проектами по адресу `/coach` и получить таблицу улучшений.

Success means: `https://yokhanfitness.ru/coach/` показывает новую страницу, соседние публичные маршруты продолжают работать, а исходник страницы хранится в проекте и может быть безопасно откатан.

Current bounded step:

- Добавить один изолированный статический объект `coach/index.html`, не меняя существующие страницы и общую дизайн-систему.
- Перед публикацией проверить содержимое архива и отсутствие конфликта с существующим `/coach`.
- Сделать резервную копию live-пути, опубликовать только каталог `coach`, нормализовать права и проверить desktop/mobile рендер.

Product/business outcome: отдельная тренерская точка входа для людей с сидячей работой повышает ясность личного предложения и создаёт прямой маршрут к консультации без риска для основного BUFF IT сайта.

Verification:

- Локальный HTTP и browser smoke для `/coach/`.
- Live HTTP/browser smoke для `/coach/`, `/`, `/guide.html`, `/hub/` и публичный BUFF IT check.
- Проверка nginx, резервной копии и прав `755/644`.

Result:

- Добавлен дословный исходный файл `coach/index.html` в рабочее дерево проекта; SHA-256 архива, локального файла, remote-файла и публичного HTTPS-ответа совпадает: `81a6c6ef8892898a930a9e55a28e9bd361bb2c0ca43fa2f43928f815e214dc9a`.
- Страница опубликована по `https://yokhanfitness.ru/coach/`; `/coach` возвращает `301` на канонический slash-path.
- Live-права: каталог `755`, файл `644`, владелец `root:root`; скрытый staging после атомарного переключения отсутствует.
- `nginx -t`, публичный BUFF IT smoke и соседние маршруты `/`, `/guide.html`, `/hub/`, `/coaching.html` прошли после публикации.
- React, ReactDOM и Babel CDN endpoints отвечали `200` после redirect-follow проверки.
- Встроенный browser surface в текущей сессии был недоступен, поэтому console/geometry desktop-mobile smoke не заявлен как выполненный; это residual verification gap.

Rollback: удалить новый live-каталог или восстановить существующий `/var/www/yokhan-landing/coach` из timestamped backup, если он был до публикации.

Known risk: исходный архив содержит несколько ссылок `href="#"` и CDN-зависимости React/Babel; страница будет опубликована без скрытого расширения объёма, а исправления войдут в приоритизированную таблицу.

# Current Task

## Plan -- 2026-06-10 Header auth UX and shorter hero

### Goal
Make the public BUFF IT header treat `Войти` and `Начать` as one BUFF IT ID entry system, and reduce the main hero height so the next section is visibly reachable.

### Complexity Estimate
- Size: S
- Risk: HIGH because the header is a shared sensitive component and auth links affect the public funnel.

### Implementation Order
1. Sync header action CSS with the design-system account layer.
2. Update canonical page header markup: `Войти` -> `/hub/login`, `Начать` -> `/hub/register`.
3. Reduce `--hero-min-height` through tokens, not page-local CSS.
4. Verify nav hashes, encoding, local browser behavior, and public smoke after deploy.

### Boundaries
- Keep existing diagnostic/product `start.html` links inside page content and dropdowns.
- Do not mention VPN; GATES remains inside authenticated Hub pages only.

### Result
- Updated all 32 page headers: `Войти` -> `/hub/login`, `Начать` -> `/hub/register`.
- Added cache-busting CSS links for changed shared CSS files:
  `tokens.css`, `hero.css`, `page-components.css`, `account-system.css`.
- Reworked header auth action CSS so login/start are both `.nav__cta` variants.
- Shortened hero via `--viewport-hero: 70svh` and removed late mobile overrides that forced PDP hero back to full viewport height.
- Deployed to `yokhan-call-prod`.

### Backups
- Landing selected-file backup: `/var/www/yokhan-landing.backup-auth-hero-20260610T104839Z`
- HTML cache-bust backup: `/var/www/yokhan-landing.backup-html-cachebust-20260610T105448Z`

### Verified
- Local `py -3 scripts\check-public-buffit.py --base-url http://127.0.0.1:8082/` -> `public_check_ok`.
- Public `py -3 scripts\check-public-buffit.py --base-url https://yokhanfitness.ru/` -> `public_check_ok`.
- Header counts: 32 `/hub/login`, 32 `/hub/register`, 0 old `nav__login`, 0 header `start.html`.
- Live browser desktop: hero bottom `648px` on `1600x900`; next section visible.
- Live browser mobile-like: hero bottom `718px` on `500x844`; next section visible.

## Goal

Make the public site feel like a client-facing BUFF IT wellness brand, not an internal project map.

## Current Status

- Public UI copy is now centered on the client's world: body, form, energy, clothes, back, safety, food, rhythm, and first step.
- Visible brand was moved from YokhanFitness to BUFF IT and product families: BUFF IT FITNESS, BUFF IT HEALTH, BUFF IT APP, BUFF IT CALLS, BUFF IT FOOD, BUFF IT GUIDE.
- Internal terms were removed from visible site copy: source tracking, money-engine, client layer, Personal as a product label, infrastructure.
- Header/hero/cards were rebuilt closer to the Oura pattern: promo bar, large product hero, clean centered nav, product cards, scenario cards, and benefit-led sections.
- The site still uses the old technical URLs where the actual live destinations exist.

## Immediate Next Step

Run deploy-quality visual review after replacing borrowed/reference imagery with owned assets.
## Plan -- 2026-05-26 Program Site Build

### Goal
Turn the BUFF IT public site into a program-led funnel using the confirmed bot catalog, with older YokhanFitness programs used as support and lead-magnet layers.

### Complexity Estimate
- Size: M
- Files to create: 0
- Files to modify: 5-8
- Estimated lines: 250-450 changed
- Risk: MEDIUM because shared navigation and program pages affect all visible entry routes, but the site is static and easy to roll back.

### File Architecture
- `programs.html` -- main goal/program catalog with confirmed bot programs and support tracks.
- `men.html` -- male program route: entry, pull-ups, muscle-up, front lever, athlete body, back, maintenance.
- `women.html` -- female program route: entry, pull-ups, weight loss, glutes, flexible body.
- `training.html` -- BUFF IT FITNESS overview tying programs to coaching/self-training formats.
- `css/programs.css` -- reusable program catalog, detail card, metadata, and route components.
- `*.html` nav snippets -- mechanical cleanup of dropdown captions so labels help recognition.

### Implementation Order
1. Expand program page content first, because it is the source route for men/women/navigation.
2. Expand men/women pages with the confirmed bot catalog and clear CTAs.
3. Update training overview to point into the new program structure.
4. Add CSS components using existing tokens.
5. Mechanically update repeated nav captions across pages.
6. Verify layout and interaction with local browser checks.

### Boundaries
- Do not clean template-new files in this pass.
- Do not rename visible BUFF IT logo outside the existing brand-logo pattern.
- Do not invent medical guarantees or claim full detailed plans where only shells were found.
- Do not change bot/app functionality.

### Risks & Mitigations
- Risk: user-facing text drifts into internal architecture. Mitigation: every program card starts from client outcome, then mechanism, then route.
- Risk: nav changes affect all pages. Mitigation: mechanical replacement only, then check a primary and secondary page.
- Risk: pages become visually dense. Mitigation: use cards, metadata rows, and route sections with existing spacing tokens.

### Plan B
If the full multi-page pass gets too large, finish `programs.html` and shared CSS first, then leave `men.html` / `women.html` as links to the main catalog with a short handoff list.

### Test Scenarios
- Desktop: `programs.html`, `men.html`, `women.html`, `training.html` render with fixed shared header and no text overlap.
- Mobile: nav menu and program cards fit without horizontal scroll.
- Interaction: dropdown opens under the trigger, Escape closes it, CTA buttons point to valid Telegram/start routes.
- Content: confirmed bot programs are present; support programs are labeled as starter/support tracks, not falsely sold as full paid programs.
## Update -- 2026-05-27 Program Site Pass

### Done
- Expanded `programs.html` into the main BUFF IT program catalog using the bot as the source of truth.
- Expanded `men.html` with all seven confirmed male bot programs.
- Expanded `women.html` with all five confirmed female bot programs.
- Expanded `training.html` so BUFF IT FITNESS explains goal-first routing before format choice.
- Added reusable program catalog components in `css/programs.css` using existing tokens.
- Replaced weak dropdown captions across visible HTML pages with descriptive labels.

### Verified
- Local refs for the four changed program pages are present.
- Weak nav labels (`Сайт`, `Лендинг`, `Онлайн-сервис`, etc.) are gone.
- Browser check via temporary local server: `programs.html`, `men.html`, `women.html`, `training.html` render; dropdown opens; no horizontal overflow at checked desktop/narrow widths.
- Console only showed a favicon 404, not CSS/JS/font failures.

### Needs User Content
- Detailed structure for priority paid programs: `Подготовь тело к новому образу`, `Топ ягодицы`, `Похудеть навсегда`, `Тело атлета`.
- Package format and price logic: self-training vs trainer-led, duration, check-ins, guarantees/limitations.
- Real photos or image prompts for men/women/program sections.
- Final primary CTA per route: bot, personal Telegram, or call.
## Update -- 2026-05-27 Product Architecture Pass

### Done
- Reframed BUFF IT as goal-first 12-week routes, not "programs" or "online coaching" as the primary customer-facing idea.
- Added launch pricing to `programs.html` and `training.html`:
  - 2 sessions + homework: 26 000 RUB/month on launch, then 32 000 RUB/month.
  - 3 sessions/week: 34 000 RUB/month on launch, then 42 000 RUB/month.
- Added free launch diagnostics: free for the first 2 months, later paid.
- Added current included services: personal Telegram chat, smartcart, P2P protected calls, beginner training guide, first-aid/home kit guide.
- Added format framing: home/gym/outdoor, with home positioned as a major advantage for time, money, comfort, and introverts, while gym remains a normal option.
- Tightened motivation copy around JTBD: image, control, status, comfort, safety, rhythm.

### Verified
- HTTP checks returned 200 for `index.html`, `programs.html`, `training.html`, `men.html`, `women.html`.
- Local refs are present for those pages.
- Encoding markers are clean.
- Chrome DevTools MCP transport closed during this pass, so visual browser inspection was not completed after the latest copy/pricing changes.

### Next
- Visual QA in browser when DevTools transport is available again.
- Decide whether prices should be shown on every route page or only on `programs.html` / `training.html`.
- Add exact diagnostics questionnaire and package boundaries once confirmed.
## Update -- 2026-05-27 Program Detail Page System

### Done
- Added a system-level program catalog source: `data/program-catalog.json` with 11 routes.
- Added shared detail-page styles: `css/program-detail.css`.
- Created 11 goal detail pages:
  - `program-new-image.html`
  - `program-weight-loss.html`
  - `program-glutes.html`
  - `program-athlete-body.html`
  - `program-entry-fitness.html`
  - `program-healthy-back.html`
  - `program-pull-ups.html`
  - `program-flexible-body.html`
  - `program-maintain-shape.html`
  - `program-power-exit.html`
  - `program-front-hang.html`
- Updated `programs.html`, `men.html`, `women.html`, and `training.html` so route cards/list items link into detail pages.
- Each detail page now has: JTBD motivation, outcomes, 12-week flow, home/gym/outdoor format, pricing, free launch diagnostics, included services, related programs, and Telegram start param.

### Verified
- Local HTML refs check: OK.
- Required program markers check: title, Telegram start param, prices, diagnostics: OK.
- HTTP 200 via temporary local server for: index, programs, training, men, women, and all 11 program detail pages.
- All temporary scripts/server files removed; local server stopped.

### Known Gap
- Chrome DevTools MCP transport was still closed, so final visual screenshot QA was not possible in this pass.
## Update -- 2026-05-27 Canonical Header System

### Done
- Replaced page-local header/nav copies with one canonical BUFF IT header markup across all 31 HTML pages.
- Added `css/header-system.css` as the final loaded header contract after legacy nav layers.
- Removed page-specific active header state from the HTML nav markup so secondary pages no longer drift from the home header.
- Kept the Oura-like direction: fixed transparent shell, centered pill navigation, compact dropdowns, and one consistent logo treatment.

### Verified
- Nav hash check: 1 unique `<nav>` variant across 31 HTML pages.
- Header stylesheet link check: `css/header-system.css` is present on every HTML page.
- Local refs check: 31 HTML pages, 0 missing local links.
- HTTP check via temporary in-process Node server: 31 HTML pages returned 200.
- CSS line counts stayed under the 375-line project limit for touched/new shared CSS files.

### Known Gap
- Chrome DevTools MCP still returns `Transport closed`, so final visual screenshot/hover QA could not be completed through MCP in this pass.
## Update -- 2026-05-27 Premium Header Dropdown

### Done
- Polished the canonical BUFF IT header dropdown in `css/header-system.css` without changing page-local nav markup.
- Made the dropdown closer to the Oura-like premium direction: opaque warm dark surface, soft internal light, featured first route, compact card grid, useful labels/descriptions, and no movement/jump animation.
- Tightened mobile header behavior: top nav links no longer squeeze into each other; dropdown uses a compact single-column panel.
- Captured visual QA screenshots through headless Chrome/CDP:
  - `test-results/header-dropdown-desktop.png`
  - `test-results/header-dropdown-mobile.png`

### Verified
- Nav hash check: 1 unique `<nav>` variant across 31 HTML pages.
- Local refs check: 31 HTML pages, 0 missing local links.
- HTTP check via temporary in-process Node server: 31 HTML pages returned 200.
- `css/header-system.css` remains under the 375-line limit.

### Next Content Work
- Fill program detail pages with stronger proof, exact diagnostics flow, objections, and per-route image briefs.
- Add a CTA/source-param map: page -> button -> Telegram start param -> lead segment.
- Replace borrowed/reference images with owned BUFF IT photos/screenshots.
## Update -- 2026-05-27 Oura Header Behavior Rework

### Done
- Re-inspected the live Oura Ring 4 header behavior with headless Chrome/CDP instead of relying on memory.
- Reworked BUFF IT header toward the actual Oura behavior:
  - desktop top state is transparent over hero, not a dark pill shell;
  - desktop hover opens a full-width warm panel from the top with rounded bottom corners;
  - background content blurs behind the open menu;
  - active desktop item uses underline and dark header text inside the open panel;
  - mobile no longer uses a horizontal nav strip; it uses logo + hamburger and a compact menu panel.
- Split responsibilities cleanly:
  - `css/header-system.css` controls header shell and mobile toggle.
  - `css/nav-dropdown-system.css` controls the Oura-like dropdown panel and menu layout.
  - `js/nav-menu.js` controls desktop hover, mobile menu, Escape/outside close, and body open-state classes.
- Added motion tokens in `css/tokens.css` for the controlled header transition.

### Visual QA
- Oura reference screenshots saved under `test-results/oura-reference/`.
- BUFF IT verification screenshots saved under `test-results/header-oura-rework/`:
  - `buffit-desktop-top.png`
  - `buffit-desktop-menu.png`
  - `buffit-desktop-scrolled-menu.png`
  - `buffit-mobile-top.png`
  - `buffit-mobile-menu.png`
  - `buffit-mobile-submenu.png`

### Verified
- `node --check js/nav-menu.js`: OK.
- Nav hash check: 1 unique `<nav>` variant across 31 HTML pages.
- Mobile toggle exists on every HTML page.
- Local refs check: 31 HTML pages, 0 missing links.
- HTTP check: 31 HTML pages returned 200.
- Mobile overflow check: `overflowX = 0`.
- Touched CSS files remain below the 375-line limit.
## Plan -- 2026-05-27 Dropdown Fit And Motion

### Goal
Make the BUFF IT Oura-like header dropdown fit the real menu content cleanly and open with a smoother premium motion.

### Complexity Estimate
- Size: M
- Files to create: 0
- Files to modify: 2
- Estimated lines: 20-45 changed
- Risk: MEDIUM because this is a shared header component used by all 31 pages.

### File Architecture
- `css/tokens.css` -- shared dropdown height/card/motion tokens.
- `css/nav-dropdown-system.css` -- final desktop/mobile dropdown layout and animation contract.

### Implementation Order
1. Tune tokens first so size/motion remain system-level.
2. Compact the dropdown grid/cards/list items in the final dropdown CSS layer.
3. Add a smoother open reveal with reduced-motion fallback.
4. Verify JS syntax, nav consistency, local refs, HTTP, mobile overflow, and screenshots.

### Boundaries
- Do not change canonical nav HTML across pages.
- Do not change product copy/routes in this pass.
- Do not revive legacy hover-only dropdown behavior.

### Risks & Mitigations
- Legacy CSS may override the final layer -> verify computed screenshots and nav open state.
- Content may fit one group but clip another -> screenshot/check Programs and Online menus.
- Animation may feel heavy -> keep transform/opacity/clip-path only and respect reduced motion.

### Plan B
If the full-width panel still feels too tall or busy, keep Oura top-panel behavior but switch desktop content to a two-row compact grid with list descriptions hidden for secondary items.

### Test Scenarios
- Desktop: `Online trainings` menu opens fully with no clipped lower items.
- Desktop: `Training programs` menu also fits despite more items.
- Mobile: hamburger menu and submenu fit without horizontal overflow.
- Behavior: Escape/outside close still works; open state uses JS `is-open`, not legacy hover.

## Update -- 2026-05-27 Dropdown Fit And Motion

### Done
- Tuned shared dropdown tokens in `css/tokens.css`: panel height, feature-card minimum, compact list row minimum, and smoother nav motion curve.
- Reworked `css/nav-dropdown-system.css` so the full-width Oura-like panel keeps the first two routes as feature cards and fits the remaining route list without clipping.
- Added a clip-path + translate reveal using the shared nav motion token and preserved reduced-motion behavior.

### Verified
- `node --check js/nav-menu.js`: OK.
- Nav hash check: 1 unique `<nav>` variant across 31 HTML pages.
- Local refs check: 31 HTML pages, 0 missing links.
- HTTP check: 31 HTML pages returned 200.
- Browser geometry screenshots saved under `test-results/header-fit-motion/`: desktop programs, desktop online, and mobile online all have `clippedCount=0`, `overflowX=0`, and matching `scrollHeight/clientHeight`.
- Touched CSS files remain below the 375-line limit.

## Plan -- 2026-05-27 Dropdown Hierarchy Repair

### Goal
Restore the BUFF IT dropdown information hierarchy inside the current Oura-like top-panel design.

### Complexity Estimate
- Size: M
- Files to create: 0
- Files to modify: 1
- Estimated lines: 25-45 changed
- Risk: MEDIUM because this affects the shared nav on all 31 pages.

### File Architecture
- `css/nav-dropdown-system.css` -- final desktop/mobile dropdown hierarchy and card roles.

### Implementation Order
1. Make only the first link a dominant section entry.
2. Convert all other links into equal secondary route cards in a two-column area.
3. Update mobile overrides so desktop hierarchy rules do not leak into mobile.
4. Re-run nav, link, HTTP, overflow, and screenshot geometry checks.

### Boundaries
- Do not rewrite nav HTML or product copy.
- Do not change header shell behavior.
- Keep the Oura-like full-width panel and current motion curve.

### Test Scenarios
- Desktop: one dominant card per dropdown, not two.
- Desktop: `Training programs` with 6 links fits with no clipping.
- Desktop: `Online trainings` with 5 links fits with no clipping.
- Mobile: submenu cards stack normally with no horizontal overflow.

## Update -- 2026-05-27 Dropdown Hierarchy Repair

### Done
- Repaired the BUFF IT dropdown hierarchy in `css/nav-dropdown-system.css`: only the first item is now the dominant section lead.
- Converted all remaining items into equal secondary route cards in a two-column desktop area, preserving the current Oura-like full-width panel.
- Reset the desktop lead-card rules on mobile so mobile submenus stack evenly.

### Verified
- `node --check js/nav-menu.js`: OK.
- CSS line counts: `tokens.css`, `nav-dropdown-system.css`, and `header-system.css` remain under 375 lines.
- Nav hash check: 1 unique `<nav>` variant across 31 HTML pages.
- Local refs check: 31 HTML pages, 0 missing links.
- HTTP check: 31 HTML pages returned 200.
- Browser geometry screenshots saved under `test-results/header-hierarchy/`:
  - desktop programs: `dominantCount=1`, `clippedCount=0`, `overflowX=0`;
  - desktop online: `dominantCount=1`, `clippedCount=0`, `overflowX=0`;
  - mobile online: even stacked menu, `clippedCount=0`, `overflowX=0`.

### Final Check Addendum
- Tightened mobile specificity so secondary descriptions do not leak into the mobile menu.
- Final browser geometry: desktop programs and desktop online both report `dominantCount=1`, `clippedCount=0`, `overflowX=0`; mobile online reports even stacked cards with `clippedCount=0`, `overflowX=0`, and matching `scrollHeight/clientHeight`.

## Plan -- 2026-05-27 Product Dropdown Cards

### Goal
Turn the BUFF IT header dropdowns into product-aware card menus with direct inner links, stable panel switching, and an Oura-like rounded scrolled header.

### Complexity Estimate
- Size: M
- Files to create: 0
- Files to modify: 4 categories
- Estimated lines: 120-220 changed
- Risk: MEDIUM because the canonical header is shared by all 31 HTML pages.

### File Architecture
- `*.html` -- mechanically replace the canonical nav block with valid card-container dropdown markup across all pages.
- `css/nav-dropdown-system.css` -- dropdown shell, cards, quick links, mobile stack, stable panel.
- `css/header-system.css` -- rounded solid header state on scroll.
- `js/nav-menu.js` -- keep desktop panel open while moving across nav groups; close on leaving the whole nav/outside/Escape.

### Implementation Order
1. Build one canonical nav block with product cards and nested quick links.
2. Replace all page nav blocks from that one source and verify one nav hash.
3. Rework dropdown CSS for card containers, chips, shared panel surface, and mobile reset.
4. Update hover controller so group switching changes content without closing the panel.
5. Add rounded scrolled header styling.
6. Verify syntax, nav hash, local refs, HTTP, desktop/mobile screenshots, and panel switch geometry.

### Boundaries
- Do not change page body content or offer/pricing copy.
- Do not rebrand or rename routes.
- Keep existing destination pages and Telegram links.
- Keep CSS files below 375 lines.

### Plan B
If the card+quick-link menu becomes too dense, keep the same valid HTML structure but hide descriptions in secondary cards on desktop and leave only title + quick links.

### Test Scenarios
- Programs dropdown exposes direct links to women's and men's concrete program pages.
- Other dropdowns use the same lead-card + utility cards logic.
- Moving from one desktop dropdown trigger to another leaves the panel shell open, not flickering.
- Scrolled desktop header has a rounded capsule surface.
- Mobile menu remains stacked, no horizontal overflow.

## Update -- 2026-05-27 Product Dropdown Cards

### Done
- Rebuilt the shared BUFF IT header dropdowns as product-aware card menus across all 31 HTML pages.
- Programs dropdown now keeps one useful diagnostic lead card and direct links into women, men, and soft-start program pages.
- Online trainings, useful materials, and approach dropdowns now follow the same lead-card plus route-card logic.
- Desktop dropdown panel now uses one shared shell, so switching between menu groups keeps the panel open instead of blinking.
- Fixed scrolled header behavior: `--nav-solid-offset: 7.5rem` is now converted to pixels in `js/nav-state.js`, so the rounded Oura-like capsule state appears at the intended scroll point.

### Verified
- `node --check js/nav-menu.js` and `node --check js/nav-state.js`: OK.
- CSS/JS size gate: `tokens.css` 300, `nav-dropdown-system.css` 311, `header-system.css` 333, `nav-menu.js` 168, `nav-state.js` 38 lines.
- Shared nav hash: 31 HTML pages, 1 unique `<nav>` block.
- Local refs: 31 HTML pages, 0 missing local refs.
- HTML nav structure: 0 nested anchors, 0 `????` encoding artifacts.
- HTTP smoke: 31 HTML pages returned 200 from a local static server.
- Browser geometry saved to `test-results/header-product-dropdown/checks-final.json`:
  - all 4 desktop dropdown groups: `clipped=0`, `overflowX=0`;
  - switching Programs -> Online: active panel remains open, `panel=1`, `activeIndex=1`;
  - scrolled desktop header: `solid=true`, `radius=999px`, `panel=0`;
  - mobile Programs menu: 4 cards, 15 links, `clipped=0`, `overflowX=0`.

### Evidence
- Screenshots: `test-results/header-product-dropdown/desktop-programs.png`, `desktop-online.png`, `desktop-scrolled.png`, `mobile-programs.png`.
## Plan -- 2026-05-28 Dropdown Motion Polish

### Goal
Polish the BUFF IT Oura-like dropdown motion: square top edge at viewport, larger shared radius scale, vertical top-down opening, and no blink when moving hover between header groups.

### Scope
- `css/tokens.css` -- increase non-pill radius scale by 1.5x and add/adjust nav motion tokens.
- `css/nav-dropdown-system.css` -- use nav panel radius token, force square top corners, animate shell/content vertically, and handle switching state.
- `js/nav-menu.js` -- add short `is-nav-switching` body state when changing active desktop group.

### Verify
- CSS/JS syntax and file size gate.
- Browser screenshots/geometry: desktop open, desktop switch, desktop scrolled, mobile open.
- Switch check: shared panel remains visible and active group changes without closing.
## Update -- 2026-05-28 Dropdown Motion Polish

### Done
- Raised the shared non-pill radius scale by 1.5x in `css/tokens.css`: xs/sm/md/lg/hero now feed the existing component system.
- Kept dropdown frame top corners square against the viewport edge and enlarged only the bottom panel radius through `--nav-panel-radius`.
- Replaced the shared dropdown frame reveal with a top-origin `scaleY` animation so it opens vertically from the top edge instead of feeling lateral.
- Added `is-nav-switching` in `js/nav-menu.js` so moving between desktop menu groups keeps the shared shell visible and switches only content with a short opacity transition.

### Verified
- `node --check js/nav-menu.js` and `node --check js/nav-state.js`: OK.
- Size gate: `tokens.css` 303, `nav-dropdown-system.css` 325, `header-system.css` 333, `nav-menu.js` 191, `nav-state.js` 38 lines.
- Shared nav hash: 31 HTML pages, 1 unique `<nav>` block.
- Local refs: 31 HTML pages, 0 missing local refs.
- HTML nav structure: 0 nested anchors, 0 `????` encoding artifacts.
- HTTP smoke: 31 HTML pages returned 200 from a local static server.
- Browser geometry saved to `test-results/header-motion-polish/checks.json`:
  - desktop open/switch/mobile: `clippedCount=0`, `overflowX=0`;
  - switch at 40ms: `bodySwitching=true`, `panelOpacity=1`, `activeIndex=1`;
  - frame top radius: `0px / 0px`; bottom radius: `48px`;
  - scrolled header: `bodySolid=true`, `navBorderRadius≈999px`.

### Evidence
- Screenshots: `test-results/header-motion-polish/desktop-programs-open.png`, `desktop-switch-settled.png`, `desktop-scrolled.png`, `mobile-programs-open.png`.
## Update -- 2026-05-28 Oura Motion Inspection Fix

### What Oura Actually Does
- Oura uses one persistent page-level menu surface: `absolute top-0 left-0 w-full overflow-hidden bg-sandstone-200 shadow-2xl lg:rounded-b-[3rem]`.
- The surface starts at the viewport top, has square top corners and a large rounded bottom edge.
- Switching nav items keeps the surface present; only the inner content changes.
- Header transition timing observed: about `0.5s cubic-bezier(0.4, 0, 0.2, 1)`.

### Done
- Reworked BUFF IT dropdown surface to animate `height` from the top edge instead of using a transform-only reveal.
- Kept the shared surface stable while switching nav groups.
- Removed content fade-to-zero during switch: `body.is-nav-switching` now disables dropdown content transitions and makes the new active content visible immediately.
- Updated motion tokens toward the inspected Oura timing: `--motion-nav: 500ms`, `--motion-nav-ease: cubic-bezier(0.4, 0, 0.2, 1)`.

### Verified
- `node --check js/nav-menu.js` and `node --check js/nav-state.js`: OK.
- Size gate: `tokens.css` 303, `nav-dropdown-system.css` 331, `header-system.css` 333, `nav-menu.js` 191, `nav-state.js` 38 lines.
- Shared nav hash: 31 HTML pages, 1 unique `<nav>` block.
- Local refs: 31 HTML pages, 0 missing local refs.
- HTML nav structure: 0 nested anchors, 0 `????` encoding artifacts.
- HTTP smoke: 31 HTML pages returned 200.
- Real hover CDP check saved to `test-results/header-oura-motion-fix/checks.json`:
  - initial hover: content fades in after surface is open;
  - hover switch at 40ms: `bodySwitching=true`, `panelHeight=448px`, `panelOpacity=1`, `activeOpacity=1`, `activeTransition=none`;
  - all 4 desktop groups: `panelOpacity=1`, `clipped=0`, `overflowX=0`.

### Evidence
- Oura inspection screenshots/data: `test-results/oura-inspection/oura-shop-open.png`, `oura-switch-open.png`, `hover-analysis.json`.
- BUFF IT screenshots/data: `test-results/header-oura-motion-fix/hover-programs-settled.png`, `hover-switch-settled.png`, `checks.json`.
## Update -- 2026-05-28 Dropdown Animation Fine Polish

### Done
- Slowed the shared dropdown surface motion: `--motion-nav` is now `760ms` with Oura-like `cubic-bezier(0.4, 0, 0.2, 1)`.
- Slowed content entry to `320ms` with `180ms` delay so the surface opens first and content arrives after, instead of feeling like a fast slide.
- Forced square top corners on the dropdown surface with explicit `border-top-left-radius: 0` and `border-top-right-radius: 0`.
- Added `border-radius: 0` on the desktop `.nav__dropdown` content layer so no hidden content layer can visually round the frame top.
- Removed hover blur from both layers: `nav::after` backdrop blur is `none`, and `body.is-nav-menu-open main` keeps `filter: none`.

### Verified
- `node --check js/nav-menu.js` and `node --check js/nav-state.js`: OK.
- Size gate: `tokens.css` 303, `nav-dropdown-system.css` 333, `header-system.css` 333, `nav-menu.js` 191, `nav-state.js` 38 lines.
- Browser computed styles saved to `test-results/header-animation-polish/checks.json`:
  - panel transition: `height 0.76s cubic-bezier(0.4, 0, 0.2, 1)`;
  - top radii: `0px / 0px`;
  - bottom radius: `48px`;
  - dropdown content radius: `0px`;
  - hover blur: `veilBackdrop=none`, `mainFilter=none`;
  - switch remains stable: `bodySwitching=true`, `dropdownTransition=none`, `panelOpacity=1`.
- Shared nav hash: 31 HTML pages, 1 unique `<nav>` block.
- Local refs: 31 HTML pages, 0 missing local refs.
- HTML nav structure: 0 nested anchors, 0 `????` artifacts.
- HTTP smoke: 31 HTML pages returned 200.

### Evidence
- Screenshots: `test-results/header-animation-polish/hover-settled.png`, `switch-settled.png`.
## Update -- 2026-05-28 Header Scrolled Motion Fix

### Done
- Fixed the scrolled desktop dropdown so it opens from the viewport top edge like the top-of-page state.
- Removed the legacy scrolled `backdrop-filter` context from `.nav__inner` while a menu is open; this stops fixed dropdown panels from being offset by the rounded header capsule.
- Removed the jumpy `translateY` hover from dropdown quicklinks and replaced it with token-based soft light, border, color, and shadow changes.
- Kept dropdown motion driven by shared nav motion tokens: slow surface reveal and fast UI hover response.

### Verified
- Chrome computed check: top and scrolled dropdowns both start at `rectTop=0`, `rectLeft=0`, with square top corners and `48px` bottom radius.
- Chrome computed check: dropdown reveal is progressive through `clip-path 0.92s cubic-bezier(0.4, 0, 0.2, 1)`; scrolled fresh state starts at `100%` clipped, then reveals.
- Chrome hover check: quicklink `transform=none`; hover uses tokenized background/border/box-shadow transitions at `0.24s`.
- Screenshots saved under `test-results/header-scrolled-motion-fix/`.
- `node --check js/nav-menu.js` and `node --check js/nav-state.js`: OK.
- Size gate: `tokens.css` 305, `nav-dropdown-system.css` 354, `header-system.css` 343, `nav-menu.js` 191, `nav-state.js` 38 lines.
- Shared nav hash: 31 HTML pages, 1 unique `<nav>` block.
- Local refs: 31 HTML pages, 0 missing local refs.
- HTTP smoke: 31 HTML pages returned 200.
## Update -- 2026-05-28 Header Closing Shift Fix

### Done
- Fixed dropdown close motion so the panel no longer shifts down/right when hover leaves in scrolled state.
- Added `is-nav-menu-closing` in `js/nav-menu.js`; it holds the viewport-bound header context for the duration of `--motion-nav-surface`.
- Updated `css/header-system.css` so the scrolled capsule blur/backdrop returns only after the dropdown close animation is hidden.

### Verified
- Reproduced pre-fix bug: during close, visible dropdown moved from `rectTop=0, rectLeft=0` to `rectTop=17, rectLeft=33` while `navInnerBackdrop=blur(...)`.
- Post-fix Chrome check: during visible close frames at 150ms, 280ms, and 680ms, `rectTop=0`, `rectLeft=0`, `navInnerBackdrop=none`, `is-nav-menu-closing=true`.
- Post-fix Chrome check: after 1180ms the dropdown is hidden, closing class is removed, and the scrolled header capsule returns.
- Re-hover during close cancels closing state cleanly: `closingAfterReopen=false`, `openAfterReopen=true`, `rectTop=0`, `rectLeft=0`.
- `node --check js/nav-menu.js` and `node --check js/nav-state.js`: OK.
- Size gate: `tokens.css` 305, `nav-dropdown-system.css` 354, `header-system.css` 344, `nav-menu.js` 237, `nav-state.js` 38 lines.
- Shared nav hash: 31 HTML pages, 1 unique `<nav>` block.
- Local refs: 31 HTML pages, 0 missing local refs.
- HTTP smoke: 31 HTML pages returned 200.
## Update -- 2026-05-28 Design System Cleanup

### Done
- Removed legacy header CSS ownership from page loads: `css/nav.css`, `css/nav-menu.css`, and `css/nav-system.css` are no longer linked from any HTML page.
- Deleted the old `css/nav.css` file and removed/deprecated legacy nav files from the active CSS surface.
- Promoted dropdown surfaces, chips, hover light, close delay, switch timing, and reduced-motion duration into `css/tokens.css`.
- Split the shared hero frame from `css/header-system.css` into `css/hero-shell-system.css`, so header and hero geometry have separate owners and file sizes stay under the 375-line limit.
- Removed old transform-hover movement from buttons/cards and removed stale nav/dropdown selectors from shared CSS.
- Updated `_reference/tool-registry.md` and `docs/DESIGN_TOKENS_TABLE.md` to match the current component/token ownership.

### Verified
- `node --check js/nav-menu.js` and `node --check js/nav-state.js`: OK.
- CSS size gate: all CSS files are <= 375 lines.
- Shared nav hash: 31 HTML pages, 1 unique `<nav>` block.
- Local refs: 31 HTML pages, 0 missing links.
- Legacy nav audit: 0 references to deleted nav CSS, old hover dropdown selectors, old `nav__drop-link`, old `nav__group--active`, old floating dropdown transforms, or stale nav tokens.
- HTTP smoke: 31 HTML pages returned 200.
- Browser check via Chrome MCP: desktop dropdown loads no old CSS, opens at viewport top, has square top corners and 48px bottom radius; switching groups keeps panel visible; mobile menu has no horizontal overflow.
- Screenshots saved under `test-results/design-system-cleanup/`.

### Remaining Risk
- The broader site still has previously dirty product/content/page changes and untracked template-new files unrelated to this cleanup.
- Some older page-level hero/card styles still exist by design, but the final hero frame is now isolated in `css/hero-shell-system.css`.
## Plan -- 2026-05-28 Deep Site Rework

### Goal
Move BUFF IT from a visually polished but partially shallow static site into a system-led client funnel: goal pages, diagnostics, paid 12-week coaching, and support tools must connect logically.

### Scope
- Strategy and tool map: page jobs, funnel stages, existing services, and new tool ideas.
- First P0 content pass: `start.html`, `ecosystem.html`, `programs.html`, and all program detail pages.
- Keep the canonical Oura-like header untouched.

### Boundaries
- Do not touch template-new infra files.
- Do not make medical cure claims.
- Do not present future self-training subscription as the current paid offer.
- Do not add visual values outside the existing token/component system.

### Verify
UTF-8, one canonical nav hash, valid local links, CSS/JS syntax, CSS line-count gate, browser smoke for key pages.
## Update -- 2026-05-28 Deep Site Rework P0

### Done
- Added `docs/BUFFIT_SITE_REWORK_STRATEGY_20260528.md` with page jobs, funnel stages, tool integration rules, and new tool ideas.
- Added `data/tool-map.json` as the structured map of current BUFF IT surfaces/tools and next tool ideas.
- Reworked `start.html` so it explains what happens before the bot and where diagnostics routes people after the bot.
- Reworked `ecosystem.html` so services are presented as support around 12-week coaching, not as isolated projects.
- Reworked `programs.html` so APP/CALLS/FOOD/GUIDE/HEALTH/Bot are tied to the paid route and delivery logic.
- Updated all 11 `program-*.html` detail pages: outcome copy now comes from program JTBD material instead of the repeated generic diagnostic sentence, and each route links to supporting tools.
- Updated shared CSS for support-card links, mobile hero panel sizing, and long section heading wrapping.
- Updated `_reference/tool-registry.md` and `docs/DESIGN_SYSTEM.md` to reflect the current strategy/tool/design-system ownership.

### Verified
- `node --check js/nav-menu.js`, `js/nav-state.js`, `js/pointer-glow.js`: OK.
- JSON parse for `data/tool-map.json`: OK.
- CSS line-count gate: all CSS files <= 375 lines.
- Shared nav hash: 31 HTML pages, 1 unique `<nav>` block.
- Local refs: 31 HTML pages, 0 missing links; nested anchors: 0.
- Program detail markers: tool grids present; stale generic outcome copy absent.
- Encoding scan: no `????`, escaped-quote artifacts, or literal `` `r`n `` artifacts.
- HTTP smoke: 31 HTML pages returned 200.
- Browser/CDP overflow check: `start`, `programs`, `ecosystem`, `program-new-image` at mobile and desktop have `overflowX=0`, `offenders=0`.
- Screenshots saved under `test-results/site-rework-20260528/`.

### Next
- Deepen `app.html` vs `self-training.html`, `health.html` vs `safety.html`, and `about.html` vs `method.html` so their JTBD roles stop overlapping.
- Add exact bot result copy and source-param analytics map.
- Add real photos/screenshots/proof assets for APP, bot, smartcart, calls, guides, and client progress.
## Update -- 2026-05-28 Deep Site Rework P1

### Done
- Split overlapping page roles without touching the canonical header: `app.html` is current delivery support, `self-training.html` is future budget/waitlist, `health.html` is safety hub, `safety.html` is first-aid/home-kit material, `about.html` is trust/contact/boundaries, and `method.html` is route-building logic.
- Reworked `guide.html`, `calls-access.html`, `links.html`, and `bot.html` so each page has a clear next-step job instead of acting as a short placeholder.
- Added `data/cta-map.json` and `docs/CTA_SOURCE_PARAM_MAP_20260528.md` for page -> CTA -> Telegram start-param -> post-bot route mapping.
- Updated `data/tool-map.json`, `_reference/tool-registry.md`, `docs/DESIGN_SYSTEM.md`, and `docs/DESIGN_TOKENS_TABLE.md` to include the new routing artifacts and mobile hero token.
- Fixed internal hero mobile overflow through `--hero-padding-mobile` and `css/hero-shell-system.css` instead of per-page layout hacks.

### Verified
- `node --check js/nav-menu.js`, `js/nav-state.js`, `js/pointer-glow.js`: OK.
- JSON parse: `data/tool-map.json`, `data/cta-map.json`, `data/program-catalog.json`: OK.
- CSS line-count gate: all CSS files <= 375 lines.
- Shared nav hash: 31 HTML pages, 1 unique `<nav>` block.
- Local refs and hash anchors: 0 missing; nested anchors: 0.
- Encoding/artifact scan: no `????`, escaped-quote artifacts, or literal `` `r`n `` artifacts.
- Touched main sections avoid visible `BUFF IT` body text outside logo/header context.
- HTTP smoke: 31/31 HTML pages returned 200.
- Browser/CDP overflow check: 10 changed pages x mobile/desktop = 20/20 clean, saved to `test-results/site-rework-p1-20260528/checks.json`.

### Next
- Add exact bot result messages and wire bot storage/analytics to `data/cta-map.json` start params.
- Add proof assets: APP screenshots, bot flow screenshots, CALLS/FOOD/GUIDE/HEALTH visuals, real client cases.
- Deepen program-specific proof and objections after assets are available.
## Update -- 2026-05-28 Bot Source Tracking Contract

### Done
- Confirmed the site CTA map now has a real bot-side receiver for attribution: `YokhanGymBot` preserves `/start buffit_*` through quiz FSM clearing.
- Updated `data/cta-map.json` with bot implementation status: `quiz_leads.source`, `quiz_started/quiz_completed data.source`, trainer brief source visibility, and remaining product gap.
- Added `docs/BOT_RESULT_MESSAGE_MATRIX_20260528.md` as the copy contract for post-bot routes: hot-fit, warm-fit, not-ready, diy-budget, medical-red-flag, food-barrier.
- Updated `docs/CTA_SOURCE_PARAM_MAP_20260528.md` and `_reference/tool-registry.md`.

### Verified
- `data/cta-map.json`, `data/tool-map.json`, `data/program-catalog.json`: JSON parse OK.
- Bot focused check in `YokhanGymBot`: `tests/test_source_tracking.py` passed 3 tests.

### Next
- Build the general BUFF IT route picker / source-aware entry screen in `YokhanGymBot`; current bot still primarily behaves as a spine diagnostic, which is now the main receiver mismatch for broad program traffic.

## Update -- 2026-05-29 Bot Route Picker Receiver

### Done
- Updated `data/cta-map.json` to reflect the new bot-side BUFF IT route picker.
- Updated `docs/CTA_SOURCE_PARAM_MAP_20260528.md` and `docs/BOT_RESULT_MESSAGE_MATRIX_20260528.md`: broad site CTAs now have a real source-aware receiver, not only source tracking.
- Bot-side focused checks passed in `YokhanGymBot`: compile OK and 11 tests passed for source tracking + route picker + start parser guard.

### Next
- Live smoke is done for `buffit_glutes` and `buffit_guide`; next bot-side work is route-specific diagnostics/results for the remaining CTA intents.
- Then deepen post-picker route-specific diagnostics/results and proof assets on the site.
## Update -- 2026-05-29 Bot receiver live

- Landing CTA receiver status changed from local-only to live: `@YokhanGym_bot` now accepts broad `buffit_*` source params with a route picker.
- Smoked via Telegram Web: `buffit_glutes` and `buffit_guide` both render the expected route-specific entry and preserve source in server logs.
- End-to-end bot smoke also passed for `buffit_health_check`: route picker -> spine quiz completion -> trainer notification -> SQLite lead with `source=buffit_health_check`.
- Next landing/content work can assume bot entry exists; remaining gap is route-specific diagnostic/result depth after the first selector.

## Update -- 2026-05-29 Bot route links

### Done
- Updated `data/cta-map.json`: every landing start param is covered by bot context or alias, and post-picker route results now include direct site links where useful.
- Confirmed the live bot path for `programs.html` traffic: `/start buffit_program_picker` -> `Вес и питание` -> `Питание и корзина` -> `https://yokhanfitness.ru/nutrition.html`.
- Current landing/content work can assume the Telegram receiver is not a dead end for broad program traffic.

### Next
- Return to page depth: stronger route pages, proof assets, objections, diagnostics copy, and tool screenshots.
- Bot-side next layer is richer route-specific diagnostics/results after the selector, not more generic receiver plumbing.
## Update -- 2026-05-29 Bot readiness layer

### Done
- Updated `data/cta-map.json`: bot implementation now includes the first readiness classifier after the route selector.
- New bot result layer covers hot-fit, warm-fit, not-ready, diy-budget, medical-red-flag, and food-barrier.
- Landing/content can now treat the bot as a two-step receiver: goal route first, then readiness/blocker result.

### Next
- Add proof assets and stronger page-level objections for the same six result routes.
- Deeper multi-question diagnostics should be added only for routes where the simple readiness layer is too coarse.
## Update -- 2026-05-29 Bot readiness live

### Done
- `data/cta-map.json` now records the readiness layer as live-smoked, not local-only.
- Confirmed live path: `buffit_program_picker` -> `Вес и питание` -> `Уточнить следующий шаг` -> `Питание мешает` -> `nutrition.html`.

### Next
- Mirror the six bot outcomes on the site: hot-fit, warm-fit, not-ready, diy-budget, medical-red-flag, food-barrier.
- Priority content gap is proof/assets and objections, not another generic CTA map pass.

## Update -- 2026-05-29 Live landing + DIY budget offer

### Done
- Updated `self-training.html` from future waitlist to a current one-time consultation offer: 5–8k, science-based program, one correction after a week.
- Updated `data/cta-map.json`, `docs/CTA_SOURCE_PARAM_MAP_20260528.md`, and `docs/BOT_RESULT_MESSAGE_MATRIX_20260528.md` so the `diy-budget` route no longer points to a waitlist.
- Published the current multipage landing assets to `/var/www/yokhan-landing`; previous live site backup: `/var/www/yokhan-landing.backup-20260529162404`.
- Public `self-training.html` now exists as its own page instead of falling back to the old index page.

### Verified
- Static check: 31 root HTML pages, 0 missing local refs.
- JS syntax: `js/nav-menu.js`, `js/nav-state.js`, `js/pointer-glow.js` OK.
- JSON parse: `data/cta-map.json`, `data/program-catalog.json`, `data/tool-map.json` OK.
- Public checks: `/`, `/self-training.html`, `/programs.html`, `/guide.html`, `/nutrition.html` return HTTP 200.
- Public `self-training.html` contains `Разовая консультация`, `5–8к`, `Запросить разбор`, and `Программа без хаоса`.

### Next
- Continue page depth around the six bot outcomes: hot-fit, warm-fit, not-ready, diy-budget, medical-red-flag, food-barrier.
- Add proof/assets and stronger objection handling per route; do not spend more time on generic receiver plumbing unless a live path breaks.

## Update -- 2026-05-29 Six outcome site layer

### Done
- Mirrored the six bot readiness outcomes on the public site: hot-fit, warm-fit, not-ready, diy-budget, medical-red-flag, and food-barrier.
- `start.html` and `bot.html` now show a post-bot outcome map that sends people to the right next page instead of dropping them into one generic path.
- Target pages now carry route-specific sections: `programs.html`, `calls-access.html`, `guide.html`, `self-training.html`, `health.html`, and `nutrition.html`.
- Updated `data/cta-map.json`, `docs/CTA_SOURCE_PARAM_MAP_20260528.md`, and `docs/BOT_RESULT_MESSAGE_MATRIX_20260528.md` so bot, site, and docs share one outcome contract.
- Published the updated landing to `/var/www/yokhan-landing`; previous live backup: `/var/www/yokhan-landing.backup-20260529180755`.

### Verified
- JS syntax: `js/nav-menu.js`, `js/nav-state.js`, and `js/pointer-glow.js` OK.
- JSON parse: `data/cta-map.json`, `data/tool-map.json`, and `data/program-catalog.json` OK.
- Static refs: 31 root HTML pages, 0 missing local refs.
- Shared nav hash: 31 HTML pages, 1 unique `<nav>` block.
- Outcome markers: both entry pages have `data-outcome-map="post-bot"`; all six target pages have the expected `data-outcome` marker.
- Visible copy scan: no route IDs like `hot-fit`, `diy-budget`, `source-param`, or `lead` leak into customer-facing text.
- Browser smoke passed on desktop and mobile for entry/target pages; screenshots saved under `test-results/outcome-sections-20260529/`.
- Public HTTPS checks passed for `/start.html`, `/bot.html`, `/programs.html`, `/calls-access.html`, `/guide.html`, `/health.html`, `/nutrition.html`, and `/self-training.html`.

### Next
- Add owned proof assets per route: bot screenshots, app screenshots, calls flow, smartcart/food examples, guide previews, health/safety material previews, and real client cases when available.
- Deepen objections and evidence on program pages after proof assets exist.
- Avoid more generic funnel plumbing unless a live path breaks.

## Update -- 2026-05-29 Content/product system pass

### Done
- Reworked `coaching.html` from stale 3500 RUB / 4-8-12 sessions copy into the current offer: 12 weeks, optional 16, 2+DZ or 3/week, launch prices 26k/34k, later 32k/42k, free diagnostics during launch.
- Updated `training.html`, `app.html`, `ecosystem.html`, `links.html`, and `programs.html` so `self-training.html` is a current one-time 5-8k consultation route, not a waitlist-only future product.
- Updated `data/cta-map.json`: all high-level site `buffit_*` starts are represented, and `self-waitlist` was normalized to the current `self-consult` meaning while keeping the live start param.
- Updated route/product docs that still referenced waitlist-only self-training or old 4/8/12 pricing.
- Updated `YokhanGymBot/handlers/buffit_route_catalog.py` so high-level site sources (`buffit_home`, `buffit_programs`, `buffit_fitness`, `buffit_coaching`, `buffit_coach`, `buffit_men`, `buffit_women`) get source-aware Telegram context instead of falling into generic copy.
- Published the landing to `/var/www/yokhan-landing`; backup: `/var/www/yokhan-landing.backup-20260529185740`.
- Published bot catalog to `/var/www/yokhan-fitness/YokhanGymBot`; backup: `/var/www/yokhan-fitness/backups/YokhanGymBot-20260529185838`.

### Verified
- Landing JS syntax: `js/nav-menu.js`, `js/nav-state.js`, `js/pointer-glow.js` OK.
- Landing JSON parse: `data/cta-map.json`, `data/tool-map.json`, `data/program-catalog.json` OK.
- Landing refs: 31 root HTML pages, 0 missing refs, 1 shared nav hash.
- All HTML `start=buffit_*` params are covered in `data/cta-map.json` and in bot source context or alias.
- Visible HTML scan: no route IDs, source-param, lead, old `3500`, old `4/8/12`, or waitlist-only budget phrasing leaks to customer-facing text.
- Browser smoke: `coaching.html`, `training.html`, `app.html`, `programs.html` clean on desktop; `coaching.html` and `training.html` clean on mobile, `overflowX=0`.
- Bot compile OK and focused gate passed: `py -3 -m pytest tests/test_source_tracking.py tests/test_buffit_route_picker.py -q` -> 20 passed.
- Live `yokhan-telegram-bot` rebuilt and is healthy; remote file contains the new source contexts.
- Public HTTPS checks passed for `coaching.html`, `training.html`, `app.html`, `programs.html`, and `self-training.html` with new prices/self-consult copy and no old offer text.

### Next
- Continue content depth on segment pages and route pages: sharper objections, clearer page-specific CTAs, and better page-end decisions.
- Proof screenshots/assets remain later, after content/structure are stable.


## Update -- 2026-05-29 Product matrix and program depth pass

### Done
- Added `data/product-matrix.json` and `docs/BUFFIT_PRODUCT_MATRIX_20260529.md` as the current product/route matrix.
- Added `PROJECT_SPEC.md` for the landing project so future work does not start blind.
- Deepened all `program-*.html` pages: route-specific 12-week phases, outcomes, objections, and tool-fit blocks.
- Added a product matrix section to `programs.html`, a 12-week after-payment timeline and objection section to `coaching.html`, and a product ladder to `training.html`.
- Corrected `men.html` and `women.html`: current public sale is coach-led; self-start is a separate one-time 5-8k consult, not a parallel full product.
- Deployed public `*.html` and `data/*.json` to `/var/www/yokhan-landing`; backup before deploy: `/var/www/yokhan-landing.backup-20260529201937`.

### Verified
- JS syntax OK for nav scripts.
- JSON parse OK for `cta-map`, `tool-map`, `program-catalog`, and `product-matrix`.
- Encoding scan: no BOM, no `????`, no replacement chars in touched content files.
- Static refs: 31 root HTML pages, 0 missing refs, 1 shared nav hash.
- CTA coverage: all visible `start=buffit_*` params are present in `data/cta-map.json`; product matrix start params are covered too.
- Visible text scan: no old 3500/4-8-12/waitlist-only copy and no technical route IDs leaked.
- Browser smoke on current local files: `programs`, `coaching`, `training`, `program-weight-loss`, `program-glutes`, mobile glutes overflow all clean.
- Public HTTPS checks passed for `programs.html`, `coaching.html`, `training.html`, `program-weight-loss.html`, and `program-glutes.html` with new markers present and old markers absent.

### Next
- Stronger proof layer: screenshots/assets/cases for APP, FOOD, CALLS, GUIDE, HEALTH and route-specific evidence.
- Later visual QA/screenshots after proof/content is stable.

## Update -- 2026-05-30 Proof/trust layer

### Done
- Continued from the product matrix into the BUFF IT proof/trust layer without touching the header/dropdown system.
- Added `data/proof-map.json` and `docs/BUFFIT_PROOF_ASSET_PLAN_20260530.md` as the current proof contract: route proof, asset backlog, safe claim rules, and source links.
- Updated `programs.html`, `coaching.html`, `training.html`, `method.html`, `app.html`, `calls-access.html`, `nutrition.html`, `guide.html`, and `health.html`.
- Corrected `programs.html` matrix labels to use the route labels from `data/product-matrix.json`.
- Added honest proof blocks: what can be checked before payment, what the coaching process shows, why this is not a marathon, source-backed method framing, and service-specific proof placeholders.
- Avoided fake cases and medical-treatment promises; `health.html` now says the route does not diagnose and directs red flags away from normal sales pressure.
- Deployed changed public HTML plus `data/proof-map.json` to `/var/www/yokhan-landing`; backup before deploy: `/var/www/yokhan-landing.backup-20260530065413`.

### Verified
- JS syntax OK: `js/nav-menu.js`, `js/nav-state.js`, `js/pointer-glow.js`.
- JSON parse OK: `data/cta-map.json`, `data/tool-map.json`, `data/program-catalog.json`, `data/product-matrix.json`, `data/proof-map.json`.
- Encoding scan OK: UTF-8, no BOM, no `????`, no replacement chars in touched public content.
- Static refs OK: 31 root HTML pages, 0 missing local refs.
- Shared nav loading OK: every root HTML page includes `js/nav-menu.js` exactly once.
- CTA coverage OK: all visible `start=buffit_*` params are covered in `data/cta-map.json`.
- Copy scan OK: no old `3500`, old `4/8/12`, waitlist-only budget language, or banned medical-promise terms in public HTML.
- Chrome smoke OK: `programs.html`, `coaching.html`, `method.html`, `app.html`, `health.html`; desktop and mobile overflow checks clean.
- Public HTTPS checks OK for changed HTML pages: `programs.html`, `coaching.html`, `training.html`, `method.html`, `app.html`, `health.html`.

### Discovery
- Direct public `/data/*.json` URLs currently rewrite to the HTML app shell even though the JSON files exist under `/var/www/yokhan-landing/data/`. This is not blocking because the site does not fetch these maps, but check nginx/server routing before treating `data/*.json` as public API or public downloadable assets.

### Next
- Collect real proof assets: bot screenshots, week-plan/app screenshots, CALLS flow, FOOD/smartcart examples, guide preview, health/safety preview, and 2-3 permissioned client cases.
- Replace placeholder proof cards with actual visual proof once assets exist.

## Update -- 2026-05-30 Public JSON permissions fix

### Done
- Fixed the live `/data/*.json` issue discovered after the proof/trust deploy.
- Root cause was not nginx routing: `/var/www/yokhan-landing/data` had `700 root:root` permissions after tar extraction, so nginx could not traverse it and fell back to `index.html`.
- Normalized live permissions under `/var/www/yokhan-landing`: directories `755`, files `644`.

### Verified
- Origin check with `Host: yokhanfitness.ru`: `/data/proof-map.json` returns `200 OK`, `Content-Type: application/json`, and the JSON body.
- Public HTTPS checks now pass for `data/proof-map.json`, `data/cta-map.json`, `data/product-matrix.json`, `data/program-catalog.json`, and `data/tool-map.json`.

### Next
- Keep the permission normalization step in future tar deploys, especially when a new public directory is introduced.

## Update -- 2026-05-30 Public BUFF IT smoke check

### Done
- Added `scripts/check-public-buffit.py` as a reusable public smoke check for the current BUFF IT landing contract.
- The check validates key public HTML markers, rejects old/stale offer markers, and verifies that all public `data/*.json` maps return `application/json` and parse as JSON.

### Verified
- `py -3 -m py_compile scripts/check-public-buffit.py`
- `py -3 scripts/check-public-buffit.py --base-url https://yokhanfitness.ru/` -> `public_check_ok`.
- Encoding/size sanity: 122 lines, no replacement chars, no `????`.

### Next
- Run this check after every tar/scp deploy, especially after adding or replacing files under a new public directory.

## Update -- 2026-05-30 Hero asset public fix

### Done
- Browser audit found the public home page loading `assets/buffit-hero-home-training.png` with 404.
- Local file existed, but `/var/www/yokhan-landing/assets` was missing on the server because recent deploys uploaded HTML/data without the assets directory.
- Created `/var/www/yokhan-landing/assets`, uploaded `buffit-hero-home-training.png`, and set public permissions.
- Updated `scripts/check-public-buffit.py` so the public smoke check verifies the critical hero PNG as `image/png`.

### Verified
- Origin check: `/assets/buffit-hero-home-training.png` returns `200 OK`, `Content-Type: image/png`.
- Public check: `py -3 scripts/check-public-buffit.py --base-url https://yokhanfitness.ru/` -> `public_check_ok`.
- Fresh isolated Chrome context: image network request returns 200, console clean, desktop/mobile overflow clean.
- Screenshots saved: `test-results/site-audit-20260530-home-desktop-fixed.png` and `test-results/site-audit-20260530-home-mobile-fixed.png`.

### Next
- Keep asset checks in deploy QA. If more local/owned images are introduced, add them to `ASSET_CHECKS`.

## Update -- 2026-05-30 Site audit final pass

### Verified
- Public smoke: `py -3 scripts/check-public-buffit.py --base-url https://yokhanfitness.ru/` -> `public_check_ok`.
- Public HTML sweep: all 31 root HTML pages return `200` with `text/html`.
- Local full static sweep: JSON parse, local `href`/`src`, CSS `url(...)`, and UTF-8 markers all clean.
- Browser fresh isolated context: home page has no console errors, hero asset returns 200, desktop/mobile overflow clean.

### Result
- No remaining blocking site-check issues found in this pass.
- The next meaningful work is content/asset depth: real screenshots/cases and replacing placeholder proof cards.

## Update -- 2026-05-30 BUFF IT content batch 01

- First isolated BUFF IT content batch was prepared in `YokhanFitnessLanding/docs/BUFFIT_CONTENT_BATCH_01_PROGRAMS_20260530.md`; no HTML was changed.
- Scope for review: program router plus `Похудеть навсегда`, `Топ ягодицы`, and `Подготовить тело к новому образу`.
- The batch follows the agreed workflow: first logic, critique through marketing/Ilyakhov lenses, "ясно-понятно" rewrite, CTA routing, risks, and image briefs.
- If approved, implement this batch before assigning the next page group.

## Update -- 2026-05-30 BUFF IT content batch 01 v2

- Rewrote the first isolated BUFF IT content batch after user critique that v1 was weak, stale, and not Russian enough.
- New draft replaces abstract wellness/translated phrasing with direct Russian sales promises: `Похудеть без отката`, `Ягодицы, которые видно в джинсах`, and `Тело под новый образ`.
- The review doc now includes explicit v1 failure analysis, forbidden phrase list, stronger headline options, recommended page copy, CTA routing, risks, and image briefs.
- HTML remains untouched until Igor approves the corrected content direction.

## Update -- 2026-06-06 BUFF IT ID entry and SSO smoke

### Done
- Added the public BUFF IT ID entry page: `account.html`.
- Added `Войти` to the shared landing header and footer across root HTML pages.
- Added `css/account-system.css` and `data/sso-map.json` for the public SSO service map.
- Updated `scripts/check-public-buffit.py` to smoke `account.html`, `data/sso-map.json`, Keycloak discovery, SmartCart, CALLS, Guide, Photo, Telegram, Cloak, Naive, and expected parked APP `503`.
- Deployed the landing update to `/var/www/yokhan-landing` on `83.217.200.15`; normalized directories `755` and files `644`.

### Verified
- `py -3 scripts/check-public-buffit.py --base-url https://yokhanfitness.ru/` -> `public_check_ok`.
- Browser desktop and mobile checks on `https://yokhanfitness.ru/account.html`: no horizontal overflow, `Войти` visible, mobile menu opens, cards are not clipped.
- Screenshots: `test-results/account-sso-public-desktop.png`, `test-results/account-sso-public-mobile-menu.png`.

### Remaining
- `app.yokhanfitness.ru` is intentionally parked at `503` until the app is deployable.
- SmartCart and CALLS are live and marked connected to BUFF IT ID; keep testing real login/callback with user sessions.
- Guide, Photo, and Telegram are public-live but still need app-side OIDC migration before claiming full unified account behavior.

## Update -- 2026-06-10 Homepage service UX flow

### Done
- Made the homepage ecosystem section expose the visible BUFF IT service library directly: FITNESS, HEALTH, APP, CALLS, FOOD, GUIDE, and GATES.
- Added the existing button pattern under the service cards: `Открыть личный Hub` -> `/hub/` and `Все входы` -> `links.html`.
- Updated `account.html` so its primary user-facing account action opens `/hub/`, not the Keycloak account console.
- Added GATES to `account.html`, `links.html`, and `data/sso-map.json`.
- Deployed only selected landing files to `/var/www/yokhan-landing`; backup: `/var/www/yokhan-landing.backup-ux-flow-20260610T150447Z`.

### Verified
- Local `py -3 scripts\check-public-buffit.py --base-url http://127.0.0.1:8082/` -> `public_check_ok`.
- Public `py -3 scripts\check-public-buffit.py --base-url https://yokhanfitness.ru/` -> `public_check_ok`.
- Live markers present on `/`: `BUFF IT FOOD`, `BUFF IT GUIDE`, `BUFF IT GATES`, `/hub/gates`, `Открыть личный Hub`.
- Live headless Chrome desktop/mobile: `/`, `/nutrition.html`, `/account.html`, `/hub/`, and `/hub/gates` have no horizontal overflow.
- Live scan: no visible `VPN`, `/vpn`, or `vpn` text in landing HTML or Hub source.

### UX Contract
- From homepage: service pages are one click; Hub is one click; GATES is one click.
- From service pages: brand returns home in one click; header login goes to BUFF IT ID in one click.
- From Hub/GATES: brand returns to public homepage; `Все сервисы` returns to Hub library.

## Update -- 2026-06-12 Homepage sedentary-work positioning

### Done
- Reframed the homepage hero around BUFF IT as a system of training, food and life rhythm for people with sedentary work.
- Added the core goal set into the first screen: body transformation, sustainable weight loss, healthy back, soft start, advanced training.
- Reworked the grounded proof section to say "I am the same" through concrete reality: screen work, stiff neck/back, meals between tasks, and limited calendar.
- Reworked the method feature into a 3-month roadmap: remove chaos, build rhythm, lock in the result.
- Replaced the generic daily cards with a 7-day week infographic: strength, back/steps, food, technique, CALLS/chat, long activity, weekly plan.
- Added `css/home-flow.css` for the new home-only week/goal composition and `tasks/goal.md` as the current product contract.
- Updated `docs/image-orders/README.md` with the current product contract so future images stay grounded in sedentary-work reality, not gym stock.
- Deployed selected public files to `/var/www/yokhan-landing`; backup: `/var/www/yokhan-landing.backup-sedentary-20260612T195259Z`.

### Verified
- Local landing served on `http://127.0.0.1:8082/index.html` -> 200.
- Headless Chrome desktop/mobile screenshots created in `test-results/buffit-smoke-20260612-191400/`.
- Local scan found no visible `VPN`/`vpn` text in landing HTML/CSS or Hub source.
- `git diff --check` clean for touched landing files; only existing LF/CRLF warning on `index.html`.
- Public `py -3 scripts\check-public-buffit.py --base-url https://yokhanfitness.ru/` -> `public_check_ok`.
- Live `https://yokhanfitness.ru/` contains the new sedentary-work positioning and no visible `VPN`/`vpn` text.
# Plan — 2026-07-13 Homepage mobile UI + real design-system consumer gate

PROGRESSIVE_STATUS
- First useful view: mobile header, hero and first action at 320–430px without clipped content or competing header CTA.
- Sharpened evidence: real `index.html` geometry/touch/focus checks plus design-system Storybook gates.
- Rough edges: existing dirty homepage copy and 70svh hero direction stay intact; production deploy is outside this local implementation slice.
- Replan trigger: a canonical design-system fix would overwrite an intentional landing-only product decision or break `/coach/ -> /coaching.html -> bot`.

User wants: максимально улучшить UI сайта по результатам аудита, начиная с кривой мобильной главной и реальной связи с контрактами Storybook/design system.

Success means: главная сохраняет продуктовый маршрут, на 320–430px шапка, hero, карточки и действия не выходят за viewport; в шапке один вход, основное «Начать» остаётся в контенте; клавиатурный фокус управляем; regression-gate проверяет настоящий `index.html`, а не только отдельную Storybook-композицию.

I will verify by: локальный Chromium на контрольных viewport, проверки overflow/touch/focus/first-screen/card-density, focused landing checks, design-system validate/layout gates, UTF-8/text policy и визуальные снимки до/после.

Goal -> Constraints -> Approach -> Verification -> Risk/Doubt:

- Goal: сделать мобильную главную устойчивой и превратить Storybook из параллельной витрины в проверяемый контракт реального consumer.
- Constraints: два dirty-репозитория; не сбрасывать пользовательские изменения; сохранить 70svh hero и acquisition path; визуальные значения только через токены.
- Approach: один владелец публичной шапки; убрать вторую header CTA; исправить геометрию/фокус; снизить мобильную плотность без удаления маршрутов; добавить consumer manifest и CDP-check реальной страницы; затем синхронизировать DS contract/gates.
- Alternative considered: оставить две CTA и уменьшить их. Отклонено: сохраняет конкуренцию действий и ломает минимальный touch target.
- Verification: focused static/DOM checks -> local rendered viewports -> DS contract/layout checks -> project text/progressive checks.
- Risk/Doubt: landing и DS сейчас расходятся; синхронизация будет точечной, без слепого копирования и без заявления о production deploy.

Scope:

1. Header contract: один login target, 3-column mobile grid, bounded panel, 44px navigation targets.
2. Navigation behavior: русская accessible label, focus enters menu, Escape/outside close restores focus.
3. Homepage hierarchy: full-width mobile hero actions, responsive headings, compact product cards/route density.
4. Media: responsive self-hosted hero derivative with fallback and stable sizing.
5. Consumer contract: pinned DS adoption record plus automated real-landing geometry/interaction check.
6. DS hardening: canonical public-header/mobile-target fixes and geometry gate coverage for generic links.

Out of scope: deployment, redesign of `/coach` funnel, fabricated proof/media, unrelated Day Route or auth implementation.

Rollback: revert only the exact hunks/files listed in this plan; no reset/stash/checkout of dirty worktrees.

Result:

- Mobile header now has one visible `Войти` target plus hamburger, a bounded 3-column layout and no masked overflow from 320 through 768px.
- Opening the menu moves focus to the first trigger; Escape closes the panel and returns focus to the hamburger. Menu labels and `aria-controls` are localized and explicit.
- Hero keeps the accepted 70svh art direction but now has one filled CTA, one quiet text link and one proof line. The former tablet-only product aside was removed.
- Seven full-height service cards became three primary route cards plus a compact existing `route-mini` rail; mobile product copy and headings use the smaller semantic type role. The repeated investment metrics and intermediate CTA were removed; the week map remains but uses compact rows.
- Hero media now serves 23–26KB AVIF or 38–47KB WebP derivatives with the 1.89MB PNG only as fallback. The homepage rendered check observes no Unsplash resource requests.
- `contracts/design-system-consumer.json` pins DS version/current source hashes, ownership, adapters and verification. `scripts/check-home-layout.mjs` runs 12 closed/open cases across 320/360/390/430/768/1440 plus mobile/desktop keyboard focus.
- DS now has matching header/account/dropdown geometry, a real mobile-open Storybook story, generic navigation-link touch checks and a reusable plain-document CDP runtime.
- Verification: landing consumer gate green; DS validate/build green; geometry 269 stories / 624 viewports / 22,278 assertions / 0 warnings; rendered tokens 240 stories / 88,750 assertions; 18 visual baselines green.

Residual: implementation is local only; production was not deployed. Real iOS Safari and Android Chrome device testing remains the release-stage check.

# Plan — 2026-07-14 Mobile hero full-bleed correction

User wants: убрать декоративные поля первого блока на мобильном, где рамка съедает полезную ширину и ухудшает crop.

Success means: до `42.5rem` homepage hero background идёт от края до края, сохраняя системное нижнее скругление без цветного технического зазора; header и hero content сохраняют token-derived safe inset; tablet/desktop frame не меняется.

Approach: точечный `.home-page` override в существующем `home-flow.css`; общий hero-shell и другие страницы не затрагивать. Альтернатива — сделать весь мобильный hero-shell full-bleed глобально — отклонена из-за лишнего blast radius.

Verification: rendered gate 320/360/390/430/768/1440, сравнение геометрии stage/content/header и свежий mobile screenshot. Replan trigger: edge-to-edge фон ухудшает читаемость или создаёт horizontal overflow.

Result:

- Homepage hero is full-bleed through `42.5rem`; horizontal and bottom shell padding are removed only in that range, while the tokenized bottom radius and shell shadow remain intact.
- The hero background now matches the following cream section, so the rounded corners transition cleanly without the former 16px page-background strip.
- Header and hero content keep their existing token-derived safe insets; 768px and desktop retain the framed shell.
- The real-page gate now asserts both sides of the responsive contract: edge-to-edge plus retained bottom radius and no separator gap at 320–430px, and visible frame at 768/1440px.
- `buffit_home_layout_ok cases=12 keyboard=2 viewports=6`; fresh 390px and 1440px renders visually checked.

Metrics: UI correction, XS / MEDIUM risk; 4 files changed; one DESIGN_DISAGREEMENT rework after the initial override removed more of the shell contract than requested. Confidence HIGH from computed geometry and fresh Chromium renders. Remaining doubt: native iOS Safari corner/shadow rasterization is not device-tested.

# Plan — 2026-07-14 Mobile section seam and sticky-header regression

User wants: убрать оставшиеся цветные полосы между мобильными секциями и вернуть внутренние боковые отступы хедера.

Success means: на 320–430px full-bleed feature media начинается сразу после предыдущей секции без frame-полосы; видимая sticky-header pill владеет token-derived внутренним padding; top/solid/open состояния не переполняются и не меняют состав действий.

Approach: исправить двух владельцев контракта — мобильный `.pdp-feature` в landing и мобильный `.nav__inner` одновременно в canonical DS и landing-adapter. Альтернатива с локальными отрицательными margin отклонена: она скрывает padding, ломает box ownership и оставляет дефект в Storybook-контракте.

Verification: computed section boundaries and header geometry at 320/360/390/402/430/768/1440; closed/open/solid states; landing consumer gate; DS rendered site-header gate; screenshots без DevTools overlay.

Risk: header является общим для публичных страниц. Rollback — только точечные mobile padding hunks и соответствующие regression assertions.

Result:

- Real root cause removed: `.home-page .pdp-feature` no longer exposes the 20px frame background at full-bleed widths through `42.5rem`; tablet/desktop framing remains unchanged.
- Mobile header controls now keep `--space-half` inside the canonical pill plus the existing shell inset, placing brand and menu on the 24px content line without 320px collisions.
- Canonical DS and the pinned landing adapter match; the consumer source hash was refreshed. The DS rendered gate now checks mobile solid-header inset, collisions and horizontal overflow.
- Landing gate: `cases=12 keyboard=2 viewports=6`. Full DS gate: 269 stories / 624 viewports / 22,278 geometry assertions / 0 warnings; 88,727 rendered assertions; visual baseline 18/18.
- Fresh no-overlay evidence: `home-mobile-390.png` and `home-mobile-feature-boundary-402.png`. Scoped text policy and diff checks pass.

Metrics: responsive bugfix, S / HIGH routed risk; 9 landing files and 3 DS files in the verified scope. Correction type: TECHNICAL_BUG + broken consumer/canonical contract. One replan corrected the mobile/tablet breakpoint after the first gate exposed a 768px scope mismatch. Confidence HIGH; remaining doubt is native-device Safari/Chrome rasterization before production deploy.
# Update — 2026-07-19 SEO slice 01: organic handoff live

- Published a privacy-preserving Google/Yandex referrer handoff on `/coaching.html`: organic CTA source is `buffit_coaching_seo`, while direct/internal traffic remains `buffit_coaching`.
- Deployed only `coaching.html`, `data/cta-map.json`, and `js/coaching-source.js`; backup: `/var/backups/yokhan-landing/20260719032039`.
- Public verification: SEO contract `0 failure(s)`, BUFF IT smoke `public_check_ok`, all three public file hashes match local, IndexNow accepted 9 URLs with HTTP `200`.
- SEO outcome is not claimed. The exact query, baseline position, top-10, organic click, consultation, and commercial disposition are still unproven.
- Next gate: connect Chrome with Wordstat, Google Search Console, and Yandex Webmaster open; record Russia frequency and current `/coaching.html` index/position before another SEO edit.

# Plan — 2026-07-19 SEO slice 02: exact online-trainer intent

- User wants: по запросам о персональном фитнес-тренере онлайн приводить нового клиента на действующий формат Игоря, не снижая цену и не создавая больше записей, чем он может провести.
- Success means: поисковый посетитель на первом экране сразу понимает, что тренировки проходят лично с Игорем по видеосвязи, видит частоту и цену, а органический CTA сохраняет источник `buffit_coaching_seo` до консультации и коммерческого исхода.
- Current bounded step: заменить абстрактное описание первого экрана на точное подтверждение поискового намерения; не добавлять новую секцию, карточку, CTA или визуальный слой.
- Truth boundary: бесплатная 25-минутная тренировка и 14-дневная программа не публикуются на SEO-странице, пока в боте нет будущих слотов, а production APP не принимает Telegram identity callback.
- Verification: локальный SEO-контракт, BUFF IT smoke, desktop/mobile render без горизонтального переполнения, неизменные цены и CTA source, затем точечный deploy с backup и публичной сверкой.
- Replan trigger: после индексирования страница получает показы без кликов, запросы смещаются в обучение профессии или бесплатный вход становится полностью доступен и проверен живым пользователем.

Result:

- На production `/coaching.html` первый экран прямо подтверждает коммерческий интент «Персональный фитнес-тренер онлайн» и объясняет формат живых тренировок по видеосвязи с немедленной коррекцией техники.
- Срез не добавил секций, CTA или визуального шума; цены 26 000 / 34 000 ₽ и источник органического CTA `buffit_coaching_seo` сохранены.
- Публичные SEO-контракт и BUFF IT smoke прошли. SHA-256 локального и production-файла совпадает: `f5a24b7c34a9437f29d2a27842d07bb1527138210bbe6ec86b162e4aa5625141`.
- Desktop 1440 px и mobile 390 px проверены в браузере: canonical верный, точный интент и обещание видеосвязи присутствуют, горизонтального переполнения нет; на мобильном обе hero-кнопки помещаются на первом экране.
- Точечный IndexNow для `/coaching.html` принят с HTTP `202`. Backup деплоя: `/var/backups/yokhan-landing/seo-slice-02-20260719074354`.
- Бесплатный вход не опубликован: в боте нет будущих слотов, production APP возвращает `404` на Telegram identity callback. Это продуктовый блокер следующего слоя, а не причина размывать текущий SEO-интент.
- SEO-результат не заявлен. Следующий gate: новый обход и индексирование URL, затем реальная позиция и показы по `фитнес тренер онлайн`; после первого показа — CTR, после клика — консультация и коммерческий исход.

Metrics: SEO/conversion slice, S / MEDIUM risk; 3 intentionally touched artifacts; local and public SEO/smoke, hash, desktop/mobile geometry and exact-URL IndexNow checks passed. Two submission-command corrections were needed before the successful HTTP `202`. Confidence HIGH for publication and rendered contract, MEDIUM for search effect; remaining doubt is crawl timing and ranking response.

# Update — 2026-07-22 Ceramic media system

- Removed the dark-on-dark visual base: black and near-black surfaces are no longer semantic backgrounds; media contrast uses directional cream ceramic washes and warm-brown copy.
- Rebuilt the homepage hero as responsive desktop/mobile art with a grounded work-life fitness scene. Product routes and the 3-month roadmap now use visible local imagery instead of flat placeholder fills.
- Added six semantic media roles: women strength, men capability, safe return, food rhythm, guide materials and APP in use. Twenty-eight public pages select a role through `audience-hero-page` body contracts rather than page-specific CSS copies.
- Rebuilt coaching hero and live-training proof with Igor's supplied identity references, light clothing, a continuous resistance loop and visible video-call context. `/coach/` now uses the same light proof world.
- Filled desktop menu lead cards by category; mobile menu stays compact. Increased the desktop panel contract so quick links are not clipped.
- Replaced all remote Unsplash token fallbacks with self-hosted AVIF/WebP assets. Added `scripts/check-audience-media.mjs`, covering six representative routes at 390 and 1440 plus ceramic token regressions.
- Verified: `audience_media_ok pages=6 viewports=2`; `coaching_layout_ok viewports=7`; `buffit_home_visual_ok` with fresh desktop/mobile/menu evidence; no Unsplash URLs remain in CSS.
- Residual gate: `scripts/check-home-layout.mjs` stops before UI assertions because the pinned design-system runtime hash expects `3b78c6…`, while the current sibling runtime is `79d705…`. The consumer snapshot was not silently repinned. No production deployment was performed.

# Update — 2026-07-22 Creative route and technique repair

- Homepage hero now has separate desktop/mobile compositions built around Igor rather than a detachable portrait or a category stock scene.
- The 12-week program is represented by the code-native `LandingRouteMap`: a winding route, checkpoints and destination replace first-order fitness photography.
- Coaching proof now uses a neutral calibration scene. No exercise pose is shown, so the rejected lumbar-extension frame cannot communicate unsafe technique.
- Media ownership is placement-based for `home.hero`, `home.roadmap` and `coaching.trainer-proof`; identity, responsive pair and technique approval are executable contract fields.
- Local gates passed: media role contract, 11-component landing ownership, homepage at six viewports, audience media at two viewports and coaching at seven viewports.
- Released 14 allowlisted HTML/CSS/image files only; backup `/var/backups/yokhan-landing/creative-media-v7-20260722-150344`. Public smoke, 14/14 server hashes, eight image MIME checks, mobile renders and excluded browser-profile `404` passed.

# Plan — 2026-07-22 Semantic media differentiation repair

User wants: изображения должны различать продуктовые направления и помогать навигации без чтения подписей; упражнения должны выглядеть технически правдоподобно, а не как случайная фитнес-поза.

Success means: шесть основных ролей различаются минимум по четырём параметрам из локации, света, плана, действия, субъекта и акцентной палитры; каждый двигательный кадр проходит явный pose contract; desktop/mobile используют отдельную арт-дирекцию одной сцены; страницы и меню сохраняют существующие semantic media tokens.

Approach: заменить общий apartment prompt на machine-readable role matrix и генерировать каждый мир отдельным режиссёрским брифом. Альтернатива — оставить единый интерьер и разводить только упражнения — отклонена: на малом размере и в навигации силуэты всё равно сливаются.

Verification: валидатор pairwise differentiation и обязательных technique checks; визуальный contact sheet без подписей; ручная проверка анатомии/опор; browser screenshots 390/1440 для шести representative routes и desktop top-menu leads.

Risk/doubt: скрипт может доказать различие заявленных контрактов и подключённых файлов, но не может надёжно подтвердить биомеханику сгенерированного человека. Поэтому автоматический gate дополняется обязательным визуальным review перед подключением.

Result:

- Replaced the six same-room v1 roles with distinct v2 worlds: courtyard step-up, covered pull-up court, balcony sit-to-stand, evening family kitchen, entryway route still life and phone-led neighbourhood studio.
- Added separate 16:9 desktop and 4:5 mobile masters plus AVIF/WebP exports; semantic CSS tokens switch art direction below `45rem` without page-local media rules.
- Added `data/media-role-contract.json` and `scripts/check-media-role-contract.mjs`: all role pairs differ across at least four declared dimensions, responsive exports must exist and movement roles require an approved visual technique review.
- Movement review rejected and regenerated the APP black-clothing variant and the men's mobile dead-hang mismatch before integration. Final step-up, strict pull-up and sit-to-stand frames satisfy the declared visible checkpoints.
- Verified: `media_role_contract_ok roles=6 dimensions=6 minDistinct=4`; `audience_media_ok pages=6 viewports=2`; `buffit_home_visual_ok`; fresh desktop/mobile route and four desktop-menu contact sheets show distinct navigation imagery without overflow.
- Local `http://localhost:4175/index.html` was reloaded and left open for review. No production deployment was performed.
# Result — 2026-07-22 media dependency closure

- Production получил ровно 28 активных AVIF/WebP, которые CSS уже запрашивал, но предыдущий релиз не выгрузил.
- Новый `scripts/check-media-dependencies.mjs` строит dependency closure из всех HTML, связанных CSS/import и локальных `src`, `srcset`, `poster`, `url()`; режим `--base-url` проверяет каждый активный asset публично.
- Public gate прошёл: 34 HTML, 19 CSS, 42 активных asset, ни одного 404.
- Release archive SHA-256: `fc60c2a44472fc0c168eb1c7bce6088239cbe6a8b86da3df180548779604d5f8`; backup: `/var/backups/yokhan-landing/creative-media-closure-20260722-20260722-174702`.
