import React, {createContext, useState , useEffect} from 'react';
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

    useEffect(() => {
        if (isAuthenticated) {
            GetNotificacionesContext()
                .then((data) => {
                    if (data !== null) {
                        setNotificaciones(data);
                    } else {
                        console.error("Error al recuperar las notificaciones");
                    }
                })
                .catch((error) => {
                    console.error("Error al recuperar las notificaciones", error);
                });
        }
    }, [isAuthenticated]);

    const GetNotificacionesContext = async (): Promise<notificationsInterface[] | null> => {
        try {
            const notificaciones = await GetNotificacionesService(axiosPrivate);
            return notificaciones;
        } catch (error) {
            console.error("Error al recuperar las notificaciones", error);
            return null;
        }
    };

    const GetNotificacionByIdContext = async (id_noti: string): Promise<notificationsInterface | null> => {
        try {
            const notificacion = await GetNotificacionByIdService(id_noti, axiosPrivate);
            return notificacion;
        } catch (error) {
            console.error("Error al recuperar la notificación", error);
            return null;
        }
    };

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
            setNotificaciones((prev) =>
                prev.map((n) => (n.id_noti === id_noti ? { ...n, ...noti } : n))
            );
        } catch (error) {
            console.error("Error al actualizar la notificación", error);
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
