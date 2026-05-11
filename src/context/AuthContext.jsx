import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext({
  user: null,
  token: null,
  loading: false,
  login: () => {},
  logout: () => {},
  updateToken: () => {}
});

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage - if token exists, user is logged in
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('admin_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });
  // No loading state needed - localStorage is synchronous
  const [loading] = useState(false);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/login', { email, password });
    const newToken = res.data.token;
    const newUser = res.data.user;
    localStorage.setItem('admin_token', newToken);
    localStorage.setItem('admin_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUser(null);
  }, []);

  const updateToken = useCallback((newToken) => {
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
  }, []);

  const authValue = useMemo(() => ({
    user,
    token,
    loading,
    login,
    logout,
    updateToken
  }), [user, token, loading, login, logout, updateToken]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

