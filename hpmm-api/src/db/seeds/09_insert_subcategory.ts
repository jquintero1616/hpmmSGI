// src/db/seeds/12_insert_subcategory.ts
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1) Borra subcategorías existentes
  await knex("subcategory").del();

  // 2) Inserta las subcategorías apuntando a los id_category anteriores
  await knex("subcategory").insert([
    {
      id_subcategory: "22222222-7777-2222-2222-222222223333",
      id_category:    "11111111-1111-1111-1111-111111111111", // Alimentos
      nombre:         "Frutas",
      estado:         true,
    },
    {
      id_subcategory: "33333333-8888-3333-3333-333333334444",
      id_category:    "11111111-1111-1111-1111-111111111111", // Alimentos
      nombre:         "Verduras",
      estado:         true,
    },
    {
      id_subcategory: "44444444-9999-4444-4444-444444445555",
      id_category:    "22222222-2222-2222-2222-222222222222", // Limpieza
      nombre:         "Detergentes",
      estado:         true,
    },
  ]);
}
