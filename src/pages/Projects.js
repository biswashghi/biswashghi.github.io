import React from 'react';
import ProjectCard from '../components/Projects/ProjectCard';

const Projects = () => {
    const projectList = [
        {
            title: 'Project One',
            description: 'Description of project one.',
            link: 'https://link-to-project-one.com'
        },
        {
            title: 'Project Two',
            description: 'Description of project two.',
            link: 'https://link-to-project-two.com'
        },
        {
            title: 'Project Three',
            description: 'Description of project three.',
            link: 'https://link-to-project-three.com'
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
