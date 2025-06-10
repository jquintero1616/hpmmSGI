import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable("users", (table) => {
    table.uuid("id_user").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("id_rol").notNullable();
    table.string("username").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").nullable();
    table.boolean("estado").notNullable().defaultTo(true);
    table.timestamps(true, true);

    table
      .foreign("id_rol")
      .references("id_rol")
      .inTable("roles")
      .onDelete("RESTRICT");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
