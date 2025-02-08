import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
});

// Request Interceptor to Handle FormData
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      // Let the browser set the correct multipart boundary
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
