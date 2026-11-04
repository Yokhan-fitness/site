# YokhanFitness Site Architecture — Health Ecosystem

Date: 2026-05-25

## Correction

The public site is not just a fitness funnel.
It is the first map of Igor's health ecosystem.

A visitor comes to:
- understand who Igor is;
- see what is happening around YokhanFitness;
- choose a training path;
- discover supporting services;
- decide whether to start through bot, direct contact, guide, or app.

The Oura reference matters because Oura does not only sell a device.
It sells a system: ring, app, health benefits, women's health, activity, sleep, readiness, and membership.

YokhanFitness needs the same logic:

```text
general promise -> segment by person/goal -> show product families -> route to the right surface
```

## Ecosystem Families

| Family | Public meaning | Projects |
|---|---|---|
| Entry and segmentation | understand fit, choose route | `YokhanFitnessLanding`, `@igor_it_fit` |
| Lead qualification | quiz, source tracking, consultation | `YokhanGymBot` |
| Training with Igor | personal coaching and coach-led tracking | `YokhanFitnessPersonal` |
| Self-training | app for people who want to train independently | `YokhanFitnessAppMY` |
| Training knowledge | programs, exercises, guide, explanations | `YokhanFitnessDocs`, `yokhanFitnessDocsWebsite` |
| Safety knowledge | first aid, medicine/supplement boundaries | `YokhanFirstAid`, `YokhanMedKit` |
| Nutrition support | food/cart layer for body goals | `WellnesCartApp` |
| Communication and access | calls, secure access/client infrastructure | `YokhanCallService`, VPN/client projects |
| Adjacent proof/media | photo direction and visual trust assets | `YokhanPhoto` |

## Site Job

Primary job:

```text
visitor -> expands acquaintance with Igor -> sees the ecosystem -> chooses a useful next step
```

This is broader than:

```text
visitor -> bot
```

But conversion still matters. Every page should have a next step.

## Homepage Model

The homepage should work like an ecosystem router.

### First Screen

- Broad promise about modern body, training, health, and control.
- Igor is visible as the human center.
- CTA options:
  - "Подобрать путь";
  - "Тренироваться с Игорем";
  - "Тренироваться самостоятельно".

### Segment Layer

Oura-style benefit segmentation:
- modern man;
- modern woman;
- sitting work and back/neck;
- weight and body shape;
- strength/performance;
- restart after pause.

### Product Family Layer

Show the ecosystem as families, not random projects:
- with coach;
- self-training app;
- bot/quiz;
- knowledge base;
- safety;
- nutrition;
- calls/access.

### Trust Layer

- Igor's background;
- training method;
- real limits: max clients, safety boundaries;
- proof/media when assets exist.

## Recommended URL Map

### Core Site

| URL | Purpose | Primary CTA |
|---|---|---|
| `/` | ecosystem homepage and route chooser | choose path |
| `/training.html` | overview of training options | bot / program |
| `/coaching.html` | training with Igor | consultation |
| `/self-training.html` | independent app path | app / bot |
| `/programs.html` | all programs by goal | program page |
| `/method.html` | how Igor's method works | bot |
| `/results.html` | proof, cases, progress snapshots | consultation |
| `/coach/` | Igor, background and personal trust | coaching offer |
| `/about.html` | working principles and boundaries | method / coaching |
| `/start.html` | all start options | bot / direct TG |
| `/links.html` | all public surfaces | relevant link |

### Program Pages

| URL | Source program |
|---|---|
| `/program-entry-fitness.html` | entry fitness |
| `/program-pull-ups.html` | pull-ups |
| `/program-athlete-body.html` | athlete body |
| `/program-healthy-back.html` | healthy back |
| `/program-maintain-shape.html` | maintain shape |
| `/program-weight-loss.html` | weight loss |
| `/program-glutes.html` | glutes |
| `/program-flexible-body.html` | flexible body |

### Audience Pages

| URL | Role |
|---|---|
| `/men.html` | modern men's training benefits |
| `/women.html` | modern women's training benefits |
| `/tech.html` | sitting work, neck/back, cognitive fatigue |
| `/ceo.html` | energy, sleep, control |
| `/care.html` | burnout and support capacity |
| `/creator.html` | visual form and movement freedom |
| `/mom.html` | strength, fatigue, family capacity |
| `/gamer.html` | back, wrists, reaction, long sessions |
| `/free.html` | freelancer body as work infrastructure |
| `/sage.html` | body, psyche, meaning, longevity |

### Ecosystem Pages

| URL | Surface | Project |
|---|---|---|
| `/bot.html` | quiz and consultation entry | `YokhanGymBot` |
| `/app.html` | self-training app | `YokhanFitnessAppMY` |
| `/personal.html` | tracker for personal clients | `YokhanFitnessPersonal` |
| `/guide.html` | training guide and education | `yokhanFitnessDocsWebsite` |
| `/knowledge.html` | programs/exercises knowledge base | `YokhanFitnessDocs` |
| `/safety.html` | first aid and medical boundaries | `YokhanFirstAid`, `YokhanMedKit` |
| `/nutrition.html` | food/cart support | `WellnesCartApp` |
| `/calls-access.html` | calls and secure client access | `YokhanCallService`, VPN/client projects |

## Navigation

Desktop top nav:

```text
Тренировки | С тренером | Самостоятельно | Экосистема | Обо мне | Начать
```

Footer:

```text
Бот | Приложение | Personal | Гайд | База знаний | Первая помощь | Аптечка | Питание | Созвоны | Доступ | Канал
```

Top nav is for decisions.
Footer is for ecosystem depth.

## Page Templates

### Product Family Page

1. What problem this family solves.
2. Who should use it.
3. What happens inside.
4. How it connects to other services.
5. Next action.

### Program Page

1. Promise.
2. User-world reason.
3. Training mechanism.
4. 2+DZ and 3/week coaching formats with fixed prices 26k/34k.
5. Format and price.
6. Safety boundary.
7. CTA with source parameter.

### Ecosystem Page

1. What this service is.
2. When a person needs it.
3. Whether it is for prospects, clients, or both.
4. Link out or "coming soon".

## Implementation Order

1. Update homepage structure around ecosystem routing.
2. Add `training.html`, `coaching.html`, `self-training.html`, `ecosystem.html`, `links.html`.
3. Add `personal.html` for the new `YokhanFitnessPersonal` product.
4. Add program catalog and program pages.
5. Add `guide.html`, `safety.html`, `nutrition.html`, `calls-access.html`.
6. Add archetype pages only after the core service map is clear.

## Active Constraint

The site can explain the ecosystem now, but trust still needs assets:
- Igor photos;
- app screenshots;
- bot screenshots;
- training logs or anonymized progress;
- guide screenshots;
- nutrition/cart screenshots;
- call/access screenshots when ready.

Generated editorial imagery may support explanation and atmosphere, but it cannot impersonate Igor, clients, testimonials or transformation proof. Codex uses `docs/image-orders/` and the built-in `$imagegen` workflow for approved raster slots; real proof still requires owned media and permission.
