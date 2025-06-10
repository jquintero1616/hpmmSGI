import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1) Limpiar la tabla
  await knex("direction").del();

  // 2) Insertar direcciones con los IDs que luego referenciará employes
  await knex("direction").insert([
    {
      id_direction: "ca112a2a-982c-467b-80c4-65163b6ddb6f",
      nombre:         "Dirección Ejecutiva",
      estado:       true,
    },
    
  ]);
}
