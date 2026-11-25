// hooks/useDataLoader.js
import { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';

export const useDataLoader = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [complaints, users] = await Promise.all([
          DataService.loadComplaintsData(),
          DataService.loadUsersData()
        ]);

        const processedData = DataService.processComplaintsData(complaints, users);
        setData(processedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error, reload: () => loadData() };
};
