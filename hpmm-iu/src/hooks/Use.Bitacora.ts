import { useContext } from "react";
import { BitacoraContext } from "../contexts/Bitacora.context";


export const useBitacora = () => {
    const {
        bitacoras,
        GetBitacorasContext,
        GetBitacoraByIdContext,
    } = useContext(BitacoraContext);

    if (
        !bitacoras ||
        !GetBitacorasContext ||
        !GetBitacoraByIdContext
    ) {
        throw new Error("useBitacora must be used within a BitacoraProvider");
    }

    return {
        bitacoras,
        GetBitacorasContext,
        GetBitacoraByIdContext,
    };
}