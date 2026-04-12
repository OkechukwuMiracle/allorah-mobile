import { useState, useCallback } from 'react';
import api from '../services/api';

export interface RatesData {
  base: string;
  date: string;
  rates: Record<string, number>;
  fetchedAt: number;
}

export const useCurrencyRates = () => {
  const [data, setData] = useState<RatesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRates = useCallback(async (base: string = 'USD') => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<RatesData>(`/api/currency/rates?base=${base}`);
      setData(res.data);
    } catch {
      setError('Could not fetch rates. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchRates };
};
