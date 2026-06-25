import { useState, useEffect, useRef } from 'react';
import './App.css';
import TerminalSession from './TerminalSession';

// ── data ────────────────────────────────────────────────────────────────────

const TERMINAL_LINES = [
  { type: 'cmd', text: 'whoami' },
  { type: 'out', text: 'jason tsao' },
  { type: 'cmd', text: 'cat /etc/role' },
  { type: 'out', text: 'Systems Administrator  ·  CE Student @ SJSU \'28' },
  { type: 'cmd', text: 'cat goals.txt' },
  { type: 'out', text: 'devsecops · remote/hybrid · live abroad' },
  { type: 'cmd', text: 'ls ~/projects/' },
  { type: 'out', text: 'studyguard/   home-lab/   resume/' },
  { type: 'cmd', text: '' },
];

const SKILL_GROUPS = [
  {
    label: 'Languages',
    items: ['C / C++', 'Assembly', 'JavaScript', 'TypeScript', 'HTML / CSS', 'Python', 'Bash / Zsh', 'PowerShell'],
  },
  {
    label: 'Frameworks & Libraries',
    items: ['React.js', 'Vite', 'Node.js', 'Express', 'FastAPI', 'Prisma', 'SQLAlchemy', 'SQLite'],
  },
  {
    label: 'Infrastructure & DevOps',
    items: ['Docker', 'Proxmox', 'pfSense', 'Nginx', 'Prometheus', 'Grafana', 'Ollama', 'WebSockets', 'TCP/IP', 'DHCP', 'DNS', 'VLAN', 'WireGuard', 'SSL/TLS', 'Linux', 'Git', 'GitHub Actions', 'CI/CD'],
  },
  {
    label: 'Security & Endpoint Management',
    items: ['Qualys', 'Sophos Central', 'Jamf', 'Intune', 'Active Directory', 'Windows Server'],
  },
];

const EXPERIENCE = [
  {
    title: 'Systems Administrator',
    company: 'Student Union, Inc. of SJSU  ·  San Jose, CA',
    period: 'Feb 2026\n– Present',
    bullets: [
      'Managed Proxmox VE, VM provisioning, backups, shutdown and high availability for reliable service continuity.',
      'Implemented Kubernetes for containerized workloads, enabling scalable deployments and operations for 40k users.',
      'Diagnosed connectivity issues spanning SSL certificates, TCP/IP, DHCP, DNS, VLANs, NAT rules, and firewalls.',
      'Configured SNMP server to monitor printer status, toner levels, and supplies for asset management and ordering.',
      'Assisted with MDF/IDF infrastructure support, including drop ports, switches, patching, and punchdowns.',
      'Administered Windows and macOS endpoints, Windows Server, Active Directory, Microsoft Entra ID, and Intune.',
      'Managed printers, workstation deployment, imaging, software installation, and patch management.',
      'Secured endpoints with Qualys, Sophos, Jamf, and Intune and automated tasks with PowerShell scripts.',
      'Conducted technical interviews to screen and evaluate candidates for IT support roles.',
      'Coordinated with external vendors and SaaS providers to procure service plans and resolve technical issues.',
    ],
  },
  {
    title: 'Software Engineer, Development Team',
    company: 'SJSU Software & Computer Engineering Society  ·  San Jose, CA',
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
const IMMICH_KEY = 'ZzeFhfMa6ndAljug4o6YM5eBOyt6qFYzoC1kKv6x5HM';
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
    desc: 'Configured pfSense as the primary router with VLANs, custom firewall rules, and NAT policies. Deployed Proxmox as a bare-metal hypervisor to host, isolate, and snapshot homelab VMs, with OpenMediaVault providing a virtual-disk RAID 10 storage pool for fault-tolerant network-attached storage. Wired up Prometheus and Grafana for real-time metrics, alerting, and dashboards, and self-hosted Ollama for local LLM inference behind Nginx with Cloudflare SSL over a WireGuard VPN.',
    tags: ['Docker', 'Nginx', 'Prometheus', 'Grafana', 'Ollama', 'Proxmox', 'pfSense', 'OpenMediaVault', 'WireGuard'],
    code: null,
  },
  {
    num: '03',
    title: 'Resume',
    desc: 'Self-hosted LaTeX resume workflow replacing cloud editors like Overleaf. Uses latexmk for automatic PDF compilation on file changes, Zathura for live-reloading PDF preview, and Neovim with vimtex for a fully local, subscription-free editing environment.',
    tags: ['LaTeX', 'Neovim', 'latexmk', 'TeX Live'],
    code: 'https://github.com/Maaboudoufu/resume',
  },
];

// ── components ───────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-logo mono">jason@tsao</div>
      <ul className="nav-links">
        <li><a href="#about">about</a></li>
        <li><a href="#experience">experience</a></li>
        <li><a href="#skills">skills</a></li>
        <li><a href="#projects">projects</a></li>
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
  return (
    <div className="hero">
      <div className="hero-left">
        <div className="hero-eyebrow">san jose, ca</div>
        <h1 className="hero-title">Jason Tsao</h1>
        <p className="hero-sub">
          Computer Engineering student at SJSU and IT professional.
          I self-host everything, tinker with embedded hardware,
          and keep systems running.
        </p>
        <div className="hero-btns">
          <a href="#projects" className="btn-primary">Projects →</a>
          <a href="#contact" className="btn-secondary">Contact</a>
          <button className="btn-terminal" onClick={onOpenTerminal}>
            <span className="btn-terminal-prompt">❯_</span> Terminal
          </button>
          <a href="/resume.html" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            Resume ↗
          </a>
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
      ? `${IMMICH_URL}/api/assets/${id}/video/playback?apiKey=${IMMICH_KEY}`
      : `${IMMICH_URL}/api/assets/${id}/thumbnail?size=preview&apiKey=${IMMICH_KEY}`,
  });

  const [photos, setPhotos] = useState(GALLERY_FALLBACK.map(a => toPhoto(a.id, a.type)));
  const [selectedIdx, setSelectedIdx] = useState(null);
  const stripRef = useRef(null);

  useEffect(() => {
    fetch(`${IMMICH_URL}/api/albums/${IMMICH_ALBUM}?apiKey=${IMMICH_KEY}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(album => {
        if (album.assets?.length) setPhotos(album.assets.map(a => toPhoto(a.id, a.type)));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedIdx === null) return;
    document.body.style.overflow = 'hidden';
    const handler = (e) => {
      if (e.key === 'Escape') setSelectedIdx(null);
      if (e.key === 'ArrowRight') setSelectedIdx(i => i === null ? null : Math.min(i + 1, photos.length - 1));
      if (e.key === 'ArrowLeft') setSelectedIdx(i => i === null ? null : Math.max(i - 1, 0));
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

      {selectedIdx !== null && (
        <div className="gallery-lightbox" onClick={() => setSelectedIdx(null)}>
          <button className="lightbox-close" onClick={() => setSelectedIdx(null)} aria-label="Close">{'\u00D7'}</button>
          {selectedIdx > 0 && (
            <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); setSelectedIdx(selectedIdx - 1); }} aria-label="Previous">{'\u2039'}</button>
          )}
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
          {selectedIdx < photos.length - 1 && (
            <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); setSelectedIdx(selectedIdx + 1); }} aria-label="Next">{'\u203A'}</button>
          )}
        </div>
      )}
    </div>
  );
}

function About() {
  return (
    <section id="about">
      <div className="about-grid">
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
      </div>
    </section>
  );
}

function Experience() {
  return (
    <div className="exp-bg">
      <div className="section-wrap" id="experience">
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
      </div>
    </div>
  );
}

function Organizations() {
  return (
    <section id="organizations">
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
    </section>
  );
}

function Skills() {
  return (
    <section id="skills">
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
    </section>
  );
}

function Certs() {
  return (
    <div className="exp-bg">
      <div className="section-wrap" id="certs">
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
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects">
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
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      jason tsao · {new Date().getFullYear()} · built with react
    </footer>
  );
}

export default function App() {
  const [termOpen, setTermOpen] = useState(false);
  return (
    <>
      <Navbar />
      <Hero onOpenTerminal={() => setTermOpen(true)} />
      {termOpen && <TerminalSession onClose={() => setTermOpen(false)} />}
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
