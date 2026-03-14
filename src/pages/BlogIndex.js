import React from 'react';
import { Link } from 'react-router-dom';

import { posts } from '../blog/posts';
import { formatIsoDate } from '../blog/date';

const formatDate = (iso) => {
  return formatIsoDate(iso, { year: 'numeric', month: 'short', day: '2-digit' });
};

const BlogIndex = () => {
  return (
    <div className="page">
      <header className="page__header">
        <h1 className="page__title">Blog</h1>
        <p className="page__lede">
          Posts built from content blocks so you can mix text, images, lists, and code without fuss.
        </p>
      </header>

      <div className="blog-grid">
        {posts.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card">
            <div className="blog-card__media">
              {post.cover?.src ? (
                <img
                  className="blog-card__img"
                  src={post.cover.src}
                  alt={post.cover.alt || ''}
                  loading="lazy"
                />
              ) : null}
            </div>
            <div className="blog-card__body">
              <p className="blog-card__meta">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </p>
              <h2 className="blog-card__title">{post.title}</h2>
              <p className="blog-card__excerpt">{post.excerpt}</p>
              <p className="blog-card__cta">Read post</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogIndex;
