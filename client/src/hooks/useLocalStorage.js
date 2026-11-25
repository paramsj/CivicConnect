// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove item from localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

// Hook for session storage (similar to localStorage but session-based)
export const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

// Hook for managing user preferences
export const useUserPreferences = () => {
  const [preferences, setPreferences, removePreferences] = useLocalStorage('user_preferences', {
    theme: 'light',
    language: 'en',
    notifications: true,
    dashboard: {
      layout: 'grid',
      autoRefresh: true,
      refreshInterval: 30000 // 30 seconds
    }
  });

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateDashboardPreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      dashboard: {
        ...prev.dashboard,
        [key]: value
      }
    }));
  };

  return {
    preferences,
    updatePreference,
    updateDashboardPreference,
    resetPreferences: removePreferences
  };
};

// Hook for managing recently viewed items
export const useRecentItems = (maxItems = 10) => {
  const [recentItems, setRecentItems] = useLocalStorage('recent_items', []);

  const addRecentItem = (item) => {
    setRecentItems(prev => {
      // Remove existing item if it exists
      const filtered = prev.filter(existing => existing.id !== item.id);
      // Add to beginning and limit to maxItems
      return [{ ...item, timestamp: new Date().toISOString() }, ...filtered].slice(0, maxItems);
    });
  };

  const removeRecentItem = (itemId) => {
    setRecentItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearRecentItems = () => {
    setRecentItems([]);
  };

  return {
    recentItems,
    addRecentItem,
    removeRecentItem,
    clearRecentItems
  };
};
