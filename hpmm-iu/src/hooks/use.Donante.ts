import { useContext } from "react";
import { DonanteContext } from "../contexts/Donante.context";

export const useDonante = () => {
  const context = useContext(DonanteContext);

  // Si el contexto no existe, retornar valores por defecto en lugar de lanzar error
  if (!context) {
    console.warn("useDonante debe ser utilizado dentro de un DonanteProvider");
    return {
      donantes: [],
      donantesActivos: [],
      GetDonantesContext: async () => {},
      GetDonantesActivosContext: async () => {},
      GetDonanteByIdContext: async () => undefined,
      SearchDonantesContext: async () => [],
      PostCreateDonanteContext: async () => {},
      PutUpdateDonanteContext: async () => {},
      DeleteDonanteContext: async () => {},
    };
  }

  const {
    donantes,
    donantesActivos,
    GetDonantesContext,
    GetDonantesActivosContext,
    GetDonanteByIdContext,
    SearchDonantesContext,
    PostCreateDonanteContext,
    PutUpdateDonanteContext,
    DeleteDonanteContext,
  } = context;

  return {
    donantes: donantes || [],
    donantesActivos: donantesActivos || [],
    GetDonantesContext,
    GetDonantesActivosContext,
    GetDonanteByIdContext,
    SearchDonantesContext,
    PostCreateDonanteContext,
    PutUpdateDonanteContext,
    DeleteDonanteContext,
  };
};
