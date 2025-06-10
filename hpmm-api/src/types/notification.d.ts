
export interface notifications {
  id_noti: string;
  id_user: string;
  mensaje: string;
  tipo: "Pendiente" | "Enviado" | "Leido";
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}
export interface NewNoti extends Omit<notifications, "id_noti"> {}