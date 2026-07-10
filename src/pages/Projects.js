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
            title: 'Hetzner Terraform Infra (hetzner_tf)',
            description: 'A shared infrastructure repo for provisioning and operating Hetzner-hosted apps, covering Terraform, Bitwarden-backed secret retrieval, shared Caddy setup, DNS wiring, and reusable deployment flows.',
            deployment: 'Deployment: Infrastructure and operations repo for Hetzner apps',
            deploymentStatus: 'Public GitHub repo plus local runbook/workflow',
            tags: ['Terraform', 'Hetzner Cloud', 'Caddy', 'DNS', 'Bitwarden'],
            links: [
                { label: 'GitHub repo', href: 'https://github.com/biswashghi/hetzner_tf/tree/main' }
            ]
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
