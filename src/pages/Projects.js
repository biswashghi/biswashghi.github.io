import React from 'react';
import ProjectCard from '../components/Projects/ProjectCard';

const Projects = () => {
    const projectList = [
        {
            title: 'Fitness Tracker',
            description: 'A mobile-first fitness tracker with a PWA frontend, Node API, and SQLite-backed workout logging, built to run locally and in production with a practical operations story.',
            deployment: 'Deployment: Hetzner via Terraform + Docker + shared Caddy',
            deploymentStatus: 'Configured domain: fit.bghimire.com',
            tags: ['TypeScript', 'PWA', 'Node API', 'SQLite', 'Hetzner'],
            links: [
                { label: 'GitHub repo', href: 'https://github.com/biswashghi/fitness' }
            ]
        },
        {
            title: 'Family Hub',
            description: 'A single-container household app for shared bills, payments, and important documents, with auth, persistent uploads, and an end-to-end deployment path.',
            deployment: 'Deployment: Hetzner via shared Terraform/Caddy flow',
            deploymentStatus: 'Configured domain: family.bghimire.com',
            tags: ['JavaScript', 'Express', 'SQLite', 'Docker', 'Hetzner'],
            links: [
                { label: 'GitHub repo', href: 'https://github.com/biswashghi/family_hub' }
            ]
        },
        {
            title: 'Badge Creator',
            description: 'A static badge-generation site with its own production compose and Caddy configuration, useful as a simple app and as a deployment building block.',
            deployment: 'Deployment: Hetzner static site behind shared Caddy',
            deploymentStatus: 'Live URL responding: badges.bghimire.com',
            tags: ['HTML', 'Static Site', 'Caddy', 'Hetzner'],
            links: [
                { label: 'GitHub repo', href: 'https://github.com/biswashghi/badge_creator' },
                { label: 'Live site', href: 'https://badges.bghimire.com', ghost: true }
            ]
        },
        {
            title: 'Hetzner Deployment Runbook',
            description: 'A local infrastructure repo that wraps Terraform, Bitwarden-backed secret retrieval, shared Caddy setup, DNS wiring, and per-app deployment flows for the apps above.',
            deployment: 'Deployment: Infrastructure and operations repo',
            deploymentStatus: 'Local repo: /Users/biswash/Documents/repos/hetzner_tf',
            tags: ['Terraform', 'Hetzner Cloud', 'Caddy', 'DNS', 'Bitwarden']
        },
        {
            title: 'Personal Site and Blog Publisher',
            description: 'This site doubles as a portfolio and lightweight MDX publishing tool, with GitHub-backed post creation and automated GitHub Pages deployment.',
            deployment: 'Deployment: GitHub Pages',
            deploymentStatus: 'Public repo and live site',
            tags: ['React', 'MDX', 'GitHub Pages', 'Portfolio'],
            links: [
                { label: 'GitHub repo', href: 'https://github.com/biswashghi/biswashghi.github.io' },
                { label: 'Live site', href: 'https://biswashghi.github.io', ghost: true }
            ]
        },
        {
            title: 'NAPA Americas Website v2',
            description: 'A larger local project replacing a legacy site with a custom Next.js, Payload CMS, Postgres, MinIO, Stripe, and OAuth-backed admin stack plus migration tooling.',
            deployment: 'Deployment: Local/private repo',
            deploymentStatus: 'Local repo: /Users/biswash/Documents/repos/napa-site',
            tags: ['Next.js', 'Payload CMS', 'Postgres', 'Stripe', 'Migration']
        }
    ];

    return (
        <div className="page">
            <header className="page__header">
                <h1 className="page__title">Projects</h1>
                <p className="page__lede">A mix of public GitHub repos and active local work. I like projects that include not just app code, but a believable path to deployment, operations, and iteration.</p>
            </header>

            <div className="grid grid--cards">
                {projectList.map((project, index) => (
                    <div key={index} className="card">
                        <ProjectCard {...project} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;
