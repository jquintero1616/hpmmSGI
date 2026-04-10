import React, {createContext, useState, useEffect, useCallback} from 'react';
import {
    GetNotificacionesService,
    GetNotificacionByIdService,
    PostNotificacionService,
    PutNotificacionService,
    DeleteNotificacionService,
} from '../services/Notificacion.service';

import {
    NotificacionContextType,
    ProviderProps,
} from '../interfaces/Context.interface';
import { notificationsInterface } from '../interfaces/Notifaciones.interface';
import useAxiosPrivate from '../hooks/axiosPrivateInstance';
import { useAuth } from '../hooks/use.Auth';

export const NotificacionContext = createContext<NotificacionContextType>({
    notificaciones: [],
    GetNotificacionesContext: async () => [],
    GetNotificacionByIdContext: async () => undefined,
    PostNotificacionContext: async () => {},
    PutNotificacionContext: async () => {},
    DeleteNotificacionContext: async () => {},
});
export const NotificacionProvider: React.FC<ProviderProps> = ({ children }) => {
    const [notificaciones, setNotificaciones] = useState<notificationsInterface[]>([]);
    const axiosPrivate = useAxiosPrivate();
    const { isAuthenticated } = useAuth();

    const GetNotificacionesContext = useCallback(async (): Promise<notificationsInterface[] | null> => {
        if (!isAuthenticated) return null;
        try {
            const data = await GetNotificacionesService(axiosPrivate);
            if (data) {
                setNotificaciones(data);
            }
            return data;
        } catch (error) {
            // Solo loguear si no es un 401 (esos los maneja el interceptor)
            if ((error as any)?.response?.status !== 401) {
                console.error("Error al recuperar las notificaciones", error);
            }
            return null;
        }
    }, [axiosPrivate, isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            GetNotificacionesContext();
        }
    }, [isAuthenticated, GetNotificacionesContext]);

    // Polling: refrescar notificaciones cada 30 segundos
    useEffect(() => {
        if (!isAuthenticated) return;
        const interval = setInterval(() => {
            GetNotificacionesContext();
        }, 30000);
        return () => clearInterval(interval);
    }, [isAuthenticated, GetNotificacionesContext]);

    const GetNotificacionByIdContext = useCallback(async (id_noti: string): Promise<notificationsInterface | null> => {
        try {
            const notificacion = await GetNotificacionByIdService(id_noti, axiosPrivate);
            return notificacion;
        } catch (error) {
            console.error("Error al recuperar la notificación", error);
            return null;
        }
    }, [axiosPrivate]);

    const PostNotificacionContext = async (
        noti: notificationsInterface
    ): Promise<void> => {
        try {
            const newNoti = await PostNotificacionService(noti, axiosPrivate);
            setNotificaciones((prev) => [...prev, newNoti]);
        } catch (error) {
            console.error("Error al crear la notificación", error);
        }
    };

    const PutNotificacionContext = async (
        id_noti: string, noti: notificationsInterface
    ): Promise<void> => {
        try {
            await PutNotificacionService(id_noti, noti, axiosPrivate);
            
            setNotificaciones((prev) => {
                const updated = prev.map((n) => (n.id_noti === id_noti ? { ...n, ...noti } : n));
                return updated;
            });
        } catch (error) {
            console.error("Error al actualizar la notificación:", error);
        }
    };

    const DeleteNotificacionContext = async (id_noti: string): Promise<void> => {
        try {
            await DeleteNotificacionService(id_noti, axiosPrivate);
            setNotificaciones((prev) =>
                prev.filter((n) => n.id_noti !== id_noti)
            );
        } catch (error) {
            console.error("Error al eliminar la notificación", error);
            throw error;
        }
    }

    return (
        <NotificacionContext.Provider
            value={{
                notificaciones,
                GetNotificacionesContext,
                GetNotificacionByIdContext,
                PostNotificacionContext,
                PutNotificacionContext,
                DeleteNotificacionContext,
            }}
        >
            {children}
        </NotificacionContext.Provider>
    );
};
