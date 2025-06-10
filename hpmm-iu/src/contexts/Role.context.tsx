import React, { createContext, useEffect, useState } from "react";
import {
  GetRolesService,
  GetRoleByIdService,
  PostCreateRoleService,
  PutUpdateRoleService,
  DeleteRoleService,
} from "../services/Role.service";
import {
  RoleContextType,
  ProviderProps,
} from "../interfaces/Context.interface";

import { useAuth } from "../hooks/use.Auth";
import { RolesInterface } from "../interfaces/role.interface";
import useAxiosPrivate from "../hooks/axiosPrivateInstance";

export const RoleContext = createContext<RoleContextType>({
  roles: [],
  GetRolesContext: async () => [],
  GetRoleByIdContext: async () => undefined,
  PostCreateRoleContext: async () => {},
  PutUpdateRoleContext: async () => {},
  DeleteRoleContext: async () => {},
});

export const RoleProvider: React.FC<ProviderProps> = ({ children }) => {
  const [roles, setRoles] = useState<RolesInterface[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      GetRolesService(axiosPrivate)
        .then((data) => {
          if (data !== null) {
            setRoles(data);
          } else {
            console.error("Error al recuperar los roles");
          }
        })
        .catch((error) => {
          console.error("Error al recuperar los roles", error);
        });
    }
  }, [isAuthenticated]);

  const GetRolesContext = async (): Promise<RolesInterface[] | null> => {
    try {
      const roles = await GetRolesService(axiosPrivate);
      return roles;
    } catch (error) {
      console.error("Error al recuperar los roles", error);
      return null;
    }
  };

  const GetRoleByIdContext = async (
    id_rol: string
  ): Promise<RolesInterface | undefined> => {
    try {
      const role = await GetRoleByIdService(id_rol, axiosPrivate);
      return role;
    } catch (error) {
      console.error("Error al recuperar el rol", error);
      return undefined;
    }
  };

  const PostCreateRoleContext = async (role: RolesInterface): Promise<void> => {
    try {
      await PostCreateRoleService(role, axiosPrivate);
      setRoles((prevRoles) => [...prevRoles, role]);
    } catch (error) {
      console.error("Error al crear el rol", error);
    }
  };

  const PutUpdateRoleContext = async (
    id_rol: string,
    role: RolesInterface
  ): Promise<void> => {
    try {
      await PutUpdateRoleService(id_rol, role, axiosPrivate);
      setRoles((prevRoles) =>
        prevRoles.map((r) => (r.id_rol === id_rol ? { ...r, ...role } : r))
      );
    } catch (error) {
      console.error("Error al actualizar el rol", error);
    }
  };

  const DeleteRoleContext = async (id_rol: string): Promise<void> => {
    try {
      await DeleteRoleService(id_rol, axiosPrivate);
      setRoles((prevRoles) => prevRoles.filter((r) => r.id_rol !== id_rol));
    } catch (error) {
      console.error("Error al eliminar el rol", error);
    }
  };

  return (
    <RoleContext.Provider
      value={{
        roles,
        GetRolesContext,
        GetRoleByIdContext,
        PostCreateRoleContext,
        PutUpdateRoleContext,
        DeleteRoleContext,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};
