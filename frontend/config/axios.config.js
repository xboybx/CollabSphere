import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token dynamically before each request
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;