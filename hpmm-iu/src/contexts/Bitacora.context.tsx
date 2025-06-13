import React, { createContext, useState, useEffect } from "react";



import {
    GetBitacorasService,
    GetBitacoraByIdService,
  
} from "../services/Bitacora.service";

import {
    BitacoraContextType,
    ProviderProps,
} from "../interfaces/Context.interface";
import { useAuth } from "../hooks/use.Auth";
import useAxiosPrivate from "../hooks/axiosPrivateInstance";
import { Bitacorainterface } from "../interfaces/Bitacora.interface";

export const BitacoraContext = createContext<BitacoraContextType>({
    bitacoras: [],
    GetBitacorasContext: async () => [],
    GetBitacoraByIdContext: async () => undefined,
});

export const BitacoraProvider: React.FC<ProviderProps> = ({ children }) => {
    const [bitacoras, setBitacoras] = useState<Bitacorainterface[]>([]);
    const axiosPrivate = useAxiosPrivate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            GetBitacorasContext()
                .then((data) => {
                    if (data !== null) {
                        setBitacoras(data);
                    } else {
                        console.error("Error al recuperar las bitácoras");
                    }
                })
                .catch((error) => {
                    console.error("Error al recuperar las bitácoras", error);
                });
        }
    }, [isAuthenticated]);

    const GetBitacoraByIdContext = async (
        id_bitacora: string
    ): Promise<Bitacorainterface | undefined> => {
        try {
            const bitacora = await GetBitacoraByIdService(id_bitacora, axiosPrivate);
            return bitacora;
        } catch (error) {
            console.error("Error al recuperar la bitácora", error);
            return undefined;
        }
    };

    const GetBitacorasContext = async (): Promise<Bitacorainterface[] | null> => {
        try {
            const bitacoras = await GetBitacorasService(axiosPrivate);
            if (bitacoras !== null) {
                setBitacoras(bitacoras);
            }
            return bitacoras;
        } catch (error) {
            console.error("Error al recuperar las bitácoras", error);
            return null;
        }
    };

    return (
        <BitacoraContext.Provider
            value={{
                bitacoras,
                GetBitacorasContext,
                GetBitacoraByIdContext,
            }}
        >
            {children}
        </BitacoraContext.Provider>
    );
};