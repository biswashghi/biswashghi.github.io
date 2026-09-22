// Bullets are { text, priority }. Priority 1 always stays; when the PDF
// overflows one page, scripts/generate-resume-pdf.cjs drops priority 3
// bullets first, then 2, bottom-up. Plain strings default to priority 2.
const experience = [
  {
    title: 'Capital One / Lead Software Engineer',
    meta: 'Aug 2020 - Present, Remote',
    groups: [
      {
        label: 'Loyalty Earn Platform',
        bullets: [
          { priority: 1, text: 'Lead a team of five engineers building the next-generation Loyalty Earn Platform, one of six teams in a 30-40 engineer modernization effort.' },
          { priority: 1, text: 'Architected the event-driven processing pipeline handling 60M+ events a day, cutting rewards latency by 8 hours and processing runtime by 3 hours.' },
          { priority: 2, text: 'Designed the multi-region processing model — layered idempotency, event ordering, and consistency guarantees — that keeps reward processing correct across distributed streams.' },
          { priority: 2, text: 'Redesigned reward evaluation to support ordered benefits and threshold-based state transitions, unblocking the Discover integration where benefits could no longer be treated as independent.' },
        ],
      },
      {
        label: 'Partner Integrations',
        bullets: [
          { priority: 1, text: 'Consolidated 10 partner API endpoints into a single integration platform serving 30M+ requests a day for Amazon, PayPal, REI, and T-Mobile, with reusable abstractions that make onboarding a new partner a configuration change rather than a build.' },
          { priority: 2, text: 'Converged per-partner implementations into one shared codebase with automated regression coverage, so teams ship independently without breaking partner-specific behavior.' },
          { priority: 3, text: 'Modernized AutoRedemption on reusable event-driven patterns that became the foundation for Discover AutoRedemption.' },
          { priority: 2, text: 'Generalized the bureau data pipelines (Equifax, Experian, TransUnion) into a reusable onboarding path, migrated with 100% validation.' },
        ],
      },
      {
        label: 'Technical Leadership',
        bullets: [
          { priority: 2, text: 'Serve as the Loyalty platform SME across teams, owning event schemas and integration contracts with peer tech leads and Distinguished Engineers.' },
          { priority: 3, text: 'Break large architectural initiatives into multi-team implementation roadmaps with engineering managers and product owners.' },
        ],
      },
    ],
  },
  {
    title: 'University of Michigan EECS / Instructional Aide',
    meta: 'Jan 2019 - Apr 2020',
    bullets: [
      { priority: 3, text: 'Taught lab sections and office hours for a web systems course — REST APIs, client- and server-side rendering, DNS, cloud deployment — and co-designed and graded exams and assignments.' },
    ],
  },
];

export default experience;
