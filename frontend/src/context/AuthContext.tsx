import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Workspace } from '../types';
import { apiLogin, apiGetMe, apiGetWorkspaces } from '../api/client';

interface AuthContextType {
  user: User | null;
  workspace: Workspace | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setWorkspace: (ws: Workspace) => void;
  workspaces: Workspace[];
  quickLogin: (role: 'REVIEWER' | 'ADMIN' | 'CREATOR') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [workspace, setWorkspaceState] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [token, setToken] = useState<string | null>(localStorage.getItem('inkloom_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchWorkspaces = async () => {
    try {
      const list = await apiGetWorkspaces();
      setWorkspaces(list);
      if (list.length > 0 && !workspace) {
        setWorkspaceState(list[0]);
      }
    } catch (e) {
      console.warn('Could not fetch workspaces:', e);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('inkloom_token');
      if (savedToken) {
        try {
          const me = await apiGetMe();
          setUser(me);
          await fetchWorkspaces();
        } catch (e) {
          console.warn('Session expired or invalid token:', e);
          localStorage.removeItem('inkloom_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiLogin(email, password);
      localStorage.setItem('inkloom_token', res.token);
      setToken(res.token);
      setUser(res.user);
      if (res.defaultWorkspace) {
        setWorkspaceState(res.defaultWorkspace);
      }
      await fetchWorkspaces();
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (role: 'REVIEWER' | 'ADMIN' | 'CREATOR') => {
    if (role === 'REVIEWER') {
      await login('reviewer@inkloom.ai', 'Reviewer@123');
    } else if (role === 'ADMIN') {
      await login('admin@inkloom.ai', 'Admin@123');
    } else {
      await login('creator@inkloom.ai', 'Creator@123');
    }
  };

  const logout = () => {
    localStorage.removeItem('inkloom_token');
    setToken(null);
    setUser(null);
    setWorkspaceState(null);
  };

  const setWorkspace = (ws: Workspace) => {
    setWorkspaceState(ws);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workspace,
        token,
        isLoading,
        login,
        logout,
        setWorkspace,
        workspaces,
        quickLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
