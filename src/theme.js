import { useSyncExternalStore } from 'react';

// Theme state lives on <html data-theme>, not in React — the boot script in
// public/index.html sets it before first paint, so the DOM is the source of
// truth and React just subscribes to it.

const KEY = 'theme';
const META_COLOR = { light: '#f7f7f6', dark: '#0d0d0d' };

const listeners = new Set();

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

const read = () =>
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

// The switch is deliberately instant. document.startViewTransition looked like
// the right tool — one native cross-fade over every surface — but a view
// transition rasterizes the page into a flat snapshot, and backdrop-filter has
// no live backdrop to sample inside one. The navbar and both terminals lost
// their blur for the length of the fade and read as flat gray slabs.
//
// ponytail: instant flip, no easing between palettes. To ease it, register the
// color tokens with @property { syntax: '<color>' } and transition them on
// :root — the surfaces stay live, so glass keeps its backdrop. Shadow and
// --veil-rgb tokens can't be registered that way and would still snap.
export function setTheme(next) {
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* private mode / storage disabled — the theme still applies for this page */
  }

  document.documentElement.dataset.theme = next;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', META_COLOR[next]);
  listeners.forEach((fn) => fn());
}

export function useTheme() {
  return useSyncExternalStore(subscribe, read, () => 'dark');
}
