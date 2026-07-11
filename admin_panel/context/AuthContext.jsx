import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate admin user from isolated localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('admin_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (_) {
      // ignore parse errors
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (name, role, email) => {
    const userData = { name, role, email };
    setUser(userData);
    localStorage.setItem('admin_user', JSON.stringify(userData));
    return true;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_user');
  };

  const value = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
