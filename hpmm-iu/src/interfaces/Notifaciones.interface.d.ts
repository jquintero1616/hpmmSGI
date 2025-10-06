
export interface notificationsInterface {
  id_noti: string;
  id_user: string;
  mensaje: string;
  tipo: "Pendiente" | "Enviado" | "Leido" | "RecordarMasTarde";
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}
