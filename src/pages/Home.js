import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="page">
            <header className="hero">
                <p className="hero__eyebrow">Personal site</p>
                <h1 className="hero__title">A small corner of the internet for my work and thoughts.</h1>
                <p className="hero__lede">
                    I'm Biswash. I build things, write about what I learn, and share notes on craft and curiosity.
                </p>
                <div className="hero__actions">
                    <Link className="button" to="/projects">See projects</Link>
                    <Link className="button button--ghost" to="/contact">Get in touch</Link>
                </div>
            </header>

            <section className="grid">
                <Link className="tile" to="/resume">
                    <h2 className="tile__title">Resume</h2>
                    <p className="tile__text">Roles, skills, and a few highlights.</p>
                    <span className="tile__meta">View resume</span>
                </Link>
                <Link className="tile" to="/projects">
                    <h2 className="tile__title">Projects</h2>
                    <p className="tile__text">Things I have built, shipped, and learned from.</p>
                    <span className="tile__meta">Browse projects</span>
                </Link>
                <Link className="tile" to="/blog">
                    <h2 className="tile__title">Blog</h2>
                    <p className="tile__text">Notes on engineering, craft, and curiosity.</p>
                    <span className="tile__meta">Read posts</span>
                </Link>
                <Link className="tile tile--accent" to="/contact">
                    <h2 className="tile__title">Contact</h2>
                    <p className="tile__text">Say hi, ask a question, or propose a collab.</p>
                    <span className="tile__meta">Send a message</span>
                </Link>
            </section>
        </div>
    );
};

export default Home;
