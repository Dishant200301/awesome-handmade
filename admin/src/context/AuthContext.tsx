import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api/v1' : 'http://localhost:5000/api/v1')}/auth/admin`;

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('awesome_admin_user') || localStorage.getItem('aaramly_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('awesome_admin_token') || localStorage.getItem('aaramly_admin_token');
  });

  useEffect(() => {
    // If token exists, verify with backend /me endpoint
    if (token) {
      fetch(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setUser(data.data);
            localStorage.setItem('awesome_admin_user', JSON.stringify(data.data));
          } else {
            // Token expired or invalid
            logout();
          }
        })
        .catch(() => {
          // If offline or network error, keep stored user
        });
    }
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Authentication failed.');
    }

    const { user: loggedInUser, token: authToken } = data.data;
    setUser(loggedInUser);
    setToken(authToken);
    localStorage.setItem('awesome_admin_user', JSON.stringify(loggedInUser));
    localStorage.setItem('awesome_admin_token', authToken);
  };

  const signup = async (name: string, email: string, pass: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass, role: 'Super Admin' })
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Registration failed.');
    }

    const { user: registeredUser, token: authToken } = data.data;
    setUser(registeredUser);
    setToken(authToken);
    localStorage.setItem('awesome_admin_user', JSON.stringify(registeredUser));
    localStorage.setItem('awesome_admin_token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('awesome_admin_user');
    localStorage.removeItem('awesome_admin_token');
    localStorage.removeItem('aaramly_admin_user');
    localStorage.removeItem('aaramly_admin_token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
