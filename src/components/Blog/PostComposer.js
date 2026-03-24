import React, { useEffect, useMemo, useState } from 'react';
import {
  adminStorage,
  isValidSlug,
  slugify,
  todayLocalIsoDate,
  validateMdxBodySafety,
  publishPostToGitHub,
} from '../../blog/publisher';

const PostComposer = ({ onPublished }) => {
  const [repoFull, setRepoFull] = useState(() => adminStorage.getRepo());
  const [token, setToken] = useState(() => adminStorage.getToken());

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [date, setDate] = useState(todayLocalIsoDate());
  const [excerpt, setExcerpt] = useState('');
  const [coverAlt, setCoverAlt] = useState('');
  const [body, setBody] = useState('');

  const [coverFile, setCoverFile] = useState(null);
  const [extraFiles, setExtraFiles] = useState([]);

  const [status, setStatus] = useState({ state: 'idle', message: '' });

  useEffect(() => {
    // If token/repo were updated in /admin in another tab, reflect it here.
    const onStorage = (e) => {
      if (!e || !e.key) return;
      if (e.key === adminStorage.TOKEN_STORAGE_KEY) setToken(adminStorage.getToken());
      if (e.key === adminStorage.REPO_STORAGE_KEY) setRepoFull(adminStorage.getRepo());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!title) return;
    if (slug) return;
    setSlug(slugify(title));
  }, [title, slug]);

  const mdxPath = useMemo(() => (slug ? `src/blog/posts/${slug}.mdx` : 'src/blog/posts/<slug>.mdx'), [slug]);

  const publish = async () => {
    setStatus({ state: 'idle', message: '' });

    if (!token) {
      setStatus({ state: 'error', message: 'Missing GitHub token. Go to /admin and save it first.' });
      return;
    }
    if (!repoFull || !repoFull.includes('/')) {
      setStatus({ state: 'error', message: 'Repo must be in the form owner/repo. Set it in /admin.' });
      return;
    }
    if (!title.trim()) {
      setStatus({ state: 'error', message: 'Title is required.' });
      return;
    }
    if (!slug.trim() || !isValidSlug(slug.trim())) {
      setStatus({ state: 'error', message: 'Slug must be lowercase and use only letters, numbers, and hyphens.' });
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
      setStatus({ state: 'error', message: 'Date must be YYYY-MM-DD.' });
      return;
    }
    if (!excerpt.trim()) {
      setStatus({ state: 'error', message: 'Excerpt is required.' });
      return;
    }
    const safetyError = validateMdxBodySafety(body);
    if (safetyError) {
      setStatus({ state: 'error', message: safetyError });
      return;
    }

    try {
      setStatus({ state: 'working', message: 'Publishing to GitHub...' });
      const result = await publishPostToGitHub({
        token,
        repoFull,
        title,
        slug,
        date,
        excerpt,
        coverAlt,
        body,
        coverFile,
        extraFiles,
      });
      setStatus({
        state: 'ok',
        message: `Published ${result.path}. GitHub Pages will update after the deploy workflow completes.`,
      });
      if (onPublished) onPublished({ slug, ...result });
    } catch (e) {
      setStatus({ state: 'error', message: e.message || 'Publish failed' });
    }
  };

  return (
    <div className="form">
      <div className="field">
        <label className="field__label" htmlFor="pc-title">
          Title
        </label>
        <input
          id="pc-title"
          className="field__input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My post title"
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="pc-slug">
          Slug
        </label>
        <input
          id="pc-slug"
          className="field__input"
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          placeholder="my-post-title"
        />
        <p className="muted admin-help">
          Will publish to <code>{mdxPath}</code>
        </p>
      </div>

      <div className="admin-row">
        <div className="field">
          <label className="field__label" htmlFor="pc-date">
            Date (YYYY-MM-DD)
          </label>
          <input
            id="pc-date"
            className="field__input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="2026-03-15"
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="pc-coverAlt">
            Cover alt text
          </label>
          <input
            id="pc-coverAlt"
            className="field__input"
            value={coverAlt}
            onChange={(e) => setCoverAlt(e.target.value)}
            placeholder="Short description for accessibility"
          />
        </div>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="pc-excerpt">
          Excerpt
        </label>
        <textarea
          id="pc-excerpt"
          className="field__input field__input--textarea"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="1-2 sentence summary shown on the blog index."
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="pc-cover">
          Cover image upload (optional)
        </label>
        <input
          id="pc-cover"
          className="field__input"
          type="file"
          accept="image/*"
          onChange={(e) => setCoverFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
        />
        <p className="muted admin-help">
          Uploads to <code>src/assets/uploads/</code> and uses <code>/assets/uploads/...</code> in frontmatter.
        </p>
        <p className="muted admin-help">
          Tip: images are auto-optimized during <code>npm start</code>/<code>npm run build</code>, but uploading files
          already near web size keeps repo history lighter.
        </p>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="pc-extras">
          Extra uploads (images, small videos)
        </label>
        <input
          id="pc-extras"
          className="field__input"
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => setExtraFiles(e.target.files ? Array.from(e.target.files) : [])}
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="pc-body">
          Body (MDX)
        </label>
        <textarea
          id="pc-body"
          className="field__input field__input--textarea admin-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={`Write Markdown here.\n\nYou can embed components:\n<Figure src=\"/assets/uploads/photo.jpg\" alt=\"...\" caption=\"...\" />\n<Callout title=\"Note\" variant=\"teal\">Text</Callout>\n<video controls src=\"/assets/uploads/video.mp4\" style={{ width: '100%', borderRadius: 16 }} />`}
        />
        <p className="muted admin-help">
          Safety checks block <code>import</code>/<code>export</code> in the body to reduce the chance of breaking the build.
        </p>
        <p className="muted admin-help">
          Repo: <code>{repoFull}</code>
        </p>
      </div>

      <div className="admin-actions">
        <button className="button" type="button" onClick={publish} disabled={status.state === 'working'}>
          {status.state === 'working' ? 'Publishing…' : 'Publish to GitHub'}
        </button>
        {status.message ? (
          <p
            className={
              status.state === 'error' ? 'admin-err' : status.state === 'ok' ? 'admin-ok' : 'muted'
            }
            role="status"
          >
            {status.message}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default PostComposer;
