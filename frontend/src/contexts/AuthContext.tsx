import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/services/api';
import { User } from '@/types/auth';
import { jwtDecode} from "jwt-decode";

interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  getAccessToken: () => string | null;
}    

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT = Number(import.meta.env.VITE_SESSION_TIMEOUT_MS) || 10 * 60 * 1000; // Configurable via env
const USER_KEY = 'user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    authApi.clearTokens();
    setUser(null);
    localStorage.removeItem(USER_KEY);
    navigate('/login');
  }, [navigate]);

  // Reset session timer on user activity
  const resetSessionTimer = useCallback(() => {
    setSessionTimer((prevTimer) => {
      if (prevTimer) {
        clearTimeout(prevTimer);
      }
      return setTimeout(() => {
        logout();
      }, SESSION_TIMEOUT);
    });
  }, [logout]);

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
        // Only clear the timer, don't depend on sessionTimer
        setSessionTimer(prevTimer => {
          if (prevTimer) clearTimeout(prevTimer);
          return null;
        });
      };
    }
  }, [user, resetSessionTimer]);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authApi.getAccessToken();
        if (token) {
          // Try to restore user from localStorage first
          const storedUser = localStorage.getItem(USER_KEY);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            const userProfile = await authApi.getUserProfile();
            setUser(userProfile);
            localStorage.setItem(USER_KEY, JSON.stringify(userProfile));
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        authApi.clearTokens();
        localStorage.removeItem(USER_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(email, password);
      const token = (response as any).access_token || (response as any).token;
      if (!token) {
        throw new Error("No token received from login response");
      }
      localStorage.setItem("token", token);
      const userInfo = response.user;
      setUser(userInfo);
      localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
      navigate("/profile");
    } catch (error) {
      console.error("Login error:", error);
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
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      navigate('/profile');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  const value = {
    user,
    setUser,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user,
    getAccessToken: authApi.getAccessToken
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
