/**
 * useApiData — generic data-fetching hook for client components.
 *
 * Wraps apiClient.get() with loading / error state so dashboard pages
 * don't repeat boilerplate.
 *
 * Usage:
 *   const { data, isLoading, error, refetch } = useApiData<Applicant[]>("/dashboard/applicants");
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient, ApiError } from "@/services/apiClient";

interface ApiDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApiData<T>(endpoint: string): ApiDataState<T> {
  const [data,      setData]      = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiClient.get<T>(endpoint);
      setData(result);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load data. Is the server running?");
      }
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => { void fetchData(); }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
