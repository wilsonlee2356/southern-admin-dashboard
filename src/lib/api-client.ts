import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Ensure baseURL is defined, fallback to a safe default
const baseURL = process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL;
if (!baseURL) {
  console.error(
    "Error: NEXT_PUBLIC_EXTERNAL_API_BASE_URL is not defined in environment variables",
  );
}

// Centralized axios instance for API calls
const apiClient = axios.create({
  baseURL: baseURL || "http://localhost:8080/api", // Fallback for development
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log full URL for each request
apiClient.interceptors.request.use(
  (config: any) => {
    const fullUrl =
      config.baseURL && config.url
        ? `${config.baseURL}${config.url}`
        : config.url;
    console.log(`[API Request] ${config.method?.toUpperCase()} ${fullUrl}`);
    return config;
  },
  (error) => {
    console.error("[API Request Error]:", error);
    return Promise.reject(error);
  },
);

// Global error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error(
      `[API Response Error] ${error.config?.url || "Unknown URL"}:`,
      error.response?.data || error.message,
    );
    return Promise.reject(error);
  },
);

export default apiClient;
