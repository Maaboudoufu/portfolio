# Apple-design motion revamp — follow-up audit

**Date:** 2026-08-10
**Status:** approved
**Follows:** [2026-08-09-apple-design-motion-revamp-design.md](./2026-08-09-apple-design-motion-revamp-design.md)

## Goal

The 2026-08-09 revamp covered the site as it existed then (nav, terminal modal, gallery lightbox, scroll-reveal, press feedback, reduced-motion/transparency/contrast fallbacks) and was implemented and review-fixed in full. Since then, four new surfaces landed without going through the same pass: `ThemeToggle`, `LangToggle`, `GradientShimmer` (hero title), and `RuixenGradientFooter` (page footer) — all in `src/components/ui/`. This spec brings those four to parity with the conventions the original revamp established.

## Non-goals

Same as the original spec: no visual/color/layout redesign, no new drag gestures. Additionally out of scope for this pass: the body font's unification to JetBrains Mono (a separate, already-shipped decision) and its typography sizing — this pass is motion/interaction/accessibility behavior only.

## Current state (baseline)

All four new surfaces already do a lot right: `ThemeToggle` and the nav's active-section indicator both pull spring config from the shared `useSprings()` (`src/motion-presets.js`); `GradientShimmer` already gates its sweep on viewport visibility, scroll-idle, and (once) reduced motion; the high-contrast media query in `App.css` was already extended to cover both new toggles. The gaps are narrower and concentrated:

- `src/components/ui/ruixen-gradient-footer.tsx` — `RUIXEN_STOPS` (lines 27–36) is a fixed dark-tuned rainbow gradient with no light-theme counterpart, unlike every token in `index.css`. Its scroll-driven reveal (`useEffect`, lines 98–122) has no `prefers-reduced-motion` check anywhere in the file, and drives itself with raw `scroll`/`resize` listeners + `getBoundingClientRect` math instead of `motion`'s `useScroll`/`useTransform`, which `Hero`'s own parallax (`App.js`, `figureY = useTransform(scrollY, ...)`) already uses for a near-identical scroll-tied transform.
- `src/components/ui/lang-toggle.tsx` — the label swap (line 47, `{label}`) is a plain text node; switching language hard-cuts with no transition, unlike `ThemeToggle` sitting right next to it in the same nav cluster, which animates every state change.
- `src/components/ui/gradient-shimmer.tsx` — `prefersReducedMotion()` (lines 207–214) is read once inside the mount effect (line 394) rather than subscribed to, so toggling the OS reduced-motion setting mid-session doesn't stop an in-flight sweep, unlike every `motion`-based reduced-motion check elsewhere on the site.
- `src/components/ui/theme-toggle.tsx` — the icon swap's `animate` targets (lines 71–84) keep `rotate`/`scale` under reduced motion; only the transition duration shortens. `Reveal.js` and the gallery lightbox's established convention elsewhere is to drop the spatial/transform component entirely under reduced motion and animate opacity only.

## Design

### 1. Footer — theme-adapt the gradient
Add `RUIXEN_STOPS_LIGHT` to `ruixen-gradient-footer.tsx`, recalibrated the same way `SHIMMER_LIGHT` (`App.js`) was recalibrated from the shimmer's dark default — same hue sequence, restruck for a `#f7f7f6` background. `Footer()` in `App.js` reads `useTheme()` (it doesn't yet) and passes `stops={isLight ? RUIXEN_STOPS_LIGHT : undefined}` into `RuixenGradientFooter`, mirroring exactly how `Hero` already theme-switches `GradientShimmer`'s `gradient` prop.

### 2. Footer — respect reduced motion
Import `useReducedMotion` from `motion/react` (already a dependency; `theme-toggle.tsx` already imports it). When true, skip attaching the scroll/resize listeners in the measurement effect and render the band at `scaleY(1)` (fully revealed, static) instead of continuously recomputing progress off scroll.

### 3. Footer — reuse the scroll-linking the codebase already has
Replace the manual listener + `getBoundingClientRect` effect with `motion`'s `useScroll`/`useTransform` bound to the band ref, producing the same `scaleY` progress value `Hero`'s parallax already gets this way — rAF-batched instead of a raw scroll callback, one fewer bespoke measurement path in the codebase.

### 4. Lang toggle — motion parity with its sibling
Wrap the label in a keyed `motion.span` inside `AnimatePresence mode="wait"`, cross-fading on language change via `useSprings().ui` — the same spring source `ThemeToggle`, the nav underline, `Reveal`, and the gallery lightbox all already pull from.

### 5. Shimmer — live reduced-motion
Add a `change` listener on the same `matchMedia('(prefers-reduced-motion: reduce)')` object already being queried once, mirroring the `visibilitychange` listener `observeShimmerActive` already wires up in the same file. On change: cancel/restart the sweep. No new dependency — keeps the component's own stated "zero runtime dependency" design intent.

### 6. Theme toggle — reduced-motion icon polish
Under `s.reduced`, drop `rotate`/`scale` from the icon's `animate` object and animate `opacity` only, matching `Reveal`/lightbox's established reduced-motion convention. The knob's own `x` slide is unaffected — a toggle's slide is the switch's core functional motion (comparable to how a native OS toggle still slides under reduced-motion settings), not decorative flourish.

## Verification

No new test framework, manual pass per the original spec's convention:
- Toggle theme and language repeatedly, including mid-animation interrupts on the theme toggle knob.
- Scroll to the footer in both themes — gradient should read correctly (not muddy/low-contrast) in light mode.
- Toggle `prefers-reduced-motion` in devtools mid-session: footer scroll-link freezes fully-revealed, hero shimmer sweep stops without a reload, theme-toggle icon swap drops its rotate/scale, lang-toggle label still cross-fades (opacity only would also be acceptable — the fade itself isn't spatial).
- Toggle `prefers-reduced-transparency` / `prefers-contrast: more` — confirm nothing in the four new surfaces regressed (none of them use `backdrop-filter`, so no new fallback rules are expected there; contrast already covers both toggles).
- Interrupt test: rapid-toggle the language button and the theme button several times in a row — each should smoothly redirect from wherever it currently is, no flash or stale label.
