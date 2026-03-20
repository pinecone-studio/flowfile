'use client';

import { useEffect, useState } from 'react';
import { fetchDashboardData } from './dashboard.api';

type DashboardState = Awaited<ReturnType<typeof fetchDashboardData>>;

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Failed to load dashboard';

export function useDashboard() {
  const [data, setData] = useState<DashboardState>({
    employees: [],
    jobs: [],
    generatedDocuments: [],
    reviewRequests: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const next = await fetchDashboardData();

        if (!active) return;
        setData(next);
      } catch (error) {
        if (!active) return;
        setError(getErrorMessage(error));
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  return {
    ...data,
    isLoading,
    error,
  };
}
