---
id: buffit.ecosystem
title: Сервисы BUFF IT — приложение, еда, видеозвонки и единый вход
description: "Шесть сервисов BUFF IT под общим аккаунтом: приложение с тренировками, подбор привычной еды, видеоразборы, гайды и поддержка тренера."
route: /ecosystem.html
---

<LandingPageHero
  sectionId="ecosystem-hero"
  category="Экосистема BUFF IT"
  description="Не нужно собирать фитнес по кускам из чужих таблиц и случайных роликов: тренировки, обычная еда и созвоны с тренером связаны одним аккаунтом."
  actionLabel="Открыть приложение"
  actionHref="https://fitness.yokhan.xyz/auth?mode=login&returnTo=%2Fhome"
  imageSrc="/landing-media/one-plan-storyboard-20261016-r14.webp"
  imageAlt="Общий маршрут тренировок, питания и консультаций BUFF IT"
>

```yaml titleLines
- Все сервисы BUFF IT
- в одном аккаунте
```

```yaml supportLines
- Один вход BUFF IT ID — не нужно вводить пароли заново между сайтом, приложением и видеосвязью.
- "Открывайте ровно то, что нужно сейчас: занятие, меню на неделю или живую консультацию."
```

</LandingPageHero>

<LandingCardSection
  sectionId="today-actions"
  eyebrow="Что внутри"
  title="Сервисы, которые держат ритм"
  description="Каждый инструмент закрывает свою часть недели и не спорит с остальными."
  presentation="grid-3"
>

```yaml items
- eyebrow: Тренировки
  title: BUFF IT APP
  description: Пошаговый план на сегодня с таймером, рабочими весами и быстрой заменой упражнений дома или в зале.
  variant: route
  actionLabel: Открыть 10-минутное демо
  actionHref: https://fitness.yokhan.xyz/train/guest
- eyebrow: Питание
  title: BUFF IT FOOD
  description: Обычные блюда под ваши вкусы и время на готовку плюс готовый список продуктов на неделю.
  variant: route
  actionLabel: Подробнее о еде
  actionHref: /nutrition.html
- eyebrow: Видеоразбор
  title: BUFF IT CONNECT
  description: Онлайн-занятия и разбор техники по видеосвязи в комнате без установки сторонних программ.
  variant: route
  actionLabel: Как проходят созвоны
  actionHref: /calls-access.html
- eyebrow: Аккаунт
  title: BUFF IT ID
  description: "Единый вход для сервисов экосистемы: заходите один раз и спокойно переключаетесь между задачами."
  variant: detail
  actionLabel: Как работает вход
  actionHref: /account.html
- eyebrow: База знаний
  title: Гайд и разборы
  description: Короткие практические ответы без медицинского птичьего языка — как втянуться, что делать со спиной и где не перегореть.
  variant: detail
  actionLabel: Читать гайд
  actionHref: /guide.html
- eyebrow: Поддержка
  title: Telegram-бот и чат
  description: Помогает выбрать первую программу за пару минут или сразу переключиться на разговор с Игорем.
  variant: detail
  actionLabel: Подобрать в боте
  actionHref: /bot.html
```

</LandingCardSection>

<LandingCardSection
  sectionId="changed-evening"
  eyebrow="Как это помогает"
  title="Завал на работе не отменяет неделю"
  description="Когда вечер пошёл не по плану, не приходится бросать всё до следующего понедельника."
  presentation="grid-3"
>

```yaml items
- title: Тренировка сжимается до 15 минут
  description: Вместо дороги в зал выбираете домашнюю замену с ковриком или резинкой прямо в карточке занятия.
  variant: detail
- title: Ужин собирается из того, что уже куплено
  description: В меню всегда есть быстрый вариант на 10 минут — не нужно срываться на случайный фастфуд.
  variant: detail
- title: Неделя не рассыпается
  description: Спокойно переносите тяжёлую тренировку на свободный день и идёте дальше без чувства вины.
  variant: detail
```

</LandingCardSection>

<LandingMediaFeature
  sectionId="one-plan-system"
  eyebrow="Связка"
  title="Один маршрут вместо десяти разрозненных советов"
  description="Сначала выстраиваем посильное движение, затем подтягиваем привычки в еде и только при необходимости добавляем плотную работу с тренером."
  align="copy-left"
  aspect="wide"
  imageSrc="/landing-media/family-energy-wide-20261020.webp"
  imageAlt="Единый план тренировок и питания без разрозненных советов"
  actionLabel="Посмотреть тренировки"
  actionHref="/programs.html"
  secondaryActionLabel="Об авторе"
  secondaryActionHref="/about.html"
/>

<LandingCta
  sectionId="ecosystem-cta"
  eyebrow="Следующий шаг"
  title="Попробуйте первую тренировку прямо сейчас"
  description="Десять минут в приложении покажут формат наглядно — регистрация для этого не нужна."
  actionLabel="Попробовать без регистрации"
  actionHref="https://fitness.yokhan.xyz/train/guest"
  secondaryActionLabel="Написать Игорю"
  secondaryActionHref="https://t.me/yokhan_yokhan"
/>

<LandingHomeFooter
  description="Понятные тренировки в приложении, привычная еда и живая поддержка Игоря Назарова — без культа страданий."
  legal="Тренировочная система не заменяет медицинскую помощь."
>

```yaml groups
- id: training
  label: Тренировки
  links:
    - id: programs
      label: Тренировки
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
      label: Видеозвонки CONNECT
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
