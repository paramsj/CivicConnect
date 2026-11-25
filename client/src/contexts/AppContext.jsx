// src/contexts/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useAuth, useClerk } from '@clerk/clerk-react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const logout = async () => {
    await signOut();
  };

  const value = {
    currentTime,
    user: isSignedIn ? { ...user, email: user.primaryEmailAddress?.emailAddress } : null,
    isAuthenticated: isSignedIn,
    isLoading: !isLoaded,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
