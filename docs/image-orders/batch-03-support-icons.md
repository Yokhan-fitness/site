# Image Order Batch 03 -- Support Sections And Service Sources

Batch 03 covers service dock sources, support pages, category heroes, self-training, and front-hang route visuals.

Service images are source material, not final SVG icons. They should give the design system a clear object metaphor and premium material direction. If a square image needs a label to be understood, it failed.

| ID | Site/slot | Use in UI | Marketing job | Director scene | Why it sells | Composition/crop | Reject if |
|---|---|---|---|---|---|---|---|
| B03-01 | `service-square` | Hub dock / APP source | Make APP feel like the training control surface, not the product itself. | Phone with abstract training cards on mat/towel surface; band or small kettlebell nearby. The phone is next to real tools, not floating in tech space. | User understands APP supports the training, it does not replace the body work. | Centered 1:1. Main phone/tool silhouette readable at 64px. Optional 16:9 crop for app page. | Fake detailed UI, blue glow, random phone stock, SaaS onboarding look. |
| B03-02 | `service-square` | Hub dock / CALLS source | Make CALLS feel like weekly clarity and accountability. | Laptop edge, notebook with simple marks, pen, water bottle, small kettlebell detail, warm lamp shadow. No faces on screen. | A call is positioned as "разбор недели", not office meeting or therapy session. | 1:1 centered on laptop + notebook. Must read as conversation/planning at small size. | Zoom UI details, office meeting stock, headset cliche, medical consultation. |
| B03-03 | `service-square` | Hub dock / GATES source | Make GATES feel like secure access to the ecosystem without using legacy network/security wording. | Warm stone access token beside a cream phone or laptop edge, brushed-copper line, bottle or bronzed kettlebell in background. | Communicates "your services open here" without cyberpunk or technical fear. | Centered square, one strong symbol, high silhouette contrast at 64px. | Black tech styling, cyberpunk, padlock cliche as main object, old access wording, hacker UI. |
| B03-04 | `service-square` | Hub dock / SmartCart source | Make SmartCart feel like normal shopping made easier. | Top-down grocery flat lay: vegetables, protein, grains/potatoes, list, phone edge, water bottle, warm kitchen table. | Food service looks like weekly household control, not diet punishment. | 1:1 top-down flat lay. Must still read as food/cart at 64px. | Supplement ad, messy groceries, luxury restaurant food, detox salad stock. |
| B03-05 | `service-square` | Hub dock / GUIDE source | Make GUIDE feel like a useful manual the user can actually open. | Booklet/notebook with bookmark, pencil, massage ball, mat edge, one bronze marker. No generated readable paragraphs. | Turns docs into a practical companion, not a wall of text. | 1:1, booklet/notebook silhouette clear. | Academic paper, dense fake text, medical manual, bureaucracy folder. |
| B03-06 | `service-square` | Hub dock / PHOTO source | Make PHOTO feel like private progress control, not body exposure. | Phone/camera on neutral textile surface, towel, kettlebell/band detail; no body photos visible. | Keeps progress photos useful and privacy-safe. | 1:1, camera/phone silhouette clear at small size. | Before/after body thumbnails, gallery grid, beauty retouching, private images. |
| B03-07 | `hero-wide-left-copy` | `men.html` category hero | Sell men's route as calm capability after desk life. | Overcast residential calisthenics court beneath a pale canopy. A 30-40-year-old man holds the controlled upper half of a strict pull-up on a fixed brushed-bronze bar: full closed pronated grip, neutral wrists, shoulders down, elbows beside the trunk, vertical body without swing. No band. | Useful strength reads through the unmistakable bar silhouette and outdoor capability world, not aggression. | Low-angle 28mm environmental frame; subject right, left text-safe; separately composed 4:5. | Loose/one-ended bar, resistance band, crossed or missing limbs, swinging, aggressive masculinity, shirtless pump, gym mirror, street-workout stunt. |
| B03-08 | `hero-wide-left-copy` | `women.html` category hero | Sell women's route as confidence, strength and normal life, not body display. | Warm brick residential courtyard in late side sun. A 35-45-year-old woman performs a controlled low step-up on a stable pale-stone platform: whole leading foot planted, knee aligned over second toe, pelvis level, torso upright with only a slight natural lean. | The route reads as grounded everyday strength and has its own outdoor clay world rather than another home workout. | Eye-level 35mm wide environmental frame; respectful full-body subject right, left text-safe; separately composed 4:5. | Partial foot on platform, knee collapse, unstable furniture, weights, butt-focused crop, glamour fitness, perfect model, fashion shoot. |
| B03-09 | `feature-media` | `self-training.html` | Sell independent training as structured, not lonely. | Person uses timer/notebook near rings/bar/mat, preparing push-up, inverted row setup, or kettlebell swing. The plan is visible as simple marks, not readable text. | DIY route feels guided enough to start, but still self-directed. | 16:9 or 3:2. Balance human/action with objects. | Fake app dashboard, chaotic room, no route/plan cue, "alone and confused" mood. |
| B03-10 | `program-card` + `hero-wide-left-copy` | `program-front-hang.html` | Sell front hang as progression and core control, not a final stunt. | Hanging knee raise, leg raise, hollow-body hold, or tuck front lever progression on rings/bar. Calm effort and clear body line. | Advanced skill becomes reachable through steps, not intimidation. | 4:5 crop must show bar/rings and legs/core. 16:9 hero with left copy zone. | Full front lever hero pose, outdoor park, unsafe angle, elite trick flex. |

## Icon Production Note

After generation, do not drop service photos directly into the dock if they fight the UI. Use them as source references for:

- simplified pictograms;
- muted service thumbnails;
- Storybook/design-system icon tiles;
- social/section thumbnails where photo detail is acceptable.

## Batch 03 Acceptance

- [ ] Six service squares read at 64px.
- [ ] APP/GATES/SmartCart do not show fake internal product state.
- [ ] GATES never uses legacy network/security wording on the website.
- [ ] Men/women visuals are clearly home calisthenics/girya, not gym.
- [ ] Front hang uses progression, not final spectacle.
- [ ] Every service visual has one clear object metaphor.
