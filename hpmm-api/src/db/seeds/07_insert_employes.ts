import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1) Limpiar la tabla
  await knex("employes").del();

  // 2) Insertar empleados de ejemplo
  await knex("employes").insert([
    {
      id_employes: "11111111-aaaa-bbbb-cccc-111111111111",
      id_user: "33333333-3333-3333-3333-333333333333", // existe en users
      id_units: "00000000-0000-0000-0000-000000000013", // del seed de units
      id_subdireccion: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", // del seed de subdireccion
      id_direction: "ca112a2a-982c-467b-80c4-65163b6ddb6f", // del seed de direction
      name: "José Quintero",
      email: "jquintero@tuempresa.com",
      telefono: "+50412345678",
      puesto: "Contador",
      estado: true,
    },
    {
      id_employes: "22222222-bbbb-cccc-dddd-222222222222",
      id_user: "77777777-7777-7777-7777-777777777777",
      id_units: "00000000-0000-0000-0000-000000000014",
      id_subdireccion: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      id_direction: "ca112a2a-982c-467b-80c4-65163b6ddb6f",
      name: "María López",
      email: "mlopez@tuempresa.com",
      telefono: "+50487654321",
      puesto: "Analista Financiero",
      estado: true,
    },
    {
      id_employes: "33333333-cccc-dddd-eeee-333333333333",
      id_user: "55555555-5555-5555-5555-555555555555",
      id_units: "00000000-0000-0000-0000-000000000015",
      id_subdireccion: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      id_direction: "ca112a2a-982c-467b-80c4-65163b6ddb6f",
      name: "Katia Vallecillo",
      email: "kvallecillo@hpmm.com",
      telefono: "+50423456789",
      puesto: "Coordinador de Ventas",
      estado: true,
    },
  ]);
}
