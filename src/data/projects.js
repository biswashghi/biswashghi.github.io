export const featuredProjects = [
  {
    title: 'Tiny LLM From Scratch',
    description: 'A small language-modeling project in PyTorch, starting with a bigram baseline and building up to a causal Transformer with tokenizers, checkpoints, sampling, and evaluation.',
    deployment: 'Project type: educational ML system',
    deploymentStatus: 'Public GitHub repo',
    tags: ['Python', 'PyTorch', 'Transformer', 'BPE', 'Evaluation'],
    links: [{ label: 'GitHub repo', href: 'https://github.com/biswashghi/tiny_llm' }],
  },
  {
    title: 'PAISA Loyalty Platform',
    description: 'A rewards-platform backend and partner console: programs, rules, members, transactions, ledgers, and redemption flows.',
    deployment: 'Deployment: Go API + PostgreSQL + React partner console',
    deploymentStatus: 'Public GitHub repo with local and VPS deployment runbooks',
    tags: ['Go', 'PostgreSQL', 'React', 'Rewards', 'Platform'],
    links: [{ label: 'GitHub repo', href: 'https://github.com/biswashghi/paisa' }],
  },
];

export const projectSections = [
  {
    title: 'Deployed Personal Apps',
    projects: [
      { title: 'Family Hub', summary: 'Household bills, payments, documents, auth, uploads, and a single-container Hetzner deployment.', links: [{ label: 'GitHub repo', href: 'https://github.com/biswashghi/family_hub' }, { label: 'Live site', href: 'https://family.bghimire.com', ghost: true }] },
      { title: 'Personal Site and Blog Publisher', summary: 'This React/MDX site, with GitHub-backed post publishing, asset uploads, and GitHub Pages deployment.', links: [{ label: 'GitHub repo', href: 'https://github.com/biswashghi/biswashghi.github.io' }] },
    ],
  },
  {
    title: 'Tools and Infrastructure',
    projects: [
      { title: 'Novel Tracker Extension', summary: 'Manifest V3 browser extension for tracking web novel reading progress across chapter pages.', links: [{ label: 'GitHub repo', href: 'https://github.com/biswashghi/novel_tracker' }] },
      { title: 'VPS Deploy', summary: 'Reusable Hetzner VPS deployment flow covering Terraform, DNS, Caddy, Docker hosting, secrets, and runbooks.', links: [{ label: 'GitHub repo', href: 'https://github.com/biswashghi/hetzner_tf/tree/main' }] },
    ],
  },
];
