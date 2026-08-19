export const featuredProjects = [
  {
    title: 'Novel Tracker Extension',
    description: 'A local-first, cross-platform extension for tracking web-novel reading progress across chapter sites.',
    highlights: [
      'Chrome, Edge, Firefox, and native Safari (macOS/iOS/iPadOS) builds',
      '9 site-specific parsers, plus a generic-metadata fallback',
      'Optional sync via a Node.js API with HLC / remove-wins conflict resolution',
      'Shared core modules; automated CI release and Playwright e2e tests',
    ],
    deployment: 'Deployment: Chrome Web Store extension, Node.js sync API in Docker',
    deploymentStatus: 'Public GitHub repo, published Chrome Web Store listing (early release)',
    tags: ['JavaScript', 'Swift', 'Manifest V3', 'Chrome Extensions', 'Safari Web Extension', 'Offline Sync', 'Node.js', 'Docker', 'Playwright'],
    links: [
      { label: 'GitHub repo', href: 'https://github.com/biswashghi/novel_tracker' },
      { label: 'Chrome Web Store', href: 'https://chromewebstore.google.com/detail/novel-tracker/meciopmpdehijfmbgbagndgknlmbmjoa', ghost: true },
    ],
  },
];

export const projectSections = [
  {
    title: 'Personal Projects',
    projects: [
      {
        title: 'PAISA Loyalty Platform',
        summary: 'A rewards-platform backend and partner console: programs, rules, members, transactions, ledgers, and redemption flows, built with a Go API, PostgreSQL, and a React partner console.',
        links: [
          { label: 'GitHub repo', href: 'https://github.com/biswashghi/paisa' },
          { label: 'Live site', href: 'https://paisa.bghimire.com/', ghost: true },
        ],
      },
      {
        title: 'Family Hub',
        summary: 'Household bills, payments, documents, auth, uploads, and a single-container Hetzner deployment.',
        links: [
          { label: 'GitHub repo', href: 'https://github.com/biswashghi/family_hub' },
          { label: 'Live site', href: 'https://family.bghimire.com', ghost: true },
        ],
      },
      {
        title: 'Personal Site and Blog Publisher',
        summary: 'This React/MDX site, with GitHub-backed post publishing, asset uploads, and GitHub Pages deployment.',
        links: [{ label: 'GitHub repo', href: 'https://github.com/biswashghi/biswashghi.github.io' }],
      },
      {
        title: 'Tiny LLM From Scratch',
        summary: 'A small language-modeling project in PyTorch: a bigram baseline built up into a causal Transformer, with a custom BPE tokenizer, checkpointing, sampling, and an evaluation pipeline.',
        links: [{ label: 'GitHub repo', href: 'https://github.com/biswashghi/tiny_llm' }],
      },
      {
        title: 'VPS Deploy',
        summary: 'Reusable Hetzner VPS deployment flow covering Terraform, DNS, Caddy, Docker hosting, secrets, and runbooks.',
        links: [{ label: 'GitHub repo', href: 'https://github.com/biswashghi/hetzner_tf/tree/main' }],
      },
    ],
  },
];
