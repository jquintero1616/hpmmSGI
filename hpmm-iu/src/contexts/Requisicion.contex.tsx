import React, { createContext, useEffect, useState } from "react";
import {
  GetRequisicionesService,
  GetRequisicionByIdService,
  PostRequisicionService,
  GetRequisiDetailsService,
  PutRequisicionService,
  DeleteRequisicionService,
} from "../services/Requisicion.service";

import {
  RequisicionContextType,
  ProviderProps,
} from "../interfaces/Context.interface";
import { useAuth } from "../hooks/use.Auth";
import useAxiosPrivate from "../hooks/axiosPrivateInstance";
import { RequisiInterface, RequisiDetail  } from "../interfaces/Requisition.interface";

export const RequisicionContext = createContext<RequisicionContextType>({
  requisitions: [],
  requisiDetail: [],
  GetRequisicionesContext: async () => [],
  GetRequisiDetailsContext: async () => [],
  GetRequisicionByIdContext: async () => undefined,
  PostCreateRequisicionContext: async () => {},
  PutUpdateRequisicionContext: async () => {},
  DeleteRequisicionContext: async () => {},
});

export const RequisicionProvider: React.FC<ProviderProps> = ({ children }) => {
  const [requisitions, setRequisitions] = useState<RequisiInterface[]>([]);
  const [requisiDetail, setRequisiDetail] = useState<RequisiDetail[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      GetRequisicionesContext()
        .then((data) => {
          if (data !== null) {
            setRequisitions(data);
          } else {
            console.error("Error al recuperar las requisiciones");
          }
        })
        .catch((error) => {
          console.error("Error al recuperar las requisiciones", error);
        });
    }
  }, [isAuthenticated]);

  useEffect(() => {
      if (isAuthenticated) {
        GetRequisiDetailsContext()
          .then((data) => {
            if (data !== null) {
              setRequisiDetail(data);
            } else {
              console.error("Error al recuperar el detalle de requisición");
            }
          })
          .catch((error) => {
            console.error("Error al recuperar el detalle de requisición", error);
          });
      }
    }, [isAuthenticated]);

  const GetRequisicionesContext = async (): Promise<
    RequisiInterface[] | null
  > => {
    try {
      const requisitions = await GetRequisicionesService(axiosPrivate);
      if (requisitions !== null) {
        setRequisitions(requisitions);
      }
      return requisitions;
    } catch (error) {
      console.error("Error al recuperar las requisiciones", error);
      return null;
    }
  };

  const GetRequisiDetailsContext = async (): Promise<RequisiDetail[] | null> => {
    try {
      const requisitionData = await GetRequisiDetailsService(axiosPrivate);
      return requisitionData;
    } catch (error) {
      console.error("Error al recuperar el detalle de requisición", error);
      return null;
    }
  }


  const GetRequisicionByIdContext = async (
    id_requisi: string
  ): Promise<RequisiInterface | undefined> => {
    try {
      const requisition = await GetRequisicionByIdService(
        id_requisi,
        axiosPrivate
      );
      return requisition;
    } catch (error) {
      console.error(
        `Error al recuperar la requisición con ID: ${id_requisi}`,
        error
      );
      return undefined;
    }
  };

  const PostCreateRequisicionContext = async (
    requisicion: RequisiInterface
  ): Promise<RequisiInterface> => {
    try {
      const newRequisition = await PostRequisicionService(
        requisicion,
        axiosPrivate
      );
      setRequisitions((prev) => [...prev, newRequisition]);
      return newRequisition;
    } catch (error) {
      console.error("Error al crear la requisición", error);
      throw error;
    }
  };

  const PutUpdateRequisicionContext = async (
    id_requisi: string,
    requisicion: RequisiInterface
  ): Promise<void> => {
    try {
      await PutRequisicionService(id_requisi, requisicion, axiosPrivate);
      setRequisitions((prev) =>
        prev.map((req) =>
          req.id_requisi === id_requisi ? { ...req, ...requisicion } : req
        )
      );
    } catch (error) {
      console.error(
        `Error al actualizar la requisición con ID: ${id_requisi}`,
        error
      );
    }
  };

  const DeleteRequisicionContext = async (
    id_requisi: string
  ): Promise<void> => {
    try {
      await DeleteRequisicionService(id_requisi, axiosPrivate);
      setRequisitions((prev) =>
        prev.filter((req) => req.id_requisi !== id_requisi)
      );
    } catch (error) {
      console.error(
        `Error al eliminar la requisición con ID: ${id_requisi}`,
        error
      );
    }
  };

  return (
    <RequisicionContext.Provider
      value={{
        requisitions,
        requisiDetail,
        GetRequisicionesContext,
        GetRequisicionByIdContext,
        PostCreateRequisicionContext,
        GetRequisiDetailsContext,
        PutUpdateRequisicionContext,
        DeleteRequisicionContext,
      }}
    >
      {children}
    </RequisicionContext.Provider>
  );
};
