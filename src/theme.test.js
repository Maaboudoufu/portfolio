import fs from 'fs';
import path from 'path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './components/ui/theme-toggle';
import { SHIMMER_LIGHT } from './App';

// The two palettes in index.css are hand-maintained mirrors of each other, and
// a light theme is exactly where a copied-over dark value stops being legible.
// These read the real stylesheet rather than a fixture so they cannot drift.

const css = fs.readFileSync(path.join(__dirname, 'index.css'), 'utf8');

function tokens(selector) {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`no "${selector}" block in index.css`);
  const body = css.slice(start, css.indexOf('\n}', start));
  const out = {};
  for (const [, name, value] of body.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    out[name] = value.trim();
  }
  return out;
}

const DARK = tokens(':root');
const LIGHT = tokens(':root[data-theme="light"]');

const channel = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  return (
    0.2126 * channel(((n >> 16) & 255) / 255) +
    0.7152 * channel(((n >> 8) & 255) / 255) +
    0.0722 * channel((n & 255) / 255)
  );
}

function contrast(fg, bg) {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

// Foreground token → the surfaces it actually lands on in App.css.
const PAIRS = {
  '--text': ['--bg', '--card'],
  '--white': ['--bg', '--card', '--bg2'],
  '--muted': ['--bg', '--bg2', '--card'],
  '--green': ['--bg', '--card'],
  '--muted-on-glass': ['--bg'],
  '--term-green': ['--bg'],
  '--term-blue': ['--bg', '--card'],
  '--term-blue2': ['--bg'],
  '--term-yellow': ['--bg'],
  '--term-red': ['--bg'],
  '--term-ok': ['--bg'],
  '--term-fg': ['--bg', '--card'],
  '--term-out': ['--bg'],
  '--term-dim': ['--bg'],
};

describe.each([['dark', DARK], ['light', LIGHT]])('%s palette', (name, palette) => {
  test('every foreground clears WCAG AA (4.5:1) on the surfaces it sits on', () => {
    const failures = [];
    for (const [fg, surfaces] of Object.entries(PAIRS)) {
      for (const bg of surfaces) {
        const ratio = contrast(palette[fg], palette[bg]);
        if (ratio < 4.5) failures.push(`${fg} on ${bg} = ${ratio.toFixed(2)}:1`);
      }
    }
    expect(failures).toEqual([]);
  });

  // The knob is filled with --text and its icon punched out in --bg.
  test('theme-toggle knob icon is legible against the knob', () => {
    expect(contrast(palette['--bg'], palette['--text'])).toBeGreaterThanOrEqual(4.5);
  });
});

test('light palette defines every token the dark palette does', () => {
  const missing = Object.keys(DARK).filter((k) => !(k in LIGHT));
  expect(missing).toEqual([]);
});

// --dim is decorative punctuation (`//`, braces, bullet dashes) and has never
// met AA in the dark theme. Hold the light theme to at least that bar so the
// new palette cannot quietly be the worse of the two.
test('light --dim is no dimmer than dark --dim', () => {
  expect(contrast(LIGHT['--dim'], LIGHT['--bg']))
    .toBeGreaterThanOrEqual(contrast(DARK['--dim'], DARK['--bg']));
});

test('light shimmer palette stays readable mid-sweep', () => {
  const weak = SHIMMER_LIGHT.filter(
    (stop) => contrast(stop.color, LIGHT['--bg']) < 4.5,
  );
  expect(weak).toEqual([]);
});

test('toggle flips data-theme and reports state to assistive tech', async () => {
  document.documentElement.setAttribute('data-theme', 'dark');
  render(<ThemeToggle />);

  const toggle = screen.getByRole('switch');
  expect(toggle).toHaveAttribute('aria-checked', 'false');

  await userEvent.click(toggle);
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(toggle).toHaveAttribute('aria-checked', 'true');

  await userEvent.click(toggle);
  expect(document.documentElement.dataset.theme).toBe('dark');
  expect(toggle).toHaveAttribute('aria-checked', 'false');
});
