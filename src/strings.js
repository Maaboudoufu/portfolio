// Every string the page shows, in both languages.
//
// Two shapes live here:
//   • flat UI copy — present under BOTH `en` and `ja`.
//   • text overlays for the data arrays in App.js / TerminalSession.js
//     (experience, certs, …) — present under `ja` ONLY. Those arrays keep
//     their non-text fields (logos, hrefs, icons) in one place; localize()
//     in i18n.js merges the overlay on top, by index. Keep the overlays in
//     the same order as the arrays they cover.
//
// Deliberately untranslated: shell command names, the kernel boot log, and
// file names in the virtual FS. A Japanese-locale Linux box prints those in
// English too — translating them would read as costume, not localization.

export const STRINGS = {
  en: {
    locale: 'en-US',
    docTitle: 'Jason Tsao — Portfolio',
    switchTo: 'Switch to Japanese',

    nav: { about: 'about', experience: 'experience', skills: 'skills', projects: 'projects', contact: 'contact' },

    hero: { eyebrow: 'san jose, ca', terminal: 'Terminal', contact: 'Contact', resume: 'Resume ↗' },

    labels: {
      gallery: 'gallery',
      about: 'about',
      experience: 'experience',
      organizations: 'organizations',
      skills: 'skills',
      certs: 'certifications',
      projects: 'projects',
      contact: 'contact',
    },

    titles: {
      about: 'About me',
      experience: "Where I've worked",
      organizations: 'Clubs & involvement',
      skills: 'Tech stack',
      certs: 'Licenses & Certs',
      projects: "Things I've built",
      contact: 'Get in touch',
    },

    galleryAttrib: 'made possible with immich ╾━╤デ╦︻ (•_- )',

    aria: {
      scrollLeft: 'Scroll left',
      scrollRight: 'Scroll right',
      close: 'Close',
      prev: 'Previous',
      next: 'Next',
      termInput: 'terminal input',
    },

    about: {
      card: {
        school: "SJSU — BS CmpE '28 (3.70)",
        role: 'IT Systems Administrator',
        from: 'Sacramento, CA',
        based: 'San Jose, CA',
        goal: 'remote/hybrid',
        spoken: 'EN · JP',
      },
      body: [
        'I was born and raised in Sacramento for most of my life and moved to San Jose for school. I am now a Computer Engineering student at SJSU with a minor in Japanese. I was active in many clubs such as my office role in Japanese Student Association and Hong Kong Student Association during my first year. I started working at 16 and I have always been adamant about applying my skills to the real world instead of focusing solely on school.',
        'I work as an IT Systems Administrator managing enterprise infrastructure such as Active Directory, Windows Server, endpoint security, and networking. Outside of work I run a home lab that has a WireGuard VPN, Nginx reverse proxy, containerized services, and a locally-hosted AI on my own hardware.',
        "Long-term, I'm aiming for a role that's remote or hybrid, with the flexibility to live and work from abroad.",
      ],
    },

    projectLink: 'github →',

    github: {
      bio: 'computer engineering',
      repos: 'repos',
      followers: 'followers',
      following: 'following',
      joined: (date) => `joined ${date}`,
    },

    contactLinks: { email: 'email', linkedin: 'linkedin' },

    shell: {
      lsFail: (arg) => `ls: cannot access '${arg}': No such file or directory`,
      cdFail: (arg) => `cd: ${arg}: No such file or directory`,
      catMissing: 'cat: missing operand',
      catFail: (arg) => `cat: ${arg}: No such file or directory`,
      notFound: (cmd) => `${cmd}: command not found  (type 'help' for commands)`,
      help:
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
    },
  },

  // ── 日本語 ────────────────────────────────────────────────────────────────

  ja: {
    locale: 'ja-JP',
    docTitle: 'Jason Tsao — ポートフォリオ',
    switchTo: 'Switch to English',

    nav: { about: '自己紹介', experience: '経歴', skills: 'スキル', projects: 'プロジェクト', contact: 'お問い合わせ' },

    hero: { eyebrow: 'カリフォルニア州サンノゼ', terminal: 'ターミナル', contact: '連絡先', resume: '履歴書 ↗' },

    labels: {
      gallery: 'ギャラリー',
      about: '自己紹介',
      experience: '職務経歴',
      organizations: '課外活動',
      skills: 'スキル',
      certs: '資格',
      projects: 'プロジェクト',
      contact: '連絡先',
    },

    titles: {
      about: '私について',
      experience: 'これまでの仕事',
      organizations: '所属サークル・団体',
      skills: '技術スタック',
      certs: '資格・認定',
      projects: 'つくったもの',
      contact: 'お気軽にご連絡ください',
    },

    galleryAttrib: 'immich で配信中 ╾━╤デ╦︻ (•_- )',

    aria: {
      scrollLeft: '左へスクロール',
      scrollRight: '右へスクロール',
      close: '閉じる',
      prev: '前へ',
      next: '次へ',
      termInput: 'ターミナル入力',
    },

    about: {
      card: {
        school: 'サンノゼ州立大 — コンピュータ工学 2028年卒（GPA 3.70）',
        role: 'ITシステム管理者',
        from: 'カリフォルニア州サクラメント',
        based: 'カリフォルニア州サンノゼ',
        goal: 'リモート／ハイブリッド',
        spoken: '英語 ・ 日本語',
      },
      body: [
        '生まれも育ちもカリフォルニア州サクラメントで、大学進学を機にサンノゼへ移りました。現在はサンノゼ州立大学でコンピュータ工学を専攻し、副専攻で日本語を学んでいます。入学した年から日本学生協会（JSA）と香港学生会（HKSA）で役員を務めるなど、課外活動にも力を入れてきました。16歳から働きはじめたこともあり、学業だけで完結させず、身につけた技術を実際の現場で使うことにこだわっています。',
        '現在はITシステム管理者として、Active Directory や Windows Server、エンドポイントセキュリティ、ネットワークまわりの社内インフラを担当しています。仕事以外では自宅にホームラボを構築し、WireGuard の VPN、Nginx のリバースプロキシ、コンテナ化した各種サービス、そして自前のハードウェアで動かすローカル AI を運用しています。',
        '将来的にはリモートまたはハイブリッドで働ける環境に身を置き、海外を拠点にしながら仕事を続けていきたいと考えています。',
      ],
    },

    projectLink: 'GitHub →',

    github: {
      bio: 'コンピュータ工学',
      repos: 'リポジトリ',
      followers: 'フォロワー',
      following: 'フォロー中',
      joined: (date) => `${date}に登録`,
    },

    contactLinks: { email: 'メール', linkedin: 'LinkedIn' },

    // GNU coreutils / zsh の日本語ロケールでの実際の文言に寄せている。
    shell: {
      lsFail: (arg) => `ls: '${arg}' にアクセスできません: そのようなファイルやディレクトリはありません`,
      cdFail: (arg) => `cd: ${arg}: そのようなファイルやディレクトリはありません`,
      catMissing: 'cat: オペランドがありません',
      catFail: (arg) => `cat: ${arg}: そのようなファイルやディレクトリはありません`,
      notFound: (cmd) => `${cmd}: コマンドが見つかりません  （'help' で一覧を表示）`,
      help:
        `コマンド一覧:
  ls [dir]    ディレクトリの内容を表示
  cd [dir]    ディレクトリを移動  （例: cd projects）
  cat [file]  ファイルの中身を表示
  pwd         現在のディレクトリを表示
  whoami      ログイン中のユーザーを表示
  neofetch    システム情報を表示
  clear       画面をクリア
  exit        ターミナルを閉じる

ヒント: まずは  ls  、そのあと  cd projects/  を試してみてください。`,
    },

    // ── 以下、App.js / TerminalSession.js の配列に重ねるテキスト ────────────

    terminalLines: [
      {},
      {},
      {},
      { text: 'ITシステム管理者  ・  SJSU コンピュータ工学 2028年卒業見込み' },
      {},
      { text: 'リモート／ハイブリッド勤務 ・ 海外で暮らす' },
      {},
      {},
      {},
    ],

    skillGroups: [
      { label: '言語' },
      { label: 'フレームワーク・ライブラリ' },
      { label: 'インフラ・DevOps' },
      { label: 'セキュリティ・端末管理' },
    ],

    experience: [
      {
        title: 'ITシステム管理者',
        company: 'サンノゼ州立大学 Student Union, Inc.  ・  カリフォルニア州サンノゼ',
        period: '2026年5月\n– 現在',
        bullets: [
          'Proxmox VE・VMware ESX・Veeam バックアップ・UPS・冗長構成を運用し、ハードウェア障害時もサービスを止めない体制を維持。',
          'Kubernetes を導入してワークロードをコンテナ化し、4万人規模の学生に向けた継続的でスケーラブルなデプロイを実現。',
          'MCP 経由で外部ツールや各種サービスを呼び出すサーバーサイド AI エージェントを開発し、本番環境へ導入。',
          'Bitbucket と Plane を構築・運用し、RBAC やブランチ戦略、CI/CD パイプラインを整備。',
          'SSL 証明書・TCP/IP・DHCP・DNS・VLAN・NAT・ファイアウォールにまたがる接続障害を切り分け、原因を特定。',
          'CUPS と SNMP を設定し、印刷状況のリアルタイム把握と資産管理、消耗品の自動発注を実現。',
        ],
      },
      {
        title: 'ITテクニシャン',
        company: 'サンノゼ州立大学 Student Union, Inc.  ・  カリフォルニア州サンノゼ',
        period: '2026年2月\n– 2026年5月',
        bullets: [
          'Windows プリントサーバーの運用、端末のイメージング、ソフトウェア導入、キッティング、パッチ管理を担当。',
          'Intune と Jamf で Windows・macOS 端末を管理し、コンプライアンスポリシーを適用。',
          'Qualys で CVE を洗い出し、CVSS の深刻度に応じて優先順位をつけて対処し、脆弱性を削減。',
          'MDF／IDF まわりの設備対応として、情報コンセントの敷設、スイッチ、パッチ配線、圧接作業を担当。',
        ],
      },
      {
        title: 'ソフトウェアエンジニア（開発チーム）',
        company: 'Software and Computer Engineering Society  ・  カリフォルニア州サンノゼ',
        period: '2026年1月\n– 現在',
        bullets: [
          'YouTube の音源を Raspberry Pi で流す音楽ストリーミングアプリを TypeScript（React・Express・Prisma・SQLite）で開発。',
          'Pi 側からバックエンドへ接続する送信専用の WebSocket ブリッジを設計し、インバウンドのファイアウォール開放を不要に。',
          '各サービスを Docker Compose でコンテナ化し、Pi 側は yt-dlp の出力を mpv へ渡す systemd デーモンとして常駐化。',
        ],
      },
      {
        title: '運営スーパーバイザー',
        company: 'サンノゼ州立大学 Student Union, Inc.  ・  カリフォルニア州サンノゼ',
        period: '2024年9月\n– 2026年2月',
        bullets: [
          'スタッフの勤務状況を把握し、現場で直接指導しながら育成を担当。',
          '新人研修を実施し、利用団体の許可条件の遵守を徹底したうえで、イベント運営の調整も担当。',
          '避難誘導や火災報知設備の確認、警備上のトラブル対応など、緊急時の指揮を担当。',
        ],
      },
      {
        title: 'サービスクラーク',
        company: "Raley's  ・  カリフォルニア州サクラメント",
        period: '2022年6月\n– 2024年8月',
        bullets: [
          '中国語と英語を使い分け、同僚やお客様と円滑にコミュニケーション。',
          '商品の袋詰めや駐車場までの運搬をこなし、丁寧な接客を徹底。',
          '清掃やモップがけ、ゴミの回収を通じて店内の清潔さを維持。',
          '商品の補充と在庫管理を行い、売り場の欠品を防止。',
          '新人スタッフに店舗業務や接客の基準を指導し、チーム全体の底上げに貢献。',
        ],
      },
    ],

    organizations: [
      {
        title: 'イベントコーディネーター',
        org: 'サンノゼ州立大学 香港学生会  ・  カリフォルニア州サンノゼ',
        period: '2024年12月\n– 2025年5月',
        bullets: [
          '中国語と英語を使い分け、役員とメンバーの橋渡し役を担当。',
          '広報と SNS 運用を担当し、認知度の向上と新規メンバーの獲得に貢献。',
          '文化ワークショップや交流イベントを企画・運営し、コミュニティの結束を強化。',
          '地域の店舗と連携して協賛を獲得し、大規模イベントの開催を実現。',
        ],
      },
      {
        title: 'イベントコーディネーター',
        org: 'サンノゼ州立大学 日本学生協会  ・  カリフォルニア州サンノゼ',
        period: '2024年9月\n– 2025年5月',
        bullets: [
          '日本語と英語を使い分け、役員とメンバーの意思疎通を担当。',
          '週次ミーティングを主導し、役割分担を整理して運営を効率化。',
          '地域の店舗と協力して協賛を確保し、イベントの規模を拡大。',
          '文化ワークショップや交流イベントを企画し、参加率を向上。',
          '広報・SNS キャンペーンを立ち上げ、認知度と入会者数を伸ばした。',
          '日本の伝統文化と日本語に特化した分科会を新設し、統括を担当。',
        ],
      },
    ],

    certs: [
      { name: 'テクニカルサポートの基礎', issuer: 'Google', date: '2026年2月' },
      { name: '脆弱性管理・検知・対応（VMDR）', issuer: 'Qualys', date: '2025年11月 · 2027年11月まで有効' },
      { name: 'TTBJ 筑波日本語テスト集', issuer: '筑波大学', date: '2025年3月' },
      // .cert-name is a single ellipsized line — lead with the qualification,
      // not the audience, so the tail is what gets cut.
      { name: '応急手当／CPR／AED（成人・小児）', issuer: 'アメリカ赤十字社', date: '2025年5月 · 2027年5月まで有効' },
      { name: 'OSHA 10時間 安全衛生講習', issuer: 'CareerSafe', date: '2023年12月' },
    ],

    projects: [
      {
        desc: 'Seeed 主催の Embodied AI ハッカソンで2位を獲得した、AI による集中度モニタリングシステム。OpenCV と GPT-4V を組み合わせたパイプラインで学生の集中状態を10秒ごとに判定し、カメラ映像を FastAPI のダッシュボードへリアルタイム配信します。さらに Whisper ベースの音声エージェントから Reachy Mini の動作制御と dnsmasq の許可リスト更新を行えるようにしました。',
      },
      {
        desc: 'pfSense をメインルーターに据え、VLAN でネットワークを分割したうえでファイアウォールルールと NAT ポリシーを設計。Proxmox をベアメタルで動かして複数の VM をホスト・隔離・スナップショット管理し、ホスト設定と SSH 鍵の配布は冪等な Ansible Playbook で自動化しています。ストレージは OpenMediaVault の仮想ディスク RAID 10 で冗長化し、Prometheus と Grafana でメトリクス収集・アラート・ダッシュボードを構築。自前の Ollama LLM エンドポイントは Nginx のリバースプロキシと TLS で保護し、WireGuard 経由でのみ到達できるようにしています。',
      },
    ],

    neofetch: [
      {},
      {},
      {},
      {},
      {},
      { label: '職種', value: 'ITシステム管理者 @ SJSU' },
      { label: '学校', value: 'サンノゼ州立大 — コンピュータ工学 2028年卒' },
      { label: '言語', value: '英語 ・ 日本語' },
      { label: 'メール', value: 'jason.tsao@maaboudoumei.org' },
    ],

    fsFiles: {
      '~/about.txt':
        `名前    : Jason Tsao
出身    : カリフォルニア州サクラメント
拠点    : カリフォルニア州サンノゼ
大学    : サンノゼ州立大学 コンピュータ工学専攻／日本語副専攻（GPA 3.70）
卒業    : 2027年12月
希望    : リモート・ハイブリッド勤務、海外在住も視野
言語    : 英語（母語）・日本語（日常会話レベル）
所属    : Software and Computer Engineering Society ・ JSA ・ HKSA @ SJSU`,

      '~/contact.txt':
        `メール  : jason.tsao@maaboudoumei.org
GitHub  : github.com/maaboudoufu
LinkedIn: linkedin.com/in/jtsaoo`,

      '~/skills.txt':
        `── 言語 ───────────────────────────────────────
  C/C++  Assembly  JavaScript  TypeScript  HTML/CSS  Python  Bash/Zsh  PowerShell

── フレームワーク・ライブラリ ─────────────────
  React.js  Vite  Node.js  Express  FastAPI  Prisma  SQLAlchemy  SQLite
  OpenCV  OpenAI Whisper  GPT-4V  MCP

── インフラ・DevOps ───────────────────────────
  Docker  Proxmox  pfSense  Nginx  Prometheus  Grafana  Ollama  WebSockets
  TCP/IP  NAT  DHCP  DNS  VLAN  VPN  SSL/TLS  Linux  Git  GitHub Actions  CI/CD

── セキュリティ・端末管理 ─────────────────────
  Qualys  Sophos  Jamf  Intune  Active Directory  RBAC  Windows Server`,

      '~/projects/studyguard/README.md':
        `# StudyGuard
Seeed 主催 Embodied AI ハッカソン 2位

DNS サーバーを動的に書き換えながら、Reachy Mini ロボットが
見守る集中度モニタリングシステム。

OpenCV と GPT-4V のパイプラインで10秒ごとに集中状態を判定し、
映像を FastAPI のダッシュボードへライブ配信。Whisper ベースの
音声エージェントがロボットの動作制御と dnsmasq 許可リストの
更新を担当します。

技術: Python · FastAPI · OpenCV · OpenAI Whisper · SQLAlchemy · NVIDIA Jetson Orin Nano`,

      '~/projects/home-lab/README.md':
        `# ホームラボ

pfSense をメインルーターに据え、VLAN でネットワークを分割したうえで
ファイアウォールルールと NAT ポリシーを設計。Proxmox をベアメタルで
動かして複数の VM をホスト・隔離・スナップショット管理し、ホスト設定と
SSH 鍵の配布は冪等な Ansible Playbook で自動化しています。

ストレージは OpenMediaVault の仮想ディスク RAID 10 で冗長化。
Prometheus と Grafana でメトリクス収集・アラート・ダッシュボードを
構築し、自前の Ollama LLM エンドポイントは Nginx のリバースプロキシと
TLS で保護、WireGuard 経由でのみ到達できるようにしています。

技術: Docker · Ansible · Nginx · Prometheus · Grafana · Ollama · Proxmox · pfSense · OpenMediaVault · WireGuard`,

      '~/experience/it-systems-administrator.txt':
        `ITシステム管理者
サンノゼ州立大学 Student Union, Inc. · カリフォルニア州サンノゼ
2026年5月 – 現在

• Proxmox VE・VMware ESX・Veeam バックアップ・UPS・冗長構成を運用し、
  ハードウェア障害時もサービスを止めない体制を維持。
• Kubernetes を導入してワークロードをコンテナ化し、4万人規模の学生に
  向けた継続的でスケーラブルなデプロイを実現。
• MCP 経由で外部ツールや各種サービスを呼び出すサーバーサイド AI
  エージェントを開発し、本番環境へ導入。
• Bitbucket と Plane を構築・運用し、RBAC やブランチ戦略、CI/CD
  パイプラインを整備。
• SSL 証明書・TCP/IP・DHCP・DNS・VLAN・NAT・ファイアウォールにまたがる
  接続障害を切り分け、原因を特定。
• CUPS と SNMP を設定し、印刷状況のリアルタイム把握と資産管理、
  消耗品の自動発注を実現。`,

      '~/experience/it-technician.txt':
        `ITテクニシャン
サンノゼ州立大学 Student Union, Inc. · カリフォルニア州サンノゼ
2026年2月 – 2026年5月

• Windows プリントサーバーの運用、端末のイメージング、ソフトウェア導入、
  キッティング、パッチ管理を担当。
• Intune と Jamf で Windows・macOS 端末を管理し、コンプライアンス
  ポリシーを適用。
• Qualys で CVE を洗い出し、CVSS の深刻度に応じて優先順位をつけて対処し、
  脆弱性を削減。
• MDF／IDF まわりの設備対応として、情報コンセントの敷設、スイッチ、
  パッチ配線、圧接作業を担当。`,

      '~/experience/sce-developer.txt':
        `ソフトウェアエンジニア（開発チーム）
Software and Computer Engineering Society · カリフォルニア州サンノゼ
2026年1月 – 現在

• YouTube の音源を Raspberry Pi で流す音楽ストリーミングアプリを
  TypeScript（React・Express・Prisma・SQLite）で開発。
• Pi 側からバックエンドへ接続する送信専用の WebSocket ブリッジを設計し、
  インバウンドのファイアウォール開放を不要に。
• 各サービスを Docker Compose でコンテナ化し、Pi 側は yt-dlp の出力を
  mpv へ渡す systemd デーモンとして常駐化。`,

      '~/experience/building-supervisor.txt':
        `運営スーパーバイザー
サンノゼ州立大学 Student Union, Inc. · カリフォルニア州サンノゼ
2024年9月 – 2026年2月

• スタッフの勤務状況を把握し、現場で直接指導しながら育成を担当。
• 新人研修を実施し、利用団体の許可条件の遵守を徹底したうえで、
  イベント運営の調整も担当。
• 避難誘導や火災報知設備の確認、警備上のトラブル対応など、
  緊急時の指揮を担当。`,

      '~/experience/courtesy-clerk.txt':
        `サービスクラーク
Raley's · カリフォルニア州サクラメント
2022年6月 – 2024年8月

• 中国語と英語を使い分け、同僚やお客様と円滑にコミュニケーション。
• 商品の袋詰めや駐車場までの運搬をこなし、丁寧な接客を徹底。
• 清掃やモップがけ、ゴミの回収を通じて店内の清潔さを維持。
• 商品の補充と在庫管理を行い、売り場の欠品を防止。
• 新人スタッフに店舗業務や接客の基準を指導し、チーム全体の底上げに貢献。`,

      '~/certs/google-it.txt':
        `Google — テクニカルサポートの基礎
取得日  : 2026年2月
ID      : DBKG6T33HE1B
確認先  : coursera.org/verify/DBKG6T33HE1B`,

      '~/certs/qualys-vmdr.txt':
        `Qualys — 脆弱性管理・検知・対応（VMDR）
取得日  : 2025年11月
有効期限: 2027年11月`,

      '~/certs/tsukuba-ttbj.txt':
        `筑波大学 — TTBJ 筑波日本語テスト集
取得日  : 2025年3月`,

      '~/certs/redcross-cpr.txt':
        `アメリカ赤十字社 — 成人・小児向け応急手当／CPR／AED
取得日  : 2025年5月
有効期限: 2027年5月
ID      : 01UFEE1`,

      '~/certs/osha-10.txt':
        `CareerSafe — OSHA 10時間 安全衛生講習
取得日  : 2023年12月`,

      '~/organizations/hksa.txt':
        `イベントコーディネーター
サンノゼ州立大学 香港学生会 · カリフォルニア州サンノゼ
2024年12月 – 2025年5月

• 中国語と英語を使い分け、役員とメンバーの橋渡し役を担当。
• 広報と SNS 運用を担当し、認知度の向上と新規メンバーの獲得に貢献。
• 文化ワークショップや交流イベントを企画・運営し、コミュニティの結束を強化。
• 地域の店舗と連携して協賛を獲得し、大規模イベントの開催を実現。`,

      '~/organizations/jsa.txt':
        `イベントコーディネーター
サンノゼ州立大学 日本学生協会 · カリフォルニア州サンノゼ
2024年9月 – 2025年5月

• 日本語と英語を使い分け、役員とメンバーの意思疎通を担当。
• 週次ミーティングを主導し、役割分担を整理して運営を効率化。
• 地域の店舗と協力して協賛を確保し、イベントの規模を拡大。
• 文化ワークショップや交流イベントを企画し、参加率を向上。
• 広報・SNS キャンペーンを立ち上げ、認知度と入会者数を伸ばした。
• 日本の伝統文化と日本語に特化した分科会を新設し、統括を担当。`,
    },
  },
};
