import { useEffect, useState } from 'react';
import { adminStorage } from '../../blog/publisher';

const useAdminCredentials = () => {
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

  return {
    token,
    setToken,
    repoFull,
    setRepoFull,
    hasToken: Boolean(String(token || '').trim()),
  };
};

export default useAdminCredentials;
