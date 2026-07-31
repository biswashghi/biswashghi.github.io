import React from 'react';
import { Link } from 'react-router-dom';
import { posts } from '../blog/posts';
import { formatIsoDate } from '../blog/date';

const recentPosts = posts.slice(0, 2);

const Home = () => {
    return (
        <div className="page page--home">
            <section className="field-hero" aria-label="Intro">
                <div className="field-hero__copy">
                    <p className="kicker">Personal operating log</p>
                    <h1 className="field-hero__title">Systems, trips, questions, and things I&apos;m building.</h1>
                    <p className="field-hero__lede">
                        I build backend platforms, small tools, and personal publishing workflows. This site is less a
                        portfolio now and more a running record of what I&apos;m building, writing, and trying to
                        understand.
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
                            <img
                                src="/assets/images/traverse-city-summer/lake-golden-hour.jpeg"
                                alt="Golden hour over Lake Michigan"
                                width="1400"
                                height="1050"
                                decoding="async"
                            />
                        </figure>
                        <figure className="photo photo--small">
                            <img
                                src="/assets/images/cruise-bahamas/umbrella.jpeg"
                                alt="Umbrella lane in Nassau"
                                width="1200"
                                height="1600"
                                loading="lazy"
                                decoding="async"
                            />
                        </figure>
                        <figure className="photo photo--strip">
                            <img
                                src="/assets/images/traverse-city-summer/vineyard.jpeg"
                                alt="Vineyard near Traverse City"
                                width="1200"
                                height="1600"
                                loading="lazy"
                                decoding="async"
                            />
                        </figure>
                    </div>
                    <div className="log-card">
                        <p className="log-card__label">Latest note</p>
                        <p className="log-card__text">
                            Traverse City and the feeling that Michigan has become a little too comfortable.
                        </p>
                    </div>
                </aside>
            </section>

            <section className="journal" aria-label="Recent entries">
                <aside className="journal__aside">
                    <div>
                        <p className="kicker">Current thread</p>
                        <h2>Comfort is becoming the question.</h2>
                    </div>
                    <p>
                        A lot of the recent writing keeps coming back to the same question: family trips, Michigan
                        summers, systems work, and the feeling that stability can become too easy.
                    </p>
                </aside>
                <div className="entries">
                    {recentPosts.map((post) => (
                        <Link className="entry" to={`/blog/${post.slug}`} key={post.slug}>
                            <time>{formatIsoDate(post.date, { month: 'short', year: 'numeric' })}</time>
                            <div>
                                <h3>{post.title}</h3>
                                <p>{post.excerpt}</p>
                            </div>
                        </Link>
                    ))}
                    <Link className="entry" to="/projects">
                        <time>Ops</time>
                        <div>
                            <h3>VPS Deploy</h3>
                            <p>A reusable setup for getting small apps onto a VPS with Caddy, DNS, Docker, and repeatable deploy steps.</p>
                        </div>
                    </Link>
                    <Link className="entry" to="/art">
                        <time>Art</time>
                        <div>
                            <h3>Architecture Drawings</h3>
                            <p>Drawings and sketches from a time when I loved to doodle.</p>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
