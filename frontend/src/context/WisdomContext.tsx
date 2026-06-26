import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getWisdomProfile, updateLanguagePref } from '../api/wisdom';

type Language = 'en' | 'ta';

interface WisdomContextType {
  language: Language;
  toggleLanguage: () => void;
  profile: any;
  refreshProfile: () => void;
}

const WisdomContext = createContext<WisdomContextType | undefined>(undefined);

export const WisdomProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [language, setLanguage] = useState<Language>('en');
  const [profile, setProfile] = useState<any>(null);

  const refreshProfile = async () => {
    if (user?.token) {
      try {
        const data = await getWisdomProfile(user.token);
        setProfile(data);
        if (data.languagePreference) {
          setLanguage(data.languagePreference);
        }
      } catch (err) {
        console.error('Failed to load wisdom profile', err);
      }
    }
  };

  useEffect(() => {
    refreshProfile();
  }, [user]);

  const toggleLanguage = async () => {
    const newLang = language === 'en' ? 'ta' : 'en';
    setLanguage(newLang);
    if (user?.token) {
      try {
        await updateLanguagePref(newLang, user.token);
      } catch (err) {
        console.error('Failed to update language', err);
      }
    }
  };

  return (
    <WisdomContext.Provider value={{ language, toggleLanguage, profile, refreshProfile }}>
      {children}
    </WisdomContext.Provider>
  );
};

export const useWisdom = () => {
  const context = useContext(WisdomContext);
  if (!context) {
    throw new Error('useWisdom must be used within a WisdomProvider');
  }
  return context;
};
