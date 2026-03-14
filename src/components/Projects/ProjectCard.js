import React from 'react';

const ProjectCard = ({ title, description, link }) => {
    return (
        <div className="project-card">
            <h3 className="project-title">{title}</h3>
            <p className="project-description">{description}</p>
            <p className="project-actions">
                <a href={link} className="button button--small" target="_blank" rel="noopener noreferrer">
                    View project
                </a>
            </p>
        </div>
    );
};

export default ProjectCard;
