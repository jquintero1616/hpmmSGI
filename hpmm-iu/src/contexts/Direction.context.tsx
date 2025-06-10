import React, { createContext, useEffect, useState} from 'react';
import {
    GetDirectionService,
    GetDirectionByIdService,
    PostCreateDirectionService,
    PutUpdateDirectionService,
    DeleteDirectionService,
} from '../services/Direction.service';


import { DirectionContextType, ProviderProps } from '../interfaces/Context.interface';
import { useAuth } from '../hooks/use.Auth';    
import useAxiosPrivate from '../hooks/axiosPrivateInstance';
import { DirectionInterface } from '../interfaces/direction.interface';


export const DirectionContext = createContext<DirectionContextType>({
    directions: [],
    GetDirectionsContext: async () => [],
    GetDirectionByIdContext: async () => undefined,
    PostCreateDirectionContext: async () => { },
    PutUpdateDirectionContext: async () => { },
    DeleteDirectionContext: async () => { },
});

export const DirectionProvider: React.FC<ProviderProps> = ({ children }) => {
  const [directions, setDirections] = useState<DirectionInterface[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      GetDirectionsContext()
        .then((data) => {
          if (data !== null) {
            setDirections(data);
          } else {
            console.error("Error al recuperar las direcciones");
          }
        })
        .catch((error) => {
          console.error("Error al recuperar las direcciones", error);
        });
    }
  }, [isAuthenticated]);

  const GetDirectionsContext = async (): Promise<
    DirectionInterface[] | null
  > => {
    try {
      const directions = await GetDirectionService(axiosPrivate);
      return directions;
    } catch (error) {
      console.error("Error al recuperar las direcciones", error);
      return null;
    }
  };

  const GetDirectionByIdContext = async (
    id_direction: string
  ): Promise<DirectionInterface | undefined> => {
    try {
      const direction = await GetDirectionByIdService(
        axiosPrivate,
        id_direction
      );
      return direction;
    } catch (error) {
      console.error(
        `Error al recuperar la dirección con ID: ${id_direction}`,
        error
      );
      return undefined;
    }
  };

  const PostCreateDirectionContext = async (
    direction: DirectionInterface
  ): Promise<DirectionInterface | null> => {
    try {
      const newDirection = await PostCreateDirectionService(
        axiosPrivate,
        direction
      );
      setDirections((prev) => [...prev, newDirection]);
      return newDirection;
    } catch (error) {
      console.error(`Error al crear la dirección: ${direction.nombre}`, error);
      throw error;
    }
  };

  const PutUpdateDirectionContext = async (
    id_direction: string,
    direction: DirectionInterface
  ): Promise<void> => {
    try {
      await PutUpdateDirectionService(id_direction, direction, axiosPrivate);
      setDirections((prev) =>
        prev.map((dir) => (dir.id_direction === id_direction ? direction : dir))
      );
    } catch (error) {
      console.error(
        `Error al actualizar la dirección con ID: ${id_direction}`,
        error
      );
      throw error;
    }
  };

  const DeleteDirectionContext = async (
    id_direction: string
  ): Promise<void> => {
    try {
      await DeleteDirectionService(id_direction, axiosPrivate);
      setDirections((prev) =>
        prev.filter((dir) => dir.id_direction !== id_direction)
      );
    } catch (error) {
      console.error(
        `Error al eliminar la dirección con ID: ${id_direction}`,
        error
      );
      throw error;
    }
  };

  return (
    <DirectionContext.Provider
      value={{
        directions,
        GetDirectionsContext,
        GetDirectionByIdContext,
        PostCreateDirectionContext,
        PutUpdateDirectionContext,
        DeleteDirectionContext,
      }}
    >
      {children}
    </DirectionContext.Provider>
  );
}