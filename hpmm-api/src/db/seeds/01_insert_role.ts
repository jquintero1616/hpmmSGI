// src/db/seeds/01_insert_role.ts
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1) Borra roles y en cascada todas las filas de users que los referencien
  await knex.raw('TRUNCATE TABLE "roles" RESTART IDENTITY CASCADE');

  // 2) Inserta tus roles de ejemplo
  await knex("roles").insert([
    {
      id_rol:      "11111111-1111-1111-1111-111111111111",
      name:        "Administrador",
      descripcion: "Administrador del sistema",
      estado:      true,
    },
    {
      id_rol:      "22222222-2222-2222-2222-222222222222",
      name:        "Jefa Almacen",
      descripcion: "Jefa del área de almacén",
      estado:      true,
    },
    {
      id_rol:      "33333333-3333-3333-3333-333333333333",
      name:        "Tecnico Almacen",
      descripcion: "Personal operativo de almacén",
      estado:      true,
    },
    {
      id_rol:      "44444444-4444-4444-4444-444444444444",
      name:        "Super Admin",
      descripcion: "Acceso total al sistema",
      estado:      true,
    },
    {
      id_rol:      "55555555-5555-5555-5555-555555555555",
      name:        "Jefe de Logistica",
      descripcion: "Personal del Area de Logística",
      estado:      true,
    },
  ]);
}
