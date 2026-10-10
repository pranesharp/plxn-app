'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadProfile, saveProfile, clearProfile, LocalProfile } from '../utils/storage';

interface ProfileContextType {
  profile: LocalProfile | null;
  loading: boolean;
  signIn: (name: string, email?: string) => void;
  signOut: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProfile(loadProfile());
    setLoading(false);
  }, []);

  const signIn = useCallback((name: string, email?: string) => {
    const p: LocalProfile = {
      name: name.trim() || 'Local User',
      email: email?.trim() || undefined,
      createdAt: Date.now(),
    };
    saveProfile(p);
    setProfile(p);
  }, []);

  const signOut = useCallback(() => {
    clearProfile();
    setProfile(null);
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, signIn, signOut }}>
      {children}
    </ProfileContext.Provider>
  );
};

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}
