import React from 'react';
import ProjectCard from '../components/Projects/ProjectCard';
import { featuredProjects, projectSections } from '../data/projects';

const Projects = () => {
    return (
        <div className="page">
            <header className="page__header">
                <h1 className="page__title">Projects</h1>
                <p className="page__lede">A shorter view of the projects I care about most: two larger systems in detail, then quick notes on the rest.</p>
            </header>

            <section className="project-section" aria-labelledby="projects-featured">
                <div className="project-section__head">
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
