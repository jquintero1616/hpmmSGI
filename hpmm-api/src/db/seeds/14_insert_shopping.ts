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
      cantidad_comprada: 10,
      precio_unitario: 100.05,
      ISV: false,
      tipo_compra: "Compra Directa",
      financiamiento: "Presupuesto Nacional",

      total: 1000.5,
      estado: true,
      cantidad_solicitada: 10,
      nombre_producto: "Paracetamol",
      id_product: "11111111-6666-1111-1111-111111112222",
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
      ISV: false,

      tipo_compra: "Licitacion",
      financiamiento: "Presupuesto Nacional",

      cantidad_comprada: 5,
      precio_unitario: 200.1,
      total: 1000.5,
      cantidad_solicitada: 5,
      estado: true,
      nombre_producto: "Guantes de Latex",
      id_product: "22222222-7777-2222-2222-222222223333",
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
      ISV: false,

      tipo_compra: "Licitacion",
      financiamiento: "Presupuesto Nacional",
      
      cantidad_comprada: 2,
      precio_unitario: 500.25,
      cantidad_solicitada: 2,
      total: 1000.5,
      estado: true,
      nombre_producto: "Termómetro Digital",
      id_product: "33333333-3333-3333-3333-333333334444",
    },
  ]);
}
