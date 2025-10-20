import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1) Limpiar la tabla users
  await knex("users").del();

  // 2) Insertar usuarios cuyos id_user luego referenciará
  await knex("users").insert([
    {
      id_user: "33333333-3333-3333-3333-333333333333",
      username: "José Quintero",
      email: "admin@hpmm.com",
      password: "$2b$10$P/sbNk7d0YDKqVmsRTJG.exufr0TyYJhSOeFRmZCekS2ZexoDgxq.",
      id_rol: "44444444-4444-4444-4444-444444444444",
      estado: true,
    },
    {
      id_user: "77777777-7777-7777-7777-777777777777",
      username: "Testing Administrador",
      email: "testingAdministrador@hpmm.com",
      password: "12345678",
      id_rol: "22222222-2222-2222-2222-222222222222",
      estado: true,
    },
    {
      id_user: "55555555-5555-5555-5555-555555555555",
      username: "Testing Jefa Almacen",
      email: "testingJefaAlmacen@hpmm.com",
      password: "12345678",
      id_rol: "11111111-1111-1111-1111-111111111111",
      estado: true,
    },
    {
      id_user: "88888888-8888-8888-8888-888888888888",
      username: "Testing Tecnico Almacen",
      email: "almacen@hpmm.com",
      password: "$2b$10$4HRub4o3MYyGKGmN5EUMvep9xbVdhaypQsMPf4MgnunvJ1fokITXy",
      id_rol: "44444444-4444-4444-4444-444444444444",
      estado: true,
    },
    {
      id_user: "09847bb2-fbd9-410d-be44-630c36f3628d",
      username: "Testing Logistica",
      email: "logistica@hpmm.com",
      password: "$10$coXZfC8.NNpbDUhU6Zs.puuzwTk78MH.s8pmo9OrzZnrOA6H6WFNm",
      id_rol: "55555555-5555-5555-5555-555555555555",
      estado: true,
    },

    {
      id_user: "0516e8d5-35cd-4a1b-b4f7-a4c8662945a2",
      username: "Usuario Test",
      email: "usuario@hpmm.com",
      password: "$2b$10$5bpSacP/3/7nS72mo/wTbeEKmHH4zOUzmh/EFGU5T1fiaM/dqiOMa",
      id_rol: "6fc3d25d-7976-4b20-a767-cb4b10706c0c",
      estado: true,
    }
  ]);
}
