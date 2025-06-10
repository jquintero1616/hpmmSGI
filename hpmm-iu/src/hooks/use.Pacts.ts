import { useContext } from "react";
import { PactContext } from "../contexts/Pacts.context";
export const usePacts = () => {
    const {
        pacts,
        GetPactsContext,
        GetPactByIdContext,
        PostCreatePactContext,
        PutUpdatePactContext,
        DeletePactContext,
    } = useContext(PactContext);

    if (
        !pacts ||
        !GetPactsContext ||
        !GetPactByIdContext ||
        !PostCreatePactContext ||
        !PutUpdatePactContext ||
        !DeletePactContext
    ) {
        throw new Error("UsePacts debe ser utilizado dentro de un PactProvider");
    }

    return {
        pacts,
        GetPactsContext,
        GetPactByIdContext,
        PostCreatePactContext,
        PutUpdatePactContext,
        DeletePactContext,
    };
};