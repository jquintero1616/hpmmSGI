// src/routes/PrivateRoute.tsx
import React, { ReactNode, useContext } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/Auth.context";

interface PrivateRouteProps {
  children?: ReactNode;
  validRoles?: string[];
}

const PrivateRouteValidation: React.FC<PrivateRouteProps> = ({ children, validRoles }) => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (!auth) {
    // por si acaso
    return <Navigate to="/" replace />;
  }

  // 1) ¿Estás logueado?
  if (!auth.isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 2) ¿Tu rol está en la lista de permitidos?
  if (validRoles && auth.id_rol && !validRoles.includes(auth.id_rol)) {
    // quizá mostrar página de "No tienes permiso"
    return <Navigate to="/home" replace />;
  }

  // Si todo ok, renderiza children o <Outlet/>
  return children ?? <Outlet />;
};

export default PrivateRouteValidation;