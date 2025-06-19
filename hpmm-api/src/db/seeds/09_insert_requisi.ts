import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("requisitions").del();
  await knex("requisitions").insert([
    {
      id_requisi:  "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      id_employes: "11111111-aaaa-bbbb-cccc-111111111111", 
      fecha:       "2025-05-10",
      descripcion: "Descripción de la requisición 1",
      estado:      "Pendiente",
    },
    {
      id_requisi:  "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      id_employes: "22222222-bbbb-cccc-dddd-222222222222", 
      fecha:       "2025-05-11",
      descripcion: "Descripción de la requisición 2",
      estado:      "Aprobado",
    },
    {
      id_requisi:  "cccccccc-cccc-cccc-cccc-cccccccccccc",
      id_employes: "33333333-cccc-dddd-eeee-333333333333", 
      fecha:       "2025-05-12",
      descripcion: "Descripción de la requisición 3",
      estado:      "Rechazado", 
    },
    {
      id_requisi:  "dddddddd-dddd-dddd-dddd-dddddddddddd",
      id_employes: "33333333-cccc-dddd-eeee-333333333333", 
      fecha:       "2025-05-12",
      descripcion: "Descripción de la requisición 4",
      estado:      "Cancelado", 
    },
  ]);
}