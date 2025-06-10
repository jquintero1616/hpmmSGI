// src/db/seeds/11_insert_category.ts
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1) Borra todas las categorías (y, por CASCADE, sus subcategorías)
  await knex("category").del();

  // 2) Inserta las categorías
  await knex("category").insert([
    {
      id_category: "11111111-1111-1111-1111-111111111111", 
      name:        "Alimentos",
      descripcion: "Alimentos",
      estado:      true,
    },
    {
      id_category: "22222222-2222-2222-2222-222222222222",
      name:        "Limpieza",
      descripcion: "Limpieza",
      estado:      true,
    },
    {
      id_category: "33333333-3333-3333-3333-333333333333",
      name:        "Papelería",
      descripcion: "Papelería",
      estado:      true,
    },
  ]);
}
