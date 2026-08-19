import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Navigate, NavLink, Outlet, createBrowserRouter } from 'react-router-dom';
import AdminSessionProvider from './components/Admin/AdminSessionProvider';

const navClassName = ({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`;
const loadRoute = (loader) => async () => {
  const { default: Component } = await loader();
  return { Component };
};

const AppShell = () => {
  const navRef = useRef(null);
  const [navOverflowing, setNavOverflowing] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;

    const updateOverflow = () => {
      const hasMore = nav.scrollWidth - nav.clientWidth - nav.scrollLeft > 4;
      setNavOverflowing(hasMore);
    };

    updateOverflow();
    nav.addEventListener('scroll', updateOverflow, { passive: true });
    window.addEventListener('resize', updateOverflow);
    return () => {
      nav.removeEventListener('scroll', updateOverflow);
      window.removeEventListener('resize', updateOverflow);
    };
  }, []);

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="bg" aria-hidden="true" />

      <header className="topbar">
        <div className="topbar__inner">
          <NavLink to="/" end className="brand" aria-label="Go to home">
            <span className="brand__mark" aria-hidden="true">
              B
            </span>
            <span className="brand__text">
              <span className="brand__name">Biswash Ghimire</span>
              <span className="brand__role">backend systems / writing / field notes</span>
            </span>
          </NavLink>

          <nav
            className={`nav${navOverflowing ? ' nav--overflowing' : ''}`}
            aria-label="Primary"
            ref={navRef}
          >
            <NavLink to="/" end className={navClassName}>
              Home
            </NavLink>
            <NavLink to="/resume" className={navClassName}>
              Resume
            </NavLink>
            <NavLink to="/projects" className={navClassName}>
              Projects
            </NavLink>
            <NavLink to="/blog" className={navClassName}>
              Blog
            </NavLink>
            <NavLink to="/art" className={navClassName}>
              Art
            </NavLink>
            <NavLink to="/photos" className={navClassName}>
              Photo
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `${navClassName({ isActive })} nav__link--cta`}>
              Contact
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="main" className="main" role="main">
        <Suspense fallback={<div className="route-loading" aria-live="polite">Loading...</div>}>
          <Outlet />
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

export const router = createBrowserRouter([
  {
    path: '/',
    Component: () => (
      <AdminSessionProvider>
        <AppShell />
      </AdminSessionProvider>
    ),
    children: [
      { index: true, lazy: loadRoute(() => import('./pages/Home')) },
      { path: 'resume', lazy: loadRoute(() => import('./pages/Resume')) },
      { path: 'blog', lazy: loadRoute(() => import('./pages/BlogIndex')) },
      { path: 'blog/new', lazy: loadRoute(() => import('./pages/BlogEditor')) },
      { path: 'blog/:slug', lazy: loadRoute(() => import('./pages/BlogPostPage')) },
      { path: 'projects', lazy: loadRoute(() => import('./pages/Projects')) },
      { path: 'art', lazy: loadRoute(() => import('./pages/Art')) },
      { path: 'photos', lazy: loadRoute(() => import('./pages/PhotoOfMonth')) },
      { path: 'photo-of-the-month', element: <Navigate to="/photos" replace /> },
      { path: 'contact', lazy: loadRoute(() => import('./pages/Contact')) },
      { path: 'admin', lazy: loadRoute(() => import('./pages/Admin')) },
      { path: '*', lazy: loadRoute(() => import('./pages/NotFound')) },
    ],
  },
]);

export default AppShell;
