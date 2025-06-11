import React, { createContext, useEffect, useState } from 'react';
import {
    GetShoppingService,
    GetShoppingByIdService,
    PostShoppingService,
    PutShoppingService,
    DeleteShoppingService,

} from '../services/Shopping.service';

import { ShoppingContextType, ProviderProps } from '../interfaces/Context.interface';
import { useAuth } from '../hooks/use.Auth';    
import useAxiosPrivate from "../hooks/axiosPrivateInstance";
import { ShoppingInterface } from '../interfaces/shopping.interface';


export const ShoppingContext = createContext<ShoppingContextType>({
    shopping: [],
    GetShoppingContext: async () => [],
    GetShoppingByIdContext: async () => undefined,
    PostShoppingContext: async () => { },
    PutShoppingContext: async () => { },
    DeleteShoppingContext: async () => { },
});


export const ShoppingProvider: React.FC<ProviderProps> = ({ children }) => {
    const [shopping, setShopping] = useState<ShoppingInterface[]>([]);
    const axiosPrivate = useAxiosPrivate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            GetShoppingContext()
                .then((data) => {
                    if (data !== null) {
                        setShopping(data);
                    } else {
                        console.error("Error al recuperar las compras");
                    }
                })
                .catch((error) => {
                    console.error('Error al recuperar las compras', error);
                });
        }
    }, [isAuthenticated]);

   const GetShoppingContext = async (): Promise<ShoppingInterface[] | null> => {
        try {
            const shoppingData = await GetShoppingService(axiosPrivate);
            return shoppingData;
        } catch (error) {
            console.error('Error al recuperar las compras', error);
            return null;
        }
    };

    const GetShoppingByIdContext = async (id_shopping: string): Promise<ShoppingInterface | undefined> => {
        try {
            const shoppingItem = await GetShoppingByIdService(id_shopping, axiosPrivate);
            return shoppingItem;
        } catch (error) {
            console.error(`Error al recuperar la compra con ID ${id_shopping}:`, error);
            return undefined;
        }
    };

    const PostShoppingContext = async (shopping: ShoppingInterface): Promise<ShoppingInterface> => {
        try {
            const newShopping = await PostShoppingService(shopping, axiosPrivate);
            setShopping((prev) => [...prev, newShopping]);
            return newShopping;
        } catch (error) {
            console.error('Error al crear la compra', error);
            throw error;
        }
    };

    const PutShoppingContext = async (id_shopping: string, shopping: ShoppingInterface): Promise<void> => {
        try {
            await PutShoppingService(id_shopping, shopping, axiosPrivate);
            setShopping((prev) =>
                prev.map((item) => (item.id_shopping === id_shopping ? shopping : item))
            );
        } catch (error) {
            console.error(`Error al actualizar la compra con ID ${id_shopping}`, error);
            throw error;
        }
    };

    const DeleteShoppingContext = async (id_shopping: string): Promise<void> => {
        try {
            await DeleteShoppingService(id_shopping, axiosPrivate);
            setShopping((prev) => prev.filter((item) => item.id_shopping !== id_shopping));
        } catch (error) {
            console.error(`Error al eliminar la compra con ID ${id_shopping}`, error);
            throw error;
        }
    };

    return (
        <ShoppingContext.Provider
            value={{
                shopping,
                GetShoppingContext,
                GetShoppingByIdContext,
                PostShoppingContext,
                PutShoppingContext,
                DeleteShoppingContext,
            }}
        >
            {children}
        </ShoppingContext.Provider>
    );
}

