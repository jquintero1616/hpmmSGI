import React, { createContext, useState, useEffect } from "react";
import {
  GetDonantesService,
  GetDonantesActivosService,
  GetDonanteByIdService,
  SearchDonantesService,
  PostCreateDonanteService,
  PutUpdateDonanteService,
  DeleteDonanteService,
} from "../services/Donante.service";
import { ProviderProps } from "../interfaces/Context.interface";
import { useAuth } from "../hooks/use.Auth";
import { DonanteInterface } from "../interfaces/donante.interface";
import useAxiosPrivate from "../hooks/axiosPrivateInstance";

export interface DonanteContextType {
  donantes: DonanteInterface[];
  donantesActivos: DonanteInterface[];
  GetDonantesContext: () => Promise<DonanteInterface[] | null>;
  GetDonantesActivosContext: () => Promise<DonanteInterface[] | null>;
  GetDonanteByIdContext: (id_donante: string) => Promise<DonanteInterface | undefined>;
  SearchDonantesContext: (nombre: string) => Promise<DonanteInterface[] | null>;
  PostCreateDonanteContext: (donante: DonanteInterface) => Promise<void>;
  PutUpdateDonanteContext: (id_donante: string, donante: DonanteInterface) => Promise<void>;
  DeleteDonanteContext: (id_donante: string) => Promise<void>;
}

export const DonanteContext = createContext<DonanteContextType>({
  donantes: [],
  donantesActivos: [],
  GetDonantesContext: async () => [],
  GetDonantesActivosContext: async () => [],
  GetDonanteByIdContext: async () => undefined,
  SearchDonantesContext: async () => [],
  PostCreateDonanteContext: async () => {},
  PutUpdateDonanteContext: async () => {},
  DeleteDonanteContext: async () => {},
});

export const DonanteProvider: React.FC<ProviderProps> = ({ children }) => {
  const [donantes, setDonantes] = useState<DonanteInterface[]>([]);
  const [donantesActivos, setDonantesActivos] = useState<DonanteInterface[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      GetDonantesService(axiosPrivate)
        .then((data) => {
          if (data !== null) {
            setDonantes(data);
          } else {
            console.error("Error al recuperar los donantes");
          }
        })
        .catch((error) => {
          console.error("Error al recuperar los donantes", error);
        });

      // También cargar donantes activos para los selects
      GetDonantesActivosService(axiosPrivate)
        .then((data) => {
          if (data !== null) {
            setDonantesActivos(data);
          }
        })
        .catch((error) => {
          console.error("Error al recuperar donantes activos", error);
        });
    }
  }, [isAuthenticated]);

  const GetDonantesContext = async (): Promise<DonanteInterface[] | null> => {
    try {
      const donantes = await GetDonantesService(axiosPrivate);
      if (donantes !== null) {
        setDonantes(donantes);
      }
      return donantes;
    } catch (error) {
      console.error("Error al recuperar los donantes", error);
      return null;
    }
  };

  const GetDonantesActivosContext = async (): Promise<DonanteInterface[] | null> => {
    try {
      const activos = await GetDonantesActivosService(axiosPrivate);
      if (activos !== null) {
        setDonantesActivos(activos);
      }
      return activos;
    } catch (error) {
      console.error("Error al recuperar donantes activos", error);
      return null;
    }
  };

  const GetDonanteByIdContext = async (
    id_donante: string
  ): Promise<DonanteInterface | undefined> => {
    try {
      const donante = await GetDonanteByIdService(id_donante, axiosPrivate);
      return donante;
    } catch (error) {
      console.error("Error al recuperar el donante", error);
      return undefined;
    }
  };

  const SearchDonantesContext = async (
    nombre: string
  ): Promise<DonanteInterface[] | null> => {
    try {
      const resultados = await SearchDonantesService(nombre, axiosPrivate);
      return resultados;
    } catch (error) {
      console.error("Error al buscar donantes", error);
      return null;
    }
  };

  const PostCreateDonanteContext = async (
    donante: DonanteInterface
  ): Promise<void> => {
    try {
      const created = await PostCreateDonanteService(donante, axiosPrivate);
      setDonantes((prev) => [created, ...prev]);
      if (created.estado) {
        setDonantesActivos((prev) => [created, ...prev]);
      }
    } catch (error) {
      console.error("Error al crear el donante", error);
      throw error;
    }
  };

  const PutUpdateDonanteContext = async (
    id_donante: string,
    donante: DonanteInterface
  ): Promise<void> => {
    try {
      await PutUpdateDonanteService(id_donante, donante, axiosPrivate);
      setDonantes((prev) =>
        prev.map((d) =>
          d.id_donante === id_donante ? { ...d, ...donante } : d
        )
      );
      // Actualizar también la lista de activos
      if (donante.estado) {
        setDonantesActivos((prev) => {
          const exists = prev.some((d) => d.id_donante === id_donante);
          if (exists) {
            return prev.map((d) =>
              d.id_donante === id_donante ? { ...d, ...donante } : d
            );
          } else {
            return [{ ...donante, id_donante }, ...prev];
          }
        });
      } else {
        setDonantesActivos((prev) =>
          prev.filter((d) => d.id_donante !== id_donante)
        );
      }
    } catch (error) {
      console.error("Error al actualizar el donante", error);
      throw error;
    }
  };

  const DeleteDonanteContext = async (id_donante: string): Promise<void> => {
    try {
      await DeleteDonanteService(id_donante, axiosPrivate);
      // Soft delete: actualizar estado a false
      setDonantes((prev) =>
        prev.map((d) =>
          d.id_donante === id_donante ? { ...d, estado: false } : d
        )
      );
      setDonantesActivos((prev) =>
        prev.filter((d) => d.id_donante !== id_donante)
      );
    } catch (error) {
      console.error("Error al eliminar el donante", error);
      throw error;
    }
  };

  return (
    <DonanteContext.Provider
      value={{
        donantes,
        donantesActivos,
        GetDonantesContext,
        GetDonantesActivosContext,
        GetDonanteByIdContext,
        SearchDonantesContext,
        PostCreateDonanteContext,
        PutUpdateDonanteContext,
        DeleteDonanteContext,
      }}
    >
      {children}
    </DonanteContext.Provider>
  );
};
