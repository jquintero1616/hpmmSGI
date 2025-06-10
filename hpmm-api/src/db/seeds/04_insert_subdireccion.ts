import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Borra subdireccion y cualquier FK que la apunte
  await knex("subdireccion").del();
  await knex("subdireccion").insert([
    {
      id_subdireccion: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      id_direction:    "ca112a2a-982c-467b-80c4-65163b6ddb6f",
      nombre:          "Subdirección de Gestión de la Información",
      estado:          true,
    },
    {
      id_subdireccion: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      id_direction:    "ca112a2a-982c-467b-80c4-65163b6ddb6f",
      nombre:          "Subdirección de Docencia e Investigación",
      estado:          true,
    },
    {
      id_subdireccion: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      id_direction:    "ca112a2a-982c-467b-80c4-65163b6ddb6f",
      nombre:          "Subdirección Asistencial",
      estado:          true,
    },
    {
      id_subdireccion: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",  
      id_direction:    "ca112a2a-982c-467b-80c4-65163b6ddb6f",
      nombre:          "Subdirección Gestión de Recursos",
      estado:          true,
    },
  ]);
}
