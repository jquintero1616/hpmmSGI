import React, { createContext, useEffect, useState } from 'react';
import {
    GetCategoriesService,
    GetCategoryByIdService,
    PostCreateCategoryService,
    PutUpdateCategoryService,
    DeleteCategoryService,
} from '../services/Category.service';

import { CategoryContextType, ProviderProps } from '../interfaces/Context.interface';
import { CategoryInterface } from '../interfaces/Category.interface';
import { useAuth } from '../hooks/use.Auth';
import useAxiosPrivate from "../hooks/axiosPrivateInstance";

export const CategoryContext = createContext<CategoryContextType>({
    category: [],
    GetCategoriesContext: async () => [],
    GetCategoryByIdContext: async () => undefined,
    PostCreateCategoryContext: async () => { },
    PutUpdateCategoryContext: async () => { },
    DeleteCategoryContext: async () => { },
});

export const CategoryProvider: React.FC<ProviderProps> = ({ children }) => {
    const [category, setCategory] = useState<CategoryInterface[]>([]);
    const axiosPrivate = useAxiosPrivate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            GetCategoriesContext()
                .then((data) => {
                    if (data !== null) {
                        setCategory(data);
                    } else {
                        console.error("Error al recuperar las categorias");
                    }
                })
                .catch((error) => {
                    console.error('Error al recuperar las categorias', error);
                });
        }
    }, [isAuthenticated]);

    const GetCategoriesContext = async (): Promise<CategoryInterface[] | null> => {
        try {
            const categories = await GetCategoriesService(axiosPrivate);
            return categories;
        } catch (error) {
            console.error('Error al recuperar las categorias', error);
            return null;
        }
    };

    const GetCategoryByIdContext = async (id_category: string): Promise<CategoryInterface | undefined> => {
        try {
            const category = await GetCategoryByIdService(id_category, axiosPrivate);
            return category;
        } catch (error) {
            console.error('Error al recuperar la categoria por ID', error);
            return undefined;
        }
    };

    const PostCreateCategoryContext = async (
        category: CategoryInterface
    ): Promise<CategoryInterface> => {
        try {
            const newCategory = await PostCreateCategoryService(category, axiosPrivate);
            setCategory((prev) => [...prev, newCategory]);
            return newCategory;
        } catch (error) {
            console.error('Error al crear la categoria', error);
            throw error;
        }
    };

    const PutUpdateCategoryContext = async (id_category: string, category: CategoryInterface): Promise<void> => {
        try {
            await PutUpdateCategoryService(id_category, category, axiosPrivate);
            setCategory((prev) =>
                prev.map((item) => (item.id_category === id_category ? { ...item, ...category } : item))
            );
        } catch (error) {
            console.error('Error al actualizar la categoria', error);
            throw error;
        }
    };

    const DeleteCategoryContext = async (id_category: string): Promise<void> => {
        try {
            await DeleteCategoryService(id_category, axiosPrivate);
            setCategory((prev) => prev.filter((item) => item.id_category !== id_category));
        } catch (error) {
            console.error('Error al eliminar la categoria', error);
            throw error;
        }
    };

    return (
        <CategoryContext.Provider
            value={{
                category,
                GetCategoriesContext,
                GetCategoryByIdContext,
                PostCreateCategoryContext,
                PutUpdateCategoryContext,
                DeleteCategoryContext
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
};
