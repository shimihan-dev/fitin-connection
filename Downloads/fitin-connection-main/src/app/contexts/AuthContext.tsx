import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, signOut, User } from '../../../utils/auth';

interface AuthContextType {
  user: { name: string; email: string; id?: string; profile_picture?: string; role?: 'user' | 'trainer' } | null;
  setUser: (u: AuthContextType['user']) => void;
  handleLogout: () => void;
  handleLoginSuccess: (loggedInUser: User) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser({
          id: currentUser.id,
          name: currentUser.name || currentUser.email.split('@')[0],
          email: currentUser.email,
          profile_picture: currentUser.profile_picture,
          role: (currentUser as any).role || 'user',
        });
      }
    } catch (error) {
      console.error('사용자 확인 에러:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser({
      id: loggedInUser.id,
      name: loggedInUser.name || loggedInUser.email.split('@')[0],
      email: loggedInUser.email,
      profile_picture: loggedInUser.profile_picture,
      role: (loggedInUser as any).role || 'user',
    });
  };

  const handleLogout = () => {
    signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout, handleLoginSuccess, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}