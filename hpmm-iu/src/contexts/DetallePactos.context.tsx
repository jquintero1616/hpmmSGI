import React, { createContext, useEffect, useState} from 'react';
import { 
    GetDetallePactosService,
    GetDetallePactosByIdService,
    PostCreateDetallePactosService,
    PutUpdateDetallePactosService,
    DeleteDetallePactosService,
} from '../services/DetallePactos.service';

import { DetallePactosContextType, ProviderProps } from '../interfaces/Context.interface';
import { useAuth } from '../hooks/use.Auth';
import useAxiosPrivate from "../hooks/axiosPrivateInstance";
import { DetallePactInterface } from '../interfaces/DetallePactos.intefaces';

export const DetallePactosContext = createContext<DetallePactosContextType>({
    detallePactos: [],
    GetDetallePactosContext: async () => [],
    GetDetallePactosByIdContext: async () => undefined,
    PostCreateDetallePactosContext: async () => { },
    PutUpdateDetallePactosContext: async () => { },
    DeleteDetallePactosContext: async () => { },
});
export const DetallePactosProvider: React.FC<ProviderProps> = ({ children }) => {
    const [detallePactos, setDetallePactos] = useState<DetallePactInterface[]>([]);
    const axiosPrivate = useAxiosPrivate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            GetDetallePactosContext()
                .then((data) => {
                    if (data !== null) {
                        setDetallePactos(data);
                    } else {
                        console.error("Error al recuperar los detalles de pactos");
                    }
                })
                .catch((error) => {
                    console.error('Error al recuperar los detalles de pactos', error);
                });
        }
    }, [isAuthenticated]);

    const GetDetallePactosContext = async (): Promise<DetallePactInterface[] | null> => {
        try {
            const detallePactos = await GetDetallePactosService(axiosPrivate);
            if (detallePactos !== null) {
                setDetallePactos(detallePactos);
                
            }
            return detallePactos;
        } catch (error) {
            console.error('Error al recuperar los detalles de pactos', error);
            return null;
        }
    };

    const GetDetallePactosByIdContext = async (
        id_units_x_pacts: string
    ): Promise<DetallePactInterface | undefined> => {
        try {
            const detallePacto = await GetDetallePactosByIdService(axiosPrivate, id_units_x_pacts);
            return detallePacto;
        } catch (error) {
            console.error('Error al recuperar el detalle de pacto', error);
            return undefined;
        }
    };

    const PostCreateDetallePactosContext = async (
        detallePacto: DetallePactInterface
    ): Promise<void> => {
        try {
            await PostCreateDetallePactosService(detallePacto, axiosPrivate);
            setDetallePactos((prev) => [...prev, detallePacto]);
        } catch (error) {
            console.error('Error al crear el detalle de pacto', error);
        }
    };
    const PutUpdateDetallePactosContext = async (
        id_units_x_pacts: string,
         detallePacto: DetallePactInterface
        ): Promise<void> => {
        try {
            await PutUpdateDetallePactosService(id_units_x_pacts, detallePacto, axiosPrivate);
            setDetallePactos((prev) =>
                prev.map((item) => (item.id_units_x_pacts === id_units_x_pacts ? {...item, ...detallePacto} : item))
            );
        } catch (error) {
            console.error('Error al actualizar el detalle de pacto', error);
        }
    };

   const DeleteDetallePactosContext = async (
    id_units_x_pacts: string
): Promise<void> => {
       try {
           await DeleteDetallePactosService(id_units_x_pacts, axiosPrivate);
           setDetallePactos((prev) => prev.filter((item) => item.id_units_x_pacts !== id_units_x_pacts));
       } catch (error) {
           console.error('Error al eliminar el detalle de pacto', error);
       }
   };
    return (
        <DetallePactosContext.Provider
            value={{
                detallePactos,
                GetDetallePactosContext,
                GetDetallePactosByIdContext,
                PostCreateDetallePactosContext,
                PutUpdateDetallePactosContext,
                DeleteDetallePactosContext,
            }}
        >
            {children}
        </DetallePactosContext.Provider>
    );
};
