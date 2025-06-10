import { useContext } from "react";
import { SubdireccionContext } from "../contexts/Subdireccion.context";

export const useSubdireccion = () => {
  const {
    subdireccion,
    GetSubdireccionesContext,
    GetSubdireccionByIdContext,
    PostCreateSubdireccionContext,
    PutUpdateSubdireccionContext,
    DeleteSubdireccionContext
  } = useContext(SubdireccionContext);

  if (
    !subdireccion ||
    !GetSubdireccionesContext ||
    !GetSubdireccionByIdContext ||
    !PostCreateSubdireccionContext ||
    !PutUpdateSubdireccionContext ||
    !DeleteSubdireccionContext
  ) {
    throw new Error(
      "useSubdireccion must be used within a SubdireccionProvider"
    );
  }

  return {
    subdireccion,
    GetSubdireccionesContext,
    GetSubdireccionByIdContext,
    PostCreateSubdireccionContext,
    PutUpdateSubdireccionContext,
    DeleteSubdireccionContext
  };
};


