import React from 'react';
import assembleResume from '../../data/resume';

const ResumeSection = () => {
    const { profile, summary, experience, projects, skills, education, certifications } = assembleResume();

    return (
        <div className="resume-section">
            <header className="resume-head">
                <h2 className="resume-name">{profile.name}</h2>
                <p className="resume-contact">
                    <a className="resume-link" href={profile.phone.href}>{profile.phone.label}</a>
                    <span className="resume-dot" aria-hidden="true">•</span>
                    <a className="resume-link" href={profile.email.href}>{profile.email.label}</a>
                    <span className="resume-dot" aria-hidden="true">•</span>
                    <a className="resume-link" href={profile.linkedin.href} target="_blank" rel="noopener noreferrer">
                        {profile.linkedin.label}
                    </a>
                    {profile.website ? (
                        <>
                            <span className="resume-dot" aria-hidden="true">•</span>
                            <a className="resume-link" href={profile.website.href} target="_blank" rel="noopener noreferrer">
                                {profile.website.label}
                            </a>
                        </>
                    ) : null}
                </p>
            </header>

            <section className="resume-block">
                <h3 className="resume-h">Personal Summary</h3>
                <p className="resume-p">{summary}</p>
            </section>

            <section className="resume-block">
                <h3 className="resume-h">Experience</h3>
                {experience.map((entry, entryIndex) => (
                    <div className="resume-item" key={entryIndex}>
                        <div className="resume-item__top">
                            <h4 className="resume-item__title">{entry.title}</h4>
                            <p className="resume-item__meta">{entry.meta}</p>
                        </div>
                        {entry.groups
                            ? entry.groups.map((group, groupIndex) => (
                                <React.Fragment key={groupIndex}>
                                    <p className="resume-k">{group.label}</p>
                                    <ul className="resume-list">
                                        {group.bullets.map((bullet, bulletIndex) => (
                                            <li key={bulletIndex}>{bullet}</li>
                                        ))}
                                    </ul>
                                </React.Fragment>
                            ))
                            : (
                                <ul className="resume-list">
                                    {entry.bullets.map((bullet, bulletIndex) => (
                                        <li key={bulletIndex}>{bullet}</li>
                                    ))}
                                </ul>
                            )}
                    </div>
                ))}
            </section>

            {projects.length ? (
                <section className="resume-block">
                    <h3 className="resume-h">Projects</h3>
                    {projects.map((project, projectIndex) => (
                        <div className="resume-item" key={project.id || projectIndex}>
                            <div className="resume-item__top">
                                <h4 className="resume-item__title">{project.title}</h4>
                                <p className="resume-item__meta">{project.meta}</p>
                            </div>
                            <ul className="resume-list">
                                {project.bullets.map((bullet, bulletIndex) => (
                                    <li key={bulletIndex}>{bullet}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
            ) : null}

            <section className="resume-block">
                <h3 className="resume-h">Skills</h3>
                <div className="resume-split">
                    {skills.map((skill, skillIndex) => (
                        <div className="resume-chipset" key={skillIndex}>
                            <p className="resume-k">{skill.label}</p>
                            <p className="resume-v">{skill.value}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="resume-block">
                <h3 className="resume-h">Education</h3>
                {education.map((entry, entryIndex) => (
                    <div className="resume-item" key={entryIndex}>
                        <div className="resume-item__top">
                            <h4 className="resume-item__title">{entry.title}</h4>
                            <p className="resume-item__meta">{entry.meta}</p>
                        </div>
                        {entry.bullets ? (
                            <ul className="resume-list">
                                {entry.bullets.map((bullet, bulletIndex) => (
                                    <li key={bulletIndex}>{bullet}</li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                ))}
            </section>

            <section className="resume-block">
                <h3 className="resume-h">Certifications</h3>
                {certifications.map((entry, entryIndex) => (
                    <div className="resume-item" key={entryIndex}>
                        <div className="resume-item__top">
                            <h4 className="resume-item__title">{entry.title}</h4>
                            <p className="resume-item__meta">{entry.meta}</p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default ResumeSection;
