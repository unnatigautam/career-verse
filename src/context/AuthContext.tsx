import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('career_token');
    const userStr = localStorage.getItem('career_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setState({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('career_token');
        localStorage.removeItem('career_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const users: Record<string, { user: User; password: string }> = JSON.parse(
      localStorage.getItem('career_users') || '{}'
    );
    const entry = Object.values(users).find((u) => u.user.email === email);
    if (!entry) throw new Error('No account found with this email.');
    if (entry.password !== btoa(password)) throw new Error('Incorrect password.');

    const token = `mock_jwt_${entry.user.id}_${Date.now()}`;
    localStorage.setItem('career_token', token);
    localStorage.setItem('career_user', JSON.stringify(entry.user));
    setState({ user: entry.user, token, isAuthenticated: true });
  };

  const signup = async (name: string, email: string, password: string) => {
    const users: Record<string, { user: User; password: string }> = JSON.parse(
      localStorage.getItem('career_users') || '{}'
    );
    const exists = Object.values(users).some((u) => u.user.email === email);
    if (exists) throw new Error('An account with this email already exists.');

    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      email,
      name,
      createdAt: new Date().toISOString(),
    };
    users[user.id] = { user, password: btoa(password) };
    localStorage.setItem('career_users', JSON.stringify(users));

    const token = `mock_jwt_${user.id}_${Date.now()}`;
    localStorage.setItem('career_token', token);
    localStorage.setItem('career_user', JSON.stringify(user));
    setState({ user, token, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('career_token');
    localStorage.removeItem('career_user');
    setState({ user: null, token: null, isAuthenticated: false });
  };

  const updateUser = (user: User) => {
    localStorage.setItem('career_user', JSON.stringify(user));
    setState((prev) => ({ ...prev, user }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
