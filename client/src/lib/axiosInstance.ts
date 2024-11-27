// lib/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL, // or your preferred base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
