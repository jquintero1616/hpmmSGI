import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1) Limpiamos la tabla
  await knex("vendedor").del();

  // 2) Insertamos filas usando los id_requisi exactos de arriba
  await knex("vendedor").insert([
    {
      id_vendedor: "aaaaaaaa-aaaa-2222-aaaa-aaaaaaaaaaaa",
      id_supplier: "11111111-1111-1111-1111-111111133333",
      nombre_contacto: "Mario Aguilar",
      correo: "MarioAguilarlarachhn@example.com",
      identidad: "0801-1990-12345",
      telefono: "1234-5678",
      estado: true,
    
    },
    {
      id_vendedor: "bbbbbbbb-bbbb-2222-bbbb-bbbbbbbbbbbb",
      id_supplier: "11111111-1111-1111-1111-111111144444",
      nombre_contacto: "Alex Rodriguez",
      correo: "AlexRodriguez@example.com",
      identidad: "0801-1985-54321",
      telefono: "2345-6789",
      estado: true,
    },
    {
      id_vendedor: "cccccccc-cccc-3333-cccc-cccccccccccc",
      id_supplier: "11111111-1111-1111-1111-111111155555",
      nombre_contacto: "Juan Perez",
      correo: "Junperez@example.com",
      identidad: "0801-1975-67890",
      telefono: "3456-7890",
      estado: true,
    }
  ]);
}