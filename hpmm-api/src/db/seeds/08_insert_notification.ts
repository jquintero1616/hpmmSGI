import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1) Limpio la tabla
  await knex("notifications").del();

  // 2) Inserto 3 notificaciones, cada una con su id_user correspondiente
  await knex("notifications").insert([
    {
      id_noti: "aaaaaaaa-0000-0000-0000-000000000001",
      id_user: "33333333-3333-3333-3333-333333333333", // José Quintero
      mensaje:    "Bienvenido al sistema",
      tipo:    "Pendiente",
      estado:  true,
    },
    {
      id_noti: "aaaaaaaa-0000-0000-0000-000000000002",
      id_user: "77777777-7777-7777-7777-777777777777", // María López
      mensaje:    "Tu reporte está listo",
      tipo:    "Enviado",
      estado:  true,
    },
    {
      id_noti: "aaaaaaaa-0000-0000-0000-000000000003",
      id_user: "55555555-5555-5555-5555-555555555555", // Katia Vallecillo
      mensaje:    "Notificación marcada como leída",
      tipo:    "Leido",
      estado:  false,
    },
  ]);
}
