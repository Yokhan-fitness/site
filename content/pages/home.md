---
id: buffit.home
owner: YokhanFitnessLanding
routeRef: /
source_mode: markdown
content:
  hero:
    controlsLabel: Слайды о BUFF IT
    initialActionLabel: Как это работает?
    slides:
      - id: home-hero-health-energy
        label: Здоровье и энергия
        titleLines:
          - Крепкое тело и ровная энергия
          - в обычном ритме жизни
        composition: people-wide
        src: /landing-media/health-energy-wide-20261020.webp
        alt: Мужчина и женщина с гантелями, гирями и длинными силовыми петлями
        supportLines:
          - Персональные онлайн-тренировки с тренером или занятия по программе в нашем приложении.
          - Нагрузка, обычная еда и забота о самочувствии собраны в одном плане.
      - id: home-hero-work-and-interests
        label: Офис и киберспорт
        titleLines:
          - Силы для работы, игр
          - и жизни после экрана
        composition: workstations
        src: /landing-media/office-esports-complete-hero-20261016-r7.png
        alt: Офисный сотрудник в рубашке и киберспортсмен с мышью и клавиатурой за компьютерами, крупный план
        supportLines:
          - Онлайн-занятия дома на 20–40 минут разгружают спину и шею без дороги в зал.
          - План в приложении и ужин без долгой готовки возвращают энергию к вечеру.
      - id: home-hero-projects
        label: Дизайн и разработка
        titleLines:
          - Тело держит рабочий темп,
          - голова свободна от рутины
        composition: desk
        src: /landing-media/creative-figma-complete-hero-20261016-r7.png
        alt: Дизайнер-разработчик сидит спиной к зрителю, слева Figma с брендингом, справа редактор кода
        supportLines:
          - Готовая программа в BUFF IT APP, разбор техники с тренером и список продуктов на неделю.
          - Не нужно искать упражнения и считать вручную — открываете план и тренируетесь.
      - id: home-hero-family
        label: Для себя и семьи
        titleLines:
          - Силы на себя и близких —
          - в общем семейном ритме
        composition: people-wide
        src: /landing-media/family-energy-wide-20261020.webp
        alt: Мама и дочь сидят рядом после занятия, рядом гантели и длинная силовая петля
        supportLines:
          - Онлайн-занятия с тренером дома или короткие тренировки в приложении в удобное окно дня.
          - Рацион строится из привычной еды для всей семьи — без отдельной диетной готовки.
      - id: home-hero-freedom-of-movement
        label: Свобода движения
        titleLines:
          - Лёгкость в движениях и сила
          - без лишнего риска для спины
        composition: people-wide
        src: /landing-media/free-movement-wide-20261020.webp
        alt: Мужчина около 45 лет в двух состояниях, слева придерживает поясницу, справа сидит свободно, рядом гиря и силовая петля
        supportLines:
          - Тренер ставит технику вживую по видеосвязи и сразу подбирает безопасную замену упражнения.
          - Нагрузка растёт шаг за шагом с учётом вашего самочувствия и рекомендаций врача.
    howItWorksActionRef: home.changes
    contextualActions:
      - sectionId: buffit-landing-home-changes-title
        label: Как устроены тренировки
        actionRef: home.training
      - sectionId: training
        label: Как всё работает вместе
        actionRef: home.system
      - sectionId: system
        label: Выбрать формат
        actionRef: home.formats
      - sectionId: formats
        label: Попробовать без регистрации
        actionRef: guestTrial
      - sectionId: cases
        label: Узнать о занятиях
        actionRef: coaching
      - sectionId: contact
        label: Написать Игорю
        actionRef: contact
  changes:
    beforeLabel: Раньше
    afterLabel: Теперь
    cards:
      - id: changes-training
        title: Тренировки
        before: Случайные ролики и упражнения из поиска. Приходится самому гадать, с чего начать, какой вес брать и чем заменить неудобное движение.
        after: Последовательная программа в BUFF IT APP, понятная прогрессия нагрузки, разбор техники и готовые замены под ваше самочувствие и оборудование.
        image:
          src: /landing-media/changes-training-photo-20261016-r12.png
          alt: Слева мужчина устал выбирать упражнения в поиске и YouTube, справа тот же мужчина спокоен и готов заниматься
          width: 1536
          height: 1024
        screen:
          src: /landing-media/changes-training-ui-20261016-r12.png
          alt: Экран BUFF IT, программа тренировок и её последовательный маршрут
          width: 390
          height: 844
      - id: changes-nutrition
        title: Вкусное и здоровое питание
        before: Жёсткие запреты, подсчёт каждого грамма и хаос в холодильнике. Сложно вписать диету в работу, встречи и семейный ужин.
        after: Рацион из обычных блюд под ваши вкусы и время на готовку. Калорийность уже учтена, а список покупок на неделю собирается автоматически.
        image:
          src: /landing-media/changes-nutrition-photo-20261016-r12.png
          alt: Слева женщина сравнивает советы о питании в поиске и YouTube, справа спокойно сидит рядом с готовым блюдом
          width: 1536
          height: 1024
        screen:
          src: /landing-media/changes-nutrition-ui-20261016-r12.png
          alt: Экран BUFF IT с рационом и списком продуктов на неделю
          width: 390
          height: 650
      - id: changes-consultations
        title: Ведение и безопасность
        before: Разрозненные советы на форумах и догадки. Неясно, как сочетать тренировки с ограничениями по здоровью или паузами в графике.
        after: Тренер ведёт занятие по видеосвязи, сразу поправляет технику и помогает согласовать нагрузку и план недели с рекомендациями врача.
        image:
          src: /landing-media/changes-consultations-photo-20261016-r12.png
          alt: Слева мужчина самостоятельно ищет ответы на вопросы о здоровье, справа тот же мужчина спокоен рядом с экраном консультации
          width: 1536
          height: 1024
        screen:
          src: /landing-media/changes-consultations-ui-20261016-r12.png
          alt: Экран видеоконсультации BUFF IT CONNECT
          width: 390
          height: 844
  training:
    examples:
      - id: training-plan
        kind: image
        title: Видно весь маршрут и следующий шаг
        description: Занятия связаны в последовательный цикл. В приложении уже выставлены рабочие веса, подходы и таймер отдыха — просто идёте по шагам.
        media:
          src: /landing-media/changes-training-ui-20261016-r12.png
          alt: Экран программы BUFF IT с последовательностью занятий и планом тренировок
          width: 390
          height: 844
      - id: training-technique
        kind: image
        title: Техника — прямо в карточке упражнения
        description: Короткие пояснения к движению всегда перед глазами во время подхода. Не нужно гуглить ролики в зале или вспоминать объяснения тренера.
        media:
          src: /landing-media/training-exercise-ui-20261017-r19.png
          alt: Экран BUFF IT с пояснением техники выполнения упражнения
          width: 390
          height: 844
      - id: training-replacement
        kind: replacement
        title: Быстрая замена под ваши условия
        description: Занят тренажёр, занимаетесь дома без инвентаря или устала поясница — выбираете подходящий вариант из списка и продолжаете тренировку.
        replacement:
          label: Варианты замены
          choices:
            - title: Боковая планка
              description: С опорой на предплечье
            - title: Птица-собака
              description: Без оборудования
          caption: Нагрузка сохраняется, движение подстраивается под вас
    actionLabel: Посмотреть программы
    actionRef: programs
  system:
    tabsLabel: Как BUFF IT помогает в разных ситуациях
    tabs:
      - id: late-work
        label: Задержались на работе
      - id: restaurant
        label: Ужин в ресторане
      - id: travel
        label: Командировка
    questions:
      - Ваши обстоятельства
      - Подсказка BUFF IT
      - Ваш выбор
      - Обновлённый план
    stepLabels:
      - 01 · Что случилось
      - 02 · Что предлагает BUFF IT
      - 03 · Что выбираете вы
      - 04 · Итог для недели
    choiceGroupLabel: Выберите подходящий вариант
    scenarios:
      - id: late-work
        title: Работа затянулась. Меняем тренировку и ужин.
        description: Планировали зал на 19:00, но освободились только в 20:30. На занятие и ужин дома осталось полчаса.
        message: «Ещё на работе, в зал уже не успеваю. Что делаем с тренировкой и ужином?»
        advice:
          - Меняем 45 минут в зале на 15-минутное занятие дома на коврике, а полную силовую спокойно переносим на свободный день.
          - На ужин собираем простое блюдо за 10 минут из продуктов, которые уже есть в вашем списке на неделю.
        media:
          src: /landing-media/late-work-storyboard-20261017-r17.png
          alt: Мужчина смотрит на часы за рабочим столом, собирает быстрый ужин, занимается дома с гирей и отдыхает с близким человеком
          width: 2164
          height: 727
        choices:
          - id: home
            label: 15 минут дома
            summary: Разминаюсь и тренируюсь 15 минут дома, ужин собираю за 10 минут
            plan:
              - 15 минут дома на коврике
              - Быстрый ужин за 10 минут
              - Из продуктов, что уже куплены
          - id: tomorrow
            label: Перенести на завтра
            summary: Сегодня отдыхаю, полноценную тренировку переношу на завтра
            plan:
              - Полное занятие завтра в зале
              - Спокойный ужин дома
              - Список продуктов скорректирован
        planLabels:
          - Тренировка
          - Ужин
          - Покупки
        result: Тренировка и ужин уместились в полчаса без поздних поездок в зал, а недельная цель не пострадала.
      - id: restaurant
        title: Идёте в ресторан. Выбираете по вкусу.
        description: Вместо готовки дома — незапланированная встреча с друзьями или коллегами в ресторане.
        message: «Иду ужинать в ресторан. Вот меню — что выбрать, чтобы не выбиться из цели?»
        advice:
          - Выбирайте рыбу, мясо или птицу с простым гарниром и овощами. Если блюдо заправлено плотным соусом, попросите подать его отдельно.
          - Ешьте с удовольствием, тренер учтёт этот ужин в неделе, а домашние порции на завтра подстроятся автоматически.
        media:
          src: /landing-media/restaurant-phone-storyboard-20261017-r19.png
          alt: Женщина фотографирует меню, читает подсказку BUFF IT в телефоне, подтверждает выбранное блюдо и ужинает с подругой
          width: 2172
          height: 724
        choices:
          - id: fish
            label: Лосось с овощами
            summary: Заказываю лосось на гриле с овощами и не считаю граммы за столом
            plan:
              - Тренировка на неделе без изменений
              - Лосось с овощами в ресторане
              - Завтрашние порции учтены автоматически
          - id: chicken
            label: Курица с рисом
            summary: Беру курицу с рисом — сытно, понятно и без тяжести вечером
            plan:
              - Тренировка завтра по графику
              - Курица с рисом в ресторане
              - Недельный план обновлён
        planLabels:
          - Тренировка
          - Ужин
          - Покупки
        result: Вы спокойно поужинали в компании, а план питания уже пересчитал завтрашний день.
      - id: travel
        title: В отъезде меняем формат.
        description: В отеле нет зала, кухни тоже нет. С собой только сумка, резиновая петля и 20 минут утром.
        message: «Я в поездке без зала, с собой только резинка и 20 минут утром. Завтракаю в кафе.»
        advice:
          - В приложении переключаем тренировку на 20-минутный комплекс с резинкой в номере — или ставим день отдыха, если дорога вымотала.
          - Помогаем выбрать сытный завтрак в кафе, а домашние покупки ставим на паузу до вашего возвращения.
        media:
          src: /landing-media/travel-storyboard-20261017-r19.png
          alt: Женщина с чемоданом сообщает условия поездки в телефоне, занимается с длинной петлёй, выбирает завтрак в кафе и отправляется по делам
          width: 2172
          height: 724
        choices:
          - id: train
            label: Заняться с резинкой
            summary: Делаю 20-минутную тренировку с резинкой в номере и завтракаю в кафе
            plan:
              - 20 минут с резинкой в отеле
              - Сытный завтрак в кафе
              - Домашние покупки на паузе
          - id: rest
            label: Восстановиться с дороги
            summary: Даю себе время выспаться после перелёта, к тренировкам вернусь завтра
            plan:
              - Отдых после дороги
              - Обычный завтрак в кафе
              - План обновится к возвращению
        planLabels:
          - Тренировка
          - Питание
          - Покупки
        result: Вы не выпали из ритма в дороге, а список продуктов не копит лишнего, пока вас нет дома.
  formats:
    items:
      - id: format-self-guided
        title: В своём темпе — в BUFF IT APP
        description: Откройте веб-приложение без регистрации, выберите программу под цель и тренируйтесь по шагам со встроенным таймером, пояснениями техники и заменой упражнений.
        media:
          src: /landing-media/format-solo-20261017-r19.png
          alt: Мужчина самостоятельно занимается с гирей, сверяясь с упражнением в телефоне
          width: 1536
          height: 1024
        actionLabel: Попробовать без регистрации
        actionRef: guestTrial
      - id: format-coaching
        title: Личное онлайн-ведение с тренером
        description: 12 недель работы один на один с Игорем Назаровым — живые занятия по видеосвязи, разбор техники в процессе, связь в Telegram и гибкая настройка программы и питания под вашу неделю.
        media:
          src: /landing-media/format-coach-20261017-r19.png
          alt: Тренер наблюдает за приседанием женщины и помогает с техникой
          width: 1536
          height: 1024
        actionLabel: Узнать о занятиях
        actionRef: coaching
  cases:
    collectionLabel: Истории клиентов
    presentation: grid-2
    items:
      - id: case-marat
        title: Марат — мышцы и сила
        description: 10 подтягиваний и первый выход силой после долгой сидячей работы. Как выстроили регулярные тренировки без перегрузок.
        actionLabel: История Марата
        actionRef: maratCase
        variant: detail
      - id: case-tanya
        title: Таня — подготовка к нормативам
        description: Освоение становой тяги и корректировка программы прямо по ходу работы, когда менялись задачи и самочувствие.
        actionLabel: История Тани
        actionRef: tanyaCase
        variant: detail
  contact:
    actionLabel: Написать Игорю
    actionRef: contact
  footer:
    groups:
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
          - id: app-trial
            label: Попробовать без регистрации
            actionRef: guestTrial
          - id: login
            label: Войти
            actionRef: login
      - id: services-and-portfolio
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
---

<LandingHomeHero id="hero">
<PageSlot name="category">Онлайн-тренировки с тренером и собственное приложение</PageSlot>
<PageSlot name="description">Живые занятия с тренером по видеосвязи, собственное приложение, подбор питания и учёт ограничений — в одной системе под ваш график.</PageSlot>
</LandingHomeHero>

<LandingHomeChanges id="changes">
<PageSlot name="heading">Что изменилось?</PageSlot>
</LandingHomeChanges>

<LandingHomeTraining id="training">
<PageSlot name="heading">Тренировки с понятной логикой</PageSlot>
<PageSlot name="description">Каждое занятие открывается в BUFF IT APP как пошаговый план: что делать сегодня, с каким весом, сколько отдыхать и чем заменить упражнение.</PageSlot>
<PageSlot name="swipeHint">Листайте экраны, чтобы посмотреть все три</PageSlot>
<PageSlot name="regionLabel">Примеры тренировок в BUFF IT. На узком экране можно прокручивать вбок</PageSlot>
</LandingHomeTraining>

<LandingHomeSystem id="system">
<PageSlot name="heading">Система, которая подстраивается под вас</PageSlot>
<PageSlot name="description">Онлайн-тренер, приложение и план питания работают в одной связке. Когда день идёт не по графику, система перестраивает решение за пару минут, а не отменяет всё до понедельника.</PageSlot>
<PageSlot name="exampleLabel">Пример одного дня · выберите вариант ниже</PageSlot>
<PageSlot name="swipeHint">Листайте: ситуация → подсказка BUFF IT → ваш выбор → итог для недели</PageSlot>
<PageSlot name="regionLabel">Фото-схема решений BUFF IT. На узком экране прокручивается вбок</PageSlot>
<PageSlot name="feedbackHeading">Если изменился не один вечер, а вся неделя</PageSlot>
<PageSlot name="feedbackDescription">На видеозвонке с тренером перестраиваем весь ритм: подгоняем нагрузку, меню и список покупок под новый график командировок, дедлайнов, самочувствие или рекомендации врача.</PageSlot>
</LandingHomeSystem>

<LandingHomeFormats id="formats">
<PageSlot name="heading">Самостоятельно или с тренером</PageSlot>
<PageSlot name="description">Начните сами в веб-приложении или выстройте результат в 12-недельной работе с Игорем Назаровым.</PageSlot>
</LandingHomeFormats>

<LandingHomeCases id="cases">
<PageSlot name="heading">Истории моих клиентов</PageSlot>
</LandingHomeCases>

<LandingHomeContact id="contact">
<PageSlot name="title">Начнём с вашей цели</PageSlot>
<PageSlot name="description">Напишите, чего хотите от ближайших месяцев: наладить регулярные тренировки в плотном графике, вернуть телу лёгкость и силу или разобраться с питанием без диет. Поговорим и подберём комфортный первый шаг.</PageSlot>
</LandingHomeContact>

<LandingHomeFooter id="footer">
<PageSlot name="description">Персональные онлайн-тренировки, собственное приложение, питание и поддержка — в одной системе с Игорем Назаровым.</PageSlot>
<PageSlot name="legal">Тренировочная система не заменяет медицинскую помощь.</PageSlot>
</LandingHomeFooter>
