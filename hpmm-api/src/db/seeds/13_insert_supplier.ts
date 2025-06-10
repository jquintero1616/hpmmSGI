import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // delete all suppliers
  await knex("suppliers").del();

  // insert suppliers
  await knex("suppliers").insert([
    {
      id_supplier: "11111111-1111-1111-1111-111111133333",
      nombre: "Distribuidora Medica",
      correo: "contacto@distribuidoramedica.hn",
      numero_contacto: "9376-5432",
      estado: true,
    },
    {
      id_supplier: "11111111-1111-1111-1111-111111144444",
      nombre: "Labsanangel",
      correo: "info@labsanangel.com",
      numero_contacto: "9476-5432",
      estado: true,
    },
    {
      id_supplier: "11111111-1111-1111-1111-111111155555",
      nombre: "SuministrosHN",
      correo: "ventas@suministroshn.hn",
      numero_contacto: "9676-5432",
      estado: true,
    },
  ]);
}