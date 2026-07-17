import React, { useMemo, useState } from 'react';
import { adminStorage, ghFetch } from '../../blog/publisher';
import AdminStatus from './AdminStatus';
import { idleStatus } from './adminUtils';

const GitHubSettingsPanel = ({
  repoFull,
  setRepoFull,
  token,
  setToken,
  me,
  setMe,
  tokenError,
  setTokenError,
}) => {
  const [status, setStatus] = useState(idleStatus);
  const repoHint = useMemo(() => adminStorage.DEFAULT_REPO, []);

  const save = async () => {
    setStatus(idleStatus);
    adminStorage.setRepo(repoFull.trim());
    adminStorage.setToken(token);

    if (!token) {
      setStatus({ state: 'ok', message: 'Saved repo. Token is empty.' });
      return;
    }

    try {
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
    setStatus(idleStatus);
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
    setStatus(idleStatus);
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
      const repoInfo = await ghFetch(`https://api.github.com/repos/${repoTrimmed}`, tokenTrimmed);
      const branch = repoInfo.default_branch || 'main';
      await ghFetch(`https://api.github.com/repos/${repoTrimmed}/git/ref/heads/${branch}`, tokenTrimmed);
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
            Required permissions: repository <code>Contents</code> = Read and write. Stored in this browser via
            localStorage.
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

        <AdminStatus status={status} />
      </div>
    </div>
  );
};

export default GitHubSettingsPanel;
