"use client";

// Theme Toggle — a pill switch whose knob springs between a moon and a sun.
//
// The knob carries the icon for the theme you're *in*; the far end of the track
// shows a dim icon for the theme you'd switch *to*, so the control reads before
// it's used. Everything the eye lands on is driven by <html data-theme>, which
// flips synchronously (see src/theme.js) — the spring is only the knob.

import { motion, type Transition } from "motion/react";
import { setTheme, useTheme } from "../../theme";
import { useSprings } from "../../motion-presets";

/** Track width − knob width − both paddings. Mirrors the CSS in App.css. */
const KNOB_TRAVEL = 26;

// Tabler geometry, inlined rather than pulled from react-icons: those are typed
// as returning ReactNode under React 19, which this repo's TS cannot accept in
// JSX. Same icon set as the skill tags, same stroke idiom as ICONS in App.js.
const icon = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const Moon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...icon}>
    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
  </svg>
);

const Sun = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...icon}>
    <circle cx="12" cy="12" r="4" />
    <path d="M3 12h1M12 3v1M20 12h1M12 20v1M5.6 5.6l.7.7M18.4 5.6l-.7.7M17.7 17.7l.7.7M6.3 17.7l-.7.7" />
  </svg>
);

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const isLight = useTheme() === "light";
  const s = useSprings();
  // useSprings is untyped JS; its presets are Motion transitions by contract.
  const knobSpring = s.drawer as Transition;
  const iconFade = s.ui as Transition;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label="Light theme"
      title={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className={`theme-toggle ${className}`.trim()}
      onClick={() => setTheme(isLight ? "dark" : "light")}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-ghost theme-toggle-ghost-moon"><Moon /></span>
        <span className="theme-toggle-ghost theme-toggle-ghost-sun"><Sun /></span>

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
      </span>
    </button>
  );
}
