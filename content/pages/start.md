---
id: buffit.start
title: С чего начать — BUFF IT
description: Выберите, как начать: пробная тренировка, программа или разговор с тренером.
route: /start.html
---

<LandingPageHero
  sectionId="start-hero"
  category="Начать BUFF IT"
  titleLines={["Выберите,","как начать"]}
  description="Попробуйте короткую тренировку, выберите готовую программу для самостоятельных занятий или обсудите регулярные тренировки с Игорем."
  actionLabel="Попробовать 10 минут"
  actionHref="https://fitness.yokhan.xyz/train/guest"
  imageSrc="/landing-media/home-desktop.avif"
  imageAlt="Варианты знакомства с тренировочной системой BUFF IT"
  supportLines={["Пробная тренировка в APP без регистрации","Готовые программы или регулярное ведение с Игорем"]}
/>

<LandingCardSection
  sectionId="start-options"
  title="Как вам удобнее начать?"
  presentation="grid-2"
  items={[{"eyebrow":"Без регистрации","title":"Попробовать тренировку","description":"Три упражнения для первого знакомства с APP. Нужен устойчивый стул или край стола.","variant":"route","actionLabel":"Открыть пробную тренировку","actionHref":"https://fitness.yokhan.xyz/train/guest"},{"eyebrow":"Самостоятельно","title":"Выбрать программу","description":"Посмотрите программы по цели и месту занятий: дома, в зале или на улице.","variant":"route","actionLabel":"Посмотреть программы","actionHref":"/programs.html"},{"eyebrow":"С тренером","title":"Обсудить занятия","description":"Два онлайн-занятия в неделю и домашнее задание — 32 000 ₽/мес (4 000 ₽ за тренировку). Три онлайн-занятия — 48 000 ₽/мес. Разовая консультация — 5 000 ₽. Старт — после разговора.","variant":"offer","actionLabel":"Посмотреть форматы и цены","actionHref":"/coaching.html"},{"eyebrow":"Перед началом","title":"План для новичка","description":"Начните с посильного графика, доступной нагрузки и оценки первой недели.","variant":"route","actionLabel":"Как начать после перерыва","actionHref":"/guide.html"}]}
/>

<LandingCta
  sectionId="start-cta"
  eyebrow="Диагностика"
  title="Обсудим подходящий вариант старта"
  description="Напишите Игорю напрямую или пройдите короткую квалификацию в боте."
  actionLabel="Подобрать в боте"
  actionHref="https://t.me/YokhanGym_bot?start=buffit_start"
  secondaryActionLabel="Обсудить занятия"
  secondaryActionHref="https://t.me/yokhan_yokhan"
/>

<LandingHomeFooter
  description="Тренировки, вкусное и здоровое питание, консультации — в одной системе с Игорем Назаровым."
  legal="Тренировочная система не заменяет медицинскую помощь."
  groups={[{"id":"training","label":"Тренировки","links":[{"id":"programs","label":"Программы","actionRef":"programs"},{"id":"coaching","label":"Занятия с тренером","actionRef":"coaching"},{"id":"safety","label":"Безопасность","actionRef":"safety"}]},{"id":"app","label":"APP","links":[{"id":"guest-trial","label":"Попробовать без регистрации","actionRef":"guestTrial"},{"id":"login","label":"Войти","actionRef":"login"}]},{"id":"services","label":"Сервисы и портфолио","links":[{"id":"calls","label":"Видеозвонки CALLS","actionRef":"calls"},{"id":"portfolio","label":"Портфолио","actionRef":"portfolio"},{"id":"projects","label":"Все проекты BUFF IT","actionRef":"projects"},{"id":"contact","label":"Связаться с Игорем","actionRef":"contact"}]}]}
/>
