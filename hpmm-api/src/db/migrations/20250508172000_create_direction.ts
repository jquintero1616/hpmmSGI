import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable("direction", table => {
    table.uuid("id_direction").primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string("nombre").notNullable();
    table.boolean("estado").notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("direction");
}