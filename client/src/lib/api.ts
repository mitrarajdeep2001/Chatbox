import axiosInstance from "./axiosInstance";

// Function to fetch data (GET request)
export const fetchData = async <T>(
  endpoint: string,
  params?: Record<string, any>
) => {
  const response = await axiosInstance.get<T>(endpoint, { params });
  return response.data;
};

// Function to create data (POST request)
export const createData = async <T>(
  endpoint: string,
  data: Record<string, any>
) => {
  const response = await axiosInstance.post<T>(endpoint, data);
  return response.data;
};

// Function to update data (PUT request)
export const updateData = async <T>(
  endpoint: string,
  data: Record<string, any>
) => {
  const response = await axiosInstance.put<T>(endpoint, data);
  return response.data;
};

// Function to delete data (DELETE request)
export const deleteData = async (endpoint: string) => {
  const response = await axiosInstance.delete(endpoint);
  return response.data;
};
