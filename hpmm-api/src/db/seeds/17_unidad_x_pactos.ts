import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  
  await knex("units_x_pacts").del();

 
  await knex("units_x_pacts").insert([
    {
      id_units_x_pacts: "11111111-2222-1111-1111-111111114444",
      id_units: "00000000-0000-0000-0000-000000000013",
      id_pacts: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      id_product: "11111111-6666-1111-1111-111111112222",
      cantidad: 1,
      estado: true,
     
    },
     {
      id_units_x_pacts: "11111111-2222-1111-1111-111111115555",
      id_units: "00000000-0000-0000-0000-000000000001",
      id_pacts: "6d5c4b3a-2f1e-0d9c-8b7a-6f5e4d3c2b1a",
      id_product: "33333333-8888-3333-3333-333333334444",
      cantidad: 1,
      estado: true,
     
    },
      {
      id_units_x_pacts: "11111111-2222-1111-1111-111111116666",
      id_units: "00000000-0000-0000-0000-000000000002",
      id_pacts: "12345678-9abc-def0-1234-56789abcdef0",
      id_product: "33333333-8888-3333-3333-333333334444",
      cantidad: 1,
      estado: true,
     
    },
  ]);
}
