import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';
import { INITIAL_USERS } from '../mock/initialData';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  switchRoleForDemo: (role: UserRole | 'GUEST') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      try {
        const stored = await authService.getCurrentUser();
        if (stored) {
          setUser(stored);
        } else {
          // Default to demo farmer for quick testing experience
          setUser(INITIAL_USERS[0]);
        }
      } catch (err) {
        console.error('Failed to get auth user:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initUser();
  }, []);

  const login = async (email: string, password?: string) => {
    const loggedIn = await authService.login(email, password);
    setUser(loggedIn);
    return loggedIn;
  };

  const register = async (data: any) => {
    const registered = await authService.register(data);
    setUser(registered);
    return registered;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = await authService.updateProfile(user.id, updates);
    setUser(updated);
  };

  const switchRoleForDemo = async (targetRole: UserRole | 'GUEST') => {
    if (targetRole === 'GUEST') {
      await logout();
      return;
    }
    const sample = INITIAL_USERS.find((u) => u.role === targetRole) || INITIAL_USERS[0];
    await login(sample.email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        switchRoleForDemo,
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
