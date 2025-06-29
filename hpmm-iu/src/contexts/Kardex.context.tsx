import React, { createContext, useEffect, useState } from "react";
import {
  GetKardexService,
  GetKardexByIdService,
  PostCreateKardexService,
  PutUpdateKardexService,
  DeleteKardexService,
  GetKardexDetailsService,
} from "../services/Kardex.service";
import {
  KardexContextType,
  ProviderProps,
} from "../interfaces/Context.interface";
import { useAuth } from "../hooks/use.Auth";
import { KardexDetail, kardexInterface } from "../interfaces/kardex.interface";
import useAxiosPrivate from "../hooks/axiosPrivateInstance";

export const KardexContext = createContext<KardexContextType>({
  kardex: [],
  kardexDetail: [],
  GetKardexContext: async () => [],
  GetKardexDetailsContext: async () => [],
  GetKardexByIdContext: async () => undefined,
  PostCreateKardexContext: async () => {},
  PutUpdateKardexContext: async () => {},
  DeleteKardexContext: async () => {},
});

export const KardexProvider: React.FC<ProviderProps> = ({ children }) => {
  const [kardex, setKardex] = useState<kardexInterface[]>([]);
  const [kardexDetail, setKardexDetail] = useState<KardexDetail[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      GetKardexContext();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      GetKardexDetailsContext();
    }
  }, [isAuthenticated]);

  const GetKardexContext = async (): Promise<kardexInterface[] | null> => {
    try {
      const kardexData = await GetKardexService(axiosPrivate);
      if (kardexData) setKardex(kardexData);
      return kardexData;
    } catch (error) {
      console.error("Error al recuperar el kardex", error);
      return null;
    }
  };

  const GetKardexDetailsContext = async (): Promise<KardexDetail[] | null> => {
    try {
      const kardexData = await GetKardexDetailsService(axiosPrivate);
      if (kardexData) setKardexDetail(kardexData);
      return kardexData;
    } catch (error) {
      console.error("Error al recuperar el detalle de kardex", error);
      return null;
    }
  };

  const GetKardexByIdContext = async (
    id_kardex: string
  ): Promise<kardexInterface | undefined> => {
    try {
      const kardexItem = await GetKardexByIdService(id_kardex, axiosPrivate);
      return kardexItem;
    } catch (error) {
      console.error("Error al recuperar el kardex por ID", error);
      return undefined;
    }
  };

  const PostCreateKardexContext = async (
    kardexItem: kardexInterface
  ): Promise<void> => {
    try {
      const created = await PostCreateKardexService(kardexItem, axiosPrivate);
      setKardex((prev) => [created, ...prev]);
      await GetKardexDetailsContext();
    } catch (error) {
      console.error("Error al crear el kardex", error);
      throw error;
    }
  };

  const PutUpdateKardexContext = async (
    id_kardex: string,
    kardexItem: kardexInterface
  ): Promise<void> => {
    try {
      await PutUpdateKardexService(id_kardex, kardexItem, axiosPrivate);
      setKardex((prev) =>
        prev.map((k) =>
          k.id_kardex === id_kardex ? { ...k, ...kardexItem } : k
        )
      );
      await GetKardexDetailsContext();
    } catch (error) {
      console.error("Error al actualizar el kardex", error);
      throw error;
    }
  };

  const DeleteKardexContext = async (id_kardex: string): Promise<void> => {
    try {
      await DeleteKardexService(id_kardex, axiosPrivate);
      setKardex((prev) => prev.filter((k) => k.id_kardex !== id_kardex));
      await GetKardexDetailsContext();
    } catch (error) {
      console.error("Error al eliminar el kardex", error);
      throw error;
    }
  };

  return (
    <KardexContext.Provider
      value={{
        kardex,
        kardexDetail,
        GetKardexContext,
        GetKardexDetailsContext,
        GetKardexByIdContext,
        PostCreateKardexContext,
        PutUpdateKardexContext,
        DeleteKardexContext,
      }}
    >
      {children}
    </KardexContext.Provider>
  );
};
