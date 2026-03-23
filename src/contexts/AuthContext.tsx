import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, businessName: string, country: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('autocollect_user');
    if (stored) setUser(JSON.parse(stored));
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 800));
    const mockUser: User = { id: 'u1', email, role: 'business', business_id: 'b1', full_name: 'Demo Business' };
    setUser(mockUser);
    localStorage.setItem('autocollect_user', JSON.stringify(mockUser));
  };

  const signup = async (email: string, _password: string, businessName: string, _country: string) => {
    await new Promise(r => setTimeout(r, 800));
    const mockUser: User = { id: 'u1', email, role: 'business', business_id: 'b1', full_name: businessName };
    setUser(mockUser);
    localStorage.setItem('autocollect_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('autocollect_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
