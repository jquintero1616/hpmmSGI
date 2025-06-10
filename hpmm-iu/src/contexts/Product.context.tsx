import React, { createContext, useState, useEffect } from "react";
import {
    GetProductsService,
    GetProductByIdService,
    PostCreateProductService,
    PutUpdateProductService,
    DeleteProductService,
    GetProductDetailService
} from '../services/Product.service';

import { 
    ProductContextType, 
    ProviderProps 
} from '../interfaces/Context.interface';


import { useAuth } from '../hooks/use.Auth';
import useAxiosPrivate from "../hooks/axiosPrivateInstance";
import { ProductDetail, ProductInterface } from "../interfaces/product.interface";


export const ProductContext = createContext<ProductContextType>({
    products: [],
    ProductDetail: [],
    GetProductDetailContext: async () => [],
    GetProductsContext: async () => [],
    GetProductByIdContext: async () => undefined,
    PostCreateProductContext: async () => {},
    PutUpdateProductContext: async () => {},
    DeleteProductContext: async () => {},
}); 

export const ProductProvider: React.FC<ProviderProps> = ({ children }) => {
    const [products, SetProducts] = useState<ProductInterface[]>([]);
    const [ProductDetail, SetProductDetail] = useState<ProductDetail[]>([]);

    const axiosPrivate = useAxiosPrivate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            GetProductsService(axiosPrivate)
                .then((data) => {
                    if (data !== null) {
                        SetProducts(data);
                    } else {
                        console.error("Error al recuperar los productos");
                    }
                })
                .catch((error) => {
                    console.error("Error al recuperar los productos", error);
                });
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            GetProductDetailContext()
                .then((data) => {
                    if (data !== null) {
                        SetProductDetail(data);
                    } else {
                        console.error("Error al recuperar los detalles del producto");
                    }
                })
                .catch((error) => {
                    console.error("Error al recuperar los detalles del producto", error);
                });
        }
    }, [isAuthenticated]);

    const GetProductsContext = async (): Promise<ProductInterface[] | null> => {
        try {
            const products = await GetProductsService(axiosPrivate);
            return products;
        } catch (error) {
            console.error("Error al recuperar los productos", error);
            return null;
        }
    };

    const GetProductByIdContext = async (id_product: string): Promise<ProductInterface | undefined> => {
        try {
            const product = await GetProductByIdService(id_product, axiosPrivate);
            return product;
        } catch (error) {
            console.error("Error al recuperar el producto", error);
            return undefined;
        }
    };

    const GetProductDetailContext = async (): Promise<ProductDetail[] | null> => {
        try {
            const productData = await GetProductDetailService(axiosPrivate);
            return productData;

        } catch (error) {
            console.error("Error al recuperar los detalles del producto", error);
            return null;
        }
    };



    const PostCreateProductContext = async (product: ProductInterface): Promise<void> => {
        try {
          const created = await PostCreateProductService(product, axiosPrivate);
          SetProducts((prevProducts) => [...prevProducts, created]);
        } catch (error) {
            console.error("Error al crear el producto", error);
            throw error;
        }
    };  
    const PutUpdateProductContext = async (id_product: string, product: ProductInterface): Promise<void> => {
        try {
            await PutUpdateProductService(id_product, product, axiosPrivate);
            SetProducts((prevProducts) =>
                prevProducts.map((p) => (p.id_product === id_product ? { ...p, ...product } : p))
            );
        } catch (error) {
            console.error("Error al actualizar el producto", error);
            throw error;
        }
    };

    const DeleteProductContext = async (id_product: string): Promise<void> => {
        try {
            await DeleteProductService(id_product, axiosPrivate);
        } catch (error) {
            console.error("Error al eliminar el producto", error);
            throw error;
        }
    };
    return (
        <ProductContext.Provider
            value={{
                products,
                ProductDetail,
                GetProductDetailContext,
                GetProductsContext,
                GetProductByIdContext,
                PostCreateProductContext,
                PutUpdateProductContext,
                DeleteProductContext,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

