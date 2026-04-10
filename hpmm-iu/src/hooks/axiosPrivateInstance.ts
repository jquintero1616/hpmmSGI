// src/hooks/useAxiosPrivate.ts
import axios, { AxiosInstance } from "axios";
import { useEffect, useRef } from "react";
import { useAuth } from "./use.Auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.cfra2.com:8443/api";

// Flag global para evitar llamar logout() múltiples veces en cascada
let isLoggingOut = false;

function useAxiosPrivate(): AxiosInstance {
  const { logout } = useAuth();
  const axiosRef = useRef<AxiosInstance>();

  if (!axiosRef.current) {
    axiosRef.current = axios.create({
      baseURL: API_BASE_URL,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
  }

  useEffect(() => {
    const inst = axiosRef.current!;

    // Response interceptor para atrapar 401 y forzar logout (una sola vez)
    const rs = inst.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401 && !isLoggingOut) {
          isLoggingOut = true;
          logout().finally(() => { isLoggingOut = false; });
        }
        return Promise.reject(err);
      }
    );

    return () => {
      inst.interceptors.response.eject(rs);
    };
  }, [logout]);

  return axiosRef.current!;
}

export default useAxiosPrivate;