<!-- PROGRESSIVE_STATUS
id: buffit-public-ceramic-media-system
status: active
updated: 2026-07-22
readiness: 25
plan: 100
inventory: 70
production: 30
cleanup: 35
tags: progressive-jpeg,design,landing,media
next: unique program-specific media inside each audience family, then production publish after approval
-->

# BUFF IT Public Visual Contract

## Active UI profile — owner decision, 2026-10-17

The old brown/beige BUF UI is superseded by the shared Logik default, with
light/dark modes and explicit Estet selection preserved. Use DS foundations and
semantic consumer aliases, not copied palette values or per-page button skins.
Keep accepted layouts, navigation, copy, photos, product art and premium gold.
The historical ceramic direction below describes prior image/source context;
it does not authorize warm UI fills, halos or chocolate text in current pages.

## Register and job

- Register: brand-first public landing with product-grade navigation.
- Primary job: help a sedentary adult recognise their situation, choose a realistic route and reach the current coaching, program, guide or service action.
- Business priority: improve route comprehension and qualified conversion without gym theatre, body shame or false proof.

## Ceramic light direction

- Black and near-black surfaces are prohibited. Dark values may be used only as warm brown text or small functional marks with verified contrast.
- The base world is flat warm ceramic: cream, oat, clay, mushroom, linen, muted copper, sage and warm wood.
- Photography stays readable in its own midtones. Do not darken a weak image with an opaque black overlay.
- Copy over media uses a light directional ceramic wash and warm dark-brown text. If that cannot produce contrast, change the crop or use a bounded ceramic copy plate.
- Shadows describe elevation; gradients may shape a media wash but never replace the declared flat base surface.

## Image language

- Real-life tension comes first: work, limited time, ordinary food, apartment scale, cautious start, skill progression.
- Casting is attractive, healthy-looking, well-groomed and approachable, with relaxed confidence and natural skin. Bodies are attainable and shaped rather than extreme. Realism belongs to the situation, schedule and environment; it must not be expressed through defeated faces, neglect, bad posture or deliberately unflattering styling. Generated people never represent clients, testimonials or transformations.
- The commercial image may be aspirational without becoming influencer fantasy: considered hair and clothing, flattering advertising light and a strong silhouette are required; plastic retouching, fashion posing, fake luxury and “successful success” remain prohibited.
- Clothing: stone, clay, mushroom, cream, muted olive, dusty terracotta. Pure black clothing and glossy matching fitness sets are prohibited.
- Equipment: bronzed iron, cork, pale wood, clay and muted olive rubber. No pure-black or near-black object wall, commercial gym or blue tech glow.
- Lighting: daylight, overcast window light or warm practical household light with visible room detail. Reject crushed shadows and cinematic darkness.

## Semantic media roles

| Role | User question | Typical scene |
|---|---|---|
| `life-fit` | «Это поместится в мою жизнь?» | Home training beside a real work/living context |
| `route-choice` | «С чего мне начать?» | Phone, simple marks and training objects on a ceramic surface |
| `women-strength` | «Это про силу без объективации?» | Respectful home split squat or hinge |
| `men-capability` | «Стану ли я сильнее без качалки?» | Calm pull-up/carry progression at home |
| `health-safety` | «Здесь учтут ограничения?» | Mobility or low-entry movement without clinic cues |
| `food-rhythm` | «Можно ли есть нормально?» | Ordinary household food and repeatable prep |
| `human-guidance` | «Что меняется от тренера?» | Live correction or demonstration, not an office call |
| `service-object` | «Что откроется после клика?» | One tactile object metaphor, no fake UI |

## Navigation differentiation contract

Photography is part of the information architecture. At thumbnail or menu-card size, a visitor should recognise the route from the scene silhouette before reading the label.

- Adjacent roles must differ in at least four of these six dimensions: location, light regime, camera/framing, action family, subject type and accent palette.
- No batch-level prompt may force every role into the same apartment, daylight, camera distance or right-aligned body composition.
- Ceramic is a material/color family, not one beige exposure. Clay side light, cool overcast sage, soft oat window light, warm kitchen practicals and crisp parchment still-life light may coexist.
- Exercise imagery must declare observable technique checkpoints. An unclear action is rejected even when anatomy is superficially plausible.
- Object/service roles should use a different visual grammar from human movement: closer lens, top-down or over-shoulder framing, and one dominant object silhouette.
- Responsive variants preserve role, scene and subject, but mobile is a separately composed 4:5 frame rather than a blind crop.

The machine-readable source for the active six-role matrix is `data/media-role-contract.json`. The validator proves declared differentiation and asset wiring; biomechanical acceptance remains a required visual review.

## Component rules

- Screen anatomy: flat ceramic root → independent media/background layer → content frame → optional light wash/plate → product organisms.
- Hero and feature media remain section backgrounds or declared media slots; they never become a separate accidental row on narrow screens.
- Top-menu imagery belongs only to the lead card on desktop. Mobile keeps route recognition compact and does not download decorative menu media unless the card is opened.
- Program cards use one audience-specific image, one decision label and one primary route. No decorative duplicate image blocks.
- Responsive pairs preserve the same scene, person, light and product job. Mobile is an art-directed crop/export, not a portrait pasted inside a landscape frame.

## Page grid contract

- `wide-frame` owns visible page chrome and large media framing. It may be wider than content, but its internal copy aligns to the content grid.
- `content-grid` is the shared 12-column desktop layout with one max width and one gutter contract. Section content, header content and hero copy align to it.
- `readable-span` occupies a declared subset of the content grid for long text; it is not an unrelated second page width.
- Full-bleed backgrounds and media are independent background compositions. They never become a new content-width owner.
- On mobile, all three roles collapse to the same stable page gutter. A visible media surface may become full bleed only when the component explicitly declares that responsive variant.

## Rejection gate

Reject before integration when the result contains black-dominant styling, dark-on-dark copy, office stock, private gym, showroom interior, influencer posing, sexualised framing, body shame, fake readable UI, medical promise, distorted anatomy or a crop that loses the action.

Also reject when two roles could be mistaken for the same photo session after labels are hidden, when equipment anchoring is ambiguous, or when a limb/joint position does not satisfy the role's declared technique checkpoints.
