import React, { createContext, useEffect, useState } from "react";
import {
  GetEmployesService,
  GetEmployeByIdService,
  PostCreateEmployeService,
  PutUpdateEmployeService,
  DeleteEmployeService,
} from "../services/Employes.service";
import {
  EmployeeContextType,
  ProviderProps,
} from "../interfaces/Context.interface";
import { useAuth } from "../hooks/use.Auth";
import { EmployesInterface } from "../interfaces/Employe.interface";
import useAxiosPrivate from "../hooks/axiosPrivateInstance";

export const EmployeeContext = createContext<EmployeeContextType>({
  employes: [],
  GetEmployeContext: async () => [],
  GetEmployeByIdContext: async () => undefined,
  PostCreateEmployeContext: async () => {},
  PutUpdateEmployeContext: async () => {},
  DeleteEmployeContext: async () => {},
});

export const EmployeProvider: React.FC<ProviderProps> = ({ children }) => {
  const [employes, setEmployes] = useState<EmployesInterface[]>([]);

  const axiosPrivate = useAxiosPrivate();

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      GetEmployesService(axiosPrivate)
        .then((data) => {
          if (data !== null) {
            setEmployes(data);
          } else {
            console.error("Error al recuperar los empleados");
          }
        })
        .catch((error) => {
          console.error("Error al recuperar los empleados", error);
        });
    } else {
      setEmployes([]);
    }
  }, [isAuthenticated, axiosPrivate]);

  const GetEmployeContext = async (): Promise<EmployesInterface[] | null> => {
    try {
      const employes = await GetEmployesService(axiosPrivate);
      return employes;
    } catch (error) {
      console.error("Error al recuperar los empleados", error);
      return null;
    }
  };
  const GetEmployeByIdContext = async (
    id_employes: string
  ): Promise<EmployesInterface | undefined> => {
    try {
      const employe = await GetEmployeByIdService(id_employes, axiosPrivate);
      return employe;
    } catch (error) {
      console.error("Error al recuperar el empleado", error);
      return undefined;
    }
  };
  const PostCreateEmployeContext = async (
    employe: EmployesInterface
  ): Promise<EmployesInterface> => {
    try {
      const newEmploye = await PostCreateEmployeService(employe, axiosPrivate);
      setEmployes((prev) => [...prev, newEmploye]);
      return newEmploye;
    } catch (error) {
      console.error("Error al crear el empleado", error);
      throw error;
    }
  };
  const PutUpdateEmployeContext = async (
    id_employes: string,
    employe: EmployesInterface
  ): Promise<void> => {
    try {
      await PutUpdateEmployeService(id_employes, employe, axiosPrivate);
      setEmployes((prev) =>
        prev.map((emp) =>
          emp.id_employes === id_employes ? { ...emp, ...employe } : emp
        )
      );
    } catch (error) {
      console.error("Error al actualizar el empleado", error);
      throw error;
    }
  };
  const DeleteEmployeContext = async (id_employes: string): Promise<void> => {
    try {
      await DeleteEmployeService(id_employes, axiosPrivate);
      setEmployes((prev) => prev.filter((emp) => emp.id_employes !== id_employes));
    } catch (error) {
      console.error("Error al eliminar el empleado", error);
      throw error;
    }
  };
  return (
    <EmployeeContext.Provider
      value={{
        employes,
        GetEmployeContext,
        GetEmployeByIdContext,
        PostCreateEmployeContext,
        PutUpdateEmployeContext,
        DeleteEmployeContext,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
