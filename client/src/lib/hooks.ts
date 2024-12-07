import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { createData, deleteData, fetchData, updateData } from "./api";

// A reusable custom hook for managing local state with React Query
export function useLocalState<T>(key: string, initialValue?: T) {
  const queryClient = useQueryClient();

  // Initialize or retrieve the local state
  const { data: state } = useQuery({
    queryKey: [key],
    queryFn: () => initialValue, // Provide the initial value
    enabled: false, // Prevent automatic fetching
  });

  // Function to update the local state
  const setState = (newValue: T) => {
    queryClient.setQueryData([key], newValue);
  };

  return { state, setState };
}

// Generic API hook
export const useApi = <T>(
  method: "GET" | "POST" | "PUT" | "DELETE", // HTTP method type
  endpoint: string, // The API endpoint
  data?: Record<string, any>, // Data for POST or PUT (optional)
  params?: Record<string, any>, // Query params for GET (optional)
  queryOptions?: UseQueryOptions<T>, // Options for query (GET request)
  mutationOptions?: UseMutationOptions<T, any, any> // Options for mutation (POST, PUT, DELETE)
) => {
  // For GET request, use `useQuery`
  if (method === "GET") {
    return useQuery<T>({
      queryKey: [endpoint, params], // Cache key based on endpoint and params
      queryFn: () => fetchData<T>(endpoint, params),
      ...queryOptions, // Custom options passed by the user
    });
  }

  // For POST, PUT, DELETE requests, use `useMutation`
  else {
    let mutationFn;
    if (method === "POST") mutationFn = () => createData<T>(endpoint, data!);
    if (method === "PUT") mutationFn = () => updateData<T>(endpoint, data!);
    if (method === "DELETE") mutationFn = () => deleteData(endpoint);

    return useMutation<T, any, any>({
      mutationFn,
      ...mutationOptions, // Custom options passed by the user
    });
  }
};
