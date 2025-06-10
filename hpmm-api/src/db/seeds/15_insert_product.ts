// seeds/14_insert_product.ts   ← renómbralo si hace falta (ver paso 2)
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Limpia product, no Kardex
  await knex("product").del();

  // Inserta filas en la tabla product
  await knex("product").insert([
    {
      id_product: "11111111-6666-1111-1111-111111112222",
      id_subcategory: "22222222-7777-2222-2222-222222223333",
      nombre: "Producto 1",
      descripcion: "Descripción del producto 1",
      stock_actual: 100,
      stock_maximo: 150,
      fecha_vencimiento: "2025-05-10",
      numero_lote: "L001",
      estado: true
    },
    {
      id_product: "22222222-7777-2222-2222-222222223333",
      id_subcategory: "33333333-8888-3333-3333-333333334444",
      nombre: "Producto 2",
      descripcion: "Descripción del producto 2",
      stock_actual: 200,
      stock_maximo: 250,
      fecha_vencimiento: "2025-06-15",
      numero_lote: "L002",
      estado: true
    },
    {
      id_product: "33333333-8888-3333-3333-333333334444",
      id_subcategory: "44444444-9999-4444-4444-444444445555",
      nombre: "Producto 3",
      descripcion: "Descripción del producto 3",
      stock_actual: 300,
      stock_maximo: 350,
      fecha_vencimiento: "2025-07-20",
      numero_lote: "L003",
      estado: true
    },
  ]);
}
