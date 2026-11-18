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
          - Здоровое тело и энергия
          - для комфортной жизни
        composition: people-wide
        src: /landing-media/health-energy-wide-20261020.webp
        alt: Мужчина и женщина с гантелями, гирями и длинными силовыми петлями
        supportLines:
          - Комфортные пошаговые тренировки
          - без перегруза и еда под ваш вкус.
      - id: home-hero-work-and-interests
        label: Офис и киберспорт
        titleLines:
          - Ясный ум и концентрация
          - для работы и киберспорта
        composition: workstations
        src: /landing-media/office-esports-complete-hero-20261016-r7.png
        alt: Офисный сотрудник и киберспортсмен с мышью и клавиатурой за компьютерами
        supportLines:
          - Улучшите скорость и качество принятия
          - решений за счёт укрепления тела.
      - id: home-hero-projects
        label: Дизайн и разработка
        titleLines:
          - Здоровье и энергия
          - для бизнеса и проектов
        composition: desk
        src: /landing-media/creative-figma-complete-hero-20261016-r7.png
        alt: Дизайнер-разработчик за столом с макетами и кодом
        supportLines:
          - "Готовая эффективная система здоровья:"
          - минимум времени, решений и поиска.
      - id: home-hero-family
        label: Для себя и семьи
        titleLines:
          - Энергия для семьи
          - и здоровье на годы
        composition: people-wide
        src: /landing-media/family-energy-wide-20261020.webp
        alt: Мама и дочь сидят рядом после занятия с гантелями и силовой петлёй
        supportLines:
          - Занятия дают заряд, а не выжимают —
          - хватает энергии на детей вечером.
      - id: home-hero-freedom-of-movement
        label: Свобода движения
        titleLines:
          - Крепкое тело и спина
          - с учётом ваших травм
        composition: people-wide
        src: /landing-media/free-movement-wide-20261020.webp
        alt: Мужчина свободно сидит после укрепления спины рядом с гирей и силовой петлёй
        supportLines:
          - Подбираем упражнения под ограничения
          - и растим силу без боли и отката.
    howItWorksActionRef: home.changes
    contextualActions:
      - sectionId: buffit-landing-home-changes-title
        label: Как устроены тренировки
        actionRef: home.training
      - sectionId: training
        label: Как всё работает вместе
        actionRef: home.system
      - sectionId: system
        label: О тренере
        actionRef: home.author
      - sectionId: formats
        label: Попробовать без регистрации
        actionRef: guestTrial
      - sectionId: cases
        label: Выбрать формат
        actionRef: home.formats
      - sectionId: contact
        label: Написать Игорю
        actionRef: contact
  changes:
    beforeLabel: Было
    afterLabel: Стало
    cards:
      - id: changes-training
        title: Тренировки
        before: "Разрозненные ролики из YouTube и вечные сомнения: с какого веса начать, правильно ли двигаюсь и что делать, если тренажёр занят."
        after: Пошаговая программа в BUFF IT APP с таймером, понятной техникой и заменами под дом, зал, резинки или усталую спину.
        image:
          src: /landing-media/changes-training-photo-20261016-r12.webp
          alt: Слева мужчина устал выбирать упражнения в поиске и роликах, справа спокойно готовится к занятию по плану
          width: 1536
          height: 1024
        screen:
          src: /landing-media/changes-training-ui-20261016-r12.png
          alt: Экран BUFF IT с программой тренировок и последовательным маршрутом
          width: 390
          height: 844
      - id: changes-nutrition
        title: Еда без диет
        before: Однообразная грудка на пару, подсчёт каждого грамма на весах и ощущение вины после ужина с друзьями в пятницу.
        after: Обычные блюда, которые вы реально любите, спокойный порядок привычек и готовый список покупок на неделю.
        image:
          src: /landing-media/changes-nutrition-photo-20261016-r12.webp
          alt: Слева женщина изучает противоречивые диеты, справа спокойно сидит рядом с домашним блюдом
          width: 1536
          height: 1024
        screen:
          src: /landing-media/changes-nutrition-ui-20261016-r12.png
          alt: Экран BUFF IT с рационом и списком продуктов на неделю
          width: 390
          height: 650
      - id: changes-consultations
        title: Поддержка тренера
        before: Непонятно, как вернуться к движению после паузы, дедлайна или с ограничениями по спине — проще всё отложить на потом.
        after: Тренер на созвоне в BUFF IT CONNECT видит технику в прямом эфире и подгоняет нагрузку под вашу реальную неделю.
        image:
          src: /landing-media/changes-consultations-photo-20261016-r12.webp
          alt: Слева мужчина ищет ответы о боли в спине один, справа спокойно общается с тренером по видеосвязи
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
        description: Занятия связаны в последовательный цикл. В приложении уже выставлены рабочие веса, подходы и таймер отдыха.
        media:
          src: /landing-media/changes-training-ui-20261016-r12.png
          alt: Экран программы BUFF IT с последовательностью занятий
          width: 390
          height: 844
      - id: training-technique
        kind: image
        title: Техника — прямо в карточке упражнения
        description: Короткие пояснения к движению всегда перед глазами во время подхода. Искать ролики в зале больше не придётся.
        media:
          src: /landing-media/training-exercise-ui-20261017-r19.png
          alt: Экран BUFF IT с пояснением техники выполнения упражнения
          width: 390
          height: 844
      - id: training-replacement
        kind: replacement
        title: Быстрая замена под ваши условия
        description: Занят тренажёр, мало места дома или устала поясница — выбираете подходящий вариант из списка и спокойно продолжаете.
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
          - Меняем 45 минут в зале на 15-минутное занятие дома на коврике, а полную силовую переносим на свободный день.
          - На ужин собираем простое блюдо за 10 минут из продуктов, которые уже есть в вашем списке на неделю.
        media:
          src: /landing-media/late-work-storyboard-20261017-r17.webp
          alt: Мужчина за рабочим столом, готовит быстрый ужин, занимается дома с гирей и отдыхает вечером
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
          - Выбирайте рыбу, мясо или птицу с простым гарниром и овощами. Плотную заправку можно попросить подать отдельно.
          - Ешьте спокойно с удовольствием, а домашние порции на завтра подстроятся автоматически.
        media:
          src: /landing-media/restaurant-phone-storyboard-20261017-r19.webp
          alt: Женщина фотографирует меню, смотрит подсказку BUFF IT в телефоне и спокойно ужинает с подругой
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
        description: В отеле нет зала и кухни. С собой только дорожная сумка, резиновая петля и 20 минут утром.
        message: «Я в поездке без зала, с собой только резинка и 20 минут утром. Завтракаю в кафе.»
        advice:
          - Переключаем тренировку в приложении на 20-минутный комплекс с резинкой в номере или ставим день отдыха.
          - Выбираем сытный завтрак в кафе, а домашние покупки ставим на паузу до вашего возвращения.
        media:
          src: /landing-media/travel-storyboard-20261017-r19.webp
          alt: Женщина с чемоданом переключает тренировку в номере, занимается с длинной петлёй и завтракает в кафе
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
        result: Вы не выпали из ритма в дороге, а список продуктов дома не копит лишнего.
  author:
    credentials:
      - id: education
        label: Образование
        value: «Мастер-тренер» («Учёный фитнес»)
      - id: background
        label: Инженерный опыт
        value: Разработка, дизайн и управление командой
      - id: method
        label: Принципы
        value: Доказательная физиология без крайностей
    portrait:
      src: /landing-media/igor-author-portrait-20261005-r15.webp
      alt: Портрет Игоря Назарова, автора и тренера системы BUFF IT
      width: 1254
      height: 1254
    actionLabel: Подробнее об авторе и занятиях
    actionRef: coaching
  cases:
    collectionLabel: Истории клиентов BUFF IT
    items:
      - id: case-marat
        clientName: Марат
        clientRole: Разработчик · удалёнка
        startPoint: 8 часов за компьютером, ноющая поясница к вечеру и пауза в спорте около трёх лет.
        whatWeDid: Собрали 3 короткие тренировки в неделю по 30 минут, укрепили кор и навели порядок с ужинами.
        result: 10 подтягиваний, первый выход силой и спина без скованности после рабочего дня.
        durationLabel: 12 недель
        actionLabel: История Марата
        actionRef: maratCase
      - id: case-tanya
        clientName: Таня
        clientRole: Специалист · сменный график
        startPoint: Плавающий рабочий график, усталость после смен и страх тяжёлых базовых упражнений.
        whatWeDid: Адаптировали нагрузку под сменный ритм и поставили технику становой тяги по видеосвязи.
        result: Выполнение силовых нормативов и предсказуемое расписание без выгорания.
        durationLabel: 16 недель
        actionLabel: История Тани
        actionRef: tanyaCase
      - id: case-alex
        clientName: Алексей
        clientRole: Дизайнер · сидячий режим
        startPoint: Ограничения из-за протрузии поясницы и насторожённость к любому наклону с весом.
        whatWeDid: Убрали осевое сжатие, укрепили ягодицы и глубокий кор с безопасными заменами.
        result: Спокойные долгие поездки за рулём и регулярные 3 занятия в неделю без обострений.
        durationLabel: 10 недель
        actionLabel: Все кейсы
        actionRef: portfolio
  formats:
    items:
      - id: format-trial
        badge: Быстрый вход
        title: Гостевой доступ без регистрации
        subtitle: Оцените подачу упражнений, таймер и подсказки техники прямо в браузере с телефона.
        priceLabel: 3 вводных занятия
        bullets:
          - Запуск сразу с телефона без анкет и привязки карты
          - Понятные ориентиры техники и таймер прямо в подходе
          - Безопасные замены под дом, резинку и усталую спину
        media:
          src: /landing-media/app-guest-intro-20261011.png
          alt: Стартовый экран гостевого маршрута BUFF IT APP на экране телефона
          width: 390
          height: 844
        actionLabel: Попробовать без регистрации
        actionRef: guestTrial
        featured: false
      - id: format-self-guided
        badge: В своём темпе
        title: Программы и питание в BUFF IT APP
        subtitle: Последовательные циклы тренировок, привычное меню и общий список продуктов на неделю.
        priceLabel: Условия — в личном кабинете
        bullets:
          - Маршруты тренировок под зал, дом и улицу по шагам
          - Синхронизация ужинов и списка продуктов на семью
          - Дневник подходов, весов и отдыха в одном окне
        media:
          src: /landing-media/format-solo-20261017-r19.png
          alt: Мужчина самостоятельно занимается с гирей, сверяясь с экраном телефона
          width: 1536
          height: 1024
        actionLabel: Попробовать приложение
        actionRef: guestTrial
        featured: false
      - id: format-coaching
        badge: С тренером
        title: Личное ведение с Игорем Назаровым
        subtitle: "12 недель работы один на один: созвоны в CONNECT, разбор техники и гибкие правки под график."
        priceLabel: Условия — на странице занятий
        bullets:
          - Живой разбор каждого движения по видеосвязи
          - Подгонка объёма под спину, дедлайны и поездки
          - Прямая связь с тренером в течение всей недели
        media:
          src: /landing-media/format-coach-20261017-r19.webp
          alt: Тренер наблюдает за техникой приседания и подсказывает положение спины
          width: 1536
          height: 1024
        actionLabel: Узнать о занятиях
        actionRef: coaching
        featured: true
  faq:
    label: Частые вопросы о системе BUFF IT
    items:
      - id: faq-zero-experience
        question: Подойдёт ли система, если я никогда не занимался в зале?
        answer: Да. Вводный маршрут начинается с простых движений с запасом по силе, без резкого скачка нагрузки и боли на следующий день.
      - id: faq-back-pain
        question: Можно ли заниматься, если к вечеру ноет поясница или зажата шея?
        answer: Да, при отсутствии острых прострелов и онемения. В каждом занятии есть замены без осевого сжатия позвоночника; при острой боли сначала идут к врачу.
      - id: faq-time-budget
        question: Сколько времени в неделю нужно на тренировки?
        answer: Достаточно 2–3 занятий по 25–40 минут. Если рабочая неделя заполнена, сессия сжимается до 15 минут без потери привычки.
      - id: faq-strict-diets
        question: Придётся ли считать каждый грамм на весах и есть только грудку?
        answer: Нет. Питание собирается вокруг привычных блюд и готового списка покупок без строгих диет и срывов в выходные.
      - id: faq-home-equipment
        question: Можно ли начать дома без абонемента в тренажёрный зал?
        answer: Можно. Первые недели легко проходят дома на коврике и с одной длинной резинкой, а упражнения переключаются в два нажатия.
      - id: faq-switch-format
        question: Можно ли начать в приложении самому и позже перейти к Игорю?
        answer: Да. История тренировок и заметки сохраняются в вашем аккаунте BUFF IT, поэтому личные созвоны можно подключить в любой момент.
  contact:
    actionLabel: Написать Игорю
    actionRef: contact
  footer:
    groups:
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
<PageSlot name="category">Экосистема здоровья,\
фитнеса и питания</PageSlot>
<PageSlot name="description">Комфортные пошаговые тренировки без перегруза, вкусная еда и единая система под ваш ритм жизни.</PageSlot>
</LandingHomeHero>

<LandingHomeChanges id="changes">
<PageSlot name="heading">Что меняется на деле</PageSlot>
</LandingHomeChanges>

<LandingHomeTraining id="training">
<PageSlot name="heading">Тренировка понятна с первого экрана</PageSlot>
<PageSlot name="description">Каждое занятие в BUFF IT APP уже собрано по шагам: какие веса ставить, сколько отдыхать и чем заменить упражнение, если тренажёр занят или устала спина.</PageSlot>
<PageSlot name="swipeHint">Листайте экраны, чтобы посмотреть все три</PageSlot>
<PageSlot name="regionLabel">Примеры тренировок в BUFF IT. На узком экране можно прокручивать вбок</PageSlot>
</LandingHomeTraining>

<LandingHomeSystem id="system">
<PageSlot name="heading">План подстраивается под неделю, а не ломается</PageSlot>
<PageSlot name="description">Сначала закрепляем регулярность движения, а еду и нагрузку спокойно подгоняем под завалы, ужины и поездки — без отката «начну с понедельника».</PageSlot>
<PageSlot name="exampleLabel">Пример одного дня · выберите вариант ниже</PageSlot>
<PageSlot name="swipeHint">Листайте: ситуация → подсказка BUFF IT → ваш выбор → итог для недели</PageSlot>
<PageSlot name="regionLabel">Фото-схема решений BUFF IT. На узком экране прокручивается вбок</PageSlot>
<PageSlot name="feedbackHeading">Когда посыпалась не одна тренировка, а вся неделя</PageSlot>
<PageSlot name="feedbackDescription">На созвоне в BUFF IT CONNECT пересобираем ритм целиком: сокращаем объём тренировок на время дедлайна, правим меню и убираем лишнее из списка покупок.</PageSlot>
</LandingHomeSystem>

<LandingHomeCoach id="author">
<PageSlot name="heading">Игорь Назаров — тренер с опытом в разработке</PageSlot>
<PageSlot name="eyebrow">Автор системы BUFF IT</PageSlot>
<PageSlot name="bio">До тренерской работы я проектировал цифровые интерфейсы и руководил командой разработки, поэтому хорошо понимаю, как сказываются на спине и силах восемь часов за столом. Прошёл обучение на «Мастер-тренера» и собрал систему без жёстких диет и подвигов.</PageSlot>
<PageSlot name="quote">«Хорошая программа подстраивается под живую неделю с релизами и перелётами, а не требует перестроить всю жизнь ради зала».</PageSlot>
</LandingHomeCoach>

<LandingHomeCases id="cases">
<PageSlot name="heading">Как это работает у клиентов</PageSlot>
<PageSlot name="description">Три истории с разной стартовой точкой — от ноющей поясницы и сменного графика до уверенного выхода силой.</PageSlot>
</LandingHomeCases>

<LandingHomeFormats id="formats">
<PageSlot name="heading">Выберите удобный формат старта</PageSlot>
<PageSlot name="description">Оцените тренировки с 3 вводных занятий в браузере, занимайтесь самостоятельно в приложении или работайте лично с Игорем Назаровым.</PageSlot>
</LandingHomeFormats>

<LandingHomeFaq id="faq">
<PageSlot name="heading">Частые вопросы</PageSlot>
<PageSlot name="description">Честные ответы про время на неделе, ограничения по спине, инвентарь дома и смену формата.</PageSlot>
</LandingHomeFaq>

<LandingHomeContact id="contact">
<PageSlot name="title">Начнём с вашей задачи</PageSlot>
<PageSlot name="description">Напишите, как проходит ваша неделя и что хотите изменить: убрать скованность после сидячей работы, втянуться в регулярный ритм или наладить еду без диет. Подберём посильный первый шаг.</PageSlot>
</LandingHomeContact>

<LandingHomeFooter id="footer">
<PageSlot name="description">Понятные тренировки в приложении, привычная еда и живая поддержка Игоря Назарова — без культа страданий.</PageSlot>
<PageSlot name="legal">Тренировочная система не заменяет медицинскую помощь.</PageSlot>
</LandingHomeFooter>
