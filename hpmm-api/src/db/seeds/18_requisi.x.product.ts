import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1) Limpiamos la tabla
  await knex("Requi_x_Product").del();

  // 2) Insertamos filas usando los id_requisi exactos de arriba
  await knex("Requi_x_Product").insert([
    {
      id_requisi: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      id_product: "11111111-6666-1111-1111-111111112222",
      cantidad: 10,
    },
    {
      id_requisi: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", // Cambiado a un ID existente
      id_product: "22222222-7777-2222-2222-222222223333",
      cantidad: 20,
    },
  ]);
}