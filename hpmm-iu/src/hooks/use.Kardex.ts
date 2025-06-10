import { useContext } from "react";
import { KardexContext } from "../contexts/Kardex.context";

export const useKardex = () => {
    const {
        kardex,
        kardexDetail,
        GetKardexContext,
        GetKardexByIdContext,
        PostCreateKardexContext,
        PutUpdateKardexContext,
        DeleteKardexContext,
    } = useContext(KardexContext);

    if (
        !kardex ||
        !kardexDetail ||
        !GetKardexContext ||
        !GetKardexByIdContext ||
        !PostCreateKardexContext ||
        !PutUpdateKardexContext ||
        !DeleteKardexContext
    ) {
        throw new Error('useKardex debe ser utilizado dentro de un KardexProvider');
    }

    return {
        kardex,
        kardexDetail,
        GetKardexContext,
        GetKardexByIdContext,
        PostCreateKardexContext,
        PutUpdateKardexContext,
        DeleteKardexContext,
    };
};