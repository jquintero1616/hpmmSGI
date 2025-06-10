import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1) Limpiamos la tabla
  await knex("solicitud_compras").del();

  // 2) Insertamos filas usando los id_requisi exactos de arriba
  await knex("solicitud_compras").insert([
    {
      id_scompra: "11111111-1111-1111-1111-111111111111",
      id_requisi: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      estado: "Pendiente",
    },
    {
      id_scompra: "22222222-2222-2222-2222-222222222222",
      id_requisi: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      estado: "Comprado",
    },
    {
      id_scompra: "33333333-3333-3333-3333-333333333333",
      id_requisi: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      estado: "Cancelada",
    },
  ]);
}
