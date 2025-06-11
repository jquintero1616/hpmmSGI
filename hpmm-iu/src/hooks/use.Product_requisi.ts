import { useContext } from "react";
import { ProductRequisitionContext } from "../contexts/Product_requisi.context";

export const useProductRequisi = () => {
    const {
        productRequisition,
        GetRequiProductContext,
        GetRequiProductByIdContext,
        PostCreateProductRequisitionContext,
        PutUpdateProductRequisitionContext,
        DeleteProductRequisitionContext
    } = useContext(ProductRequisitionContext);

    if (
        !productRequisition ||
        !GetRequiProductContext ||
        !GetRequiProductByIdContext ||
        !PostCreateProductRequisitionContext ||
        !PutUpdateProductRequisitionContext ||
        !DeleteProductRequisitionContext
    ) {
        throw new Error(`useProductRequisi must be used within a ProductRequisitionProvider ${productRequisition}`);
    }
    return {
        productRequisition,
        GetRequiProductContext,
        GetRequiProductByIdContext,
        PostCreateProductRequisitionContext,
        PutUpdateProductRequisitionContext,
        DeleteProductRequisitionContext
    };
};