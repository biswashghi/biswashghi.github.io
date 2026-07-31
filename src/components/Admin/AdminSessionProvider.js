import React, { createContext, useContext, useMemo, useState } from 'react';
import { adminStorage } from '../../blog/publisher';

const AdminSessionContext = createContext(null);

export const AdminSessionProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => adminStorage.getToken());
  const [repoFull, setRepoFullState] = useState(() => adminStorage.getRepo());

  const value = useMemo(
    () => ({
      token,
      repoFull,
      hasToken: Boolean(String(token).trim()),
      setToken: (nextToken) => {
        const normalized = String(nextToken || '');
        adminStorage.setToken(normalized);
        setTokenState(normalized);
      },
      clearToken: () => {
        adminStorage.clearToken();
        setTokenState('');
      },
      setRepoFull: (nextRepo) => {
        const normalized = String(nextRepo || '');
        adminStorage.setRepo(normalized);
        setRepoFullState(normalized);
      },
    }),
    [repoFull, token]
  );

  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
};

export const useAdminSession = () => {
  const session = useContext(AdminSessionContext);
  if (!session) throw new Error('useAdminSession must be used inside AdminSessionProvider.');
  return session;
};

export default AdminSessionProvider;
