const experience = [
  {
    title: 'Capital One / Lead Software Engineer',
    meta: 'Aug 2020 - Present, Remote',
    groups: [
      {
        label: 'Loyalty Earn Platform & Distributed Systems',
        bullets: [
          "Technical lead within a 30-40 engineer, six-team modernization effort building Capital One's next-generation Loyalty Earn Platform.",
          'Architected event-driven processing supporting 60M+ daily events, reducing rewards latency by 8 hours and processing runtime by 3 hours.',
          'Designed multi-region event-processing architectures incorporating layered idempotency, event ordering, and consistency strategies to ensure reliable reward processing across distributed streaming systems.',
          'Redesigned reward processing architecture to support ordered benefit evaluation and threshold-based state transitions within an event-driven platform to support Discover integration, overcoming assumptions of benefit independence.',
        ],
      },
      {
        label: 'Partner Integrations & Platform Engineering',
        bullets: [
          'Designed the convergence strategy from legacy orchestration APIs to a unified Loyalty Platform service supporting Amazon, PayPal, REI, T-Mobile, and future partners.',
          'Consolidated 10 partner API endpoints into a common integration platform processing 30M+ daily API requests, using reusable abstractions to simplify onboarding of new partners.',
          'Balanced repository architecture and deployment tradeoffs by converging partner implementations into a shared codebase with strict automated regression guarantees, enabling independent feature development while maintaining partner-specific behavior.',
          'Modernized AutoRedemption through reusable event-driven integration patterns that became the architectural foundation for Discover AutoRedemption.',
          'Generalized bureau data pipelines supporting Equifax, Experian, and TransUnion, enabling reusable partner onboarding with 100% migration validation.',
        ],
      },
      {
        label: 'Platform Modernization & Technical Leadership',
        bullets: [
          'Technical lead for a team of five engineers, partnering with engineering leadership and product to define technical direction, architecture, and implementation plans.',
          'Served as a Loyalty platform SME, collaborating with peer tech leads and Distinguished Engineers on event schemas, integration contracts, and cross-team architecture.',
          'Regularly collaborated with engineering managers, product owners, and peer technical leads to decompose large architectural initiatives into implementation roadmaps spanning multiple engineering teams.',
        ],
      },
    ],
  },
  {
    title: 'University of Michigan EECS Department / Instructional Aide',
    meta: 'Jan 2019 - Apr 2020',
    bullets: [
      'Led lab sessions, held office hours, and supported student understanding of web technologies such as REST APIs, CSR/SSR, DNS, and cloud computing.',
      'Collaborated with faculty to design, administer, and grade exams and assignments; provided detailed feedback to students and contributed to continuous course improvement through content development and updates.',
    ],
  },
  {
    title: 'Scientific Computing and Flow Physics Laboratory / Research Assistant',
    meta: 'Sep 2016 - Apr 2017',
    bullets: [
      'Worked under a PhD candidate to explore benefits of high-order vs low-order discretization in space and time when utilizing numerical methods such as Runge-Kutta (RK), Discontinuous-Galerkin (DG), and Finite Difference (FD) for unsteady physical system simulation using GMSH.',
      'Presented learnings in a poster presentation session at the end of the year organized by the Undergraduate Research Opportunities Program.',
    ],
  },
];

export default experience;
