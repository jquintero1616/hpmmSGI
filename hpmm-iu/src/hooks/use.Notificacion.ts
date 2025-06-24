import { useContext } from 'react';
import { NotificacionContext } from '../contexts/Notificacion.context';

export const useNotificacion = () => {
  const {
    notificaciones,
    GetNotificacionesContext,
    GetNotificacionByIdContext,
    PostNotificacionContext,
    PutNotificacionContext,
    DeleteNotificacionContext,
  } = useContext(NotificacionContext);

  if (
    !notificaciones ||
    !GetNotificacionesContext ||
    !GetNotificacionByIdContext ||
    !PostNotificacionContext ||
    !PutNotificacionContext ||
    !DeleteNotificacionContext
  ) {
    throw new Error('useNotificacion debe ser utilizado dentro de un NotificacionProvider');
  }

  return {
    notificaciones,
    GetNotificacionesContext,
    GetNotificacionByIdContext,
    PostNotificacionContext,
    PutNotificacionContext,
    DeleteNotificacionContext,
  };
};