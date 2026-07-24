import React from 'react';
import ProjectCard from '../components/Projects/ProjectCard';

const Projects = () => {
    const projectList = [
        {
            title: 'Tiny LLM From Scratch',
            description: 'A small PyTorch language-modeling project that grows from a bigram baseline into a causal Transformer, with character/BPE tokenizers, checkpoint resume, sampling controls, and repeatable evaluation reports.',
            deployment: 'Project type: educational ML system',
            deploymentStatus: 'Local repo; being prepared for public release',
            tags: ['Python', 'PyTorch', 'Transformer', 'BPE', 'Evaluation'],
            links: [
                { label: 'GitHub repo', href: 'https://github.com/biswashghi/tiny_llm' }
            ]
        },
        {
            title: 'Family Hub',
            description: 'A single-container household app for shared bills, payments, and important documents, with auth, persistent uploads, and an end-to-end deployment path.',
            deployment: 'Deployment: Hetzner via shared Terraform/Caddy flow',
            deploymentStatus: 'Configured domain: family.bghimire.com',
            tags: ['JavaScript', 'Express', 'SQLite', 'Docker', 'Hetzner'],
            links: [
                { label: 'GitHub repo', href: 'https://github.com/biswashghi/family_hub' },
                { label: 'Live site', href: 'https://family.bghimire.com', ghost: true }
            ]
        },
        {
            title: 'Novel Tracker Extension',
            description: 'A Manifest V3 browser extension for tracking web novel reading progress across chapter sites, with popup capture, local storage, content-script updates, search/filter library views, and lightweight tests.',
            deployment: 'Project type: browser extension',
            deploymentStatus: 'Local repo; packaged through a custom build script',
            tags: ['JavaScript', 'Chrome Extension', 'Manifest V3', 'Local Storage'],
            links: [
                { label: 'GitHub repo', href: 'https://github.com/biswashghi/novel_tracker' }
            ]
        },
        {
            title: 'Fitness Hub',
            description: 'A mobile-first fitness tracker with a PWA frontend, Node API, and SQLite-backed workout logging, built to run locally and in production with a practical operations story.',
            deployment: 'Deployment: Hetzner via Terraform + Docker + shared Caddy',
            deploymentStatus: 'Configured domain: fit.bghimire.com',
            tags: ['TypeScript', 'PWA', 'Node API', 'SQLite', 'Hetzner'],
            links: [
                { label: 'GitHub repo', href: 'https://github.com/biswashghi/fitness' },
                { label: 'Live site', href: 'https://fit.bghimire.com', ghost: true }
            ]
        },
        {
            title: 'VPS Deploy',
            description: 'A reusable VPS deployment system for turning small apps into real services, covering Terraform provisioning, DNS wiring, Caddy routing, Docker-based app hosting, secret retrieval, and repeatable deploy runbooks.',
            deployment: 'Deployment: Generic Hetzner VPS infrastructure and app operations',
            deploymentStatus: 'Public GitHub repo plus local runbook/workflow',
            tags: ['Terraform', 'Hetzner Cloud', 'Caddy', 'Docker', 'DNS'],
            links: [
                { label: 'GitHub repo', href: 'https://github.com/biswashghi/hetzner_tf/tree/main' }
            ]
        },
        {
            title: 'Personal Site and Blog Publisher',
            description: 'This site doubles as a portfolio and lightweight MDX publishing tool, with GitHub-backed post creation and automated GitHub Pages deployment.',
            deployment: 'Deployment: GitHub Pages',
            deploymentStatus: 'Public repo',
            tags: ['React', 'MDX', 'GitHub Pages', 'Portfolio'],
            links: [
                { label: 'GitHub repo', href: 'https://github.com/biswashghi/biswashghi.github.io' }
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
