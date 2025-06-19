import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1) Limpiamos la tabla
  await knex("shopping").del();

  // 2) Insertamos filas usando los id_requisi exactos de arriba
  await knex("shopping").insert([
    {
      id_shopping: "11111111-1111-1111-1111-111111113333",
      id_scompra: "11111111-1111-1111-1111-111111111111",
      id_vendedor: "aaaaaaaa-aaaa-2222-aaaa-aaaaaaaaaaaa",
      numero_cotizacion: "cotizacion-12345",
      numero_pedido: "pedido-12345",
      fecha_compra: "2025-05-10",
      shopping_order_id: "F.01",
      nombre_unidad: "HPMM",
      lugar_entrega: "Almacen Medicamentos HPMM",
      total: 1000.50,
      estado: true
    },
    {
      id_shopping: "11111111-1111-1111-1111-111111114444",
      id_scompra: "22222222-2222-2222-2222-222222222222",
      id_vendedor: "bbbbbbbb-bbbb-2222-bbbb-bbbbbbbbbbbb",
      fecha_compra: "2025-05-10",
      numero_cotizacion: "cotizacion-12346",
      numero_pedido: "pedido-12346",
      shopping_order_id: "F.01",
      nombre_unidad: "HPMM",
      lugar_entrega: "Almacen Materiales HPMMM",
      total: 1000.50,
      estado: true
    },
    {
      id_shopping: "11111111-1111-1111-1111-111111115555",
      id_scompra: "33333333-3333-3333-3333-333333333333",
      id_vendedor: "cccccccc-cccc-3333-cccc-cccccccccccc",
      fecha_compra: "2025-05-10",
      numero_cotizacion: "cotizacion-12347",
      numero_pedido: "pedido-12347",  
      shopping_order_id: "F.01",
      nombre_unidad: "HPMM",
      lugar_entrega: "Almacen Materiales HPMMM",
      total: 1000.50,
      estado: true
    }
  ]);
}
