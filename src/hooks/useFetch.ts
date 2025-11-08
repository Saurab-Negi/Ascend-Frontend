import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { auth } from "../lib/Firebase";

function useFetch<T = any>(
  key: string | any[],
  url: string,
  options?: Omit<UseQueryOptions<T, Error, T, string[]>, "queryKey" | "queryFn"> & { keepPreviousData?: boolean }
) {
  return useQuery<T, Error, T, string[]>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken();
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        let errorMessage = `HTTP error! status: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData?.msg || errorData?.message || JSON.stringify(errorData);
        } catch (e) {
          const text = await res.text();
          if (text) errorMessage = text;
        }
        throw new Error(errorMessage);
      }

      return res.json();
    },
    retry: 3,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export default useFetch;
