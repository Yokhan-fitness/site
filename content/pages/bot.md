---
id: buffit.bot
title: Подбор программы и старта — BUFF IT
description: Бот уточнит вашу цель, опыт и условия для занятий, а затем предложит программу или способ обсудить формат с тренером.
route: /bot.html
---

<LandingPageHero
  sectionId="bot-hero"
  category="BOT / подбор маршрута"
  description="Бот уточнит вашу цель, опыт и условия для занятий, а затем предложит программу или способ обсудить формат с тренером."
  actionLabel="Открыть бота"
  actionHref="https://t.me/YokhanGym_bot?start=buffit_bot"
  imageSrc="/landing-media/app-desktop.avif"
  imageAlt="Telegram-бот подбора маршрута и старта BUFF IT"
>

```yaml titleLines
- Ответьте на вопросы
- и выберите следующий шаг
```

```yaml supportLines
- Подходящий формат — в личку или консультацию.
- Есть вопросы — на программу или созвон. · Самостоятельно — в гайд и канал.
```

</LandingPageHero>

<LandingCardSection
  sectionId="bot-checks"
  eyebrow="Что бот выясняет"
  title="Уточним задачу и условия занятий"
  presentation="grid-2"
>

```yaml items
- eyebrow: Цель
  title: Ваша задача
  description: Вес, ягодицы, новый образ, спина, вход в фитнес, силовой навык или поддержание формы.
  variant: detail
- eyebrow: Формат
  title: Где и когда удобно заниматься
  description: Дом, зал или улица; 2 тренировки + домашнее задание или 3 тренировки в неделю.
  variant: detail
- eyebrow: Риски
  title: Что важно учесть
  description: Боль, травмы, ограничения, тревога перед нагрузкой и ситуации, где нужен HEALTH-маршрут.
  variant: detail
- eyebrow: Контекст
  title: Что доступно для занятий
  description: Страница, пост или рекомендация помогают понять, что человек уже видел и почему решил начать именно сейчас.
  variant: detail
```

</LandingCardSection>

<LandingCardSection
  sectionId="bot-outcomes"
  eyebrow="Что дальше"
  title="После ответов"
  description="Ответы помогают выбрать, что посмотреть дальше: готовую программу, приложение или форматы занятий с тренером."
  presentation="grid-3"
>

```yaml items
- eyebrow: Подходящий формат
  title: Маршрут собран
  description: "Цель ясна, формат подходит, красных флагов нет. Дальше не нужно читать всё подряд: согласуем стартовую неделю, оборудование и ритм."
  variant: route
  actionLabel: Открыть
  actionHref: https://t.me/yokhan_yokhan
- eyebrow: Есть вопросы
  title: Нужен короткий разбор
  description: "Цель реальная, но есть детали: график, техника, прошлый опыт, дом или зал. Разбор нужен, чтобы не начать с неверной нагрузки."
  variant: route
  actionLabel: Открыть
  actionHref: /calls-access.html
- eyebrow: Самостоятельно
  title: Пока без покупки
  description: Если решение не созрело, человек получает гайд и канал. Польза сейчас, возвращение к маршруту позже, без давления.
  variant: route
  actionLabel: Открыть
  actionHref: https://yokhan.xyz/guide.html
- eyebrow: Индивидуальная программа
  title: Сам и дешевле
  description: "Обсудите доступность и условия индивидуальной программы: она отличается от готового плана в приложении и регулярного ведения."
  variant: route
  actionLabel: Открыть
  actionHref: /self-training.html
- eyebrow: сначала безопасность
  title: Сначала безопасность
  description: Если вопрос относится к здоровью или симптомам, тренер не заменяет медицинского специалиста. Обратитесь к врачу.
  variant: route
  actionLabel: Открыть
  actionHref: /health.html
- eyebrow: Питание
  title: Еда мешает форме
  description: На странице питания описаны расчёт калорийности, практические рекомендации и список покупок.
  variant: route
  actionLabel: Открыть
  actionHref: /nutrition.html
```

</LandingCardSection>

<LandingCta
  sectionId="bot-cta"
  eyebrow="Быстрый старт"
  title="Начать подбор в Telegram-боте"
  description="Бот уточнит цель, опыт и график и сразу подскажет подходящий маршрут."
  actionLabel="Открыть бота"
  actionHref="https://t.me/YokhanGym_bot?start=buffit_bot"
  secondaryActionLabel="Выбрать вход"
  secondaryActionHref="/start.html"
/>

<LandingHomeFooter
  description="Тренировки, вкусное и здоровое питание, консультации — в одной системе с Игорем Назаровым."
  legal="Тренировочная система не заменяет медицинскую помощь."
>

```yaml groups
- id: training
  label: Тренировки
  links:
    - id: programs
      label: Программы
      actionRef: programs
    - id: coaching
      label: Занятия с тренером
      actionRef: coaching
    - id: safety
      label: Безопасность
      actionRef: safety
- id: app
  label: APP
  links:
    - id: guest-trial
      label: Попробовать без регистрации
      actionRef: guestTrial
    - id: login
      label: Войти
      actionRef: login
- id: services
  label: Сервисы и портфолио
  links:
    - id: calls
      label: Видеозвонки CALLS
      actionRef: calls
    - id: portfolio
      label: Портфолио
      actionRef: portfolio
    - id: projects
      label: Все проекты BUFF IT
      actionRef: projects
    - id: contact
      label: Связаться с Игорем
      actionRef: contact
```

</LandingHomeFooter>
