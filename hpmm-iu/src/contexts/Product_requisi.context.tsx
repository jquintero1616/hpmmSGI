import React, { createContext, useEffect, useState} from 'react';
import {

    GetRequiProductService,
    GetRequiProductByIdService,
    PostRequiProductService,
    PutRequiProductService,
    DeleteRequiProductService
} from '../services/Product_Requisi.service';

import { ProductRequisiContextType, ProviderProps } from '../interfaces/Context.interface';
import { useAuth } from '../hooks/use.Auth';
import useAxiosPrivate from "../hooks/axiosPrivateInstance";
import { Requi_x_ProductInterface } from '../interfaces/Product_Requisi_interface';

export const ProductRequisitionContext = createContext<ProductRequisiContextType>({
    productRequisition: [],
    GetRequiProductContext: async () => [],
    GetRequiProductByIdContext: async () => undefined,
    PostCreateProductRequisitionContext: async () => { },
    PutUpdateProductRequisitionContext: async () => { },
    DeleteProductRequisitionContext: async () => { },
});


export const ProductRequisitionProvider: React.FC<ProviderProps> = ({ children }) => {
    const [productRequisition, setProductRequisition] = useState<Requi_x_ProductInterface[]>([]);
    const axiosPrivate = useAxiosPrivate();
    const { isAuthenticated } = useAuth();
    useEffect(() => {
        if (isAuthenticated) {
            GetRequiProductContext()
                .then((data) => {
                    if (data !== null) {
                        setProductRequisition(data);
                    } else {
                        console.error("Error al recuperar los productos de requisición");
                    }
                })
                .catch((error) => {
                    console.error('Error al recuperar los productos de requisición', error);
                });
        }
    }, [isAuthenticated]);

const  GetRequiProductContext = async (): Promise<Requi_x_ProductInterface[] | null> => {
        try {
            const requiProducts = await GetRequiProductService(axiosPrivate);
            return requiProducts;
        } catch (error) {
            console.error('Error al recuperar los productos de requisición', error);
            return null;
        }
    }
const  GetRequiProductByIdContext = async (id_requisi_x_product: string): Promise<Requi_x_ProductInterface | undefined> => {
        try {
            const requiProduct = await GetRequiProductByIdService(id_requisi_x_product, axiosPrivate);
            return requiProduct;
        } catch (error) {
            console.error(`Error al recuperar el producto de requisición con ID: ${id_requisi_x_product}`, error);
            return undefined;
        }
    }
const PostCreateProductRequisitionContext = async (requiProduct: Requi_x_ProductInterface): Promise<Requi_x_ProductInterface> => {
       console.log('PostCreateProductRequisitionContext', requiProduct);
        try {
            const newRequiProduct = await PostRequiProductService(requiProduct, axiosPrivate);
            setProductRequisition(prev => [...prev, newRequiProduct]);
            return newRequiProduct;
        } catch (error) {
            console.error('Error al crear el producto de requisición', error);
            throw error;
        }
    }

    const PutUpdateProductRequisitionContext = async (id_requisi_x_product: string, requiProduct: Requi_x_ProductInterface): Promise<void> => {
        try {
            await PutRequiProductService(id_requisi_x_product, requiProduct, axiosPrivate);
            setProductRequisition(prev => prev.map(item => item.id_requisi_x_product === id_requisi_x_product ? requiProduct : item));
        } catch (error) {
            console.error(`Error al actualizar el producto de requisición con ID: ${id_requisi_x_product}`, error);
            throw error;
        }
    }
    const DeleteProductRequisitionContext = async (id_requisi_x_product: string): Promise<void> => {
        try {
            await DeleteRequiProductService(id_requisi_x_product, axiosPrivate);
            setProductRequisition(prev => prev.filter(item => item.id_requisi_x_product !== id_requisi_x_product));
        } catch (error) {
            console.error(`Error al eliminar el producto de requisición con ID: ${id_requisi_x_product}`, error);
            throw error;
        }
    }   
return (
        <ProductRequisitionContext.Provider
            value={{
                productRequisition,
                GetRequiProductContext,
                GetRequiProductByIdContext,
                PostCreateProductRequisitionContext,
                PutUpdateProductRequisitionContext,
                DeleteProductRequisitionContext
            }}
        >
            {children}
        </ProductRequisitionContext.Provider>
    );
}