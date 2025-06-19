import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1) Limpiar la tabla users
  await knex("users").del();

  // 2) Insertar usuarios cuyos id_user luego referenciará
  await knex("users").insert([
    {
      id_user: "33333333-3333-3333-3333-333333333333",
      username: "José Quintero",
      email: "jquintero@hpmm.com",
      password: "$2y$10$Y2mueDmhzRSKghDkwZlug.SSRF8wUmZ0sdp/uIUb0dw1y5BsMnQ12",
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
      email: "testingTecnicoAlmacen@hpmm.com",
      password: "$2b$10$KIhBbK2MU4k6Te2OVYf2bO6bo8CCofrKhxzJtz/62XpgR2C6k9feG",
      id_rol: "44444444-4444-4444-4444-444444444444",
      estado: true,
    },
    {
      id_user: "09847bb2-fbd9-410d-be44-630c36f3628d",
      username: "Testing Logistica",
      email: "testingLogistica@hpmm.com",
      password: "$2b$10$dZHIngWqVJKkSOhtsVjJa.ihs0.Pk.3ZVgP6TFUYZ3EtsxOnhe0rS",
      id_rol: "55555555-5555-5555-5555-555555555555",
      estado: true,
    },
  ]);
}
