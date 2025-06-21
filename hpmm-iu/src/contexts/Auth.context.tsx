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
  const [idEmployes, setIdEmployes] = useState<string | undefined>();
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
      setIdEmployes(response.id_employes);
    } catch (error) {
      setUserId(undefined);
      setIsAuthenticated(false);
      setUsername(undefined);
      setIdRol(undefined);
      setRoleName(undefined);
      setEmployeName(undefined);
      setIdEmployes(undefined);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axiosPublic().get("/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setUserId(undefined);
      setIsAuthenticated(false);
      setUsername(undefined);
      setIdRol(undefined);
      setRoleName(undefined);
      setEmployeName(undefined);
      setIdEmployes(undefined);
    }
  };

  const checkSession = async () => {
    try {
      const response = await axiosPublic().get("/check-session");
      // El servidor confirma que la sesión existe y devuelve datos del usuario
      const { username, id_rol, id_user, role_name, employe_name, id_employes } =
        response.data;

      setIsAuthenticated(true);
      setUsername(username);
      setIdRol(id_rol);
      setUserId(id_user);
      setRoleName(role_name);
      setEmployeName(employe_name);
      setIdEmployes(id_employes);
    } catch (error) {
      // 401 o cualquier otro error: no hay sesión válida
      setUserId(undefined);
      setIsAuthenticated(false);
      setUsername(undefined);
      setIdRol(undefined);
      setRoleName(undefined);
      setEmployeName(undefined);
      setIdEmployes(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          {/* Spinner moderno */}
          <div className="relative">
            <div className="w-8 h-8 border-2 border-slate-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-8 h-8 border-2 border-hpmm-morado-claro border-t-transparent rounded-full animate-spin"></div>
          </div>
          <span className="mt-4 text-slate-500 text-xs uppercase tracking-widest font-light">
            Cargando
          </span>
        </div>
      </div>
    );
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
        employeName,
        idEmployes
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
