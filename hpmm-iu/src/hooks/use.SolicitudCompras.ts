import { useContext } from "react";
import { SolicitudComprasContext } from "../contexts/SolicitudCompras.context";


export const useSolicitudCompras = () => {
  const {
    scompras,
    GetSolicitudesComprasContext,
    GetSolicitudCompraByIdContext,
    PostCreateSolicitudCompraContext,
    PutUpdateSolicitudCompraContext,
    DeleteSolicitudCompraContext
  } = useContext(SolicitudComprasContext);

  if (
    !scompras ||
    !GetSolicitudesComprasContext ||
    !GetSolicitudCompraByIdContext ||
    !PostCreateSolicitudCompraContext ||
    !PutUpdateSolicitudCompraContext ||
    !DeleteSolicitudCompraContext
  ) {
    throw new Error("useSolicitudCompras must be used within a SolicitudComprasProvider");
  }

  return {
    scompras,
    GetSolicitudesComprasContext,
    GetSolicitudCompraByIdContext,
    PostCreateSolicitudCompraContext,
    PutUpdateSolicitudCompraContext,
    DeleteSolicitudCompraContext
  };
};