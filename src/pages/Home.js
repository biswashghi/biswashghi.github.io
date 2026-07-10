import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="page">
            <header className="hero">
                <p className="hero__eyebrow">Personal site</p>
                <h1 className="hero__title">A running look at the systems I build, the work I care about, and what I am learning along the way.</h1>
                <p className="hero__lede">
                    I'm Biswash, a software engineer focused on reliable backend systems, event-driven architecture, and making complicated things feel calm.
                </p>
                <div className="hero__actions">
                    <Link className="button" to="/projects">See projects</Link>
                    <a className="button button--ghost" href="/assets/resume.pdf" target="_blank" rel="noopener noreferrer">Download resume</a>
                </div>
            </header>

            <section className="grid">
                <Link className="tile" to="/resume">
                    <h2 className="tile__title">Resume</h2>
                    <p className="tile__text">A broader career snapshot, plus a downloadable PDF for applications.</p>
                    <span className="tile__meta">View resume</span>
                </Link>
                <Link className="tile" to="/projects">
                    <h2 className="tile__title">Projects</h2>
                    <p className="tile__text">Selected systems, experiments, and side projects worth showing off.</p>
                    <span className="tile__meta">Browse projects</span>
                </Link>
                <Link className="tile" to="/blog">
                    <h2 className="tile__title">Blog</h2>
                    <p className="tile__text">Field notes, travel posts, and the occasional curiosity-driven detour.</p>
                    <span className="tile__meta">Read posts</span>
                </Link>
                <Link className="tile tile--accent" to="/contact">
                    <h2 className="tile__title">Contact</h2>
                    <p className="tile__text">Say hi, ask a question, or propose a collab.</p>
                    <span className="tile__meta">Send a message</span>
                </Link>
            </section>

            <section className="grid grid--spotlight" aria-label="Current focus">
                <div className="card card--feature">
                    <p className="eyebrow">Currently</p>
                    <h2 className="section-title section-title--lg">Building a GitHub-backed writing workflow for this site</h2>
                    <p className="muted">
                        The site doubles as a small publishing tool: posts can be drafted in the browser, committed to GitHub,
                        and deployed automatically through Pages.
                    </p>
                    <p className="card__meta">Focus areas: reliability, writing tools, and keeping personal publishing low-friction.</p>
                </div>

                <div className="card">
                    <p className="eyebrow">Featured project</p>
                    <h2 className="section-title">Personal site and blog publisher</h2>
                    <p className="muted">
                        A React site that works as both a public portfolio and a lightweight control panel for publishing MDX posts.
                    </p>
                    <p className="page__actions">
                        <a className="button button--small" href="https://github.com/biswashghi/biswashghi.github.io" target="_blank" rel="noopener noreferrer">
                            View source
                        </a>
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;
