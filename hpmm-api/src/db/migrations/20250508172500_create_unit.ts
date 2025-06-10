import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable("units", (table) => {
    table.uuid("id_units").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("id_subdireccion").notNullable();
    table.string("name").notNullable();
    table.boolean("estado").notNullable().defaultTo(true);
    table.timestamps(true, true);

    table
      .foreign("id_subdireccion")
      .references("id_subdireccion")
      .inTable("subdireccion")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("units");
}
