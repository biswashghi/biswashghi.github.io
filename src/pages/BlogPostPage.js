import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';

import { mdxComponents } from '../components/Blog/mdxComponents';
import { getPostBySlug } from '../blog/posts';

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  } catch {
    return iso;
  }
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="page">
        <header className="page__header">
          <h1 className="page__title">Post not found</h1>
          <p className="page__lede">That blog post does not exist.</p>
        </header>
        <div className="card">
          <Link className="button button--ghost" to="/blog">
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="post">
      <header className="post__head">
        <p className="post__kicker">
          <Link to="/blog" className="post__back">
            Blog
          </Link>
          <span className="post__sep" aria-hidden="true">
            /
          </span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        <h1 className="post__title">{post.title}</h1>
        {post.excerpt ? <p className="post__lede">{post.excerpt}</p> : null}
      </header>

      {/* {post.cover?.src ? (
        <div className="post__cover">
          <img className="post__coverimg" src={post.cover.src} alt={post.cover.alt || ''} />
        </div>
      ) : null}
 */}
      <div className="post__body card">
        <MDXProvider components={mdxComponents}>
          <post.Component components={mdxComponents} />
        </MDXProvider>
      </div>
    </article>
  );
};

export default BlogPostPage;
