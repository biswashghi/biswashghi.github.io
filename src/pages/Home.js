import React from 'react';
import { Link } from 'react-router-dom';
import { posts } from '../blog/posts';
import { formatIsoDate } from '../blog/date';
import photosOfMonth from '../data/photosOfMonth.json';
import useDocumentTitle from '../hooks/useDocumentTitle';

// Everything on this page except the hero copy is derived: the newest
// published post and the newest Photo-of-the-Month pair. Add a post or a
// month of photos and the front page updates on its own.
const latestPost = posts[0];
const latestMonth = photosOfMonth[0]?.month;
const latestPhotos = photosOfMonth.filter((photo) => photo.month === latestMonth).slice(0, 2);

const Home = () => {
    useDocumentTitle();
    return (
        <div className="page page--home">
            <section className="field-hero" aria-label="Intro">
                <div className="field-hero__copy">
                    <p className="kicker">Field notes</p>
                    <h1 className="field-hero__title">I build backend systems. This is everything else.</h1>
                    <p className="field-hero__lede">
                        Lead engineer on a loyalty platform at Capital One, working from Michigan. On the side I build
                        small tools and write down the trips, the food, and whatever I&apos;m trying to figure out.
                    </p>
                    <div className="field-hero__actions">
                        <Link className="button" to="/blog">Read the blog</Link>
                        <Link className="button button--ghost" to="/projects">Projects</Link>
                        <a className="button button--ghost" href="/assets/resume.pdf" target="_blank" rel="noopener noreferrer">
                            Resume
                        </a>
                    </div>
                </div>

                <aside className="photo-log" aria-label="Latest">
                    <div className="photo-stack">
                        {latestPost?.cover?.src ? (
                            <figure className="photo photo--large">
                                <img
                                    src={latestPost.cover.src}
                                    alt={latestPost.cover.alt || ''}
                                    width="1400"
                                    height="1050"
                                    decoding="async"
                                />
                            </figure>
                        ) : null}
                        {latestPhotos[0] ? (
                            <figure className="photo photo--small">
                                <img
                                    src={latestPhotos[0].src}
                                    alt={latestPhotos[0].caption || ''}
                                    width="1200"
                                    height="1600"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </figure>
                        ) : null}
                        {latestPhotos[1] ? (
                            <figure className="photo photo--strip">
                                <img
                                    src={latestPhotos[1].src}
                                    alt={latestPhotos[1].caption || ''}
                                    width="1200"
                                    height="1600"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </figure>
                        ) : null}
                    </div>
                    {latestPost ? (
                        <Link className="log-card" to={`/blog/${latestPost.slug}`}>
                            <p className="log-card__label">
                                Latest post · {formatIsoDate(latestPost.date, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <p className="log-card__text">{latestPost.title}</p>
                        </Link>
                    ) : null}
                </aside>
            </section>
        </div>
    );
};

export default Home;
