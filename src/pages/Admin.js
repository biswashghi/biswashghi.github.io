import React, { useEffect, useMemo, useState } from 'react';
import { adminStorage, ghFetch } from '../blog/publisher';

const Admin = () => {
  const [repoFull, setRepoFull] = useState(() => adminStorage.getRepo());
  const [token, setToken] = useState(() => adminStorage.getToken());
  const [me, setMe] = useState(null);
  const [tokenError, setTokenError] = useState('');
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const repoHint = useMemo(() => adminStorage.DEFAULT_REPO, []);

  useEffect(() => {
    if (!token) {
      setMe(null);
      setTokenError('');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setTokenError('');
        const user = await ghFetch('https://api.github.com/user', token);
        if (cancelled) return;
        setMe(user);
      } catch (e) {
        if (cancelled) return;
        setMe(null);
        setTokenError(e.message || 'Token validation failed');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const save = async () => {
    setStatus({ state: 'idle', message: '' });
    adminStorage.setRepo(repoFull.trim());
    adminStorage.setToken(token);

    if (!token) {
      setStatus({ state: 'ok', message: 'Saved repo. Token is empty.' });
      return;
    }

    try {
      // Re-validate so you get immediate feedback after saving.
      const user = await ghFetch('https://api.github.com/user', token);
      setMe(user);
      setStatus({ state: 'ok', message: 'Saved. Token validated successfully.' });
    } catch (e) {
      setMe(null);
      setStatus({ state: 'error', message: e.message || 'Token validation failed' });
    }
  };

  const clear = () => {
    adminStorage.clearToken();
    setToken('');
    setMe(null);
    setTokenError('');
    setStatus({ state: 'ok', message: 'Token cleared.' });
  };

  const checkRepoAccess = async () => {
    setStatus({ state: 'idle', message: '' });
    const repoTrimmed = repoFull.trim();
    const tokenTrimmed = token.trim();
    if (!repoTrimmed.includes('/')) {
      setStatus({ state: 'error', message: 'Repo must be in the form owner/repo.' });
      return;
    }
    if (!tokenTrimmed) {
      setStatus({ state: 'error', message: 'Missing token.' });
      return;
    }
    try {
      const data = await ghFetch(`https://api.github.com/repos/${repoTrimmed}`, tokenTrimmed);
      setStatus({ state: 'ok', message: `Repo access OK: ${data.full_name}` });
    } catch (e) {
      setStatus({ state: 'error', message: e.message || 'Repo access failed.' });
    }
  };

  const checkPublishAccess = async () => {
    setStatus({ state: 'idle', message: '' });
    const repoTrimmed = repoFull.trim();
    const tokenTrimmed = token.trim();
    if (!repoTrimmed.includes('/')) {
      setStatus({ state: 'error', message: 'Repo must be in the form owner/repo.' });
      return;
    }
    if (!tokenTrimmed) {
      setStatus({ state: 'error', message: 'Missing token.' });
      return;
    }

    try {
      setStatus({ state: 'working', message: 'Checking publish permissions...' });

      // 1) Repo access (also catches most bad tokens as 404/403).
      const repoInfo = await ghFetch(`https://api.github.com/repos/${repoTrimmed}`, tokenTrimmed);
      const branch = repoInfo.default_branch || 'main';

      // 2) Can read branch ref (needed for publishing).
      await ghFetch(`https://api.github.com/repos/${repoTrimmed}/git/ref/heads/${branch}`, tokenTrimmed);

      // 3) Can create a blob (needed for current publisher implementation).
      // This creates an unreachable object unless later referenced by a tree/commit.
      await ghFetch(`https://api.github.com/repos/${repoTrimmed}/git/blobs`, tokenTrimmed, {
        method: 'POST',
        body: JSON.stringify({ content: `publish-check:${Date.now()}`, encoding: 'utf-8' }),
      });

      setStatus({
        state: 'ok',
        message: `Publish check passed for ${repoInfo.full_name} (branch: ${branch}). You should be able to publish posts.`,
      });
    } catch (e) {
      setStatus({
        state: 'error',
        message:
          e.message ||
          'Publish check failed. Ensure the token has repo Contents read/write for this repository.',
      });
    }
  };

  return (
    <div className="page">
      <header className="page__header">
        <h1 className="page__title">Admin</h1>
        <p className="page__lede">
          Set your GitHub repo and Personal Access Token (PAT). Once saved, go to <code>/blog</code> and use
          the <strong>Create post</strong> button.
        </p>
      </header>

      <div className="admin-grid">
        <div className="card">
          <h2 className="section-title">GitHub Settings</h2>
          <div className="form">
            <div className="field">
              <label className="field__label" htmlFor="repo">
                Repo
              </label>
              <input
                id="repo"
                className="field__input"
                value={repoFull}
                onChange={(e) => setRepoFull(e.target.value)}
                placeholder="owner/repo"
              />
              <p className="muted admin-help">
                Default: <code>{repoHint}</code>
              </p>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="pat">
                Personal Access Token (fine-grained)
              </label>
              <input
                id="pat"
                className="field__input"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="github_pat_..."
                autoComplete="off"
                spellCheck="false"
              />
              <p className="muted admin-help">
                Required permissions: repository <code>Contents</code> = Read and write. Stored in this browser via localStorage.
              </p>
              {me ? <p className="admin-ok">Signed in as <strong>{me.login}</strong>.</p> : null}
              {tokenError ? <p className="admin-err">Token error: {tokenError}</p> : null}
            </div>

            <div className="admin-actions">
              <button className="button" type="button" onClick={save}>
                Save
              </button>
              <button className="button button--ghost" type="button" onClick={checkRepoAccess}>
                Check read access
              </button>
              <button className="button button--ghost" type="button" onClick={checkPublishAccess}>
                Check publish access
              </button>
              <button className="button button--small button--ghost" type="button" onClick={clear}>
                Clear token
              </button>
            </div>

            {status.message ? (
              <p
                className={
                  status.state === 'error'
                    ? 'admin-err'
                    : status.state === 'ok'
                      ? 'admin-ok'
                      : 'muted'
                }
                role="status"
              >
                {status.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Safety</h2>
          <p className="muted">
            Posts are built and deployed by GitHub Actions. The post composer on <code>/blog</code> blocks risky MDX like
            <code> import</code>/<code>export</code> in the body to reduce accidental build breaks.
          </p>
          <p className="muted">
            Tip: keep uploads small. Large images/videos will slow down your site and can hit GitHub API limits.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
