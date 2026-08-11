# Apple-design motion follow-up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the six concrete apple-design-principle gaps found in the four UI surfaces built since the original 2026-08-09 motion revamp (`ThemeToggle`, `LangToggle`, `GradientShimmer`, `RuixenGradientFooter`), bringing them to parity with the springs/reduced-motion/theme conventions the rest of the codebase already follows.

**Architecture:** Five independent, single-concern fixes across four `src/components/ui/*.tsx` files plus one `App.js` wiring change — each closes one gap between a specific new-since-2026-08-09 surface and a convention the original apple-design revamp already established elsewhere (shared springs, theme-token mirroring, live reduced-motion, rAF-batched scroll-linking). No task depends on another; any can ship alone.

**Tech Stack:** React 19, CRA (react-scripts 5), `motion` (already a dependency — already used by `theme-toggle.tsx`, `Hero`, `Reveal`, and the gallery lightbox). No new dependencies.

## Global Constraints

- Only files touched: `src/App.js`, `src/components/ui/ruixen-gradient-footer.tsx`, `src/components/ui/lang-toggle.tsx`, `src/components/ui/gradient-shimmer.tsx`, `src/components/ui/theme-toggle.tsx`.
- No new dependencies. Everything needed (`useReducedMotion`, `useScroll`, `useTransform`, `AnimatePresence`, `useSprings`) is already installed and already imported elsewhere in this codebase.
- Preserve current visual identity: no color/layout changes to any *existing* value. The one new palette (`RUIXEN_STOPS_LIGHT`) is a pure addition for the light theme, not a change to the dark-theme default.
- No new test framework — verification is `npm start` + manual interaction, matching the original 2026-08-09 plan's own constraint for this codebase.
- Reduced-motion handling follows whichever established convention already fits the shape of the effect: opacity-only for icon/content swaps (matches `Reveal`/the gallery lightbox), full static freeze for a continuously-recomputed scroll-linked transform (the footer), live-subscribed rather than mount-only wherever the codebase's other reduced-motion checks already live-subscribe.
- Commit messages: plain, no attribution trailer of any kind — match this repo's existing terse commit style (see `git log`).

---

### Task 1: Footer — theme-adapt the gradient

**Files:**
- Modify: `src/App.js:371-380` (add `RUIXEN_STOPS_LIGHT` near `SHIMMER_LIGHT`)
- Modify: `src/App.js:916-926` (`Footer` function)

**Interfaces:**
- Consumes: `useTheme` from `src/theme.js` (already imported in `App.js:11`); `RuixenGradientFooter`'s existing `stops` prop (`src/components/ui/ruixen-gradient-footer.tsx`, unchanged by this task — it already accepts a `stops` override).
- Produces: `RUIXEN_STOPS_LIGHT` (const, `App.js`) — local to this task, nothing later depends on it.

- [ ] **Step 1: Add the light-theme gradient stops**

In `src/App.js`, immediately after the existing `SHIMMER_LIGHT` block (lines 371-380), add:

```js
// Same hue journey as RuixenGradientFooter's dark-theme default (ember →
// blue → pale → gold → terracotta → magenta), restruck for a paper
// background — the saturated neon version reads muddy against #f7f7f6.
export const RUIXEN_STOPS_LIGHT = [
  { offset: 0, color: '#b0997e' },
  { offset: 0.1827, color: '#5b8fe0' },
  { offset: 0.2837, color: '#8fb4de' },
  { offset: 0.4135, color: '#f3efe4' },
  { offset: 0.5866, color: '#f0c24b' },
  { offset: 0.6827, color: '#e8825e' },
  { offset: 0.8029, color: '#dd7fc9' },
  { offset: 1, color: '#ffc0fd00' },
];
```

- [ ] **Step 2: Pass the light stops to the footer when the theme is light**

In `src/App.js`, change the `Footer` function (lines 916-926) from:

```js
function Footer() {
  return (
    <RuixenGradientFooter gradientHeight="40vh">
      <div className="footer-content">
        <div className="footer-bottom mono">
          © jason tsao · {new Date().getFullYear()}
        </div>
      </div>
    </RuixenGradientFooter>
  );
}
```

to:

```js
function Footer() {
  const isLight = useTheme() === 'light';
  return (
    <RuixenGradientFooter gradientHeight="40vh" stops={isLight ? RUIXEN_STOPS_LIGHT : undefined}>
      <div className="footer-content">
        <div className="footer-bottom mono">
          © jason tsao · {new Date().getFullYear()}
        </div>
      </div>
    </RuixenGradientFooter>
  );
}
```

- [ ] **Step 3: Manual verification**

Run: `npm start`. Scroll to the bottom of the page.

- Dark theme: footer gradient looks exactly as it did before (unchanged default `RUIXEN_STOPS`).
- Switch to light theme (toggle in nav), scroll to the bottom again: the gradient should read as an intentional, restrained warm-to-cool band against the paper background — not a neon smear, not invisible/washed out.
- If it reads wrong, this is a visual/color judgment call — adjust the individual hex values in `RUIXEN_STOPS_LIGHT` directly (keep the same 8 offsets and the same hue order) until it reads right; there's no other logic in this step to get wrong.

- [ ] **Step 4: Commit**

```bash
git add src/App.js
git commit -m "Add light-theme gradient to footer"
```

---

### Task 2: Footer — respect reduced motion and reuse motion's scroll utilities

**Files:**
- Modify: `src/components/ui/ruixen-gradient-footer.tsx` (imports, `bellHeights`/`clamp01` block, component body, band element)

**Interfaces:**
- Consumes: `motion`, `useScroll`, `useTransform`, `useReducedMotion` from `motion/react` (already a project dependency).
- Produces: nothing consumed by later tasks — self-contained to this file.

**Note on approach:** the design spec called for replacing the manual scroll listener with `motion`'s `useScroll`/`useTransform`. A direct `useScroll({ target: bandRef })` doesn't work here — the band is `position: fixed`, so its `getBoundingClientRect()` never changes as the page scrolls, which is exactly what target-relative scroll tracking measures. Instead, this task uses `useScroll()`'s global `scrollY` (an ordinary window-scroll-position value, unaffected by what's fixed) combined with `useTransform` to reproduce the *same* px-threshold formula the original code used:

Original: `left = end − scrollY` (where `end = scrollHeight − innerHeight`), `t = clamp01((h − left) / h)`, `progress = minReveal + (1 − minReveal) · t`. Substituting `start = end − h` gives `t = clamp01((scrollY − start) / (end − start))` — the exact linear-interpolation fraction `useTransform(scrollY, [start, end], [minReveal, 1], { clamp: true })` computes by definition. Same formula, not just a similar-looking one.

- [ ] **Step 1: Update imports**

In `src/components/ui/ruixen-gradient-footer.tsx`, change the top imports from:

```tsx
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
```

to:

```tsx
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
```

- [ ] **Step 2: Replace the scroll-tracking effect**

Change (lines 93-122):

```tsx
  const uid = useId().replace(/:/g, "");
  const bandRef = useRef<HTMLDivElement>(null);
  // minReveal = a flat strip on the floor, 1 = risen to full height.
  const [progress, setProgress] = useState(minReveal);

  useEffect(() => {
    const el = bandRef.current;
    if (!el) return;
    // Bind to the element's OWN window so this tracks the right scroll context
    // on a real page and inside the docs preview iframe alike.
    const doc = el.ownerDocument;
    const win = doc.defaultView ?? window;
    const measure = () => {
      // offsetHeight ignores the transform, so the band can measure itself.
      const h = el.offsetHeight || 1;
      // How much scroll is left before the end of the page. The glow starts
      // rising once that's within its own height, and is full at the bottom.
      const left =
        doc.documentElement.scrollHeight - win.innerHeight - win.scrollY;
      const t = clamp01((h - left) / h);
      setProgress(minReveal + (1 - minReveal) * t);
    };
    measure();
    win.addEventListener("scroll", measure, { passive: true });
    win.addEventListener("resize", measure, { passive: true });
    return () => {
      win.removeEventListener("scroll", measure);
      win.removeEventListener("resize", measure);
    };
  }, [minReveal]);

  const colW = VBW / bars;
```

to:

```tsx
  const uid = useId().replace(/:/g, "");
  const bandRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // Pixel scrollY thresholds where the reveal starts/ends, measured from the
  // band's own height so it still ramps over exactly the last `gradientHeight`
  // of scroll. start = end - h, so this is the same window the old
  // `left`/`t` math used — see the algebra note in the plan.
  const [thresholds, setThresholds] = useState({ start: 0, end: 1 });

  useEffect(() => {
    const el = bandRef.current;
    if (!el) return;
    // Bind to the element's OWN window so this tracks the right scroll context
    // on a real page and inside the docs preview iframe alike.
    const doc = el.ownerDocument;
    const win = doc.defaultView ?? window;
    const measure = () => {
      // offsetHeight ignores the transform, so the band can measure itself.
      const h = el.offsetHeight || 1;
      const end = doc.documentElement.scrollHeight - win.innerHeight;
      setThresholds({ start: end - h, end });
    };
    measure();
    win.addEventListener("resize", measure, { passive: true });
    return () => win.removeEventListener("resize", measure);
  }, []);

  // motion's scrollY is already rAF-batched; chaining useTransform keeps the
  // band updating without a React re-render on every scroll tick. See the
  // "Note on approach" above for why this reproduces the original formula.
  const { scrollY } = useScroll();
  const liveProgress = useTransform(
    scrollY,
    [thresholds.start, thresholds.end],
    [minReveal, 1],
    { clamp: true },
  );
  // Reduced motion: freeze fully revealed instead of continuously
  // recomputing a scroll-linked transform.
  const progress = reduced ? 1 : liveProgress;

  const colW = VBW / bars;
```

- [ ] **Step 3: Remove the now-unused `clamp01` helper**

Step 2 replaced `clamp01`'s only call site (`useTransform`'s `{ clamp: true }` option now does that job), so it's dead code. Change:

```tsx
// Height curve: a gentle power falloff, giving the flatter, pyramid-like rise of
// the original footer (short edges, tallest middle).
function bellHeights(n: number, peak: number, valley: number): number[] {
  const out: number[] = [];
  const mid = (n - 1) / 2;
  for (let i = 0; i < n; i++) {
    const t = mid === 0 ? 0 : Math.abs(i - mid) / mid; // 0 center → 1 edge
    const eased = 1 - Math.pow(t, 1.24);
    out.push(peak * VBH * (valley + (1 - valley) * eased));
  }
  return out;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
```

to:

```tsx
// Height curve: a gentle power falloff, giving the flatter, pyramid-like rise of
// the original footer (short edges, tallest middle).
function bellHeights(n: number, peak: number, valley: number): number[] {
  const out: number[] = [];
  const mid = (n - 1) / 2;
  for (let i = 0; i < n; i++) {
    const t = mid === 0 ? 0 : Math.abs(i - mid) / mid; // 0 center → 1 edge
    const eased = 1 - Math.pow(t, 1.24);
    out.push(peak * VBH * (valley + (1 - valley) * eased));
  }
  return out;
}
```

- [ ] **Step 4: Switch the band element to `motion.div` and drop the manual `scaleY` string**

Change (lines 137-151):

```tsx
      <div
        ref={bandRef}
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          height: gradientHeight,
          pointerEvents: "none",
          transformOrigin: "bottom",
          transform: `scaleY(${progress})`,
          willChange: "transform",
        }}
      >
```

to:

```tsx
      <motion.div
        ref={bandRef}
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          height: gradientHeight,
          pointerEvents: "none",
          transformOrigin: "bottom",
          scaleY: progress,
          willChange: "transform",
        }}
      >
```

And change the matching closing tag (line 187) from `</div>` to `</motion.div>` (the `<svg>...</svg>` between them is unchanged).

- [ ] **Step 5: Manual verification**

Run: `npm start`.

- Scroll down slowly from the top: the footer glow should stay a thin flat strip until you're about one screen-height from the bottom, then rise smoothly to full height exactly as the page bottoms out — same feel as before this change.
- Toggle "Emulate CSS prefers-reduced-motion: reduce" in Chrome DevTools (Rendering tab), reload, scroll anywhere: the footer band should already be at full height, not tied to scroll position at all.
- Resize the window while scrolled near the bottom: the reveal threshold should still track correctly (no jump/snap).

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/ruixen-gradient-footer.tsx
git commit -m "Respect reduced motion and reuse motion's scroll utilities in footer"
```

---

### Task 3: Lang toggle — motion parity with its sibling

**Files:**
- Modify: `src/components/ui/lang-toggle.tsx` (imports, component body)

**Interfaces:**
- Consumes: `useSprings` from `src/motion-presets.js` (existing — produced by the original 2026-08-09 plan's Task 1); `AnimatePresence`, `motion`, `type Transition` from `motion/react`.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add the motion imports**

In `src/components/ui/lang-toggle.tsx`, change:

```tsx
import { setLang, useLang } from "../../i18n";
```

to:

```tsx
import { AnimatePresence, motion, type Transition } from "motion/react";
import { setLang, useLang } from "../../i18n";
import { useSprings } from "../../motion-presets";
```

- [ ] **Step 2: Cross-fade the label on language change**

Change the component body from:

```tsx
export function LangToggle({ className = "" }: LangToggleProps) {
  const isJa = useLang() === "ja";
  const next = isJa ? "en" : "ja";
  const label = isJa ? "English" : "日本語";
  const hint = isJa ? "Switch to English" : "日本語に切り替える";

  return (
    <button
      type="button"
      lang={next}
      aria-label={hint}
      title={hint}
      className={`lang-toggle ${className}`.trim()}
      onClick={() => setLang(next)}
    >
      <span className="lang-toggle-icon"><Globe /></span>
      {label}
    </button>
  );
}
```

to:

```tsx
export function LangToggle({ className = "" }: LangToggleProps) {
  const isJa = useLang() === "ja";
  const next = isJa ? "en" : "ja";
  const label = isJa ? "English" : "日本語";
  const hint = isJa ? "Switch to English" : "日本語に切り替える";
  const s = useSprings();
  // useSprings is untyped JS; its presets are Motion transitions by contract.
  const fade = s.ui as Transition;

  return (
    <button
      type="button"
      lang={next}
      aria-label={hint}
      title={hint}
      className={`lang-toggle ${className}`.trim()}
      onClick={() => setLang(next)}
    >
      <span className="lang-toggle-icon"><Globe /></span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fade}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
```

(`initial={false}` on `AnimatePresence` matches the gallery lightbox's own photo-swap convention in `App.js` — no fade-in on first paint, only on subsequent changes.)

- [ ] **Step 3: Manual verification**

Run: `npm start`.

- Click the language toggle a few times: the label should cross-fade between "日本語" and "English", not hard-cut.
- Click it rapidly several times in a row: no stale/doubled label, no layout shift (the button's `min-width` already reserves room for both labels).
- Toggle `prefers-reduced-motion: reduce` in devtools and repeat: the label should still switch correctly (opacity-only fades aren't gated by reduced motion — they're the same class of change `Reveal` keeps under reduced motion).

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/lang-toggle.tsx
git commit -m "Animate language toggle label swap"
```

---

### Task 4: Shimmer — live reduced-motion

**Files:**
- Modify: `src/components/ui/gradient-shimmer.tsx` (rewrite the sweep effect, lines ~354-452; drop the now-dead `prefersReducedMotion()` helper, lines 207-214)

**Interfaces:** None (no new imports — the live check reads `window.matchMedia` directly, the same global the deleted helper used).

- [ ] **Step 1: Make the reduced-motion check live instead of mount-only**

In `src/components/ui/gradient-shimmer.tsx`, change the sweep effect from:

```tsx
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const textWidth =
        el.getBoundingClientRect().width || FALLBACK_TEXT_WIDTH_PX;
      const fontSize =
        Number.parseFloat(getComputedStyle(el).fontSize) || BASE_FONT_PX;
      const fontScale = fontSize / BASE_FONT_PX;
      const spreadPx = Math.min(
        children.length * safeSpread * fontScale,
        MAX_SPREAD_PX * fontScale,
      );
      const layerWidth = Math.max(1, textWidth + spreadPx * 2);
      const start = -spreadPx - layerWidth / 2;
      const end = textWidth + spreadPx - layerWidth / 2;
      // `duration` is the literal sweep time in seconds, independent of text
      // width — so every shimmer on the page runs at the same frequency.
      const durationMs = safeDuration * 1000;
      el.style.setProperty("--gs-spread", `${spreadPx}px`);
      el.style.setProperty(
        "--gs-spread-mid",
        `${spreadPx * SPREAD_MID_RATIO}px`,
      );
      el.style.backgroundSize = `${layerWidth}px 100%`;
      return { start, end, durationMs };
    };

    // No `background-clip: text` support → the transparent text-fill would hide
    // the text entirely. Strip it so the text renders in its normal color, and
    // skip the sweep (there's nothing to clip the gradient to).
    if (!supportsBackgroundClipText()) {
      revealNormalText(el);
      return;
    }

    // Refine the seeded vars with a real measurement.
    measure();

    if (respectReducedMotion && prefersReducedMotion()) return; // static, no sweep
    if (typeof el.animate !== "function") return; // static, no sweep

    let anim: Animation | null = null;
    let pauseTimer: ReturnType<typeof setTimeout> | undefined;
    let active = true;
    let cancelled = false;

    const runSweep = () => {
      if (cancelled) return;
      const { start, end, durationMs } = measure();
      const next = el.animate(
        [
          { backgroundPosition: `${start}px center` },
          { backgroundPosition: `${end}px center` },
        ],
        { duration: durationMs, easing: easingValue, fill: "forwards" },
      );
      if (!active) next.pause();
      // Cancel the previous (now-finished) sweep only after the next one has taken
      // over the property — otherwise finished `fill: forwards` animations pile up
      // on the element across cycles.
      anim?.cancel();
      anim = next;
      next.onfinish = () => {
        pauseTimer = setTimeout(runSweep, Math.max(0, pauseBetween));
      };
    };

    const stopVisibility = observeShimmerActive(
      el,
      { pauseOnScroll, pauseWhenOffscreen },
      (next) => {
        active = next;
        if (anim) {
          if (active) anim.play();
          else anim.pause();
        }
      },
    );

    runSweep();

    return () => {
      cancelled = true;
      anim?.cancel();
      clearTimeout(pauseTimer);
      stopVisibility();
    };
  }, [
    children,
    safeSpread,
    safeDuration,
    easingValue,
    pauseBetween,
    pauseOnScroll,
    pauseWhenOffscreen,
    respectReducedMotion,
  ]);
```

to:

```tsx
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const textWidth =
        el.getBoundingClientRect().width || FALLBACK_TEXT_WIDTH_PX;
      const fontSize =
        Number.parseFloat(getComputedStyle(el).fontSize) || BASE_FONT_PX;
      const fontScale = fontSize / BASE_FONT_PX;
      const spreadPx = Math.min(
        children.length * safeSpread * fontScale,
        MAX_SPREAD_PX * fontScale,
      );
      const layerWidth = Math.max(1, textWidth + spreadPx * 2);
      const start = -spreadPx - layerWidth / 2;
      const end = textWidth + spreadPx - layerWidth / 2;
      // `duration` is the literal sweep time in seconds, independent of text
      // width — so every shimmer on the page runs at the same frequency.
      const durationMs = safeDuration * 1000;
      el.style.setProperty("--gs-spread", `${spreadPx}px`);
      el.style.setProperty(
        "--gs-spread-mid",
        `${spreadPx * SPREAD_MID_RATIO}px`,
      );
      el.style.backgroundSize = `${layerWidth}px 100%`;
      return { start, end, durationMs };
    };

    // No `background-clip: text` support → the transparent text-fill would hide
    // the text entirely. Strip it so the text renders in its normal color, and
    // skip the sweep (there's nothing to clip the gradient to).
    if (!supportsBackgroundClipText()) {
      revealNormalText(el);
      return;
    }

    // Refine the seeded vars with a real measurement.
    measure();

    if (typeof el.animate !== "function") return; // static, no sweep — no WAAPI, nothing to toggle

    let anim: Animation | null = null;
    let pauseTimer: ReturnType<typeof setTimeout> | undefined;
    let active = true;
    let unmounted = false;

    const runSweep = () => {
      if (unmounted) return;
      const { start, end, durationMs } = measure();
      const next = el.animate(
        [
          { backgroundPosition: `${start}px center` },
          { backgroundPosition: `${end}px center` },
        ],
        { duration: durationMs, easing: easingValue, fill: "forwards" },
      );
      if (!active) next.pause();
      // Cancel the previous (now-finished) sweep only after the next one has taken
      // over the property — otherwise finished `fill: forwards` animations pile up
      // on the element across cycles.
      anim?.cancel();
      anim = next;
      next.onfinish = () => {
        pauseTimer = setTimeout(runSweep, Math.max(0, pauseBetween));
      };
    };

    const stopVisibility = observeShimmerActive(
      el,
      { pauseOnScroll, pauseWhenOffscreen },
      (next) => {
        active = next;
        if (anim) {
          if (active) anim.play();
          else anim.pause();
        }
      },
    );

    // Live-subscribed, not just checked once at mount — toggling the OS
    // setting mid-session now starts/stops the sweep like every other
    // reduced-motion check on the site.
    const mq = respectReducedMotion
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;

    const applyMotionPreference = () => {
      if (mq?.matches) {
        anim?.cancel();
        anim = null;
        clearTimeout(pauseTimer);
      } else if (!anim) {
        runSweep();
      }
    };

    applyMotionPreference();
    mq?.addEventListener("change", applyMotionPreference);

    return () => {
      unmounted = true;
      anim?.cancel();
      clearTimeout(pauseTimer);
      stopVisibility();
      mq?.removeEventListener("change", applyMotionPreference);
    };
  }, [
    children,
    safeSpread,
    safeDuration,
    easingValue,
    pauseBetween,
    pauseOnScroll,
    pauseWhenOffscreen,
    respectReducedMotion,
  ]);
```

- [ ] **Step 2: Remove the now-dead standalone reduced-motion check**

Step 1 above removed the only call site of the old one-shot helper (the live check needs the `MediaQueryList` object itself to attach a listener to, not just a `.matches` snapshot). In `src/components/ui/gradient-shimmer.tsx`, remove:

```tsx
/** True when the user asked for reduced motion. SSR-safe. */
function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
```

- [ ] **Step 3: Manual verification**

Run: `npm start`.

- Hero title should sweep as before on load.
- Toggle "Emulate CSS prefers-reduced-motion: reduce" in Chrome DevTools **without reloading**: the in-flight sweep should stop where it is (static gradient remains visible, just not moving).
- Toggle it back off without reloading: the sweep should resume.
- Reload with the emulation already on: title should render as a static gradient from the start (unchanged from current behavior).

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/gradient-shimmer.tsx
git commit -m "Make shimmer's reduced-motion check live"
```

---

### Task 5: Theme toggle — reduced-motion icon polish

**Files:**
- Modify: `src/components/ui/theme-toggle.tsx:66-85`

**Interfaces:**
- Consumes: `s.reduced` from `useSprings()` (already called in this file for `knobSpring`/`iconFade`).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Drop rotate/scale from the icon swap under reduced motion**

In `src/components/ui/theme-toggle.tsx`, change:

```tsx
        <motion.span
          className="theme-toggle-knob"
          animate={{ x: isLight ? KNOB_TRAVEL : 0 }}
          transition={knobSpring}
        >
          <motion.span
            className="theme-toggle-icon"
            animate={{ opacity: isLight ? 0 : 1, rotate: isLight ? 80 : 0, scale: isLight ? 0.4 : 1 }}
            transition={iconFade}
          >
            <Moon />
          </motion.span>
          <motion.span
            className="theme-toggle-icon"
            animate={{ opacity: isLight ? 1 : 0, rotate: isLight ? 0 : -80, scale: isLight ? 1 : 0.4 }}
            transition={iconFade}
          >
            <Sun />
          </motion.span>
        </motion.span>
```

to:

```tsx
        <motion.span
          className="theme-toggle-knob"
          animate={{ x: isLight ? KNOB_TRAVEL : 0 }}
          transition={knobSpring}
        >
          <motion.span
            className="theme-toggle-icon"
            animate={{
              opacity: isLight ? 0 : 1,
              ...(s.reduced ? {} : { rotate: isLight ? 80 : 0, scale: isLight ? 0.4 : 1 }),
            }}
            transition={iconFade}
          >
            <Moon />
          </motion.span>
          <motion.span
            className="theme-toggle-icon"
            animate={{
              opacity: isLight ? 1 : 0,
              ...(s.reduced ? {} : { rotate: isLight ? 0 : -80, scale: isLight ? 1 : 0.4 }),
            }}
            transition={iconFade}
          >
            <Sun />
          </motion.span>
        </motion.span>
```

(The knob's own `x` slide is intentionally left alone under reduced motion — see the design spec: a toggle's slide is the switch's core functional motion, not decorative flourish, comparable to how native OS toggles still slide under reduced-motion settings.)

- [ ] **Step 2: Manual verification**

Run: `npm start`.

- Normal motion: clicking the theme toggle should look exactly as before (knob slides, icon fades+rotates+scales).
- Toggle `prefers-reduced-motion: reduce` in devtools: clicking the toggle should still slide the knob (unchanged) but the icon should now cross-fade in place with no rotate/scale.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/theme-toggle.tsx
git commit -m "Drop icon rotate/scale under reduced motion in theme toggle"
```

---

### Task 6: Full cross-cutting manual verification pass

**Files:** None — verification only, no code changes.

**Interfaces:** None.

- [ ] **Step 1: Full walkthrough in both themes and both languages**

Run: `npm start`. For each of dark/light theme × English/日本語 (4 combinations):

- Scroll top to bottom once: nav scroll-blur, hero parallax + shimmer sweep, scroll-reveal on every section, footer gradient all look correct for that theme.
- Open/close the terminal modal and the gallery lightbox at least once, including one mid-animation interrupt each (open then immediately close).
- Click the theme toggle and language toggle a few times each, including rapid double-clicks.

- [ ] **Step 2: Accessibility media features**

In Chrome DevTools → Rendering tab, toggle each of the following one at a time (reload between toggles) and repeat a shortened version of Step 1:

- **`prefers-reduced-motion: reduce`** — footer band sits fully revealed regardless of scroll position; hero shimmer renders static; theme-toggle icon swap is opacity-only; lang-toggle label still cross-fades; everything from the original 2026-08-09 revamp (modal, lightbox, scroll-reveal, nav underline) still degrades to plain cross-fades as before.
- **`prefers-reduced-transparency: reduce`** — nav, gallery arrows/lightbox, terminal all still fall back to solid backgrounds as before (this pass didn't touch any `backdrop-filter` surface, so nothing new should appear here — confirm nothing regressed).
- **`prefers-contrast: more`** — theme-toggle and lang-toggle borders are still 2px (confirm the existing rule from `App.css` still applies; this pass didn't touch it).

This task makes no code changes of its own and has no commit — it only confirms Tasks 1-5. If anything fails, fix it within the relevant task above and re-run this pass.
