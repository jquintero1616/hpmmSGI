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
  const [idRol, setIdRol] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [roleName, setRoleName] = useState<string | undefined>();
  const [employeName, setEmployeName] = useState<string | undefined>();

  const authenticate = async (email: string, password: string) => {
    try {
      const response = await authenticateUser(email, password);
      setIsAuthenticated(true);
      setUsername(response.username);
      setIdRol(response.id_rol);
      setUserId(response.id_user);
      setRoleName(response.role_name);
      setEmployeName(response.employe_name);
    } catch (error) {
      setUserId(undefined);
      setIsAuthenticated(false);
      setUsername(undefined);
      setIdRol(undefined);
      setRoleName(undefined);
      setEmployeName(undefined);
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
      const { username, id_role, id_user } = response.data;
      setIsAuthenticated(true);
      setUsername(username);
      setUserId(id_user);
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
        idRol,
        userId,
        roleName,
        employeName
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
