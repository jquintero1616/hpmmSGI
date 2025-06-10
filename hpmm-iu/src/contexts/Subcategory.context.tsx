import React, { createContext, useEffect, useState} from 'react';
import {
    GetSubcategoriesService,
    GetSubcategoryByIdService,
    PostCreateSubcategoryService,
    PutUpdateSubcategoryService,
    DeleteSubcategoryService,
} from '../services/Subcategory.service';

import { SubcategoryContextType, ProviderProps } from '../interfaces/Context.interface';
import { useAuth } from '../hooks/use.Auth';
import useAxiosPrivate from "../hooks/axiosPrivateInstance";
import { SubcategoryInterface } from '../interfaces/subcategory.interface';


export const SubcategoryContext = createContext<SubcategoryContextType>({
    subcategory: [],
    GetSubcategoriesContext: async () => [],
    GetSubcategoryByIdContext: async () => undefined,
    PostCreateSubcategoryContext: async () => { },
    PutUpdateSubcategoryContext: async () => { },
    DeleteSubcategoryContext: async () => { },
});

export const SubcategoryProvider: React.FC<ProviderProps> = ({ children }) => {
    const [subcategory, setSubcategory] = useState<SubcategoryInterface[]>([]);
    const axiosPrivate = useAxiosPrivate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            GetSubcategoriesContext()
                .then((data) => {
                    if (data !== null) {
                        setSubcategory(data);
                    } else {
                        console.error("Error al recuperar las subcategorias");
                    }
                })
                .catch((error) => {
                    console.error('Error al recuperar las subcategorias', error);
                });
        }
    }, [isAuthenticated]);

    const GetSubcategoriesContext = async (): Promise<SubcategoryInterface[] | null> => {
        try {
            const subcategories = await GetSubcategoriesService(axiosPrivate);
            return subcategories;
        } catch (error) {
            console.error('Error al recuperar las subcategorias', error);
            return null;
        }
    };

    const GetSubcategoryByIdContext = async (id_subcategory: string): Promise<SubcategoryInterface | undefined> => {
        try {
            const subcategory = await GetSubcategoryByIdService(id_subcategory, axiosPrivate);
            return subcategory;
        } catch (error) {
            console.error('Error al recuperar la subcategoria por ID', error);
            return undefined;
        }
    };

    const PostCreateSubcategoryContext = async (subcategory: SubcategoryInterface): Promise<SubcategoryInterface> => {
        try {
            const newSubcategory = await PostCreateSubcategoryService(subcategory, axiosPrivate);
            setSubcategory(prev => [...prev, newSubcategory]);
            return newSubcategory;
        } catch (error) {
            console.error(`Error al crear la subcategoria ${subcategory.nombre}`, error);
            throw error;
        }
    };

    const PutUpdateSubcategoryContext = async (
        id_subcategory: string,
         subcategory: SubcategoryInterface
        ): Promise<void> => {
        try {
            await PutUpdateSubcategoryService(id_subcategory, subcategory, axiosPrivate);
            setSubcategory(prev => prev.map(
                item => item.id_subcategory === id_subcategory ? subcategory : item));
        } catch (error) {
            console.error(`Error al actualizar la subcategoria ${subcategory.nombre}`, error);
            throw error;
        }
    };

    const DeleteSubcategoryContext = async (id_subcategory: string): Promise<void> => {
        try {
            await DeleteSubcategoryService(id_subcategory, axiosPrivate);
            setSubcategory(prev => prev.filter(item => item.id_subcategory !== id_subcategory));
        } catch (error) {
            console.error(`Error al eliminar la subcategoria ${id_subcategory}`, error);
            throw error;
        }
    };

    return (
        <SubcategoryContext.Provider
            value={{
                subcategory,
                GetSubcategoriesContext,
                GetSubcategoryByIdContext,
                PostCreateSubcategoryContext,
                PutUpdateSubcategoryContext,
                DeleteSubcategoryContext,
            }}
        >
            {children}
        </SubcategoryContext.Provider>  
    );
};
