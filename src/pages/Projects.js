import React from 'react';
import ProjectCard from '../components/Projects/ProjectCard';

const Projects = () => {
    const projectList = [
        {
            title: 'When I get up to something to post I\'ll put it here',
            description: 'Empty for now.',
            link: 'https://link-to-nowhere.com'
        }
    ];

    return (
        <div className="page">
            <header className="page__header">
                <h1 className="page__title">Projects</h1>
                <p className="page__lede">A few things I have built. Swap these for real links as you go.</p>
            </header>

            <div className="grid grid--cards">
                {projectList.map((project, index) => (
                    <div key={index} className="card">
                        <ProjectCard
                            title={project.title}
                            description={project.description}
                            link={project.link}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;
