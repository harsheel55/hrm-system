import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { adminLoginApi } from '../api/authApi';
import { authStore, type AuthUser } from '../store/authStore';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    credentials: { email: string; password: string },
    mode?: 'user' | 'admin'
  ) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = authStore.getUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (
    credentials: { email: string; password: string },
    mode: 'user' | 'admin' = 'user'
  ): Promise<AuthUser> => {
    let response;
    
    if (mode === 'admin') {
      response = await adminLoginApi(credentials);
    } else {
      // Import and call userLoginApi
      const { userLoginApi } = await import('../api/authApi');
      response = await userLoginApi(credentials);
    }

    const authUser: AuthUser = {
      email: response.email,
      role: response.role === 'Admin' ? 'Admin' : 'User',
      name: response.email.split('@')[0],
      roleName: response.roleName,
    };

    authStore.saveSession(response.token, authUser);
    setUser(authUser);
    return authUser;
  };

  const logout = () => {
    authStore.clearSession();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
