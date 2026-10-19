'use client';

import { useQuery } from '@tanstack/react-query';
import { getNpmLatestVersion } from '@/service/api';

/**
 * Custom React Query hook to fetch and cache create-morax's latest version from npm registry.
 */
export const useMoraxVersion = () => {
  return useQuery({
    queryKey: ['morax-version', 'create-morax'],
    queryFn: () => getNpmLatestVersion('create-morax'),
    staleTime: 1000 * 60 * 60, // 1 hour cache
    gcTime: 1000 * 60 * 60 * 24, // 24 hours retention
  });
};

export default useMoraxVersion;
