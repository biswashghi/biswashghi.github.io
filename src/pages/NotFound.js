import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="page">
      <header className="page__header">
        <h1 className="page__title">Page not found</h1>
        <p className="page__lede">
          That URL does not exist yet. Head back home and keep exploring.
        </p>
      </header>

      <div className="card">
        <p className="muted">
          If you typed the address manually, double-check the spelling. Otherwise, this page may be under construction.
        </p>
        <p>
          <Link className="button" to="/">
            Go to home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default NotFound;

