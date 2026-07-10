import React from 'react';

const ProjectCard = ({
    title,
    description,
    deployment,
    deploymentStatus,
    tags = [],
    links = []
}) => {
    return (
        <div className="project-card">
            <h3 className="project-title">{title}</h3>
            <p className="project-description">{description}</p>
            {deployment ? <p className="project-deployment">{deployment}</p> : null}
            {deploymentStatus ? <p className="project-status">{deploymentStatus}</p> : null}
            {tags.length ? (
                <div className="project-tags" aria-label="Project tags">
                    {tags.map((tag) => (
                        <span key={tag} className="project-tag">{tag}</span>
                    ))}
                </div>
            ) : null}
            {links.length ? (
                <div className="project-actions">
                    {links.map((item) => (
                        <a
                            key={`${title}-${item.href}-${item.label}`}
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
        </div>
    );
};

export default ProjectCard;
