import { useContext } from "react";
import { SupplierContext } from "../contexts/Supplier.context";


export const useSupplier = () => {
    const {
        suppliers,
        GetSuppliersContext,
        GetSupplierByIdContext,
        PostCreateSupplierContext,
        PutUpdateSupplierContext,
        DeleteSupplierContext,
    } = useContext(SupplierContext);

    if (
        !suppliers ||
        !GetSuppliersContext ||
        !GetSupplierByIdContext ||
        !PostCreateSupplierContext ||
        !PutUpdateSupplierContext ||
        !DeleteSupplierContext
    ) {
        throw new Error("useSuppliers debe ser utilizado dentro de un SupplierProvider");
    }

    return {
        suppliers,
        GetSuppliersContext,
        GetSupplierByIdContext,
        PostCreateSupplierContext,
        PutUpdateSupplierContext,
        DeleteSupplierContext,
    };
};  