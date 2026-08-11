import { useSyncExternalStore } from 'react';
import { STRINGS } from './strings';

// Language state, kept outside React for the same reason the theme is (see
// theme.js): <html lang> is the authoritative copy — screen readers announce
// from it and the CJK font fallback keys off it — and React just subscribes.
//
// No boot script needed, unlike the theme: every translated string is rendered
// by React, so nothing can paint in the wrong language before the store exists.

const KEY = 'lang';
const listeners = new Set();

function detect() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'en' || saved === 'ja') return saved;
  } catch {
    /* private mode / storage disabled — fall through to the OS preference */
  }
  // navigator.language is the OS/browser display language. `languages` is not
  // consulted on purpose: someone set to ["en-US", "ja"] wants English first.
  return navigator.language?.toLowerCase().startsWith('ja') ? 'ja' : 'en';
}

let lang = detect();
document.documentElement.lang = lang;

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export function setLang(next) {
  if (next === lang) return;
  lang = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* storage disabled — the choice still applies for this page */
  }
  document.documentElement.lang = next;
  listeners.forEach((fn) => fn());
}

export function useLang() {
  return useSyncExternalStore(subscribe, () => lang, () => 'en');
}

/** The full string table for the active language. */
export function useT() {
  return STRINGS[useLang()];
}

/**
 * Merge a translation overlay onto a data array, by index. `base` keeps the
 * fields that never translate (logos, hrefs, icons); `overlay` — undefined in
 * English — carries only the text. Callers pass `t.<key>`, so this stays a
 * plain function: the language subscription already happened in useT().
 */
export function localize(base, overlay) {
  return overlay ? base.map((item, i) => ({ ...item, ...overlay[i] })) : base;
}
