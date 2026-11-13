---
id: buffit.app
title: BUFF IT APP — пробная тренировка и план
description: Откройте APP, посмотрите короткую пробную тренировку или выберите готовую программу для самостоятельных занятий.
route: /app.html
---

<LandingPageHero
  sectionId="app-hero"
  category="BUFF IT APP"
  titleLines={["Откройте","тренировку и план"]}
  description="В APP собраны план занятий, упражнения и профиль. Для знакомства с форматом доступна короткая пробная тренировка без регистрации. Короткая пробная тренировка поможет посмотреть, как устроено занятие, до входа в аккаунт."
  actionLabel="Открыть APP"
  actionHref="https://fitness.yokhan.xyz/"
  imageSrc="/landing-media/app-desktop.avif"
  imageAlt="Тренировочное веб-приложение BUFF IT APP"
  supportLines={["План занятий, упражнения и профиль в одном месте","Короткая пробная тренировка доступна без регистрации"]}
/>

<LandingCardSection
  sectionId="app-next"
  title="Что открыть дальше"
  presentation="grid-3"
  items={[{"eyebrow":"Короткая проба","title":"Первая тренировка","description":"Три упражнения для первого знакомства с APP. Нужен устойчивый стул или край стола. Можно познакомиться с форматом до входа в аккаунт.","variant":"route","actionLabel":"Открыть","actionHref":"https://fitness.yokhan.xyz/train/guest"},{"eyebrow":"Программы","title":"План на 12 недель","description":"Выберите цель и место занятий. Форматы с тренером описаны отдельно, с ценами и составом сопровождения.","variant":"route","actionLabel":"Открыть","actionHref":"/programs.html"},{"eyebrow":"CONNECT","title":"Видеозвонок","description":"Создайте комнату и отправьте приглашение собеседнику или войдите по готовой ссылке.","variant":"route","actionLabel":"Открыть","actionHref":"https://calls.yokhan.xyz/"}]}
/>

<LandingCta
  sectionId="app-cta"
  eyebrow="BUFF IT APP"
  title="Попробуйте короткое занятие без регистрации"
  description="Откройте гостевую тренировку в APP или перейдите к полному каталогу программ."
  actionLabel="Попробовать без регистрации"
  actionHref="https://fitness.yokhan.xyz/train/guest"
  secondaryActionLabel="Открыть APP"
  secondaryActionHref="https://fitness.yokhan.xyz/"
/>

<LandingHomeFooter
  description="Тренировки, вкусное и здоровое питание, консультации — в одной системе с Игорем Назаровым."
  legal="Тренировочная система не заменяет медицинскую помощь."
  groups={[{"id":"training","label":"Тренировки","links":[{"id":"programs","label":"Программы","actionRef":"programs"},{"id":"coaching","label":"Занятия с тренером","actionRef":"coaching"},{"id":"safety","label":"Безопасность","actionRef":"safety"}]},{"id":"app","label":"APP","links":[{"id":"guest-trial","label":"Попробовать без регистрации","actionRef":"guestTrial"},{"id":"login","label":"Войти","actionRef":"login"}]},{"id":"services","label":"Сервисы и портфолио","links":[{"id":"calls","label":"Видеозвонки CALLS","actionRef":"calls"},{"id":"portfolio","label":"Портфолио","actionRef":"portfolio"},{"id":"projects","label":"Все проекты BUFF IT","actionRef":"projects"},{"id":"contact","label":"Связаться с Игорем","actionRef":"contact"}]}]}
/>
