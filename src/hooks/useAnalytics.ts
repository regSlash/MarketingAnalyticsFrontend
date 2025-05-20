import { useQuery } from 'react-query';
import { fetchAnalytics } from '../api/client';

export const useAnalyticsData = () => 
  useQuery('analytics', fetchAnalytics, {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => 
      failureCount < 3 && typeof error === 'object' && error !== null && 'message' in error && (error as { message?: string }).message !== '403'
  });