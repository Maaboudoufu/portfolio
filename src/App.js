import { useState, useEffect } from 'react';
import './App.css';
import TerminalSession from './TerminalSession';

// ── data ────────────────────────────────────────────────────────────────────

const TERMINAL_LINES = [
  { type: 'cmd',    text: 'whoami' },
  { type: 'out',    text: 'jason tsao' },
  { type: 'cmd',    text: 'cat /etc/role' },
  { type: 'out',    text: 'IT Technician  ·  CE Student @ SJSU \'28' },
  { type: 'cmd',    text: 'cat goals.txt' },
  { type: 'out',    text: 'network engineer · remote/hybrid · live abroad' },
  { type: 'cmd',    text: 'ls ~/projects/' },
  { type: 'out',    text: 'home-lab/     ai-companion-esp32/' },
  { type: 'cmd',    text: '' },
];

const SKILL_GROUPS = [
  {
    label: 'Languages',
    items: ['C / C++', 'Assembly', 'JavaScript', 'HTML / CSS', 'Bash / Zsh', 'PowerShell'],
  },
  {
    label: 'Frameworks & Libraries',
    items: ['React.js', 'Node.js'],
  },
  {
    label: 'Infrastructure & Networking',
    items: ['TCP/IP', 'DHCP', 'DNS', 'VLAN', 'WireGuard', 'Nginx', 'SSL/TLS', 'Firewall Mgmt'],
  },
  {
    label: 'Systems & DevOps',
    items: ['Linux Administration', 'Docker', 'Hypervisor', 'Git', 'VS Code'],
  },
  {
    label: 'Security & Endpoint',
    items: ['Active Directory', 'Windows Server', 'Qualys', 'Sophos Central', 'Jamf', 'Intune'],
  },
];

const EXPERIENCE = [
  {
    title: 'Information Technology Technician',
    company: 'Student Union, Inc. of SJSU  ·  San Jose, CA',
    period: 'Feb 2026\n– Present',
    bullets: [
      'Administered Windows/Mac systems, Active Directory, and Windows Server; automated OS upgrades, patch deployment, and software installs via PowerShell.',
      'Monitored and secured endpoints with Qualys, Sophos Central, Jamf, and Intune; managed SSL certs and configured reverse proxy HTTPS.',
      'Deployed Zabbix on Linux servers for infrastructure monitoring; managed asset tracking via Lansweeper with comprehensive IT documentation.',
    ],
  },
  {
    title: 'Building Supervisor',
    company: 'Student Union, Inc. of SJSU  ·  San Jose, CA',
    period: 'Sep 2024\n– Feb 2026',
    bullets: [
      'Supervised and mentored staff; trained new hires on protocols and workplace expectations.',
      'Managed emergency procedures including evacuations and fire panel checks; enforced facility safety policies.',
      'Oversaw building operations, event setup, and organizational permit compliance.',
    ],
  },
  {
    title: 'Courtesy Clerk',
    company: 'Raley\'s  ·  Sacramento, CA',
    period: 'Jun 2022\n– Aug 2024',
    bullets: [
      'First job at 16; provided customer service, maintained store cleanliness, restocked inventory, and trained new employees.',
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

const PROJECTS = [
  {
    num: '01',
    title: 'AI Companion (ESP32)',
    desc: 'Self-hosted AI voice companion built on an ESP32 microcontroller — mic, speakers, OLED display, and a locally-running LLM (Ollama) on a dual RTX 3080 inference server. Zero cloud dependencies. Exposed via Nginx reverse proxy with SSL/TLS.',
    tags: ['ESP32', 'C++', 'Python', 'Ollama', 'Docker', 'Nginx', 'React'],
    code: 'https://github.com/maaboudoufu',
  },
  {
    num: '02',
    title: 'Home Lab',
    desc: 'Full self-hosted infrastructure stack: WireGuard VPN mesh on Oracle VPS, Nginx HTTPS reverse proxy with Cloudflare-registered domain, Vaultwarden password manager, Pi-hole DNS ad-blocking, and a family-facing Ollama web UI — all containerized.',
    tags: ['WireGuard', 'Pi-hole', 'Nginx', 'Vaultwarden', 'Docker', 'Cloudflare'],
    code: null,
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
        </div>
      </div>
      <div className="hero-right">
        <Terminal />
      </div>
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
                <span style={{ color: '#c8c8c8' }}>"SJSU — BS CmpE \'28"</span>
                <span style={{ color: 'var(--dim)' }}>,</span>
              </div>
              <div style={{ paddingLeft: '1rem' }}>
                <span style={{ color: '#a8d8ff' }}>"role"</span>
                <span style={{ color: 'var(--muted)' }}>: </span>
                <span style={{ color: '#c8c8c8' }}>"IT Technician"</span>
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
                <span style={{ color: '#c8c8c8' }}>"network engineer · remote/hybrid"</span>
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
          <h2 className="section-title">I like knowing how things work</h2>
          <p>
            Born and raised in Sacramento. Moved to San Jose for school — currently a
            Computer Engineering student at SJSU with a minor in Japanese. I started
            working at 16 and have been building things ever since.
          </p>
          <p>
            I work as an IT Technician managing enterprise infrastructure: Active Directory,
            Windows Server, endpoint security, and networking. Outside of work I run a
            home lab — WireGuard VPN, Nginx reverse proxy, containerized services,
            and a locally-hosted AI on my own hardware.
          </p>
          <p>
            Long-term I'm aiming for a network engineering role, ideally remote or hybrid,
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
        <p className="section-desc">Work history going back to my first job at 16.</p>
        <div className="timeline">
          {EXPERIENCE.map((job) => (
            <div className="timeline-item" key={job.title}>
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

function Skills() {
  return (
    <section id="skills">
      <div className="section-label">skills</div>
      <h2 className="section-title">Tech stack</h2>
      <p className="section-desc">From embedded C++ to enterprise endpoint management.</p>
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
      <p className="section-desc">Running on my own hardware.</p>
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

function Contact() {
  return (
    <div className="contact-bg">
      <div className="section-wrap" id="contact">
        <div className="section-label">contact</div>
        <h2 className="section-title">Get in touch</h2>
        <p className="section-desc">Open to opportunities, collabs, or just talking tech.</p>
        <div className="contact-links">
          <a href="mailto:jason.p.tsao@sjsu.edu" className="contact-link-item">
            <span className="contact-link-icon mono">✉</span>
            <div>
              <span className="link-label">email</span>
              <span className="link-value">jason.p.tsao@sjsu.edu</span>
            </div>
          </a>
          <a href="https://github.com/maaboudoufu" target="_blank" rel="noreferrer" className="contact-link-item">
            <span className="contact-link-icon mono">gh</span>
            <div>
              <span className="link-label">github</span>
              <span className="link-value">github.com/maaboudoufu</span>
            </div>
          </a>
          <a href="https://linkedin.com/in/jtsaoo" target="_blank" rel="noreferrer" className="contact-link-item">
            <span className="contact-link-icon mono">in</span>
            <div>
              <span className="link-label">linkedin</span>
              <span className="link-value">linkedin.com/in/jtsaoo</span>
            </div>
          </a>
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
      <About />
      <Experience />
      <Skills />
      <Certs />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}
