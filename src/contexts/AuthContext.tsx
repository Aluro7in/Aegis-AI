import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: 'Admin' | 'Reviewer' | 'End-User') => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultPermissions = {
  Admin: ['all'],
  Reviewer: ['read', 'moderate', 'audit', 'policies:read'],
  'End-User': ['read', 'chat', 'feedback']
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('aegis-auth-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock authentication - in real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const role = email.includes('admin') ? 'Admin' : 
                 email.includes('reviewer') ? 'Reviewer' : 'End-User';
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role,
      permissions: defaultPermissions[role],
      lastLogin: new Date()
    };
    
    setUser(newUser);
    localStorage.setItem('aegis-auth-user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aegis-auth-user');
  };

  const switchRole = (role: 'Admin' | 'Reviewer' | 'End-User') => {
    if (user) {
      const updatedUser = {
        ...user,
        role,
        permissions: defaultPermissions[role]
      };
      setUser(updatedUser);
      localStorage.setItem('aegis-auth-user', JSON.stringify(updatedUser));
    }
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    return user.permissions.includes('all') || user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      switchRole,
      isAuthenticated: !!user,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};