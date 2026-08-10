# Apple-design motion revamp

**Date:** 2026-08-09
**Status:** approved

## Goal

Apply Apple's fluid-interface principles (from the `apple-design` skill — instant response, interruptible springs, momentum, materials, optical typography) to the existing portfolio, without touching its current visual identity (colors, fonts, layout).

**Correction (2026-08-09):** an earlier draft of this spec referenced an "amber phosphor" redesign from memory. That redesign was never actually committed to this repo (verified via git log/branches/stashes across `src/index.css` and `src/App.css` — no trace of it exists). The owner confirmed the site should keep its actual current visuals (see baseline below), not the memory's description. The stale memory has been corrected.

## Non-goals

- No visual/color/layout redesign. Tokens, fonts, and current layout stay exactly as they are.
- No new drag gestures (no swipe-to-dismiss, no swipe-between-photos). Interaction stays click/keyboard-driven; only the *transitions* become spring-based.
- No section-replay-on-scroll-back gimmicks.

## Current state (baseline)

- CRA app (react-scripts), no router, no animation dependency. Two components: `App.js` (page, 774 lines) and `TerminalSession.js` (interactive shell modal, 581 lines).
- Visual identity today: dark theme (`--bg: #080808`), single green accent (`--green: #a8ff78`, terminal-prompt only), Inter body font + JetBrains Mono for terminal/mono text. `TerminalSession.js`'s modal uses macOS-style red/yellow/green traffic-light dots (`.ts-dot-red/yellow/green`). This is the actual, current, live visual identity — the spec preserves it as-is.
- All motion today is CSS `transition`/`@keyframes`: simple hover fades, one one-way entrance keyframe on the terminal modal (`ts-slide-in`), **no exit animation** on the modal, **no transition at all** on the gallery lightbox (open, close, or prev/next).
- Nav already has correct translucent-material behavior (`backdrop-filter` blur, `.navbar.scrolled` state) — this stays as-is.
- Typography already applies some tracking discipline (hero `-2px` on large display text at `.hero-title`, App.css:100; uppercase `.section-label` at `+2px`, App.css:290) — only gaps get fixed, not a rewrite.

## Design

### 1. Foundations
- Add dependency: `motion` (npm package, successor to Framer Motion).
- `src/motion-presets.js`: exports `springs` (`ui`: bounce 0/duration 0.4 — default; `drawer`: bounce 0.2/duration 0.3 — modal & lightbox only) and a `useSprings()` helper that collapses every preset to `{ duration: 0.15 }` (plain cross-fade) when `useReducedMotion()` is true. One shared source of truth instead of inline config per component.

### 2. Terminal modal (`TerminalSession.js`)
- Wrap `.ts-window` in `motion.div` inside `AnimatePresence`; animate opacity/scale/y with `springs.drawer` both directions (currently: enter-only CSS keyframe, no exit).
- Backdrop (`.ts-overlay`) fades independently with `springs.ui`, no scale.
- Window transform-origin anchored toward the Hero trigger button (§7 spatial consistency — arrives from where it was opened).

### 3. Gallery lightbox (`Gallery` in `App.js`)
- Same `motion.div` + `AnimatePresence` open/close treatment (currently: zero transition).
- Prev/next: `AnimatePresence mode="wait"` keyed on `selectedIdx`, directional slide (next from right, prev from left) using `springs.ui` — hints gesture direction per §8 instead of a hard `src` swap.

### 4. Scroll-reveal
- New `src/Reveal.js`: thin `motion.div` wrapper — `initial={{opacity:0, y:16}}`, `whileInView={{opacity:1, y:0}}`, `viewport={{once:true, margin:'-80px'}}`, spring from the shared presets (falls back to plain fade under reduced motion).
- Every top-level section (`About`, `Experience`, `Organizations`, `Skills`, `Certs`, `Projects`, `Contact`) wraps its content in one `<Reveal>` — one line added per component.

### 5. Nav active-section indicator
- IntersectionObserver on section ids (already implied by the existing anchor links) drives which nav link is "active"; `layoutId` (from `motion`) gives a shared-element spring between nav items for free. Existing scroll-blur behavior untouched.

### 6. Global press feedback
- CSS-only, no JS: `:active { transform: scale(0.97); transition: transform 100ms ease-out; }` on buttons, links, `.gh-card`, gallery items. Cheapest fix for §1 (respond on press, not just hover) — native CSS, not a motion-library concern.

### 7. Typography
- Audit pass only: spot-check headings/labels for missing tracking per §15, fix only what's actually missing. No global rewrite — most of the scale already does this correctly.

### 8. Accessibility
- `prefers-reduced-motion`: wired through `springs()`/`Reveal` everywhere (see Foundations).
- `prefers-reduced-transparency` and `prefers-contrast` (currently unhandled anywhere in the CSS): add the two media queries from apple-design §14, scoped to translucent surfaces (nav, modal, lightbox controls) — raise background opacity + drop blur under reduced-transparency; solid background + defined border under more-contrast.

## Verification

No new test framework. Manual pass after implementation:
- Open/close terminal modal and gallery lightbox repeatedly, including interrupting mid-animation (open then immediately close) — confirm no visual jump, exit spring plays from wherever the enter spring currently is.
- Scroll through every section, confirm reveal timing/margins feel right, confirm `once: true` (no replay on scroll-back).
- Toggle `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast` in devtools and repeat the above — confirm graceful fallbacks.
- Confirm Escape closes both modal and lightbox (existing lightbox behavior; verify modal parity during implementation).
