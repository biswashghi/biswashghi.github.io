import React, { useEffect, useMemo, useState } from 'react';
import { ghFetch } from '../blog/publisher';
import ArtUploadPanel from '../components/Admin/ArtUploadPanel';
import GitHubSettingsPanel from '../components/Admin/GitHubSettingsPanel';
import PhotoOfMonthPanel from '../components/Admin/PhotoOfMonthPanel';
import SafetyPanel from '../components/Admin/SafetyPanel';
import useAdminCredentials from '../components/Admin/useAdminCredentials';

const adminTabs = [
  { id: 'settings', label: 'Settings' },
  { id: 'art', label: 'Art' },
  { id: 'photo', label: 'Photo of Month' },
];

const Admin = () => {
  const { repoFull, setRepoFull, token, setToken } = useAdminCredentials();
  const [me, setMe] = useState(null);
  const [tokenError, setTokenError] = useState('');
  const [activeTab, setActiveTab] = useState(adminTabs[0].id);

  const activeLabel = useMemo(
    () => adminTabs.find((tab) => tab.id === activeTab)?.label || 'Settings',
    [activeTab]
  );

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

  return (
    <div className="page">
      <header className="page__header">
        <h1 className="page__title">Admin</h1>
        <p className="page__lede">
          Manage the small publishing tools for the site: GitHub access, art uploads, and monthly photo updates.
        </p>
      </header>

      <div className="admin-tabs" role="tablist" aria-label="Admin sections">
        {adminTabs.map((tab) => (
          <button
            key={tab.id}
            className={`admin-tab${activeTab === tab.id ? ' is-active' : ''}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`admin-panel-${tab.id}`}
            id={`admin-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section
        id={`admin-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`admin-tab-${activeTab}`}
        aria-label={activeLabel}
      >
        {activeTab === 'settings' ? (
          <div className="admin-grid">
            <GitHubSettingsPanel
              repoFull={repoFull}
              setRepoFull={setRepoFull}
              token={token}
              setToken={setToken}
              me={me}
              setMe={setMe}
              tokenError={tokenError}
              setTokenError={setTokenError}
            />
            <SafetyPanel />
          </div>
        ) : null}

        {activeTab === 'art' ? (
          <div className="admin-grid">
            <ArtUploadPanel repoFull={repoFull} token={token} />
          </div>
        ) : null}

        {activeTab === 'photo' ? (
          <div className="admin-grid">
            <PhotoOfMonthPanel repoFull={repoFull} token={token} />
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default Admin;
