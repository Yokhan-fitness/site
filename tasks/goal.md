# Product Goal — BUFF IT Public Site

## Final Outcome

Главная и внешние страницы BUFF IT объясняют продукт как систему тренировок, питания и жизни для людей с сидячей работой: пользователь быстро понимает, какая у него цель, как выглядит 3-месячный маршрут, что делать сегодня и куда зайти после регистрации.

## Quality Bar

- Никакого MVP-мышления: каждый опубликованный блок должен работать как часть конечного продукта.
- Сайт продаёт реальную систему, а не абстрактный фитнес, спортзал, марафон или мотивационную витрину.
- Основные цели: трансформация тела, похудеть навсегда, здоровая спина, мягкий старт, продвинутые тренировки.
- Тон: “я такой же” через конкретику сидячей работы, быта, графика, спины, еды и ограниченного времени.
- UX: с главной можно быстро попасть в подбор маршрута, программы, GUIDE, CALLS, Hub и GATES без dead-end экранов.
- Дизайн: использовать только дизайн-систему BUFF IT, токены, существующие компоненты и проверяемую responsive-композицию.
- Приватность: не требовать лишние персональные данные, не обещать медицинский результат, не упоминать VPN на сайте.

## Current Step

Перевести публичный сайт из dark-on-dark и generic stock в единую светлую ceramic media-систему: сначала главная и топ-меню, затем program-аудитории и support/service страницы, сохраняя `/coach/ → /coaching.html → buffit_coaching`, цены и существующие CTA.

## Risks

- Скатиться в generic fitness или зал/качков вместо calisthenics + kettlebell + реальная квартира.
- Добавить красивые, но бесполезные плитки вместо пользовательского сценария.
- Показать технические детали доступа пользователю вместо нормального клиентского текста.
- Выдумать дипломы, клиентские кейсы или медицинские обещания вместо проверяемого процесса и честной границы ответственности.
- Создать второй sales-источник правды рядом с `/coaching.html` или второй визуальный язык рядом с BUFF IT.

## Current Slice Result — 2026-07-22

The light ceramic media skeleton is now end-to-end: homepage, top navigation, coaching, `/coach/`, program audiences, HEALTH, FOOD, APP and GUIDE all resolve through local semantic media contracts. Six lead roles now have distinct desktop and mobile art direction, explicit navigation semantics, and technique checkpoints for visible movements. The next sharpening layer is unique program-specific art inside each audience family; it must reuse the established roles and cannot reintroduce black surfaces, generic stock or page-local background logic. Production publish remains a separate approval step.
