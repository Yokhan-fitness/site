# BUFF IT Token Table

Source of truth: `css/tokens.css`.

Generated from the current warm wellness token layer. Color primitives use perceptual OKLCH values; derived surfaces use `color-mix(in oklch, ...)`.

## Typography

| Token | Current value |
|---|---|
| `--font-display` | `"Unbounded", sans-serif` |
| `--font-body` | `"Golos Text", sans-serif` |
| `--font-accent` | `Georgia, "Times New Roman", serif` |
| `--font-weight-regular` | `350` |
| `--font-weight-strong` | `600` |
| `--text-xs` | `0.75rem` |
| `--text-sm` | `0.875rem` |
| `--text-md` | `1rem` |
| `--text-lg` | `1.125rem` |
| `--text-xl` | `2rem` |
| `--text-2xl` | `3rem` |
| `--line-tight` | `1.08` |
| `--line-hero` | `1.08` |
| `--line-body` | `1.5` |
| `--letter-spacing-tight` | `0` |
| `--letter-spacing-body` | `0` |

## Color Primitives

| Token | Current value |
|---|---|
| `--color-ink-980` | `oklch(27% 0.035 55)` |
| `--color-ink-900` | `oklch(34% 0.04 58)` |
| `--color-ink-760` | `oklch(45% 0.04 62)` |
| `--color-ink-620` | `oklch(57% 0.04 66)` |
| `--color-cream-80` | `oklch(97.5% 0.025 78)` |
| `--color-cream-120` | `oklch(92.5% 0.034 76)` |
| `--color-cream-180` | `oklch(88% 0.044 74)` |
| `--color-cream-260` | `oklch(80% 0.052 72)` |
| `--color-sage-500` | `oklch(55% 0.035 92)` |
| `--color-moss-700` | `oklch(25% 0.03 65)` |
| `--color-copper-520` | `oklch(62% 0.1 63)` |
| `--color-berry-420` | `oklch(49% 0.055 34)` |
| `--color-sky-420` | `oklch(58% 0.032 230)` |
| `--color-action-520` | `oklch(62% 0.1 63)` |
| `--color-action-620` | `oklch(72% 0.11 78)` |

## Semantic Surfaces

| Token | Current value |
|---|---|
| `--surface-page` | `var(--color-cream-120)` |
| `--surface-page-soft` | `var(--color-cream-80)` |
| `--surface-panel` | `var(--color-cream-80)` |
| `--surface-panel-muted` | `var(--color-cream-180)` |
| `--surface-panel-strong` | `var(--color-cream-80)` |
| `--surface-ink` | `var(--color-cream-180)` |
| `--surface-hero-product` | `var(--color-cream-180)` |
| `--surface-soft` | `color-mix(in oklch, var(--color-ink-900) 6%, transparent)` |
| `--surface-soft-strong` | `color-mix( in oklch, var(--color-ink-900) 11%, transparent )` |
| `--surface-nav` | `color-mix(in oklch, var(--color-cream-80) 88%, transparent)` |
| `--surface-glass` | `color-mix(in oklch, var(--color-cream-80) 72%, transparent)` |
| `--surface-glass-strong` | `color-mix( in oklch, var(--color-cream-80) 86%, transparent )` |
| `--surface-nav-glass` | `color-mix( in oklch, var(--color-cream-80) 70%, transparent )` |
| `--surface-nav-dark` | `color-mix( in oklch, var(--color-cream-80) 78%, transparent )` |
| `--media-wash-light` | `color-mix( in oklch, var(--color-cream-80) 88%, transparent )` |
| `--media-wash-soft` | `color-mix( in oklch, var(--color-cream-80) 48%, transparent )` |
| `--media-wash-hero` | `color-mix( in oklch, var(--color-cream-80) 10%, transparent )` |
| `--surface-warm` | `color-mix(in oklch, var(--color-copper-520) 16%, transparent)` |
| `--surface-warm-strong` | `color-mix( in oklch, var(--color-action-620) 24%, transparent )` |
| `--surface-sage` | `color-mix(in oklch, var(--color-sage-500) 15%, transparent)` |
| `--surface-sky` | `color-mix(in oklch, var(--color-sky-420) 14%, transparent)` |
| `--surface-berry` | `color-mix(in oklch, var(--color-berry-420) 14%, transparent)` |
| `--surface-inverse-soft` | `color-mix( in oklch, var(--color-cream-80) 10%, transparent )` |
| `--media-overlay-soft` | `color-mix( in oklch, var(--color-cream-80) 24%, transparent )` |
| `--media-overlay-strong` | `color-mix( in oklch, var(--color-cream-80) 66%, transparent )` |
| `--media-overlay-deep` | `color-mix( in oklch, var(--color-cream-80) 90%, transparent )` |
| `--media-overlay-hero` | `color-mix( in oklch, var(--color-copper-520) 12%, transparent )` |
| `--promo-height` | `2.25rem` |
| `--media-section-min` | `33.75rem` |
| `--media-card-min` | `28.75rem` |
| `--media-card-min-lg` | `38.75rem` |

## Text And Accents

| Token | Current value |
|---|---|
| `--text-gradient-warm` | `linear-gradient( 118deg, var(--color-ink-980) 0%, var(--color-moss-700) 34%, var(--color-copper-520) 66%, var(--color-action-620) 100% )` |
| `--text-gradient-hero` | `linear-gradient( 118deg, var(--color-ink-980) 0%, var(--color-copper-520) 64%, var(--color-action-520) 100% )` |
| `--text-primary` | `var(--color-ink-980)` |
| `--text-secondary` | `var(--color-ink-760)` |
| `--text-muted` | `color-mix(in oklch, var(--color-ink-900) 58%, transparent)` |
| `--text-inverse` | `var(--color-ink-980)` |
| `--text-inverse-muted` | `color-mix( in oklch, var(--color-ink-900) 80%, transparent )` |
| `--text-inverse-soft` | `color-mix( in oklch, var(--color-ink-900) 72%, transparent )` |
| `--accent-primary` | `var(--color-copper-520)` |
| `--accent-primary-strong` | `var(--color-action-620)` |
| `--accent-warm` | `var(--color-copper-520)` |
| `--accent-sage` | `var(--color-sage-500)` |
| `--accent-sky` | `var(--color-sky-420)` |
| `--accent-berry` | `var(--color-berry-420)` |
| `--accent-action` | `var(--color-action-520)` |
| `--accent-action-strong` | `var(--color-action-620)` |

## Borders And Elevation

| Token | Current value |
|---|---|
| `--border-subtle` | `1px solid color-mix(in oklch, var(--color-ink-900) 12%, transparent)` |
| `--border-strong` | `1px solid color-mix(in oklch, var(--color-ink-900) 22%, transparent)` |
| `--border-inverse` | `1px solid color-mix(in oklch, var(--color-cream-80) 30%, transparent)` |
| `--border-glass` | `1px solid color-mix(in oklch, var(--color-cream-80) 44%, transparent)` |
| `--border-nav-inverse` | `1px solid color-mix(in oklch, var(--color-cream-80) 32%, transparent)` |
| `--shadow-soft` | `0 32px 90px color-mix(in oklch, var(--color-ink-900) 16%, transparent)` |
| `--shadow-card` | `0 20px 50px color-mix(in oklch, var(--color-ink-900) 10%, transparent)` |
| `--shadow-glass` | `0 22px 70px color-mix(in oklch, var(--color-ink-900) 18%, transparent)` |
| `--shadow-nav-solid` | `0 18px 64px color-mix(in oklch, var(--color-ink-900) 12%, transparent)` |
| `--shadow-text-hero` | `0 0 2rem color-mix(in oklch, var(--color-ink-980) 36%, transparent)` |
| `--border-width-strong` | `0.1875rem` |
| `--shadow-dot` | `0 0 0 var(--space-half) var(--surface-warm)` |

## Radius

| Token | Current value |
|---|---|
| `--radius-xs` | `0.375rem` |
| `--radius-sm` | `0.75rem` |
| `--radius-md` | `1.125rem` |
| `--radius-lg` | `1.6875rem` |
| `--radius-pill` | `999px` |
| `--radius-hero` | `3rem` |

## Spacing

| Token | Current value |
|---|---|
| `--space-min` | `0.25rem` |
| `--space-half` | `0.5rem` |
| `--space-base` | `1rem` |
| `--space-1-5` | `1.5rem` |
| `--space-2` | `2rem` |
| `--space-lg` | `4rem` |

## Layout And Sizing

| Token | Current value |
|---|---|
| `--content-xs` | `16.25rem` |
| `--content-sm` | `21.25rem` |
| `--content-md` | `28.75rem` |
| `--content-card` | `24.375rem` |
| `--content-lg` | `47.5rem` |
| `--content-xl` | `57.5rem` |
| `--content-2xl` | `77.5rem` |
| `--viewport-min` | `20rem` |
| `--viewport-full` | `100svh` |
| `--layout-max` | `var(--content-2xl)` |
| `--layout-frame-inset` | `1.25rem` |
| `--content-mobile-max` | `var(--content-sm)` |
| `--section-padding-y` | `var(--space-lg)` |
| `--section-padding-x` | `var(--space-base)` |
| `--shell-padding-x` | `var(--section-padding-x)` |
| `--hero-shell-width` | `95vw` |
| `--hero-shell-max` | `96rem` |
| `--hero-min-height` | `calc(var(--viewport-full) - var(--space-base))` |
| `--hero-padding` | `clamp(var(--space-lg), 6vw, calc(var(--space-lg) * 1.5))` |
| `--hero-padding-mobile` | `var(--space-1-5)` |
| `--hero-image-position` | `center center` |
| `--hero-border` | `1px solid color-mix(in oklch, var(--color-cream-80) 16%, transparent)` |
| `--hero-shadow` | `0 3rem 7rem color-mix(in oklch, var(--color-ink-900) 22%, transparent)` |
| `--hero-overlay` | `linear-gradient( 90deg, color-mix(in oklch, var(--color-cream-80) 94%, transparent) 0%, color-mix(in oklch, var(--color-cream-80) 80%, transparent) 38%, color-mix(in oklch, var(--color-cream-120) 34%, transparent) 64%, transparent 100% )` |
| `--hero-tint` | `linear-gradient( 180deg, color-mix(in oklch, var(--color-cream-80) 14%, transparent), color-mix(in oklch, var(--color-copper-520) 8%, transparent) )` |
| `--nav-height` | `4.5rem` |
| `--nav-height-pdp` | `5.625rem` |
| `--nav-mobile-height` | `9.75rem` |
| `--nav-panel-radius` | `var(--radius-hero)` |
| `--nav-menu-panel-height` | `clamp(32rem, 60svh, 36rem)` |
| `--nav-menu-feature-min` | `9rem` |
| `--nav-menu-list-min` | `4rem` |
| `--nav-mobile-panel-max-height` | `calc(100svh - var(--nav-height) - var(--space-base))` |
| `--nav-menu-offset` | `calc(var(--nav-height) + var(--space-half))` |
| `--nav-solid-offset` | `7.5rem` |
| `--nav-dropdown-surface` | `var(--surface-page-soft)` |
| `--nav-dropdown-surface-glow` | `radial-gradient(circle at 24% 0%, color-mix(in oklch, var(--color-action-620) 22%, transparent), transparent 34%)` |
| `--nav-dropdown-lead-overlay` | `linear-gradient(180deg, color-mix(in oklch, var(--color-cream-80) 18%, transparent) 0%, color-mix(in oklch, var(--color-cream-80) 82%, transparent) 100%)` |
| `--nav-dropdown-lead-surface` | `linear-gradient(135deg, color-mix(in oklch, var(--color-cream-260) 72%, var(--color-cream-80)), color-mix(in oklch, var(--color-action-620) 30%, var(--color-cream-80)))` |
| `--nav-card-surface` | `color-mix(in oklch, var(--color-cream-180) 56%, var(--color-cream-80))` |
| `--nav-chip-surface` | `color-mix(in oklch, var(--color-cream-80) 72%, transparent)` |
| `--nav-chip-lead-surface` | `color-mix(in oklch, var(--color-cream-80) 88%, transparent)` |
| `--nav-chip-hover-surface` | `radial-gradient(circle at 50% 0%, var(--control-glow), transparent 72%), color-mix(in oklch, var(--color-action-620) 18%, var(--color-cream-80))` |
| `--nav-chip-hover-border` | `color-mix(in oklch, var(--color-action-620) 34%, transparent)` |
| `--nav-chip-hover-shadow` | `inset 0 0 0 var(--border-width-strong) var(--control-glow-edge), 0 0 var(--control-glow-size) color-mix(in oklch, var(--color-action-620) 10%, transparent)` |
| `--button-min-height` | `2.875rem` |
| `--card-min` | `14.375rem` |
| `--card-min-lg` | `18.75rem` |
| `--metric-dot-size` | `0.625rem` |
| `--section-padding-y` | `calc(var(--space-lg) * 1.5)` |
| `--section-padding-x` | `var(--space-2)` |

## Effects And Motion

| Token | Current value |
|---|---|
| `--focus-ring` | `0 0 0 3px color-mix(in oklch, var(--color-sage-500) 32%, transparent)` |
| `--blur-control` | `blur(18px) saturate(130%)` |
| `--blur-glass` | `blur(26px) saturate(140%)` |
| `--blur-nav-default` | `blur(28px) saturate(145%)` |
| `--blur-nav-solid` | `blur(22px) saturate(150%)` |
| `--control-glow` | `color-mix(in oklch, var(--color-action-620) 44%, transparent)` |
| `--control-glow-edge` | `color-mix(in oklch, var(--color-cream-80) 8%, transparent)` |
| `--control-glow-size` | `9rem` |
| `--motion-fast` | `0ms` |
| `--motion-reduced` | `0.01ms` |
| `--motion-nav-ui` | `240ms` |
| `--motion-nav-surface` | `920ms` |
| `--motion-nav` | `var(--motion-nav-ui)` |
| `--motion-nav-content` | `220ms` |
| `--motion-nav-content-delay` | `0ms` |
| `--motion-nav-close-delay` | `140ms` |
| `--motion-nav-switch` | `120ms` |
| `--motion-nav-ease` | `cubic-bezier(0.4, 0, 0.2, 1)` |

## Images

| Token | Current value |
|---|---|
| `--image-hero` | `var(--image-app)` |
| `--image-brand-kit` | `none` |
| `--image-women` | desktop `image-set(...b03-08-women-strength-ceramic-desktop-v3...)`; mobile alias below `45rem` |
| `--image-women-mobile` | `image-set(...b03-08-women-strength-ceramic-mobile-v3...)` |
| `--image-men` | desktop `image-set(...b03-07-men-capability-ceramic-desktop-v3...)`; mobile alias below `45rem` |
| `--image-men-mobile` | `image-set(...b03-07-men-capability-ceramic-mobile-v3...)` |
| `--image-health` | desktop `image-set(...b01-09-health-safe-return-ceramic-desktop-v3...)`; mobile alias below `45rem` |
| `--image-health-mobile` | `image-set(...b01-09-health-safe-return-ceramic-mobile-v3...)` |
| `--image-food` | desktop `image-set(...b01-10-food-rhythm-ceramic-desktop-v3...)`; mobile alias below `45rem` |
| `--image-food-mobile` | `image-set(...b01-10-food-rhythm-ceramic-mobile-v3...)` |
| `--image-guide` | desktop `image-set(...b01-08-guide-materials-ceramic-desktop-v2...)`; mobile alias below `45rem` |
| `--image-guide-mobile` | `image-set(...b01-08-guide-materials-ceramic-mobile-v2...)` |
| `--image-app` | desktop `image-set(...b01-07-app-in-use-ceramic-desktop-v3...)`; mobile alias below `45rem` |
| `--image-app-mobile` | `image-set(...b01-07-app-in-use-ceramic-mobile-v3...)` |
| `--image-calls` | `image-set(...b01-06-calls-igor-ceramic-desktop-v6...)` |
| `--image-fitness` | `var(--image-women)` |
| `--image-method` | `var(--image-health)` |
