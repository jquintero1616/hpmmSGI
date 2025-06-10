import React, { createContext, useState, useEffect } from "react";
import { authenticateUser } from "../services/Auth.service";
import { AuthContextType } from "../interfaces/Context.interface";
import axiosPublic from "../helpers/axiosInstance";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | undefined>();
  const [userId, setUserId] = useState<string | undefined>();
  const [id_rol, setIdRol] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

  const authenticate = async (email: string, password: string) => {
    try {
      const response = await authenticateUser(email, password);
      setIsAuthenticated(true);
      setUsername(response.username);
      setIdRol(response.id_rol);
      setUserId(response.userId);
    } catch (error) {
      setUserId(undefined);
      setIsAuthenticated(false);
      setUsername(undefined);
      setIdRol(undefined);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axiosPublic().get("/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsAuthenticated(false);
      setUsername(undefined);
      setUserId(undefined);
      setIdRol(undefined);
    }
  };

  const checkSession = async () => {
    try {
      const response = await axiosPublic().get("/check-session");
      // El servidor confirma que la sesión existe y devuelve datos del usuario
      const { username, id_role, userId } = response.data;
      setIsAuthenticated(true);
      setUsername(username);
      setUserId(userId);
      setIdRol(id_role);
    } catch (error) {
      // 401 o cualquier otro error: no hay sesión válida
      setIsAuthenticated(false);
      setUsername(undefined);
      setIdRol(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  if (loading) {
    return <div>Cargando autenticacion...</div>; // O un spinner de carga
  }

  return (
    <AuthContext.Provider
      value={{
        authenticate,
        logout,
        isAuthenticated,
        username,
        id_rol,
        userId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
