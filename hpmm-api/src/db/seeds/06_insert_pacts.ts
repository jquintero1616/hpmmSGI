// src/db/seeds/06_insert_pacts.ts
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1) Limpiar la tabla pacts para evitar duplicados
  await knex("pacts").del();

  // 2) Insertar pactos de ejemplo
  await knex("pacts").insert([
    {
      id_pacts: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      name:   "Pacto Diario",
      tipo:     "Diario",
      estado:   true,
    },
    {
      id_pacts: "6d5c4b3a-2f1e-0d9c-8b7a-6f5e4d3c2b1a",
      name:   "Pacto Quincenal",
      tipo:     "Quincenal",
      estado:   true,
    },
    {
      id_pacts: "abcdef12-3456-7890-abcd-ef1234567890",
      name:   "Pacto Mensual",
      tipo:     "Mensual",
      estado:   true,
    },
    {
      id_pacts: "12345678-9abc-def0-1234-56789abcdef0",
      name:   "Pacto Trimestral",
      tipo:     "Trimestral",
      estado:   true,
    },
  ]);
}
