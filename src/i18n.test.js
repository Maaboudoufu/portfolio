import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LangToggle } from './components/ui/lang-toggle';
import { STRINGS } from './strings';
import { localize } from './i18n';
import { EXPERIENCE, ORGANIZATIONS, CERTS, PROJECTS, SKILL_GROUPS, TERMINAL_LINES } from './App';
import { INFO, FS_FILES } from './TerminalSession';

// The Japanese overlays merge onto their base arrays *by index* (see localize
// in i18n.js). A short overlay is invisible at runtime — the extra entry just
// renders in English — so the coverage checks below are what catches it.

const OVERLAYS = {
  experience: [EXPERIENCE, STRINGS.ja.experience],
  organizations: [ORGANIZATIONS, STRINGS.ja.organizations],
  certs: [CERTS, STRINGS.ja.certs],
  projects: [PROJECTS, STRINGS.ja.projects],
  skillGroups: [SKILL_GROUPS, STRINGS.ja.skillGroups],
  terminalLines: [TERMINAL_LINES, STRINGS.ja.terminalLines],
  neofetch: [INFO, STRINGS.ja.neofetch],
};

describe.each(Object.entries(OVERLAYS))('ja overlay: %s', (name, [base, overlay]) => {
  test('covers every entry of the array it merges onto', () => {
    expect(overlay).toHaveLength(base.length);
  });
});

test('ja translates every file in the virtual filesystem', () => {
  const missing = Object.keys(FS_FILES).filter((p) => !(p in STRINGS.ja.fsFiles));
  expect(missing).toEqual([]);
});

// A key present in en but absent in ja renders as `undefined` — silent in
// development, blank on the page.
function keyPaths(node, prefix = '') {
  if (node === null || typeof node !== 'object' || Array.isArray(node)) return [prefix];
  return Object.entries(node).flatMap(([k, v]) => keyPaths(v, prefix ? `${prefix}.${k}` : k));
}

test('ja defines every UI string en does', () => {
  const ja = new Set(keyPaths(STRINGS.ja));
  expect(keyPaths(STRINGS.en).filter((k) => !ja.has(k))).toEqual([]);
});

test('localize keeps untranslated fields and leaves English alone', () => {
  const [job] = localize(EXPERIENCE, STRINGS.ja.experience);
  expect(job.title).toBe(STRINGS.ja.experience[0].title);
  expect(job.logo).toBe(EXPERIENCE[0].logo);        // never translated
  expect(localize(EXPERIENCE, undefined)).toBe(EXPERIENCE);
});

test('every certificate keeps its verification link in Japanese', () => {
  const localized = localize(CERTS, STRINGS.ja.certs);
  expect(localized.map((c) => c.href)).toEqual(CERTS.map((c) => c.href));
});

// ── language selection ───────────────────────────────────────────────────────

/** Re-imports i18n.js so its module-load detection runs against this state. */
async function boot({ navigator: navLang, saved }) {
  jest.resetModules();
  localStorage.clear();
  if (saved) localStorage.setItem('lang', saved);
  Object.defineProperty(window.navigator, 'language', { value: navLang, configurable: true });
  await import('./i18n');
  return document.documentElement.lang;
}

test('defaults to the OS language, and a saved choice outranks it', async () => {
  expect(await boot({ navigator: 'ja-JP' })).toBe('ja');
  expect(await boot({ navigator: 'ja' })).toBe('ja');
  expect(await boot({ navigator: 'en-US' })).toBe('en');
  // ["en-US", "ja"] means English first — only the primary language counts.
  expect(await boot({ navigator: 'en-GB', saved: 'ja' })).toBe('ja');
  expect(await boot({ navigator: 'ja-JP', saved: 'en' })).toBe('en');
});

test('toggle switches the page language and always offers the other one', async () => {
  await boot({ navigator: 'en-US' });
  render(<LangToggle />);

  const button = screen.getByRole('button', { name: '日本語に切り替える' });
  await userEvent.click(button);

  expect(document.documentElement.lang).toBe('ja');
  expect(localStorage.getItem('lang')).toBe('ja');
  expect(screen.getByRole('button', { name: 'Switch to English' })).toBeInTheDocument();
});
