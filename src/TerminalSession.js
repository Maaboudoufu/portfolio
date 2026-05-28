import { useState, useEffect, useRef, useCallback } from 'react';
import './TerminalSession.css';

// ── boot sequence ────────────────────────────────────────────────────────────

const BOOT = [
  { text: '[    0.000000] Booting Linux 6.18.9-arch1-1 #1 SMP PREEMPT_DYNAMIC', ms: 30 },
  { text: '[    0.000001] Command line: BOOT_IMAGE=/boot/vmlinuz-linux root=/dev/sda1 rw quiet', ms: 25 },
  { text: '[    0.089234] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable', ms: 25 },
  { text: '[    0.203841] ACPI: RSDP 0x00000000000F0490 000024 (v02 BOCHS )', ms: 25 },
  { text: '[    0.441928] PCI: Using configuration type 1 for base access', ms: 20 },
  { text: '[    0.847203] pci 0000:00:02.0: [1234:1111] type 00 class 0x030000', ms: 20 },
  { text: '[    1.102938] NET: Registered PF_INET protocol family', ms: 30 },
  { text: '[    1.204813] NET: Registered PF_INET6 protocol family', ms: 30 },
  { text: '[    1.589234] random: crng init done', ms: 25 },
  { text: '[    1.782031] EXT4-fs (sda1): mounted filesystem', ms: 25 },
  { text: '[    1.893204] systemd[1]: Detected architecture x86-64.', ms: 50 },
  { text: '[    2.013948] systemd[1]: Reached target Basic System.', ms: 50 },
  { text: '[    2.234917] systemd[1]: Starting Network Manager...', ms: 60 },
  { text: '[  OK  ] Started Network Manager.', ok: true, ms: 80 },
  { text: '[  OK  ] Started OpenSSH Daemon.', ok: true, ms: 60 },
  { text: '[  OK  ] Started Zabbix Agent.', ok: true, ms: 50 },
  { text: '[  OK  ] Started WireGuard VPN.', ok: true, ms: 60 },
  { text: '[  OK  ] Reached target Multi-User System.', ok: true, ms: 100 },
  { text: '', ms: 150 },
  { text: 'Arch Linux 6.18.9-arch1-1 (tty1)', ms: 120 },
  { text: '', ms: 200 },
  { text: 'maaboudoumei login: jason', ms: 80, login: true },
  { text: 'Password: ········', ms: 500 },
  { text: 'Last login: Fri Mar 21 00:00:00 2026 from 10.0.0.1', ms: 80 },
  { text: '', ms: 120 },
];

// ── ascii art + neofetch ─────────────────────────────────────────────────────

const ART = [
  '     _    _____  ',
  '    | |  |_   _| ',
  '    | |    | |   ',
  ' _  | |    | |   ',
  '| |_| |    | |   ',
  ' \\___/     |_|   ',
  '                 ',
];

const INFO = [
  { label: null, value: null, special: 'user' },
  { label: null, value: null, special: 'sep' },
  { label: 'OS', value: 'Arch Linux x86_64' },
  { label: 'Kernel', value: '6.18.9-arch1-1' },
  { label: 'Shell', value: 'zsh 5.9.0' },
  { label: 'Role', value: 'IT Technician @ SJSU' },
  { label: 'School', value: "SJSU — CE '28" },
  { label: 'Goal', value: 'Network Engineer' },
  { label: 'Languages', value: 'EN · JP · ZH' },
  { label: 'Email', value: 'jason.p.tsao@sjsu.edu' },
];

// ── virtual file system ──────────────────────────────────────────────────────

const FS_DIRS = {
  '~': ['about.txt', 'contact.txt', 'skills.txt', 'projects/', 'experience/', 'certs/'],
  '~/projects': ['studyguard/', 'home-lab/'],
  '~/projects/studyguard': ['README.md'],
  '~/projects/home-lab': ['README.md'],
  '~/experience': ['it-technician.txt', 'sce-developer.txt', 'building-supervisor.txt', 'hksa-coordinator.txt', 'jsa-coordinator.txt', 'sce-intern.txt', 'courtesy-clerk.txt'],
  '~/certs': ['google-it.txt', 'qualys-vmdr.txt', 'tsukuba-ttbj.txt', 'redcross-cpr.txt', 'osha-10.txt'],
};

const FS_FILES = {
  '~/about.txt':
    `Name    : Jason Tsao
From    : Sacramento, CA
Based   : San Jose, CA
School  : SJSU — BS Computer Engineering, Minor in Japanese (GPA 3.70)
Grad    : June 2028
Goal    : Network Engineer (remote/hybrid, open to living abroad)
Spoken  : English (Native) · Japanese (Limited Working) · Chinese (Elementary)
Orgs    : Software and Computer Engineering Society · JSA · HKSA @ SJSU`,

  '~/contact.txt':
    `Email   : jason.p.tsao@sjsu.edu
GitHub  : github.com/maaboudoufu
LinkedIn: linkedin.com/in/jtsaoo`,

  '~/skills.txt':
    `── Languages ──────────────────────────────────
  C/C++  Assembly  JavaScript  TypeScript  HTML/CSS  Python  Bash/Zsh  PowerShell

── Frameworks & Libraries ─────────────────────
  React.js  Vite  Node.js  Express  FastAPI  Prisma  SQLAlchemy  SQLite

── Infrastructure & DevOps ────────────────────
  Docker  Proxmox  pfSense  Nginx  Prometheus  Grafana  Ollama  WebSockets
  TCP/IP  DHCP  DNS  VLAN  WireGuard  SSL/TLS  Linux  Git  GitHub Actions  CI/CD

── Security & Endpoint Management ─────────────
  Qualys  Sophos Central  Jamf  Intune  Active Directory  Windows Server`,

  '~/projects/studyguard/README.md':
    `# StudyGuard
Awarded 2nd Place at the Seeed Embodied AI Hackathon

Focus-monitoring system with a dynamically changing DNS server
and Reachy Mini robot for supervision.

Classification pipeline with OpenCV and GPT-4V classifying focus
states every 10s, streaming live video to a FastAPI dashboard,
with a Whisper-powered voice agent driving robot gestures and
dnsmasq allowlist updates.

Stack: Python · FastAPI · OpenCV · OpenAI Whisper · SQLAlchemy · NVIDIA Jetson Orin Nano`,

  '~/projects/home-lab/README.md':
    `# Home Lab

pfSense as the primary router with VLANs, custom firewall rules, and
NAT policies. Proxmox running bare-metal to host, isolate, and snapshot
homelab VMs, with OpenMediaVault providing a virtual-disk RAID 10 pool
for fault-tolerant network-attached storage.

Prometheus and Grafana wired up for real-time metrics, alerting, and
custom dashboards. Self-hosted Ollama for local LLM inference behind
Nginx with Cloudflare SSL over a WireGuard VPN.

Stack: Docker · Nginx · Prometheus · Grafana · Ollama · Proxmox · pfSense · OpenMediaVault · WireGuard`,

  '~/experience/it-technician.txt':
    `IT Technician III
Student Union, Inc. of SJSU · San Jose, CA
Feb 2026 – Present

• Managed Proxmox VE, VM provisioning, backups, shutdown and high
  availability for reliable service continuity.
• Implemented Kubernetes for containerized workloads, enabling scalable
  deployments and operations for 40k users.
• Diagnosed connectivity issues spanning SSL certificates, TCP/IP, DHCP,
  DNS, VLANs, NAT rules, and firewalls.
• Configured SNMP server to monitor printer status, toner levels, and
  supplies for asset management and ordering.
• Assisted with MDF/IDF infrastructure support, including drop ports,
  switches, patching, and punchdowns.
• Administered Windows and macOS endpoints, Windows Server, Active
  Directory, Microsoft Entra ID, and Intune.
• Managed printers, workstation deployment, imaging, software installation,
  and patch management.
• Secured endpoints with Qualys, Sophos, Jamf, and Intune and automated
  tasks with PowerShell scripts.`,

  '~/experience/sce-developer.txt':
    `Software Engineer, Development Team
SJSU Software & Computer Engineering Society · San Jose, CA
Jan 2026 – Present

• Built a YouTube-to-Raspberry-Pi music streaming app in TypeScript with
  React, Express, Prisma, and SQLite.
• Designed an egress-only WebSocket bridge so the Pi dials out to the
  backend, removing inbound firewall rules.
• Containerized services with Docker Compose and ran the Pi daemon as a
  systemd unit piping yt-dlp into mpv.`,

  '~/experience/building-supervisor.txt':
    `Operations Supervisor
Student Union, Inc. of SJSU · San Jose, CA
Sep 2024 – Feb 2026

• Supervised and developed staff by monitoring performance and providing
  hands-on coaching as needed.
• Onboarded new hires, enforced permit compliance for organizations, and
  coordinated event logistics.
• Directed emergency procedures including evacuations, fire panel checks,
  and resolution of security incidents.`,

  '~/experience/hksa-coordinator.txt':
    `Event Coordinator
SJSU Hong Kong Student Association · San Jose, CA
Dec 2024 – May 2025

• Showcased intercultural communication skills in Chinese and English.
• Managed marketing and social media to boost visibility and attract new members.
• Coordinated cultural workshops and social events for community engagement.
• Built partnerships with local businesses to secure funding.`,

  '~/experience/jsa-coordinator.txt':
    `Event Coordinator
Japanese Student Association at SJSU · San Jose, CA
Sep 2024 – May 2025

• Showcased intercultural communication skills in Japanese and English.
• Led weekly meetings and delegated roles to improve coordination.
• Partnered with local businesses to secure funding and grow events.
• Organized cultural workshops and social events that boosted engagement.
• Developed marketing and social media campaigns for visibility and membership.
• Headed a subgroup dedicated to traditional Japanese language and culture.`,

  '~/experience/sce-intern.txt':
    `Software Engineer Intern
SJSU Software & Computer Engineering Society · San Jose, CA
Jun 2024 – Sep 2024

• Built software projects using JavaScript, React.js, Node.js, HTML, and CSS.`,

  '~/experience/courtesy-clerk.txt':
    `Courtesy Clerk
Raley's · Sacramento, CA
Jun 2022 – Aug 2024

• Showcased intercultural communication skills in Chinese and English.
• Demonstrated excellent customer service with grocery carry-out and bagging.
• Maintained cleanliness through sweeping, mopping, and trash removal.
• Ensured product availability by restocking goods and managing inventory.
• Trained new employees on store procedures and customer service standards.`,

  '~/certs/google-it.txt':
    `Google — Technical Support Fundamentals
Issued : Feb 2026
ID     : DBKG6T33HE1B
Verify : coursera.org/verify/DBKG6T33HE1B`,

  '~/certs/qualys-vmdr.txt':
    `Qualys — Vulnerability Management Detection and Response
Issued : Nov 2025
Expires: Nov 2027`,

  '~/certs/tsukuba-ttbj.txt':
    `University of Tsukuba — TTBJ 筑波日本語テスト集
Issued : Mar 2025`,

  '~/certs/redcross-cpr.txt':
    `American Red Cross — Adult and Pediatric First Aid/CPR/AED
Issued : May 2025
Expires: May 2027
ID     : 01UFEE1`,

  '~/certs/osha-10.txt':
    `CareerSafe — OSHA 10-Hour
Issued : Dec 2023`,
};

// ── path helpers ─────────────────────────────────────────────────────────────

function resolvePath(cwd, input) {
  if (!input || input === '~') return '~';
  if (input === '.') return cwd;
  if (input.startsWith('~/')) return input.replace(/\/+$/, '');
  if (input === '..') {
    if (cwd === '~') return '~';
    const parts = cwd.split('/');
    parts.pop();
    return parts.join('/') || '~';
  }
  const base = cwd === '~' ? '~' : cwd;
  return `${base}/${input}`.replace(/\/+$/, '');
}

function shortPath(p) {
  return p; // already stored as ~/... format
}

// ── command runner ───────────────────────────────────────────────────────────

function runCommand(raw, cwd) {
  const parts = raw.trim().split(/\s+/);
  const cmd = parts[0];
  const arg = parts.slice(1).join(' ');

  switch (cmd) {
    case '': return { type: 'empty' };

    case 'ls': {
      const path = arg ? resolvePath(cwd, arg) : cwd;
      const entries = FS_DIRS[path];
      if (!entries) return { type: 'error', text: `ls: cannot access '${arg}': No such file or directory` };
      return { type: 'ls', entries };
    }

    case 'cd': {
      if (!arg || arg === '~') return { type: 'cd', newCwd: '~' };
      const path = resolvePath(cwd, arg);
      if (!FS_DIRS[path]) return { type: 'error', text: `cd: ${arg}: No such file or directory` };
      return { type: 'cd', newCwd: path };
    }

    case 'cat': {
      if (!arg) return { type: 'error', text: 'cat: missing operand' };
      const path = resolvePath(cwd, arg);
      if (FS_FILES[path]) return { type: 'output', text: FS_FILES[path] };
      return { type: 'error', text: `cat: ${arg}: No such file or directory` };
    }

    case 'pwd':
      return { type: 'output', text: cwd === '~' ? '/home/jason' : `/home/jason/${cwd.slice(2)}` };

    case 'whoami':
      return { type: 'output', text: 'jason' };

    case 'clear':
      return { type: 'clear' };

    case 'neofetch':
    case 'fastfetch':
      return { type: 'neofetch' };

    case 'exit':
      return { type: 'exit' };

    case 'help':
      return {
        type: 'output',
        text:
          `Commands:
  ls [dir]    list directory contents
  cd [dir]    change directory  (try: cd projects)
  cat [file]  show file contents
  pwd         print working directory
  whoami      current user
  neofetch    display system info
  clear       clear terminal
  exit        close terminal

Hint: start with  ls  then  cd projects/`,
      };

    default:
      return { type: 'error', text: `${cmd}: command not found  (type 'help' for commands)` };
  }
}

// ── neofetch component ───────────────────────────────────────────────────────

function Neofetch() {
  const rows = Math.max(ART.length, INFO.length);
  return (
    <div className="ts-fetch">
      {Array.from({ length: rows }, (_, i) => {
        const art = ART[i] ?? '                 ';
        const info = INFO[i] ?? null;
        return (
          <div key={i} className="ts-fetch-row">
            <span className="ts-fetch-art">{art}</span>
            {info && (
              <span className="ts-fetch-info">
                {info.special === 'user' && (
                  <><span className="ts-green">jason</span><span className="ts-dim">@</span><span className="ts-blue">maaboudoumei</span></>
                )}
                {info.special === 'sep' && (
                  <span className="ts-dim">{'─'.repeat(30)}</span>
                )}
                {info.label && (
                  <><span className="ts-blue">{info.label}</span><span className="ts-dim">: </span><span className="ts-white">{info.value}</span></>
                )}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── shell line renderer ──────────────────────────────────────────────────────

function Prompt({ cwd, cmd }) {
  return (
    <div className="ts-line">
      <span className="ts-green">jason</span>
      <span className="ts-dim">@</span>
      <span className="ts-blue">maaboudoumei</span>
      <span className="ts-dim"> </span>
      <span className="ts-yellow">{shortPath(cwd)}</span>
      <span className="ts-dim"> ❯ </span>
      <span className="ts-white">{cmd}</span>
    </div>
  );
}

function LsOutput({ entries }) {
  return (
    <div className="ts-line ts-ls">
      {entries.map((e, i) => (
        <span key={i} className={e.endsWith('/') ? 'ts-blue ts-bold' : 'ts-white'}>
          {e}{i < entries.length - 1 ? '  ' : ''}
        </span>
      ))}
    </div>
  );
}

// ── main shell ───────────────────────────────────────────────────────────────

function Shell({ onExit }) {
  const initialFetch = { kind: 'neofetch' };
  const [entries, setEntries] = useState([initialFetch]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('~');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = useCallback(() => {
    const raw = input.trim();
    const result = runCommand(raw, cwd);

    if (raw) setCmdHistory(h => [raw, ...h]);
    setHistIdx(-1);
    setInput('');

    if (result.type === 'exit') { onExit(); return; }
    if (result.type === 'clear') { setEntries([{ kind: 'neofetch' }]); return; }

    const promptEntry = { kind: 'prompt', cwd, cmd: raw };

    if (result.type === 'cd') {
      setCwd(result.newCwd);
      setEntries(e => [...e, promptEntry]);
      return;
    }
    if (result.type === 'empty') {
      setEntries(e => [...e, promptEntry]);
      return;
    }
    if (result.type === 'neofetch') {
      setEntries(e => [...e, promptEntry, { kind: 'neofetch' }]);
      return;
    }
    if (result.type === 'ls') {
      setEntries(e => [...e, promptEntry, { kind: 'ls', entries: result.entries }]);
      return;
    }
    if (result.type === 'output') {
      setEntries(e => [...e, promptEntry, { kind: 'output', text: result.text }]);
      return;
    }
    if (result.type === 'error') {
      setEntries(e => [...e, promptEntry, { kind: 'error', text: result.text }]);
      return;
    }
  }, [input, cwd, onExit]);

  const handleKey = useCallback((e) => {
    if (e.key === 'Enter') { submit(); return; }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = histIdx + 1;
      if (idx < cmdHistory.length) {
        setHistIdx(idx);
        setInput(cmdHistory[idx]);
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = histIdx - 1;
      if (idx < 0) { setHistIdx(-1); setInput(''); }
      else { setHistIdx(idx); setInput(cmdHistory[idx]); }
    }
    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setEntries([{ kind: 'neofetch' }]);
    }
    if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      setEntries(prev => [...prev, { kind: 'prompt', cwd, cmd: input + '^C' }]);
      setInput('');
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      // simple tab complete for ls/cd/cat
      const parts = input.split(/\s+/);
      if (parts.length === 2) {
        const partial = parts[1];
        const entries = FS_DIRS[cwd] || [];
        const match = entries.find(e => e.startsWith(partial));
        if (match) setInput(`${parts[0]} ${match}`);
      }
    }
  }, [submit, histIdx, cmdHistory, cwd, input]);

  return (
    <div className="ts-shell" onClick={() => inputRef.current?.focus()}>
      {entries.map((e, i) => {
        if (e.kind === 'neofetch') return <Neofetch key={i} />;
        if (e.kind === 'prompt') return <Prompt key={i} cwd={e.cwd} cmd={e.cmd} />;
        if (e.kind === 'ls') return <LsOutput key={i} entries={e.entries} />;
        if (e.kind === 'output') return <pre key={i} className="ts-line ts-output">{e.text}</pre>;
        if (e.kind === 'error') return <div key={i} className="ts-line ts-error">{e.text}</div>;
        return null;
      })}

      {/* active prompt */}
      <div className="ts-line ts-active-prompt">
        <span className="ts-green">jason</span>
        <span className="ts-dim">@</span>
        <span className="ts-blue">maaboudoumei</span>
        <span className="ts-dim"> </span>
        <span className="ts-yellow">{cwd}</span>
        <span className="ts-dim"> ❯ </span>
        <span className="ts-input-wrap">
          <input
            ref={inputRef}
            className="ts-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            autoComplete="off"
            spellCheck={false}
            aria-label="terminal input"
          />
        </span>
      </div>

      <div ref={bottomRef} />
    </div>
  );
}

// ── boot sequence ─────────────────────────────────────────────────────────────

function Boot({ onDone }) {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    let i = 0;
    let cancelled = false;

    function next() {
      if (cancelled || i >= BOOT.length) {
        if (!cancelled) onDone();
        return;
      }
      const line = BOOT[i++];
      setLines(prev => [...prev, line]);
      setTimeout(next, line.ms);
    }

    setTimeout(next, 200);
    return () => { cancelled = true; };
  }, [onDone]);

  return (
    <div className="ts-boot">
      {lines.map((l, i) => (
        <div key={i} className={`ts-boot-line${l.ok ? ' ts-boot-ok' : ''}${l.login ? ' ts-boot-login' : ''}`}>
          {l.text}
        </div>
      ))}
    </div>
  );
}

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
