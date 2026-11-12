# YokhanFitness Ecosystem Specification

> **Source of truth** для всей фитнес-экосистемы. Симлинк в каждом fitness-проекте.
> Верхняя часть — ручная (бизнес, архетипы, решения). Нижняя — авто-генерируемая сканером PA.
> Последнее ручное обновление: 2026-03-27

---

## 1. Миссия и бизнес-модель

**Миссия**: Восстановить способность жить в своей выбранной роли через научно обоснованный фитнес. Не лечим симптомы — возвращаем идентичность.

**Big Idea** (Огилви): Хроническая боль — крушение идентичности. Мы возвращаем человеку его роль.

**Позиционирование** (Траут): Первый фитнес-тренер для сидячих профессий, который сам 10 лет сидел. Не "один из онлайн-тренеров", а "свой человек, ставший экспертом".

**Бизнес-модель**: Персональный онлайн-тренинг, 3500₽/тренировка, максимум 5 клиентов одновременно. Premium positioning (New Luxury): "персональные тренировки в твоём пространстве", не "дома с ковриком".

**Ссылки**: `memory/constitution.md`, `memory/product-matrix.md`, `memory/strategic-planning.md`

---

## 2. Воронка и путь клиента

### Лестница Ханта (5 уровней осознания)

```
Уровень 1 (40%): "Просто устаю"     → Контент: вирусные статьи (DTF, Habr, Пикабу)
Уровень 2 (30%): "Спина болит"       → Контент: канал @igor_it_fit, guide
Уровень 3 (15%): "Нужна программа"   → Квиз-бот @YokhanGym_bot, лендинг
Уровень 4 (10%): "Хочу попробовать"  → Консультация 30 мин, пробная тренировка
Уровень 5 (5%):  "Я клиент"          → Абонемент, retention, LTV
```

### Путь через проекты

```
Статья (DTF/Habr/Пикабу)
  → Канал @igor_it_fit (прогрев)
    → Бот @YokhanGym_bot (квиз, определение архетипа)
      → Персонализированный лендинг yokhan.xyz/{archetype}
        → Консультация (Игорь лично, 30 мин)
          → Тренировки (через приложение fitness.yokhan.xyz)
            → Guide (guide.yokhan.xyz — самообучение)
            → FirstAid / MedKit (при необходимости)
```

**Ссылки**: `memory/hunt-ladder.md`

---

## 3. Архетипы клиентов

8 архетипов с персонализированным подходом. Source of truth: `memory/customer-passports/`

| # | Архетип | Возраст | Боль | Триггер | Лендинг |
|---|---------|---------|------|---------|---------|
| 1 | **Технократ** | 25-45 | Шея, когнитивный спад | ROI, баг/патч | /tech |
| 2 | **CEO** | 35-60 | Нет энергии, плохой сон | Инвестиция, ROI | /ceo |
| 3 | **Помогающий** | 30-55 | Выгорание, "сапожник" | Кислородная маска | /care |
| 4 | **Творец** | 25-45 | Потеря грации, боль | Визуальный результат | /creator |
| 5 | **Мама** | 30-50 | Усталость, дети | Сильная мама = здоровые дети | /mom |
| 6 | **Геймер** | 18-35 | Реакция, спина, запястья | -40ms, лучше играешь | /gamer |
| 7 | **Фрилансер** | 25-50 | Тело = офис, нет страховки | Страховка от простоя | /free |
| 8 | **Осознанец** | 35-65 | Интегративный подход | Тело + психика + смысл | /sage |

**Детальные портреты**: `memory/customer-passports/*.md`

---

## 4. Продуктовая линейка

По BCG-матрице (все в стадии "Question Mark"):

| Продукт | Описание | Цена | Статус |
|---------|----------|------|--------|
| **Lead Magnet** | Квиз-бот (бесплатно), гайд (бесплатно) | 0₽ | ACTIVE |
| **Tripwire** | 7-дневный челлендж, экспресс-программа | 1-2к₽ | PLANNED |
| **Core** | Персональный тренинг, 2-3 раза/нед | 28-42к₽/мес | ACTIVE (3 клиента) |
| **App** | BUFF IT — Telegram Mini App + PWA | Freemium | IN DEVELOPMENT |
| **AI Coach** | DeepSeek-based рекомендации в аппе | Included | PIPELINE |

**Распределение фокуса**: 60% Core, 25% App, 10% AI, 5% Lead/Tripwire

**Ссылки**: `memory/product-matrix.md`

---

## 5. Брендинг

### Голос

**Тон "Раздевалка"**: опытный тренер объясняет другу после тренировки. Уверенно, с деталями, без официоза.

**Структура контента**: Hook (0-3с) → Pain (3-20с) → Solution (20-40с) → CTA (40+с)

**BAN-LIST**: является, ключевой аспект, стоит отметить, важно понимать, нюанс, комплексный подход, в современном мире, безусловно, зачастую, по сути. Запрещены вступления: "Это важный вопрос", "В современном ритме жизни", "Слушай", "Смотри", "Давайте разберемся"

**Пропорция**: 80% экспертная речь / 20% метафоры (по архетипу)

### Визуал

- Цвет бренда: `#C8EA6A` (зелёный)
- Тёмная тема, glassmorphism
- Шрифты: Unbounded (заголовки), Golos Text (тело)
- Design tokens: из YokhanFitnessAppMY `design-tokens.css`

**Ссылки**: `memory/constitution.md`, `source-docs/existing-brand-docs/Global_Style.md`

---

## 6. Маркетологи (совет экспертов)

Все решения по маркетингу и контенту проходят через линзы 8 маркетологов:

| Эксперт | Линза | Файл |
|---------|-------|------|
| **Джек Траут** | Позиционирование, первый в категории | `core/methodologies/marketers/trout.md` |
| **Дэвид Огилви** | Архетипы, Big Idea, трансформация | `core/methodologies/marketers/ogilvy.md` |
| **Юджин Шваб** | Симптом vs диагноз, скрытые потребности | `core/methodologies/marketers/schwab.md` |
| **Байрон Шарп** | Данные, distinctive assets, availability | `core/methodologies/marketers/sharp.md` |
| **Брайан Трейси** | Путь клиента, точки контакта, система | `core/methodologies/marketers/tracy.md` |
| **Марк Шефер** | Storytelling, контент как помощь | `core/methodologies/marketers/schaefer.md` |
| **Филип Котлер** | STP, маркетинг-микс | `core/methodologies/marketers/kotler.md` |
| **New Luxury** | Премиум-позиционирование | `core/methodologies/marketers/new-luxury.md` |

---

## 7. Принятые решения

| Решение | Почему | Дата |
|---------|--------|------|
| 8 лендингов по архетипам, не 1 общий | Совет маркетологов: один для всех = ни для кого | 2026-03-27 |
| Максимум 5 клиентов | Персональная работа, каждую программу пишу лично | 2026-03 |
| Без зала, дома | Убирает барьер "надо собраться и поехать" | 2025 |
| Доказательный подход (РКИ, метаанализы) | Дифференциация от бро-сайенс тренеров | 2025 |
| Telegram как primary канал | ЦА (IT) живёт в TG | 2025 |
| App на Supabase + React | Быстрый MVP, бесплатный tier | 2025 |
| DeepSeek вместо GPT для AI Coach | Дешевле, достаточно для рекомендаций | 2026-01 |
| Бот отделён от аппа (YokhanGymBot ≠ AppMY bot) | Разные задачи: лид-магнит vs клиентский сервис | 2026-03 |

---

## 8. Карта проектов

### Tier 1: Core Product

| Проект | Путь | Стек | Роль |
|--------|------|------|------|
| **YokhanFitnessAppMY** | `~/Documents/YokhanFitnessAppMY` | React+Node+Docker | Приложение для клиентов |
| **YokhanGymBot** | `~/Documents/YokhanGymBot` | Python+aiogram | Квиз-бот, лид-магнит |
| **YokhanFitnessLanding** | `~/Documents/YokhanFitnessLanding` | Static HTML+CSS | 8 лендингов по архетипам |

### Tier 2: Documentation

| Проект | Путь | Стек | Роль |
|--------|------|------|------|
| **yokhanFitnessDocsWebsite** | `~/Documents/GitHub/yokhanFitnessDocsWebsite` | Docusaurus | guide.yokhan.xyz |
| **YokhanFirstAid** | `~/Documents/YokhanFirstAid` | Docusaurus | Вики заболеваний |
| **YokhanMedKit** | `~/Documents/YokhanMedKit` | Docusaurus | Аптечка |

### Tier 3: Knowledge

| Проект | Путь | Стек | Роль |
|--------|------|------|------|
| **YokhanFitnessDocs** | `~/Documents/GitHub/YokhanFitnessDocs` | Obsidian | Личная база знаний |
| **YokhanFitness** | `~/Documents/YokhanFitness` | LitKit/Cursor | Бренд, архетипы, методологии |

### Tier 4: Adjacent

| Проект | Путь | Стек | Роль |
|--------|------|------|------|
| **WellnesCartApp** | `~/Documents/WellnesCartApp` | React Native+FastAPI | Умная продуктовая корзина |

---

## 9. URL-карта

| Домен | Проект | Назначение | Статус |
|-------|--------|-----------|--------|
| `yokhan.xyz` | Landing | Лендинги по архетипам | IN PROGRESS |
| `fitness.yokhan.xyz` | AppMY | WebApp (PWA) | ACTIVE |
| `telegram.yokhan.xyz` | AppMY | WebApp (TG Mini App) | ACTIVE |
| `api.yokhan.xyz` | AppMY | Backend API | ACTIVE |
| `guide.yokhan.xyz` | DocsWebsite | Гайд для новичков | ACTIVE |
| `firstaid.yokhan.xyz` | FirstAid | Вики заболеваний | CREATED |
| `medkit.yokhan.xyz` | MedKit | Аптечка | CREATED |
| `@YokhanGym_bot` | GymBot | Квиз + онбординг | ACTIVE |
| `@igor_it_fit` | — | TG канал, контент | ACTIVE |

---

## 10. Зависимости между проектами

```
Landing  ──ссылается──→  @YokhanGym_bot (CTA)
Landing  ──ссылается──→  guide.yokhan.xyz (гайд)
Landing  ──ссылается──→  @igor_it_fit (footer)
GymBot   ──ссылается──→  telegram.yokhan.xyz (WebApp)
GymBot   ──ссылается──→  guide.yokhan.xyz (follow-up ссылки)
GymBot   ──ссылается──→  api.yokhan.xyz (backend secret)
AppMY    ──ссылается──→  api.yokhan.xyz (собственный backend)
AppMY    ──shared secret──→  GymBot (TELEGRAM_BOT_BACKEND_SECRET)
```

---

## ⚡ Авто-секция (генерируется PA scanner)

> Всё ниже этой линии генерируется `scripts/maint/ecosystem_scanner.py`.
> Не редактировать вручную — будет перезаписано при следующем скане.
> Последний скан: 2026-03-27 10:40 UTC

### Состояние проектов

| Проект | Последний коммит | Коммитов за неделю | Статус | Ссылок на ecosystem |
|--------|-----------------|-------------------|--------|---------------------|
| **WellnesCartApp** | 2026-03-25 | 9 | DESIGN | 0 |
| **YokhanFirstAid** | 2026-03-25 | 20 | IDLE | 0 |
| **YokhanFitness** | — | 0 | — | 0 |
| **YokhanFitnessAppMY** | 2026-03-25 | 27 | IN PROGRESS | 24 |
| **YokhanFitnessDocs** | 2026-03-25 | 15 | IDLE | 0 |
| **YokhanFitnessLanding** | 2026-03-25 | 14 | TODO | 3 |
| **YokhanGymBot** | 2026-03-26 | 44 | — | 5 |
| **YokhanIndependentVPN** | 2026-03-25 | 14 | MAINTENANCE | 2 |
| **YokhanMedKit** | 2026-03-25 | 20 | IDLE | 0 |
| **amplitude-client** | 2026-03-25 | 9 | PENDING | 0 |
| **yokhanFitnessDocsWebsite** | 2026-03-25 | 16 | IDLE | 1 |

