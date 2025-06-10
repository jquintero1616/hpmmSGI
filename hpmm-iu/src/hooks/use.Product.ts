import { useContext } from "react";
import { ProductContext } from "../contexts/Product.context";

export const useProducts = () => {
    const {
        products,
        ProductDetail,
        GetProductsContext,
        GetProductByIdContext,
        PostCreateProductContext,
        PutUpdateProductContext,
        DeleteProductContext,
    } = useContext(ProductContext);

    if (
        !products ||
        !ProductDetail ||
        !GetProductsContext ||
        !GetProductByIdContext ||
        !PostCreateProductContext ||
        !PutUpdateProductContext ||
        !DeleteProductContext
    ) {
        throw new Error("useProducts debe ser utilizado dentro de un ProductProvider");
    }

    return {
        products,
        ProductDetail,
        GetProductsContext,
        GetProductByIdContext,
        PostCreateProductContext,
        PutUpdateProductContext,
        DeleteProductContext,
    };
}