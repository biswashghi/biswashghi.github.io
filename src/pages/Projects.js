import React from 'react';
import ProjectCard from '../components/Projects/ProjectCard';

const Projects = () => {
    const featuredProjects = [
        {
            title: 'Tiny LLM From Scratch',
            description: 'A small PyTorch language-modeling project that grows from a bigram baseline into a causal Transformer, with character/BPE tokenizers, checkpoint resume, sampling controls, and repeatable evaluation reports.',
            deployment: 'Project type: educational ML system',
            deploymentStatus: 'Public GitHub repo',
            tags: ['Python', 'PyTorch', 'Transformer', 'BPE', 'Evaluation'],
            links: [
                { label: 'GitHub repo', href: 'https://github.com/biswashghi/tiny_llm' }
            ]
        },
        {
            title: 'PAISA Loyalty Platform',
            description: 'A loyalty-platform backend and partner console for rewards programs, member management, rule-version publishing, idempotent transaction ingestion, ledger-backed balances, and redemption workflows.',
            deployment: 'Deployment: Go API + PostgreSQL + React partner console',
            deploymentStatus: 'Public GitHub repo with local and VPS deployment runbooks',
            tags: ['Go', 'PostgreSQL', 'React', 'Rewards', 'Platform'],
            links: [
                { label: 'GitHub repo', href: 'https://github.com/biswashghi/paisa' }
            ]
        }
    ];

    const projectSections = [
        {
            title: 'Deployed Personal Apps',
            projects: [
                {
                    title: 'Family Hub',
                    summary: 'Household bills, payments, documents, auth, uploads, and a single-container Hetzner deployment.',
                    links: [
                        { label: 'GitHub repo', href: 'https://github.com/biswashghi/family_hub' },
                        { label: 'Live site', href: 'https://family.bghimire.com', ghost: true }
                    ]
                },
                {
                    title: 'Personal Site and Blog Publisher',
                    summary: 'This React/MDX site, with GitHub-backed post publishing, asset uploads, and GitHub Pages deployment.',
                    links: [
                        { label: 'GitHub repo', href: 'https://github.com/biswashghi/biswashghi.github.io' }
                    ]
                }
            ]
        },
        {
            title: 'Tools and Infrastructure',
            projects: [
                {
                    title: 'Novel Tracker Extension',
                    summary: 'Manifest V3 browser extension for tracking web novel reading progress across chapter pages.',
                    links: [
                        { label: 'GitHub repo', href: 'https://github.com/biswashghi/novel_tracker' }
                    ]
                },
                {
                    title: 'VPS Deploy',
                    summary: 'Reusable Hetzner VPS deployment flow covering Terraform, DNS, Caddy, Docker hosting, secrets, and runbooks.',
                    links: [
                        { label: 'GitHub repo', href: 'https://github.com/biswashghi/hetzner_tf/tree/main' }
                    ]
                }
            ]
        }
    ];

    return (
        <div className="page">
            <header className="page__header">
                <h1 className="page__title">Projects</h1>
                <p className="page__lede">A smaller, higher-signal view of the work: two larger systems in detail, then compact notes for the apps, tools, and infrastructure that support the rest.</p>
            </header>

            <section className="project-section" aria-labelledby="projects-featured">
                <div className="project-section__head">
                    <p className="kicker">Featured systems</p>
                    <h2 id="projects-featured">Detailed work</h2>
                </div>
                <div className="grid grid--cards project-featured-grid">
                    {featuredProjects.map((project) => (
                        <div key={project.title} className="card card--feature project-detail-card">
                            <ProjectCard {...project} />
                        </div>
                    ))}
                </div>
            </section>

            {projectSections.map((section) => (
                <section className="project-section" key={section.title} aria-labelledby={`project-section-${section.title.replace(/\s+/g, '-').toLowerCase()}`}>
                    <div className="project-section__head">
                        <p className="kicker">More signal</p>
                        <h2 id={`project-section-${section.title.replace(/\s+/g, '-').toLowerCase()}`}>{section.title}</h2>
                    </div>
                    <div className="project-compact-list">
                        {section.projects.map((project) => (
                            <article className="project-compact" key={project.title}>
                                <div>
                                    <h3>{project.title}</h3>
                                    <p>{project.summary}</p>
                                </div>
                                {project.links.length ? (
                                    <div className="project-actions project-compact__actions">
                                        {project.links.map((item) => (
                                            <a
                                                key={`${project.title}-${item.href}-${item.label}`}
                                                href={item.href}
                                                className={`button button--small${item.ghost ? ' button--ghost' : ''}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {item.label}
                                            </a>
                                        ))}
                                    </div>
                                ) : null}
                            </article>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default Projects;
