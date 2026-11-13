---
id: buffit.account
title: BUFF IT ID — единый вход в сервисы
description: BUFF IT ID: единый вход для SmartCart, CALLS и следующих сервисов BUFF IT.
route: /account.html
---

<LandingPageHero
  sectionId="account-hero"
  category="BUFF IT ID"
  titleLines={["Один вход","для сервисов BUFF IT"]}
  description="Аккаунт создаётся на auth.yokhan.xyz и открывает подключённые сервисы без повторного ввода пароля в том же браузере. Сайт не хранит пароль и токены."
  actionLabel="Открыть BUFF IT"
  actionHref="https://fitness.yokhan.xyz/home"
  imageSrc="/landing-media/app-desktop.avif"
  imageAlt="Единый вход BUFF IT ID для сервисов экосистемы"
  supportLines={["Вход один раз через BUFF IT ID. · SmartCart и CALLS уже используют общий сеанс.","Fitness APP, Day Flow и SmartCart открываются напрямую с тем же BUFF IT ID."]}
/>

<LandingCardSection
  sectionId="services"
  eyebrow="Доступы"
  title="Куда можно идти после входа"
  description="Первый клик создаёт общий вход. После этого подключённые веб-сервисы должны открываться без новой формы входа в этом же браузере."
  presentation="grid-3"
  items={[{"eyebrow":"FITNESS APP","title":"Тренировки и прогресс","description":"Основное тренировочное приложение. BUFF IT ID дает тот же аккаунт во всех подключенных сервисах.","variant":"route","actionLabel":"Открыть Fitness APP","actionHref":"https://fitness.yokhan.xyz/home"},{"eyebrow":"FOOD / SmartCart","title":"Питание и корзина","description":"Подключён к BUFF IT ID. После входа сервис использует тот же аккаунт.","variant":"route","actionLabel":"Открыть SmartCart","actionHref":"https://fitness.yokhan.xyz/kitchen"},{"eyebrow":"CALLS","title":"Созвоны и разборы","description":"Подключён к BUFF IT ID. Роль тренера выдаётся в общей системе доступа, обычный клиент входит тем же аккаунтом.","variant":"route","actionLabel":"Открыть CALLS","actionHref":"https://calls.yokhan.xyz/"},{"eyebrow":"GUIDE","title":"Материалы и спокойный старт","description":"Публичный слой доступен сейчас. Персональный доступ через BUFF IT ID подключается следующим шагом.","variant":"route","actionLabel":"Открыть GUIDE","actionHref":"https://guide.yokhan.xyz/"},{"eyebrow":"GATES","title":"Ключи и приложения","description":"GATES открыт как сервис внутри BUFF IT APP: Android и Windows-ссылки видны сразу, ключи и конфиги выдаются после входа в BUFF IT ID.","variant":"route","actionLabel":"Открыть GATES","actionHref":"https://fitness.yokhan.xyz/services/gates?request=1"},{"eyebrow":"DAY FLOW","title":"Рутины и маршрут дня","description":"Day Flow уже работает и использует тот же BUFF IT ID. При активной сессии вход восстанавливается автоматически.","variant":"route","actionLabel":"Открыть Day Flow","actionHref":"https://yokhan.xyz/dayflow/"}]}
/>

<LandingCardSection
  sectionId="account-flow"
  eyebrow="User flow"
  title="Как человек должен входить"
  presentation="grid-3"
  items={[{"eyebrow":"01","title":"Войти на сайте","description":"Кнопка в шапке ведёт на BUFF IT ID. Пароль вводится только на auth.yokhan.xyz.","variant":"detail"},{"eyebrow":"02","title":"Открыть сервис","description":"SmartCart или CALLS видят уже активный вход и используют тот же аккаунт.","variant":"detail"},{"eyebrow":"03","title":"Возвращаться в общий маршрут","description":"Guide и Telegram помогают разобраться, а APP возвращает к плану, тренировкам и следующему полезному действию.","variant":"detail"}]}
/>

<LandingCta
  sectionId="account-cta"
  eyebrow="BUFF IT ID"
  title="Войти один раз через BUFF IT ID"
  description="После авторизации на auth.yokhan.xyz сервисы открываются без повторного ввода пароля в том же браузере."
  actionLabel="Войти через BUFF IT ID"
  actionHref="https://auth.yokhan.xyz/"
  secondaryActionLabel="К списку сервисов"
  secondaryActionHref="#services"
/>

<LandingHomeFooter
  description="Тренировки, вкусное и здоровое питание, консультации — в одной системе с Игорем Назаровым."
  legal="Тренировочная система не заменяет медицинскую помощь."
  groups={[{"id":"training","label":"Тренировки","links":[{"id":"programs","label":"Программы","actionRef":"programs"},{"id":"coaching","label":"Занятия с тренером","actionRef":"coaching"},{"id":"safety","label":"Безопасность","actionRef":"safety"}]},{"id":"app","label":"APP","links":[{"id":"guest-trial","label":"Попробовать без регистрации","actionRef":"guestTrial"},{"id":"login","label":"Войти","actionRef":"login"}]},{"id":"services","label":"Сервисы и портфолио","links":[{"id":"calls","label":"Видеозвонки CALLS","actionRef":"calls"},{"id":"portfolio","label":"Портфолио","actionRef":"portfolio"},{"id":"projects","label":"Все проекты BUFF IT","actionRef":"projects"},{"id":"contact","label":"Связаться с Игорем","actionRef":"contact"}]}]}
/>
