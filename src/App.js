import React, { Suspense } from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';

import Home from './pages/Home';

const Resume = React.lazy(() => import('./pages/Resume'));
const BlogEditor = React.lazy(() => import('./pages/BlogEditor'));
const BlogIndex = React.lazy(() => import('./pages/BlogIndex'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const Projects = React.lazy(() => import('./pages/Projects'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Admin = React.lazy(() => import('./pages/Admin'));
const Art = React.lazy(() => import('./pages/Art'));
const PhotoOfMonth = React.lazy(() => import('./pages/PhotoOfMonth'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const App = () => {
  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="bg" aria-hidden="true" />

      <header className="topbar">
        <div className="topbar__inner">
          <NavLink to="/" exact className="brand" aria-label="Go to home">
            <span className="brand__mark" aria-hidden="true">
              B
            </span>
            <span className="brand__text">
              <span className="brand__name">Biswash Ghimire</span>
              <span className="brand__role">backend systems / writing / field notes</span>
            </span>
          </NavLink>

          <nav className="nav" aria-label="Primary">
            <NavLink to="/" exact activeClassName="is-active" className="nav__link">
              Home
            </NavLink>
            <NavLink to="/resume" activeClassName="is-active" className="nav__link">
              Resume
            </NavLink>
            <NavLink to="/projects" activeClassName="is-active" className="nav__link">
              Projects
            </NavLink>
            <NavLink to="/blog" activeClassName="is-active" className="nav__link">
              Blog
            </NavLink>
            <NavLink to="/art" activeClassName="is-active" className="nav__link">
              Art
            </NavLink>
            <NavLink to="/photo-of-the-month" activeClassName="is-active" className="nav__link">
              Photo
            </NavLink>
            <NavLink to="/contact" activeClassName="is-active" className="nav__link nav__link--cta">
              Contact
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="main" className="main" role="main">
        <Suspense fallback={<div className="route-loading" aria-live="polite">Loading...</div>}>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/resume" component={Resume} />
            <Route path="/blog" exact component={BlogIndex} />
            <Route path="/blog/new" component={BlogEditor} />
            <Route path="/blog/:slug" component={BlogPostPage} />
            <Route path="/projects" component={Projects} />
            <Route path="/art" component={Art} />
            <Route path="/photo-of-the-month" component={PhotoOfMonth} />
            <Route path="/contact" component={Contact} />
            <Route path="/admin" component={Admin} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <p className="footer__text">Built with Codex.</p>
          <div className="footer__links" aria-label="Secondary">
            <a className="footer__link" href="/assets/resume.pdf" target="_blank" rel="noopener noreferrer">
              Latest resume
            </a>
            <NavLink to="/admin" className="footer__link">
              Admin
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
