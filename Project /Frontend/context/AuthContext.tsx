import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCreator: boolean;
  isDonor: boolean;
  role: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('access_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Verify stored session on initial load
    const verifySession = async () => {
      if (token) {
        try {
          const profile = await api.auth.me();
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        } catch {
          // Token is invalid/expired
          logout();
        }
      }
      setLoading(false);
    };
    verifySession();
  }, [token]);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.auth.login({ email, password });
    localStorage.setItem('access_token', res.access_token);
    localStorage.setItem('user', JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user);
    return res.user;
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<User> => {
    const res = await api.auth.register({ name, email, password, role });
    localStorage.setItem('access_token', res.access_token);
    localStorage.setItem('user', JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token && user);
  const role = user?.role || null;
  const isAdmin = role === 'ADMIN';
  const isCreator = role === 'CREATOR';
  const isDonor = role === 'DONOR';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        isCreator,
        isDonor,
        role,
      }}
    >
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
