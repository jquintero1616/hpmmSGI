import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  
  await knex("units_x_pacts").del();

 
  await knex("units_x_pacts").insert([
    {
      id_units: "00000000-0000-0000-0000-000000000013",
      id_pacts: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      id_subcategory: "22222222-7777-2222-2222-222222223333",
      estado: true,
     
    },
     {
      id_units: "00000000-0000-0000-0000-000000000001",
      id_pacts: "6d5c4b3a-2f1e-0d9c-8b7a-6f5e4d3c2b1a",
      id_subcategory: "33333333-8888-3333-3333-333333334444",
      estado: true,
     
    },
      {
      id_units: "00000000-0000-0000-0000-000000000002",
      id_pacts: "12345678-9abc-def0-1234-56789abcdef0",
      id_subcategory: "44444444-9999-4444-4444-444444445555",
      estado: true,
     
    },
  ]);
}
