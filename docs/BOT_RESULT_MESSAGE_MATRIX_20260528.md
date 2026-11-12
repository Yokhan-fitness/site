# BUFF IT Bot Result Message Matrix — 2026-05-28

## Purpose

This is the copy contract for the next bot iteration. The site already sends distinct `start` params, the bot preserves them, and the first BUFF IT route picker now exists. The next receiver should turn source + route + answers into one of these result routes instead of stopping at broad route selection.

## Result Routes

| Result | When to use | User-facing message direction | Primary CTA | Secondary CTA |
|---|---|---|---|---|
| `hot-fit` | Goal is urgent, format/budget acceptable, no red flags | Маршрут собран. Дальше лучше коротко согласовать стартовую неделю, оборудование и формат 2+ДЗ или 3 тренировки. | Написать Игорю | Смотреть программу |
| `warm-fit` | Goal is real, but there are doubts, constraints, or route ambiguity | Похоже, цель подходит для 12-недельного маршрута, но есть детали. Один короткий разбор сэкономит недели проб и ошибок. | Запросить разбор | Посмотреть метод |
| `not-ready` | Interested, but not ready to buy | Не надо покупать на эмоции. Возьми гайд, посмотри базу и вернись к диагностике, когда станет яснее. | Получить гайд | Канал |
| `diy-budget` | Wants structure, but not full coach-led support | Если хочется самому и дешевле, предложить разовую консультацию за 5–8к: цель, ограничения, научно обоснованная программа и одна коррекция через неделю по отзывам. | Запросить разбор | Гайд новичка |
| `medical-red-flag` | Pain, injury, neurological symptoms, fever, or unsafe state | Тут не надо продавливаться в тренировку. Сначала безопасность и медицинская рамка, потом нагрузка. | HEALTH / безопасный старт | Первая помощь |
| `food-barrier` | Goal is blocked by food chaos | Цель упирается не только в тренировки. Нужен простой пищевой ритм и корзина без отдельной войны. | Питание и корзина | Подобрать маршрут |

## Copy Rules

- Do not sell coaching when the result is `medical-red-flag`.
- Do not sell the future self-training subscription as active; the current budget offer is only a one-time 5–8k consultation with one follow-up correction.
- Do not overpromise fat loss, pain relief, mental health outcomes, or medical treatment.
- Keep the tone warm, direct, and concrete: what we saw, what it means, what to do next.
- Use source param as context, not as the only decision-maker. Final route should combine source, answers, readiness, budget/format, and red flags.

## Next Implementation Step

Extend the current BUFF IT route picker into route-specific diagnostics/results. Source-param can preselect context, the picker confirms the broad goal, and the next layer should classify readiness, budget/format fit, safety constraints, and food/support blockers.

## Site Outcome Layer

| Result | Site proof section | What the page must prove |
|---|---|---|
| `hot-fit` | `programs.html[data-outcome="hot-fit"]` | The user can stop browsing and agree the start week. |
| `warm-fit` | `calls-access.html[data-outcome="warm-fit"]` | The call removes risk and ambiguity; it is not a pressure trap. |
| `not-ready` | `guide.html[data-outcome="not-ready"]` | There is a useful non-purchase path and a return route. |
| `diy-budget` | `self-training.html[data-outcome="diy-budget"]` | The one-time 5–8k consultation is distinct from full coaching. |
| `medical-red-flag` | `health.html[data-outcome="medical-red-flag"]` | Safety boundaries come before training claims. |
| `food-barrier` | `nutrition.html[data-outcome="food-barrier"]` | Food rhythm and basket are part of making training repeatable. |
