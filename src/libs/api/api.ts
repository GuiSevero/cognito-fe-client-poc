import axios from "axios";

const baseUrl = import.meta.env.VITE_BFF_API_URL;

const api = axios.create({
  baseURL: baseUrl,
});

export const setApiAccessToken = (accessToken: string) => {
  api.defaults.headers.Authorization = `Bearer ${accessToken}`;
};

export default api;
