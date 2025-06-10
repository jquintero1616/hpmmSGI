import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable("vendedor", (table) => {
    table
      .uuid("id_vendedor")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"));


    table.uuid("id_supplier").notNullable();
    table.string("nombre_contacto").notNullable();
    table.string("correo").notNullable();
    table.boolean("estado").notNullable().defaultTo(true);
    table.timestamps(true, true);

    table
      .foreign("id_supplier")
      .references("id_supplier")
      .inTable("suppliers")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("vendedor");
}
