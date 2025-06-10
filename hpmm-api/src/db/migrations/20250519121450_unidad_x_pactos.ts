// src/db/migrations/20250508173500_create_units_x_pacts.ts
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  return knex.schema.createTable("units_x_pacts", (table) => {
    table
      .uuid("id_units_x_pacts")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"));

    table.uuid("id_units").notNullable().index();
    table.uuid("id_pacts").notNullable().index();
    table.uuid("id_subcategory").notNullable().index();
    table.timestamps(true, true);

    table
      .foreign("id_units")
      .references("id_units")
      .inTable("units")
      .onDelete("CASCADE");
    table
      .foreign("id_pacts")
      .references("id_pacts")
      .inTable("pacts")
      .onDelete("CASCADE");
    table
      .foreign("id_subcategory")
      .references("id_subcategory")
      .inTable("subcategory")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("units_x_pacts");
}
