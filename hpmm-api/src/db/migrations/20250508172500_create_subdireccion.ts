import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable("subdireccion", table => {
    table.uuid("id_subdireccion").primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid("id_direction").notNullable();
    table.string("nombre").notNullable();
    table.boolean("estado").notNullable().defaultTo(true);
    table.timestamps(true, true);
    table.foreign("id_direction").references("id_direction").inTable("direction").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("subdireccion");
}