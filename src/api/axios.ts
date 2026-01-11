import axios from "axios";
import { store } from "@/store/store";
import { logout } from "@/store/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    console.log("Sending token:", token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // Token invalid or expired, logout
      store.dispatch(logout());
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;