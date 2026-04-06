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
  { type: 'out',    text: 'studyguard/   home-lab/   ai-companion-esp32/' },
  { type: 'cmd',    text: '' },
];

const SKILL_GROUPS = [
  {
    label: 'Languages',
    items: ['C / C++', 'Assembly', 'JavaScript', 'HTML / CSS', 'Bash / Zsh', 'PowerShell'],
  },
  {
    label: 'Frameworks & Libraries',
    items: ['React.js', 'Node.js', 'FastAPI', 'SQLAlchemy'],
  },
  {
    label: 'Infrastructure & DevOps',
    items: ['TCP/IP', 'DHCP', 'DNS', 'VLAN', 'VPN (WireGuard)', 'Nginx', 'SSL/TLS', 'Docker', 'Linux System Administration', 'Git'],
  },
  {
    label: 'Security & Endpoint Management',
    items: ['Qualys', 'Sophos Central', 'Jamf', 'Intune', 'Active Directory', 'Windows Server'],
  },
];

const EXPERIENCE = [
  {
    title: 'Information Technology Technician',
    company: 'Student Union, Inc. of SJSU  ·  San Jose, CA',
    period: 'Feb 2026\n– Present',
    bullets: [
      'Maintained and troubleshot Windows/Mac systems, Active Directory, and Windows Server infrastructure; assisted with workstation deployment, imaging, software installation, and patch management for a student body of 40,000.',
      'Developed and executed PowerShell scripts to automate Windows system administration tasks, including OS upgrades, patch deployment, software installations, and routine maintenance processes.',
      'Supported wired and wireless network connectivity, including TCP/IP, DHCP, and DNS troubleshooting; assisted with core network infrastructure such as switches, firewalls, printers, and biometric scanners.',
      'Managed SSL certificate installations by importing certificate files, updating settings in IIS Manager, and ensuring secure reverse proxy HTTPS connections for internal web applications.',
      'Utilized Qualys, Sophos Central, Jamf, and Intune to monitor endpoint security, remediate vulnerabilities, and enforce device compliance policies across the organization.',
      'Deployed and configured Zabbix on Linux servers to monitor infrastructure performance, implementing agent-based monitoring, custom triggers, and alerting to proactively identify and resolve system issues.',
      'Used Lansweeper for ticketing, asset tracking, and system inventory; maintained detailed documentation of hardware, software, inventory, and IT procedures.',
    ],
  },
  {
    title: 'Developer',
    company: 'SJSU Software & Computer Engineering Society  ·  San Jose, CA',
    period: 'Feb 2026\n– Present',
    bullets: [
      'Contributed to society projects using JavaScript, React.js, Node.js, HTML, and CSS.',
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
    title: 'Event Coordinator',
    company: 'SJSU Hong Kong Student Association  ·  San Jose, CA',
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
    company: 'Japanese Student Association at SJSU  ·  San Jose, CA',
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
  {
    title: 'Software Engineer Intern',
    company: 'SJSU Software & Computer Engineering Society  ·  San Jose, CA',
    period: 'Jun 2024\n– Sep 2024',
    bullets: [
      'Built software projects using JavaScript, React.js, Node.js, HTML, and CSS.',
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
    title: 'StudyGuard',
    desc: 'Awarded 2nd Place at the Seeed Embodied AI Hackathon. Built a focus-monitoring system with a dynamically changing DNS server and Reachy Mini robot for supervision. Developed a classification pipeline with OpenCV and GPT-4V classifying focus states every 10s, streaming live video to a FastAPI dashboard, with a Whisper-powered voice agent driving robot gestures and dnsmasq allowlist updates.',
    tags: ['Python', 'FastAPI', 'OpenCV', 'OpenAI Whisper', 'SQLAlchemy', 'NVIDIA Jetson Orin Nano'],
    code: 'https://github.com/Nayab-23/SeedHackathon',
  },
  {
    num: '02',
    title: 'Home Lab',
    desc: 'Implemented a WireGuard VPN on Oracle VPS for private mesh-style networking with an Nginx reverse proxy and SSL/TLS certificates via Cloudflare. Self-hosted Vaultwarden and Ollama with Docker Compose. Integrated the local Ollama instance with OpenClaw to build an always-on AI agent that automates daily workflows including scheduling, email triage, and task management across messaging platforms.',
    tags: ['WireGuard', 'Pi-hole', 'Nginx', 'Vaultwarden', 'Docker', 'Cloudflare'],
    code: null,
  },
  {
    num: '03',
    title: 'AI Companion (ESP32)',
    desc: 'Engineered a self-hosted AI voice companion on an ESP32 microcontroller with microphone, speakers, and OLED display, backed by a localized LLM on a dual RTX 3080 inference server for low-latency on-premise responses.',
    tags: ['ESP32', 'C++', 'Python', 'Ollama', 'Docker', 'Nginx', 'React'],
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
          <a href="https://maaboudoumei.org/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-resume">
            📄 Resume
          </a>
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
                <span style={{ color: '#c8c8c8' }}>"SJSU — BS CmpE \'28 (3.65)"</span>
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
            Computer Engineering student at SJSU with a minor in Japanese (3.65 GPA). Active in
            the Software and Computer Engineering Society and was an officer for Japanese Student Association and
            Hong Kong Student Association during freshman year. I started working at 16 and have been building things ever since.
          </p>
          <p>
            I work as an IT Technician managing enterprise infrastructure: Active Directory,
            Windows Server, endpoint security, and networking. Outside of work I run a
            home lab — WireGuard VPN, Nginx reverse proxy, containerized services,
            and a locally-hosted AI on my own hardware.
          </p>
          <p>
            Long-term I am trying to aim for a network engineering role, ideally remote or hybrid,
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
