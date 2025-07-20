// src/hooks/useReactQuery.ts
import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

type UseCustomQueryProps<TData, TError> = {
  queryKey: unknown[];
  queryFn: () => Promise<TData>;
  options?: UseQueryOptions<TData, TError, TData, unknown[]>;
};

const useReactQuery = <TData = unknown, TError = unknown>({
  queryKey,
  queryFn,
  options,
}: UseCustomQueryProps<TData, TError>): UseQueryResult<TData, TError> => {
  return useQuery<TData, TError, TData, unknown[]>({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    ...options,
  });
};

export default useReactQuery;