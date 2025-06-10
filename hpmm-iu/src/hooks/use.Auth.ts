
import { useContext } from "react";
import { AuthContext } from "../contexts/Auth.context";
import { AuthContextType } from "../interfaces/Context.interface";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de un AuthProvider");
  }
  return context;
};

