"use client";

// Language Toggle — a two-state pill that always shows the language you'd
// switch *to*, same convention as the theme toggle's ghost icon. The label is
// tagged with `lang` so the browser picks a Japanese face for 日本語 even while
// the surrounding page is English.

import { AnimatePresence, motion, type Transition } from "motion/react";
import { setLang, useLang } from "../../i18n";
import { useSprings } from "../../motion-presets";

// Tabler `world`, inlined for the same reason as the theme toggle's icons.
const Globe = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M3.6 9h16.8M3.6 15h16.8" />
    <path d="M11.5 3a17 17 0 0 0 0 18M12.5 3a17 17 0 0 1 0 18" />
  </svg>
);

export interface LangToggleProps {
  className?: string;
}

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
