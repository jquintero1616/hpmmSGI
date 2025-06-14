import React, { createContext, useEffect, useState } from 'react';
import {
    GetSolicitudesComprasService,
    GetSolicitudCompraByIdService,
    PostCreateSolicitudCompraService,
    PutUpdateSolicitudCompraService,
    DeleteSolicitudCompraService,
} from '../services/SolicitudCompras.service';

import { SolicitudComprasContextType, ProviderProps } from '../interfaces/Context.interface';
import { ScomprasInterface } from '../interfaces/SolicitudCompras.inteface';
import { useAuth } from '../hooks/use.Auth';
import useAxiosPrivate from "../hooks/axiosPrivateInstance";


export const SolicitudComprasContext = createContext<SolicitudComprasContextType>({
    scompras: [],   
    GetSolicitudesComprasContext: async () => [],
    GetSolicitudCompraByIdContext: async () => undefined,
    PostCreateSolicitudCompraContext: async () => { },
    PutUpdateSolicitudCompraContext: async () => { },   
    DeleteSolicitudCompraContext: async () => { },
});
export const SolicitudComprasProvider: React.FC<ProviderProps> = ({ children }) => {
    const [scompras, setScompras] = useState<ScomprasInterface[]>([]);
    const axiosPrivate = useAxiosPrivate();
    const { isAuthenticated } = useAuth();


    useEffect(() => {
        if (isAuthenticated) {
            GetSolicitudesComprasContext()
                .then((data) => {
                    if (data !== null) {
                        setScompras(data);
                    } else {
                        console.error("Error al recuperar las solicitudes de compras");
                    }
                })
                .catch((error) => {
                    console.error('Error al recuperar las solicitudes de compras', error);
                });
        }
    }, [isAuthenticated]);

    const GetSolicitudesComprasContext = async ():
     Promise<ScomprasInterface[] | null> => {
        try {
            const scompras = await GetSolicitudesComprasService(axiosPrivate);
            if (scompras !== null) {
                setScompras(scompras);
            }
            return scompras;
        } catch (error) {
            console.error('Error al recuperar las solicitudes de compras', error);
            return null;
        }
    };

    const GetSolicitudCompraByIdContext = async (
        id_scompra: string
    ): Promise<ScomprasInterface | undefined> => {
        try {
            const scompra = await GetSolicitudCompraByIdService(id_scompra, axiosPrivate);
            return scompra;
        } catch (error) {
            console.error('Error al recuperar la solicitud de compra', error);
            return undefined;
        }
    };

    const PostCreateSolicitudCompraContext = async (scompra: ScomprasInterface): Promise<ScomprasInterface> => {
        try {
            const newScompra = await PostCreateSolicitudCompraService(scompra, axiosPrivate);
            setScompras((prev) => [...prev, newScompra]);
            return newScompra;
        } catch (error) {
            console.error('Error al crear la solicitud de compra', error);
            throw error;
        }
    };

    const PutUpdateSolicitudCompraContext = async (
        id_scompra: string, 
        scompra: ScomprasInterface
    ): Promise<void> => {
        try {
            await PutUpdateSolicitudCompraService(id_scompra, scompra, axiosPrivate);
            setScompras((prev) => prev.map((item) => (item.id_scompra === id_scompra ? scompra : item)));
        } catch (error) {
            console.error('Error al actualizar la solicitud de compra', error);
            throw error;
        }
    };

    const DeleteSolicitudCompraContext = async (id_scompra: string): Promise<void> => {
        try {
            await DeleteSolicitudCompraService(id_scompra, axiosPrivate);
            setScompras((prev) => prev.filter((item) => item.id_scompra !== id_scompra));
        } catch (error) {
            console.error('Error al eliminar la solicitud de compra', error);
            throw error;
        }
    };  

    return(
        SolicitudComprasContext.Provider,
        {
            value: {
                scompras,
                GetSolicitudesComprasContext,
                GetSolicitudCompraByIdContext,
                PostCreateSolicitudCompraContext,
                PutUpdateSolicitudCompraContext,
                DeleteSolicitudCompraContext,
            }
        },
        children
    );
};