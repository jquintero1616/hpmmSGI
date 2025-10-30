import axios, { AxiosInstance } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://api.cfra2.com:3000/api";

export function axiosPublic(): AxiosInstance {
  // Esta función no necesita autenticación, así que no hacemos nada especial
  return axios.create({
    baseURL: `${API_BASE_URL}/auth`,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Incluye las cookies automáticamente
  });
}

export default axiosPublic;