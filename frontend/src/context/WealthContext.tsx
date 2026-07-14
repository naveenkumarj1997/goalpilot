import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getWealthProfile, getDreams } from '../api/wealth';
import { useAuth } from './AuthContext';

interface WealthContextType {
  profile: any;
  dreams: any[];
  isLoading: boolean;
  refreshWealthData: () => Promise<void>;
  formatCurrency: (amount: number) => string;
}

const WealthContext = createContext<WealthContextType | undefined>(undefined);

export const WealthProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [dreams, setDreams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshWealthData = async () => {
    if (user?.token) {
      try {
        const [profileData, dreamsData] = await Promise.all([
          getWealthProfile(user.token),
          getDreams(user.token)
        ]);
        setProfile(profileData);
        setDreams(dreamsData);
      } catch (error) {
        console.error('Error fetching wealth data:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshWealthData();
  }, [user]);

  const formatCurrency = (amount: number) => {
    const currency = profile?.currency || 'USD';
    const locale = currency === 'INR' ? 'en-IN' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <WealthContext.Provider value={{ profile, dreams, isLoading, refreshWealthData, formatCurrency }}>
      {children}
    </WealthContext.Provider>
  );
};

export const useWealth = () => {
  const context = useContext(WealthContext);
  if (context === undefined) {
    throw new Error('useWealth must be used within a WealthProvider');
  }
  return context;
};
