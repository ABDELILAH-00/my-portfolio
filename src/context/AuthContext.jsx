import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../lib/api';

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateToken: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token && !user) {
        try {
          const res = await api.get('/admin/user');
          setUser(res.data);
        } catch (error) {
          localStorage.removeItem('admin_token');
          setToken(null);
          setUser(null);
        }
      } else if (!token) {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const authValue = useMemo(() => ({
    user,
    token,
    loading,
    login: async (email, password) => {
      try {
        const res = await api.post('/login', { email, password });
        localStorage.setItem('admin_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
      } catch (err) {
        console.error("AUTH_CONTEXT_LOGIN_ERROR:", err);
        throw err;
      }
    },
    logout: () => {
      localStorage.removeItem('admin_token');
      setToken(null);
      setUser(null);
    },
    updateToken: (newToken) => {
      localStorage.setItem('admin_token', newToken);
      setToken(newToken);
    }
  }), [user, token, loading]);

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

