import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './App.css';
import TerminalSession from './TerminalSession';
import Reveal from './Reveal';
import { useSprings } from './motion-presets';
import { RuixenGradientFooter } from './components/ui/ruixen-gradient-footer';
import { ProgressBar } from './components/ui/progress-bar';

// ── data ────────────────────────────────────────────────────────────────────

const TERMINAL_LINES = [
  { type: 'cmd', text: 'whoami' },
  { type: 'out', text: 'jason tsao' },
  { type: 'cmd', text: 'cat /etc/role' },
  { type: 'out', text: 'IT Systems Administrator  ·  CE Student @ SJSU \'28' },
  { type: 'cmd', text: 'cat goals.txt' },
  { type: 'out', text: 'remote/hybrid · live abroad' },
  { type: 'cmd', text: 'ls ~/projects/' },
  { type: 'out', text: 'studyguard/   home-lab/' },
  { type: 'cmd', text: '' },
];

const SKILL_GROUPS = [
  {
    label: 'Languages',
    items: ['C / C++', 'Assembly', 'JavaScript', 'TypeScript', 'HTML / CSS', 'Python', 'Bash / Zsh', 'PowerShell'],
  },
  {
    label: 'Frameworks & Libraries',
    items: ['React.js', 'Vite', 'Node.js', 'Express', 'FastAPI', 'Prisma', 'SQLAlchemy', 'SQLite', 'OpenCV', 'OpenAI Whisper', 'GPT-4V', 'MCP'],
  },
  {
    label: 'Infrastructure & DevOps',
    items: ['Docker', 'Proxmox', 'pfSense', 'Nginx', 'Prometheus', 'Grafana', 'Ollama', 'WebSockets', 'TCP/IP', 'NAT', 'DHCP', 'DNS', 'VLAN', 'VPN', 'SSL/TLS', 'Linux', 'Git', 'GitHub Actions', 'CI/CD'],
  },
  {
    label: 'Security & Endpoint Management',
    items: ['Qualys', 'Sophos', 'Jamf', 'Intune', 'Active Directory', 'RBAC', 'Windows Server'],
  },
];

const EXPERIENCE = [
  {
    title: 'IT Systems Administrator',
    company: 'Student Union, Inc. of SJSU  ·  San Jose, CA',
    period: 'May 2026\n– Present',
    bullets: [
      'Managed Proxmox VE, VMware ESX, Veeam backups, UPS and high availability for hardware service continuity.',
      'Implemented Kubernetes for containerized workloads, enabling continual scalable deployments for 40k students.',
      'Developed and deployed a server-side AI agent to orchestrate MCP calls and integrate external tools and services.',
      'Deployed and administered Bitbucket and Plane, configuring RBAC, branching, and CI/CD workflows.',
      'Diagnosed connectivity issues spanning SSL certificates, TCP/IP, DHCP, DNS, VLANs, NAT rules, and firewalls.',
      'Configured CUPS/SNMP for real-time printing/tracking, asset management, and automated supplies ordering.',
    ],
  },
  {
    title: 'IT Technician',
    company: 'Student Union, Inc. of SJSU  ·  San Jose, CA',
    period: 'Feb 2026\n– May 2026',
    bullets: [
      'Managed Windows print server, imaging, software installation, workstation deployment, and patch management.',
      'Managed and secured Windows and macOS endpoints with Intune and Jamf, enforcing compliance policies.',
      'Identified, prioritized, and remediated CVEs using Qualys, leveraging CVSS severity to reduce vulnerabilities.',
      'Assisted with MDF/IDF infrastructure support, including drop ports, switches, patching, and punchdowns.',
    ],
  },
  {
    title: 'Software Engineer, Development Team',
    company: 'Software and Computer Engineering Society  ·  San Jose, CA',
    period: 'Jan 2026\n– Present',
    bullets: [
      'Built a YouTube-to-Raspberry-Pi music streaming app in TypeScript with React, Express, Prisma, and SQLite.',
      'Designed an egress-only WebSocket bridge so the Pi dials out to the backend, removing inbound firewall rules.',
      'Containerized services with Docker Compose and ran the Pi daemon as a systemd unit piping yt-dlp into mpv.',
    ],
  },
  {
    title: 'Operations Supervisor',
    company: 'Student Union, Inc. of SJSU  ·  San Jose, CA',
    period: 'Sep 2024\n– Feb 2026',
    bullets: [
      'Supervised and developed staff by monitoring performance and providing hands-on coaching as needed.',
      'Onboarded new hires, enforced permit compliance for organizations, and coordinated event logistics.',
      'Directed emergency procedures including evacuations, fire panel checks, and resolution of security incidents.',
    ],
  },
  {
    title: 'Courtesy Clerk',
    company: 'Raley\'s  ·  Sacramento, CA',
    period: 'Jun 2022\n– Aug 2024',
    bullets: [
      'Showcased intercultural communication skills communicating in Chinese and English with colleagues and customers.',
      'Demonstrated excellent customer service by assisting with grocery carry-out services and efficiently bagging groceries.',
      'Maintained cleanliness and orderliness through general cleanup tasks, including sweeping, mopping, and trash removal.',
      'Ensured product availability and organization by restocking goods and managing inventory levels.',
      'Facilitated team growth by training new employees on store procedures, customer service standards, and operational tasks.',
    ],
  },
];

const ORGANIZATIONS = [
  {
    title: 'Event Coordinator',
    org: 'SJSU Hong Kong Student Association  ·  San Jose, CA',
    period: 'Dec 2024\n– May 2025',
    bullets: [
      'Showcased intercultural communication skills communicating in Chinese and English with officers and club members.',
      'Managed marketing and social media initiatives to boost visibility and attract new members.',
      'Coordinated cultural workshops and social events that strengthened community engagement.',
      'Built partnerships with local businesses to secure funding and support larger events.',
    ],
  },
  {
    title: 'Event Coordinator',
    org: 'Japanese Student Association at SJSU  ·  San Jose, CA',
    period: 'Sep 2024\n– May 2025',
    bullets: [
      'Showcased intercultural communication skills communicating in Japanese and English with officers and club members.',
      'Led weekly meetings and delegated roles to improve coordination.',
      'Partnered with local businesses to secure funding and grow events.',
      'Organized cultural workshops and social events that boosted engagement.',
      'Developed marketing and social media campaigns to increase visibility and membership.',
      'Headed a subgroup dedicated to traditional Japanese language and culture.',
    ],
  },
];

const CERTS = [
  {
    name: 'Technical Support Fundamentals',
    issuer: 'Google',
    date: 'Feb 2026',
    logo: '/logos/google.png',
    href: 'https://www.coursera.org/account/accomplishments/verify/DBKG6T33HE1B',
  },
  {
    name: 'Vulnerability Management Detection and Response',
    issuer: 'Qualys',
    date: 'Nov 2025 · Expires Nov 2027',
    logo: '/logos/qualys.png',
    href: 'https://qualys.sumtotal.host/learning/DataStore/QUALYS_PROD/Learning/Data/ExportToPDF/Diploma_eaad9eb3-a8d0-4349-9bae-1963500c7a1a.pdf',
    whiteBg: true,
  },
  {
    name: 'TTBJ 筑波日本語テスト集',
    issuer: 'University of Tsukuba',
    date: 'Mar 2025',
    logo: '/logos/tsukuba.png',
    href: null,
  },
  {
    name: 'Adult and Pediatric First Aid / CPR / AED',
    issuer: 'American Red Cross',
    date: 'May 2025 · Expires May 2027',
    logo: '/logos/redcross.svg',
    href: 'https://www.redcross.org/take-a-class/qrCode?certnumber=01UFEE1',
  },
  {
    name: 'OSHA 10-Hour',
    issuer: 'CareerSafe',
    date: 'Dec 2023',
    logo: '/logos/careersafe.jpg',
    href: null,
    whiteBg: true,
  },
];

const IMMICH_URL = 'https://immich.maaboudoumei.org';
// Public album shared-link slug (immich.maaboudoumei.org/s/<slug>). This is a
// read-only, album-scoped, revocable share — NOT an account API key. Safe to ship
// in the client bundle: it can only view this one album's previews, nothing else.
const IMMICH_SLUG = 'portfolio';
const IMMICH_ALBUM = 'aa1e5338-ef21-4c71-9ee0-743d049db58e';
const GALLERY_FALLBACK = [
  { id: 'b11b6cc4-9934-4ffe-bd66-c5b853599b95', type: 'VIDEO' },
  { id: 'fe85e889-ae76-4944-ade1-ba748c7f27a8', type: 'IMAGE' },
  { id: '6792d9a2-3bba-456f-9384-407847503699', type: 'IMAGE' },
  { id: '559c0c55-1022-4138-8349-20adf633c64d', type: 'IMAGE' },
];

const PROJECTS = [
  {
    num: '01',
    title: 'StudyGuard',
    desc: 'Won 2nd Place at the Seeed Embodied AI Hackathon for an AI-powered focus-monitoring system. Built an OpenCV and GPT-4V pipeline that classifies student focus states at 10-second intervals, streamed live camera feed to a FastAPI dashboard for real-time proctoring, and used a Whisper voice agent to control Reachy Mini robot gestures and update the dnsmasq allowlist.',
    tags: ['Python', 'FastAPI', 'OpenCV', 'OpenAI Whisper', 'SQLAlchemy'],
    code: 'https://github.com/Nayab-23/SeedHackathon',
  },
  {
    num: '02',
    title: 'Home Lab',
    desc: 'Configured pfSense as the primary router with segmented VLANs, custom firewall rules, and NAT policies. Deployed Proxmox as a bare-metal hypervisor to host, isolate, and snapshot multiple homelab VMs, automating host configuration and SSH key distribution with idempotent, agentless Ansible playbooks. Deployed OpenMediaVault with a virtual-disk RAID 10 storage pool for fault-tolerant network-attached storage, and wired up Prometheus/Grafana for real-time metrics collection, alerting, and custom dashboards. Secured a self-hosted Ollama LLM endpoint behind an Nginx reverse proxy with TLS, gated by WireGuard.',
    tags: ['Docker', 'Ansible', 'Nginx', 'Prometheus', 'Grafana', 'Ollama', 'Proxmox', 'pfSense', 'OpenMediaVault', 'WireGuard'],
    code: null,
  },
];

// ── components ───────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);
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
              <motion.div className="nav-underline" layoutId={s.reduced ? undefined : 'nav-underline'} transition={s.ui} />
            )}
          </li>
        ))}
        <li><a href="#contact" className="nav-cta">contact</a></li>
      </ul>
    </nav>
  );
}

function Terminal() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= TERMINAL_LINES.length) return;
    const delay = visible === 0 ? 600 : TERMINAL_LINES[visible - 1].type === 'cmd' ? 200 : 500;
    const t = setTimeout(() => setVisible(v => v + 1), delay);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span className="t-dot red" />
        <span className="t-dot yellow" />
        <span className="t-dot green" />
        <span className="terminal-title">jason@maaboudoumei — zsh</span>
      </div>
      <div className="terminal-body mono">
        {TERMINAL_LINES.slice(0, visible).map((line, i) => {
          const isLast = i === visible - 1;

          if (line.type === 'cmd') {
            return (
              <div className="t-line" key={i}>
                <span className="t-user">jason</span>
                <span className="t-at">@</span>
                <span className="t-host">maaboudoumei</span>
                <span className="t-arrow"> ❯ </span>
                <span className="t-cmd">{line.text}</span>
                {isLast && <span className="t-cursor" />}
              </div>
            );
          }
          return (
            <div className="t-output" key={i}>{line.text}</div>
          );
        })}
      </div>
    </div>
  );
}

function Hero({ onOpenTerminal }) {
  const [resumeStage, setResumeStage] = useState('idle'); // idle | pending | done

  const handleResumeClick = () => {
    if (resumeStage !== 'idle') return;
    // Let the <a target="_blank"> below navigate natively and immediately.
    // A window.open() fired from inside setTimeout loses user-activation and
    // gets silently popup-blocked (Safari especially) — this bar is cosmetic
    // feedback only, it must never gate the actual navigation.
    setResumeStage('pending');
    setTimeout(() => setResumeStage('done'), 700);
    setTimeout(() => setResumeStage('idle'), 2000);
  };

  return (
    <div className="hero">
      <div className="hero-left">
        <div className="hero-eyebrow">san jose, ca</div>
        <h1 className="hero-title">Jason Tsao</h1>
        <div className="hero-btns">
          <a href="#contact" className="btn-secondary">Contact</a>
          <button className="btn-terminal" onClick={onOpenTerminal}>
            <span className="btn-terminal-prompt">❯_</span> Terminal
          </button>
          <div className="resume-btn-wrap">
            <a
              href="/resume.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              onClick={handleResumeClick}
              aria-disabled={resumeStage !== 'idle'}
            >
              Resume ↗
            </a>
            {resumeStage !== 'idle' && (
              <div className="resume-progress">
                <ProgressBar
                  value={resumeStage === 'pending' ? null : 100}
                  label="resume.pdf"
                  pendingLabel="Opening"
                  completeLabel="Opened"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="hero-right">
        <Terminal />
      </div>
    </div>
  );
}

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

  const goTo = useCallback((newIdx) => {
    setDirection(newIdx > selectedIdx ? 1 : -1);
    setSelectedIdx(newIdx);
  }, [selectedIdx]);

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
  }, [selectedIdx, photos.length, goTo]);

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
          <button className="gallery-arrow gallery-arrow-left" onClick={() => scroll(-1)} aria-label="Scroll left">{'\u2039'}</button>
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
          <button className="gallery-arrow gallery-arrow-right" onClick={() => scroll(1)} aria-label="Scroll right">{'\u203A'}</button>
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
            <button className="lightbox-close" onClick={() => setSelectedIdx(null)} aria-label="Close">{'\u00D7'}</button>
            {selectedIdx > 0 && (
              <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); goTo(selectedIdx - 1); }} aria-label="Previous">{'\u2039'}</button>
            )}
            <AnimatePresence initial={false}>
              <motion.div
                className="lightbox-frame"
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
              <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); goTo(selectedIdx + 1); }} aria-label="Next">{'\u203A'}</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
                <span style={{ color: '#c8c8c8' }}>"IT Systems Administrator"</span>
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
                <span style={{ color: '#c8c8c8' }}>"remote/hybrid"</span>
                <span style={{ color: 'var(--dim)' }}>,</span>
              </div>
              <div style={{ paddingLeft: '1rem' }}>
                <span style={{ color: '#a8d8ff' }}>"spoken"</span>
                <span style={{ color: 'var(--muted)' }}>: </span>
                <span style={{ color: '#c8c8c8' }}>"EN · JP"</span>
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
            I was born and raised in Sacramento for most of my life and moved to San Jose
            for school. I am now a Computer Engineering student at SJSU with a minor in
            Japanese. I was active in many clubs such as my office role in Japanese Student
            Association and Hong Kong Student Association during my first year. I started
            working at 16 and I have always been adamant about applying my skills to the
            real world instead of focusing solely on school.
          </p>
          <p>
            I work as an IT Systems Administrator managing enterprise infrastructure: Active Directory,
            Windows Server, endpoint security, and networking. Outside of work I run a
            home lab: WireGuard VPN, Nginx reverse proxy, containerized services,
            and a locally-hosted AI on my own hardware.
          </p>
          <p>
            Long-term, I'm aiming for a role that's remote or hybrid,
            with the flexibility to live and work from abroad.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

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

const GH_USER = 'Maaboudoufu';
const GH_FALLBACK = {
  name: 'Jason Tsao',
  login: GH_USER,
  avatar_url: `https://avatars.githubusercontent.com/u/165862784?v=4`,
  public_repos: 3,
  followers: 5,
  following: 8,
  created_at: '2024-04-03T02:24:39Z',
};

const ICONS = {
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.02c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.19 1.18a11.1 11.1 0 0 1 5.81 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55C20.21 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  ),
};

function GitHubCard() {
  const [user, setUser] = useState(GH_FALLBACK);

  useEffect(() => {
    fetch(`https://api.github.com/users/${GH_USER}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => setUser(prev => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  const joined = new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toLowerCase();

  return (
    <a href={`https://github.com/${user.login}`} target="_blank" rel="noreferrer" className="gh-card">
      <div className="gh-card-top">
        <div className="gh-avatar-wrap">
          <img src={user.avatar_url} alt={user.login} className="gh-avatar" loading="lazy" />
          <span className="gh-avatar-status" aria-hidden="true" />
        </div>
        <div className="gh-id">
          <div className="gh-name">{user.name || user.login}</div>
          <div className="gh-handle mono">@{user.login}</div>
        </div>
        <span className="gh-card-arrow" aria-hidden="true">{ICONS.arrow}</span>
      </div>

      <div className="gh-bio mono">
        <span className="gh-bio-dim">{'> '}</span>
        computer engineering · IT · devsecops
      </div>

      <div className="gh-stats">
        <div className="gh-stat">
          <div className="gh-stat-num mono">{user.public_repos}</div>
          <div className="gh-stat-label">repos</div>
        </div>
        <div className="gh-stat">
          <div className="gh-stat-num mono">{user.followers}</div>
          <div className="gh-stat-label">followers</div>
        </div>
        <div className="gh-stat">
          <div className="gh-stat-num mono">{user.following}</div>
          <div className="gh-stat-label">following</div>
        </div>
      </div>

      <div className="gh-card-foot mono">
        <span className="gh-foot-icon">{ICONS.github}</span>
        <span>joined {joined}</span>
      </div>
    </a>
  );
}

function Contact() {
  const links = [
    {
      kind: 'email',
      href: 'mailto:jason.tsao@maaboudoumei.org',
      label: 'email',
      value: 'jason.tsao@maaboudoumei.org',
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

export default function App() {
  const [termOpen, setTermOpen] = useState(false);
  return (
    <>
      <Navbar />
      <Hero onOpenTerminal={() => setTermOpen(true)} />
      <AnimatePresence>
        {termOpen && <TerminalSession onClose={() => setTermOpen(false)} />}
      </AnimatePresence>
      <Gallery />
      <About />
      <Experience />
      <Organizations />
      <Skills />
      <Certs />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}
