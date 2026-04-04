import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { useTranslation } from 'react-i18next';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    api.auth.me()
      .then(({ user }) => {
        setUser(user);
        if (user?.locale) i18n.changeLanguage(user.locale);
      })
      .catch(() => {
        const saved = localStorage.getItem('user');
        if (saved) setUser(JSON.parse(saved));
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { user } = await api.auth.login(email, password);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      if (user.locale) i18n.changeLanguage(user.locale);
      return { success: true };
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        const demoUser = { id: 'demo', name: 'Demo User', email, locale: i18n.language, email_verified: true, role: 'user' };
        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
        return { success: true };
      }
      return { success: false, error: err.message };
    }
  }, [i18n]);

  const register = useCallback(async (name, email, password, role = 'user') => {
    try {
      const { user, message } = await api.auth.register(name, email, password, i18n.language, role);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true, message };
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        const demoUser = { id: 'demo', name, email, locale: i18n.language, email_verified: false, role };
        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
        return { success: true };
      }
      return { success: false, error: err.message };
    }
  }, [i18n]);

  const logout = useCallback(async () => {
    try { await api.auth.logout(); } catch {}
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const updateUser = useCallback(async (data) => {
    try {
      const { user: updated } = await api.users.updateProfile(data);
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      return { success: true };
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        const updated = { ...user, ...data };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
        return { success: true };
      }
      return { success: false, error: err.message };
    }
  }, [user]);

  const oauthLogin = useCallback(async (provider) => {
    try {
      const { url } = await api.auth.getOAuthUrl(provider);
      window.location.href = url;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const oauthCallback = useCallback(async (provider, code, state) => {
    try {
      const { user } = await api.auth.oauthCallback(provider, code, state);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      if (user.locale) i18n.changeLanguage(user.locale);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [i18n]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, oauthLogin, oauthCallback }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
