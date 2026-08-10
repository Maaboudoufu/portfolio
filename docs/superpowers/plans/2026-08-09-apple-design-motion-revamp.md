# Apple-design motion revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Layer Apple-style fluid motion (interruptible springs, momentum-hinted transitions, scroll-reveal, instant press feedback) onto the portfolio's existing visuals, without changing colors, fonts, or layout.

**Architecture:** One new dependency (`motion`) plus two small shared files (`src/motion-presets.js`, `src/Reveal.js`) that every motion-bearing component imports from, so spring config and reduced-motion handling live in one place instead of being duplicated per component. Six independently-shippable tasks, each touching a distinct interactive surface.

**Tech Stack:** React 19, CRA (react-scripts 5), `motion` (npm package, successor to Framer Motion, React bindings at `motion/react`).

## Global Constraints

- Only new dependency allowed: `motion` (npm). No other packages.
- Preserve current visual identity exactly: tokens in `src/index.css` (`--bg: #080808`, `--green: #a8ff78`, etc.), Inter body font, JetBrains Mono mono font, macOS-style traffic-light dots in the terminal modal. No color/typography/layout redesign.
- No new drag gestures. Interaction stays click/keyboard-driven; only transitions become spring-based.
- Every spring-driven component must degrade to a plain `{ duration: 0.15 }` cross-fade (no scale/slide offset) when `useReducedMotion()` is true — via the shared `useSprings()` hook from `src/motion-presets.js`, not a per-component special case.
- No new test framework. Verification is `npm start` + manual interaction per task (this repo has no meaningful existing test suite for UI behavior — `App.test.js` is the untouched CRA smoke test).
- Typography audit (from the design spec) found no gaps: all four existing uppercase/label elements already carry positive letter-spacing (`.section-label` 2px, and three others at 1–1.5px — App.css:290,660,978,1062), and the two large display headings already carry negative tracking (`.hero-title` -2px at App.css:100, `.section-title` -1px at App.css:307). No typography task in this plan — there's nothing to fix.

---

### Task 1: Foundations + terminal modal spring transitions

**Files:**
- Modify: `package.json` (add `motion` dependency)
- Create: `src/motion-presets.js`
- Modify: `src/TerminalSession.js:1-2` (imports), `src/TerminalSession.js:560-581` (Modal wrapper)
- Modify: `src/TerminalSession.css:1-36` (remove now-redundant CSS keyframe animations)
- Modify: `src/App.js:1-3` (imports), `src/App.js:762` (wrap conditional render in `AnimatePresence`)

**Interfaces:**
- Produces: `springs` (object: `{ ui, drawer }` spring configs) and `useSprings()` (hook returning `{ ui, drawer, reduced }`, collapsed to plain fades when reduced motion is on) from `src/motion-presets.js` — consumed by Tasks 2, 3, 4.

- [ ] **Step 1: Install the `motion` package**

Run: `npm install motion`
Expected: `package.json` gets a new `"motion": "^..."` entry under `dependencies`; `package-lock.json` updates.

- [ ] **Step 2: Create the shared spring-presets file**

Create `src/motion-presets.js`:

```js
import { useReducedMotion } from 'motion/react';

const REDUCED = { duration: 0.15 };

export const springs = {
  ui:     { type: 'spring', bounce: 0,   duration: 0.4 },
  drawer: { type: 'spring', bounce: 0.2, duration: 0.3 },
};

export function useSprings() {
  const reduced = useReducedMotion();
  return reduced
    ? { ui: REDUCED, drawer: REDUCED, reduced: true }
    : { ...springs, reduced: false };
}
```

- [ ] **Step 3: Replace the terminal modal wrapper with a spring-animated version**

In `src/TerminalSession.js`, change the imports (line 1-2) from:

```js
import { useState, useEffect, useRef, useCallback } from 'react';
import './TerminalSession.css';
```

to:

```js
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './TerminalSession.css';
import { useSprings } from './motion-presets';
```

Then replace the `Modal wrapper` section (currently lines 558-581):

```js
// ── modal wrapper ─────────────────────────────────────────────────────────────

export default function TerminalSession({ onClose }) {
  const [phase, setPhase] = useState('boot');

  return (
    <div className="ts-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ts-window">
        <div className="ts-bar">
          <span className="ts-dot ts-dot-red" onClick={onClose} title="close" />
          <span className="ts-dot ts-dot-yellow" />
          <span className="ts-dot ts-dot-green" />
          <span className="ts-bar-title">jason@maaboudoumei — zsh</span>
          <button className="ts-close" onClick={onClose}>✕</button>
        </div>

        <div className="ts-body">
          {phase === 'boot' && <Boot onDone={() => setPhase('shell')} />}
          {phase === 'shell' && <Shell onExit={onClose} />}
        </div>
      </div>
    </div>
  );
}
```

with:

```js
// ── modal wrapper ─────────────────────────────────────────────────────────────

export default function TerminalSession({ onClose }) {
  const [phase, setPhase] = useState('boot');
  const s = useSprings();

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      className="ts-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={s.ui}
    >
      <motion.div
        className="ts-window"
        // approximate origin toward the hero terminal button (upper-left of viewport);
        // not measured live — the button doesn't move, and precise measurement would
        // need recalculating on every resize for marginal visual gain
        style={{ transformOrigin: '25% 45%' }}
        initial={{ opacity: 0, scale: s.reduced ? 1 : 0.92, y: s.reduced ? 0 : 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: s.reduced ? 1 : 0.92, y: s.reduced ? 0 : 16 }}
        transition={s.drawer}
      >
        <div className="ts-bar">
          <span className="ts-dot ts-dot-red" onClick={onClose} title="close" />
          <span className="ts-dot ts-dot-yellow" />
          <span className="ts-dot ts-dot-green" />
          <span className="ts-bar-title">jason@maaboudoumei — zsh</span>
          <button className="ts-close" onClick={onClose}>✕</button>
        </div>

        <div className="ts-body">
          {phase === 'boot' && <Boot onDone={() => setPhase('shell')} />}
          {phase === 'shell' && <Shell onExit={onClose} />}
        </div>
      </motion.div>
    </motion.div>
  );
}
```

(This also fixes a pre-existing gap: the modal previously had no Escape-to-close handler, while the gallery lightbox already does — this brings the modal to parity with that existing pattern.)

- [ ] **Step 4: Remove the now-redundant CSS keyframe animations**

In `src/TerminalSession.css`, `motion` now drives opacity/scale/y directly, so the old one-way CSS keyframes would double up with (and fight) the spring. Remove the `animation` line from `.ts-overlay`:

```css
.ts-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  animation: ts-fade-in 0.15s ease;
}

@keyframes ts-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

becomes:

```css
.ts-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}
```

And remove the `animation` line + keyframes from `.ts-window`:

```css
.ts-window {
  width: min(900px, 96vw);
  height: min(620px, 90vh);
  background: #0d0d0d;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
  animation: ts-slide-in 0.2s ease;
}

@keyframes ts-slide-in {
  from { transform: translateY(12px) scale(0.98); opacity: 0; }
  to   { transform: translateY(0)    scale(1);    opacity: 1; }
}
```

becomes:

```css
.ts-window {
  width: min(900px, 96vw);
  height: min(620px, 90vh);
  background: #0d0d0d;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
}
```

- [ ] **Step 5: Wrap the modal's conditional render in `AnimatePresence` so the exit spring can play**

In `src/App.js`, change the imports (lines 1-3) from:

```js
import { useState, useEffect, useRef } from 'react';
import './App.css';
import TerminalSession from './TerminalSession';
```

to:

```js
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import './App.css';
import TerminalSession from './TerminalSession';
```

Then in the `App` component (line 762), change:

```js
      <Hero onOpenTerminal={() => setTermOpen(true)} />
      {termOpen && <TerminalSession onClose={() => setTermOpen(false)} />}
      <Gallery />
```

to:

```js
      <Hero onOpenTerminal={() => setTermOpen(true)} />
      <AnimatePresence>
        {termOpen && <TerminalSession onClose={() => setTermOpen(false)} />}
      </AnimatePresence>
      <Gallery />
```

- [ ] **Step 6: Manual verification**

Run: `npm start`, open `http://localhost:3000`.

- Click the "❯_ Terminal" button in the hero — the modal should spring open (scale + fade + slight rise), not snap in.
- Click the ✕ button, then the red dot, then click the dark backdrop outside the window — all three should spring the modal closed (fade + scale down), not vanish instantly.
- Press Escape while the modal is open — it closes (new behavior).
- Interrupt test: open the modal, then immediately click ✕ while it's still mid-open-animation — it should smoothly reverse from wherever it currently is, with no visual jump or flash.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/motion-presets.js src/TerminalSession.js src/TerminalSession.css src/App.js
git commit -m "Add motion library; spring-animate terminal modal open/close"
```

---

### Task 2: Gallery lightbox spring transitions + directional photo swap

**Files:**
- Modify: `src/App.js:1-3` (imports), `src/App.js:291-389` (`Gallery` function, full replacement)

**Interfaces:**
- Consumes: `springs`/`useSprings` from `src/motion-presets.js` (Task 1); `motion`, `AnimatePresence` from `motion/react`.

- [ ] **Step 1: Add the `motion` import**

In `src/App.js`, change:

```js
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import './App.css';
import TerminalSession from './TerminalSession';
```

to:

```js
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './App.css';
import TerminalSession from './TerminalSession';
import { useSprings } from './motion-presets';
```

- [ ] **Step 2: Replace the `Gallery` function**

Replace the entire `Gallery` function (`src/App.js:291-389`) with:

```js
function Gallery() {
  const toPhoto = (id, type) => ({
    id,
    type,
    src: type === 'VIDEO'
      ? `${IMMICH_URL}/api/assets/${id}/video/playback?slug=${IMMICH_SLUG}`
      : `${IMMICH_URL}/api/assets/${id}/thumbnail?size=preview&slug=${IMMICH_SLUG}`,
  });

  const [photos, setPhotos] = useState(GALLERY_FALLBACK.map(a => toPhoto(a.id, a.type)));
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [direction, setDirection] = useState(0);
  const stripRef = useRef(null);
  const s = useSprings();

  useEffect(() => {
    fetch(`${IMMICH_URL}/api/albums/${IMMICH_ALBUM}?slug=${IMMICH_SLUG}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(album => {
        if (album.assets?.length) setPhotos(album.assets.map(a => toPhoto(a.id, a.type)));
      })
      .catch(() => {});
  }, []);

  const goTo = (newIdx) => {
    setDirection(newIdx > selectedIdx ? 1 : -1);
    setSelectedIdx(newIdx);
  };

  useEffect(() => {
    if (selectedIdx === null) return;
    document.body.style.overflow = 'hidden';
    const handler = (e) => {
      if (e.key === 'Escape') setSelectedIdx(null);
      if (e.key === 'ArrowRight' && selectedIdx < photos.length - 1) goTo(selectedIdx + 1);
      if (e.key === 'ArrowLeft' && selectedIdx > 0) goTo(selectedIdx - 1);
    };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handler);
    };
  }, [selectedIdx, photos.length]);

  const scroll = (dir) => {
    if (stripRef.current) {
      stripRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
    }
  };

  if (photos.length === 0) return null;

  return (
    <div className="gallery-bg">
      <div className="section-wrap">
        <div className="section-label">gallery</div>
        <div className="gallery-scroll-wrap">
          <button className="gallery-arrow gallery-arrow-left" onClick={() => scroll(-1)} aria-label="Scroll left">{'‹'}</button>
          <div className="gallery-strip" ref={stripRef}>
            {photos.map((p, i) => (
              <div className="gallery-item" key={p.id} onClick={() => setSelectedIdx(i)}>
                {p.type === 'VIDEO' ? (
                  <video src={p.src} autoPlay loop muted playsInline draggable="false" />
                ) : (
                  <img src={p.src} alt="" loading="lazy" draggable="false" />
                )}
              </div>
            ))}
          </div>
          <button className="gallery-arrow gallery-arrow-right" onClick={() => scroll(1)} aria-label="Scroll right">{'›'}</button>
        </div>
        <div className="gallery-attrib">
          <img src="/logos/immich.svg" alt="Immich" className="immich-logo" />
          <span>made possible with immich ╾━╤デ╦︻ (•_- )</span>
        </div>
      </div>

      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            className="gallery-lightbox"
            onClick={() => setSelectedIdx(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={s.ui}
          >
            <button className="lightbox-close" onClick={() => setSelectedIdx(null)} aria-label="Close">{'×'}</button>
            {selectedIdx > 0 && (
              <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); goTo(selectedIdx - 1); }} aria-label="Previous">{'‹'}</button>
            )}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selectedIdx}
                initial={{ opacity: 0, x: s.reduced ? 0 : (direction > 0 ? 40 : -40) }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: s.reduced ? 0 : (direction > 0 ? -40 : 40) }}
                transition={s.ui}
              >
                {photos[selectedIdx].type === 'VIDEO' ? (
                  <video
                    src={photos[selectedIdx].src}
                    autoPlay loop controls
                    className="lightbox-img"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <img
                    src={photos[selectedIdx].src}
                    alt=""
                    className="lightbox-img"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </motion.div>
            </AnimatePresence>
            {selectedIdx < photos.length - 1 && (
              <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); goTo(selectedIdx + 1); }} aria-label="Next">{'›'}</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 3: Manual verification**

Run: `npm start`.

- Click any gallery photo — the lightbox should spring open (fade), not snap.
- Click the arrow buttons and press ←/→ — each photo swap should slide in from the direction of travel (next slides from the right, prev from the left), not hard-cut.
- Click the ✕, then click the dark backdrop, then press Escape — all three close with a spring fade, not instantly.
- Confirm the first `photos.length` gallery items still fetch from Immich correctly and the fallback set still works if the fetch fails (unrelated to this change, but confirm nothing broke).

- [ ] **Step 4: Commit**

```bash
git add src/App.js
git commit -m "Spring-animate gallery lightbox open/close and directional photo transitions"
```

---

### Task 3: Scroll-reveal for page sections

**Files:**
- Create: `src/Reveal.js`
- Modify: `src/App.js` — `About` (391-472), `Experience` (474-497), `Organizations` (499-520), `Skills` (522-539), `Certs` (541-574), `Projects` (576-600), `Contact` (691-746)

**Interfaces:**
- Consumes: `useSprings` from `src/motion-presets.js` (Task 1).
- Produces: `Reveal` (default export from `src/Reveal.js`) — a `motion.div` wrapper — consumed by the 7 section components below.

- [ ] **Step 1: Create the `Reveal` wrapper component**

Create `src/Reveal.js`:

```js
import { motion } from 'motion/react';
import { useSprings } from './motion-presets';

export default function Reveal({ children, ...props }) {
  const s = useSprings();
  return (
    <motion.div
      initial={{ opacity: 0, y: s.reduced ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={s.ui}
      {...props}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Import `Reveal` in App.js**

Add to the top of `src/App.js` (after the `TerminalSession` import):

```js
import Reveal from './Reveal';
```

- [ ] **Step 3: Wrap `About`'s content**

Replace the `About` function (`src/App.js:391-472`) — only the outer `<section>` body changes, wrapping everything currently inside `<section id="about">` in `<Reveal>`:

```js
function About() {
  return (
    <section id="about">
      <Reveal className="about-grid">
        <div>
          <div className="about-card">
            <div className="about-card-header">
              <span>jason.tsao.json</span>
              <span className="about-card-dot" />
            </div>
            <div className="about-card-body mono" style={{ fontSize: '0.78rem', lineHeight: 1.9 }}>
              <div style={{ color: 'var(--dim)' }}>{'{'}</div>
              <div style={{ paddingLeft: '1rem' }}>
                <span style={{ color: '#a8d8ff' }}>"school"</span>
                <span style={{ color: 'var(--muted)' }}>: </span>
                <span style={{ color: '#c8c8c8' }}>"SJSU — BS CmpE \'28 (3.70)"</span>
                <span style={{ color: 'var(--dim)' }}>,</span>
              </div>
              <div style={{ paddingLeft: '1rem' }}>
                <span style={{ color: '#a8d8ff' }}>"role"</span>
                <span style={{ color: 'var(--muted)' }}>: </span>
                <span style={{ color: '#c8c8c8' }}>"Systems Administrator"</span>
                <span style={{ color: 'var(--dim)' }}>,</span>
              </div>
              <div style={{ paddingLeft: '1rem' }}>
                <span style={{ color: '#a8d8ff' }}>"from"</span>
                <span style={{ color: 'var(--muted)' }}>: </span>
                <span style={{ color: '#c8c8c8' }}>"Sacramento, CA"</span>
                <span style={{ color: 'var(--dim)' }}>,</span>
              </div>
              <div style={{ paddingLeft: '1rem' }}>
                <span style={{ color: '#a8d8ff' }}>"based"</span>
                <span style={{ color: 'var(--muted)' }}>: </span>
                <span style={{ color: '#c8c8c8' }}>"San Jose, CA"</span>
                <span style={{ color: 'var(--dim)' }}>,</span>
              </div>
              <div style={{ paddingLeft: '1rem' }}>
                <span style={{ color: '#a8d8ff' }}>"goal"</span>
                <span style={{ color: 'var(--muted)' }}>: </span>
                <span style={{ color: '#c8c8c8' }}>"devsecops · remote/hybrid"</span>
                <span style={{ color: 'var(--dim)' }}>,</span>
              </div>
              <div style={{ paddingLeft: '1rem' }}>
                <span style={{ color: '#a8d8ff' }}>"spoken"</span>
                <span style={{ color: 'var(--muted)' }}>: </span>
                <span style={{ color: '#c8c8c8' }}>"EN · JP · ZH"</span>
                <span style={{ color: 'var(--dim)' }}>,</span>
              </div>
              <div style={{ paddingLeft: '1rem' }}>
                <span style={{ color: '#a8d8ff' }}>"open_to"</span>
                <span style={{ color: 'var(--muted)' }}>: </span>
                <span style={{ color: 'var(--green)' }}>true</span>
              </div>
              <div style={{ color: 'var(--dim)' }}>{'}'}</div>
            </div>
          </div>
        </div>

        <div className="about-text">
          <div className="section-label">about</div>
          <h2 className="section-title">About me</h2>
          <p>
            Born and raised in Sacramento. Moved to San Jose for school — currently a
            Computer Engineering student at SJSU with a minor in Japanese (3.70 GPA). Active in
            the Software and Computer Engineering Society and was an officer for Japanese Student Association and
            Hong Kong Student Association during freshman year. I started working at 16 and have been building things ever since.
          </p>
          <p>
            I work as a Systems Administrator managing enterprise infrastructure: Active Directory,
            Windows Server, endpoint security, and networking. Outside of work I run a
            home lab — WireGuard VPN, Nginx reverse proxy, containerized services,
            and a locally-hosted AI on my own hardware.
          </p>
          <p>
            Long-term I am trying to aim for a DevSecOps role, ideally remote or hybrid,
            with the flexibility to live and work from abroad.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
```

(`Reveal` takes the `about-grid` class directly via `{...props}` passthrough, so the existing grid CSS still applies to the same element — just a `motion.div` instead of a plain `div`.)

- [ ] **Step 4: Wrap `Experience`'s content**

Replace `src/App.js:474-497`:

```js
function Experience() {
  return (
    <div className="exp-bg">
      <div className="section-wrap" id="experience">
        <Reveal>
          <div className="section-label">experience</div>
          <h2 className="section-title">Where I've worked</h2>
          <div className="timeline">
            {EXPERIENCE.map((job, index) => (
              <div className="timeline-item" key={`${job.company}-${index}`}>
                <div className="timeline-period mono">{job.period}</div>
                <div className="timeline-card">
                  <div className="timeline-title">{job.title}</div>
                  <div className="timeline-company">{job.company}</div>
                  <ul className="timeline-bullets">
                    {job.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Wrap `Organizations`'s content**

Replace `src/App.js:499-520`:

```js
function Organizations() {
  return (
    <section id="organizations">
      <Reveal>
        <div className="section-label">organizations</div>
        <h2 className="section-title">Clubs & involvement</h2>
        <div className="timeline">
          {ORGANIZATIONS.map((role, index) => (
            <div className="timeline-item" key={`${role.org}-${index}`}>
              <div className="timeline-period mono">{role.period}</div>
              <div className="timeline-card">
                <div className="timeline-title">{role.title}</div>
                <div className="timeline-company">{role.org}</div>
                <ul className="timeline-bullets">
                  {role.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 6: Wrap `Skills`'s content**

Replace `src/App.js:522-539`:

```js
function Skills() {
  return (
    <section id="skills">
      <Reveal>
        <div className="section-label">skills</div>
        <h2 className="section-title">Tech stack</h2>
        <div className="skills-groups">
          {SKILL_GROUPS.map((g) => (
            <div className="skill-group" key={g.label}>
              <div className="skill-group-title">{g.label}</div>
              <div className="skill-list">
                {g.items.map((s) => <span className="skill-tag" key={s}>{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 7: Wrap `Certs`'s content**

Replace `src/App.js:541-574`:

```js
function Certs() {
  return (
    <div className="exp-bg">
      <div className="section-wrap" id="certs">
        <Reveal>
          <div className="section-label">certifications</div>
          <h2 className="section-title">Licenses & Certs</h2>
          <div className="certs-grid">
            {CERTS.map((c) => {
              const inner = (
                <>
                  <div className="cert-logo-wrap">
                    <img src={c.logo} alt={c.issuer} className={`cert-logo${c.whiteBg ? ' white-bg' : ''}`} />
                  </div>
                  <div className="cert-info">
                    <div className="cert-name">{c.name}</div>
                    <div className="cert-issuer">{c.issuer}</div>
                    <div className="cert-date mono">{c.date}</div>
                  </div>
                  {c.href && <span className="cert-arrow">↗</span>}
                </>
              );
              return c.href ? (
                <a href={c.href} target="_blank" rel="noreferrer" className="cert-card" key={c.name}>
                  {inner}
                </a>
              ) : (
                <div className="cert-card" key={c.name}>{inner}</div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Wrap `Projects`'s content**

Replace `src/App.js:576-600`:

```js
function Projects() {
  return (
    <section id="projects">
      <Reveal>
        <div className="section-label">projects</div>
        <h2 className="section-title">Things I've built</h2>
        <div className="projects-grid">
          {PROJECTS.map((p) => (
            <div className="project-card" key={p.num}>
              <div className="project-num mono">{p.num}</div>
              <div className="project-title">{p.title}</div>
              <p className="project-desc">{p.desc}</p>
              <div className="project-tags">
                {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
              </div>
              {p.code && (
                <div className="project-links">
                  <a href={p.code} target="_blank" rel="noreferrer" className="project-link">github →</a>
                </div>
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 9: Wrap `Contact`'s content**

Replace `src/App.js:691-746`:

```js
function Contact() {
  const links = [
    {
      kind: 'email',
      href: 'mailto:jason.p.tsao@sjsu.edu',
      label: 'email',
      value: 'jason.p.tsao@sjsu.edu',
      external: false,
    },
    {
      kind: 'github',
      href: 'https://github.com/maaboudoufu',
      label: 'github',
      value: 'github.com/maaboudoufu',
      external: true,
    },
    {
      kind: 'linkedin',
      href: 'https://linkedin.com/in/jtsaoo',
      label: 'linkedin',
      value: 'linkedin.com/in/jtsaoo',
      external: true,
    },
  ];

  return (
    <div className="contact-bg">
      <div className="section-wrap" id="contact">
        <Reveal>
          <div className="section-label">contact</div>
          <h2 className="section-title">Get in touch</h2>
          <p className="section-desc">Open to opportunities, collabs, or just talking tech.</p>
          <div className="contact-grid">
            <GitHubCard />
            <div className="contact-links">
              {links.map((l) => (
                <a
                  href={l.href}
                  target={l.external ? '_blank' : undefined}
                  rel={l.external ? 'noreferrer' : undefined}
                  className="contact-link-item"
                  key={l.kind}
                >
                  <span className="contact-link-icon">{ICONS[l.kind]}</span>
                  <div className="contact-link-text">
                    <span className="link-label">{l.label}</span>
                    <span className="link-value">{l.value}</span>
                  </div>
                  <span className="contact-link-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
```

- [ ] **Step 10: Manual verification**

Run: `npm start`. Scroll slowly from top to bottom of the page.

- Each of About, Experience, Organizations, Skills, Certs, Projects, Contact should fade+rise into place the first time it enters the viewport (roughly 80px before it would otherwise be visible) — not appear already fully visible, and not visibly "pop."
- Scroll back up past a section, then back down again — it should **not** replay the animation (already-revealed sections stay visible, no re-trigger).
- Confirm none of the grid/flex layouts (about-grid, timeline, skills-groups, certs-grid, projects-grid, contact-grid) visually shifted or broke — `Reveal` should be an invisible wrapper layout-wise.
- Toggle "Emulate CSS prefers-reduced-motion: reduce" in Chrome DevTools (Rendering tab) and reload — sections should still appear (fade only, no rise) and still respect the once-only behavior.

- [ ] **Step 11: Commit**

```bash
git add src/Reveal.js src/App.js
git commit -m "Add scroll-reveal to page sections via shared Reveal wrapper"
```

---

### Task 4: Nav active-section spring indicator

**Files:**
- Modify: `src/App.js:196-217` (`Navbar` function, full replacement)
- Modify: `src/App.css` (add rules near `.nav-links a`, lines 37-46)

**Interfaces:**
- Consumes: `motion`, `useSprings` (already imported into `App.js` by Task 2).

- [ ] **Step 1: Replace the `Navbar` function**

Replace `src/App.js:196-217`:

```js
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('about');
  const s = useSprings();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const ids = ['about', 'experience', 'skills', 'projects', 'contact'];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach(sec => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const links = [
    { id: 'about', label: 'about' },
    { id: 'experience', label: 'experience' },
    { id: 'skills', label: 'skills' },
    { id: 'projects', label: 'projects' },
  ];

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-logo mono">jason@tsao</div>
      <ul className="nav-links">
        {links.map(l => (
          <li key={l.id} className="nav-link-item">
            <a href={`#${l.id}`} className={active === l.id ? 'active' : ''}>{l.label}</a>
            {active === l.id && (
              <motion.div className="nav-underline" layoutId="nav-underline" transition={s.ui} />
            )}
          </li>
        ))}
        <li><a href="#contact" className="nav-cta">contact</a></li>
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2: Add CSS for the underline and active state**

In `src/App.css`, change:

```css
.nav-links {
  display: flex;
  gap: 2.5rem;
  list-style: none;
  align-items: center;
}

.nav-links a {
  color: var(--muted);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: color 0.2s;
}

.nav-links a:hover { color: var(--white); }
```

to:

```css
.nav-links {
  display: flex;
  gap: 2.5rem;
  list-style: none;
  align-items: center;
}

.nav-link-item {
  position: relative;
  list-style: none;
}

.nav-links a {
  color: var(--muted);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.active { color: var(--white); }

.nav-underline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 2px;
  background: var(--white);
  border-radius: 1px;
}
```

- [ ] **Step 3: Manual verification**

Run: `npm start`. Scroll through the page.

- The nav link matching the section currently in view should be highlighted white (vs. the dimmer default), with a thin underline.
- The underline should slide smoothly between nav items as you scroll from section to section (spring motion via `layoutId`), not jump.
- The "contact" pill (`.nav-cta`) keeps its existing button styling — no underline should appear under it.
- Clicking a nav link still scroll-jumps to the right section (existing anchor behavior, unaffected).

- [ ] **Step 4: Commit**

```bash
git add src/App.js src/App.css
git commit -m "Add spring-driven active-section indicator to nav"
```

---

### Task 5: Global instant press feedback

**Files:**
- Modify: `src/App.css` (transition property patches + new `:active` rule block)
- Modify: `src/TerminalSession.css` (transition property patches + `:active` rule for `.ts-close`, `.ts-dot-red`)

**Interfaces:** None (CSS-only, no new JS).

- [ ] **Step 1: Add `transform` to the `transition` property of elements that don't already animate it**

In `src/App.css`:

`.btn-primary` (line 129): change `transition: opacity 0.2s;` to `transition: opacity 0.2s, transform 0.1s ease-out;`

`.btn-secondary` (line 147): change `transition: border-color 0.2s, color 0.2s;` to `transition: border-color 0.2s, color 0.2s, transform 0.1s ease-out;`

`.btn-terminal` (line 168): change `transition: border-color 0.2s, background 0.2s;` to `transition: border-color 0.2s, background 0.2s, transform 0.1s ease-out;`

`.nav-cta` (line 53): change `transition: border-color 0.2s, background 0.2s !important;` to `transition: border-color 0.2s, background 0.2s, transform 0.1s ease-out !important;`

`.gallery-arrow` (line 384): change `transition: background 0.2s, border-color 0.2s;` to `transition: background 0.2s, border-color 0.2s, transform 0.1s ease-out;`

`.gallery-item` (lines 344-351): add a `transition` line — change:
```css
.gallery-item {
  flex: 0 0 auto;
  height: 340px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  scroll-snap-align: start;
}
```
to:
```css
.gallery-item {
  flex: 0 0 auto;
  height: 340px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  scroll-snap-align: start;
  transition: transform 0.1s ease-out;
}
```

`.cert-card` (line 704): change `transition: border-color 0.2s;` to `transition: border-color 0.2s, transform 0.1s ease-out;`

`.project-card` (line 771): change `transition: border-color 0.25s;` to `transition: border-color 0.25s, transform 0.1s ease-out;`

`.lightbox-close` (line 448): change `transition: background 0.2s;` to `transition: background 0.2s, transform 0.1s ease-out;`

`.lightbox-nav` (line 470): change `transition: background 0.2s;` to `transition: background 0.2s, transform 0.1s ease-out;`

(`.gh-card` at line 855 and `.contact-link-item` at line 1020 already include `transform` in their transition list — no change needed there.)

- [ ] **Step 2: Add the `:active` press-feedback rule**

At the end of `src/App.css`, add:

```css
/* ===== PRESS FEEDBACK ===== */
.btn-primary:active,
.btn-secondary:active,
.btn-terminal:active,
.nav-cta:active,
.gallery-arrow:active,
.gallery-item:active,
.gh-card:active,
.cert-card:active,
.project-card:active,
.contact-link-item:active,
.lightbox-close:active,
.lightbox-nav:active {
  transform: scale(0.97);
}
```

- [ ] **Step 3: Same treatment for the terminal modal's close controls**

In `src/TerminalSession.css`, change:

```css
.ts-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
}
.ts-dot-red    { background: #ff5f57; }
.ts-dot-yellow { background: #febc2e; cursor: default; }
.ts-dot-green  { background: #28c840; cursor: default; }
```

to:

```css
.ts-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.1s ease-out;
}
.ts-dot-red    { background: #ff5f57; }
.ts-dot-yellow { background: #febc2e; cursor: default; }
.ts-dot-green  { background: #28c840; cursor: default; }
.ts-dot-red:active { transform: scale(0.85); }
```

And change:

```css
.ts-close {
  background: none;
  border: none;
  color: #444;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.15s;
}
.ts-close:hover { color: #aaa; }
```

to:

```css
.ts-close {
  background: none;
  border: none;
  color: #444;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.15s, transform 0.1s ease-out;
}
.ts-close:hover { color: #aaa; }
.ts-close:active { transform: scale(0.85); }
```

- [ ] **Step 4: Manual verification**

Run: `npm start`. Click-and-hold (or tap on a touch device / mobile emulation) each of: hero buttons, nav "contact" pill, gallery arrows, a gallery photo, the GitHub card, a cert card, a project card, a contact link row, the lightbox close/nav buttons, the terminal modal's ✕ and red dot.

- Each should visibly compress slightly (scale down) the instant you press down — not on release, not only on hover.
- Releasing (or moving the mouse away) should smoothly return to normal size.
- Confirm no element's existing hover effect (color/border/lift) broke — press feedback should layer on top, not replace it.

- [ ] **Step 5: Commit**

```bash
git add src/App.css src/TerminalSession.css
git commit -m "Add instant press feedback to all interactive elements"
```

---

### Task 6: Reduced-transparency / high-contrast fallbacks + final verification pass

**Files:**
- Modify: `src/App.css` (add media queries at end of file)
- Modify: `src/TerminalSession.css` (add media queries at end of file)

**Interfaces:** None (CSS-only).

- [ ] **Step 1: Add `prefers-reduced-transparency` and `prefers-contrast` fallbacks in App.css**

The site currently uses `backdrop-filter` translucency in three places: `.navbar` (App.css:12, `blur(12px)`), `.gallery-arrow` (App.css:385, `blur(8px)`), `.gallery-lightbox` (App.css:422, `blur(8px)`). Add, at the end of `src/App.css`:

```css
/* ===== ACCESSIBILITY: TRANSPARENCY & CONTRAST ===== */
@media (prefers-reduced-transparency: reduce) {
  .navbar {
    background: #0a0a0a;
    backdrop-filter: none;
  }
  .gallery-arrow {
    background: #1a1a1a;
    backdrop-filter: none;
  }
  .gallery-lightbox {
    background: #000;
    backdrop-filter: none;
  }
}

@media (prefers-contrast: more) {
  .navbar {
    background: #000;
    border-bottom: 1px solid var(--white);
  }
  .btn-secondary,
  .btn-terminal,
  .nav-cta {
    border-width: 2px;
  }
  .gh-card,
  .cert-card,
  .project-card,
  .contact-link-item {
    border-width: 2px;
    border-color: var(--white);
  }
}
```

- [ ] **Step 2: Same for the terminal modal's translucency**

The modal overlay uses `backdrop-filter: blur(4px)` (TerminalSession.css:10). Add, at the end of `src/TerminalSession.css`:

```css
/* ===== ACCESSIBILITY: TRANSPARENCY & CONTRAST ===== */
@media (prefers-reduced-transparency: reduce) {
  .ts-overlay {
    background: #000;
    backdrop-filter: none;
  }
}

@media (prefers-contrast: more) {
  .ts-window {
    border: 2px solid #fff;
  }
}
```

- [ ] **Step 3: Full cross-cutting manual verification pass**

Run: `npm start`. In Chrome DevTools → Rendering tab, toggle each of the following one at a time and re-check the site (reload between toggles):

- **`prefers-reduced-motion: reduce`** — terminal modal, gallery lightbox, and section scroll-reveals should all degrade to plain opacity cross-fades (no scale/slide/rise), still functionally correct (open/close/navigate all still work).
- **`prefers-reduced-transparency: reduce`** — nav bar, gallery arrows, gallery lightbox backdrop, and terminal modal backdrop should all go solid/near-solid instead of blurred.
- **`prefers-contrast: more`** — nav bar, buttons, cards, and the terminal window border should show visibly thicker/higher-contrast borders.
- Turn all three back off and do one final full walkthrough top to bottom: nav scroll-blur, hero buttons, terminal modal open/close/Escape, gallery scroll + lightbox open/close/prev/next, scroll-reveal on every section, nav active-indicator, press feedback on every interactive element from Task 5.

- [ ] **Step 4: Commit**

```bash
git add src/App.css src/TerminalSession.css
git commit -m "Add reduced-transparency and high-contrast fallbacks for translucent surfaces"
```
