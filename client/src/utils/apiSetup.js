// src/utils/apiSetup.js
// This file sets up the API service with Clerk auth
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import apiService from '../services/apiService';

export const useApiSetup = () => {
  const { getToken } = useAuth();
  
  useEffect(() => {
    // Set the token getter function for the API service
    apiService.setTokenGetter(getToken);
  }, [getToken]);
};
