import { Knex } from "knex";
import { randomUUID } from "crypto";

export async function seed(knex: Knex): Promise<void> {
  // Limpiar la tabla antes de insertar
  await knex("donantes").del();

  // Insertar donantes de ejemplo
  await knex("donantes").insert([
    {
      id_donante: randomUUID(),
      nombre: "Cruz Roja Hondureña",
      tipo_donante: "ONG",
      numero_contacto: "+504 2232-1234",
      correo: "contacto@cruzroja.hn",
      direccion: "Tegucigalpa, Honduras",
      rtn: "08019999123456",
      notas: "Donante frecuente de insumos médicos",
      estado: true,
    },
    {
      id_donante: randomUUID(),
      nombre: "Secretaría de Salud",
      tipo_donante: "Gobierno",
      numero_contacto: "+504 2222-5678",
      correo: "donaciones@salud.gob.hn",
      direccion: "Tegucigalpa, Honduras",
      rtn: "08019999000001",
      notas: "Donaciones gubernamentales",
      estado: true,
    },
    {
      id_donante: randomUUID(),
      nombre: "Laboratorios Finlay",
      tipo_donante: "Empresa",
      numero_contacto: "+504 2555-9999",
      correo: "donaciones@finlay.com",
      direccion: "San Pedro Sula, Honduras",
      rtn: "05019998765432",
      notas: "Donante de medicamentos",
      estado: true,
    },
    {
      id_donante: randomUUID(),
      nombre: "Juan Carlos Martínez",
      tipo_donante: "Persona",
      numero_contacto: "+504 9988-7766",
      correo: "jcmartinez@email.com",
      direccion: "Comayagüela, Honduras",
      notas: "Donante particular",
      estado: true,
    },
    {
      id_donante: randomUUID(),
      nombre: "UNICEF Honduras",
      tipo_donante: "ONG",
      numero_contacto: "+504 2231-0000",
      correo: "honduras@unicef.org",
      direccion: "Tegucigalpa, Honduras",
      rtn: "08019999111222",
      notas: "Organización internacional - Apoyo infantil",
      estado: true,
    },
  ]);
}
