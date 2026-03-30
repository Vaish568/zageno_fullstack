import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '../types';

interface UserContextType {
  user: User | null;
  userId: number;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

// Default user for demo purposes (matches seed data)
const DEFAULT_USER: User = {
  id: 1,
  email: 'user@example.com',
  name: 'Demo User',
  created_at: new Date().toISOString(),
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);

  const value = {
    user,
    userId: user?.id || 1, // Default to 1 for demo
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
