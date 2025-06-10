import { useContext } from "react";
import { VendedorContext } from "../contexts/Vendedor.context";

export const useVendedor = () => {
    const {
        vendedor,
        GetVendedorContext,
        GetVendedorByIdContext,
        PostCreateVendedorContext,
        PutUpdateVendedorContext,
        DeleteVendedorContext
    } = useContext(VendedorContext);

    if (
        !vendedor ||
        !GetVendedorContext ||
        !GetVendedorByIdContext ||
        !PostCreateVendedorContext ||
        !PutUpdateVendedorContext ||
        !DeleteVendedorContext
    ) {
        throw new Error(`useVendedor must be used within a VendedorProvider ${vendedor}`);
    }
    return {
        vendedor,
        GetVendedorContext,
        GetVendedorByIdContext,
        PostCreateVendedorContext,
        PutUpdateVendedorContext,
        DeleteVendedorContext
    };
}