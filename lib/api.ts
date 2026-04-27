import axios, { InternalAxiosRequestConfig } from "axios";

const API = axios.create({
    baseURL: "/api"
});

// Attach token automatically
API.interceptors.request.use((req: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem("token");
        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }
    }
    return req;
});

export default API;
