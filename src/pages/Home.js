import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="page page--home">
            <section className="field-hero" aria-label="Intro">
                <div className="field-hero__copy">
                    <p className="kicker">Personal operating log</p>
                    <h1 className="field-hero__title">Systems, trips, questions, and proof of work.</h1>
                    <p className="field-hero__lede">
                        I build backend platforms, small tools, and personal publishing workflows. This site is becoming
                        less of a portfolio page and more of a working field log: what shipped, what I learned, and what
                        I am still trying to understand.
                    </p>
                    <div className="field-hero__actions">
                        <Link className="button" to="/blog">Read the log</Link>
                        <Link className="button button--ghost" to="/projects">View projects</Link>
                        <a className="button button--ghost" href="/assets/resume.pdf" target="_blank" rel="noopener noreferrer">
                            Resume
                        </a>
                    </div>
                </div>

                <aside className="photo-log" aria-label="Recent notes">
                    <div className="photo-stack">
                        <figure className="photo photo--large">
                            <img src="/assets/images/traverse-city-summer/lake-golden-hour.jpeg" alt="Golden hour over Lake Michigan" />
                        </figure>
                        <figure className="photo photo--small">
                            <img src="/assets/images/cruise-bahamas/umbrella.jpeg" alt="Umbrella lane in Nassau" />
                        </figure>
                        <figure className="photo photo--strip">
                            <img src="/assets/images/traverse-city-summer/vineyard.jpeg" alt="Vineyard near Traverse City" />
                        </figure>
                    </div>
                    <div className="log-card">
                        <p className="log-card__label">Latest note</p>
                        <p className="log-card__text">
                            Traverse City, the ease of Michigan summers, and why comfort can become its own kind of pressure.
                        </p>
                    </div>
                </aside>
            </section>

            <section className="signal-strip" aria-label="Working areas">
                <span className="signal-strip__label">Working areas</span>
                <p>backend systems / Hetzner deployments / MDX publishing / drawing archive / family travel notes</p>
            </section>

            <section className="journal" aria-label="Recent entries">
                <aside className="journal__aside">
                    <div>
                        <p className="kicker">Current thread</p>
                        <h2>Comfort is becoming the question.</h2>
                    </div>
                    <p>
                        The recent writing has been circling the same thing from different angles: family trips, Michigan
                        summers, systems work, and the uneasy feeling that stability can become too easy.
                    </p>
                </aside>
                <div className="entries">
                    <Link className="entry" to="/blog/traverse-city-summer">
                        <time>Jul 2026</time>
                        <div>
                            <h3>Traverse City Summer</h3>
                            <p>Northern Michigan, wineries, dunes, and the uncomfortable pull toward a harder next chapter.</p>
                        </div>
                    </Link>
                    <Link className="entry" to="/blog/first-cruise-bahamas">
                        <time>Mar 2026</time>
                        <div>
                            <h3>A Different Kind of Family Vacation</h3>
                            <p>A first cruise, small family rhythms, Nassau walks, and what relaxation looks like for four people.</p>
                        </div>
                    </Link>
                    <Link className="entry" to="/projects">
                        <time>Ops</time>
                        <div>
                            <h3>Hetzner Terraform Infra</h3>
                            <p>A deployment runbook that turns side projects into real services with Caddy, DNS, and repeatable scripts.</p>
                        </div>
                    </Link>
                    <Link className="entry" to="/art">
                        <time>Art</time>
                        <div>
                            <h3>Architecture Drawings</h3>
                            <p>A small drawing archive from college architecture work, pulled out into its own top-level space.</p>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
