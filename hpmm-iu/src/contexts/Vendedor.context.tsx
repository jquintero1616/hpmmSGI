import React, { createContext, useEffect, useState } from 'react';	
import {
    GetVendedoresService,
    GetVendedorByIdService,
    PostCreateVendedorService,
    PutUpdateVendedorService,
    DeleteVendedorService,
} from '../services/Vendedor.service';

import { VendedorContextType, ProviderProps } from '../interfaces/Context.interface';

import useAxiosPrivate from "../hooks/axiosPrivateInstance";
import { useAuth } from '../hooks/use.Auth';
import { vendedorInterface } from '../interfaces/vendedor.interface';




export const VendedorContext = createContext<VendedorContextType>({
    vendedor: [],
    GetVendedorContext: async () => [],
    GetVendedorByIdContext: async () => undefined,
    PostCreateVendedorContext: async () => { },
    PutUpdateVendedorContext: async () => { },
    DeleteVendedorContext: async () => { },
});

export const VendedorProvider: React.FC<ProviderProps> = ({ children }) => {
    const [vendedor, setVendedor] = useState<vendedorInterface[]>([]);
    const axiosPrivate = useAxiosPrivate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            GetVendedorContext()
                .then((data) => {
                    if (data !== null) {
                        setVendedor(data);
                    } else {
                        console.error("Error al recuperar los vendedores");
                    }
                })
                .catch((error) => {
                    console.error('Error al recuperar los vendedores', error);
                });
        }
    }, [isAuthenticated]);

    const GetVendedorContext = async (): Promise<vendedorInterface[] | null> => {
        try {
            const vendedores = await GetVendedoresService(axiosPrivate);
            return vendedores;
        } catch (error) {
            console.error('Error al recuperar los vendedores', error);
            return null;
        }
    };
    const GetVendedorByIdContext = async (id_vendedor: string): Promise<vendedorInterface | undefined> => {
        try {
            const vendedor = await GetVendedorByIdService(id_vendedor, axiosPrivate);
            return vendedor;
        } catch (error) {
            console.error('Error al recuperar el vendedor por ID', error);
            return undefined;
        }
    };

    const PostCreateVendedorContext = async (vendedor: vendedorInterface): Promise<vendedorInterface> => {
        try {
            const newVendedor = await PostCreateVendedorService(vendedor, axiosPrivate);
            setVendedor((prev) => [...prev, newVendedor]);
            return newVendedor;
        } catch (error) {
            console.error('Error al crear el vendedor', error);
            throw error; // Propagar el error para manejarlo en el componente
        }
    };

    const PutUpdateVendedorContext = async (
        id_vendedor: string,
        vendedor: vendedorInterface
    ): Promise<void> => {
        try {
            await PutUpdateVendedorService(id_vendedor, vendedor, axiosPrivate);
            setVendedor((prev) => prev.map 
            (v => v.id_vendedor === id_vendedor ? { ...v, ...vendedor } : v));

        } catch (error) {
            console.error('Error al actualizar el vendedor', error);
            throw error; // Propagar el error para manejarlo en el componente
        }
    };
    const DeleteVendedorContext = async (id_vendedor: string): Promise<void> => {
        try {
            await DeleteVendedorService(id_vendedor, axiosPrivate);
            setVendedor((prev) => prev.filter((v) => v.id_vendedor !== id_vendedor));
        } catch (error) {
            console.error('Error al eliminar el vendedor', error);
            throw error; // Propagar el error para manejarlo en el componente
        }
    };

    return (
        <VendedorContext.Provider
            value={{
                vendedor,
                GetVendedorContext,
                GetVendedorByIdContext,
                PostCreateVendedorContext,
                PutUpdateVendedorContext,
                DeleteVendedorContext,
            }}
        >
            {children}
        </VendedorContext.Provider>
    );  
}