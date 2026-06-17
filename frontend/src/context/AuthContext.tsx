import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/authService';
import { getPublicFeatureFlags } from '../services/adminService';

interface AuthContextType {
  user: any;
  login: (userData: any) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  updateUser: (user: any) => void;
  isLoading: boolean;
  featureFlags: any[];
  isFlagsLoading: boolean;
  refreshFlags: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [featureFlags, setFeatureFlags] = useState<any[]>([]);
  const [isFlagsLoading, setIsFlagsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);

    // Global fetch interceptor for blocked accounts
    const originalFetch = window.fetch;
    window.fetch = async function () {
      const response = await originalFetch.apply(this, arguments as any);
      if (response.status === 403) {
        const cloned = response.clone();
        try {
          const data = await cloned.json();
          if (data.isBlocked) {
            alert('Your account has been blocked by an administrator: ' + (data.message || ''));
            authService.logout();
            setUser(null);
            window.location.href = '/login';
          }
        } catch (e) {}
      }
      return response;
    };
  }, []);

  const refreshFlags = async () => {
    if (user?.token) {
      try {
        setIsFlagsLoading(true);
        const flags = await getPublicFeatureFlags(user.token);
        setFeatureFlags(flags);
      } catch (err) {
        console.error('Failed to fetch flags', err);
      } finally {
        setIsFlagsLoading(false);
      }
    } else {
      setIsFlagsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (user?.token) {
      try {
        const updatedUser = await authService.getCurrentUser(user.token);
        if (updatedUser) {
          setUser(updatedUser);
        }
      } catch (err) {
        console.error('Failed to refresh user', err);
      }
    }
  };

  useEffect(() => {
    refreshFlags();
    refreshUser();
  }, [user?.token]); // trigger when token changes (login/mount)

  const login = async (userData: any) => {
    const data = await authService.login(userData);
    setUser(data);
    return data;
  };

  const register = async (userData: any) => {
    const data = await authService.register(userData);
    setUser(data);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updatedUser: any) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading, featureFlags, isFlagsLoading, refreshFlags, refreshUser }}>
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
