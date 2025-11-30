'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session on mount
    const sessionUser = localStorage.getItem('currentUser');
    if (sessionUser) {
      try {
        const parsedUser = JSON.parse(sessionUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user session:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Login failed:', data.error);
        return false;
      }

      // Map database response to User type
      const studentData = data.student;
      const mappedUser: User = {
        id: String(studentData.id),
        email: studentData.email,
        password: '', // Don't store password in client
        fullName: studentData.name || '',
        uin: studentData.uin || '',
        avatar: '/avatars/default-avatar.jpg', // Default avatar
        bio: '', // Not in database, default empty
        degreeType: (studentData.degreeType as 'MS' | 'PhD' | 'MBA' | 'BS' | '') || '',
        academicLevel: (studentData.academicLevel as 'Graduate' | 'Undergraduate' | '') || '',
        graduationYear: studentData.graduationYear || null,
        domainsOfInterest: Array.isArray(studentData.domainsOfInterest) 
          ? studentData.domainsOfInterest 
          : (typeof studentData.domainsOfInterest === 'string' 
              ? JSON.parse(studentData.domainsOfInterest || '[]') 
              : []),
        targetIndustries: Array.isArray(studentData.targetIndustries)
          ? studentData.targetIndustries
          : (typeof studentData.targetIndustries === 'string'
              ? JSON.parse(studentData.targetIndustries || '[]')
              : []),
        resumeUrl: studentData.resumeUrl || '',
        needsMentor: studentData.needsMentor || false,
        isRegistered: true, // If they can login, they're registered
        mentor: undefined, // Not in database, can be fetched separately if needed
        activityLog: [], // Not in database, can be fetched separately if needed
      };

      setUser(mappedUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(mappedUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      // Note: In a production app, you would also call an API to update the database
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
