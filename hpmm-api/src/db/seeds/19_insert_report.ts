// src/db/seeds/06_insert_pacts.ts
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1) Limpiar la tabla pacts para evitar duplicados
  await knex("reports").del();

  // 2) Insertar pactos de ejemplo
  await knex("reports").insert([
    {
      id_report: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      tipo:     "Producto Adquirido",
      periodo:  "Mensual",
      fecha:    "2023-01-01",
      estado:   true,
    },
    {
      id_report: "6d5c4b3a-2f1e-0d9c-8b7a-6f5e4d3c2b1a",
      tipo:     "Consumo",
      periodo:  "Semanal",
      fecha:    "2023-01-02",
      estado:   true,
    },
    {
      id_report: "abcdef12-3456-7890-abcd-ef1234567890",
      tipo:     "Pactos",
      periodo:  "Mensual",
      fecha:    "2023-01-03",
      estado:   true,
    },
    {
      id_report: "12345678-9abc-def0-1234-56789abcdef0",
      tipo:     "Vencimientos",
      periodo:  "Trimestral",
      fecha:    "2023-01-04",
      estado:   true,
    },
  ]);
}