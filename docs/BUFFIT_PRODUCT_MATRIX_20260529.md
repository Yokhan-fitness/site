# BUFF IT product matrix -- 2026-05-29

## Current ladder

- Free launch diagnostics: goal, limits, schedule, first route.
- One-time self-start consult: 5-8k, science-based program, one correction after a week.
- 12-week coaching: 2+homework or 3/week, launch 26k/34k, later 32k/42k.
- Guide/channel: warm path for people who are not ready to buy.

## Route matrix

| Label | Need | Page | Start param | Promise | Tools |
|---|---|---|---|---|---|
| образ | Подготовь тело к новому образу | `program-new-image.html` | `buffit_new_image` | Хочется, чтобы тело соответствовало новой роли: одежде, фото, встречам, отношениям, работе и ощущению себя. | APP держит план, FOOD снижает пищевой хаос, CALLS помогает разобрать старт, GUIDE закрывает тревогу новичка. |
| вес | Похудеть навсегда | `program-weight-loss.html` | `buffit_weight_loss` | Нужно перестать жить в цикле "собрался-сорвался" и убрать вес так, чтобы не потерять себя в голоде и вине. | FOOD/smartcart здесь главный помощник: покупки, замены и корзина. APP фиксирует план, чат держит корректировки. |
| фигура | Топ ягодицы | `program-glutes.html` | `buffit_glutes` | Хочется формы, которая видна в одежде и на фото, без марафона на ненависти к себе. | APP держит прогрессию, CALLS помогает с техникой, FOOD поддерживает форму через питание и восстановление. |
| спина | Здоровая спина | `program-healthy-back.html` | `buffit_back` | Сидячая работа, шея, плечи или спина начинают мешать жить и работать спокойно. | HEALTH задает границы, CALLS помогает разобрать симптомы и технику, APP держит домашние действия. |
| сила | Тело атлета | `program-athlete-body.html` | `buffit_athlete_body` | Тело должно соответствовать уровню жизни: выглядеть собранно, держать нагрузку и не казаться побочным эффектом сидячей работы. | APP фиксирует план и прогрессию, CALLS помогает с техникой, FOOD подключается, если форма упирается в питание. |
| старт | Вход в фитнес | `program-entry-fitness.html` | `buffit_entry` | Нужно начать без стыда, боли и ощущения, что фитнес уже требует быть подготовленным. | GUIDE снижает тревогу, HEALTH помогает отделить ограничения, APP держит первые задания и отметки. |
| навык | Подтягивание | `program-pull-ups.html` | `buffit_pullups` | Нужен видимый маркер силы: подойти к турнику и сделать то, что раньше казалось недоступным. | APP отслеживает прогрессии, CALLS полезен для техники, HEALTH включается при боли или ограничениях. |
| самостоятельно | Самостоятельный старт | `self-training.html` | `buffit_self_waitlist` | Есть дисциплина, но нужна не случайная программа, а точный план и одна проверка после первой недели. | разовая консультация 5-8к |
| еда | Еда срывает прогресс | `nutrition.html` | `buffit_program_picker -> food-barrier` | Покупки, голод, доставка и хаос дома мешают телу больше, чем отсутствие мотивации. | FOOD / smartcart |
| безопасность | Боль или ограничения | `health.html` | `buffit_health_check` | Сначала отделяем фитнес-задачу от симптомов, где нужен врач или другой режим. | HEALTH, safety guide |
| прогрев | Пока не готов покупать | `guide.html` | `buffit_guide` | Нужен маленький полезный шаг без давления: понять базу, снизить тревогу и вернуться к маршруту. | GUIDE, Telegram channel |

## Implementation note

The site should sell the client goal first, then show the format and tools. APP/CALLS/FOOD/GUIDE/HEALTH are support layers around the 12-week route, not disconnected product ads.
