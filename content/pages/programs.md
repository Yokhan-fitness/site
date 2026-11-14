---
id: buffit.programs
title: Программы тренировок под вашу задачу
description: Каталог программ BUFF IT: старт, сила, фигура, спина, подвижность и навыки.
route: /programs.html
---

<LandingPageHero
  category="Каталог программ"
  description="Выберите маршрут для старта, силы, фигуры, спины, подвижности или навыка. Все 11 программ рассчитаны на 12-недельный цикл в своём темпе или с тренером."
  actionLabel="Выбрать программу"
  actionHref="#programs"
  imageSrc="/landing-media/health-energy-wide-20261020.webp"
  imageAlt="Пара отдыхает после тренировки с гантелями и эспандером"
  sectionId="programs-hero"
>

```yaml titleLines
- Программы тренировок
- под вашу задачу
```

```yaml supportLines
- 9 маршрутов для мужчин и 8 для женщин с общими и профильными целями.
- В каждой карточке — задача программы, ритм 2–3 раза в неделю и переход к описанию.
```

</LandingPageHero>

<ProgramsCatalog
  eyebrow="Направление"
  title="Выберите, что вам ближе"
  description="Мужские и женские маршруты включают как общие программы (старт, спина, вес, ритм, подтягивания), так и профильные акценты."
  defaultCluster="men"
  sectionId="programs"
>

```yaml clusters
- id: men
  label: Мужчинам
  note: "9 маршрутов: старт, сила, спина, форма и турник"
  imageSrc: /landing-media/men-desktop.avif
  imageAlt: Мужчина тренируется на улице
  items:
    - id: men-entry-fitness
      title: Начать тренироваться с нуля или после паузы
      description: "Мягкий старт без перегрузки: базовые движения, постепенная нагрузка и привычный график."
      href: program-entry-fitness.html
      badge: старт
      weeks: 12 недель
      frequency: 2+ДЗ или 3 раза
    - id: men-athlete-body
      title: "Тело атлета: сила и форма верхней части тела"
      description: Плечи, спина, руки, корпус и собранный силуэт без лишней сложности в зале или дома.
      href: program-athlete-body.html
      badge: сила и форма
      weeks: 12 недель
      frequency: 2+ДЗ или 3 раза
    - id: men-healthy-back
      title: Тренировки для спины при сидячей работе
      description: Осанка, грудной отдел, плечи и силовая работа для тех, кто много часов проводит за столом и экраном.
      href: program-healthy-back.html
      badge: спина
      weeks: 12 недель
      frequency: 2+ДЗ или 3 раза
    - id: men-maintain-shape
      title: Поддерживать форму при меняющемся графике
      description: Устойчивый ритм 2–3 раза в неделю, когда работа, перелёты и усталость мешают жёсткому расписанию.
      href: program-maintain-shape.html
      badge: ритм
      weeks: 12 недель
      frequency: 2+ДЗ или 3 раза
    - id: men-power-exit
      title: Освоить выход силой на перекладине
      description: Силовая тяга, переход, контроль корпуса и техника для цели на турнике при готовой базе.
      href: program-power-exit.html
      badge: навык
      weeks: 12 недель
      frequency: 2+ДЗ или 3 раза
    - id: men-pull-ups
      title: Научиться подтягиваться или увеличить число повторений
      description: Прогрессии тяговых движений, работа с хватом и верхом тела к первому чистому подтягиванию или новым повторам.
      href: program-pull-ups.html
      badge: сила
      weeks: 12 недель
      frequency: 2+ДЗ или 3 раза
    - id: men-front-hang
      title: Освоить передний вис
      description: Кор, хват, широчайшие и точный контроль положения тела для сложной силовой цели.
      href: program-front-hang.html
      badge: навык
      weeks: 12 недель
      frequency: 2+ДЗ или 3 раза
    - id: men-weight-loss
      title: Снижение веса с тренировками и питанием
      description: Силовые занятия, ходьба и питание без голодных качелей, чтобы вес снижался и удерживался.
      href: program-weight-loss.html
      badge: вес
      weeks: 12 недель
      frequency: 2+ДЗ или 3 раза
    - id: men-new-image
      title: Изменить фигуру с помощью тренировок и питания
      description: Силуэт, плечи, спина, талия и энергия собраны в одну последовательную систему под обычную жизнь.
      href: program-new-image.html
      badge: фигура
      weeks: 12 недель
      frequency: 2+ДЗ или 3 раза
- id: women
  label: Женщинам
  note: "8 маршрутов: старт, ягодицы, гибкость, спина и вес"
  imageSrc: /landing-media/women-desktop.avif
  imageAlt: Женщина тренируется на улице
  items:
    - id: women-entry-fitness
      title: Начать тренироваться с нуля или после паузы
      description: "Мягкий старт без перегрузки: базовые движения, постепенная нагрузка и привычный график."
      href: program-entry-fitness.html
      badge: старт
      weeks: 12 недель
      frequency: 2+ДЗ или 3 раза
    - id: women-flexible-body
      title: Гибкость и подвижность для повседневных движений
      description: Мобильность суставов, растяжка и восстановление в дополнение к силовым тренировкам и для лёгкости в теле.
      href: program-flexible-body.html
      badge: подвижность
      weeks: 12 недель
      frequency: 2+ДЗ или 3 раза
    - id: women-glutes
      title: Силовые тренировки для ягодиц и ног
      description: Приседания, наклоны, мосты и выпады с понятной техникой и прогрессией нагрузки на нужные мышцы.
      href: program-glutes.html
      badge: сила
      weeks: 12 недель
      frequency: 2+ДЗ или 3 раза
    - id: women-healthy-back
      title: Тренировки для спины при сидячей работе
      description: Спина, шея, грудной отдел и плечи для жизни с большим количеством работы за компьютером.
      href: program-healthy-back.html
      badge: спина
      weeks: 12 недель
      frequency: 2+ДЗ или 3 раза
    - id: women-maintain-shape
      title: Поддерживать форму при меняющемся графике
      description: Сохранять тонус и ритм 2–3 раза в неделю без выгорания, когда график и планы меняются.
      href: program-maintain-shape.html
      badge: ритм
      weeks: 12 недель
      frequency: 2+ДЗ или 3 раза
    - id: women-new-image
      title: Изменить фигуру с помощью тренировок и питания
      description: "Приоритет под вашу задачу: талия, ягодицы, плечи, силуэт и устойчивый режим."
      href: program-new-image.html
      badge: фигура
      weeks: 12 недель
      frequency: 2+ДЗ или 3 раза
    - id: women-pull-ups
      title: Научиться подтягиваться или увеличить число повторений
      description: Последовательные прогрессии, хват и укрепление верха тела от базовых тяг к подтягиваниям.
      href: program-pull-ups.html
      badge: сила
      weeks: 12 недель
      frequency: 2+ДЗ или 3 раза
    - id: women-weight-loss
      title: Снижение веса с тренировками и питанием
      description: Силовые занятия, ходьба, режим и питание без жёстких запретов — под обычную рабочую неделю.
      href: program-weight-loss.html
      badge: вес
      weeks: 12 недель
      frequency: 2+ДЗ или 3 раза
```

</ProgramsCatalog>

<LandingTimeline
  eyebrow="Как устроена программа"
  title="План занятий, который можно понять и выполнять"
  description="План объясняет, что делать на занятии, зачем нужно движение и как учитывать свои возможности. Это не набор случайных роликов, а последовательная работа."
  activeStep={1}
>

```yaml steps
- label: "01"
  title: Упражнения идут в нужном порядке
  description: План объясняет, что делать на занятии и как постепенно развивать нагрузку.
- label: "02"
  title: Понятно, зачем нужно движение
  description: Объяснения помогают освоить упражнение, а не собирать занятие из случайных роликов.
- label: "03"
  title: Учитывайте свои возможности
  description: Подходящую замену и график занятий выбирают с учётом доступного инвентаря и подготовки.
```

</LandingTimeline>

<LandingHomeFormats
  heading="Самостоятельно или с тренером"
  description="Выберите, какая поддержка нужна вам сейчас."
>

```yaml items
- id: format-self
  title: В своём темпе
  description: Откройте приложение, выберите программу и посмотрите доступные сервисы BUFF IT.
  media:
    src: /landing-media/format-solo-20261017-r19.png
    alt: Женщина самостоятельно тренируется дома с гантелью и телефоном
    width: 1536
    height: 1024
  actionLabel: Попробовать приложение
  actionRef: appTrial
- id: format-coach
  title: С поддержкой тренера
  description: Занимайтесь лично или по видеосвязи. Тренер поможет с техникой, нагрузкой и изменениями программы.
  media:
    src: /landing-media/format-coach-20261017-r19.png
    alt: Тренер помогает женщине с техникой упражнения
    width: 1536
    height: 1024
  actionLabel: Узнать о занятиях
  actionRef: coaching
```

</LandingHomeFormats>

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
