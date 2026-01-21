import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable("donantes", (table) => {
    table
      .uuid("id_donante")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"));

    table.string("nombre").notNullable();
    table
      .enu("tipo_donante", ["Persona", "Empresa", "ONG", "Gobierno", "Otro"])
      .notNullable()
      .defaultTo("Persona");
    table.string("numero_contacto");
    table.string("correo");
    table.text("direccion");
    table.string("rtn"); // Para empresas/organizaciones
    table.text("notas"); // Notas adicionales sobre el donante
    table.boolean("estado").notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("donantes");
}
