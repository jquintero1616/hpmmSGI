import React, { createContext, useState, useEffect } from "react";
import {
    GetSuppliersService,
    GetSupplierByIdService,
    PostCreateSupplierService,
    PutUpdateSupplierService,
    DeleteSupplierService,
} from "../services/Supplier.service";
import { SupplierContextType, ProviderProps } from "../interfaces/Context.interface";

import { useAuth } from "../hooks/use.Auth";
import { suppliersInterface } from "../interfaces/supplier.interface";
import useAxiosPrivate from "../hooks/axiosPrivateInstance";

export const SupplierContext = createContext<SupplierContextType>({
    suppliers: [],
    GetSuppliersContext: async () => [],
    GetSupplierByIdContext: async () => undefined,
    PostCreateSupplierContext: async () => { },
    PutUpdateSupplierContext: async () => { },
    DeleteSupplierContext: async () => { },
});

export const SupplierProvider: React.FC<ProviderProps> = ({ children }) => {
    const [suppliers, setSuppliers] = useState<suppliersInterface[]>([]);
    const axiosPrivate = useAxiosPrivate();
    const { isAuthenticated } = useAuth();
    useEffect(() => {
        if (isAuthenticated) {
            GetSuppliersService(axiosPrivate)
                .then((data) => {
                    if (data !== null) {
                        setSuppliers(data);
                    } else {
                        console.error("Error al recuperar los proveedores");
                    }
                })
                .catch((error) => {
                    console.error("Error al recuperar los proveedores", error);
                });
        }
    }, [isAuthenticated]);

    const GetSuppliersContext = async (): Promise<suppliersInterface[] | null> => {
        try {
            const suppliers = await GetSuppliersService(axiosPrivate);
            if (suppliers !== null) {
                setSuppliers(suppliers);
            }
            return suppliers;
        } catch (error) {
            console.error("Error al recuperar los proveedores", error);
            return null;
        }
    };

    const GetSupplierByIdContext = async (id_supplier: string): Promise<suppliersInterface | undefined> => {
        try {
            const supplier = await GetSupplierByIdService(id_supplier, axiosPrivate);
            return supplier;
        } catch (error) {
            console.error("Error al recuperar el proveedor", error);
            return undefined;
        }
    };

    const PostCreateSupplierContext = async (supplier: suppliersInterface): Promise<void> => {
        try {
            const created = await PostCreateSupplierService(supplier, axiosPrivate);
            setSuppliers(prev => [created, ...prev]); // ahora created NO es undefined
        } catch (error) {
            console.error("Error al crear el proveedor", error);
            throw error;
        }
    };

    const PutUpdateSupplierContext = async (id_supplier: string, supplier: suppliersInterface): Promise<void> => {
        try {
            await PutUpdateSupplierService(id_supplier, supplier, axiosPrivate);
            setSuppliers((prev) =>
                prev.map((s) => (s.id_supplier === id_supplier ? { ...s, ...supplier } : s))
            );
        } catch (error) {
            console.error("Error al actualizar el proveedor", error);
            throw error;
        }
    };

    const DeleteSupplierContext = async (id_supplier: string): Promise<void> => {
        try {
            await DeleteSupplierService(id_supplier, axiosPrivate);
        } catch (error) {
            console.error("Error al eliminar el proveedor", error);
            throw error;
        }
    };

    return (
        <SupplierContext.Provider
            value={{
                suppliers,
                GetSuppliersContext,
                GetSupplierByIdContext,
                PostCreateSupplierContext,
                PutUpdateSupplierContext,
                DeleteSupplierContext,
            }}
        >
            {children}
        </SupplierContext.Provider>
    );
};