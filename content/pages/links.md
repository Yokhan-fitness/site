---
id: buffit.links
title: APP, CONNECT и проекты — BUFF IT
description: Откройте пробную тренировку, видеокомнату CALLS, готовые программы или страницу занятий с тренером.
route: /links.html
---

<LandingPageHero
  sectionId="links-hero"
  category="Карта входов"
  description="Тренировки — в APP. Видеозвонки — в CALLS. Программы и занятия с тренером — на этом сайте. Другие проекты собраны в портфолио Yokhan."
  actionLabel="Открыть APP"
  actionHref="https://fitness.yokhan.xyz/"
  imageSrc="/landing-media/app-desktop.avif"
  imageAlt="Единая карта сервисов и проектов BUFF IT и Yokhan"
>

```yaml titleLines
- Куда вы
- хотите попасть?
```

```yaml supportLines
- Тренировки в APP · Видеозвонки в CALLS
- Программы и сопровождение на yokhan.xyz
```

</LandingPageHero>

<LandingCardSection
  sectionId="links-routes"
  title="Выберите задачу"
  presentation="grid-3"
>

```yaml items
- eyebrow: APP
  title: Тренировки
  description: Откройте план, занятие и свой профиль. Для первого знакомства есть пробная тренировка без регистрации.
  variant: route
  actionLabel: Открыть APP
  actionHref: https://fitness.yokhan.xyz/
- eyebrow: CALLS
  title: Видеозвонки
  description: Создайте комнату или войдите по ссылке приглашения. Занятия с тренером нужно согласовать отдельно.
  variant: route
  actionLabel: Открыть CALLS
  actionHref: https://calls.yokhan.xyz/
- eyebrow: С тренером
  title: Личное сопровождение
  description: 12 недель тренировок с Игорем Назаровым. Два занятия и домашнее задание или три занятия в неделю.
  variant: route
  actionLabel: Посмотреть форматы
  actionHref: /coaching.html
- eyebrow: GUIDE
  title: Как начать после перерыва
  description: Короткие рекомендации помогут выбрать график и оценить первую неделю занятий.
  variant: route
  actionLabel: Открыть рекомендации
  actionHref: /guide.html
- eyebrow: GATES
  title: Доступ к VPN
  description: Перейдите в APP, чтобы проверить доступ или отправить заявку. Заявка требует одобрения.
  variant: route
  actionLabel: Открыть GATES в APP
  actionHref: https://fitness.yokhan.xyz/services/gates
- eyebrow: Yokhan
  title: Другие проекты
  description: Портфолио, Giant’s Vale, Village Heroes и GAUSS.
  variant: route
  actionLabel: Портфолио и проекты
  actionHref: https://portfolio.yokhan.xyz/
```

</LandingCardSection>

<LandingCta
  sectionId="links-cta"
  eyebrow="Навигация"
  title="Перейти к видеозвонкам или Telegram-боту"
  description="Все активные точки входа собраны в одном месте."
  actionLabel="Открыть CALLS"
  actionHref="https://calls.yokhan.xyz/"
  secondaryActionLabel="Открыть бота"
  secondaryActionHref="https://t.me/YokhanGym_bot?start=buffit_links"
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
