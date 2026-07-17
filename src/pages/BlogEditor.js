import React from 'react';
import { Link } from 'react-router-dom';
import PostComposer from '../components/Blog/PostComposer';
import useAdminCredentials from '../components/Admin/useAdminCredentials';

const BlogEditor = () => {
  const { hasToken } = useAdminCredentials();

  return (
    <div className="page">
      <header className="page__header">
        <div className="page__row">
          <div>
            <p className="kicker">Writing desk</p>
            <h1 className="page__title">New Blog Post</h1>
          </div>
          <div className="page__actions">
            <Link className="button button--ghost" to="/blog">
              Back to blog
            </Link>
          </div>
        </div>
        <p className="page__lede">
          Draft the post, attach images, and publish directly to GitHub when it is ready. The site will rebuild after the
          commit lands.
        </p>
      </header>

      {hasToken ? (
        <section className="blog-editor" aria-label="Blog post editor">
          <PostComposer />
        </section>
      ) : (
        <section className="photo-month-empty" aria-label="Publishing unavailable">
          <p className="kicker">Publishing unavailable</p>
          <h2>Save your publishing token in this browser before writing from the site.</h2>
        </section>
      )}
    </div>
  );
};

export default BlogEditor;
