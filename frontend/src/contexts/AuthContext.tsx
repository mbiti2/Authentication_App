import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/services/api';
import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Reset session timer on user activity
  const resetSessionTimer = useCallback(() => {
    if (sessionTimer) {
      clearTimeout(sessionTimer);
    }

    const newTimer = setTimeout(() => {
      logout();
    }, SESSION_TIMEOUT);

    setSessionTimer(newTimer);
  }, [sessionTimer]);

  // Setup activity listeners for session management
  useEffect(() => {
    if (user) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      
      events.forEach(event => {
        document.addEventListener(event, resetSessionTimer, true);
      });

      resetSessionTimer();

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, resetSessionTimer, true);
        });
        if (sessionTimer) {
          clearTimeout(sessionTimer);
        }
      };
    }
  }, [user, resetSessionTimer]);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authApi.getAccessToken();
        if (token) {
          const userProfile = await authApi.getProfile();
          setUser(userProfile);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        authApi.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(email, password);
      setUser(response.user);
      navigate('/profile');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.register(email, password, firstName, lastName);
      setUser(response.user);
      navigate('/profile');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    authApi.clearTokens();
    setUser(null);
    if (sessionTimer) {
      clearTimeout(sessionTimer);
      setSessionTimer(null);
    }
    navigate('/login');
  }, [navigate, sessionTimer]);

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user,
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
