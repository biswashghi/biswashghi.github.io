import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { posts } from '../blog/posts';
import { formatIsoDate } from '../blog/date';
import Modal from '../components/Modal';
import PostComposer from '../components/Blog/PostComposer';
import { adminStorage, deletePostFromGitHub } from '../blog/publisher';

const formatDate = (iso) => {
  return formatIsoDate(iso, { year: 'numeric', month: 'short', day: '2-digit' });
};

const BlogIndex = () => {
  const [composerOpen, setComposerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSlug, setDeleteSlug] = useState('');
  const [hiddenSlugs, setHiddenSlugs] = useState([]);
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const [token, setToken] = useState(() => adminStorage.getToken());
  const [repoFull, setRepoFull] = useState(() => adminStorage.getRepo());

  useEffect(() => {
    const onStorage = (e) => {
      if (!e || !e.key) return;
      if (e.key === adminStorage.TOKEN_STORAGE_KEY) setToken(adminStorage.getToken());
      if (e.key === adminStorage.REPO_STORAGE_KEY) setRepoFull(adminStorage.getRepo());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const hasToken = Boolean(String(token || '').trim());

  const visiblePosts = useMemo(
    () => posts.filter((post) => post && !hiddenSlugs.includes(post.slug)),
    [hiddenSlugs]
  );

  const openDelete = (slug) => {
    setDeleteSlug(slug);
    setDeleteOpen(true);
    setStatus({ state: 'idle', message: '' });
  };

  const confirmDelete = async () => {
    const slug = String(deleteSlug || '').trim();
    if (!slug) return;
    try {
      setStatus({ state: 'working', message: `Deleting ${slug}...` });
      if (!hasToken) {
        setStatus({ state: 'error', message: 'Missing token. Set it up in Admin.' });
        return;
      }
      await deletePostFromGitHub({ token, repoFull, slug });
      setHiddenSlugs((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
      setStatus({
        state: 'ok',
        message: `Deleted ${slug}.mdx from GitHub. The site will update after the deploy workflow completes.`,
      });
      window.setTimeout(() => setDeleteOpen(false), 800);
    } catch (e) {
      setStatus({ state: 'error', message: e.message || 'Delete failed' });
    }
  };

  return (
    <div className="page">
      <header className="page__header">
        <div className="page__row">
          <div>
            <h1 className="page__title">Blog</h1>
          </div>
          <div className="page__actions">
            {hasToken ? (
              <button className="button" type="button" onClick={() => setComposerOpen(true)}>
                Create post
              </button>
            ) : (
              <Link className="button button--ghost" to="/admin">
                Set up PAT to publish
              </Link>
            )}
          </div>
        </div>
        <p className="page__lede">
          {hasToken
            ? 'Publishing writes a commit to main and triggers auto-deploy.'
            : 'To create posts from the UI, add your GitHub PAT in the Admin page.'}
        </p>
      </header>

      <div className="blog-grid">
        {visiblePosts.map((post) => (
          <div key={post.slug} className="blog-card">
            <Link to={`/blog/${post.slug}`} className="blog-card__link" aria-label={`Read: ${post.title}`}>
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

            {hasToken ? (
              <div className="blog-card__actions">
                <button
                  className="button button--small button--ghost"
                  type="button"
                  onClick={() => openDelete(post.slug)}
                >
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <Modal open={composerOpen} title="Create Blog Post" onClose={() => setComposerOpen(false)}>
        <PostComposer onPublished={() => {}} />
      </Modal>

      <Modal open={deleteOpen} title="Delete Blog Post" onClose={() => setDeleteOpen(false)}>
        <p className="muted">
          This deletes <code>src/blog/posts/{deleteSlug}.mdx</code> from <code>{repoFull}</code> and triggers a redeploy.
          Uploaded images are not automatically removed.
        </p>
        <div className="admin-actions">
          <button className="button" type="button" onClick={confirmDelete} disabled={status.state === 'working'}>
            {status.state === 'working' ? 'Deleting…' : 'Confirm delete'}
          </button>
          <button className="button button--ghost" type="button" onClick={() => setDeleteOpen(false)}>
            Cancel
          </button>
        </div>
        {status.message ? (
          <p className={status.state === 'error' ? 'admin-err' : status.state === 'ok' ? 'admin-ok' : 'muted'} role="status">
            {status.message}
          </p>
        ) : null}
      </Modal>
    </div>
  );
};

export default BlogIndex;
