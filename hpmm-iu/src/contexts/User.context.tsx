import React, { createContext, useState, useEffect } from "react";

import {
  GetUsersService,
  GetUserByIdService,
  PostCreateUserService,
  PutUpdateUser,
  DeleteUserService,
} from "../services/User.service";

import {
  UserContextType,
  ProviderProps,
} from "../interfaces/Context.interface";
import { useAuth } from "../hooks/use.Auth";
import { userInterface } from "../interfaces/user.interface";
import useAxiosPrivate from "../hooks/axiosPrivateInstance";

export const UserContext = createContext<UserContextType>({
  users: [],
  GetUsersContext: async () => [],
  GetUserByIdContext: async () => undefined,
  PostCreateUserContext: async () => {},
  PutUpdateUserContext: async () => {},
  DeleteUserContext: async () => {},
});

export const UserProvider: React.FC<ProviderProps> = ({ children }) => {
  const [users, SetUser] = useState<userInterface[]>([]);
  const { isAuthenticated } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    if (isAuthenticated) {
      GetUsersService(axiosPrivate)
        .then((data) => {
          if (data !== null) {
            SetUser(data);
          } else {
            console.error("Error al recuperar los usuarios");
          }
        })
        .catch((error) => {
          console.error("Error al recuperar los usuarios", error);
        });
    }
  }, [isAuthenticated]);

  const GetUserByIdContext = async (
    id_user: string
  ): Promise<userInterface | undefined> => {
    try {
      const users = await GetUserByIdService(id_user, axiosPrivate);
      return users;
    } catch (error) {
      console.error("Error al recuperar el usuario", error);
      return undefined;
    }
  };

  const GetUsersContext = async (): Promise<userInterface[] | null> => {
    try {
      const users = await GetUsersService(axiosPrivate);
      if (users !== null) {
        SetUser(users);
      }
      return users;
    } catch (error) {
      console.error("Error al recuperar los usuarios", error);
      return null;
    }
  };


  const PostCreateUserContext = async (user: userInterface): Promise<void> => {
    try {
      const created = await PostCreateUserService(user, axiosPrivate);
      SetUser((prev) => [created, ...prev]); 
    } catch (error) {
      console.error("Error al crear el usuario", error);
      throw error;
    }
  };

  const PutUpdateUserContext = async (
    id_user: string,
    user: userInterface
  ): Promise<void> => {
    try {
      await PutUpdateUser(id_user, user, axiosPrivate);
      SetUser((prev) =>
        prev.map((u) => (u.id_user === id_user ? { ...u, ...user } : u))
      );
    } catch (error) {
      console.error("Error al actualizar el usuario", error);
      throw error; // Re-lanzamos el error para que pueda ser manejado por el componente que llama a esta función
    }
  };

  const DeleteUserContext = async (id_user: string): Promise<void> => {
    try {
      await DeleteUserService(id_user, axiosPrivate);
      SetUser((prev) => prev.filter((u) => u.id_user !== id_user));
    } catch (error) {
      console.error("Error al eliminar el usuario", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        GetUserByIdContext,
        GetUsersContext,
        PostCreateUserContext,
        PutUpdateUserContext,
        DeleteUserContext,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
