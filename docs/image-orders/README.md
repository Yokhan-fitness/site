# BUFF IT Image Orders

This folder is not a prompt dump and not a list of exercises to draw. It is the production art-direction system for BUFF IT website visuals.

Each image must work as a small salesperson on the page: it should make the visitor understand the offer faster, trust it more, and feel that the system fits real life. The movement is proof, not the whole idea.

## 2025-2026 Art Direction

Use these principles for all generated images:

1. Trust beats spectacle. The image must feel real enough that a skeptical visitor does not smell AI stock.
2. Lived-in premium beats sterile luxury. Warm apartment, tactile objects, visible life, clean but not showroom-perfect.
3. Calm confidence beats fitness aggression. BUFF IT is not gym domination, bootcamp pain, CrossFit chaos, or bodybuilding.
4. Local specificity beats generic wellness. Russian/Eastern European apartment logic, normal food, normal schedule, work desk, small home training setup.
5. Useful moment beats pose. Show a person about to train, choosing the route, checking a plan, recovering, shopping, logging progress, or doing a controlled progression.
6. Brand objects should whisper. Small BUFF IT marks on bottle, towel, mat, kettlebell, notebook, access card. Never a giant logo.
7. AI-proof the frame. Natural skin, imperfect room details, believable hands, no fake readable UI, no fake body transformation, no plastic retouching.
8. Ceramic light beats black premium. Keep room detail, skin and clothing in the midtones; pure black and near-black dominant frames are rejected.
9. Route recognition beats collection consistency. Keep the ceramic material family, but deliberately change location, light, lens, action and accent so images navigate instead of merging into one beige shoot.

## Current Product Contract

The public BUFF IT story is not generic fitness. Every external-site image should support this product frame:

- BUFF IT is a system of training, food and life rhythm for people with sedentary work.
- The core goals are body transformation, sustainable weight loss, healthy back, soft start and advanced training.
- The roadmap is a 3-month cycle: remove chaos, build rhythm, lock in the result and choose the next level.
- The human proof is grounded: "I am the same" means laptop work, calls, stiff neck/back, meals between tasks, limited time and a need for realistic training.
- Infographic-adjacent images should make the rhythm easier to understand: route, week, objects, food, access and next action.

## Prompt Assembly

For every image combine:

1. `Site/slot contract` from this README.
2. `Marketing job` from the batch row.
3. `Director scene` from the batch row.
4. `Base prompt P1` for human/lifestyle shots or `Base prompt P2` for object/product/food shots.
5. `Composition/crop` from the batch row and slot contract.
6. `Reject if` from the batch row.

Do not treat the movement vocabulary as a checklist to show everything. Pick the movement only when it makes the page promise visible.

Never reuse a universal scene paragraph across audience roles. Read `data/media-role-contract.json` first and let the selected role own the opening scene, light, camera and action. Shared brand constraints belong at the end of the prompt; they must not flatten the worlds into one apartment template.

## Differentiation and technique gate

Before generation:

1. Compare the selected role with every other lead/navigation role.
2. Confirm at least four declared dimensions differ: location, light, camera, action, subject, accent.
3. For movement, copy the role's `techniqueChecks` into the prompt as observable geometry; do not ask the generator for vague "correct technique".
4. Prefer technically legible movements over spectacular ones. Remove bands, weights or unstable props when their anchoring cannot be shown unambiguously.

After generation:

1. Hide labels and inspect a contact sheet at menu-card scale.
2. Reject if roles feel like consecutive frames from one shoot.
3. Inspect hands, feet, joint alignment, support/anchor, load path and equipment continuity at full resolution.
4. A validator passing does not approve biomechanics; `technicalReview.status` must be `approved` only after the image itself was inspected.

## Site/slot Contract

| Slot | Where Used | Master Size | Required Exports | Safe Zone |
|---|---|---:|---|---|
| `hero-wide-left-copy` | first viewport hero: `index.html`, `program-*.html`, `men.html`, `women.html`, Hub hero | 4096x2304, 16:9 | 1920x1080, 1440x810, 1080x1350 crop | Left 42-46% stays calm for H1/CTA. Main subject sits right 54-92%. |
| `hero-wide-right-copy` | rare pages with right-side text | 4096x2304, 16:9 | 1920x1080, 1440x810, 1080x1350 crop | Right 42-46% stays calm for text. Main subject sits left 8-46%. |
| `feature-media` | large section media and proof blocks | 3200x2133, 3:2; add a separate 4:5 mobile master when the media becomes a full-width stack | 1600x1067 desktop; 800x1000 mobile when art-directed | Desktop and mobile preserve the same scene, identity, light and product job, but each composition is framed deliberately. Never place a vertical portrait inside a landscape canvas or rely on `object-fit` to invent the mobile shot. |
| `program-card` | program cards and route cards | 2400x3000, 4:5 | 1200x1500, 1000x1250, optional 1:1 center crop | The promise must read in the upper 70%. Bottom cannot carry critical information. |
| `service-square` | Hub dock, service tiles, link cards | 2048x2048, 1:1 | 512x512, 256x256, 128x128 | One object or simple object group must read at 64px. No complex scene. |
| `food-flatlay` | nutrition, SmartCart, food cards | 3000x2400, 5:4 or 3000x3000, 1:1 | 1600x1280, 1200x1200 | Top-down or near top-down. If used as hero, keep top or left safe for copy. |

## BUFF IT Visual Contract

- World: home health system around training, food, guidance, calls, app, GATES access, and progress.
- Space: believable modern apartment or studio, daylight or warm practical light, wood, textile, bronzed tools, cream/oat/clay/mushroom, muted copper and sage.
- Person: commercially attractive, healthy-looking, well-groomed and approachable adult with a natural face and believable skin, without bodybuilding or influencer gloss. Realism belongs to the situation, schedule and location; it must not make the person look defeated, neglected or like a “before” frame. Vary age, build and casting for the target route.
- Body language: focused, calm, useful, in control. No pain face, flexing, shame, or victory scream.
- Training base: calisthenics plus kettlebell. Pull-up bar, rings, parallettes/bars, mat, kettlebell, band, bottle and towel in clay, cork, bronzed iron, pale wood or muted-olive rubber rather than a black object wall.
- Food base: normal home food, protein, vegetables, grains/potatoes, grocery note, leftovers/containers if useful. No diet-culture salad stock.
- Product base: phone/laptop may show only abstract non-readable shapes. No fake final UI, no private data.

## Movement Vocabulary

Use these as cinematic proof points, not as literal required subjects:

| Movement | Best Use | How It Should Feel | Reject If |
|---|---|---|---|
| Pull-up / chin-up | men, athlete body, pull-ups, training | controlled home bar/rings progression, quiet strength | street workout trick, gym lat pulldown, shirtless hero |
| Inverted row / seated band row | back, entry, method | posture, desk-life recovery, shoulder control | cable row machine, rehab clinic, bodybuilding back spread |
| Bulgarian split squat | glutes, women, new image | strength in ordinary apartment life, stable setup | sexualized angle, model-only glam, gym mirror pose |
| Single-leg hinge / single-leg RDL | image, glutes, mobility, back | balance, control, body awareness | ballet fantasy, unsafe range, posing |
| Leg raise / hanging knee raise | front hang, pull-up progress, core | progression and control, not final trick | extreme front lever spectacle, outdoor park hero |
| Push-up / dip | entry, athlete body, power exit | accessible strength, bars/parallettes, calm effort | bench press, chest-day gym, failure face |
| Kettlebell carry | maintenance, men, daily strength | practical loaded walking, posture, usefulness | military/aggressive carry, outdoor bootcamp |
| Kettlebell swing | full body, weight, self-training | rhythm, hinge, safe motion | flying kettlebell, CrossFit chaos |
| Kettlebell press | strength, men, self-training | vertical strength, calm bracing | competitive weightlifting, grimacing ego shot |
| Downward dog / wall handstand | mobility, safety, flexible body | shoulder/hip control, recovery and preparation | yoga influencer fantasy, contortion |

## Shot Types

| Type | What It Sells | How To Shoot |
|---|---|---|
| `life-fit hero` | "This system fits my real life." | Wide cinematic apartment shot, person integrated with work/home/training. |
| `decision still` | "I know what to do next." | Phone/notebook/objects arranged like a clear route, not a dashboard. |
| `proof moment` | "This is a real method." | Movement plus notebook/checklist/call/product object as evidence. |
| `service token` | "This service is one click away." | Square object symbol, simple silhouette, premium material. |
| `food system` | "Food can be normal and controlled." | Flat lay, grocery logic, portions without calorie panic. |

## Base Prompt P1 -- Human / Lifestyle / Movement

Photorealistic premium lifestyle image for a modern fitness/wellness brand called BUFF IT.

Scene: a real modern one-room apartment or spacious studio with ordinary good repair, warm ceramic palette, wooden floor, daylight or soft practical household lighting, cozy but not showroom-perfect. The space feels like a believable modern Russian/Eastern European apartment: work desk, monitor, used ergonomic chair, wall-mounted TV, small lamp, plant, shelves, mat, rings or pull-up bar if needed. Preserve visible detail in the shadows.

Main subject: a commercially attractive, healthy-looking, well-groomed and approachable Eastern European / Russian adult with a believable build for the target route, natural face and skin texture, neither bodybuilder nor influencer-glossy. Realism belongs to the lived-in situation, not to fatigue, neglect, sadness or a “before” look. Clothing is simple stone, mushroom, clay, cream, muted olive or dusty terracotta training wear with natural creases. Pure black and glossy matching sets are prohibited. The exact scene is defined by the order. Movement should feel functional, controlled, safe and believable.

Training objects: bronzed-iron kettlebell, muted-olive resistance band, cork/clay mat, towel, warm-metal or stone bottle, massage ball, optional pale-wood or brushed-bronze rings/bar/parallettes depending on scene. Subtle BUFF IT branding only on small objects, copper or tone-on-tone.

Visual style: calm light home wellness, photographic natural light with a controlled advertising fill, subtle grain, realistic dynamic range, tactile materials and lived-in details. The image should feel considered because of composition and material quality, not darkness or luxury props.

Global avoid: commercial gym, bodybuilding, blue accents, glossy stock photo, CrossFit box, shirtless flexing, pure black, near-black surfaces, dark-on-dark clothing, crushed shadows, over-dark frame, CGI look, perfect model face, medical clinic, clutter, fake UI, loud logo.

## Base Prompt P2 -- Product / Object / Flat Lay

Photorealistic premium product or lifestyle still life for a modern fitness/wellness brand called BUFF IT.

Scene: warm ceramic apartment or minimal studio surface with tactile materials: light wood, stone, cork, linen, bronzed metal, muted copper and sage accents. Lighting is soft natural/studio hybrid with open realistic shadows.

Objects: choose only objects required by the order. Common BUFF IT objects are a bronzed kettlebell, stone/metal water bottle, massage ball, resistance band, folded towel, cork blocks, clay mat, phone/laptop with abstract non-readable UI shapes, grocery list or food when the order is nutrition. When Igor is the subject, notebooks are excluded.

Composition variant is defined by the order:

- `hero still life`: objects on one side, clean text-safe space on the other.
- `flat lay`: top-down or near top-down, food/tools arranged with deliberate spacing.
- `service-square`: one strong centered object group that reads at icon size.

Branding: subtle small BUFF IT labels, bronze/tone-on-tone. Never huge. Never cheap.

Global avoid: glossy CGI, loud logo, saturated colors, blue UI glow, pure white sterile background, black-dominant composition, crushed shadows, fake final app screens, private data, clutter, aggressive sports aesthetic.

## Acceptance Gate

Reject the image if any answer is "no":

1. Does the image have a clear page job?
2. Does it make the page easier to trust or understand?
3. Does it look like BUFF IT, not generic fitness/wellness?
4. Does it crop correctly for the declared slot?
5. Does it avoid gym/bodybuilder/influencer/medical/diet-stock language?
6. Does it feel plausible as a 2025-2026 premium home health brand?
7. When the slot has responsive art direction, do desktop and mobile feel like two deliberate photographs of the same moment rather than unrelated generations or a blind crop?

## Naming

Use stable English filenames:

- `b01-01-home-hero-life-fit.png`
- `b01-10-nutrition-flatlay-smartcart.png`
- `b02-07-pullup-progress-home.png`
- `b03-03-gates-service-token.png`

Keep raw generations in `assets/generated/raw/`. Put approved exports in `assets/generated/web/`.

## Codex execution contract

Codex can execute these orders directly through the installed `$imagegen` skill and built-in image generation tool. The normal built-in path uses the signed-in Codex session and does not need a separate API key.

For each approved order:

1. Read this file and the selected batch row.
2. Convert the row into the skill's structured prompt without inventing extra people, proof, claims, logos, or UI.
3. Generate one deliberate asset or variant per call; inspect the result against the acceptance gate.
4. Copy the selected raw output from `$CODEX_HOME/generated_images/` to `assets/generated/raw/`.
5. Create the required responsive exports under `assets/generated/web/`, then wire only the approved export into HTML/CSS.
6. Verify dimensions, file size, crop, safe zone, alt text, public MIME and desktop/mobile rendering.

The API/CLI generator is a fallback, not the default. It is used only after an explicit request for CLI/API-specific controls and requires a locally configured `OPENAI_API_KEY`.

## Installed ceramic set — 2026-07-22

| Role | Approved source | Primary consumers |
|---|---|---|
| Life-fit homepage | `b01-01-home-life-fit-ceramic-*-v3` | responsive homepage hero |
| Human guidance | `b01-06-calls-igor-ceramic-*-v6` | coaching hero, CALLS, navigation |
| Live training proof | `b01-06d-trainer-proof-ceramic-*-v6` | coaching proof, method, `/coach/` |
| APP in use | `b01-07-app-in-use-ceramic-*-v3` | APP, self-training, training |
| Guide materials | `b01-08-guide-materials-ceramic-v2` | GUIDE, links, materials navigation |
| Safe return | `b01-09-health-safe-return-ceramic-*-v3` | HEALTH, safe-entry routes, approach navigation |
| Food rhythm | `b01-10-food-rhythm-ceramic-*-v3` | FOOD and nutrition routes |
| Men capability | `b03-07-men-capability-ceramic-*-v3` | pull-up, athlete and skill routes |
| Women strength | `b03-08-women-strength-ceramic-*-v3` | women, glutes, image and shape routes |
