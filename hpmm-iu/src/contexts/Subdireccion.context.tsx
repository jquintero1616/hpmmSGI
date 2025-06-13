import React, { createContext, useEffect, useState} from 'react';

import {
    GetSubdireccionesService,
    GetSubdireccionByIdService,
    PostCreateSubdireccionService,
    PutUpdateSubdireccionService,
    DeleteSubdireccionService,
} from '../services/Subdireccion.service';

import { SubdireccionContextType, ProviderProps } from '../interfaces/Context.interface';
import { SubdireccionInterface } from '../interfaces/subdireccion.interface';
import { useAuth } from '../hooks/use.Auth';
import useAxiosPrivate from "../hooks/axiosPrivateInstance";

export const SubdireccionContext = createContext<SubdireccionContextType>({
    subdireccion: [],
    GetSubdireccionesContext: async () => [],
    GetSubdireccionByIdContext: async () => undefined,
    PostCreateSubdireccionContext: async () => { },
    PutUpdateSubdireccionContext: async () => { },
    DeleteSubdireccionContext: async () => { },
});
export const SubdireccionProvider: React.FC<ProviderProps> = ({ children }) => {
    const [subdireccion, setSubdireccion] = useState<SubdireccionInterface[]>([]);
    const axiosPrivate = useAxiosPrivate();
    const { isAuthenticated } = useAuth();


    useEffect(() => {
        if (isAuthenticated) {
            GetSubdireccionesContext()
                .then((data) => {
                    if (data !== null) {
                        setSubdireccion(data);
                    } else {
                        console.error("Error al recuperar las subdirecciones");
                    }
                })
                .catch((error) => {
                    console.error('Error al recuperar las subdirecciones', error);
                });
        }
    }, [isAuthenticated]);

    const GetSubdireccionesContext = async (): Promise<
      SubdireccionInterface[] | null
    > => {
      try {
        const subdirecciones = await GetSubdireccionesService(axiosPrivate);
        if (subdirecciones !== null) {
          setSubdireccion(subdirecciones);
        }
        return subdirecciones;
      } catch (error) {
        console.error("Error al recuperar las subdirecciones", error);
        return null;
      }
    };

    const GetSubdireccionByIdContext = async (id_subdireccion: string): Promise<SubdireccionInterface | undefined> => {
        try {
            const subdireccion = await GetSubdireccionByIdService(id_subdireccion, axiosPrivate);
            return subdireccion;
        } catch (error) {
            console.error('Error al recuperar la subdirección', error);
            return undefined;
        }
    };
    const PostCreateSubdireccionContext = async (subdireccion: SubdireccionInterface): Promise<SubdireccionInterface> => {
       try {

       const newSubdireccion = await PostCreateSubdireccionService(subdireccion, axiosPrivate);
       setSubdireccion(prev => [...prev, newSubdireccion]);
       return newSubdireccion;
       } catch (error) {
           console.error('Error al crear la subdirección', error);
           throw error;
       }
    }

    const PutUpdateSubdireccionContext = async (
        id_subdireccion: string,
        subdireccion: SubdireccionInterface
    ): Promise<void> => {
        try {
            await PutUpdateSubdireccionService(id_subdireccion, subdireccion, axiosPrivate);
            setSubdireccion(prev => prev.map(
                item => item.id_subdireccion === id_subdireccion ? subdireccion : item
            ));
        } catch (error) {
            console.error('Error al actualizar la subdirección', error);
            throw error;
        }
    };

   
    const DeleteSubdireccionContext = async (id_subdireccion: string): Promise<void> => {
        try {
            await DeleteSubdireccionService(id_subdireccion, axiosPrivate);
            setSubdireccion((prev) => prev.filter((subdir) => subdir.id_subdireccion !== id_subdireccion));
        } catch (error) {
            console.error('Error al eliminar la subdirección', error);
            throw error;
        }
    };

    return (
        <SubdireccionContext.Provider
            value={{
                subdireccion,
                GetSubdireccionesContext,
                GetSubdireccionByIdContext,
                PostCreateSubdireccionContext,
                PutUpdateSubdireccionContext,
                DeleteSubdireccionContext,
            }}
        >
            {children}
        </SubdireccionContext.Provider>
    );
}