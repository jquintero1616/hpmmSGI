import { AxiosInstance  } from "axios";
import { notificationsInterface } from "../interfaces/Notifaciones.interface";


export const GetNotificacionesService = async (
    axiosPrivate: AxiosInstance
): Promise<notificationsInterface[] | null> => {
  try {
    const response = await axiosPrivate.get(`/noti`);
    return response.data.notis;
  } catch (error) {
    console.error("Error al recuperar las notificaciones", error);
    throw error;
  }
};

export const GetNotificacionByIdService = async (
  id_noti: string,
  axiosPrivate: AxiosInstance
): Promise<notificationsInterface | null> => {
  try {
    const response = await axiosPrivate.get(`/notifi/${id_noti}`);
    return response.data.noti;
  } catch (error) {
    console.error("Error al recuperar la notificación", error);
    throw error;
  }
};

export const PostNotificacionService = async (
  noti: notificationsInterface,
  axiosPrivate: AxiosInstance
): Promise<notificationsInterface> => {
  try {
    const response = await axiosPrivate.post(
      `/noti`,
      {
        mensaje: noti.mensaje,
        tipo: noti.tipo,
        estado: noti.estado,
        id_user: noti.id_user,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data.newNoti;
  } catch (error) {
    console.error("Error al crear la notificación", error);
    throw error;
  }
}

export const PutNotificacionService = async (
  id_noti: string,
  noti: notificationsInterface,
  axiosPrivate: AxiosInstance
): Promise<void> => {
   await axiosPrivate.put(
    `/noti/${id_noti}`,
    {
      mensaje: noti.mensaje,
      tipo: noti.tipo,
      estado: noti.estado,
      id_user: noti.id_user,
    },
    { headers: { "Content-Type": "application/json" } }
  );
}

export const DeleteNotificacionService = async (
  id_noti: string,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  try {
    await axiosPrivate.delete(`/noti/${id_noti}`);
  } catch (error) {
    console.error("Error al eliminar la notificación", error);
    throw error;
  }
}
